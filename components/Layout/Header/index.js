"use client";
import style from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import ProfilePicture from "../../Extra/ProfilePicture";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { FaStickyNote } from "react-icons/fa";
import { BiBookOpen } from "react-icons/bi";
import { BsCalendarEvent } from "react-icons/bs";
import {
  MdOutlineAdminPanelSettings,
  MdEdit,
  MdOutlineEmojiEvents,
} from "react-icons/md";
import { FiSettings, FiLogOut, FiAward } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { RiCopperCoinLine } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi";
import { IoTicketOutline } from "react-icons/io5";
import AuthService from "../../../services/AuthService";
import ModalContext from "../../../context/ModalContext";
import { useTranslation } from "next-i18next";
import OneSignal from "react-onesignal";

export default function Header() {
  const { certificateModal, addMembers } = useContext(ModalContext);
  const [isCertificate, setCertificate] = certificateModal;
  const [open, setOpen] = addMembers;
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for fullscreen menu
  const router = useRouter();
  const AuthServices = new AuthService();
  const { data: session, status } = useSession();
  const { t } = useTranslation("common");

  // Fetch user data (unchanged)
  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch("/api/profile/get_user_profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ information: session.user.id }),
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            if (data.role !== "association") {
              const schoolResponse = await fetch(
                "/api/schools/get_single_school",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: data?.schoolId }),
                }
              );
              if (schoolResponse.ok) {
                const schoolData = await schoolResponse.json();
                localStorage.setItem("schoolInfo", JSON.stringify(schoolData));
              }
            }
          } else {
            const storedData = localStorage.getItem("userInfo");
            if (storedData) setUserData(JSON.parse(storedData));
          }
        } catch (error) {
          const storedData = localStorage.getItem("userInfo");
          if (storedData) setUserData(JSON.parse(storedData));
        }
      } else if (status === "unauthenticated") {
        setUserData(null);
        localStorage.removeItem("userInfo");
      }
    }
    fetchUserData();
    const interval = setInterval(fetchUserData, 300000);
    return () => clearInterval(interval);
  }, [session, status]);

  return (
    <header className={style.header_main_container}>
      <div className={style.header_logo}>
        <Link
          href={userData?.role === "association" ? "/shortcuts" : "/dashboard"}
        >
          <Image
            src="/assets/icons/Logo_dark-cropped.svg"
            alt="NoteSwap Logo light"
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>

      {/* Hamburger Menu Button */}
      <div className={style.hamburger} onClick={() => setMenuOpen(true)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation */}
      <nav
        className={`${style.header_nav} ${
          menuOpen ? `${style.fullscreen} ${style.open}` : ""
        }`}
      >
        {menuOpen && (
          <div className={style.close_btn} onClick={() => setMenuOpen(false)}>
            ×
          </div>
        )}
        {userData?.role !== "volunteer" && userData?.role !== "association" && (
          <>
            <Link
              title="Visit notes"
              className={style.header_nav_a}
              href="/notes"
            >
              <FaStickyNote size={20} />
            </Link>
            {userData?.role !== "teacher" &&
              userData?.schoolId === "649d661a3a5a9f73e9e3fa62" && (
                <Link
                  title="Visit Tutor"
                  className={style.header_nav_a}
                  href="/tutor"
                >
                  <BiBookOpen size={20} />
                </Link>
              )}
          </>
        )}
        {userData?.role !== "association" && (
          <Link
            title="Visit events"
            className={style.header_nav_a}
            href="/event"
          >
            <BsCalendarEvent size={20} />
          </Link>
        )}
        {userData?.role === "association" && userData?.associations?.[0] && (
          <Link
            title="My Association"
            className={style.header_nav_a}
            href={`/association/${
              userData?.associations[userData?.associations.length - 1]
            }`}
          >
            <HiUserGroup size={20} />
          </Link>
        )}
        {userData?.role === "teacher" && (
          <Link
            title="My Events"
            className={style.header_nav_a}
            href="/teacher/events"
          >
            <MdOutlineEmojiEvents size={20} />
          </Link>
        )}
        {(userData?.role === "teacher" || userData?.role === "school") && (
          <Link
            title="Reward CS"
            className={style.header_nav_a}
            href="/rewardcs"
          >
            <RiCopperCoinLine size={20} />
          </Link>
        )}
        {userData?.role === "student" && (
          <Link
            title="My Productivity"
            className={style.header_nav_a}
            href="/productivity"
          >
            <IoMdTime size={20} />
          </Link>
        )}
        {userData?.admin === true && (
          <Link title="Admin Page" className={style.header_nav_a} href="/admin">
            <MdOutlineAdminPanelSettings size={20} />
          </Link>
        )}
        {userData?.role === "association" && (
          <Link
            title="Edit Association"
            className={style.header_nav_a}
            href="/business/edit"
          >
            <MdEdit size={20} />
          </Link>
        )}
        {userData?.role === "school" && (
          <Link
            title="Create New School"
            className={style.header_nav_a}
            href="for_schools"
          >
            <MdEdit size={20} />
          </Link>
        )}
        <Link
          title="Settings"
          className={style.header_nav_a}
          href="/settings/account"
        >
          <FiSettings size={20} />
        </Link>
        {userData?.role === "student" && (
          <div
            title="Transcript"
            className={style.header_nav_a}
            onClick={() => setCertificate(true)}
          >
            <FiAward size={20} />
          </div>
        )}
        <div
          title="Log Out"
          className={style.header_nav_a}
          onClick={async () => {
            await OneSignal.logout();
            signOut();
            await AuthServices.logout();
            router.push("/login");
          }}
        >
          <FiLogOut size={20} />
        </div>
        <Link href={`/profile/${userData?._id}`}>
          <div className={style.userInfo}>
            <ProfilePicture
              src={userData?.profile_picture}
              alt={userData?.first_name || "User"}
              id={userData?._id}
            />
          </div>
        </Link>
      </nav>
    </header>
  );
}
