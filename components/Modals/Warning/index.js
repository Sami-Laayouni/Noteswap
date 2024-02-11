/* Warning page currently used to notify 
students that this is not an official school 
resource but a student-lead intiative */

import Modal from "../../Template/Modal";
import { useContext } from "react";
import ModalContext from "../../../context/ModalContext";
import { useTranslation } from "next-i18next";
import style from "./warning.module.css";

// Export the Modal
export default function Warning() {
  const { warning } = useContext(ModalContext);
  const [open, setOpen] = warning;
  const { t } = useTranslation("common");

  // Return the JSX
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
        <h1 className={style.title}>{t("thank_you_for_using")}</h1>
        <h2 className={style.subTitle}>{t("thank_you_message")}</h2>
        <button
          onClick={() => {
            setOpen(false);
          }}
          className={style.button}
        >
          {t("i_understand")}
        </button>
      </section>
    </Modal>
  );
}
