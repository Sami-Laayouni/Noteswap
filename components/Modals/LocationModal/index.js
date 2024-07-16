// components/LocationModal.js
import { useState } from "react";

function LocationModal({ setLocation }) {
  const [inputLocation, setInputLocation] = useState("");

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    }
  };

  const handleManualInput = () => {
    setLocation(inputLocation);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter your location</h2>
        <input
          type="text"
          value={inputLocation}
          onChange={(e) => setInputLocation(e.target.value)}
          placeholder="Type location here"
        />
        <button onClick={handleManualInput}>Submit</button>
        <button onClick={handleGeolocation}>Use my current location</button>
      </div>
    </div>
  );
}

export default LocationModal;
