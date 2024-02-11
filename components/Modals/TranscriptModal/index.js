/* Modal used to download the NoteSwap transcript*/

import { useState, useEffect, useContext } from "react";

import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";

// Used to modify and download the transcript document
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import Docxtemplater from "docxtemplater";

// Used for translations
import { useTranslation } from "next-i18next";

// Transcript Component

const Transcript = () => {
  // Used to store whether the modal is opened or closed
  const { certificateModal } = useContext(ModalContext);
  const [open, setOpen] = certificateModal;

  const [userData, setUserData] = useState([]); // Used to store the userData
  const [schoolData, setSchoolDate] = useState([]); // Used to store the schoolData

  const { t } = useTranslation("common");

  // Get school and user data
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setUserData(JSON.parse(localStorage.getItem("userInfo")));
      setSchoolDate(JSON.parse(localStorage.getItem("schoolInfo")));
    }
  }, []);

  // Function used to load the transcript doc to be modified
  function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
  }

  // Functuon used to compute the sha256 of the transcript used to detect modified transcripts
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

  // Modify and download the NoteSwap Transcript
  const handleDownload = () => {
    loadFile(
      `${
        process.env.NEXT_PUBLIC_URL.includes("noteswap")
          ? `https://www.noteswap.org/`
          : process.env.NEXT_PUBLIC_URL
      }assets/pdf/NoteSwap_Transcript.docx`,
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

  // Don't render the component if not opened
  if (!open) {
    return null;
  }

  // Return the JSX
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
          {t("transcript_text")}
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
          {t("download")}
        </button>
      </div>
    </Modal>
  );
};

export default Transcript;
