import style from "../styles/Verify.module.css";
import React, { useState, useRef } from "react";
import { saveAs } from "file-saver";

/**
 * Verify Certificate
 * @date 8/13/2023 - 5:06:12 PM
 *
 * @export
 * @return {*}
 */
export default function Verify() {
  const [verified, setVerified] = useState(null);
  const [data, setData] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      const sha256 = await computeSHA256(base64);
      console.log("SHA-256:", sha256);
      const response = await fetch("/api/certificate/verify_certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sha256: sha256,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setData(data);
        setVerified(data.response);
      }
    };
    reader.readAsDataURL(file);
  };

  const computeSHA256 = async (base64) => {
    const binaryData = atob(base64.split(",")[1]);
    const binaryArray = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      binaryArray[i] = binaryData.charCodeAt(i);
    }

    const hashBuffer = await crypto.subtle.digest("SHA-256", binaryArray);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  const handleDocxVerification = async (doc) => {
    try {
      const docBlob = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        compression: "DEFLATE",
      });

      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result;
        console.log("DOCX Base64:", result);
        const sha256Hash = await computeSHA256(result);
        console.log("SHA-256 for DOCX:", sha256Hash);
        await fetch("/api/certificate/download_certificate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sha256: sha256Hash,
            userId: localStorage.getItem("userInfo")
              ? JSON.parse(localStorage.getItem("userInfo"))._id
              : "demoUser",
            downloadedAt: new Date(),
          }),
        });
      };
      reader.readAsDataURL(docBlob);
      saveAs(docBlob, "NoteSwap_Portfolio.docx");
    } catch (err) {
      console.error("Error generating DOCX:", err);
    }
  };

  return (
    <>
      <section className={style.background}>
        <h1
          style={{ fontFamily: "var(--manrope-bold-font)", lineHeight: "20px" }}
        >
          Verify NoteSwap Transcript
        </h1>
        <p style={{ fontFamily: "var(--manrope-font)" }}>
          Drag and drop a student&apos;s transcript to verify that it is valid
          and not forged or modified.
        </p>
        {data && (
          <div className={style.container}>
            <h1>
              {verified
                ? "This transcript is valid"
                : "This transcript is forged or modified"}
            </h1>
          </div>
        )}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleImageClick}
          style={{
            border: "2px dashed black",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            fontFamily: "var(--manrope-font)",
          }}
        >
          <p>Drag and drop a transcript or click here to verify</p>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".doc,.docx,.pdf"
            onChange={handleFileInputChange}
          />
        </div>
      </section>
    </>
  );
}
