import React from "react";
import style from "./noteCard.module.css";
import ProfilePicture from "../../Extra/ProfilePicture";
import { useRouter } from "next/router";
import { useRef, useState, useContext } from "react";
import Image from "next/image";
import { BiRightArrow, BiLeftArrow } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaShare } from "react-icons/fa";
import { BsFillTrashFill } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import ModalContext from "../../../context/ModalContext";
import { useTranslation } from "next-i18next";

/**
 * Note Card
 * @date 7/24/2023 - 7:30:17 PM
 *
 * @export
 * @param {*} data
 * @return {*}
 */
export default function NoteCard({ data, padding }) {
  const {
    imageModal,
    imageUrl,
    shareOpen,
    shareURL,
    edit,
    editValue,
    editTitle,
    editId,
  } = useContext(ModalContext);
  const router = useRouter();
  const containerRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [open, setOpen] = imageModal;
  const [url, setUrl] = imageUrl;
  const [openS, setOpenS] = shareOpen;
  const [urlS, setUrlS] = shareURL;
  const [openE, setOpenE] = edit;
  const [valueE, setValueE] = editValue;
  const [titleE, setTitleE] = editTitle;
  const [idE, setIdE] = editId;
  const { t } = useTranslation("common");

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
      id={`card${data?._id}`}
      className={style.card}
      style={{
        height: data?.type == "default" ? "200px" : "450px",
        maxHeight: data?.type == "default" ? "200px" : "450px",
        marginLeft: padding ? "50px" : "0px",
      }}
      onClick={(event) => {
        if (
          event.target.id != "containerRef" &&
          event.target.id != "right" &&
          event.target.id != `dropdown${data?._id}` &&
          event.target.id != `dropdownItem${data?._id}` &&
          event.target.id != `dropdownItem2${data?._id}` &&
          event.target.id != `dropdownItem3${data?._id}` &&
          event.target.id != "right1" &&
          event.target.id != "left" &&
          event.target.id != `more${data?._id}` &&
          event.target.id != `more2${data?._id}` &&
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

          router.push(`/note/${data?._id}`);
        }
      }}
    >
      <ProfilePicture
        src={data?.userInfo[0]?.profile_picture}
        alt={data?.userInfo[0]?.first_name}
        id={data?.userInfo[0]?._id}
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
        {data?.userInfo[0]?.first_name} {data[0]?.userInfo?.last_name}
      </h2>
      <h1>{data?.title}</h1>
      <button id={`more${data?._id}`} className={style.more}>
        <FiMoreHorizontal
          size={25}
          color="black"
          id={`more2${data?._id}`}
          onClick={() => {
            if (
              document.getElementById(`dropdown${data?._id}`).style.display ==
                "none" ||
              !document.getElementById(`dropdown${data?._id}`).style.display
            ) {
              document.getElementById(`dropdown${data?._id}`).style.display =
                "block";
            } else {
              document.getElementById(`dropdown${data?._id}`).style.display =
                "none";
            }
          }}
        />
      </button>

      <div id={`dropdown${data?._id}`} className={style.dropdown}>
        <ol>
          <li
            key={`dropdownItem${data?._id}`}
            id={`dropdownItem${data?._id}`}
            onClick={() => {
              setOpenS(true);
              setUrlS(`${process.env.NEXT_PUBLIC_URL}note/${data?._id}`);
            }}
          >
            <FaShare style={{ marginRight: "10px" }} />
            {t("share_notes")}
          </li>
          {localStorage?.getItem("userInfo") &&
            JSON.parse(localStorage?.getItem("userInfo"))._id ==
              data?.userInfo[0]?._id && (
              <li
                key={`dropdownItem2${data?._id}`}
                id={`dropdownItem2${data?._id}`}
                onClick={() => {
                  setOpenE(true);
                  setValueE(data?.notes);
                  setTitleE(data?.title);
                  setIdE(data?._id);
                }}
              >
                <MdModeEditOutline style={{ marginRight: "10px" }} />
                {t("edit_notes")}
              </li>
            )}
          {localStorage?.getItem("userInfo") &&
            JSON.parse(localStorage?.getItem("userInfo"))._id ==
              data?.userInfo[0]?._id && (
              <li
                onClick={async () => {
                  const response = await fetch("/api/notes/delete_note", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: data?._id,
                    }),
                  });
                  if (response.ok) {
                    document.getElementById(`card${data?._id}`).style.display =
                      "none";
                  }
                }}
                key={`dropdownItem3${data?._id}`}
                id={`dropdownItem3${data?._id}`}
              >
                <BsFillTrashFill style={{ marginRight: "10px" }} />
                {t("delete_notes")}
              </li>
            )}
        </ol>
      </div>

      <div
        style={{
          wordBreak: "normal",
          overflow: "hidden",
          height: "auto",
          maxHeight: "95px",
        }}
        dangerouslySetInnerHTML={{ __html: data?.notes }}
      ></div>
      {data?.images.length > 0 && (
        <div
          className={style.imageScroll}
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          id="containerRef"
        >
          {data?.images?.map(function (value, index) {
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
