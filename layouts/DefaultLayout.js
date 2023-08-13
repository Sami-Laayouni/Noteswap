import Header from "../components/Header";
import { AuthProvider } from "../context/AuthContext";
import { ModalProvider } from "../context/ModalContext";
import { SocketProvider } from "../context/SocketContext";
import dynamic from "next/dynamic";
const Certificate = dynamic(() => import("../components/CertificateModal"));
const Notes = dynamic(() => import("../components/NotesModal"));
const ImageNotesModal = dynamic(() => import("../components/ImageNotesModal"));
const LargenImage = dynamic(() => import("../components/LargenImage"));
const BecomeTutor = dynamic(() => import("../components/BecomeTutor"));
const DeleteAccount = dynamic(() => import("../components/DeleteAccountModal"));
const BookASession = dynamic(() => import("../components/BookASession"));
const CreateEvent = dynamic(() => import("../components/CreateEvent"));
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
          <Notes />
          <ImageNotesModal />
          <LargenImage />
          <BecomeTutor />
          <DeleteAccount />
          <BookASession />
          <CreateEvent />
          <main>{children}</main>
        </SocketProvider>
      </ModalProvider>
    </AuthProvider>
  );
};

export default DefaultLayout;
