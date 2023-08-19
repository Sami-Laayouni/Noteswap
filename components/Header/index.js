import style from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { isAuthenticated } from "../../utils/auth";
import { useEffect } from "react";
import ProfilePicture from "../ProfilePicture";
import { useRouter } from "next/router";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { FiSettings, FiLogOut, FiAward } from "react-icons/fi";
import { LuGlasses } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import AuthService from "../../services/AuthService";
import ModalContext from "../../context/ModalContext";
import { useTranslation } from "next-i18next";

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
export default function Header() {
  const { isLoggedIn } = useContext(AuthContext);
  const { certificateModal } = useContext(ModalContext);
  const [loggedIn, setLoggedIn] = isLoggedIn;
  const [isCertificate, setCertificate] = certificateModal;
  const [userData, setUserData] = useState();
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

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, [router]);

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

      const response = await fetch(
        "/api/profile/get_user_profile",
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userInfo", JSON.stringify(data));
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
        {/* Noteswap logo (redirects to /dashboard) */}
        <div className={style.header_logo}>
          <Link href={loggedIn ? "/dashboard" : "/"}>
            <Image
              src="/assets/icons/Logo_light.svg"
              alt="Noteswap Logo light"
              width={146}
              height={51}
              priority
            ></Image>
          </Link>
        </div>

        {/* Header nav bar (for tablets and desktops)*/}
        <nav className={style.header_nav}>
          {loggedIn ? (
            <>
              {/* User is logged in */}
              <Link
                title="Visit notes"
                className={style.header_nav_a}
                href="/notes"
              >
                Notes
              </Link>
              <Link
                title="Visit Tutor"
                className={style.header_nav_a}
                href="/tutor"
              >
                Tutor
              </Link>
              <Link
                title="Visit events"
                className={style.header_nav_a}
                href="/event"
              >
                Events
              </Link>
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
                      {userData?.first_name} {userData?.last_name}
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
              {/* User is not logged in */}
              <Link
                title="Visit notes"
                className={style.header_nav_a}
                href="/notes"
              >
                Notes
              </Link>
              <Link className={style.header_nav_a} href="/login">
                {t("login")}
              </Link>
              <div style={{ display: "inline-block" }}>
                <Link className={style.header_nav_button} href="/signup">
                  {t("signup")}
                </Link>
              </div>
            </>
          )}
        </nav>
        {/* Hamburger menu (mobile devices only) */}
        <div className={style.hamburger_menu}>
          {/* User is logged in*/}
          {!loggedIn && (
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
              <Link href="/notes">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  Notes
                  <div className={style.borderLine} />
                </li>
              </Link>
              <Link href="/login">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  {t("login")}
                  <div className={style.borderLine} />
                </li>
              </Link>
              <Link href="/signup">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  {t("signup")}
                  <div className={style.borderLine} />
                </li>
              </Link>
            </>
          ) : (
            <>
              <Link href="/notes">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  Notes
                  <div className={style.borderLine} />
                </li>
              </Link>
              <Link href="/tutor">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  Tutor
                  <div className={style.borderLine} />
                </li>
              </Link>
              <Link href="/event">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  Events
                  <div className={style.borderLine} />
                </li>
              </Link>
              <Link href="/settings/account">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  Settings
                  <div className={style.borderLine} />
                </li>
              </Link>
              {userData?.role == "student" && (
                <li
                  onClick={() => {
                    setCertificate(true);
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  Certificates
                  <div className={style.borderLine} />
                </li>
              )}
              {userData?.role != "student" && (
                <Link href="/detect_ai">
                  <li
                    onClick={() => {
                      document.getElementById("hamburger_menu").style.display =
                        "none";
                      document.getElementById(
                        "hamburger_overlay"
                      ).style.display = "none";
                    }}
                  >
                    Detect AI Text
                    <div className={style.borderLine} />
                  </li>
                </Link>
              )}

              <li
                onClick={() => {
                  document.getElementById("dropdown").style.display = "none";
                  AuthServices.logout();
                  router.push("/login");
                  document.getElementById("hamburger_menu").style.display =
                    "none";
                  document.getElementById("hamburger_overlay").style.display =
                    "none";
                }}
              >
                Log out
                <div className={style.borderLine} />
              </li>
            </>
          )}
        </ul>
      </section>
      {/* Dropdown menu (School code + email/metamask address) */}
      <section id="dropdown" className={style.dropdown}>
        <ul>
          <p className={style.lightext}>
            {userData?.email ? userData?.email : userData?.metamask_address}
          </p>
          <p>
            {userData?.schoolCode ? `School code: ${userData?.schoolCode}` : ""}
          </p>
          <div className={style.line}></div>
          <li>
            <Link href={`/profile/${userData?._id}`}>
              <CgProfile size={21} style={{ verticalAlign: "middle" }} />
              <span>My Profile</span>
            </Link>
          </li>
          <li>
            <Link href="/settings/account">
              <FiSettings size={21} style={{ verticalAlign: "middle" }} />
              <span>Settings</span>
            </Link>
          </li>
          {userData?.role == "student" && (
            <li onClick={() => setCertificate(true)}>
              <FiAward size={21} style={{ verticalAlign: "middle" }} />
              <span>Certificates </span>
            </li>
          )}
          {userData?.role != "student" && (
            <li>
              <Link href="/detect_ai">
                <LuGlasses size={21} style={{ verticalAlign: "middle" }} />
                <span>Detect AI Text</span>
              </Link>
            </li>
          )}

          <li
            onClick={() => {
              document.getElementById("dropdown").style.display = "none";
              AuthServices.logout();
              router.push("/login");
            }}
          >
            <FiLogOut size={21} style={{ verticalAlign: "middle" }} />
            <span>Log out</span> {/* Logout button */}
          </li>
        </ul>
      </section>
    </>
  );
}
