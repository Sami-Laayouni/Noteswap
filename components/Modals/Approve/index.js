import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";
import { useContext, useRef, useState } from "react";

export default function Signature({ type }) {
  const { approve } = useContext(ModalContext);
  const [open, setOpen] = approve;
  const [signature, setSignature] = useState(null);
  const [typedSignature, setTypedSignature] = useState("");
  const [notes, setNotes] = useState("");
  const [useTypedSignature, setUseTypedSignature] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!open) {
    return null;
  }

  // Sample list of unvalidated extracurriculars (replace with dynamic data as needed)
  const unvalidatedActivities = [
    "Ifrane Community Food Bank (External: y.bouziane@aui.ma)",
    "Drama Club Production (Internal: j.foster@alakhawaynschool.ma)",
  ];

  if (!open) {
    return null;
  }

  // Canvas drawing functionality
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas?.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas?.getContext("2d");
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.strokeStyle = "#1a3c34";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    setSignature(canvas.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas?.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };

  const handleApprove = async () => {
    if (useTypedSignature ? typedSignature : signature) {
      setShowNotification(true);
      setTimeout(() => {
        setOpen(false);
        setShowNotification(false);
        clearCanvas();
        setTypedSignature("");
        setNotes("");
      }, 2500);
      await fetch("/api/profile/approve_transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "6714cece7ff9cc65162bec06",
        }),
      });
    } else {
      alert(
        "Please provide either a drawn or typed signature before approving."
      );
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
        clearCanvas();
        setTypedSignature("");
        setNotes("");
      }}
      title={`Approve Student's Extracurricular Activity`}
      small="true"
    >
      <div
        style={{
          padding: "30px",
          fontFamily: '"Segoe UI", Roboto, sans-serif',
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {/* Warning Section */}
        <div
          style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "25px",
            border: "1px solid #ffeeba",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#856404",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "20px" }}>⚠</span> WARNING
          </h3>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Not all extracurricular activities have been validated by their
            respective organizations. The following activities are not
            validated:
          </p>
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "20px",
              fontSize: "14px",
              color: "#1a3c34",
            }}
          >
            {unvalidatedActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
          <p style={{ fontSize: "14px", fontWeight: "500", marginTop: "10px" }}>
            If you approve this version, these events will not be included.
          </p>
        </div>

        {/* Signature Type Toggle */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <label
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1a3c34",
            }}
          >
            Signature Type:
          </label>
          <button
            onClick={() => setUseTypedSignature(false)}
            style={{
              padding: "8px 16px",
              backgroundColor: !useTypedSignature ? "#1a3c34" : "#e9ecef",
              color: !useTypedSignature ? "#fff" : "#1a3c34",
              border: "1px solid #1a3c34",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              !useTypedSignature && (e.target.style.backgroundColor = "#2e5b52")
            }
            onMouseOut={(e) =>
              !useTypedSignature && (e.target.style.backgroundColor = "#1a3c34")
            }
          >
            Draw Signature
          </button>
          <button
            onClick={() => setUseTypedSignature(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: useTypedSignature ? "#1a3c34" : "#e9ecef",
              color: useTypedSignature ? "#fff" : "#1a3c34",
              border: "1px solid #1a3c34",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              useTypedSignature && (e.target.style.backgroundColor = "#2e5b52")
            }
            onMouseOut={(e) =>
              useTypedSignature && (e.target.style.backgroundColor = "#1a3c34")
            }
          >
            Type Signature
          </button>
        </div>

        {/* Signature Input */}
        <div style={{ marginBottom: "25px" }}>
          {useTypedSignature ? (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1a3c34",
                  marginBottom: "10px",
                }}
              >
                Typed Signature
              </label>
              <input
                type="text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  border: "2px solid #d1d9e6",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  fontFamily: '"Times New Roman", serif',
                  fontStyle: "italic",
                  color: "#1a3c34",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#1a3c34")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d9e6")}
              />
            </div>
          ) : (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1a3c34",
                  marginBottom: "10px",
                }}
              >
                Draw Signature
              </label>
              <canvas
                ref={canvasRef}
                width={500}
                height={150}
                style={{
                  border: "2px solid #d1d9e6",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  cursor: "crosshair",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                  touchAction: "none",
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
              />
            </div>
          )}
        </div>

        {/* Counselor Notes */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "600",
              color: "#1a3c34",
              marginBottom: "10px",
            }}
          >
            Counselor Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any relevant notes about the approval..."
            style={{
              width: "100%",
              height: "100px",
              padding: "12px",
              fontSize: "14px",
              border: "2px solid #d1d9e6",
              borderRadius: "8px",
              backgroundColor: "#fff",
              resize: "vertical",
              color: "#1a3c34",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1a3c34")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d9e6")}
          />
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <button
            onClick={clearCanvas}
            style={{
              flex: "1",
              padding: "12px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "500",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
            Clear Signature
          </button>
          <button
            onClick={handleApprove}
            style={{
              flex: "1",
              padding: "12px",
              backgroundColor: "#1a3c34",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "500",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2e5b52")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1a3c34")}
          >
            Approve
          </button>
        </div>

        {/* Notification */}
        {showNotification && (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "15px",
              borderRadius: "8px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              border: "1px solid #c3e6cb",
              animation: "fadeIn 0.5s ease-in-out",
            }}
          >
            Approval successful! The student will now be able to download their
            transcript.
          </div>
        )}
      </div>

      {/* Inline CSS Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Modal>
  );
}
