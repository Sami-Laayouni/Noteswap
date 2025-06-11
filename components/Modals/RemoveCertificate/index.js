/* Modal used to share notes to other platforms*/

import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";

// Import from react
import { useContext } from "react";

// Export the component
export default function RemoveCertificate({ type }) {
  // Used to store whether the modal is opened or closed
  const { removeCertificate } = useContext(ModalContext);
  const [open, setOpen] = removeCertificate;
  // Used to store the link of the notes that the user wants to share
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
      title={`Remove an Extracurricular Activity from Student&apos;s Transcript`}
      small="true"
    >
      <p>
        Note the extracurricular may still appear on a personal student&apos;s
        profile, however it will not be included in the official school
        transcript.{" "}
      </p>
      <textarea
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "0.875rem",
          minHeight: "200px",
          resize: "none",
        }}
        placeholder="Indicate the reason you do not want to include the following extracurricular. "
      />
      <button
        style={{
          background: "var(--accent-color)",
          color: "white",
          borderRadius: "3px",
          outline: "none",
          border: "none",
          padding: "0.7rem 1.5rem",
          cursor: "pointer",
        }}
        onClick={() => {
          alert("Extracurricular activity removed from transcript.");
        }}
      >
        Submit
      </button>
    </Modal>
  );
}
