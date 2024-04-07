/* Modal used by businesses to create their account */

import Modal from "../../Template/Modal";
import { useContext } from "react";
import ModalContext from "../../../context/ModalContext";
import style from "./BusinessModal.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const ASSOCIATION_CATEGORY = [
  "Community Service and Development",
  "Education and Literacy",
  "Health and Wellness",
  "Animal Welfare",
  "Arts and Culture",
  "Emergency and Disaster Relief",
  "Social Justice and Advocacy",
  "Environmental Conservation",
  "Homelessness and Hunger Relief",
  "Elderly Care and Support",
  "Crisis Intervention and Hotlines",
  "Community Building",
  "Digital Inclusion",
  "Gender Equality",
  "Sports and Recreation",
  "Disability Support",
  "International Outreach",
  "Technology and Innovation",
  "Other",
];

export default function CreateAccount() {
  const { business } = useContext(ModalContext);
  const [open, setOpen] = business;
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [current, setCurrent] = useState(1);
  const [web, setWeb] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [profile, setProfile] = useState(
    "https://api.dicebear.com/8.x/shapes/svg?seed=Shado"
  );
  const { t } = useTranslation();

  const router = useRouter();

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
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(true);
        router.push("/shortcuts");
      }}
      title={t("set_up_business")}
    >
      <section
        style={{
          width: "70vw",
        }}
      >
        <form
          className={style.form}
          onSubmit={async (e) => {
            e.preventDefault();
            if (current != 4) {
              setCurrent(current + 1);
            } else {
              const response = await fetch(
                "/api/association/create_association",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: JSON.parse(localStorage.getItem("userInfo"))._id,
                    name: name,
                    desc: desc,
                    contact_email: email,
                    contact_phone: phone,
                    website: web,
                    category: category,
                    country: country,
                    city: city,
                    street: street,
                    postalCode: postalCode,
                    icon: profile,
                  }),
                }
              );
              if (response.ok) {
                const data = await response.json();
                console.log(data);
                localStorage.setItem(
                  "associationInfo",
                  JSON.stringify(data.savedAssociation)
                );
                setOpen(false);
                router.push("/shortcuts");
              }
            }
          }}
        >
          {/* Basic Information 1*/}
          {current == 1 && (
            <>
              <label className={style.labelForInput} htmlFor="namelSignup">
                Name of the Association (The full legal name as registered)
              </label>
              <input
                id="namelSignup"
                type="text"
                placeholder={t("enter_association_name")}
                value={name}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                minLength={3}
              />
              <label
                className={style.labelForInput}
                htmlFor="descriptionSignup"
              >
                {t("association_des")}{" "}
              </label>
              <textarea
                id="descriptSignup"
                type="text"
                placeholder={t("enter_association_des")}
                value={desc}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setDesc(e.target.value)}
                required
                minLength={100}
              />
            </>
          )}
          {/* Basic Information 2*/}
          {current == 2 && (
            <>
              <label className={style.labelForInput} htmlFor="emaillSignup">
                {t("association_contact")}{" "}
              </label>
              <input
                id="emaillSignup"
                type="email"
                placeholder={t("enter_association_contact")}
                value={email}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <label className={style.labelForInput} htmlFor="phoneSignup">
                {t("association_phone")}{" "}
              </label>
              <input
                id="phoneSignup"
                type="tel"
                placeholder={t("enter_association_phone")}
                value={phone}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <label className={style.labelForInput} htmlFor="webSignup">
                Association Website
              </label>
              <input
                id="webSignup"
                type="url"
                placeholder={t("enter_association_website")}
                value={web}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setWeb(e.target.value)}
                required
              />
              <label className={style.labelForInput}>
                {t("association_category")}{" "}
              </label>
              <select
                className={style.input}
                value={category}
                style={{ fontFamily: "var(--manrope-font)" }}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                required
              >
                <option value="">Select a category</option>

                {ASSOCIATION_CATEGORY?.map(function (value) {
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </>
          )}
          {/* Basic Information 3*/}
          {current == 3 && (
            <>
              <label className={style.labelForInput} htmlFor="countrySignup">
                Country of Operation
              </label>
              <input
                id="countrySignup"
                type="text"
                placeholder="Enter the country in which your association operates"
                value={country}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setCountry(e.target.value)}
                required
                autoFocus
              />
              <label className={style.labelForInput} htmlFor="citySignup">
                City of Operation
              </label>
              <input
                id="citySignup"
                type="text"
                placeholder="Enter the city in which your association operates"
                value={city}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <label className={style.labelForInput} htmlFor="citySignup">
                Street
              </label>
              <input
                id="street"
                type="text"
                placeholder="Enter the street in which your association operates"
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                required
                value={street}
                onChange={(e) => {
                  setStreet(e.target.value);
                }}
              />
              <label className={style.labelForInput} htmlFor="citySignup">
                Post Code
              </label>
              <input
                id="postalCode"
                type="text"
                placeholder="Enter your postal code"
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                required
                value={postalCode}
                onChange={(e) => {
                  setPostalCode(e.target.value);
                }}
              />
            </>
          )}
          {/* Logo */}
          {current == 4 && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "55vh",
                  flexDirection: "column",
                }}
              >
                <h1>Upload your association&apos;s profile picture</h1>
                <img
                  alt="Profile"
                  src={profile}
                  width={300}
                  height={300}
                  style={{ borderRadius: "50%", cursor: "pointer" }}
                  onClick={() => {
                    document.getElementById("imageUploadInput").click();
                  }}
                ></img>
              </div>
              <input
                type="file"
                accept="image/jpeg, image/png, image/gif, image/webp"
                capture="user"
                id="imageUploadInput"
                style={{ display: "none" }}
                onChange={uploadImage}
              ></input>
            </>
          )}
          {current != 1 && (
            <button
              onClick={() => {
                setCurrent(current - 1);
              }}
              className={style.back}
              type="button"
            >
              {t("back")}
            </button>
          )}

          <button className={style.button} type="submit">
            {current == 4 ? t("finish") : t("next")}
          </button>
        </form>
      </section>
    </Modal>
  );
}
