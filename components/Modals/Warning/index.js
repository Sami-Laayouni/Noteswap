/* Modal used to share notes to other platforms*/

import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";

// Import from react
import { useContext, useState } from "react";
import { useRouter } from "next/router";

// Export the component
export default function Warning() {
  // Used to store whether the modal is opened or closed
  const { warning } = useContext(ModalContext);
  const [open, setOpen] = warning;
  const [school, setSchool] = useState(false);
  // Used to store the link of the notes that the user wants to share

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
      small="true"
    >
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
        }}
      >
        <h1>Registering From A School?</h1>
        <button
          style={{
            padding: "var(--button-default-padding)",
            borderRadius: "var(--button-default-border-radius)",
            border: "none",
            cursor: "pointer",
            backgroundColor: "var(--accent-color)",
            color: "white",
            display: "inline-block",
            marginLeft: "20px",
          }}
          onClick={() => {
            setSchool(true);
          }}
        >
          Yes
        </button>
        <button
          style={{
            padding: "var(--button-default-padding)",
            borderRadius: "var(--button-default-border-radius)",
            border: "none",
            cursor: "pointer",
            backgroundColor: "var(--accent-color)",
            color: "white",
            display: "inline-block",
            marginLeft: "20px",
          }}
          onClick={() => setOpen(false)}
        >
          No
        </button>
        <br></br>
        <br></br>
        {school && <img s height={300} src="/assets/images/screenshot.png" />}
      </div>
    </Modal>
  );
}
