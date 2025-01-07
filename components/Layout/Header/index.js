/* Header component displayed on every page. Used for navigation */

import style from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../../context/AuthContext";
import { isAuthenticated } from "../../../utils/auth";
import ProfilePicture from "../../Extra/ProfilePicture";
import { useRouter } from "next/router";

// Import Icons
import {
  MdOutlineArrowDropDown,
  MdOutlineAdminPanelSettings,
  MdEdit,
  MdOutlineEmojiEvents,
} from "react-icons/md";
import { FiSettings, FiLogOut, FiAward } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { IoMdTime } from "react-icons/io";
import { RiCopperCoinLine } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi";
import { IoTicketOutline } from "react-icons/io5";

import AuthService from "../../../services/AuthService";
import ModalContext from "../../../context/ModalContext";
import { useTranslation } from "next-i18next";
import OneSignal from "react-onesignal";

/**
 * Header component
 *
 *
 * @return {JSX.Element} The rendered header component
 *
 * @date 6/16/2023 - 5:53:06 PM
 * @author Sami Laayouni
 * @license MIT
 */
/**
 * Header component that displays the navigation bar and user information.
 *
 * @component
 * @returns {JSX.Element} The rendered header component.
 *
 * @description
 * This component renders the header of the application, including the NoteSwap logo, navigation links,
 * user profile information, and a hamburger menu for mobile devices. It also handles user authentication
 * and fetching user data from local storage and APIs.
 *
 * @example
 * <Header />
 *
 * @function
 * @name Header
 *
 * @returns {JSX.Element} The rendered header component.
 *
 * @remarks
 * - Uses `useContext` to access `AuthContext` and `ModalContext`.
 * - Uses `useState` to manage local state for user data and business mode.
 * - Uses `useEffect` to handle side effects such as checking authentication status, fetching user data,
 *   and handling click events outside the dropdown menu.
 * - Uses `useRouter` to access the router object for navigation.
 * - Uses `useTranslation` for internationalization support.
 * - Handles user login/logout and displays different navigation options based on user roles.
 * - Supports both desktop and mobile views with a responsive design.
 */
export default function Header() {
  const { isLoggedIn } = useContext(AuthContext);
  const { certificateModal, addMembers } = useContext(ModalContext);
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const [isCertificate, setCertificate] = certificateModal;
  const [open, setOpen] = addMembers;
  const [userData, setUserData] = useState();
  const [business, setBusiness] = useState(false);
  const router = useRouter();
  const AuthServices = new AuthService(setLoggedIn);

  const { t } = useTranslation("common");

  /*
     This function checks if the current user is logged in
     and updates the setLoggedIn value accordingly. Since this
     value is a context value it will be updated throughout the 
     entire page. 
  */
  useEffect(() => {
    const isLoggedIn = isAuthenticated();
    setLoggedIn(isLoggedIn);
  }, [setLoggedIn]);

  // Get User Data
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserData(JSON.parse(localStorage.getItem("userInfo")));
    }
    if (router?.pathname.includes("business")) {
      setBusiness(true);
    }
  }, [router, loggedIn]);

  useEffect(() => {
    /* 
       Function that fetches the current user's data and store 
       that information in the field userInfo (localstorage).
    */
    async function fetchData(information) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ information }),
      };

      // Get User Info
      const response = await fetch(
        "/api/profile/get_user_profile",
        requestOptions
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userInfo", JSON.stringify(data));
        if (data.role != "association") {
          const schoolRequestInfo = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: data?.schoolId }),
          };
          // Get School Info
          const schoolResponse = await fetch(
            "/api/schools/get_single_school",
            schoolRequestInfo
          );

          if (schoolResponse.ok) {
            const schoolData = await schoolResponse.json();
            localStorage.setItem("schoolInfo", JSON.stringify(schoolData));
          }
        }
      }
    }

    /*
       Runs everytime the page is loaded and updates the information 
       in the userInfo field (stored in localstorage), in order to 
       ensure that the data is accurate and updated.
    */
    if (localStorage && localStorage.getItem("token")) {
      const user = JSON.parse(localStorage.getItem("userInfo"))._id;

      fetchData(user);
    }

    /*
      Runs whenever the user clicks anywhere on the page.
      If the user clicks within the dropdown menu or 
      the userInfo div then keep the dropdown open else
      close the dropdown menu.
    */
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("dropdown");
      if (dropdown.style.display != "none") {
        if (document.getElementById("userInfo")) {
          if (
            dropdown.style.display != "none" &&
            !dropdown.contains(event.target) &&
            !document.getElementById("userInfo").contains(event.target)
          ) {
            dropdown.style.display = "none";
            document.getElementById("dropdownArrow").style.transform =
              "rotateX(0deg)";
          }
        }
      }
    };

    // Handle all clicks in order to close pop up when user clicks outside
    document.addEventListener("click", handleClickOutside);
  }, []);

  // Return the JSX
  return (
    <>
      {/* Header componenet */}
      <header className={style.header_main_container}>
        {/* NoteSwap logo (redirects to /dashboard) */}
        <div className={style.header_logo}>
          <Link
            href={
              loggedIn
                ? userData?.role == "association"
                  ? "/shortcuts"
                  : "/dashboard"
                : router.pathname.includes("business")
                ? "/business"
                : "/"
            }
          >
            <Image
              src="/assets/icons/Logo_light.svg"
              alt="NoteSwap Logo light"
              width={146}
              height={51}
              priority
            ></Image>
          </Link>
          {business && (
            <h1 className={style.business}>
              {t("business") == "business" ? "Business" : t("business")}
            </h1>
          )}
        </div>

        {/* Header nav bar (for tablets and desktops)*/}
        <nav className={style.header_nav}>
          {loggedIn ? (
            <>
              {userData?.role != "volunteer" &&
                userData?.role != "association" && (
                  <>
                    {/* User is logged in */}
                    <Link
                      title="Visit notes"
                      className={style.header_nav_a}
                      href="/notes"
                    >
                      {t("note") == "note" ? "Note" : t("note")}
                    </Link>
                    {userData?.role != "teacher" &&
                      userData?.schoolId == "649d661a3a5a9f73e9e3fa62" && (
                        <Link
                          title="Visit Tutor"
                          className={style.header_nav_a}
                          href="/tutor"
                        >
                          {t("tutor") == "tutor" ? "Tutor" : t("tutor")}
                        </Link>
                      )}
                  </>
                )}
              {userData?.role != "association" && (
                <>
                  <Link
                    title="Visit events"
                    className={style.header_nav_a}
                    href="/event"
                  >
                    {t("events") == "events" ? "Events" : t("events")}
                  </Link>
                  {/* <Link
                    title="Discovery"
                    className={style.header_nav_a}
                    href="/discover"
                  >
                    Discovery
                  </Link> */}
                </>
              )}
              {/* User info (Profile pic + name)*/}
              {userData && (
                <>
                  <div
                    id="userInfo"
                    className={style.userInfo}
                    onClick={() => {
                      if (
                        document.getElementById("dropdown").style.display ==
                          "none" ||
                        !document.getElementById("dropdown").style.display
                      ) {
                        document.getElementById("dropdown").style.display =
                          "block";

                        document.getElementById(
                          "dropdownArrow"
                        ).style.transform = "rotateX(180deg)";
                      } else {
                        document.getElementById("dropdown").style.display =
                          "none";
                        document.getElementById(
                          "dropdownArrow"
                        ).style.transform = "rotateX(0deg)";
                      }
                    }}
                  >
                    {/* Profile picture */}
                    <ProfilePicture
                      src={userData?.profile_picture}
                      alt={userData?.first_name}
                      id={userData?._id}
                    />
                    <p
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--manrope-font)",
                        paddingLeft: "10px",
                      }}
                    >
                      {userData?.first_name}{" "}
                      {userData?.first_name?.length +
                        userData?.last_name?.length <
                      15
                        ? userData?.last_name
                        : ""}
                    </p>

                    {/* Dropdown button */}
                    <MdOutlineArrowDropDown
                      id="dropdownArrow"
                      size={30}
                      style={{
                        paddingLeft: "5px",
                        verticalAlign: "middle",
                        cursor: "pointer",
                        transition: "all 1s ease",
                      }}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {business && (
                <Link className={style.header_nav_a} href="/business/pricing">
                  Pricing
                </Link>
              )}
              {!business && (
                <Link className={style.header_nav_a} href="/event">
                  Explore Events
                </Link>
              )}
              <Link className={style.header_nav_a} href="/login">
                {t("login") == "login" ? "Login" : t("login")}
              </Link>

              <div style={{ display: "inline-block" }}>
                <Link
                  className={style.header_nav_button}
                  href={
                    router.pathname.includes("business")
                      ? "/business/signup"
                      : "/signup"
                  }
                >
                  {router.pathname.includes("business")
                    ? "Get started"
                    : t("signup") == "signup"
                    ? "Signup"
                    : t("signup")}
                </Link>
              </div>
            </>
          )}
        </nav>
        {/* Hamburger menu (mobile devices only) */}
        <div className={style.hamburger_menu}>
          {/* User is logged in*/}
          {loggedIn && (
            <div
              style={{ display: "inline-block" }}
              onClick={() => {
                if (
                  document.getElementById("dropdown").style.display == "none" ||
                  !document.getElementById("dropdown").style.display
                ) {
                  document.getElementById("dropdown").style.display = "block";
                } else {
                  document.getElementById("dropdown").style.display = "none";
                }
              }}
            >
              {/* Profile picture */}
              <ProfilePicture
                style={{ verticalAlign: "middle", marginRight: "10px" }}
                src={userData?.profile_picture}
                alt={userData?.first_name}
                id={userData?._id}
              />
            </div>
          )}
          {/* Hamburger menu button */}
          <Image
            style={{ verticalAlign: "middle", paddingLeft: "10px" }}
            src="/assets/images/nav/hamburger_menu.svg"
            alt="Menu"
            width={40}
            height={40}
            onClick={() => {
              if (
                document.getElementById("hamburger_menu").style.display ==
                  "none" ||
                !document.getElementById("hamburger_menu").style.display
              ) {
                document.getElementById("hamburger_menu").style.display =
                  "block";
                document.getElementById("hamburger_overlay").style.display =
                  "block";
              }
            }}
          />
        </div>
      </header>

      <div id="hamburger_overlay" className={style.hamburger_overlay}></div>
      {/* The hamburger menu */}
      <section id="hamburger_menu" className={style.hamburger}>
        <Image
          className={style.close}
          src="/assets/images/nav/close.svg"
          alt="Close"
          width={28}
          height={28}
          onClick={() => {
            document.getElementById("hamburger_menu").style.display = "none";
            document.getElementById("hamburger_overlay").style.display = "none";
          }}
        />

        <ul>
          {/* User is not logged in*/}
          {!loggedIn ? (
            <>
              <Link href="/login">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  {t("login") == "login" ? "Login" : t("login")}
                  <div className={style.borderLine} />
                </li>
              </Link>
              {business && (
                <Link href="/business/pricing">
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    Pricing
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}
              <Link
                href={
                  router.pathname.includes("business")
                    ? "/business/signup"
                    : "/signup"
                }
              >
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  {router.pathname.includes("business")
                    ? "Get Started"
                    : t("signup") == "signup"
                    ? "Signup"
                    : t("signup")}
                  <div className={style.borderLine} />
                </li>
              </Link>
              {!business && (
                <Link href="/business">
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    For Schools
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}
            </>
          ) : (
            <>
              {userData?.role != "volunteer" && (
                <>
                  <Link href="/notes">
                    <li
                      onClick={() => {
                        document.getElementById(
                          "hamburger_menu"
                        ).style.display = "none";
                        document.getElementById(
                          "hamburger_overlay"
                        ).style.display = "none";
                      }}
                    >
                      {t("note") == "note" ? "Note" : t("note")}
                      <div className={style.borderLine} />
                    </li>
                  </Link>
                </>
              )}

              {userData?.role != "association" && (
                <Link href="/event">
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    {t("events") == "events" ? "Events" : t("events")}
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}

              {userData?.role == "association" && userData?.associations[0] && (
                <Link
                  href={`/association/${
                    userData?.associations[userData?.associations.length - 1]
                  }`}
                >
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    {" "}
                    {t("my_association")}
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}

              {userData?.role == "teacher" && (
                <Link href={`/teacher/events`}>
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    My events <div className={style.borderLine} />
                  </li>
                </Link>
              )}

              {userData?.role == "association" && userData?.associations[0] && (
                <Link href={`/business/edit`}>
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    {t("edit_association") == "edit_association"
                      ? "Edit Association"
                      : t("edit_association")}
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}

              {(userData?.role === "teacher" ||
                userData?.role === "school") && (
                <Link href="/rewardcs">
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    {t("reward_cs") == "reward_cs"
                      ? "Reward CS"
                      : t("reward_cs")}
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}

              {userData?.role != "association" && (
                <Link href="/tickets">
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    My Tickets{" "}
                    <span
                      style={{
                        background: "var(--accent-color)",
                        padding: "4px",
                        color: "white",
                        borderRadius: "2px",
                      }}
                    >
                      NoteSwap Events
                    </span>
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}

              {userData?.role == "association" && (
                <Link href="/shortcuts">
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    My Events
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}

              {userData?.role == "association" && (
                <li
                  onClick={() => {
                    setOpen(true);
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  Add Members
                  <div className={style.borderLine} />
                </li>
              )}

              {userData?.role == "association" && (
                <Link href="/business/finance">
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    Finance
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}

              {userData?.role == "student" && (
                <>
                  <li
                    onClick={() => {
                      setCertificate(true);
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    {t("transcript")}
                    <div className={style.borderLine} />
                  </li>
                  <Link href="/productivity">
                    <li
                      onClick={() => {
                        document.getElementById(
                          "hamburger_menu"
                        ).style.display = "none";
                        document.getElementById(
                          "hamburger_overlay"
                        ).style.display = "none";
                      }}
                    >
                      {t("my_productivity") == "my_productivity"
                        ? "My Productivity"
                        : t("my_productivity")}{" "}
                      <div className={style.borderLine} />
                    </li>
                  </Link>
                </>
              )}

              <Link href="/settings/account">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  {t("setting") == "setting" ? "Settings" : t("setting")}
                  <div className={style.borderLine} />
                </li>
              </Link>

              <li
                onClick={async () => {
                  document.getElementById("dropdown").style.display = "none";
                  await OneSignal.logout();
                  AuthServices.logout();
                  router.push("/login");
                  document.getElementById("hamburger_menu").style.display =
                    "none";
                  document.getElementById("hamburger_overlay").style.display =
                    "none";
                }}
              >
                {t("log_out") == "log_out" ? "Log Out" : t("log_out")}
                <div className={style.borderLine} />
              </li>
            </>
          )}
        </ul>
      </section>
      {/* Dropdown menu (email) */}
      <section id="dropdown" className={style.dropdown}>
        <ul>
          <p className={style.lightext}>
            {userData?.email ? userData?.email : "Could not be found"}
          </p>

          {userData?.role == "association" && (
            <p
              className={style.lightext}
              style={{ color: "var(--accent-color)" }}
            >
              {t("business_account") == "business_account"
                ? "Business Account"
                : t("business_account")}
            </p>
          )}

          {/* School Account */}
          {userData?.role != "association" && (
            <p
              className={style.lightext}
              style={{ color: "var(--accent-color)" }}
            >
              {t("school_account")}{" "}
            </p>
          )}
          {/* Line */}
          <div className={style.line}></div>

          <li>
            <Link href={`/profile/${userData?._id}`}>
              <CgProfile size={21} style={{ verticalAlign: "middle" }} />
              <span>
                {t("my_profile") == "my_profile"
                  ? "My Profile"
                  : t("my_profile")}
              </span>
            </Link>
          </li>

          {userData?.role == "association" && userData?.associations[0] && (
            <li>
              <Link
                href={`/association/${
                  userData?.associations[userData?.associations.length - 1]
                }`}
              >
                <HiUserGroup size={21} style={{ verticalAlign: "middle" }} />
                <span>{t("my_association")}</span>
              </Link>
            </li>
          )}

          {userData?.role == "teacher" && (
            <li>
              <Link href={`/teacher/events`}>
                <MdOutlineEmojiEvents
                  size={21}
                  style={{ verticalAlign: "middle" }}
                />
                <span>My events</span>
              </Link>
            </li>
          )}
          {(userData?.role === "teacher" || userData?.role === "school") && (
            <li>
              <Link href="/rewardcs">
                <RiCopperCoinLine
                  size={21}
                  style={{ verticalAlign: "middle" }}
                />
                <span>
                  {t("reward_cs") == "reward_cs" ? "Reward CS" : t("reward_cs")}
                </span>
              </Link>
            </li>
          )}
          {userData?.role !== "association" && (
            <li>
              <Link href="/tickets">
                <IoTicketOutline
                  size={21}
                  style={{ verticalAlign: "middle" }}
                />
                <span>My Tickets</span>
                <span
                  style={{
                    background: "var(--accent-color)",
                    padding: "4px",
                    color: "white",
                    borderRadius: "2px",
                  }}
                >
                  Events
                </span>
              </Link>
            </li>
          )}
          {userData?.role == "student" && (
            <li>
              <Link href="/productivity">
                <IoMdTime size={21} style={{ verticalAlign: "middle" }} />
                <span>
                  {t("my_productivity") == "my_productivity"
                    ? "My Productivity"
                    : t("my_productivity")}
                </span>
              </Link>
            </li>
          )}
          {userData?.admin == true && (
            <li>
              <Link href="/admin">
                <MdOutlineAdminPanelSettings
                  size={21}
                  style={{ verticalAlign: "middle" }}
                />
                <span>
                  {t("admin_page") == "admin_page"
                    ? "Admin Page"
                    : t("admin_page")}
                </span>
              </Link>
            </li>
          )}

          {userData?.role == "association" && (
            <li>
              <Link href={`/business/edit`}>
                <MdEdit size={21} style={{ verticalAlign: "middle" }} />
                <span>
                  {t("edit_association") == "edit_association"
                    ? "Edit Association"
                    : t("edit_association")}
                </span>
              </Link>
            </li>
          )}

          {userData?.role == "school" && (
            <li>
              <Link href="for_schools">
                <MdEdit size={21} style={{ verticalAlign: "middle" }} />
                <span>Create new school</span>
              </Link>
            </li>
          )}
          <li>
            <Link href="/settings/account">
              <FiSettings size={21} style={{ verticalAlign: "middle" }} />
              <span>
                {t("setting") == "setting" ? "Settings" : t("setting")}
              </span>
            </Link>
          </li>

          {userData?.role == "student" && (
            <li onClick={() => setCertificate(true)}>
              <FiAward size={21} style={{ verticalAlign: "middle" }} />
              <span>{t("transcript")} </span>
            </li>
          )}

          <li
            onClick={async () => {
              document.getElementById("dropdown").style.display = "none";
              await OneSignal.logout();

              AuthServices.logout();
              router.push("/login");
            }}
          >
            <FiLogOut size={21} style={{ verticalAlign: "middle" }} />
            <span>
              {t("log_out") == "log_out" ? "Log Out" : t("log_out")}
            </span>{" "}
            {/* Logout button */}
          </li>
        </ul>
      </section>
    </>
  );
}
