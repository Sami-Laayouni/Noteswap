import style from "../../styles/Signups.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import ModalContext from "../../context/ModalContext";
import Image from "next/image";
import Link from "next/link";
import LoadingCircle from "../../components/Extra/LoadingCircle";
import Script from "next/script";
import DownloadSegmented from "../../components/Modals/DownloadSegmented";

/**
 * Get static paths
 * @date 8/13/2023 - 5:01:49 PM
 *
 * @export
 * @async
 * @return {unknown}
 */
export async function getStaticPaths() {
  // Return an empty paths array for now
  return { paths: [], fallback: "blocking" };
}

/**
 * Get static props
 * @date 8/13/2023 - 5:01:49 PM
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
 * Description placeholder
 * @date 8/13/2023 - 5:01:49 PM
 *
 * @export
 * @return {*}
 */
export default function SignUps() {
  const [data, setData] = useState([]);
  const [volunteersData, setVolunteersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [volunteer, setVolunteer] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { downloadSegmented, signedUpVolunteers } = useContext(ModalContext);
  const [open, setOpen] = downloadSegmented;
  const [dataS, setDatS] = signedUpVolunteers;
  const [userProfile, setUserProfile] = useState(null);

  async function downloadDataAsExcel(volunteersData) {
    const modifiedData = volunteersData.map((volunteer) => {
      const { first_name, last_name, points, tutor_hours, email } = volunteer;
      const totalPoints =
        Math.floor(points / 20) + Math.floor(tutor_hours / 60);
      const fixed_first_name =
        first_name.charAt(0).toUpperCase() + first_name.slice(1);
      const fixed_last_name =
        last_name.charAt(0).toUpperCase() + last_name.slice(1);
      const formattedTotalPoints = `${totalPoints} minute${
        totalPoints === 1 ? "" : "s"
      }`;

      // Include other volunteer properties as needed
      return {
        "First Name": fixed_first_name,
        "Last Name": fixed_last_name,
        Email: email,
        "Total Community Service Earned": formattedTotalPoints,
      };
    });

    // Convert the modified data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(modifiedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Volunteers");

    // Generate a buffer to store the data
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Create a Blob from the buffer
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create an anchor element and dispatch a click event to trigger the download
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Volunteer_Data.xlsx";
    anchor.click();

    // Cleanup: revoke the object URL after use
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    async function getUserData(userId, phone) {
      const response = await fetch("/api/profile/get_user_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          information: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        data.phone = phone;
        return data;
      }
      return null;
    }

    async function fetchData() {
      const response = await fetch("/api/events/get_single_event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (response.ok) {
        const eventData = await response.json();
        setData(eventData);
        if (eventData?.volunteers) {
          const volunteerDataPromises = eventData.volunteers.map(
            async (value) => {
              return await getUserData(value.userId, value.phone);
            }
          );

          const resolvedVolunteersData = await Promise.all(
            volunteerDataPromises
          );
          setLoading(false);
          setVolunteersData(resolvedVolunteersData);
        }
      }
    }
    const { id } = router.query;

    if (id) {
      fetchData();
    }
    setFilteredVolunteers(
      volunteersData.filter((volunteer) =>
        volunteer.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    if (localStorage) {
      setUserProfile(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, [volunteersData, searchTerm, router]);

  async function giveCertificate(id) {
    const response = await fetch("/api/profile/add_community_minutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        points: Math.round(data.community_service_offered / 60) * 20,
      }),
    });
    const currentDate = new Date();
    // Format the date
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    await fetch("/api/profile/add_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        task: {
          message: `${Math.round(data.community_service_offered / 60)}`,
          minutes: Math.round(data.community_service_offered / 60),
          rewardedOn: formattedDate,
          organization: `${
            JSON.parse(localStorage.getItem("userInfo")).first_name
          } ${JSON.parse(localStorage.getItem("userInfo")).last_name}`,
        },
      }),
    });

    if (response.ok) {
      document.getElementById(`give_certificate_${id}`).innerText = "Success";
    }
  }

  async function notify(email, name, event_name, desc, date) {
    const response = await fetch("/api/events/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        event_name: event_name,
        desc: desc,
        date: date,
      }),
    });
    if (response.ok) {
      document.getElementById(`notify_them_${email}`).innerText = "Success";
    } else {
      document.getElementById(`notify_them_${email}`).innerText =
        "An error has ocurred";
    }
  }

  async function removeUser(userId) {
    const { id } = router.query;

    const response = await fetch("/api/events/unsignup_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        userId: userId,
      }),
    });
    if (response.ok) {
      document.getElementById(`volunteer_${userId}`).remove();
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" />
      <DownloadSegmented />
      <div style={{ paddingLeft: "70px" }}>
        <div style={{ padding: "30px" }}>
          <button
            style={{
              background: "var(--accent-color)",
              padding: "10px 20px",
              outline: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: "3px",
            }}
            onClick={() => {
              setVolunteer(true);
            }}
          >
            Volunteers
          </button>
          <button
            style={{
              background: "var(--accent-color)",
              padding: "10px 20px",
              outline: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: "3px",
              marginLeft: "20px",
            }}
            onClick={() => {
              setVolunteer(false);
            }}
          >
            Purchased Tickets
          </button>
        </div>
        {volunteer && (
          <>
            <h1 className={style.header}>
              Volunteers who signed up for your event
            </h1>

            <input
              className={style.sinput}
              placeholder="Search for volunteers by first name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              className={style.button}
              onClick={() => {
                downloadDataAsExcel(volunteersData);
              }}
            >
              Download All
            </button>
            {userProfile?.role == "association" && (
              <button
                className={style.button}
                onClick={() => {
                  setOpen(true);
                  setDatS(volunteersData);
                }}
              >
                Download Segmented Data
              </button>
            )}

            <p
              className={style.refresh}
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh the page to see changes
            </p>

            {loading && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LoadingCircle />
              </div>
            )}
            <ul className={style.list}>
              {filteredVolunteers.map((volunteer, index) => (
                <li id={`volunteer_${volunteer._id}`} key={index}>
                  <Link href={`/profile/${volunteer._id}`}>
                    <Image
                      src={volunteer.profile_picture}
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
                  </Link>

                  <p
                    style={{
                      display: "inline",
                      paddingLeft: "10px",
                    }}
                  >
                    Name:{" "}
                    <span
                      style={{
                        color: "var(--accent-color)",
                        marginRight: "20px",
                      }}
                    >
                      {volunteer.first_name} {volunteer.last_name}
                    </span>{" "}
                    Email:{" "}
                    <span
                      style={{
                        color: "var(--accent-color)",
                        marginRight: "20px",
                      }}
                    >
                      {volunteer.email}
                    </span>
                    Phone Number:{" "}
                    <span
                      style={{
                        color: "var(--accent-color)",
                        marginRight: "20px",
                      }}
                    >
                      {volunteer.phone ? volunteer?.phone : "N/A"}
                    </span>
                    {"  "}
                    Total Community Service Earned:{" "}
                    <span style={{ color: "var(--accent-color)" }}>
                      {Math.round(volunteer.points / 20) +
                        Math.round(volunteer.tutor_hours / 60)}{" "}
                      minutes
                    </span>
                  </p>
                  <br></br>
                  <form
                    style={{ display: "inline-block" }}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const response = await fetch(
                        "/api/profile/add_community_minutes",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            id: volunteer._id,
                            points:
                              document.getElementById(`input_${volunteer._id}`)
                                .value * 20,
                          }),
                        }
                      );
                      if (response.ok) {
                        document.getElementById(
                          `award_custom__${volunteer._id}`
                        ).innerText = "Success";
                        document.getElementById(
                          `input_${volunteer._id}`
                        ).value = "";
                      }
                    }}
                  >
                    <input
                      className={style.input}
                      type="number"
                      min={1}
                      max={3600}
                      id={`input_${volunteer._id}`}
                      placeholder="Enter a custom amount (in mins)"
                      required
                    />
                    <button
                      className={style.button}
                      style={{ right: "195px" }}
                      type="submit"
                      id={`award_custom__${volunteer._id}`}
                    >
                      Award custom amount
                    </button>
                  </form>

                  <button
                    onClick={() => giveCertificate(volunteer._id)}
                    className={style.button}
                    id={`give_certificate_${volunteer._id}`}
                  >
                    {volunteer?.certificates?.includes(data.certificate_link)
                      ? "Already received"
                      : `Reward full amount (${data.community_service_offered} hours)`}
                  </button>
                  <button
                    onClick={() =>
                      notify(
                        volunteer.email,
                        volunteer.first_name,
                        data.title,
                        data.desc,
                        data.date_of_events
                      )
                    }
                    className={style.button}
                    id={`notify_them_${volunteer.email}`}
                  >
                    Notify them that they have been accepted for the event
                  </button>
                  <button
                    onClick={() => removeUser(volunteer._id)}
                    className={style.button}
                    style={{ background: "red" }}
                    id={`remove_them_${volunteer.email}`}
                  >
                    Remove {volunteer.first_name} from event
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {!volunteer && (
          <div style={{ padding: "20px" }}>
            {" "}
            <h1 className={style.header}>Purchased Tickets</h1>
            <p
              className={style.refresh}
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh the page to see changes
            </p>
            {data?.purchasedTickets ? (
              <>
                {data?.purchasedTickets?.map(function (value, index) {
                  return (
                    <div
                      key={index}
                      style={{
                        marginBottom: "20px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                      }}
                    >
                      <h2>{value.ticketName}</h2>
                      <p>
                        Checked In:{" "}
                        {value?.checkedIn?.checkedIn ? "True" : "False"}
                      </p>
                      <p>
                        Checked In Date:{" "}
                        {value.checkInDate?.checkInDate
                          ? value.checkInDate?.checkInDate
                          : "N/A"}
                      </p>
                      <p>Ticket Id: {value.uniqueId}</p>

                      <p>
                        Purchased By:{" "}
                        <Link
                          style={{ textDecoration: "underline" }}
                          href={`/profile/${value.purchasedBy}`}
                        >
                          Click here to view user&apos;s profile
                        </Link>{" "}
                      </p>

                      <p>
                        Purchased on:{" "}
                        {new Date(value.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </>
            ) : (
              <p>No purchased tickets yet</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
