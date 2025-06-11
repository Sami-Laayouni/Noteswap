/* Modal used to share notes to other platforms*/

import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";

// Import from react
import { useContext } from "react";
import Link from "next/link";

// Export the component
export default function TakeSurveyModal() {
  // Used to store whether the modal is opened or closed
  const { takeSurvey } = useContext(ModalContext);
  const [open, setOpen] = takeSurvey;

  // Return the JSX
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title="Take our new survey!"
      small="true"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          Add your dream universities, goals, and extracurricular activity goals
          to make NoteSwap more personalized for you. NoteSwap will help you
          tailor your portfolio for your target university and improve your
          chances of standing out.
        </p>
        <Link href="/survey" onClick={() => setOpen(false)}>
          <button
            style={{
              background: "var(--accent-color)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Personalize NoteSwap For You
          </button>
        </Link>
        <p style={{ fontSize: "16px", marginBottom: "30px" }}>
          Already completed extracurricular outside of school? Submit them to be
          verified and included in your official transcript.
        </p>
        <Link href="/add_cs" onClick={() => setOpen(false)}>
          <button
            style={{
              background: "var(--accent-color)",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add External Extracurricular
          </button>
        </Link>
      </div>
    </Modal>
  );
}
