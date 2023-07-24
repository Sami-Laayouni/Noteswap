import style from "./noteSwapBot.module.css";
import { BsChatLeft } from "react-icons/bs";

export default function NoteSwapBot() {
  return (
    <>
      <section className={style.container}>
        <chat
          id="chatBox"
          style={{ display: "none" }}
          className={style.chatbox}
        >
          <section className={style.header}>NoteSwap Bot</section>
          <section className={style.box}></section>
        </chat>
        <BsChatLeft
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
          color="white"
          size={25}
          className={style.container_image}
        />
      </section>
    </>
  );
}
