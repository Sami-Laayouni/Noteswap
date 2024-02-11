/* Modal used to allow people to download 
the PWA version of the website on their mobile or desktop 
devices */

import Modal from "../../Template/Modal";
import { useContext } from "react";
import ModalContext from "../../../context/ModalContext";

// Import the style
import style from "./installPwa.module.css";

// Export the component
export default function InstallPWa() {
  // Used to store whether the Modal is closed or opned
  const { pwa } = useContext(ModalContext);
  const [open, setOpen] = pwa;

  // Function used to install the PWA
  const handleInstallClick = async () => {
    try {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(async (registration) => {
          // Ensure the service worker is activated
          if (registration.active) {
            const promptEvent = new Promise((resolve) => {
              // Check for an existing beforeinstallprompt event
              const existingEvent =
                registration.installing || registration.waiting;
              if (existingEvent) {
                // If an event exists, resolve immediately
                resolve(existingEvent);
              } else {
                // Otherwise, listen for the event
                window.addEventListener("beforeinstallprompt", (event) => {
                  resolve(event);
                });
              }
            });

            const event = await promptEvent;

            // Display the installation prompt
            event.prompt();

            // Wait for the user to respond to the prompt
            const userChoice = await event.userChoice;

            if (userChoice.outcome === "accepted") {
              console.log("User accepted the PWA installation");
            } else {
              console.log("User declined the PWA installation");
            }
          }
        });
      }
    } catch (error) {
      console.error("Error handling PWA installation:", error);
    }
  };

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
