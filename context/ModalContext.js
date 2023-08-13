import { createContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [certificate, setCertificate] = useState(false);
  const [notes, setNotes] = useState(false);
  const [images, setImages] = useState(false);
  const [imagesUrl, setImagesUrl] = useState();
  const [error, setError] = useState("");
  const [image, setImage] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [tutor, setTutor] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [bookSession, setBookSession] = useState(false);
  const [bookSessionInfo, setBookSessionInfo] = useState();
  const [eventStatus, setEventStatus] = useState(false);
  const [eventdata, setEventData] = useState("");
  return (
    <ModalContext.Provider
      value={{
        certificateModal: [certificate, setCertificate],
        notesModal: [notes, setNotes],
        imageNotesModal: [images, setImages],
        imagesUrl: [imagesUrl, setImagesUrl],
        imageError: [error, setError],
        imageModal: [image, setImage],
        imageUrl: [imageUrl, setImageUrl],
        tutor: [tutor, setTutor],
        deleteModal: [deleteModal, setDeleteModal],
        bookSession: [bookSession, setBookSession],
        bookSessionInfo: [bookSessionInfo, setBookSessionInfo],
        eventStatus: [eventStatus, setEventStatus],
        eventdata: [eventdata, setEventData],
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
