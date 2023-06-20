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
  }, []);
  return (
    <header className={style.header_main_container}>
      <div className={style.header_logo}>
        <Link href={loggedIn ? "/dashboard" : "/"}>
          <Image
            src="./assets/icons/Logo_light.svg"
            alt="Noteswap Logo light"
            width={140}
            height={50}
          ></Image>
        </Link>
      </div>

      <nav className={style.header_nav}>
        {loggedIn ? (
          <>
            {/* User is logged in */}
            <Link href="/">A</Link>
            <Link href="/">B</Link>
            <Link href="/">C</Link>
          </>
        ) : (
          <>
            {/* User is not logged in */}
            <Link href="/login">Log in</Link>
            <Link href="/">E</Link>
            <Link href="/">F</Link>
          </>
        )}
      </nav>
    </header>
  );
}
