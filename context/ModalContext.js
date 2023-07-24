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
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
