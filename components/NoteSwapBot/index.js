import style from "./noteSwapBot.module.css";
import { BsChatLeft } from "react-icons/bs";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { CiMinimize1 } from "react-icons/ci";
import { VscSend } from "react-icons/vsc";
import { useState } from "react";
import { BsFillChatSquareQuoteFill } from "react-icons/bs";
import { useRouter } from "next/dist/client/router";
const messages = [
  {
    role: "system",
    content: `You are a easy to understand, clear, kind AI trained on a school's handbook. Your responses are based on the data provided in the handbook.  If they ask what you can do don't use the data and just answer how you can help them .If you can answer a question using the information from the handbook, you'll provide a relevant  response. If the question doesn't require data, you'll respond accordingly. If you're unable to infer an answer from the data, you'll say, "Sorry, I don't have that information."`,
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
      const messagei = [
        {
          role: "system",
          content: `You are an AI. You answer questions on these notes ${extractTextFromHTML(
            json.note[0].notes
          )}`,
        },
      ];
      messagei.push({
        role: "user",
        content: `This student is asking this question ${message} on the notes.`,
      });
      const response = await fetch("/api/ai/handbook/llm/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagei,
        }),
      });

      if (response.status == 200) {
        const aiResponse = await response.text();
        messages.push({
          role: "assistant",
          content: aiResponse,
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
    } else {
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
          }),
        }
      );
      const dataResponse = await data.json();
      const match = dataResponse.matches[0].metadata.paragraph;
      if (dataResponse.matches[0].score >= 0.76) {
        messages.push({
          role: "user",
          content: `Using this data from the ${
            router.pathname.includes("boring") ? "privacy policy" : "handbook"
          }: ${match}. Answer in an clear and understable manner or provide relevant information about this prompt (ONLY IF YOU BELIEVE IN NEEDS DATA IF THEY ARE ASKING YOU A QUESTION THAT DOESN'T REQUIRE DATA DON'T USE THE DATA): ${message}`,
        });
      } else {
        messages.push({
          role: "user",
          content: `${message}`,
        });
      }

      const response = await fetch("/api/ai/handbook/llm/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
        }),
      });

      if (response.status == 200) {
        const aiResponse = await response.text();
        messages.push({
          role: "assistant",
          content: aiResponse,
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
      <chat id="chatBox" style={{ display: "none" }} className={style.chatbox}>
        <section className={style.header}>
          NoteSwap Bot {loading && "(Thinking...)"}
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
              justifyContent: "center",
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
              Start a conversation with the Noteswap Bot
            </p>
            <i
              style={{
                fontFamily: "var(--manrope-font)",
                fontSize: "0.7rem",
              }}
            >
              Note: The Noteswap Bot does not reflect the methodologies or ideas
              of Noteswap.
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
      </chat>
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
