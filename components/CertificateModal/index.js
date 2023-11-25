import { useState, useEffect } from "react";
import Modal from "../Modal";
import { useContext } from "react";
import ModalContext from "../../context/ModalContext";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import Docxtemplater from "docxtemplater";

const Certificate = () => {
  const { certificateModal } = useContext(ModalContext);
  const [open, setOpen] = certificateModal;
  const [userData, setUserData] = useState([]);
  const [schoolData, setSchoolDate] = useState([]);

  async function fetchSchoolData(id) {
    const data = await fetch("/api/schools/get_single_school", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    setSchoolDate(await data.json());
  }

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setUserData(JSON.parse(localStorage.getItem("userInfo")));
      fetchSchoolData(JSON.parse(localStorage.getItem("userInfo")).schoolId);
    }
  }, []);
  function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
  }

  const computeSHA256 = async (base64) => {
    const binaryData = atob(base64.split(",")[1]);
    const binaryArray = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      binaryArray[i] = binaryData.charCodeAt(i);
    }

    const cryptoSubtle = window.crypto.subtle;
    const hashBuffer = await cryptoSubtle.digest("SHA-256", binaryArray);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleDownload = () => {
    loadFile(
      `${process.env.NEXT_PUBLIC_URL}assets/pdf/NoteSwap_Transcript.docx`,
      async function (error, content) {
        if (error) {
          throw error;
        }

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        const currentDate = new Date();
        const pastDate = new Date(
          JSON.parse(localStorage.getItem("userInfo")).createdAt
        );

        // Format the date
        const options = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };

        const formattedDate = currentDate.toLocaleDateString("en-US", options);
        const pastFormattedDate = pastDate.toLocaleDateString("en-US", options);

        let events = userData?.breakdown;

        if (!events) {
          events = [];
        }

        if (userData?.points != 0) {
          events.unshift({
            message: "Sharing notes on NoteSwap",
            minutes: Math.round(userData?.points / 20),
            organization: "NoteSwap",
            rewardedOn: formattedDate,
          });
        }

        if (userData?.tutor_hours != 0) {
          events.unshift({
            message: "Tutoring Students",
            minutes: Math.round(userData?.tutor_hours / 60),
            organization: "NoteSwap",
            rewardedOn: formattedDate,
          });
        }

        doc.render({
          full_name: `${userData?.first_name} ${userData?.last_name}`,
          school_name: schoolData.schoolFullName,
          service_dates: `${pastFormattedDate} to ${formattedDate}`,
          events: userData?.breakdown,
          current_date: formattedDate,
          total_community_service: `${
            userData?.points || userData?.tutor_hours
              ? Math.floor(userData?.points / 20) +
                Math.floor(userData?.tutor_hours / 60)
              : "0"
          } minute${
            Math.floor(userData?.points / 20) +
              Math.floor(userData?.tutor_hours / 60) ==
            1
              ? ""
              : "s"
          }`,
        });
        events = [];

        try {
          const documentText = await doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            compression: "DEFLATE",
          });
          const reader = new FileReader();

          reader.onload = async () => {
            const result = reader.result;
            const sha256Hash = await computeSHA256(result);
            console.log(sha256Hash);
            await fetch("/api/certificate/download_certificate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sha256: sha256Hash,
                userId: JSON.parse(localStorage.getItem("userInfo"))._id,
                downloadedAt: new Date(),
              }),
            });
          };

          reader.readAsDataURL(documentText);

          const updatedDocument = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
          });
          saveAs(updatedDocument, "NoteSwap_Transcript.docx");
        } catch (error) {
          console.error("Error rendering document:", error);
        }
      }
    );
  };

  if (!open) {
    return null;
  }
  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Download NoteSwap Transcript"
      small={true}
    >
      <div
        style={{
          width: "50vw",
          height: "100%",
          display: "grid",
          marginTop: "20px",
        }}
      >
        <p style={{ lineHeight: "200%", fontFamily: "var(--manrope-font)" }}>
          Your NoteSwap transcript will include all events you have participated
          in through NoteSwap. Note: Forged or modified transcripts can be
          detected by schools or educational institutes.
        </p>
        <button
          style={{
            padding: "var(--button-default-padding)",
            borderRadius: "3px",
            outline: "none",
            border: "none",
            cursor: "pointer",
            color: "white",
            background: "var(--accent-color)",
          }}
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </Modal>
  );
};

export default Certificate;
