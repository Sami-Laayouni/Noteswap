/* This file conatins the app wide component used to store if 
a certain Modal is opened or closed. */

// Import from React
import { createContext, useState } from "react";

// Create new context
const ModalContext = createContext();

// Export the Modal Provider (wraps the entire app)
export const ModalProvider = ({ children }) => {
  const [certificate, setCertificate] = useState(false); // Stores whether the certificate Modal is opened or closed
  const [notes, setNotes] = useState(false); // Stores whether the Notes Modal (to type out notes) is opened or closed
  const [images, setImages] = useState(false); // Stores whether the Image Notes Modal is opened or closed
  const [imagesUrl, setImagesUrl] = useState(""); // Stores the first image that the user uploads
  const [error, setError] = useState(""); // Stores some error message (I forgot what)
  const [image, setImage] = useState(false); // Stores whether the expanded image modal is closed or opened
  const [imageUrl, setImageUrl] = useState(""); // Stores the Image URL for expanded images
  const [tutor, setTutor] = useState(false); // Stores whether the become a tutor modal is closed or opened
  const [deleteModal, setDeleteModal] = useState(false); // Stores whether the delete account modal is closed or opened
  const [bookSession, setBookSession] = useState(false); // Stores whether the book a tutor modal is closed or opened
  const [bookSessionInfo, setBookSessionInfo] = useState(); // Stores the information of the tutor when booking a session
  const [eventStatus, setEventStatus] = useState(false); // Create event
  const [shareOpen, setShareOpen] = useState(false); // Stores whether the share modal is closed or opened
  const [shareURL, setShareURL] = useState(""); // Stores the url of the page that wants to be shared
  const [citeOpen, setCiteOpen] = useState(false); // Stores whether the cite Modal is closed or opened
  const [citeInfo, setCiteInfo] = useState(""); // Stores teh information that is used to create citations
  const [edit, setEdit] = useState(false); // Stores whether the edit Note Modal is closed or opened
  const [editValue, setEditValue] = useState(""); // Stores the HTML of the notes that are being edited
  const [editTitle, setEditTitle] = useState(""); // Stores the edited title of the notes tht are being edited
  const [editId, setEditId] = useState(""); // Stores the id of the notes that are being edited
  const [business, setBusiness] = useState(false); // Stores whether the business modal is opened or not
  const [eventState, setEventState] = useState(false);
  const [requestTutor, setRequestTutor] = useState(false);
  const [requestInfo, setRequestInfo] = useState(false);
  const [pwa, setPWA] = useState(true);
  const [addMembers, setAddMembers] = useState(false);
  const [downloadSegmented, setDownloadSegmented] = useState(false);
  const [signedUpVolunteers, setSignedUpVolunteers] = useState(null);

  const [ticketModal, setTicketModal] = useState(false);
  const [applyAsVolunteer, setApplyAsVolunteer] = useState(false);
  const [eventData, setEventData] = useState("");

  // Return the JSX
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
        eventData: [eventData, setEventData],
        shareOpen: [shareOpen, setShareOpen],
        shareURL: [shareURL, setShareURL],
        citeOpen: [citeOpen, setCiteOpen],
        citeInfo: [citeInfo, setCiteInfo],
        edit: [edit, setEdit],
        editValue: [editValue, setEditValue],
        editTitle: [editTitle, setEditTitle],
        editId: [editId, setEditId],
        business: [business, setBusiness],
        eventState: [eventState, setEventState],
        requestTutor: [requestTutor, setRequestTutor],
        requestInfo: [requestInfo, setRequestInfo],
        pwa: [pwa, setPWA],
        addMembers: [addMembers, setAddMembers],
        downloadSegmented: [downloadSegmented, setDownloadSegmented],
        signedUpVolunteers: [signedUpVolunteers, setSignedUpVolunteers],
        ticketModal: [ticketModal, setTicketModal],
        applyAsVolunteer: [applyAsVolunteer, setApplyAsVolunteer],
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
// End of the Modal Context
