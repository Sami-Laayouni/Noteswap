import Image from "next/image";
import Link from "next/link";

import { FiArrowRight } from "react-icons/fi";
import Logo from "/public/assets/icons/Logo_light.svg";
import MenuIcon from "/public/assets/new/menu.svg";

import style from "./Header.module.css"; // Import the CSS module

function Header() {
  return (
    <header className={style["site-header"]}>
      {/* Top Banner */}
      <div className={style["top-banner"]}>
        <p className={style["banner-text"]}>
          Effortlessly manage extracurriculars with our all-in-one platform.
        </p>
        <Link href="/book_a_demo">
          <div className={style["banner-link"]}>
            <p>Get started for free</p>
            <FiArrowRight width={16} height={16} />
          </div>
        </Link>
      </div>

      {/* Main Header */}
      <div className={style["main-header"]}>
        <div className={style.container}>
          <div className={style["header-row"]}>
            {/* Logo */}
            <Link href="/">
              <Image src={Logo} alt="Logo" height={40} width={160} priority />
            </Link>

            {/* Mobile Menu Icon */}
            <button className={style["mobile-menu"]} aria-label="Open menu">
              <Image src={MenuIcon} alt="Menu icon" width={20} height={20} />
            </button>

            {/* Navigation Links */}
            <nav className={style["nav-links"]}>
              <Link href="/login">Login</Link>
              {/*<Link href="/signup">Sign up</Link>*/}
              <Link href="/book_a_demo">
                <button className={style["demo-btn"]}>Book a demo</button>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
