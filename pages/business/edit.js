import Head from "next/head";
import style from "../../styles/Settings.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";

/**
 * Get static props
 * @date 8/13/2023 - 4:31:01 PM
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
 * Edit
 * @date 7/3/2023 - 12:50:32 PM
 *
 * @export
 * @return {JSX.Element}
 */
export default function Edit() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // Return the JSX
  return (
    <>
      <Head>
        <title>Edit Business | NoteSwap</title> {/* Title of the page*/}
      </Head>

      <div className={style.paddingLeft} style={{ paddingLeft: "80px" }}>
        <h2 className={style.title} style={{ marginTop: "50px" }}>
          Edit Your Business Information
        </h2>
        <div style={{ marginTop: "40px", position: "relative" }}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              document.getElementById("save").innerText = "Saving...";
              /*const response = await fetch("/api/profile/update_profile", {
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
              });*/
              if (response.ok) {
                document.getElementById("save").innerText = "Save";
                localStorage.setItem("userInfo", await response.text());
                window.location.reload();
              }
            }}
          >
            <label className={style.labelForInput} htmlFor="First">
              Association Name
            </label>
            <input
              id="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className={style.input}
              required
            ></input>
            <label className={style.labelForInput} htmlFor="First">
              Association Description
            </label>
            <textarea
              id="Description"
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
              className={style.input}
              required
            ></textarea>

            <button id="save" className={style.saveButton} type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
