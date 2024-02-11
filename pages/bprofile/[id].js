import style from "../../styles/Profile.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  MdModeEditOutline,
  MdOutlineEmail,
  MdOutlineSpeakerNotesOff,
} from "react-icons/md";
import { AiOutlinePhone } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { EventCard } from "../../components/Cards/EventCard";
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
export default function BProfile() {
  const [usersId, setUsersId] = useState();
  const [data, setData] = useState(null);
  const [event, setEvents] = useState(null);
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
      setData(apiData);
      const secondRequestOptions = await fetch("/api/association/get_events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: apiData._id }),
      });
      setEvents(await secondRequestOptions.json());
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
    <main className={style.background}>
      <div className={style.image_container}>
        <img
          className={style.background_image}
          src={
            data?.background_image
              ? data?.background_image
              : "/assets/fallback/background.png"
          }
          alt="Background image"
        />
      </div>
      <section className={style.userInfo}>
        <Image
          src={data?.icon ? data?.icon : "/assets/fallback/user.webp"}
          alt="Profile picture"
          width={190}
          height={190}
        />
        <div>
          <h1 style={{ display: "inline-block" }}>
            {data?.name ? data?.name : t("loading")}{" "}
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
        </div>
      </section>

      <section className={style.notes}>
        <div className={style.left}>
          <section>
            <div style={{ paddingRight: "80px", paddingTop: "15px" }}>
              {" "}
              {data?.desc}
            </div>
            <div style={{ display: "block", height: "fit-content" }}>
              <MdOutlineEmail size={18} style={{ verticalAlign: "middle" }} />
              <p
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  fontFamily: "var(--manrope-font)",
                  marginTop: "35px",
                  lineHeight: "0px",
                }}
              >
                {data?.contact_email
                  ? data?.contact_email
                  : `${t("loading")}...`}
              </p>
            </div>

            <div style={{ display: "block", height: "fit-content" }}>
              <AiOutlinePhone size={20} style={{ verticalAlign: "middle" }} />
              <p
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  fontFamily: "var(--manrope-font)",
                  textTransform: "capitalize",
                  marginTop: "35px",
                  lineHeight: "0px",
                }}
              >
                {data?.contact_phone
                  ? data?.contact_phone
                  : `${t("loading")}...`}
              </p>
            </div>
            <div style={{ display: "block", height: "fit-content" }}>
              <HiOutlineLocationMarker
                size={20}
                style={{ verticalAlign: "middle" }}
              />
              <p
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  fontFamily: "var(--manrope-font)",
                  textTransform: "capitalize",
                  marginTop: "35px",
                  lineHeight: "0px",
                }}
              >
                {data?.country
                  ? `${data?.country}, ${data?.city}`
                  : `${t("loading")}...`}
              </p>
            </div>
            <div style={{ display: "block", height: "fit-content" }}>
              <CgWebsite size={20} style={{ verticalAlign: "middle" }} />
              <p
                style={{
                  display: "inline-block",
                  marginLeft: "5px",
                  fontFamily: "var(--manrope-font)",
                  textTransform: "capitalize",
                  marginTop: "35px",
                  lineHeight: "0px",
                }}
              >
                {data?.website ? data?.website : "No website found"}
              </p>
            </div>
          </section>

          <div className={style.vertical_line} />
        </div>
        <div className={style.right}>
          <h2>Latest Events</h2>
          {event?.events.length == 0 && (
            <span>
              <MdOutlineSpeakerNotesOff
                size={70}
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
              <h3>No events posted yet</h3>
            </span>
          )}
          {event?.events.length > 0 && (
            <section>
              {event?.events.map(function (value, index) {
                value["userInfo"] = data;
                return <EventCard key={index} data={value} />;
              })}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
