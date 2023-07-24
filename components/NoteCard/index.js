import React from "react";
import style from "./noteCard.module.css";
import ProfilePicture from "../ProfilePicture";
import { useRouter } from "next/router";
import { useRef, useState, useContext } from "react";
import Image from "next/image";
import { BiRightArrow, BiLeftArrow } from "react-icons/bi";
import ModalContext from "../../context/ModalContext";

/**
 * Note Card
 * @date 7/24/2023 - 7:30:17 PM
 *
 * @export
 * @param {*} data
 * @returns {*}
 */
export default function NoteCard(data) {
  const { imageModal, imageUrl } = useContext(ModalContext);
  const router = useRouter();
  const containerRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [open, setOpen] = imageModal;
  const [url, setUrl] = imageUrl;

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };
  const handleMouseEnter = () => {
    setShowArrows(true);
  };

  const handleMouseLeave = () => {
    setShowArrows(false);
  };
  return (
    <div
      className={style.card}
      style={{
        height: data?.data?.type == "default" ? "200px" : "450px",
        maxHeight: data?.data?.type == "default" ? "200px" : "450px",
      }}
      onClick={(event) => {
        if (
          event.target.id != "containerRef" &&
          event.target.id != "right" &&
          event.target.id != "right1" &&
          event.target.id != "left" &&
          event.target.id != "left1" &&
          event.target.tagName !== "IMG"
        ) {
          router.push(`/note/${data?.data?._id}`);
        }
      }}
    >
      <ProfilePicture
        src={data?.data?.userInfo[0]?.profile_picture}
        alt={data?.data?.userInfo[0]?.first_name}
        id={data?.data?.userInfo[0]?._id}
      />
      <h2
        style={{
          display: "inline",
          marginLeft: "10px",
          verticalAlign: "middle",
          fontFamily: "var(--manrope-font)",
          fontSize: "1.3rem",
        }}
      >
        {data?.data?.userInfo[0]?.first_name}{" "}
        {data?.data[0]?.userInfo?.last_name}
      </h2>
      <h1>{data?.data?.title}</h1>

      <div dangerouslySetInnerHTML={{ __html: data?.data?.notes }}></div>
      <div
        className={style.imageScroll}
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        id="containerRef"
      >
        {data?.data?.images?.map(function (value, index) {
          return (
            <>
              <Image
                className={style.image}
                onError={() => {
                  document.getElementById(`${index}${value}`).src =
                    "/assets/fallback/noNotes.png";
                  document.getElementById(`${index}${value}`).error = null;
                }}
                src={value ? value : "/assets/fallback/noNotes.png"}
                alt="Images"
                id={`${index}${value}`}
                width={270}
                height={340}
                onClick={() => {
                  setOpen(true);
                  setUrl(value);
                }}
              />
            </>
          );
        })}
        {showArrows == true && (
          <>
            <button className={style.left} onClick={scrollLeft} id="right1">
              <BiLeftArrow size={16} id="left" />
            </button>
            <button className={style.right} onClick={scrollRight} id="left1">
              <BiRightArrow size={16} id="right" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
