import style from "./Modal.module.css";
import { IoIosClose } from "react-icons/io";
import { useTranslation } from "next-i18next";

/**
 * Modal
 * @date 7/24/2023 - 7:29:57 PM
 *
 * @export
 * @param {*} { children, isOpen, onClose, title }
 * @return {*}
 */
export default function Modal({ children, isOpen, onClose, title, small }) {
  const { t } = useTranslation("common");

  if (!isOpen) return null;

  return (
    <div
      className={style.overlay}
      style={{ display: isOpen ? "block" : "none" }}
      onClick={() => {
        if (window.getSelection().toString() === "") {
          onClose();
        }
      }}
    >
      <div
        className={style.modal}
        style={{ height: `${small ? "auto" : "520px"}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.close}>
          <span
            style={{
              verticalAlign: "middle",
              color: "var(--default-grey-color)",
              display: "inline",
              marginRight: "10px",
            }}
          >
            {t("close")}
          </span>
          <div style={{ display: "inline-block", verticalAlign: "middle" }}>
            <span
              style={{
                verticalAlign: "middle",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--default-grey-color)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              }}
            >
              <IoIosClose color="white" size={33} onClick={onClose} />
            </span>
          </div>
        </div>
        <h1 className={style.title}>{title}</h1>
        {title && <div style={{ height: "30px", width: "100%" }}></div>}
        {children}
      </div>
    </div>
  );
}
