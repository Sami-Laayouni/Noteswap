import Header from "../components/Header";
import { AuthProvider } from "../context/AuthContext";
import { ModalProvider } from "../context/ModalContext";
import dynamic from "next/dynamic";
const Certificate = dynamic(() => import("../components/CertificateModal"));
const Notes = dynamic(() => import("../components/NotesModal"));
const ImageNotesModal = dynamic(() => import("../components/ImageNotesModal"));
const LargenImage = dynamic(() => import("../components/LargenImage"));
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
        <Header />
        <Certificate />
        <Notes />
        <ImageNotesModal />
        <LargenImage />
        <main>{children}</main>
      </ModalProvider>
    </AuthProvider>
  );
};

export default DefaultLayout;
