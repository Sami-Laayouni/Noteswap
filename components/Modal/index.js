import style from "./Modal.module.css";
import { AiOutlineClose } from "react-icons/ai";

/**
 * Modal
 * @date 7/24/2023 - 7:29:57 PM
 *
 * @export
 * @param {*} { children, isOpen, onClose, title }
 * @return {*}
 */
export default function Modal({ children, isOpen, onClose, title }) {
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
      <div className={style.modal} onClick={(e) => e.stopPropagation()}>
        <AiOutlineClose size={20} className={style.close} onClick={onClose} />
        {title && <div className={style.line}></div>}
        <h1 className={style.title}>{title}</h1>
        {children}
      </div>
    </div>
  );
}
