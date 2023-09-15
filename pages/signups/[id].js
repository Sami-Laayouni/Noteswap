import style from "../../styles/Signups.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingCircle from "../../components/LoadingCircle";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getUserData(userId) {
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
        return data;
      }
      return null;
    }

    async function fetchData() {
      const response = await fetch("/api/events/get_events", {
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
              return await getUserData(value);
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
  }, [router]);

  async function giveCertificate(id) {
    const response = await fetch("/api/events/give_certificate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        certificate: data.certificate_link,
      }),
    });
    if (response.ok) {
      document.getElementById(`give_certificate_${id}`).innerText = "Success";
    }
  }

  return (
    <>
      <h1 className={style.header}>Volunteers who signed up for your event</h1>
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
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <LoadingCircle />
        </div>
      )}
      <ul className={style.list}>
        {volunteersData.map((volunteer, index) => (
          <li key={index}>
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
                style={{ color: "var(--accent-color)", marginRight: "20px" }}
              >
                {volunteer.first_name} {volunteer.last_name}
              </span>{" "}
              Email:{" "}
              <span style={{ color: "var(--accent-color)" }}>
                {volunteer.email}
              </span>
            </p>
            <form
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
                  document.getElementById(`input_${volunteer._id}`).value = "";
                }
              }}
            >
              <input
                className={style.input}
                type="number"
                min={1}
                max={3600}
                id={`input_${volunteer._id}`}
                placeholder="Enter a custom amount (mins)"
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
                : "Give Certificate"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
