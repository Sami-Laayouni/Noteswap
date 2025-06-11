import React from "react";

function New() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/events/hardcode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: "e",
          }),
        });
      }}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "var(--accent-color)",
        color: "white",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        padding: "10px",
      }}
    >
      Hey
    </button>
  );
}

export default New;
