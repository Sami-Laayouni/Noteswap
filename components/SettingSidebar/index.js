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
        <Link href="/settings/account">
          <li>Account</li>
        </Link>
        <Link href="/settings/account">
          <li>Language</li>
        </Link>
        <Link href="/boring/terms-of-service">
          <li>Terms of service</li>
        </Link>
      </ul>
    </nav>
  );
}
