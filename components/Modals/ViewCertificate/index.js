/* Modal used to share notes to other platforms*/

import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";

// Import from react
import { useContext } from "react";

// Import styles
import style from "./certificate.module.css";

// Export the component
export default function ViewCertificate({ type }) {
  // Used to store whether the modal is opened or closed
  const { certificateShow, certificateData } = useContext(ModalContext);
  const [open, setOpen] = certificateShow;
  // Used to store the link of the notes that the user wants to share
  const [data, setData] = certificateData;
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
      title={"View Student's Certificate"}
      small="true"
    >
      <img
        style={{ width: "750px", height: "auto" }}
        src={data.certificateUrl}
        alt="Certificate Url"
      ></img>
    </Modal>
  );
}
