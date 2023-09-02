import Modal from "../Modal";
import style from "./shareNotes.module.css";
import ModalContext from "../../context/ModalContext";
import { useContext } from "react";
import { MdContentCopy, MdEmail } from "react-icons/md";
import { BsTwitter } from "react-icons/bs";
import { FaRedditAlien, FaFacebookF } from "react-icons/fa";
import Link from "next/link";
export default function Share() {
  const { shareOpen, shareURL } = useContext(ModalContext);
  const [open, setOpen] = shareOpen;
  const [url, setUrl] = shareURL;
  if (!open) {
    return null;
  }
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title="Share notes"
      small="true"
    >
      <section className={style.input} style={{ marginTop: "20px" }}>
        <p style={{ paddingLeft: "10px" }}>{url}</p>
        <div
          style={{
            background: "var(--accent-color)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            navigator.clipboard.writeText(url);
          }}
        >
          <MdContentCopy color="white" />
        </div>
      </section>
      <p
        style={{
          fontStyle: "italic",
          textAlign: "center",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        - Or Share On -
      </p>
      <ul className={style.share}>
        <li style={{ background: "#26a7de", cursor: "pointer" }}>
          <Link
            href={`https://x.com/intent/tweet?text=Check out these notes on NoteSwap. ${url}`}
            target="_blank"
          >
            <BsTwitter color="white" size={30} />
          </Link>
        </li>
        <li style={{ background: "#FF4500", cursor: "pointer" }}>
          <Link
            href={`https://www.reddit.com/submit?title=Check out these notes on Noteswap.&url=${url}`}
            target="_blank"
          >
            <FaRedditAlien color="white" size={30} />
          </Link>
        </li>
        <li style={{ background: "#1877F2", cursor: "pointer" }}>
          <Link
            href={`https://www.facebook.com/?text=Check out these notes on NoteSwap. ${url}`}
            target="_blank"
          >
            <FaFacebookF color="white" size={30} />
          </Link>
        </li>
        <li style={{ background: "lightgreen", cursor: "pointer" }}>
          <Link
            href={`mailto:?subject=Noteswap Notes&body=Check out these notes on NoteSwap. ${url}`}
            target="_blank"
          >
            <MdEmail color="white" size={30} />
          </Link>
        </li>
      </ul>
    </Modal>
  );
}
