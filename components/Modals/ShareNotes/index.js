/* Modal used to share notes to other platforms*/

import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";

// Import from react
import { useContext } from "react";
import Link from "next/link";

// Import icons
import { MdContentCopy, MdEmail } from "react-icons/md";
import { BsTwitter } from "react-icons/bs";
import { FaRedditAlien, FaFacebookF } from "react-icons/fa";

// Import styles
import style from "./shareNotes.module.css";

// Export the component
export default function Share() {
  // Used to store whether the modal is opened or closed
  const { shareOpen, shareURL } = useContext(ModalContext);
  const [open, setOpen] = shareOpen;
  // Used to store the link of the notes that the user wants to share
  const [url, setUrl] = shareURL;
  // Return nothing if the Modal is not opened
  if (!open) {
    return null;
  }

  // Return the JSX
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title="Share notes"
      small="true"
    >
      {/* Input field to copy the url */}
      <section className={style.input} style={{ marginTop: "20px" }}>
        <p
          style={{
            paddingLeft: "10px",
            textOverflow: "ellipsis",
            width: "100%",
            maxWidth: "70vw",
          }}
        >
          {url}
        </p>
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
        {/* Share on Twitter/X */}
        <li style={{ background: "#26a7de", cursor: "pointer" }}>
          <Link
            href={`https://x.com/intent/tweet?text=Check out these notes on NoteSwap. ${url}`}
            target="_blank"
          >
            <BsTwitter color="white" size={30} />
          </Link>
        </li>
        {/* Share on Reddit*/}
        <li style={{ background: "#FF4500", cursor: "pointer" }}>
          <Link
            href={`https://www.reddit.com/submit?title=Check out these notes on Noteswap.&url=${url}`}
            target="_blank"
          >
            <FaRedditAlien color="white" size={30} />
          </Link>
        </li>
        {/* Share on Facebook*/}
        <li style={{ background: "#1877F2", cursor: "pointer" }}>
          <Link
            href={`https://www.facebook.com/?text=Check out these notes on NoteSwap. ${url}`}
            target="_blank"
          >
            <FaFacebookF color="white" size={30} />
          </Link>
        </li>
        {/* Share by Email*/}
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
