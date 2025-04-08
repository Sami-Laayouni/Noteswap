/* layouts/DefaultLayout.js */
import { AuthProvider } from "../context/AuthContext";
import { ModalProvider } from "../context/ModalContext";
import { SocketProvider } from "../context/SocketContext";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import styles from "./DefaultLayout.module.css";

const Transcript = dynamic(
  () => import("../components/Modals/TranscriptModal"),
  {
    ssr: false,
  }
);
const LargenImage = dynamic(() => import("../components/Modals/LargenImage"), {
  ssr: false,
});
const Share = dynamic(() => import("../components/Modals/Share"), {
  ssr: false,
});
const BusinessModal = dynamic(
  () => import("../components/Modals/BusinessModal"),
  {
    ssr: false,
  }
);
const Header = dynamic(() => import("../components/Layout/Header"), {
  ssr: false,
});

const DefaultLayout = ({ children }) => {
  const { status } = useSession();

  return (
    <AuthProvider>
      <ModalProvider>
        <SocketProvider>
          <Transcript />
          <LargenImage />
          <Share type={"note"} />
          <BusinessModal />
          <div className={styles.layoutContainer}>
            {status === "authenticated" && (
              <div className={styles.headerWrapper}>
                <Header />
              </div>
            )}
            <main className={styles.mainContent}>{children}</main>
          </div>
        </SocketProvider>
      </ModalProvider>
    </AuthProvider>
  );
};

export default DefaultLayout;
