/* The default layout used in the page */

// Import the Auth Provider
import { AuthProvider } from "../context/AuthContext";
// Import the Modal Provider
import { ModalProvider } from "../context/ModalContext";
// Import the Socket Provider
import { SocketProvider } from "../context/SocketContext";
// Import dynamic loading from NEXTJS
import dynamic from "next/dynamic";
const Certificate = dynamic(() => import("../components/CertificateModal"), {
  ssr: false,
});
const LargenImage = dynamic(() => import("../components/LargenImage"), {
  ssr: false,
});
const ShareNotes = dynamic(() => import("../components/ShareNotes"), {
  ssr: false,
});

const Header = dynamic(() => import("../components/Header"));
const TimeTracker = dynamic(() => import("../components/TimeTracker"));
/**
 * Default layout
 * @date 6/17/2023 - 4:26:44 PM
 *
 * @param {{ children: any; }} { children }
 * @returns {JSX.Element} The rendered layout of the page
 */
const DefaultLayout = ({ children }) => {
  return (
    <AuthProvider>
      <ModalProvider>
        <SocketProvider>
          <Header />
          <Certificate />
          <LargenImage />
          <ShareNotes />
          <TimeTracker />
          <main>{children}</main>
        </SocketProvider>
      </ModalProvider>
    </AuthProvider>
  );
};

export default DefaultLayout;
// End of the default layout
