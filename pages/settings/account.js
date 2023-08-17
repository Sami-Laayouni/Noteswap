import style from "../../styles/Settings.module.css";
import { useEffect, useState, useContext } from "react";
import ModalContext from "../../context/ModalContext";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { requireAuthentication } from "../../middleware/authenticate";
import dynamic from "next/dynamic";
const SettingSidebar = dynamic(() => import("../../components/SettingSidebar"));
const DeleteAccount = dynamic(() =>
  import("../../components/DeleteAccountModal")
);

/**
 * Get static props
 * @date 8/13/2023 - 5:00:39 PM
 *
 * @export
 * @async
 * @param {{ locale: any; }} { locale }
 * @return {unknown}
 */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
/**
 * Settings account
 * @date 7/24/2023 - 7:23:30 PM
 *
 * @export
 * @return {*}
 */
const Setting = () => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [bio, setBio] = useState("");
  const [profile, setProfile] = useState("");
  const { deleteModal } = useContext(ModalContext);
  const [open, setOpen] = deleteModal;
  useEffect(() => {
    if (localStorage) {
      const userData = JSON.parse(localStorage.getItem("userInfo"));
      setFirst(userData.first_name);
      setLast(userData.last_name);
      setBio(userData.bio);
      setProfile(userData.profile_picture);
    }
  }, []);
  // Upload image/notes to gcs
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async function () {
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch("/api/gcs/upload_image", {
          method: "POST",
          body: formData,
        });

        const { url } = await response.json();

        setProfile(url);
      };
    }
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "25% 75%" }}>
      <SettingSidebar />
      <DeleteAccount />
      <div>
        <h2 className={style.title}>Account</h2>
        <div style={{ marginTop: "60px", position: "relative" }}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              document.getElementById("save").innerText = "Saving...";
              const response = await fetch("/api/profile/update_profile", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: JSON.parse(localStorage.getItem("userInfo"))._id,
                  first: first,
                  last: last,
                  bio: bio,
                  profile: profile,
                }),
              });
              if (response.ok) {
                document.getElementById("save").innerText = "Save";
                localStorage.setItem("userInfo", await response.text());
                window.location.reload();
              }
            }}
          >
            <label className={style.labelForInput} htmlFor="First">
              First Name
            </label>
            <input
              id="First"
              value={first}
              onChange={(e) => {
                setFirst(e.target.value);
              }}
              className={style.input}
              required
            ></input>
            <label className={style.labelForInput} htmlFor="Last">
              Last Name
            </label>
            <input
              id="Last"
              value={last}
              onChange={(e) => {
                setLast(e.target.value);
              }}
              className={style.input}
              required
            ></input>
            <label className={style.labelForInput} htmlFor="Bio">
              Biography
            </label>
            <input
              id="Bio"
              value={bio}
              className={style.input}
              maxLength={100}
              max={100}
              onChange={(e) => {
                setBio(e.target.value);
              }}
            ></input>
            <button id="save" className={style.saveButton} type="submit">
              Save
            </button>
          </form>

          <img
            alt="Profile"
            src={profile}
            className={style.profile}
            onClick={() => {
              document.getElementById("imageUploadInput").click();
            }}
          ></img>
        </div>

        <div className={style.line}></div>

        <h2 className={style.title}>Delete your Account</h2>
        <p style={{ paddingRight: "200px" }}>
          By deleting your Noteswap account, you agree to delete all publicly
          posted information on your account, including notes. This process can
          not be undone.
        </p>
        <button className={style.delete} onClick={() => setOpen(true)}>
          Delete Account
        </button>
        <input
          type="file"
          accept="image/jpeg, image/png, image/gif, image/webp"
          capture="user"
          id="imageUploadInput"
          style={{ display: "none" }}
          onChange={uploadImage}
        ></input>
      </div>
    </div>
  );
};
export default requireAuthentication(Setting);