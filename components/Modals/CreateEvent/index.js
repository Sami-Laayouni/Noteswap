/* Modal used to create events */

import style from "./createEvent.module.css";

import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";

import { useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const CATEGORY = [
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

/**
 * Create event
 * @date 8/13/2023 - 5:08:25 PM
 *
 * @export
 * @return {*}
 */
export default function CreateEvent({ business, meeting }) {
  const { eventStatus } = useContext(ModalContext);
  const [open, setOpen] = eventStatus;
  const [current, setCurrent] = useState(1);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [communityService, setCommunityService] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [clicked, setClicked] = useState(false);
  const [max, setMax] = useState(50);
  const sectionRef = useRef(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("");
  const [req, setReq] = useState("");
  const [category, setCategory] = useState("");
  const [tlocation, setTLocation] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [schools, setSchools] = useState("");
  const [members, setMembers] = useState(null);

  const [allowAllMembers, setAllowAllMembers] = useState(false);
  const [allowMeetingMembers, setAllowMeetingMembers] = useState(false);

  let code;
  const [codes, setCodes] = useState(0);
  const { t } = useTranslation();

  // Function used to generate a random code
  function generateCode(length) {
    const charset = "abcdef0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }

  // Function to get all the schools (used for business)
  async function fetchSchools() {
    const response = await fetch("/api/schools/get_schools", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    setSchools(data);
  }

  // Fetch all the schools
  useEffect(() => {
    fetchSchools();
  }, []);

  const [presenceStatus, setPresenceStatus] = useState({});

  // Function to toggle presence status
  const togglePresence = (volunteerId) => {
    console.log(volunteerId);
    console.log(presenceStatus);
    setPresenceStatus((prevStatus) => ({
      ...prevStatus,
      [volunteerId]: !prevStatus[volunteerId],
    }));
  };

  useEffect(() => {
    if (members) {
      const initialStatus = members.reduce((status, volunteer) => {
        console.log(volunteer);
        status[volunteer.userId] = false; // Default to 'absent' (false)
        return status;
      }, {});
      setPresenceStatus(initialStatus);
    }
  }, [members]);

  // If not opened don't render
  if (!open) {
    return null;
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title={`${
        current == 1
          ? t("create_new_event")
          : current == 6
          ? "Record Attendance"
          : t("basic_information")
      }`}
    >
      <section className={style.container}>
        <form
          style={{ marginTop: "20px", marginLeft: "10px" }}
          onSubmit={async (e) => {
            e.preventDefault();

            // Increase current stage in the pipeline
            if (current != 4) {
              setCurrent(current + 1);
            } else {
              if (tlocation.length > 0) {
                setCurrent(current + 1);
              }
            }

            if (current == 3 && business) {
              if (meeting) {
                setCurrent(6);
                const members = await fetch("/api/association/get_members", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    associationId: JSON.parse(
                      localStorage.getItem("associationInfo")
                    )._id,
                  }),
                });
                const memo = await members.json();
                setMembers(memo.members);
              } else {
                setCurrent(4);
              }
            } else if (current == 3 && !business) {
              code = generateCode(24);
              setCodes(code);

              // Create a new event (not sponsored)
              const response = await fetch("/api/events/create_event", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: code,
                  title: title,
                  desc: desc,
                  category: category,
                  community_service_offered: communityService,
                  teacher_id: JSON.parse(localStorage.getItem("userInfo"))._id,
                  date_of_events: `${startDate} to ${endDate}`,
                  contact_email: JSON.parse(localStorage.getItem("userInfo"))
                    .email,
                  link_to_event: link ? link : "",
                  max: max,
                  location: location,
                  reqi: req,
                  sponsored: false,
                  sponsoredLocations: [],
                  createdAt: Date.now(),
                  associationProfilePic: null,
                  associationId: null,
                  school_id: JSON.parse(localStorage.getItem("userInfo"))
                    .schoolId,
                }),
              });

              if (response.ok) {
                const Tit = title;
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                await fetch("/api/email/send_event_email", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: `${
                      JSON.parse(localStorage.getItem("userInfo")).first_name
                    } ${
                      JSON.parse(localStorage.getItem("userInfo")).last_name
                    }`,
                    email: JSON.parse(localStorage.getItem("userInfo")).email,
                    event: Tit,
                    url: `${process.env.NEXT_PUBLIC_URL}signups/${code}`,
                  }),
                });
                if (userInfo && userInfo.schoolId) {
                  const schoolId = userInfo.schoolId;
                  const teacher = userInfo.first_name;
                  const options = {
                    method: "POST",
                    headers: {
                      Authorization: `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      included_segments: ["All"],
                      app_id: "3b28d10b-3b88-426f-8025-507667803b2a",
                      filters: [
                        {
                          field: "tag",
                          key: "schoolId",
                          relation: "=",
                          value: schoolId,
                        },
                      ],
                      headings: {
                        en: "New opportunity available!",
                        es: "¡Nueva oportunidad disponible!",
                        fr: "Nouvelle opportunité disponible !",
                        de: "Neue Möglichkeit verfügbar!",
                        it: "Nuova opportunità disponibile!",
                        pt: "Nova oportunidade disponível!",
                        nl: "Nieuwe mogelijkheid beschikbaar!",
                        ru: "Доступна новая возможность!",
                        zh: "新的机会现已开放!",
                        ja: "新しい機会が利用可能です!",
                        ar: "فرصة جديدة متاحة!",
                        hi: "नया अवसर उपलब्ध है!",
                        ko: "새로운 기회가 있습니다!",
                      },
                      url: "https://www.noteswap.org/event",
                      chrome_web_icon:
                        "https://storage.googleapis.com/noteswap-images/circle.png",
                      contents: {
                        en: `${teacher} posted a new event: '${title}' offering ${communityService} hours.`,
                        es: `${teacher} ha publicado un nuevo evento: '${title}', ofreciendo ${communityService} horas.`,
                        fr: `${teacher} a publié un nouvel événement : '${title}' offrant ${communityService} heures.`,
                        de: `${teacher} hat eine neue Veranstaltung gepostet: '${title}', Angebot: ${communityService} Stunden.`,
                        it: `${teacher} ha pubblicato un nuovo evento: '${title}', offerta ${communityService} ore.`,
                        pt: `${teacher} postou um novo evento: '${title}' oferecendo ${communityService} horas.`,
                        nl: `${teacher} heeft een nieuw evenement geplaatst: '${title}' met als aanbod ${communityService} uur.`,
                        ru: `${teacher} разместил новое событие: '${title}', предлагается ${communityService} часов.`,
                        zh: `${teacher} 发布了新活动：'${title}'，提供${communityService}小时。`,
                        ja: `${teacher}が新しいイベント'${title}'を投稿しました。提供内容：${communityService}時間。`,
                        ar: `نشر ${teacher} حدثًا جديدًا: '${title}' يقدم ${communityService} ساعات.`,
                        hi: `${teacher} ने एक नया इवेंट पोस्ट किया: '${title}' जिसमें ${communityService} घंटे दिए जा रहे हैं।`,
                        ko: `${teacher}가 새 이벤트 '${title}'를 게시했습니다. 제공: ${communityService}시간.`,
                      },
                    }),
                  };

                  // Notify users at the same school
                  await fetch(
                    "https://onesignal.com/api/v1/notifications",
                    options
                  )
                    .then((response) => response.json())
                    .then((response) => console.log(response))
                    .catch((err) => console.error(err));
                }
              } else {
                console.log(await response.text());
              }
              setCurrent(5);
            } else if (current == 4) {
              if (tlocation.length > 0) {
                code = generateCode(24);
                setCodes(code);
                function createFiltersForSchoolIds(schoolIds) {
                  // Initialize an empty array for the filters
                  const filters = [];

                  // Iterate through each schoolId in the array
                  schoolIds.forEach((schoolId, index) => {
                    // Add a condition for the current schoolId
                    filters.push({
                      field: "tag",
                      key: "schoolId",
                      relation: "=",
                      value: schoolId.toString(),
                    });

                    // If this is not the last item, add an OR operator
                    if (index < schoolIds.length - 1) {
                      filters.push({ operator: "OR" });
                    }
                  });

                  return filters;
                }
                const associationInfo = JSON.parse(
                  localStorage.getItem("associationInfo")
                );

                const response = await fetch("/api/events/create_event", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: code,
                    title: title,
                    desc: desc,
                    category: category,
                    community_service_offered: communityService,
                    teacher_id: JSON.parse(localStorage.getItem("userInfo"))
                      ._id,
                    date_of_events: `${startDate} to ${endDate}`,
                    contact_email: JSON.parse(localStorage.getItem("userInfo"))
                      .email,
                    link_to_event: link ? link : "",
                    max: max,
                    location: location,
                    reqi: req,
                    createdAt: Date.now(),
                    sponsored: true,
                    attendance: presenceStatus,
                    additional: allowAllMembers
                      ? "allowAll"
                      : allowMeetingMembers
                      ? "allowMeeting"
                      : null,
                    associationId: associationInfo._id,
                    associationProfilePic: associationInfo.icon,
                    sponsoredLocations: tlocation,
                    school_id: JSON.parse(localStorage.getItem("userInfo"))
                      .schoolId,
                  }),
                });
                // Add sponsored locations filter
                if (response.ok) {
                  const Tit = title;
                  const userProfile = JSON.parse(
                    localStorage.getItem("userInfo")
                  ).profile_picture;
                  const associationInfo = JSON.parse(
                    localStorage.getItem("associationInfo")
                  );

                  const options = {
                    method: "POST",
                    headers: {
                      Authorization: `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      included_segments: ["All"],
                      filters: createFiltersForSchoolIds(tlocation),
                      app_id: "3b28d10b-3b88-426f-8025-507667803b2a",
                      headings: {
                        en: "New opportunity available!",
                        es: "¡Nueva oportunidad disponible!",
                        fr: "Nouvelle opportunité disponible !",
                        de: "Neue Möglichkeit verfügbar!",
                        it: "Nuova opportunità disponibile!",
                        pt: "Nova oportunidade disponível!",
                        nl: "Nieuwe mogelijkheid beschikbaar!",
                        ru: "Доступна новая возможность!",
                        zh: "新的机会现已开放!",
                        ja: "新しい機会が利用可能です!",
                        ar: "فرصة جديدة متاحة!",
                        hi: "नया अवसर उपलब्ध है!",
                        ko: "새로운 기회가 있습니다!",
                      },
                      url: "https://www.noteswap.org/event",
                      chrome_web_icon: associationInfo?.icon,
                      contents: {
                        en: `${associationInfo.name} posted a new event '${title}' offering ${communityService} hours.`,
                      },
                    }),
                  };

                  await fetch(
                    "https://onesignal.com/api/v1/notifications",
                    options
                  )
                    .then((response) => response.json())
                    .then((response) => console.log(response))
                    .catch((err) => console.error(err));

                  await fetch("/api/email/send_event_email", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: `${
                        JSON.parse(localStorage.getItem("userInfo")).first_name
                      } ${
                        JSON.parse(localStorage.getItem("userInfo")).last_name
                      }`,
                      email: JSON.parse(localStorage.getItem("userInfo")).email,
                      event: Tit,
                      url: `${process.env.NEXT_PUBLIC_URL}signups/${code}`,
                    }),
                  });
                } else {
                  console.log(await response.text());
                }
                setCurrent(5);
              }
            } else if (current == 5) {
              setCategory("");
              setCurrent(1);
              setTitle("");
              setDesc("");
              setStartDate("");
              setEndDate("");
              setMessage("");
              setName("");
              setLink("");
              setReq("");
              setLocation("");
              setPresenceStatus({});
              setMax(50);
              setCommunityService(0);
              setOpen(false);
            } else if (current == 6) {
              setCurrent(4);
            }
          }}
        >
          {current == 1 && (
            <>
              <label className={style.labelForInput}>
                {t("name_of_the_event")}
              </label>
              <input
                placeholder={t("enter_name_event")}
                className={style.input}
                value={title}
                minLength={3}
                maxLength={1000}
                type="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                required
                autoFocus
              />
              <label className={style.labelForInput}>
                {t("description_event")}
              </label>
              <textarea
                className={style.input}
                style={{ height: "250px", paddingTop: "10px", resize: "none" }}
                placeholder={t("enter_detailed_event")}
                value={desc}
                type="text"
                minLength={300}
                maxLength={10000}
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                required
              />

              <button className={style.button} type="submit">
                {t("next")}
              </button>
            </>
          )}
          {current == 2 && (
            <>
              <label className={style.labelForInput}>{t("cs_offered")}</label>
              <input
                className={style.input}
                min={0}
                max={250}
                type="number"
                value={communityService}
                onChange={(e) => {
                  setCommunityService(e.target.value);
                }}
                required
              />
              <label className={style.labelForInput}>
                {t("number_volunteer")}{" "}
              </label>
              <input
                className={style.input}
                min={0}
                max={10000}
                type="number"
                value={max}
                onChange={(e) => {
                  setMax(e.target.value);
                }}
                required
              />
              <label className={style.labelForInput}>
                {t("category_event")}{" "}
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
                {CATEGORY?.map(function (value) {
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>

              <label className={style.labelForInput}>
                {t("date_of_event")}
              </label>
              <span>{t("from")}: </span>
              <input
                style={{ marginLeft: "10px" }}
                className={style.date}
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                required
              />
              <span>{t("to")}: </span>
              <input
                style={{ marginLeft: "10px" }}
                className={style.date}
                type="date"
                min={today}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                required
              />

              <button className={style.button} type="submit">
                {t("next")}
              </button>
            </>
          )}
          {current == 3 && (
            <>
              {" "}
              <label className={style.labelForInput}>
                {t("location_of_event")}{" "}
              </label>
              <input
                placeholder={t("enter_location_of_event")}
                className={style.input}
                value={location}
                minLength={3}
                maxLength={1000}
                type="text"
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
                required
                autoFocus
              />
              <label className={style.labelForInput}>{t("req_to_join")} </label>
              <textarea
                className={style.input}
                style={{ height: "250px", paddingTop: "10px", resize: "none" }}
                placeholder={t("enter_req_to_join")}
                value={req}
                type="text"
                minLength={300}
                maxLength={10000}
                onChange={(e) => {
                  setReq(e.target.value);
                }}
                required
              />
              <button className={style.button} type="submit">
                {business ? t("next") : t("finish")}
              </button>
            </>
          )}
          {current === 4 && (
            <>
              <label className={style.labelForInput}>
                {t("select_location")}{" "}
              </label>
              <div className={style.checkboxContainer}>
                {schools.map(function (value) {
                  return (
                    <label key={value.name} className={style.checkboxLabel}>
                      <input
                        type="checkbox"
                        value={value.id}
                        checked={tlocation.includes(value.id)}
                        onChange={(e) => {
                          const selectedId = value.id;
                          setTLocation((prevLocations) => {
                            if (prevLocations.includes(selectedId)) {
                              return prevLocations.filter(
                                (id) => id !== selectedId
                              );
                            } else {
                              return [...prevLocations, selectedId];
                            }
                          });
                        }}
                      />
                      {value.name} ({value.location}) {value.users}{" "}
                      {value.users === 1 ? t("user") : t("users")}{" "}
                      {t("from_this_school")}
                    </label>
                  );
                })}
              </div>
              {business && (
                <>
                  <h2>Additional Restrictions</h2>
                  <input
                    style={{ display: "inline", cursor: "pointer" }}
                    type="checkbox"
                    checked={allowAllMembers}
                    onChange={() => {
                      setAllowAllMembers(!allowAllMembers);
                      if (!allowAllMembers) {
                        // If we're about to set allowAllMembers to true
                        setAllowMeetingMembers(false); // Ensure allowMeetingMembers is set to false
                      }
                    }}
                  />
                  <p style={{ display: "inline" }}>
                    Only allow members in this association to sign up.
                  </p>
                  <br></br>
                  {meeting && (
                    <>
                      <input
                        style={{ display: "inline", cursor: "pointer" }}
                        type="checkbox"
                        checked={allowMeetingMembers}
                        onChange={() => {
                          setAllowMeetingMembers(!allowMeetingMembers);
                          if (!allowMeetingMembers) {
                            // If we're about to set allowMeetingMembers to true
                            setAllowAllMembers(false); // Ensure allowAllMembers is set to false
                          }
                        }}
                      />

                      <p style={{ display: "inline" }}>
                        Only allow members that attended this meeting to sign
                        up.
                      </p>
                    </>
                  )}
                </>
              )}
              <div>
                <p>
                  {t("a_total_of")}{" "}
                  <span style={{ color: "var(--accent-color)" }}>
                    {tlocation.reduce(
                      (totalUsers, selectedId) =>
                        totalUsers +
                          schools.find((school) => school.id === selectedId)
                            ?.users || 0,
                      0
                    )}
                  </span>{" "}
                  {t("users_from")}{" "}
                  <span style={{ color: "var(--accent-color)" }}>
                    {tlocation.length}
                  </span>{" "}
                  {tlocation.length == 1 ? t("school") : t("schools")}{" "}
                  {t("will_be_notified")}
                </p>
              </div>
              <button className={style.button} type="submit">
                {t("finish")}
              </button>
            </>
          )}

          {current == 5 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "60vh",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--manrope-font)",
                  textAlign: "center",
                  fontSize: "1.8rem",
                  color: "var(--accent-color)",
                }}
              >
                {t("your_event")}{" "}
              </h1>
              <p
                style={{
                  fontFamily: "var(--manrope-font)",
                  textAlign: "center",
                  fontSize: "1rem",
                }}
              >
                {t("signup_users")}{" "}
                <Link
                  href={`${process.env.NEXT_PUBLIC_URL}signups/${codes}`}
                  target="_blank"
                  style={{
                    textDecoration: "underline",
                    color: "var(--accent-color)",
                  }}
                >
                  {process.env.NEXT_PUBLIC_URL}signups/{codes}
                </Link>
              </p>
              <button className={style.button} type="submit">
                {t("finish")}
              </button>
            </div>
          )}

          {current == 6 && (
            <>
              <p>Mark the attendance of members of the association.</p>
              <ul className={style.list}>
                {members?.map(function (value) {
                  return (
                    <li
                      key={value.userId}
                      id={`volunteer_${value.userId}`}
                      onClick={() => togglePresence(value.userId)}
                    >
                      <img
                        src={value.profilePicture}
                        alt="Profile Picture"
                        width={45}
                        height={45}
                        style={{
                          marginTop: "auto",
                          marginBottom: "auto",
                          display: "inline-block",
                          verticalAlign: "middle",
                          borderRadius: "50%",
                        }}
                      />
                      <p
                        style={{
                          display: "inline",
                          paddingLeft: "10px",
                        }}
                      >
                        {" "}
                        {value.name}
                      </p>
                      <span>
                        {" "}
                        ({presenceStatus[value.userId] ? "Present" : "Absent"})
                      </span>
                    </li>
                  );
                })}
              </ul>
              <button className={style.button} type="submit">
                {t("next")}
              </button>
            </>
          )}
        </form>

        {/* Back button */}
        {current != 1 && current != 4 && (
          <button
            onClick={() => {
              if (current != 6) {
                setCurrent(current - 1);
              } else {
                setCurrent(3);
              }
            }}
            className={style.back}
          >
            {t("back")}
          </button>
        )}
      </section>
    </Modal>
  );
}
