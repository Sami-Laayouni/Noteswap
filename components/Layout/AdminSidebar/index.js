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
        <Link href="https://noteswap.statuspage.io/">
          <li>Server status</li>
        </Link>
        <Link href="https://vercel.com/sami-laayouni/noteswap/logs?timeline=past30Minutes&page=1&startDate=1697390839594&endDate=1697392639594">
          <li>Error Logs</li>
        </Link>
        <Link href="https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/p403158042/reports/intelligenthome">
          <li>Analytics</li>
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
