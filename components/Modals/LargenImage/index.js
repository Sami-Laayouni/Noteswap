/* Modal used to enlarge an image when a
user clicks on one */

import { useContext, useState, useEffect } from "react";
import ModalContext from "../../../context/ModalContext";
import { FaPlus, FaMinus, FaSync } from "react-icons/fa";

// Import the style
import style from "./largenImage.module.css";

/**
 * Enlarge Image
 * @date 7/24/2023 - 7:29:39 PM
 *
 * @export
 * @return {*}
 */
export default function LargenImage() {
  // Determines wether the image Modal is closed or opened
  const { imageModal, imageUrl } = useContext(ModalContext);
  const [open, setOpen] = imageModal;
  // Stores the url of the image to be displayed
  const [url] = imageUrl;

  // Controls the zoom level of the image
  const [zoomLevel, setZoomLevel] = useState(100);
  // Controls the angle at which the image is rotated
  const [rotationAngle, setRotationAngle] = useState(0);

  // Default the image to be zoomed in at 100° and the default orientation
  useEffect(() => {
    setZoomLevel(100);
    setRotationAngle(0);
  }, [url]);

  // Function used to rotate the image 90 degrees
  const handleRotate = () => {
    const newRotationAngle = (rotationAngle + 90) % 360;
    setRotationAngle(newRotationAngle);
  };

  // Function used to zoom in or out an image by delta amount
  const handleZoom = (delta) => {
    const newZoomLevel = zoomLevel + delta;
    if (newZoomLevel >= 50 && newZoomLevel <= 200) {
      setZoomLevel(newZoomLevel);
    }
  };

  // Return the JSX
  return (
    <section
      style={{
        display: open ? "flex" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        width: "100%",
        height: "100%",
        position: "fixed",
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
          event.target.id != "minus1" &&
          event.target.id != "rotate" &&
          event.target.id != "rotate1"
        ) {
          setOpen(false);
          setZoomLevel(100);
        }
      }}
    >
      {/* The image */}
      <img
        style={{
          minHeight: "500px",
          maxHeight: "90vh",
          maxWidth: "800px",
          borderRadius: "8px",
          cursor: "grab",
          transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)`,
          transformOrigin: `center center`,
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
      ></img>

      {/* Buttons to modify the image */}
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
        id="plus1"
      >
        <button
          id="plus"
          className={style.button}
          onClick={() => handleZoom(10)}
        >
          <FaPlus color="white" id="plus1" /> {/* Zoom in button */}
        </button>
        <button
          id="minus"
          className={style.button}
          onClick={() => handleZoom(-10)}
        >
          <FaMinus color="white" id="minus1" /> {/* Zoom out button */}
        </button>
        <button id="rotate" className={style.button} onClick={handleRotate}>
          <FaSync color="white" id="rotate1" /> {/* Rotate 90° button */}
        </button>
      </div>
    </section>
  );
}
