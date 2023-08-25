import Modal from "../Modal";
import style from "./becomeTutor.module.css";
import { useContext, useEffect, useState } from "react";
import ModalContext from "../../context/ModalContext";
import { MdOutlineArrowDropDown } from "react-icons/md";

/**
 * Become tutor
 * @date 8/13/2023 - 5:06:40 PM
 *
 * @export
 * @return {*}
 */
export default function BecomeTutor() {
  const { tutor } = useContext(ModalContext);
  const [open, setOpen] = tutor;
  const [schoolClass, setSchoolClass] = useState();
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const [current, setCurrent] = useState(1);
  const [email, setEmail] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({ ...prevCheckboxes, [name]: checked }));
  };
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      if (JSON.parse(localStorage.getItem("userInfo")).email) {
        setEmail(JSON.parse(localStorage.getItem("userInfo")).email);
      }
    }
  }, []);

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
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  if (!open) {
    return null;
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Become a tutor on Noteswap"
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (current == 2) {
            document.getElementById("finish").innerText = "Saving...";
            const response = await fetch("/api/tutor/become_a_tutor", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: JSON.parse(localStorage.getItem("userInfo"))._id,
                email: email,
                desc: description,
                subject: schoolClass,
                days_available: Object.entries(checkboxes)
                  .filter(([day, value]) => value === true)
                  .map(([day, value]) => day)
                  .join(", "),
                time_available: `${startTime}-${endTime}`,
              }),
            });
            if (response.ok) {
              setCheckboxes({
                Monday: false,
                Tuesday: false,
                Wednesday: false,
                Thursday: false,
                Friday: false,
                Saturday: false,
                Sunday: false,
              });
              setError();
              setStartTime("10:00");
              setEndTime("12:00");
              setSchoolClass();
              setOpen(false);
            } else {
              setError(await response.text());
            }
          } else {
            setCurrent(2);
          }
        }}
      >
        {current == 2 && (
          <>
            <label className={style.labelForInput}>
              Description (Tell us a little bit about yourself){" "}
            </label>
            <textarea
              className={style.textarea}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required
            ></textarea>
          </>
        )}
        {current == 1 && (
          <>
            <label className={style.labelForInput}>I want to teach: </label>
            <div
              className={style.dropdown}
              id="dropdownClass"
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
            >
              {schoolClass ? schoolClass : "Select a class"}
              <MdOutlineArrowDropDown
                style={{ verticalAlign: "middle", marginLeft: "5px" }}
                size={25}
              />
            </div>

            <div className={style.container}>
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
            </div>
            {/* Select dates available */}
            <label className={style.labelForInput}>
              Select available dates
            </label>
            <ul className={style.dates}>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Monday"
                    checked={checkboxes.Monday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Monday</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Tuesday"
                    checked={checkboxes.Tuesday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Tuesday</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Wednesday"
                    checked={checkboxes.Wednesday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Wednesday</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Thursday"
                    checked={checkboxes.Thursday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Thursday</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Friday"
                    checked={checkboxes.Friday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Friday</span>
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="Saturday"
                    checked={checkboxes.Saturday}
                    onChange={handleCheckboxChange}
                  />
                  <span>Saturday</span>
                </label>
              </li>
            </ul>
            <section className={style.container}>
              <label className={style.labelForInput}>At this time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={startTime}
                onChange={handleStartTimeChange}
                className={style.time}
              />
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>-</span>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={endTime}
                onChange={handleEndTimeChange}
                className={style.time}
              />
            </section>
          </>
        )}
        <p className={style.error}>{error}</p>
        {current == 2 ? (
          <p
            className={style.back}
            onClick={() => {
              setCurrent(1);
            }}
          >
            Back
          </p>
        ) : (
          <></>
        )}
        <button id="finish" className={style.button} type="submit">
          {current == 1 ? "Next" : "Finish"}
        </button>
      </form>
    </Modal>
  );
}
