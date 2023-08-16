import style from "./tutorCard.module.css";
import { LuBook } from "react-icons/lu";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import ModalContext from "../../context/ModalContext";
import StarRating from "../StarRating";
import Image from "next/image";

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
        {ratings && (
          <>
            <StarRating rating={ratings} />
            <p
              className={style.center}
              style={{ fontFamily: "var(--manrope-font)", lineHeight: "10px" }}
            >
              Rating: {roundToDecimal(ratings, 1)}/5
            </p>
          </>
        )}
        {!ratings && <p>No ratings yet</p>}
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
          Book a session
        </button>
        <button
          onClick={() => {
            window.location.href = `mailto:${data?.email}?subject=Noteswap Tutor`;
          }}
          className={style.button}
          style={{ right: "20px", top: "170px" }}
        >
          Contact
        </button>
      </div>
    </div>
  );
}
