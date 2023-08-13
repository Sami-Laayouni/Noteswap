import Modal from "../Modal";
import { useContext, useState } from "react";
import ModalContext from "../../context/ModalContext";
import AuthContext from "../../context/AuthContext";
import style from "./deleteAccount.module.css";
import AuthService from "../../services/AuthService";
import { useRouter } from "next/router";
/**
 * Delete account Modal
 * @date 8/13/2023 - 5:10:11 PM
 *
 * @export
 * @return {*}
 */
export default function DeleteAccount() {
  const { deleteModal } = useContext(ModalContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const [open, setOpen] = deleteModal;
  const [disabled, setDisabled] = useState(true);
  const AuthServices = new AuthService(setLoggedIn);
  const router = useRouter();

  if (!open) {
    return null;
  }
  return (
    <Modal
      title={"Delete your Noteswap account"}
      isOpen={open}
      onClose={() => setOpen(false)}
    >
      <h1 className={style.title}>
        Are you sure you want to delete your Noteswap account?
      </h1>
      <p className={style.subText}>
        To confirm please type in your userId. UserId:{" "}
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
        Cancel
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
        Delete
      </button>
    </Modal>
  );
}
