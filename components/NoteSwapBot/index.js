import style from "./noteSwapBot.module.css";
import { BsChatLeft } from "react-icons/bs";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { CiMinimize1 } from "react-icons/ci";

/**
 * Noteswap Bot
 * @date 8/13/2023 - 5:12:42 PM
 *
 * @export
 * @return {*}
 */
export default function NoteSwapBot() {
  return (
    <>
      <chat id="chatBox" style={{ display: "none" }} className={style.chatbox}>
        <section className={style.header}>
          NoteSwap Bot
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
        <section className={style.box}></section>
        <form className={style.input}>
          <input placeholder="Ex: What is the school dress code?" required />
          <button type="submit">Send</button>
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
