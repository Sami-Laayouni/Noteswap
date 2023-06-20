import { requireAuthentication } from "../middleware/authenticate";
import AuthService from "../services/AuthService";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import Head from "next/head";
import { useContext } from "react";

/**
 * Dashboard
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/13/2023 - 9:56:14 PM
 * @author Sami Laayouni
 * @license MIT
 */
const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const AuthServices = new AuthService(authContext);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Dashboard | Noteswap</title>
      </Head>
      <button
        onClick={() => {
          AuthServices.logout();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </>
  );
};

export default requireAuthentication(Dashboard);
