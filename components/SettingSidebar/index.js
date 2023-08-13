import style from "./settingSidebar.module.css";
import Link from "next/link";

/**
 * Sidebar shown for every page in setting
 * @date 7/24/2023 - 7:34:03 PM
 *
 * @export
 * @return {*}
 */
export default function SettingSidebar() {
  return (
    <nav>
      <ul className={style.nav}>
        <h1>Settings</h1>
        <div className={style.verticalAlign}></div>
        <Link href="/settings/account">
          <li>Account</li>
        </Link>
        <Link href="/settings/language">
          <li>Language</li>
        </Link>

        <Link href="/boring/terms-of-service">
          <li>Terms of service</li>
        </Link>
        <Link href="/boring/privacy-policy">
          <li>Privacy Policy</li>
        </Link>
      </ul>
    </nav>
  );
}
