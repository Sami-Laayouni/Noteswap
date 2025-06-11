import style from "./tutorCard.module.css";
import { CiStar } from "react-icons/ci";
import Link from "next/link";
import { useContext } from "react";
import ModalContext from "../../../context/ModalContext";
import StarRating from "../../Extra/StarRating";
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
  const { bookSession, bookSessionInfo } = useContext(ModalContext);
  const [open, setOpen] = bookSession;
  const [info, setInfo] = bookSessionInfo;
  const ratings = calculateAverage(data?.userInfo[0]?.rating);
  const { t } = useTranslation("common");

  return (
    <div className={style.container}>
      <Link href={`/profile/${data?.userInfo[0]?._id}`}>
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src={data?.userInfo[0]?.profile_picture}
            alt={`${data?.userInfo[0]?.first_name} ${data?.userInfo[0]?.last_name} Profile Picture`}
            loading="lazy"
          />
          <div
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              background: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: "6px",
              borderTopRightRadius: "10px",
              borderBottomLeftRadius: "10px",
            }}
          >
            {data?.subject}
          </div>
        </div>
      </Link>
      <div className={style.moreInfo}>
        <div style={{ height: "140px" }}>
          <h1>
            {data?.userInfo[0]?.first_name} {data?.userInfo[0]?.last_name}
          </h1>
          <p>
            {data?.desc.slice(0, 100)}
            {data?.desc?.length > 100 ? "..." : ""}
          </p>
        </div>

        <span className={style.lightText}>
          {ratings != 0 && (
            <>
              <StarRating rating={ratings} />
              {t("rating")}: {roundToDecimal(ratings, 1)}/5
            </>
          )}
          {!ratings && t("no_rating")}
        </span>
        <br></br>
        <button
          className={style.button}
          onClick={() => {
            setOpen(true);
            setInfo({ data });
          }}
        >
          {t("book_session")}
        </button>
      </div>
    </div>
  );
}
