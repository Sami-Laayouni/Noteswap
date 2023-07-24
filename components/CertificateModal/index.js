import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import Modal from "../Modal";
import { useContext } from "react";
import ModalContext from "../../context/ModalContext";
import style from "./CertificateModal.module.css";

const Certificate = () => {
  const certificateRef = useRef(null);
  const [certificateUrl, setCertificateUrl] = useState(null);
  const { certificateModal } = useContext(ModalContext);
  const [userData, setUserData] = useState();
  const [open, setOpen] = certificateModal;

  const downloadCertificate = () => {
    html2canvas(certificateRef.current).then((canvas) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setCertificateUrl(url);

        // Trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = "NoteSwap_Certificate.png";
        link.click();
      });
    });
  };

  useEffect(() => {
    if (localStorage) {
      setUserData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Download Noteswap Certificate"
    >
      <div ref={certificateRef}>
        <h2>Certificate of Achievement</h2>
        <p>
          This is to certify that {userData?.first_name} {userData?.last_name}{" "}
          has successfully completed {userData?.community_minutes} hours of
          community service hours.
        </p>
      </div>

      <button className={style.button} onClick={downloadCertificate}>
        Download
      </button>
    </Modal>
  );
};

export default Certificate;
