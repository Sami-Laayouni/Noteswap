/* Modal used to create events */

import style from "./createEvent.module.css";

import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";

import { useContext, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { IoOpenOutline } from "react-icons/io5";

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
  const [eventType, setEventType] = useState("");
  const [desc, setDesc] = useState("");
  const [communityService, setCommunityService] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [banner, setBanner] = useState(
    "https://api.dicebear.com/8.x/shapes/svg?seed=Shado"
  );
  const [max, setMax] = useState(50);
  const sectionRef = useRef(null);
  const [name, setName] = useState("");
  const [req, setReq] = useState("");
  const [category, setCategory] = useState("");
  const [tlocation, setTLocation] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [schools, setSchools] = useState("");
  const [members, setMembers] = useState(null);
  const [attendees, setAttendees] = useState(0);

  const [eventMode, setEventMode] = useState("physical"); // 'online' or 'physical'
  const [location, setLocation] = useState("");
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [reqPhone, setReqPhone] = useState(true);

  const [allowAllMembers, setAllowAllMembers] = useState(false);
  const [allowMeetingMembers, setAllowMeetingMembers] = useState(false);
  const [allowVolunteer, setAllowVolunteer] = useState(false);

  const currencies = [{ code: "MAD", name: "Moroccan Dirham" }];

  const [tickets, setTickets] = useState([]);
  const [ticketName, setTicketName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketAmount, setTicketAmount] = useState("");

  const [currency, setCurrency] = useState(currencies[0].code); // Default currency
  const [locationName, setLocationName] = useState("");

  const [allowSchoolSee, setAllowSchoolSee] = useState(false);
  const [allowSchoolVolunteer, setAllowSchoolVolunteer] = useState(false);

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

  const handleChange = (event) => {
    setEventType(event.target.value);
  };

  // Fetch all the schools
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchLocations = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(url);
    const data = await response.json();
    setSuggestions(
      data.map((item) => ({
        label: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }))
    );
  };

  // Handle input change
  const handleChangeLocation = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 2) {
      fetchLocations(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

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

        setBanner(url);
      };
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.label);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  const [presenceStatus, setPresenceStatus] = useState({});

  // Function to toggle presence status
  const togglePresence = (volunteerId) => {
    setPresenceStatus((prevStatus) => ({
      ...prevStatus,
      [volunteerId]: !prevStatus[volunteerId],
    }));
  };

  useEffect(() => {
    if (members) {
      const initialStatus = members.reduce((status, volunteer) => {
        status[volunteer.userId] = false; // Default to 'absent' (false)
        return status;
      }, {});
      setPresenceStatus(initialStatus);
    }
  }, [members]);

  const removeTicket = (id) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  const showPosition = async (position) => {
    setLocation([position.coords.latitude, position.coords.longitude]);
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
    const response = await fetch(url);
    const data = await response.json();
    setLocationName(
      `${data.address.town ? `${data.address.town},` : ""} ${
        data.address.country
      }`
    );
    setInput(
      `${data.address.town ? `${data.address.town},` : ""} ${
        data.address.country
      }`
    );
  };

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
          : current == 7
          ? "Select type of event"
          : current == 8
          ? "Create Tickets"
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
              if (current == 1) {
                setCurrent(7);
                return;
              }
              if (current == 7) {
                setCurrent(2);
                return;
              }

              if (current == 2 && eventType == "ticketed") {
                setCurrent(8);
                return;
              }
              if (current == 3 && eventType == "hybrid") {
                setCurrent(8);
                return;
              }

              if (current == 8) {
                if (tickets.length > 0) {
                  setCurrent(9);
                  return;
                } else {
                  setMessage("Must have at least one ticket");
                  return;
                }
              }
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
                if (eventType != "volunteer") {
                  setCurrent(8);
                } else {
                  setCurrent(9);
                }
              }
            } else if (current == 9) {
              setCurrent(4);
            } else if (current == 3 && !business) {
              setCurrent(11);
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
                  // New ones
                  typeOfEvent: "volunteer",
                  onlyAllowSchoolVolunteers: allowSchoolVolunteer,
                  tickets: tickets,
                  eventMode: eventMode,
                  attendees: attendees,
                  askForPhone: reqPhone,
                  locationName: locationName,
                  eventImage: "",
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
                  teacher_id: JSON.parse(localStorage.getItem("userInfo"))._id,
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
                  associationId: associationInfo?._id || "",
                  associationProfilePic: associationInfo.icon,
                  sponsoredLocations: tlocation,
                  school_id: JSON.parse(localStorage.getItem("userInfo"))
                    .schoolId,
                  // New ones
                  typeOfEvent: eventType,
                  onlyAllowSchoolVolunteers: allowVolunteer,
                  tickets: tickets,
                  eventMode: eventMode,
                  attendees: attendees,
                  askForPhone: reqPhone,
                  locationName: locationName,
                  eventImage: banner,

                  onlyAllowSchoolSee: allowSchoolSee,
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
                if (tlocation.location > 0) {
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
                }

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
              setTickets([]);
            } else if (current == 6) {
              setCurrent(9);
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
                placeholder="Enter a detailed description of your event"
                value={desc}
                type="text"
                minLength={20}
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
                Date and Time of the Event
              </label>
              <span>{t("from")}: </span>
              <input
                style={{ marginLeft: "10px" }}
                className={style.date}
                type="datetime-local"
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
                type="datetime-local"
                min={today}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                required
              />

              <label className={style.labelForInput}>Type of Event</label>
              <select
                className={style.input}
                value={eventMode}
                onChange={(e) => setEventMode(e.target.value)}
              >
                <option value="physical">Physical</option>
                <option value="online">Online</option>
              </select>

              {eventMode === "physical" && (
                <>
                  <div id="venueOfEvent">
                    <label className={style.labelForInput}>
                      Venue of Event
                    </label>
                    <input
                      type="text"
                      className={style.input}
                      value={input}
                      onChange={handleChangeLocation}
                      placeholder="Enter location"
                      onBlur={() => setShowSuggestions(false)}
                      onFocus={() => input && setShowSuggestions(true)}
                      style={{ width: "80%" }}
                    />

                    <button
                      onClick={async () => {
                        navigator.geolocation.getCurrentPosition(showPosition);
                      }}
                      type="button"
                      className={style.button}
                      style={{
                        position: "relative",
                        top: "0px",
                        left: "0px",
                        borderRadius: "8px",
                      }}
                    >
                      Use Current Location
                    </button>
                  </div>

                  <p
                    style={{
                      textDecoration: "underline",
                      fontFamily: "var(--manrope-font)",
                      color: "var(--accent-color)",
                      cursor: "pointer",
                    }}
                    id="wantMorePrecise"
                    onClick={() => {
                      document.getElementById("wantMorePrecise").style.display =
                        "none";
                      document.getElementById("morePrecise").style.display =
                        "block";
                      document.getElementById("venueOfEvent").style.display =
                        "none";
                    }}
                  >
                    Want more precise location?
                  </p>

                  <div style={{ display: "none" }} id="morePrecise">
                    <label className={style.labelForInput}>
                      Venue of Event
                    </label>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "33% 33% 33%",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <input
                        type="text"
                        className={style.input}
                        value={locationName}
                        onChange={(e) => {
                          setLocationName(e.target.value);
                        }}
                        placeholder="Enter venue name"
                      />{" "}
                      <input
                        value={location[0]}
                        onChange={(e) => {
                          setLocation([e.target.value, location[1]]);
                        }}
                        type="number"
                        className={style.input}
                        placeholder="Enter latitude of location"
                      />
                      <input
                        value={location[1]}
                        onChange={(e) => {
                          setLocation([location[0], e.target.value]);
                        }}
                        type="number"
                        className={style.input}
                        placeholder="Enter longitude of location"
                      />
                    </div>
                    <br></br>
                    <p
                      style={{
                        textDecoration: "underline",
                        fontFamily: "var(--manrope-font)",
                        color: "var(--accent-color)",
                        cursor: "pointer",
                        display: "inline",
                      }}
                      onClick={() => {
                        document.getElementById(
                          "wantMorePrecise"
                        ).style.display = "block";
                        document.getElementById("morePrecise").style.display =
                          "none";
                        document.getElementById("venueOfEvent").style.display =
                          "block";
                      }}
                    >
                      Go back to least precise location?
                    </p>
                    <Link
                      style={{ display: "inline", marginLeft: "10px" }}
                      href={
                        "https://support.google.com/maps/answer/18539?hl=en&co=GENIE.Platform%3DDesktop#:~:text=of%20a%20place-,On%20your%20computer%2C%20open%20Google%20Maps.,decimal%20format%20at%20the%20top."
                      }
                      target="_blank"
                    >
                      Use Google Maps to Find Coordinates <IoOpenOutline />
                    </Link>
                  </div>

                  {suggestions.length > 0 && (
                    <ul
                      className={style.listFlow}
                      style={{
                        listStyleType: "none",
                        padding: 0,
                      }}
                    >
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setInput(suggestion.label);
                            setLocation([suggestion.lat, suggestion.lon]);
                            setLocationName(suggestion.label);
                            handleSuggestionClick(suggestion);
                          }}
                        >
                          {suggestion.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {eventMode === "online" && (
                <>
                  <label className={style.labelForInput}>
                    Online Event Link
                  </label>
                  <input
                    placeholder="Enter the URL for the online event"
                    className={style.input}
                    type="url"
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                  />
                </>
              )}

              <button className={style.button} type="submit">
                {t("next")}
              </button>
            </>
          )}

          {/* Basic information */}
          {current == 3 && (
            <>
              {" "}
              <label className={style.labelForInput}>{t("req_to_join")} </label>
              <textarea
                className={style.input}
                style={{
                  height: "200px",
                  paddingTop: "10px",
                  resize: "none",
                }}
                placeholder={t("enter_req_to_join")}
                value={req}
                type="text"
                minLength={10}
                maxLength={10000}
                onChange={(e) => {
                  setReq(e.target.value);
                }}
              />
              <label className={style.labelForInput}>Registration Form</label>
              <input
                className={style.input}
                placeholder="Form For Volunteers to Fill Out"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                type="url"
              />
              <div
                className={style.checkboxContainer}
                style={{ marginLeft: "0px", paddingLeft: "0px" }}
              >
                <input
                  type="checkbox"
                  id="phoneNumberCheck"
                  value={reqPhone}
                  name="phoneNumberCheck"
                  onChange={(e) => {
                    setReqPhone(e.target.value);
                  }}
                  className={style.checkboxInput}
                />
                <label htmlFor="phoneNumberCheck">
                  Ask For Phone Number When Signing up (Recommended)
                </label>
              </div>
              <button className={style.button} type="submit">
                {business ? t("next") : t("finish")}
              </button>
            </>
          )}

          {/* Targeting the ad */}
          {current === 4 && (
            <>
              <label className={style.labelForInput}>
                Target Specific Schools Near You
              </label>
              <div className={style.checkboxContainer}>
                {schools.map(function (value) {
                  return (
                    <label
                      style={{ marginTop: "5px" }}
                      key={value.name}
                      className={style.checkboxLabel}
                    >
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
                    Only allow members in this association to volunteer.
                  </p>

                  <br></br>
                  <input
                    style={{ display: "inline", cursor: "pointer" }}
                    type="checkbox"
                    checked={allowVolunteer}
                    onChange={() => {
                      setAllowVolunteer(!allowVolunteer);
                    }}
                  />
                  <p style={{ display: "inline" }}>
                    Only allow members from these schools to volunteer.
                  </p>
                  <br></br>
                  <input
                    style={{ display: "inline", cursor: "pointer" }}
                    type="checkbox"
                    checked={allowSchoolSee}
                    onChange={() => {
                      setAllowSchoolSee(!allowSchoolSee);
                    }}
                  />
                  <p style={{ display: "inline" }}>
                    Only allow members from these schools to see this event.
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

          {/* Marketing (share to others) */}
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

          {/* Mark Attendance of Members (Business Only)*/}
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

          {/* Type of Event (Ie: Hybrid, Volunteering, Tickets) (Business Only)*/}
          {current == 7 && (
            <>
              <select
                className={style.input}
                value={eventType}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select an Event Type
                </option>
                <option value="hybrid">Hybrid Event</option>
                <option value="ticketed">Ticketed Event</option>
                <option value="volunteer">Volunteer Sign-Up Event</option>
              </select>
              <div>
                {eventType === "hybrid" && (
                  <p style={{ fontFamily: "var(--manrope-font)" }}>
                    This event combines aspects of both ticketed entries and
                    volunteer opportunities. Ideal for large-scale events such
                    as festivals or charity events, where you can engage
                    attendees as participants or volunteers.
                  </p>
                )}
                {eventType === "ticketed" && (
                  <p style={{ fontFamily: "var(--manrope-font)" }}>
                    Focuses on events where attendees purchase tickets to
                    participate. Suitable for concerts, seminars, and exclusive
                    gatherings. Note: Volunteers cannot signup to this event.
                  </p>
                )}
                {eventType === "volunteer" && (
                  <p style={{ fontFamily: "var(--manrope-font)" }}>
                    Aims at gathering volunteers for community services, event
                    staffing, or long-term volunteering roles.
                  </p>
                )}
              </div>
              {eventType && eventType != "ticketed" && (
                <>
                  {" "}
                  <label className={style.labelForInput}>
                    {t("cs_offered")}
                  </label>
                  <input
                    className={style.input}
                    min={0}
                    max={2500}
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
                </>
              )}

              {eventType && eventType != "volunteer" && (
                <>
                  <label className={style.labelForInput}>
                    Maximum Number Of Attendees That Can Sign Up
                  </label>
                  <input
                    className={style.input}
                    min={0}
                    type="number"
                    value={attendees}
                    onChange={(e) => {
                      setAttendees(e.target.value);
                    }}
                    required
                  />
                </>
              )}

              <button
                className={style.button}
                disabled={!eventType}
                type="submit"
              >
                {t("next")}
              </button>
            </>
          )}

          {/* Tickets (Business Only)*/}
          {current == 8 && (
            <>
              <div>
                <form>
                  <input
                    type="text"
                    placeholder="Ticket Name"
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    required
                    className={style.input}
                  />
                  <input
                    type="number"
                    placeholder="Ticket Price (leave blank for free)"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    className={style.input}
                    style={{ marginTop: "20px" }}
                    min={0}
                    max={1000000}
                  />
                  <input
                    type="number"
                    placeholder="Maximum amount of tickets"
                    value={ticketAmount}
                    onChange={(e) => setTicketAmount(e.target.value)}
                    className={style.input}
                    style={{ marginTop: "20px" }}
                    min={0}
                    max={1000000}
                  />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    disabled={!ticketPrice} // Disable currency selection if price is not set
                    className={style.input}
                    style={{ marginTop: "20px" }}
                  >
                    {currencies.map((curr) => (
                      <option
                        key={curr.code}
                        value={curr.code}
                      >{`${curr.code} - ${curr.name}`}</option>
                    ))}
                  </select>
                  <button
                    className={style.button}
                    style={{
                      position: "relative",
                      left: "0px",
                      top: "0px",
                      marginTop: "20px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      const newTicket = {
                        id: tickets.length + 1,
                        name: ticketName,
                        price: ticketPrice || "Free", // If no price is entered, it defaults to 'Free'
                        currency: ticketPrice ? currency : "", // Currency only applies if price is set
                        max: ticketAmount,
                      };
                      setTickets([...tickets, newTicket]);
                      setTicketName("");
                      setTicketPrice("");
                      setCurrency(currencies[0].code); // Reset to default currency after adding
                    }}
                  >
                    Add Ticket
                  </button>
                </form>

                <ul
                  style={{
                    listStyle: "none",
                    paddingLeft: "0px",
                    fontFamily: "var(--manrope-font)",
                    display: "grid",
                    gridTemplateColumns: "33% 33% 33%",
                  }}
                >
                  {tickets.map((ticket) => (
                    <li key={ticket.id}>
                      {ticket.name} - {ticket.price}{" "}
                      {ticket.price && `${currency}`}
                      <button
                        style={{
                          position: "relative",
                          left: "0px",
                          top: "0px",
                          marginLeft: "10px",
                          marginTop: "15px",
                        }}
                        className={style.button}
                        onClick={() => removeTicket(ticket.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button className={style.button} type="submit">
                {t("next")}
              </button>
            </>
          )}

          {/* Upload Event Image*/}
          {current == 9 && (
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
                <h1>Upload your event&apos;s banner</h1>
                <img
                  alt="Profile"
                  src={banner}
                  width={600}
                  height={300}
                  style={{
                    borderRadius: "20px",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
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
              <button className={style.button} type="submit">
                {t("next")}
              </button>
            </>
          )}

          {current == 11 && <h1>Creating an Event....</h1>}
        </form>

        {/* Back button */}
        {current != 1 && current != 4 && (
          <button
            onClick={() => {
              if (current != 6) {
                if (current == 7) {
                  setCurrent(1);
                  return;
                }
                if (current == 2 && business) {
                  setCurrent(7);
                  return;
                }

                if (current == 8 && eventType == "ticketed") {
                  setCurrent(2);
                  return;
                }

                if (current == 8 && eventType == "hybrid") {
                  setCurrent(3);
                  return;
                }

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
