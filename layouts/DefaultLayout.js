import { AuthProvider } from "../context/AuthContext";
import { ModalProvider } from "../context/ModalContext";
import { SocketProvider } from "../context/SocketContext";
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
          <main>{children}</main>
        </SocketProvider>
      </ModalProvider>
    </AuthProvider>
  );
};

export default DefaultLayout;
