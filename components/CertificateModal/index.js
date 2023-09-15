import { useState, useEffect } from "react";
import Modal from "../Modal";
import { useContext } from "react";
import ModalContext from "../../context/ModalContext";
import CertificateDownload from "../Certificate";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const Certificate = () => {
  const { certificateModal } = useContext(ModalContext);
  const [open, setOpen] = certificateModal;
  const [userData, setUserData] = useState();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (localStorage) {
      setUserData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);

  if (!open) {
    return null;
  }
  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Download Noteswap Certificates"
    >
      {current == 1 && (
        <CertificateDownload main={true} userData={userData} url={""} />
      )}
      {current != 1 && (
        <CertificateDownload
          main={false}
          userData={userData}
          url={userData?.certificates[current - 2]}
        />
      )}

      <p
        style={{
          fontFamily: "var(--manrope-font)",
          position: "absolute",
          bottom: "10px",
          left: "50%",
        }}
      >
        <AiOutlineLeft
          onClick={() => {
            if (current == 1) {
              setCurrent(1 + userData?.certificates.length);
            } else {
              setCurrent(current - 1);
            }
          }}
          style={{
            verticalAlign: "middle",
            cursor: "pointer",
            marginRight: "5px",
          }}
        />
        {current}/{1 + userData?.certificates.length}
        <AiOutlineRight
          onClick={() => {
            if (current == 1 + userData?.certificates.length) {
              setCurrent(1);
            } else {
              setCurrent(current + 1);
            }
          }}
          style={{
            verticalAlign: "middle",
            cursor: "pointer",
            marginLeft: "5px",
          }}
        />
      </p>
    </Modal>
  );
};

export default Certificate;
