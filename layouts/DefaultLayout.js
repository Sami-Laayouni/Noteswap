import { AuthProvider } from "../context/AuthContext";
import { ModalProvider } from "../context/ModalContext";
import { SocketProvider } from "../context/SocketContext";
import dynamic from "next/dynamic";
const Certificate = dynamic(() => import("../components/CertificateModal"));
const LargenImage = dynamic(() => import("../components/LargenImage"));
const BookASession = dynamic(() => import("../components/BookASession"));
const Header = dynamic(() => import("../components/Header"));
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
          <BookASession />
          <main>{children}</main>
        </SocketProvider>
      </ModalProvider>
    </AuthProvider>
  );
};

export default DefaultLayout;
