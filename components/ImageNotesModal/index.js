import Modal from "../Modal";
import { useContext, useEffect, useState } from "react";
import ModalContext from "../../context/ModalContext";
import style from "./imageNotesModal.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineArrowDropDown } from "react-icons/md";
import LoadingCircle from "../LoadingCircle";

/**
 * Image Notes Modal
 * @date 7/24/2023 - 7:28:27 PM
 *
 * @export
 * @return {*}
 */
export default function ImageNotesModal() {
  const { imageNotesModal, imagesUrl, imageError } = useContext(ModalContext);
  const [open, setOpen] = imageNotesModal;
  const [url] = imagesUrl;
  const [error, setError] = imageError;
  const [imageArray, setImageArray] = useState();
  const [current, setCurrent] = useState(1);
  const [schoolClass, setSchoolClass] = useState();
  const [points, setPoints] = useState();

  useEffect(() => {
    setImageArray(url ? [url] : []);
  }, [url]);

  const [title, setTitle] = useState();
  const mathClasses = [
    "Algebra I",
    "Algebra II",
    "Geometry",
    "Pre-calculas",
    "AP calculas",
  ];
  const socialClasses = [
    "World History I",
    "World History II",
    "AP World History",
  ];
  const englishClasses = [
    "Introduction",
    "American Literature",
    "British Literature",
    "AP English",
  ];
  const scienceClasses = [
    "Biology",
    "Chemistry",
    "Physics",
    "AP Biology",
    "AP Chemistry",
    "AP Physics",
  ];
  const electives = [
    "Art",
    "PE",
    "IT",
    "AP Arts",
    "AP IT",
    "Advanced PE",
    "Other",
  ];

  if (!open) {
    return null;
  }
  // Handle change in the title
  const handleChangeTitle = (value) => {
    setTitle(value.target.value);
  };

  const uploadImage = async (e) => {
    document.getElementById("uploadOtherPicture").innerText = "Uploading...";
    const file = e.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async function () {
      // Check if the image is vertical (portrait)
      if (img.width < img.height) {
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch("/api/gcs/upload_image", {
          method: "POST",
          body: formData,
        });

        const { url } = await response.json();
        const newArray = [...imageArray, url];
        setImageArray(newArray);
        document.getElementById("notes").innerHTML += `
    <img class="imageNotesModal_image__kRzd7"  width={270} height={340} src=${url} alt="Notes" />`;
      } else {
        setError("Image must be vertical.");
      }
    };
    document.getElementById("uploadOtherPicture").innerText =
      "Upload another picture";
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Upload image of notes"
    >
      {current == 1 && (
        <>
          <section className={style.uploadNotes}>
            <section
              style={{
                height: "420px",
              }}
            >
              <p
                style={{
                  textAlign: "center",
                  fontFamily: "var(--manrope-family)",
                  color: "var(--danger-color)",
                  lineHeight: "0px",
                }}
              >
                {error}
              </p>
              <section
                id="notes"
                style={{
                  display: "inline-block",
                  verticalAlign: "top",
                  width: "fit-content",
                }}
              >
                {url ? (
                  <img
                    width={270}
                    height={340}
                    className={style.image}
                    src={url ? url : ""}
                    alt="Notes"
                  />
                ) : (
                  <></>
                )}
              </section>
              <section className={style.uploadMore}>
                <div
                  className={style.more}
                  onClick={() =>
                    document.getElementById("imageUploadInput").click()
                  }
                >
                  <AiOutlinePlus size={40} color="white" />
                </div>
                <p className={style.picture} id="uploadOtherPicture">
                  Upload another picture
                </p>
              </section>
            </section>
          </section>
          <p
            style={{
              position: "absolute",
              bottom: "10px",
              left: "30px",
              fontFamily: "var(--manrope-font)",
            }}
          >
            {imageArray.length} image{imageArray.length == 1 ? "" : "s"}{" "}
            uploaded
          </p>
        </>
      )}
      {current == 2 && (
        <>
          <input
            id="title"
            value={title}
            onChange={handleChangeTitle}
            className={style.input}
            placeholder="Enter title"
            autoFocus
            required
            minLength={3}
            maxLength={100}
          />
          <textarea
            className={style.textarea}
            placeholder="Description of notes (optional)"
            id="textarea"
          />
          <div className={style.dropdown} id="dropdownClass">
            {schoolClass ? schoolClass : "Select a class"}
            <MdOutlineArrowDropDown
              style={{ verticalAlign: "middle", marginLeft: "5px" }}
              size={25}
              onClick={() => {
                if (
                  document.getElementById("dropdownMenu").style.display ==
                    "none" ||
                  !document.getElementById("dropdownMenu").style.display
                ) {
                  document.getElementById("dropdownMenu").style.display =
                    "block";
                } else {
                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }
              }}
            />
          </div>
          <div
            id="dropdownMenu"
            style={{ display: "none" }}
            className={style.dropdownMenu}
          >
            <ul>
              {/* Science classes*/}
              <li
                key="Science"
                className={style.boldText}
                onClick={() => {
                  setSchoolClass("Science");
                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }}
              >
                Science
              </li>
              {scienceClasses?.map((value) => (
                <li
                  key={value}
                  onClick={() => {
                    setSchoolClass(value);
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                  }}
                >
                  {value}
                </li>
              ))}
              <li
                key="ELA"
                className={style.boldText}
                onClick={() => {
                  setSchoolClass("ELA");
                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }}
              >
                ELA
              </li>
              {englishClasses?.map((value) => (
                <li
                  key={value}
                  onClick={() => {
                    setSchoolClass(value);
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                  }}
                >
                  {value}
                </li>
              ))}

              <li
                key="Social Study"
                className={style.boldText}
                onClick={() => {
                  setSchoolClass("Social Study");
                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }}
              >
                Social Study
              </li>
              {socialClasses?.map((value) => (
                <li
                  key={value}
                  onClick={() => {
                    setSchoolClass(value);
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                  }}
                >
                  {value}
                </li>
              ))}
              <li
                key="Math"
                className={style.boldText}
                onClick={() => {
                  setSchoolClass("Math");
                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }}
              >
                Math
              </li>
              {mathClasses?.map((value) => (
                <li
                  key={value}
                  onClick={() => {
                    setSchoolClass(value);
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                  }}
                >
                  {value}
                </li>
              ))}
              <li
                key="French"
                className={style.boldText}
                onClick={() => {
                  setSchoolClass("French");
                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }}
              >
                French
              </li>
              <li
                key="Arabic"
                className={style.boldText}
                onClick={() => {
                  setSchoolClass("Arabic");
                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }}
              >
                Arabic
              </li>
              <li
                key="Electives"
                className={style.boldText}
                onClick={() => {
                  setSchoolClass("Electives");
                  document.getElementById("dropdownMenu").style.display =
                    "none";
                }}
              >
                Electives
              </li>
              {electives?.map((value) => (
                <li
                  key={value}
                  onClick={() => {
                    setSchoolClass(value);
                    document.getElementById("dropdownMenu").style.display =
                      "none";
                  }}
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {current == 3 && (
        <>
          <div
            style={{
              width: "65vw",
              height: "450px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <LoadingCircle
              style={{ marginLeft: "auto", marginRight: "auto" }}
            />
            <h1
              style={{ fontFamily: "var(--manrope-font)", marginLeft: "20px" }}
            >
              Uploading images...
            </h1>
          </div>
        </>
      )}
      {current == 4 && (
        <>
          {/* Congratulation page */}
          <h1 className={style.title}>Congratulations 🎉</h1>
          <p className={style.subtext}>
            You have successfully shared your notes and earned:
          </p>
          <h1 className={style.points}>+{points} points</h1>
        </>
      )}
      <p
        style={{ display: current != 1 && current != 4 ? "block" : "none" }}
        className={style.back}
        onClick={() => {
          if (current == 2) {
            setCurrent(1);
            setError("");
          } else if (current == 3) {
            setCurrent(2);
            setError("");
          }
        }}
      >
        Back
      </p>
      <button
        className={style.button}
        onClick={async () => {
          if (imageArray.length > 0) {
            setError("Must upload at least one image");
          }
          if (current == 1) {
            setCurrent(2);
          }
          if (current == 2 && !title) {
            document.getElementById("title").placeholder = "Must have a title";
            document.getElementById("title").style.borderBottom =
              "2px solid var(--danger-color)";
          }
          if (current == 2 && !schoolClass) {
            document.getElementById("dropdownClass").style.border =
              "1px solid red";
          }
          if (current == 2 && schoolClass && title) {
            setCurrent(3);
            try {
              const response = await fetch("/api/notes/create_notes", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: title,
                  notes: document.getElementById("textarea").value
                    ? document.getElementById("textarea").value
                    : "",
                  category: schoolClass,
                  publisherId: JSON.parse(localStorage.getItem("userInfo"))._id,
                  upvotes: 0,
                  downvotes: 0,
                  aiRating: 60,
                  type: "images",
                  images: imageArray,
                }),
              });
              if (response.ok) {
                if (!localStorage.getItem("dailyImageTimer")) {
                  localStorage.setItem(
                    "dailyImageTimer",
                    JSON.stringify({
                      date: new Date().toUTCString().slice(5, 16),
                      time: 0,
                    })
                  );
                }
                if (
                  JSON.parse(localStorage.getItem("dailyImageTimer")).date !=
                  new Date().toUTCString().slice(5, 16)
                ) {
                  localStorage.setItem(
                    "dailyImageTimer",
                    JSON.stringify({
                      date: new Date().toUTCString().slice(5, 16),
                      time: 0,
                    })
                  );
                }
                const currentTime = JSON.parse(
                  localStorage.getItem("dailyImageTimer")
                ).time;

                if (currentTime < 100) {
                  let imagesUploaded = imageArray.length * 20;
                  let amount;
                  if (currentTime + imagesUploaded >= 100) {
                    amount == 100;
                    imagesUploaded = 100 - imagesUploaded;
                  } else {
                    amount = currentTime + imagesUploaded;
                  }
                  localStorage.setItem(
                    "dailyImageTimer",
                    JSON.stringify({
                      date: new Date().toUTCString().slice(5, 16),
                      time: currentTime + imagesUploaded,
                    })
                  );

                  await fetch("/api/profile/add_community_minutes", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: JSON.parse(localStorage.getItem("userInfo"))._id,
                      points: imagesUploaded,
                    }),
                  });
                  setPoints(imagesUploaded);
                  setCurrent(4);
                } else {
                  setPoints("Enough");
                  setCurrent(4);
                }
              } else {
                setCurrent(4);
              }
            } catch (error) {
              setError(error);
            }
          }
          if (current == 4) {
            setOpen(false);
            setCurrent(1);
            setImageArray([]);
            setTitle("");
            setSchoolClass();
          }
        }}
      >
        {current == 2 ? "Publish" : current == 4 ? "Finish" : "Next"}
      </button>
      <input
        type="file"
        id="imageUploadInput"
        style={{ display: "none" }}
        accept="image/jpeg, image/png, image/gif, image/webp"
        capture="user"
        onChange={uploadImage}
      ></input>
    </Modal>
  );
}