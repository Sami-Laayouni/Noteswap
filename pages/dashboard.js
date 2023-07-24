import { requireAuthentication } from "../middleware/authenticate";
import Head from "next/head";
import style from "../styles/Dashboard.module.css";
import NoteSwapBot from "../components/NoteSwapBot";
import { useState, useEffect } from "react";

/**
 * Dashboard
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/13/2023 - 9:56:14 PM
 * @author Sami Laayouni
 * @license MIT
 */
const Dashboard = () => {
  const [userData, setUserData] = useState();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserData(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);
  return (
    <main className={style.background}>
      <Head>
        <title>Dashboard | Noteswap</title> {/* Title page */}
      </Head>
      <NoteSwapBot /> {/* The noteswap bot*/}
    </main>
  );
};

export default requireAuthentication(Dashboard);
