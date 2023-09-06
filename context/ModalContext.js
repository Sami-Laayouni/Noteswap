import { createContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [certificate, setCertificate] = useState(false);
  const [notes, setNotes] = useState(false);
  const [images, setImages] = useState(false);
  const [imagesUrl, setImagesUrl] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [tutor, setTutor] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [bookSession, setBookSession] = useState(false);
  const [bookSessionInfo, setBookSessionInfo] = useState();
  const [eventStatus, setEventStatus] = useState(false);
  const [eventdata, setEventData] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareURL, setShareURL] = useState("");
  const [citeOpen, setCiteOpen] = useState(false);
  const [citeInfo, setCiteInfo] = useState("");
  const [warning, setWarning] = useState(true); //Signup popup
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editId, setEditId] = useState("");
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
        shareOpen: [shareOpen, setShareOpen],
        shareURL: [shareURL, setShareURL],
        citeOpen: [citeOpen, setCiteOpen],
        citeInfo: [citeInfo, setCiteInfo],
        warning: [warning, setWarning],
        edit: [edit, setEdit],
        editValue: [editValue, setEditValue],
        editTitle: [editTitle, setEditTitle],
        editId: [editId, setEditId],
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
