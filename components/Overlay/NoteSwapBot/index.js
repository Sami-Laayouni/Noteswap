/* NoteSwap bot used to ask questions on the handbook and 
privacy policy */

import style from "./noteSwapBot.module.css";

// Import icons
import { BsChatLeft } from "react-icons/bs";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { CiMinimize1 } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";
import { BsFillChatSquareQuoteFill } from "react-icons/bs";

// Import from React
import { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { useTranslation } from "next-i18next";

/**
 * NoteSwap Bot
 * @date 8/13/2023 - 5:12:42 PM
 *
 * @export
 * @return {*}
 */
export default function NoteSwapBot() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const messages = [];

  // Fake analytics data
  const fakeStudents = [
    {
      name: "Sami",
      engagement: "low",
      extracurriculars: ["Sports"],
      sections: ["Sports"],
      gpa: 3.2,
      interests: ["Athletics", "Physical Education"],
    },
    {
      name: "Alex",
      engagement: "high",
      extracurriculars: ["STEM Club", "Math Olympiad", "Robotics"],
      sections: ["STEM", "Technology"],
      gpa: 3.9,
      interests: ["Computer Science", "Engineering"],
    },
    {
      name: "Jordan",
      engagement: "medium",
      extracurriculars: ["Student Government", "Debate Team"],
      sections: ["Politics", "Leadership"],
      gpa: 3.6,
      interests: ["Political Science", "Law"],
    },
    {
      name: "Casey",
      engagement: "low",
      extracurriculars: ["Art Club"],
      sections: ["Arts"],
      gpa: 3.1,
      interests: ["Fine Arts", "Design"],
    },
    {
      name: "Taylor",
      engagement: "high",
      extracurriculars: ["Science Fair", "Environmental Club", "Chemistry Lab"],
      sections: ["STEM", "Environment"],
      gpa: 3.8,
      interests: ["Environmental Science", "Chemistry"],
    },
  ];

  const engagementStats = {
    STEM: { high: 65, medium: 25, low: 10 },
    Politics: { high: 45, medium: 35, low: 20 },
    Sports: { high: 30, medium: 40, low: 30 },
    Arts: { high: 40, medium: 35, low: 25 },
    Environment: { high: 55, medium: 30, low: 15 },
  };

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem("userInfo")) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
      }
    }
  }, []);

  const router = useRouter();
  const { t } = useTranslation("common");

  function extractTextFromHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    return doc.body.textContent;
  }

  function generateChart(data) {
    const chartHTML = `
      <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <h4 style="margin: 0 0 10px 0; color: #333;">Extracurricular Engagement by Section</h4>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${Object.entries(data)
            .map(
              ([section, stats]) => `
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="width: 80px; font-size: 12px; color: #666;">${section}</span>
              <div style="flex: 1; background: #f0f0f0; border-radius: 4px; height: 20px; position: relative; overflow: hidden;">
                <div style="background: lightgreen; height: 100%; width: ${stats.high}%; float: left;"></div>
                <div style="background: orange; height: 100%; width: ${stats.medium}%; float: left;"></div>
                <div style="background: red; height: 100%; width: ${stats.low}%; float: left;"></div>
              </div>
              <span style="font-size: 10px; color: #666;">H:${stats.high}% M:${stats.medium}% L:${stats.low}%</span>
            </div>
          `
            )
            .join("")}
        </div>
        <div style="margin-top: 10px; font-size: 10px; color: #666;">
          <span style="color: lightgreen;">■ High</span>
          <span style="color: orange; margin-left: 10px;">■ Medium</span>
          <span style="color: red; margin-left: 10px;">■ Low</span>
        </div>
      </div>
    `;
    return chartHTML;
  }

  function getStudentRecommendations(studentName) {
    const student = fakeStudents.find(
      (s) => s.name.toLowerCase() === studentName.toLowerCase()
    );
    if (!student) return "Student not found in our database.";

    const recommendations = {
      Sami: [
        "Increase recommendation priority for sports events",
        "Decrease visibility of non-sports extracurriculars",
        "Highlight leadership-based opportunities (e.g., team captain roles)",
        "Show more content related to sports scholarships and athletic programs",
        "Reduce club notifications not related to athletics",
        "Automatically tag this student for physical education initiatives",
      ],
      Alex: [
        "Continue STEM leadership roles",
        "Consider research internships",
        "Apply for summer STEM programs",
        "Mentor younger students in STEM subjects",
      ],
      Jordan: [
        "Run for higher student government positions",
        "Start a political awareness club",
        "Attend local government meetings",
        "Consider Model UN participation",
      ],
      Casey: [
        "Expand into digital arts and design",
        "Enter art competitions",
        "Consider art therapy or teaching",
        "Build an online portfolio",
      ],
      Taylor: [
        "Pursue research opportunities",
        "Apply for science internships",
        "Consider environmental advocacy roles",
        "Document research projects on NoteSwap",
      ],
    };

    return (
      recommendations[student.name] || [
        "Continue current activities",
        "Explore new interests",
        "Build leadership skills",
      ]
    );
  }

  async function handleAnalyticsQuestion(message) {
    const lowerMessage = message.toLowerCase();

    // First question type: Show fake student data
    if (
      lowerMessage.includes("student") &&
      lowerMessage.includes("struggling")
    ) {
      const student = fakeStudents.find((s) => s.engagement === "low");
      return `Here's a student with low extracurricular engagement:

${student.name}
- Engagement Level: ${student.engagement.toUpperCase()}
- Current Activities: ${student.extracurriculars.join(", ")}
- Focus Areas: ${student.sections.join(", ")}
- Interests: ${student.interests.join(", ")}

${
  student.name
} shows potential but needs more diverse extracurricular involvement to strengthen their college applications.`;
    }

    // Second question type: Generate chart
    if (
      lowerMessage.includes("chart") ||
      lowerMessage.includes("graph") ||
      lowerMessage.includes("data") ||
      lowerMessage.includes("engagement")
    ) {
      const chartHTML = generateChart(engagementStats);
      return `
      ✨ Generating smart insights... ✨ <br/><br/>
      ${chartHTML}<br/>
      📊 <b>Analysis:</b><br/>
      - <b>STEM</b> and <b>Environment</b> lead with highest high-level engagement.<br/>
      - <b>Sports</b> and <b>Arts</b> have more medium to low engagement — room for growth.<br/>
      - Use this data to target support for under-engaged students or promote balance across sections.
      `;
    }

    // Third question type: Recommendations

    function applyRecommendation(studentName, recommendation) {
      alert("Interevention applied: " + recommendation);
    }

    if (
      lowerMessage.includes("recommend") ||
      lowerMessage.includes("suggestion") ||
      lowerMessage.includes("improve")
    ) {
      const studentName = "Sami"; // You can dynamically extract this later
      const recs = getStudentRecommendations(studentName); // Returns an array of strings

      return `
        <div>
          <h3>Recommendations for ${studentName}:</h3>
          <div>
            ${recs
              .map(
                (rec, index) => `
                <button
                  onclick="alert('${rec.replace(/'/g, "\\'")}')"
                  style="margin: 5px; padding: 8px 12px; border-radius: 8px; background-color: var(--accent-color); color: white; border: none; cursor: pointer;"
                >
                  ${rec}
                </button>
              `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    // Fallback response if no specific question type matched
    // Default analytics response
    return `Hello, how can I assist you with analytics? You can ask about student engagement, view charts, or get personalized recommendations for improving extracurricular activities.`;
  }

  async function addMessage(message) {
    document.getElementById("input").value = "";

    setStarted(true);
    setLoading(true);
    document.getElementById("boxContainer").style.display = "block";
    document.getElementById("box").innerHTML += `<li>You: ${message}</li>`;

    // Check if we're on analytics page
    if (router.pathname.includes("analytics")) {
      setLoading(true);

      // Add smart typing delay
      box.innerHTML += `<li id="bot-thinking"><div class="${style.loader}"></div></li>`;

      // Simulate loading time for smarter feel
      await new Promise((res) => setTimeout(res, 1000 + Math.random() * 1000));

      const aiResponse = await handleAnalyticsQuestion(message);

      document.getElementById("bot-thinking").remove();

      box.innerHTML += `<li style="color: #40b385">NoteSwap Bot: ${aiResponse}</li>`;
      setLoading(false);
      return;
    }

    if (router.pathname.includes("note")) {
      const noteId = router.query.id;

      // Get content of single note
      const res = await fetch("/api/notes/get_single_note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: noteId,
        }),
      });
      const json = await res.json();

      // History to send to AI
      const history = [];

      const response = await fetch("/api/ai/handbook/llm/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system: `You are a NoteSwap AI. You answer questions on these student notes. DONT USE MARKDOWN AT ALL: ${extractTextFromHTML(
            json.note[0].notes
          )}`,
          history: history,
          last_message: `This student is asking this question ${message} on the notes. DONT USE MARKDOWN AT ALL`,
        }),
      });

      if (response.status == 200) {
        messages.push({
          role: "user",
          parts: `This student is asking this question ${message} on the notes.`,
        });
        const aiResponse = await response.text();
        messages.push({
          role: "model",
          parts: aiResponse,
        });
        document.getElementById(
          "box"
        ).innerHTML += `<li style="color: #40b385">NoteSwap Bot: ${aiResponse}</li>`;
      } else {
        messages.push({
          role: "user",
          parts: `This student is asking this question ${message} on the notes.`,
        });
        messages.push({
          role: "model",
          parts: `An error has occured.`,
        });
        document.getElementById(
          "box"
        ).innerHTML += `<li style="color: red">An error has occured</li>`;
      }
      setLoading(false);
    } else {
      // Student is asking a question about handbook or privacy policy
      const link = router.pathname.includes("boring") ? "_privacy" : "";
      const data = await fetch(
        `/api/ai/handbook/vector/semantic_search${link}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: message,
            school_id: JSON.parse(localStorage.getItem("userInfo")).schoolId,
          }),
        }
      );
      const dataResponse = await data.json();
      const match = dataResponse;
      let last_message;
      if (dataResponse.length > 0) {
        last_message = `Using this data from the ${
          router.pathname.includes("boring") ? "privacy policy" : "handbook"
        }: ${
          match[0].text
        }. Here is the user's input, make the output short and don't use any markdown ${message}`;
      } else {
        last_message = message;
      }

      const response = await fetch("/api/ai/handbook/llm/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system: `You have two roles:

1) You are NoteSwap's AI trained on the school's handbook.

2) You act as a personalized friendly guidance counselor helping students get into their dream universities through extracurriculars.

You are currently helping a student named ${
            user?.first_name
          }, who is working on these extracurriculars: ${JSON.stringify(
            user?.breakdown
          )}, and aiming to get into these universities: ${JSON.stringify(
            user?.universities
          )}.

Your job is to:

Help them complete their current extracurriculars efficiently.

Recommend new extracurriculars on NoteSwap (e.g., typing notes, tutoring, exploring internships or opportunities).

Suggest activities tailored to the student's profile and target universities.

Let them know they can download their transcript and resume from NoteSwap.

Important:

Do not use markdown.

Keep your responses short, actionable, and personalized.`,
          history: messages,
          last_message: last_message,
        }),
      });

      if (response.status == 200) {
        const aiResponse = await response.text();
        messages.push({
          role: "user",
          parts: last_message,
        });
        messages.push({
          role: "model",
          parts: aiResponse,
        });
        document.getElementById(
          "box"
        ).innerHTML += `<li style="color: #40b385">NoteSwap Bot: ${aiResponse}</li>`;
      } else {
        document.getElementById(
          "box"
        ).innerHTML += `<li style="color: red">An error has occured</li>`;
      }
      setLoading(false);
    }
  }

  return (
    <>
      <section
        id="chatBox"
        style={{ display: "none" }}
        className={style.chatbox}
      >
        <section className={style.header}>
          NoteBot {loading && "Thinking..."}
          <AiOutlineExpandAlt
            size={25}
            id="expand"
            style={{
              position: "absolute",
              top: "20px",
              right: "15px",
              cursor: "pointer",
            }}
            onClick={() => {
              document.getElementById("chatBox").style.width = "90%";
              document.getElementById("chatBox").style.height = "80%";

              document.getElementById("expand").style.display = "none";
              document.getElementById("minimize").style.display = "block";
            }}
          />
          <CiMinimize1
            size={25}
            id="minimize"
            style={{
              position: "absolute",
              top: "20px",
              right: "15px",
              cursor: "pointer",
              display: "none",
            }}
            onClick={() => {
              document.getElementById("chatBox").style.width = "353px";
              document.getElementById("chatBox").style.height = "400px";

              document.getElementById("expand").style.display = "block";
              document.getElementById("minimize").style.display = "none";
            }}
          />
        </section>

        <section
          style={{ display: "none" }}
          id="boxContainer"
          className={style.box}
        >
          <ul id="box"></ul>
        </section>

        {!started && (
          <section
            style={{
              display: "flex",
              justifyparts: "center",
              alignItems: "center",
              textAlign: "center",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              paddingTop: "40px",
              paddingLeft: "40px",
              paddingRight: "40px",
            }}
          >
            <BsFillChatSquareQuoteFill color="#40b385" size={50} />
            <p
              style={{
                fontFamily: "var(--manrope-font)",
                fontSize: "1.2rem",
              }}
            >
              Start a conversation with the NoteSwap Bot
            </p>
            <i
              style={{
                fontFamily: "var(--manrope-font)",
                fontSize: "0.7rem",
              }}
            >
              {t("")}
              Note: The NoteSwap Bot does not reflect the methodologies or ideas
              of NoteSwap.
            </i>
          </section>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addMessage(document.getElementById("input").value);
          }}
          className={style.input}
        >
          <input
            id="input"
            placeholder={`${
              router.pathname.includes("analytics")
                ? "Ex: Show me students with low engagement"
                : router.pathname.includes("boring")
                ? "Ex: What data do you collect?"
                : router.pathname.includes("note")
                ? "Ex: What are these notes about?"
                : "Ex: What extracurricular should I do?"
            }`}
            maxLength={300}
            minLength={2}
            disabled={loading}
            required
          />
          <button
            style={{ border: "none", background: "white", cursor: "pointer" }}
            type="submit"
          >
            <VscSend color="grey" size={23} />
          </button>
        </form>
      </section>
      <section
        className={style.container}
        onClick={() => {
          if (
            document.getElementById("chatBox").style.display == "none" ||
            !document.getElementById("chatBox").style.display
          ) {
            document.getElementById("chatBox").style.display = "grid";
          } else {
            document.getElementById("chatBox").style.display = "none";
          }
        }}
      >
        <BsChatLeft color="white" size={25} className={style.container_image} />
      </section>
    </>
  );
}
