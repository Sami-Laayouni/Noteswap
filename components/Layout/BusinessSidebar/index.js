/* Sidebar that is used to route between business pages */
import style from "./businessSidebar.module.css";
import Link from "next/link";
import { useContext } from "react";
import ModalContext from "../../../context/ModalContext";

/**
 * Sidebar shown for every page in business
 * @date 7/24/2023 - 7:34:03 PM
 *
 * @export
 * @return {*}
 */
export default function BusinessSidebar() {
  const { addMembers } = useContext(ModalContext);
  const [add, setAdd] = addMembers;

  //Return the JSX
  return (
    <nav>
      <ul className={style.nav}>
        <h1>Business</h1>
        <div className={style.verticalAlign}></div>
        <Link href="/shortcuts">
          <li>Events</li>
        </Link>

        <li
          onClick={() => {
            setAdd(true);
          }}
        >
          Add Members
        </li>

        <Link href="/business/finance">
          <li>Finance</li>
        </Link>
      </ul>
    </nav>
  );
}
