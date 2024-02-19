/* Modal used to allow people to download 
the PWA version of the website on their mobile or desktop 
devices */

import Modal from "../../Template/Modal";
import { useContext, useEffect, useState } from "react";
import ModalContext from "../../../context/ModalContext";

// Import the style
import style from "./installPwa.module.css";

// Export the component
export default function InstallPWa() {
  // Used to store whether the Modal is closed or opned
  const { pwa } = useContext(ModalContext);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [open, setOpen] = pwa;

  // Function used to install the PWA
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      setDeferredPrompt(e);
    });
  }, []);

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      small="true"
    >
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1 className={style.title}>Install the NoteSwap Webapp!</h1>
        <h2 className={style.subTitle}>
          Install our new web app to get notified of upcoming school events,
          earn community service and download your community service transcript.
        </h2>
        <button
          onClick={() => {
            handleInstallClick();
          }}
          className={style.button}
        >
          Install
        </button>
      </section>
    </Modal>
  );
}
