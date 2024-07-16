import style from "../../styles/Profile.module.css";
import Link from "next/link";
import { MdModeEditOutline, MdOutlineSpeakerNotesOff } from "react-icons/md";
import { MdAlternateEmail } from "react-icons/md";

import { AiOutlinePhone } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { CiStar } from "react-icons/ci";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EventCard from "../../components/Cards/EventCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getStaticPaths() {
  // Use an empty array for paths since paths will be generated at request time
  return { paths: [], fallback: true };
}
/**
 * Get static props
 * @date 8/13/2023 - 4:51:52 PM
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
 * Business Profile
 * @date 8/13/2023 - 4:58:02 PM
 *
 * @export
 * @param {{ data: any; notes: any; }} { data, notes }
 * @return {*}
 */
export default function Association() {
  const [usersId, setUsersId] = useState();
  const [data, setData] = useState(null);
  const [event, setEvents] = useState(null);
  const [members, setMembers] = useState(null);
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    async function getData(id) {
      const response = await fetch("/api/association/get_single_association", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ information: id }),
      });
      const apiData = await response.json();

      const members = await fetch("/api/association/get_members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ associationId: id }),
      });
      const memo = await members.json();
      console.log(memo);
      setMembers(memo.members);

      setData(apiData);
      const secondRequestOptions = await fetch("/api/association/get_events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: apiData._id }),
      });
      const data = await secondRequestOptions.json();
      setEvents(data.events);
    }
    if (localStorage && localStorage.getItem("userInfo")) {
      setUsersId(JSON.parse(localStorage.getItem("userInfo")).associations[0]);
    }
    const { id } = router.query;
    if (id) {
      getData(id);
    }
  }, [router.query.id]);
  return (
    <main>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Banner image */}
        <div>
          <img
            src={
              data?.background_image
                ? data?.background_image
                : "/assets/fallback/background.png"
            }
            alt="Background image"
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
            }}
          />
          {/* Profile picture */}
          <img
            src={data?.icon ? data?.icon : "/assets/fallback/user.webp"}
            alt="Profile picture"
            width={190}
            height={190}
            className={style.profile_pic}
          />
        </div>
      </div>
      <section className={style.userInfo}>
        <div>
          {/* User name and edit button if user is logged in */}
          <div>
            <h1 style={{ display: "inline-block" }}>
              {data?.name ? data?.name : "Loading"}{" "}
            </h1>
            {usersId && data?._id == usersId && (
              <Link href="/business/edit">
                <MdModeEditOutline
                  size={21}
                  style={{
                    display: "inline-block",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                />
              </Link>
            )}

            {/* Bio and community service information */}

            <h2
              style={{
                textOverflow: "clip",
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              {data?.desc ? data?.desc : "No Description available"}
            </h2>

            <span
              style={{
                display: "inline",
                color: "gray",
                fontSize: "1.1rem",
              }}
            >
              <MdAlternateEmail
                color="black"
                style={{ verticalAlign: "middle" }}
              />{" "}
              <p style={{ display: "inline" }}>
                {data?.contact_email?.toLowerCase()}
              </p>
            </span>

            <span
              style={{
                display: "inline",
                color: "gray",
                fontSize: "1.1rem",
              }}
            >
              <AiOutlinePhone
                color="black"
                style={{ verticalAlign: "middle", marginLeft: "10px" }}
              />{" "}
              <p style={{ display: "inline" }}>{data?.contact_phone}</p>
            </span>
            <br></br>

            <span
              style={{
                display: "inline",
                color: "gray",
                fontSize: "1.1rem",
              }}
            >
              <HiOutlineLocationMarker
                color="black"
                style={{ verticalAlign: "middle" }}
              />{" "}
              <p style={{ display: "inline" }}>{data?.country}</p>
            </span>
            <span
              style={{
                display: "inline",
                color: "gray",
                fontSize: "1.1rem",
              }}
            >
              <CgWebsite
                color="black"
                style={{ verticalAlign: "middle", marginLeft: "10px" }}
              />{" "}
              <p style={{ display: "inline", marginLeft: "10px" }}>
                {data?.website}
              </p>
            </span>
          </div>
        </div>
      </section>

      <section className={style.contentContainer}>
        <div>
          <h2>Latest Events</h2>
          {event?.length == 0 && (
            <span>
              <MdOutlineSpeakerNotesOff
                size={70}
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
              <h3 style={{ textAlign: "center" }}>No events at the moment</h3>
            </span>
          )}
          {event?.length > 0 && (
            <section
              style={{
                maxWidth: "900px",
                display: "grid",
                gridTemplateColumns: "50% 50%",
                padding: "20px",
                gap: "30px",
                overflowX: "hidden",
              }}
            >
              {event?.map(function (value) {
                return <EventCard key={value._id} data={value} />;
              })}
            </section>
          )}
        </div>
        <div className={style.verticalLine}></div>

        <div
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <h1 style={{ marginTop: "30px", marginLeft: "10px" }}>Members</h1>
          {members?.map(function (value) {
            return (
              <Link
                style={{ marginBottom: "20px" }}
                key={value.userId}
                href={`/profile/${value.userId}`}
              >
                <div className={style.exp}>
                  <img src={value.profilePicture}></img>
                  <div>
                    <h1>{value.name}</h1>
                    <span>
                      <CiStar
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />
                      {value.extra
                        ? value.extra
                        : value.role == "board_member"
                        ? "Board Member"
                        : "Member"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
          {members?.length == 0 && (
            <>
              <p style={{ textAlign: "center" }}>No members yet</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
