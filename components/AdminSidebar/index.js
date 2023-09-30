/* Sidebar that is used to route between admin pages */
import style from "./adminSidebar.module.css";
import Link from "next/link";

/**
 * Sidebar shown for every page in admin
 * @date 7/24/2023 - 7:34:03 PM
 *
 * @export
 * @return {*}
 */
export default function AdminSidebar() {
  //Return the JSX
  return (
    <nav>
      <ul className={style.nav}>
        <h1>Admin</h1>
        <div className={style.verticalAlign}></div>
        <Link href="/settings/account">
          <li>Server status</li>
        </Link>
        <Link href="/settings/account">
          <li>Error Logs</li>
        </Link>
        <Link href="/settings/account">
          <li>User Management</li>
        </Link>
        <Link href="/add_vector">
          <li>Add vectors</li>
        </Link>
        <Link href="/assets/pdf/whitepaper.pdf">
          <li>Whitepaper</li>
        </Link>
      </ul>
    </nav>
  );
}
