/* Modal used to delete a user's account */

import Modal from "../../Template/Modal";

// Import from raect
import { useContext, useState } from "react";
import { useRouter } from "next/router";

import ModalContext from "../../../context/ModalContext";
import AuthContext from "../../../context/AuthContext";
import AuthService from "../../../services/AuthService";

// Import style
import style from "./deleteAccount.module.css";
import { UseTranslation, useTranslation } from "next-i18next";

// Export the component
export default function DeleteAccount() {
  // Used to store wether the Modal is opened or closed
  const { deleteModal } = useContext(ModalContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const [open, setOpen] = deleteModal;

  const [disabled, setDisabled] = useState(true); // Disabled if user has not typed in their id
  const AuthServices = new AuthService(setLoggedIn);
  const router = useRouter();
  const { t } = useTranslation();

  // Don't render if the Modal is closed
  if (!open) {
    return null;
  }

  // Return the JSX
  return (
    <Modal
      title={"Delete your Noteswap account"}
      isOpen={open}
      onClose={() => setOpen(false)}
    >
      <h1 className={style.title}>{t("confirm_delete")} </h1>
      <p className={style.subText}>
        {t("confirm_type")}{" "}
        <span>{JSON.parse(localStorage.getItem("userInfo"))._id}</span>
      </p>
      <input
        className={style.input}
        placeholder={JSON.parse(localStorage.getItem("userInfo"))._id}
        onChange={(event) => {
          if (
            JSON.parse(localStorage.getItem("userInfo"))._id ==
            event.target.value
          ) {
            setDisabled(false);
            document.getElementById("deleteButton").style.cursor = "pointer";
          } else {
            setDisabled(true);
            document.getElementById("deleteButton").style.cursor =
              "not-allowed";
          }
        }}
      ></input>
      <button
        className={style.cancelButton}
        onClick={() => {
          setOpen(false);
        }}
      >
        {t("cancel")}
      </button>
      <button
        id="deleteButton"
        className={style.deleteButton}
        onClick={async () => {
          const response = await fetch("/api/profile/delete_account", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: JSON.parse(localStorage.getItem("userInfo"))._id,
            }),
          });
          if (response.ok) {
            AuthServices.logout();
            setOpen(false);
            router.push("/signup");
          }
        }}
        disabled={disabled}
      >
        {t("delete")}
      </button>
    </Modal>
  );
}
