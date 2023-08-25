import React from "react";
import style from "./noteCard.module.css";
import ProfilePicture from "../ProfilePicture";
import { useRouter } from "next/router";
import { useRef, useState, useContext } from "react";
import Image from "next/image";
import { BiRightArrow, BiLeftArrow } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaShare } from "react-icons/fa";
import { BsFillTrashFill } from "react-icons/bs";
import ModalContext from "../../context/ModalContext";

/**
 * Note Card
 * @date 7/24/2023 - 7:30:17 PM
 *
 * @export
 * @param {*} data
 * @return {*}
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
  function increaseKeyValue(obj, key) {
    if (obj.hasOwnProperty(key)) {
      obj[key] += 1;
    } else {
      obj[key] = 1;
    }
  }
  return (
    <div
      id={`card${data?.data?._id}`}
      className={style.card}
      style={{
        height: data?.data?.type == "default" ? "200px" : "450px",
        maxHeight: data?.data?.type == "default" ? "200px" : "450px",
      }}
      onClick={(event) => {
        if (
          event.target.id != "containerRef" &&
          event.target.id != "right" &&
          event.target.id != `dropdown${data?.data?._id}` &&
          event.target.id != `dropdownItem${data?.data?._id}` &&
          event.target.id != `dropdownItem2${data?.data?._id}` &&
          event.target.id != "right1" &&
          event.target.id != "left" &&
          event.target.id != `more${data?.data?._id}` &&
          event.target.id != `more2${data?.data?._id}` &&
          event.target.id != "left1" &&
          event.target.tagName !== "IMG"
        ) {
          if (!JSON.parse(localStorage.getItem("click"))) {
            localStorage.setItem("click", JSON.stringify({}));
          }
          if (!JSON.parse(localStorage.getItem("click2"))) {
            localStorage.setItem("click2", JSON.stringify({}));
          }
          const obj = JSON.parse(localStorage.getItem("click"));
          increaseKeyValue(obj, data.data.userInfo[0]._id);
          localStorage.setItem("click", JSON.stringify(obj));
          const obj2 = JSON.parse(localStorage.getItem("click2"));
          increaseKeyValue(obj2, data.data.category);
          localStorage.setItem("click2", JSON.stringify(obj2));

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
      <button id={`more${data?.data?._id}`} className={style.more}>
        <FiMoreHorizontal
          size={25}
          color="black"
          id={`more2${data?.data?._id}`}
          onClick={() => {
            console.log(
              document.getElementById(`dropdown${data?.data?._id}`).style
                .display == "none"
            );
            if (
              document.getElementById(`dropdown${data?.data?._id}`).style
                .display == "none" ||
              !document.getElementById(`dropdown${data?.data?._id}`).style
                .display
            ) {
              document.getElementById(
                `dropdown${data?.data?._id}`
              ).style.display = "block";
            } else {
              document.getElementById(
                `dropdown${data?.data?._id}`
              ).style.display = "none";
            }
          }}
        />
      </button>

      <div id={`dropdown${data?.data?._id}`} className={style.dropdown}>
        <ol>
          <li
            id={`dropdownItem${data?.data?._id}`}
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: data?.data?.title,
                  text: "Check out these notes on Noteswap",
                  url: `${process.env.NEXT_PUBLIC_URL}note/${data?.data?._id}`,
                });
              }
            }}
          >
            <FaShare style={{ marginRight: "10px" }} />
            Share notes
          </li>
          {localStorage?.getItem("userInfo") &&
            JSON.parse(localStorage?.getItem("userInfo"))._id ==
              data?.data?.userInfo[0]?._id && (
              <li
                onClick={async () => {
                  const response = await fetch("/api/notes/delete_note", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: data?.data?._id,
                    }),
                  });
                  if (response.ok) {
                    document.getElementById(
                      `card${data?.data?._id}`
                    ).style.display = "none";
                  } else {
                    console.log(await response.text());
                  }
                }}
                id={`dropdownItem2${data?.data?._id}`}
              >
                <BsFillTrashFill style={{ marginRight: "10px" }} />
                Delete notes
              </li>
            )}
        </ol>
      </div>

      <div
        style={{
          wordBreak: "normal",
          overflow: "hidden",
          height: "95px",
        }}
        dangerouslySetInnerHTML={{ __html: data?.data?.notes }}
      ></div>
      {data?.data?.images.length > 0 && (
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
                  width={260}
                  height={300}
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
              <button
                className={style.left}
                onClick={(e) => {
                  e.preventDefault(), scrollLeft();
                }}
                id="right1"
              >
                <BiLeftArrow size={16} id="left" />
              </button>
              <button
                className={style.right}
                onClick={(e) => {
                  e.preventDefault(), scrollRight();
                }}
                id="left1"
              >
                <BiRightArrow size={16} id="right" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
