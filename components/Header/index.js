import style from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { isAuthenticated } from "../../utils/auth";
import { useEffect } from "react";
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
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  useEffect(() => {
    const isLoggedIn = isAuthenticated();
    setLoggedIn(isLoggedIn);
  }, [setLoggedIn]);
  return (
    <>
      <header className={style.header_main_container}>
        <div className={style.header_logo}>
          <Link href={loggedIn ? "/dashboard" : "/"}>
            <Image
              src="./assets/icons/Logo_light.svg"
              alt="Noteswap Logo light"
              width={146}
              height={51}
              priority
            ></Image>
          </Link>
        </div>

        <nav className={style.header_nav}>
          {loggedIn ? (
            <>
              {/* User is logged in */}
              <Link className={style.header_nav_a} href="/">
                A
              </Link>
              <Link className={style.header_nav_a} href="/">
                B
              </Link>
              <Link className={style.header_nav_a} href="/">
                C
              </Link>
            </>
          ) : (
            <>
              {/* User is not logged in */}
              <Link className={style.header_nav_a} href="/">
                Notes
              </Link>
              <Link className={style.header_nav_a} href="/login">
                Login
              </Link>
              <div style={{ display: "inline-block" }}>
                <Link className={style.header_nav_button} href="/signup">
                  Sign up
                </Link>
              </div>
            </>
          )}
        </nav>
        <Image
          src="/assets/images/nav/hamburger_menu.svg"
          alt="Menu"
          width={31}
          height={31}
          className={style.hamburger_menu}
          onClick={() => {
            if (
              document.getElementById("hamburger_menu").style.display ==
                "none" ||
              !document.getElementById("hamburger_menu").style.display
            ) {
              document.getElementById("hamburger_menu").style.display = "block";
              document.getElementById("hamburger_overlay").style.display =
                "block";
            }
          }}
        />
      </header>
      <div id="hamburger_overlay" className={style.hamburger_overlay}></div>
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
          {!loggedIn ? (
            <>
              <Link href="/">
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
                  Login
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
                  Signup
                  <div className={style.borderLine} />
                </li>
              </Link>
            </>
          ) : (
            <>
              <Link href="/">
                <li
                  onClick={() => {
                    document.getElementById("hamburger_menu").style.display =
                      "none";
                    document.getElementById("hamburger_overlay").style.display =
                      "none";
                  }}
                >
                  A
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
                  B
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
                  C
                  <div className={style.borderLine} />
                </li>
              </Link>
            </>
          )}
        </ul>
      </section>
    </>
  );
}
