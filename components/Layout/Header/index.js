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
import AuthService from "../../../services/AuthService";
import ModalContext from "../../../context/ModalContext";
import { useTranslation } from "next-i18next";
import OneSignal from "react-onesignal";

export default function Header() {
  const { certificateModal, addMembers } = useContext(ModalContext);
  const [isCertificate, setCertificate] = certificateModal;
  const [open, setOpen] = addMembers;
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const AuthServices = new AuthService();
  const { data: session, status } = useSession();
  const { t } = useTranslation("common");

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={style.header}>
      {/* Desktop Sidebar */}
      <div className={style.desktop_sidebar}>
        <div className={style.header_logo}>
          <Link
            href={
              userData?.role === "association" ? "/shortcuts" : "/dashboard"
            }
          >
            <Image
              src="/assets/icons/Logo_dark-cropped.svg"
              alt="NoteSwap Logo"
              width={40}
              height={40}
              priority
            />
          </Link>
        </div>
        <nav className={style.desktop_nav}>
          {userData?.role !== "volunteer" &&
            userData?.role !== "association" && (
              <>
                <Link href="/notes" className={style.nav_item} title="Notes">
                  <FaStickyNote size={20} />
                </Link>
                {userData?.role !== "teacher" &&
                  userData?.schoolId === "649d661a3a5a9f73e9e3fa62" && (
                    <Link
                      href="/tutor"
                      className={style.nav_item}
                      title="Tutor"
                    >
                      <BiBookOpen size={20} />
                    </Link>
                  )}
              </>
            )}
          {userData?.role !== "association" && (
            <Link href="/event" className={style.nav_item} title="Events">
              <BsCalendarEvent size={20} />
            </Link>
          )}
          {userData?.role === "association" && userData?.associations?.[0] && (
            <Link
              href={`/association/${
                userData?.associations[userData?.associations.length - 1]
              }`}
              className={style.nav_item}
              title="My Association"
            >
              <HiUserGroup size={20} />
            </Link>
          )}
          {userData?.role === "teacher" && (
            <Link
              href="/teacher/events"
              className={style.nav_item}
              title="My Events"
            >
              <MdOutlineEmojiEvents size={20} />
            </Link>
          )}
          {(userData?.role === "teacher" || userData?.role === "school") && (
            <Link href="/rewardcs" className={style.nav_item} title="Reward CS">
              <RiCopperCoinLine size={20} />
            </Link>
          )}
          {userData?.role === "student" && (
            <Link
              href="/productivity"
              className={style.nav_item}
              title="Productivity"
            >
              <IoMdTime size={20} />
            </Link>
          )}
          {userData?.admin === true && (
            <Link href="/admin" className={style.nav_item} title="Admin">
              <MdOutlineAdminPanelSettings size={20} />
            </Link>
          )}
          {userData?.role === "association" && (
            <Link
              href="/business/edit"
              className={style.nav_item}
              title="Edit Association"
            >
              <MdEdit size={20} />
            </Link>
          )}
          {userData?.role === "school" && (
            <Link
              href="for_schools"
              className={style.nav_item}
              title="New School"
            >
              <MdEdit size={20} />
            </Link>
          )}
          <Link
            href="/settings/account"
            className={style.nav_item}
            title="Settings"
          >
            <FiSettings size={20} />
          </Link>
          {userData?.role === "student" && (
            <div
              className={style.nav_item}
              onClick={() => setCertificate(true)}
              title="Transcript"
            >
              <FiAward size={20} />
            </div>
          )}
          <div
            className={style.nav_item}
            onClick={async () => {
              await OneSignal.logout();
              signOut();
              await AuthServices.logout();
              router.push("/login");
            }}
            title="Log Out"
          >
            <FiLogOut size={20} />
          </div>
          <Link href={`/profile/${userData?._id}`} className={style.user_info}>
            <ProfilePicture
              src={userData?.profile_picture}
              alt={userData?.first_name || "User"}
              id={userData?._id}
            />
          </Link>
        </nav>
      </div>

      {/* Mobile Navbar */}
      <div className={style.mobile_navbar}>
        <div className={style.mobile_header}>
          <Link
            href={
              userData?.role === "association" ? "/shortcuts" : "/dashboard"
            }
          >
            <Image
              src="/assets/icons/Logo_dark-cropped.svg"
              alt="NoteSwap Logo"
              width={40}
              height={40}
              priority
            />
          </Link>
          <div className={style.hamburger} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <nav className={`${style.mobile_menu} ${menuOpen ? style.active : ""}`}>
          <div className={style.close_btn} onClick={toggleMenu}>
            ×
          </div>
          {userData?.role !== "volunteer" &&
            userData?.role !== "association" && (
              <>
                <Link
                  href="/notes"
                  className={style.nav_item}
                  onClick={toggleMenu}
                >
                  <FaStickyNote size={20} /> Notes
                </Link>
                {userData?.role !== "teacher" &&
                  userData?.schoolId === "649d661a3a5a9f73e9e3fa62" && (
                    <Link
                      href="/tutor"
                      className={style.nav_item}
                      onClick={toggleMenu}
                    >
                      <BiBookOpen size={20} /> Tutor
                    </Link>
                  )}
              </>
            )}
          {userData?.role !== "association" && (
            <Link href="/event" className={style.nav_item} onClick={toggleMenu}>
              <BsCalendarEvent size={20} /> Events
            </Link>
          )}
          {userData?.role === "association" && userData?.associations?.[0] && (
            <Link
              href={`/association/${
                userData?.associations[userData?.associations.length - 1]
              }`}
              className={style.nav_item}
              onClick={toggleMenu}
            >
              <HiUserGroup size={20} /> My Association
            </Link>
          )}
          {userData?.role === "teacher" && (
            <Link
              href="/teacher/events"
              className={style.nav_item}
              onClick={toggleMenu}
            >
              <MdOutlineEmojiEvents size={20} /> My Events
            </Link>
          )}
          {(userData?.role === "teacher" || userData?.role === "school") && (
            <Link
              href="/rewardcs"
              className={style.nav_item}
              onClick={toggleMenu}
            >
              <RiCopperCoinLine size={20} /> Reward CS
            </Link>
          )}
          {userData?.role === "student" && (
            <Link
              href="/productivity"
              className={style.nav_item}
              onClick={toggleMenu}
            >
              <IoMdTime size={20} /> Productivity
            </Link>
          )}
          {userData?.admin === true && (
            <Link href="/admin" className={style.nav_item} onClick={toggleMenu}>
              <MdOutlineAdminPanelSettings size={20} /> Admin
            </Link>
          )}
          {userData?.role === "association" && (
            <Link
              href="/business/edit"
              className={style.nav_item}
              onClick={toggleMenu}
            >
              <MdEdit size={20} /> Edit Association
            </Link>
          )}
          {userData?.role === "school" && (
            <Link
              href="for_schools"
              className={style.nav_item}
              onClick={toggleMenu}
            >
              <MdEdit size={20} /> New School
            </Link>
          )}
          <Link
            href="/settings/account"
            className={style.nav_item}
            onClick={toggleMenu}
          >
            <FiSettings size={20} /> Settings
          </Link>
          {userData?.role === "student" && (
            <div
              className={style.nav_item}
              onClick={() => {
                setCertificate(true);
                toggleMenu();
              }}
            >
              <FiAward size={20} /> Transcript
            </div>
          )}
          <div
            className={style.nav_item}
            onClick={async () => {
              await OneSignal.logout();
              signOut();
              await AuthServices.logout();
              router.push("/login");
              toggleMenu();
            }}
          >
            <FiLogOut size={20} /> Log Out
          </div>
          <Link
            href={`/profile/${userData?._id}`}
            className={style.nav_item}
            onClick={toggleMenu}
          >
            <ProfilePicture
              src={userData?.profile_picture}
              alt={userData?.first_name || "User"}
              id={userData?._id}
            />{" "}
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
