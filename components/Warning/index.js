import Modal from "../Modal";
import { useContext } from "react";
import ModalContext from "../../context/ModalContext";
import style from "./warning.module.css";
export default function Warning() {
  const { warning } = useContext(ModalContext);
  const [open, setOpen] = warning;
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
        <h1 className={style.title}>Thank you for using Noteswap!</h1>
        <h2 className={style.subTitle}>
          Noteswap is currently driven by student initiative and is not
          affiliated with or endorsed as an official school resource. By
          continuing to use the service you agree to acknowledge this.
        </h2>
        <button
          onClick={() => {
            setOpen(false);
          }}
          className={style.button}
        >
          I understand
        </button>
      </section>
    </Modal>
  );
}
