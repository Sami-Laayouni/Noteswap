import style from "./certificate.module.css";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useTranslation } from "next-i18next";

/**
 * Certificate Download
 * @date 8/13/2023 - 5:07:47 PM
 *
 * @export
 * @param {{ main: any; userData: any; url: any; }} { main, userData, url }
 * @returns {*}
 */
export default function CertificateDownload({ main, userData, url }) {
  const certificateRef = useRef(null);
  const [error, setError] = useState("");
  const { t } = useTranslation("common");

  const downloadCertificate = async () => {
    if (!main) {
      document.getElementById("ImageCertificate").src = url;
    }
    if (main) {
      document.getElementById("points").innerText = Math.round(
        userData?.points / 20
      );
      document.getElementById("tutor_hours").innerText = Math.round(
        userData?.tutor_hours / 60
      );
    }
    await html2canvas(certificateRef.current, { useCORS: true, scale: 3 }).then(
      (canvas) => {
        canvas.toBlob(async (blob) => {
          const url = URL.createObjectURL(blob);

          // Trigger download
          const link = document.createElement("a");
          const base64 = await blobToBase64(url);
          const binaryData = await base64ToBinary(base64);
          const sha256 = await computeSHA256(binaryData);
          const response = await fetch(
            "/api/certificate/download_certificate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sha256: sha256,
                userId: JSON.parse(localStorage.getItem("userInfo"))._id,
                downloadedAt: Date.now(),
              }),
            }
          );
          if (response.ok) {
            link.href = url;
            link.download = "NoteSwap_Certificate.png";
            link.click();
          } else {
            setError("An error has occured. Please try again later");
          }
        });
      }
    );
  };

  function generateCode(length) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }
  const blobToBase64 = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blobData = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.split(",")[1]); // Extract base64 part
        } else {
          reject(new Error("Error converting Blob to Base64"));
        }
      };
      reader.readAsDataURL(blobData);
    });
  };
  // Function to convert Base64 to binary data
  const base64ToBinary = (base64) => {
    const binaryString = atob(base64);
    const binaryData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }
    return binaryData;
  };

  // Function to compute SHA-256 hash
  const computeSHA256 = (data) => {
    const cryptoSubtle = window.crypto.subtle;
    return cryptoSubtle.digest("SHA-256", data).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    });
  };

  if (main) {
    return (
      <div>
        {error}
        <div className={style.container}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                position: "relative",
              }}
              ref={certificateRef}
            >
              {" "}
              <h1
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "32%",
                  width: "300px",
                  textAlign: "center",
                  fontFamily: "var(--manrope-bold-font)",
                }}
              >
                {userData?.first_name} {userData?.last_name}
              </h1>
              <p
                style={{
                  position: "absolute",
                  top: "60%",
                  left: "32%",
                  width: "300px",
                  textAlign: "center",
                  fontSize: "0.7rem",
                  fontFamily: "var(--manrope-font)",
                }}
              >
                {t("has_succesfully")}{" "}
                <span id="points" style={{ color: "var(--accent-color)" }}>
                  {Math.round(userData?.points / 20) +
                    Math.round(userData?.tutor_hours / 60)}
                </span>{" "}
                {t("minute")}
                {Math.round(userData?.points / 20) == 1 ? "" : "s"}{" "}
                {t("of_com")}
                {Math.round(userData?.tutor_hours / 60) != "0" ? (
                  `{" "}including{" "}
                <span id="tutor_hours" style={{ color: "var(--accent-color)" }}>
                  {Math.round(userData?.tutor_hours / 60)}
                </span>{" "}
                minute{Math.round(userData?.tutor_hours / 60) == 1 ? "" : "s"}{" "}
                tutoring other students.`
                ) : (
                  <>.</>
                )}
              </p>
              <img
                src="/assets/images/certificate/Noteswap.png"
                alt="Certificate"
                width={500}
                height={350}
              />
            </div>
          </div>
          <div className={style.detail}>
            <h1>{t("cert_detail")}</h1>
            <i> {t("cert_notice")}</i>
            <h2>
              <b>{t("offered_by")}:</b> <span>NoteSwap</span>
            </h2>
            <h2>
              <b>NoteSwap Id:</b> <span>{generateCode(17)}</span>{" "}
            </h2>
            <h2>
              <b>{t("message")}:</b> {userData?.first_name}{" "}
              {userData?.last_name} {t("has_succesfully")}{" "}
              <span>
                {Math.round(userData?.points / 20) +
                  Math.round(userData?.tutor_hours / 60)}
              </span>{" "}
              {t("minute")}
              {Math.round(userData?.points / 20) == 1 ? "" : "s"} {t("of_com")}
              {Math.round(userData?.tutor_hours / 60) != "0" ? (
                `{" "}including{" "}
              <span>{Math.round(userData?.tutor_hours / 60)}</span> minute
              {Math.round(userData?.tutor_hours / 60) == 1 ? "" : "s"} tutoring
              other students.`
              ) : (
                <>.</>
              )}
            </h2>
            <button
              onClick={() => {
                downloadCertificate();
              }}
              className={style.button}
            >
              {t("download_cert")}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {error}
        <div className={style.container}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                position: "relative",
              }}
              ref={certificateRef}
            >
              {" "}
              <h1
                style={{
                  position: "absolute",
                  top: "38%",
                  left: "20%",
                  width: "300px",
                  textAlign: "center",
                  fontFamily: "var(--manrope-bold-font)",
                }}
              >
                {userData?.first_name} {userData?.last_name}
              </h1>
              <img
                id="ImageCertificate"
                src={url}
                alt="Certificate"
                width={500}
                height={360}
              />
            </div>
          </div>
          <div className={style.detail}>
            <h1>{t("cert_detail")}</h1>
            <i> {t("cert_notice")}</i>
            <h2>
              <b>{t("offered_by")}:</b> <span>{t("your_school")}</span>
            </h2>
            <h2>
              <b>NoteSwap Id:</b> <span>{generateCode(17)}</span>{" "}
            </h2>

            <button
              onClick={() => {
                downloadCertificate();
              }}
              className={style.button}
            >
              {t("download_cert")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
