import style from "./createEvent.module.css";
import Modal from "../Modal";
import { useContext, useEffect, useState, useRef } from "react";
import ModalContext from "../../context/ModalContext";
import Link from "next/link";
import OneSignal from "react-onesignal";

/**
 * Create event
 * @date 8/13/2023 - 5:08:25 PM
 *
 * @export
 * @return {*}
 */
export default function CreateEvent({ business }) {
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
  function generateCode(length) {
    const charset = "abcdef0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }

    return password;
  }
  let code;
  const [codes, setCodes] = useState(0);

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
    console.log(data);
  }

  useEffect(() => {
    fetchSchools();
  }, []);

  if (!open) {
    return null;
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title={`${current == 1 ? "Create a new event" : "Basic information"}`}
    >
      <section className={style.container}>
        <form
          style={{ marginTop: "20px", marginLeft: "10px" }}
          onSubmit={async (e) => {
            e.preventDefault();
            setCurrent(current + 1);

            if (current == 3 && business) {
              setCurrent(4);
            } else if (current == 3 && !business) {
              code = generateCode(24);
              setCodes(code);
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
                  school_id: JSON.parse(localStorage.getItem("userInfo"))
                    .schoolId,
                }),
              });
              if (response.ok) {
                const Tit = title;
                const options = {
                  method: "POST",
                  headers: {
                    Authorization: `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    included_segments: ["All"],
                    app_id: "3b28d10b-3b88-426f-8025-507667803b2a",
                    headings: {
                      en: "New community service opportunity available!",
                      es: "¡Nueva oportunidad de servicio comunitario disponible!",
                      fr: "Nouvelle opportunité de service communautaire disponible !",
                      de: "Neue Möglichkeiten für Gemeindearbeit verfügbar!",
                      it: "Nuova opportunità di servizio alla comunità disponibile!",
                      pt: "Nova oportunidade de serviço comunitário disponível!",
                      nl: "Nieuwe gemeenschapsdienstmogelijkheid beschikbaar!",
                      ru: "Доступна новая возможность обслуживания сообщества!",
                      zh: "新的社区服务机会现已开放!",
                      ja: "新しいコミュニティサービスの機会が利用可能です!",
                      ar: "فرصة خدمة جديدة متاحة في المجتمع!",
                      hi: "समुदाय सेवा का नया अवसर उपलब्ध है!",
                      ko: "새로운 커뮤니티 서비스 기회가 있습니다!",
                    },
                    url: "https://www.noteswap.org/event",
                    chrome_web_icon:
                      "https://storage.googleapis.com/noteswap-images/circle.png",
                    contents: {
                      en: `New community service opportunity available! ${title}, ${communityService} hours offered`,
                      es: `¡Nueva oportunidad de servicio comunitario disponible! ${title}, se ofrecen ${communityService} horas`,
                      fr: `Nouvelle opportunité de service communautaire disponible ! ${title}, ${communityService} heures offertes`,
                      de: `Neue Möglichkeiten für Gemeindearbeit verfügbar! ${title}, ${communityService} Stunden angeboten`,
                      it: `Nuova opportunità di servizio alla comunità disponibile! ${title}, offerte ${communityService} ore`,
                      pt: `Nova oportunidade de serviço comunitário disponível! ${title}, oferecidas ${communityService} horas`,
                      nl: `Nieuwe gemeenschapsdienstmogelijkheid beschikbaar! ${title}, ${communityService} uur aangeboden`,
                      ru: `Доступна новая возможность обслуживания сообщества! ${title}, предлагается ${communityService} часов`,
                      zh: `新的社区服务机会现已开放！${title}，提供${communityService}小时`,
                      ja: `新しいコミュニティサービスの機会が利用可能です！${title}、提供される${communityService}時間`,
                      ar: `فرصة خدمة جديدة متاحة في المجتمع! ${title}، تُقدم ${communityService} ساعة`,
                      hi: `समुदाय सेवा का नया अवसर उपलब्ध है! ${title}, ${communityService} घंटे प्रस्तावित किए जाते हैं`,
                      ko: `새로운 커뮤니티 서비스 기회가 있습니다! ${title}, 제공되는 ${communityService} 시간`,
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
            } else if (current == 4) {
              code = generateCode(24);
              setCodes(code);
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
                  sponsoredLocations: tlocation,
                  school_id: JSON.parse(localStorage.getItem("userInfo"))
                    .schoolId,
                }),
              });
              if (response.ok) {
                const Tit = title;
                const options = {
                  method: "POST",
                  headers: {
                    Authorization: `Basic ${process.env.NEXT_PUBLIC_ONESIGNAL_REST}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    included_segments: ["All"],
                    app_id: "3b28d10b-3b88-426f-8025-507667803b2a",
                    headings: {
                      en: "New community service opportunity available!",
                      es: "¡Nueva oportunidad de servicio comunitario disponible!",
                      fr: "Nouvelle opportunité de service communautaire disponible !",
                      de: "Neue Möglichkeiten für Gemeindearbeit verfügbar!",
                      it: "Nuova opportunità di servizio alla comunità disponibile!",
                      pt: "Nova oportunidade de serviço comunitário disponível!",
                      nl: "Nieuwe gemeenschapsdienstmogelijkheid beschikbaar!",
                      ru: "Доступна новая возможность обслуживания сообщества!",
                      zh: "新的社区服务机会现已开放!",
                      ja: "新しいコミュニティサービスの機会が利用可能です!",
                      ar: "فرصة خدمة جديدة متاحة في المجتمع!",
                      hi: "समुदाय सेवा का नया अवसर उपलब्ध है!",
                      ko: "새로운 커뮤니티 서비스 기회가 있습니다!",
                    },
                    url: "https://www.noteswap.org/event",
                    chrome_web_icon:
                      "https://storage.googleapis.com/noteswap-images/circle.png",
                    contents: {
                      en: `New community service opportunity available! ${title}, ${communityService} hours offered`,
                      es: `¡Nueva oportunidad de servicio comunitario disponible! ${title}, se ofrecen ${communityService} horas`,
                      fr: `Nouvelle opportunité de service communautaire disponible ! ${title}, ${communityService} heures offertes`,
                      de: `Neue Möglichkeiten für Gemeindearbeit verfügbar! ${title}, ${communityService} Stunden angeboten`,
                      it: `Nuova opportunità di servizio alla comunità disponibile! ${title}, offerte ${communityService} ore`,
                      pt: `Nova oportunidade de serviço comunitário disponível! ${title}, oferecidas ${communityService} horas`,
                      nl: `Nieuwe gemeenschapsdienstmogelijkheid beschikbaar! ${title}, ${communityService} uur aangeboden`,
                      ru: `Доступна новая возможность обслуживания сообщества! ${title}, предлагается ${communityService} часов`,
                      zh: `新的社区服务机会现已开放！${title}，提供${communityService}小时`,
                      ja: `新しいコミュニティサービスの機会が利用可能です！${title}、提供される${communityService}時間`,
                      ar: `فرصة خدمة جديدة متاحة في المجتمع! ${title}، تُقدم ${communityService} ساعة`,
                      hi: `समुदाय सेवा का नया अवसर उपलब्ध है! ${title}, ${communityService} घंटे प्रस्तावित किए जाते हैं`,
                      ko: `새로운 커뮤니티 서비스 기회가 있습니다! ${title}, 제공되는 ${communityService} 시간`,
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
              setMax(50);
              setCommunityService(0);
              setOpen(false);
            }
          }}
        >
          {current == 1 && (
            <>
              <label className={style.labelForInput}>Name of the event</label>
              <input
                placeholder="Enter event name"
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
              <label className={style.labelForInput}>Description</label>
              <textarea
                className={style.input}
                style={{ height: "250px", paddingTop: "10px", resize: "none" }}
                placeholder="Enter a detailed description that will include anything a volunteer needs to know"
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
                Next
              </button>
            </>
          )}
          {current == 2 && (
            <>
              <label className={style.labelForInput}>
                Number of community service hours offered
              </label>
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
                Maximum number of volunteers that can sign up
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
                Select a category for your event
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
                <option value="Event Planning and Preparation">
                  Event Planning and Preparation
                </option>
                <option value="Environmental Conservation">
                  Environmental Conservation
                </option>
                <option value="Health and Wellness">Health and Wellness</option>
                <option value="Homelessness and Hunger Relief">
                  Homelessness and Hunger Relief
                </option>
                <option value="Animal Welfare">Animal Welfare</option>
                <option value="Arts and Creativity">Arts and Creativity</option>
                <option value="Community Building">Community Building</option>
                <option value="Disaster Relief and Preparedness">
                  Disaster Relief and Preparedness
                </option>
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
              <label className={style.labelForInput}>Date of the event</label>
              <span>From: </span>
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
              <span>To: </span>
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
                Next
              </button>
            </>
          )}
          {current == 3 && (
            <>
              {" "}
              <label className={style.labelForInput}>
                Location of the event (Ex: Location X Building Y Room Z)
              </label>
              <input
                placeholder="Enter the location of the event (be as detailed as possible)"
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
              <label className={style.labelForInput}>
                Requirements to join event
              </label>
              <textarea
                className={style.input}
                style={{ height: "250px", paddingTop: "10px", resize: "none" }}
                placeholder="Enter requirements for a volunteer to sign up"
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
                {business ? "Next" : "Finish"}
              </button>
            </>
          )}
          {current === 4 && (
            <>
              <label className={style.labelForInput}>
                Select the locations where you would like your event to show up.
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
                      {value.name} ({value.location}) {value.users} user
                      {value.users === 1 ? "" : "s"} from this school
                    </label>
                  );
                })}
              </div>
              <div>
                <p>
                  A total of{" "}
                  <span style={{ color: "var(--accent-color)" }}>
                    {tlocation.reduce(
                      (totalUsers, selectedId) =>
                        totalUsers +
                          schools.find((school) => school.id === selectedId)
                            ?.users || 0,
                      0
                    )}
                  </span>{" "}
                  users from{" "}
                  <span style={{ color: "var(--accent-color)" }}>
                    {tlocation.length}
                  </span>{" "}
                  school{tlocation.length == 1 ? "" : "s"} will be notified and
                  have the oppurtunity to sign up for this event
                </p>
                <p>
                  <span style={{ color: "var(--accent-color)" }}>Cost:</span>{" "}
                  {tlocation.reduce(
                    (totalUsers, selectedId) =>
                      totalUsers +
                        schools.find((school) => school.id === selectedId)
                          ?.users || 0,
                    0
                  ) / 10}{" "}
                  MAD{" "}
                </p>
                <p>
                  <span style={{ color: "var(--accent-color)" }}>
                    Discount:
                  </span>{" "}
                  Testers Discount (100%)
                </p>
                <p>
                  <span style={{ color: "var(--accent-color)" }}>Total:</span> 0
                  MAD
                </p>
              </div>
              <button className={style.button} type="submit">
                Finish
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
                Your event has been successfully created!
              </h1>
              <p
                style={{
                  fontFamily: "var(--manrope-font)",
                  textAlign: "center",
                  fontSize: "1rem",
                }}
              >
                Anybody that has signed up for your event can be found at this
                url:{" "}
                <Link
                  href={`${process.env.NEXT_PUBLIC_URL}signups/${codes}`}
                  target="_blank"
                >
                  {process.env.NEXT_PUBLIC_URL}signups/{codes}
                </Link>
              </p>
              <button className={style.button} type="submit">
                Finish
              </button>
            </div>
          )}
        </form>

        {current != 1 && current != 4 && (
          <button
            onClick={() => {
              setCurrent(current - 1);
            }}
            className={style.back}
          >
            Back
          </button>
        )}
      </section>
    </Modal>
  );
}
