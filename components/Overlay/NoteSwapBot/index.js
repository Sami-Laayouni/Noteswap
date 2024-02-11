/* Noteswap bot used to ask questions on the handbook and 
privacy policy */

import style from "./noteSwapBot.module.css";

// Import icons
import { BsChatLeft } from "react-icons/bs";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { CiMinimize1 } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";
import { BsFillChatSquareQuoteFill } from "react-icons/bs";

// Import from React
import { useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useTranslation } from "next-i18next";

const messages = [
  {
    role: "user",
    parts: `You are a easy to understand, clear, kind AI trained on a school's handbook. Your responses are based on the data provided in the handbook.  If they ask what you can do don't use the data and just answer how you can help them .If you can answer a question using the information from the handbook, you'll provide a relevant  response. If the question doesn't require data, you'll respond accordingly. If you're unable to infer an answer from the data, you'll say, "Sorry, I don't have that information."`,
  },
  {
    role: "model",
    parts: "Okay",
  },
];

/**
 * Noteswap Bot
 * @date 8/13/2023 - 5:12:42 PM
 *
 * @export
 * @return {*}
 */
export default function NoteSwapBot() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");

  function extractTextFromHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    return doc.body.textContent;
  }

  async function addMessage(message) {
    document.getElementById("input").value = "";

    setStarted(true);
    setLoading(true);
    document.getElementById("boxContainer").style.display = "block";
    document.getElementById("box").innerHTML += `<li>You: ${message}</li>`;
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
      const history = [
        {
          role: "user",
          parts: `You are an AI. You answer questions on these notes ${extractTextFromHTML(
            json.note[0].notes
          )}`,
        },
      ];

      const response = await fetch("/api/ai/handbook/llm/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: history,
          last_message: `This student is asking this question ${message} on the notes.`,
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
        ).innerHTML += `<li style="color: #40b385">Noteswap Bot: ${aiResponse}</li>`;
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
        }. Answer in an clear and understable manner or provide relevant information about this prompt (ONLY IF YOU BELIEVE IN NEEDS DATA IF THEY ARE ASKING YOU A QUESTION THAT DOESN'T REQUIRE DATA DON'T USE THE DATA): ${message}`;
      } else {
        last_message = message;
      }

      const response = await fetch("/api/ai/handbook/llm/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        ).innerHTML += `<li style="color: #40b385">Noteswap Bot: ${aiResponse}</li>`;
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
          {t("noteswap_bot")} {loading && t("thinking")}
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
              {t("start_conv")}
            </p>
            <i
              style={{
                fontFamily: "var(--manrope-font)",
                fontSize: "0.7rem",
              }}
            >
              {t("")}
              {t("note_notebot")}
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
              router.pathname.includes("boring")
                ? "Ex: What data do you collect?"
                : router.pathname.includes("note")
                ? "Ex: What are these notes about?"
                : "Ex: What is the school dress code?"
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
