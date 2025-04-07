import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import Logo from "/public/assets/icons/Logo_light.svg";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

import style from "./Header.module.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

            {/* Hamburger Toggle Button */}
            <button
              className={style["mobile-menu"]}
              aria-label="Toggle menu"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <IoClose size={20} width={50} height={50} />
              ) : (
                <RxHamburgerMenu size={20} width={50} height={30} />
              )}
            </button>

            {/* Desktop Nav */}
            <nav className={style["nav-links"]}>
              <Link href="/login">Login</Link>
              <Link href="/book_a_demo">
                <button className={style["demo-btn"]}>Book a demo</button>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu (only shows if open) */}
      {isMenuOpen && (
        <div className={style["mobile-nav"]}>
          <Link href="/login" onClick={toggleMenu}>
            Login
          </Link>
          <Link href="/book_a_demo" onClick={toggleMenu}>
            <button className={style["demo-btn"]}>Book a demo</button>
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
