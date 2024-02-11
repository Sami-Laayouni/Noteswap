import style from "./tutorCard.module.css";
import { LuBook } from "react-icons/lu";
import { useRouter } from "next/router";
import { useContext } from "react";
import ModalContext from "../../../context/ModalContext";
import StarRating from "../../Extra/StarRating";
import Image from "next/image";
import { useTranslation } from "next-i18next";

function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0; // Handle case when the array is empty to avoid division by zero
  }

  const sum = numbers.reduce((total, num) => total + num, 0);
  const average = sum / numbers.length;

  return average;
}

function roundToDecimal(number, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.round(number * factor) / factor;
}

export default function TutorCard({ data }) {
  const router = useRouter();
  const { bookSession, bookSessionInfo } = useContext(ModalContext);
  const [open, setOpen] = bookSession;
  const [info, setInfo] = bookSessionInfo;
  const ratings = calculateAverage(data?.userInfo[0]?.rating);
  const { t } = useTranslation("common");

  return (
    <div className={style.container}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          padding: "10px",
        }}
      >
        <Image
          className={style.imageContainer}
          src={data?.userInfo[0]?.profile_picture}
          alt={data?.userInfo[0]?.first_name}
          width={200}
          height={200}
          onClick={() => {
            router.push(`/profile/${data?.userInfo[0]?._id}`);
          }}
          loading="lazy"
        />
      </div>

      <span>
        <h1 className={style.name}>
          {data?.userInfo[0].first_name} {data?.userInfo[0].last_name}
        </h1>
        <h2 className={style.subject}>
          <LuBook size={15} style={{ verticalAlign: "middle" }} />
          <span style={{ verticalAlign: "middle", marginLeft: "5px" }}>
            {data?.subject}
          </span>
        </h2>
        <p className={style.textBox}>{data?.desc}</p>
      </span>
      <div>
        {ratings != 0 && (
          <>
            <StarRating rating={ratings} />
            <p
              className={style.center}
              style={{ fontFamily: "var(--manrope-font)", lineHeight: "10px" }}
            >
              {t("rating")}: {roundToDecimal(ratings, 1)}/5
            </p>
          </>
        )}
        {!ratings && (
          <p
            style={{
              fontFamily: "var(--manrope-font)",
              paddingTop: "30px",
              textAlign: "center",
            }}
          >
            {t("no_rating")}
          </p>
        )}
        <button
          className={style.button}
          style={{
            right: "20px",
            top: "120px",
            background: "var(--accent-color)",
            color: "var(--default-white-color)",
          }}
          onClick={() => {
            setOpen(true);
            setInfo({ data });
          }}
        >
          {t("book_session")}
        </button>
        <button
          onClick={() => {
            window.location.href = `mailto:${data?.email}?subject=Noteswap Tutor`;
          }}
          className={style.button}
          style={{ right: "20px", top: "170px" }}
        >
          {t("contact_email")}
        </button>
      </div>
    </div>
  );
}
