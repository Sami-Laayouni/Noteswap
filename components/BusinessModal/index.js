import Modal from "../Modal";
import { useContext } from "react";
import ModalContext from "../../context/ModalContext";
import style from "./BusinessModal.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
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
  const [postal, setPostal] = useState("");
  const [profile, setProfile] = useState("./assets/fallback/user.webp");

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
        setOpen(false);
        router.push("/shortcuts");
      }}
      title="Setup Your NoteSwap Business Account"
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
                    postal_code: postal,
                    icon: profile,
                  }),
                }
              );
              if (response.ok) {
                router.push("/shortcuts");
                setOpen(false);
              }
            }
          }}
        >
          {current == 1 && (
            <>
              <label className={style.labelForInput} htmlFor="namelSignup">
                Association Name
              </label>
              <input
                id="namelSignup"
                type="text"
                placeholder="Enter your association name"
                value={name}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
              <label
                className={style.labelForInput}
                htmlFor="descriptionSignup"
              >
                Association Description
              </label>
              <textarea
                id="descriptSignup"
                type="text"
                placeholder="Enter your association description"
                value={desc}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </>
          )}
          {current == 2 && (
            <>
              <label className={style.labelForInput} htmlFor="emaillSignup">
                Association Contact Email
              </label>
              <input
                id="emaillSignup"
                type="email"
                placeholder="Enter your association contact email"
                value={email}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <label className={style.labelForInput} htmlFor="phoneSignup">
                Association Contact Phone Number
              </label>
              <input
                id="phoneSignup"
                type="tel"
                placeholder="Enter your association contact phone number"
                value={phone}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <label className={style.labelForInput} htmlFor="webSignup">
                Association Website (optional)
              </label>
              <input
                id="webSignup"
                type="url"
                placeholder="Enter your association website link"
                value={web}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setWeb(e.target.value)}
                required
              />
              <label className={style.labelForInput}>
                Select a category for your association
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
                <option value="Community Service and Development">
                  Community Service and Development
                </option>
                <option value="Education and Literacy">
                  Education and Literacy
                </option>

                <option value="Health and Wellness">Health and Wellness</option>
                <option value="Animal Welfare">Animal Welfare</option>

                <option value="Arts and Culture">Arts and Culture</option>
                <option value="Emergency and Disaster Relief">
                  Emergency and Disaster Relief
                </option>

                <option value="Social Justice and Advocacy">
                  Social Justice and Advocacy
                </option>

                <option value="Environmental Conservation">
                  Environmental Conservation
                </option>
                <option value="Health and Wellness">Health and Wellness</option>
                <option value="Homelessness and Hunger Relief">
                  Homelessness and Hunger Relief
                </option>
                <option value="Elderly Care and Support">
                  Elderly Care and Support
                </option>
                <option value="Crisis Intervention and Hotlines">
                  Crisis Intervention and Hotlines
                </option>
                <option value="Animal Welfare">Animal Welfare</option>
                <option value="Community Building">Community Building</option>
                <option value="Digital Inclusion">Digital Inclusion</option>
                <option value="Gender Equality">Gender Equality</option>
                <option value="Sports and Recreation">
                  Sports and Recreation
                </option>
                <option value="Disability Support">Disability Support</option>
                <option value="International Outreach">
                  International Outreach
                </option>
                <option value="Technology and Innovation">
                  Technology and Innovation
                </option>
                <option value="Other">Other</option>
              </select>
            </>
          )}
          {current == 3 && (
            <>
              <label className={style.labelForInput} htmlFor="countrySignup">
                Country
              </label>
              <input
                id="countrySignup"
                type="text"
                placeholder="Enter your association location"
                value={country}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setCountry(e.target.value)}
                required
                autoFocus
              />
              <label className={style.labelForInput} htmlFor="citySignup">
                City
              </label>
              <input
                id="citySignup"
                type="text"
                placeholder="Enter your association city"
                value={city}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <label className={style.labelForInput} htmlFor="streetSignup">
                Street Address (optional, not public)
              </label>
              <input
                id="streetSignup"
                type="text"
                placeholder="Enter your association street address"
                value={street}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setStreet(e.target.value)}
              />
              <label className={style.labelForInput} htmlFor="postalcodeSignup">
                Postal Code (optional, not public)
              </label>
              <input
                id="postalcodeSignup"
                type="text"
                placeholder="Enter your association postal code"
                value={postal}
                aria-required="true"
                aria-invalid="true"
                className={style.input}
                onChange={(e) => setPostal(e.target.value)}
              />
            </>
          )}
          {current == 4 && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "55vh",
                }}
              >
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
              Back
            </button>
          )}

          <button className={style.button} type="submit">
            {current == 4 ? "Finish" : "Next"}
          </button>
        </form>
      </section>
    </Modal>
  );
}
