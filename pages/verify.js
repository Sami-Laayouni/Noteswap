import style from "../styles/Verify.module.css";
import React, { useState } from "react";
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

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImage(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleImage(file);
  };

  const handleImage = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      const sha256 = await computeSHA256(base64);
      console.log(sha256);
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
        if (data.response) {
          setVerified(true);
        } else {
          setVerified(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const fileInputRef = React.createRef();

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
        {data &&
          (verified ? (
            <div className={style.container}>
              <h1>This transcript is valid</h1>
            </div>
          ) : (
            <div className={style.container}>
              <h1>This transcript is forged or modified</h1>
            </div>
          ))}
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
            accept="doc/*"
            onChange={handleFileInputChange}
          />
        </div>
      </section>
    </>
  );
}
