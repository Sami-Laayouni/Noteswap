import { useContext, useState } from "react";
import ModalContext from "../../context/ModalContext";
import { FaPlus, FaMinus } from "react-icons/fa";
import style from "./largenImage.module.css";

/**
 * Largen Image
 * @date 7/24/2023 - 7:29:39 PM
 *
 * @export
 * @return {*}
 */
export default function LargenImage() {
  const { imageModal, imageUrl } = useContext(ModalContext);
  const [open, setOpen] = imageModal;
  const [url] = imageUrl;

  const [zoomLevel, setZoomLevel] = useState(100);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const handleZoom = (delta) => {
    const newZoomLevel = zoomLevel + delta;
    if (newZoomLevel >= 50 && newZoomLevel <= 200) {
      setZoomLevel(newZoomLevel);
    }
  };

  const handleImageDrag = (event) => {
    setImagePosition({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };

  return (
    <section
      style={{
        display: open ? "flex" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 99,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
      onClick={(event) => {
        if (
          event.target.id != "image" &&
          event.target.id != "plus" &&
          event.target.id != "minus" &&
          event.target.id != "plus1" &&
          event.target.id != "minus1"
        ) {
          setOpen(false);
          setZoomLevel(100);
        }
      }}
    >
      <img
        style={{
          minHeight: "500px",
          borderRadius: "8px",
          cursor: "grab",
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: `${imagePosition.x}px ${imagePosition.y}px`,
        }}
        src={url}
        id="image"
        alt="Image"
        draggable="false"
        onMouseDown={(e) => e.preventDefault()}
        onMouseWheel={(e) => {
          e.preventDefault();
          handleZoom(e.deltaY > 0 ? -10 : 10);
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            handleImageDrag(e);
          }
        }}
        onMouseUp={() => {
          setImagePosition({ x: 0, y: 0 });
        }}
      ></img>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginRight: "10px",
          marginTop: "10px",
        }}
      >
        <button
          id="plus"
          className={style.button}
          onClick={() => handleZoom(10)}
        >
          <FaPlus id="plus1" />
        </button>
        <button
          id="minus"
          className={style.button}
          onClick={() => handleZoom(-10)}
        >
          <FaMinus id="minus1" />
        </button>
      </div>
    </section>
  );
}
