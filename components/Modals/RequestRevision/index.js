import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";
import { useContext, useState } from "react";

export default function RequestRevision() {
  const { requestRevision } = useContext(ModalContext);
  const [open, setOpen] = requestRevision;
  const [internalNotes, setInternalNotes] = useState("");
  const [externalNotes, setExternalNotes] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // Sample student data (as provided)
  const studentData = {
    id: 1,
    name: "Sami Laayouni",
    email: "samilaayouni@alakhawaynschool.ma",
    phone: "(212) 600-663172",
    grade: 11,
    graduationYear: 2026,
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616c2d5a6b0?w=150&h=150&fit=crop&crop=face",
    counselor: "Ms. Hiam Hilali",
    totalHours: 128,
    requiredHours: 120,
    completionRate: 107,
    externalActivities: [
      {
        id: 1,
        name: "Leos Food Basket Volunteer",
        organization: "Al Akhawayn School Leos Club Ifrane",
        orgContact: "Jennifer Martinez",
        orgEmail: "j.martinez@redcross.org",
        orgPhone: "(212) 987-6543",
        category: "Community Service",
        startDate: "2024-01-15",
        endDate: "2024-06-15",
        hoursLogged: 32,
        status: "verified",
        description:
          "Organized and participated in food drives, assisted with logistics, and provided support during distribution events.",
        skills: ["Communication", "Organization", "Healthcare Awareness"],
        verificationDate: "2024-06-20",
        verificationNotes:
          "Excellent dedication and professional attitude. Highly recommended.",
        orgRating: 4.9,
        certificateUrl: "/assets/images/Certificate of Volunteer.png",
        photos: ["photo1.jpg", "photo2.jpg"],
        impactMetrics: {
          donorsHelped: 150,
          bloodUnitsCollected: 120,
        },
      },
      {
        id: 2,
        name: "Ifrane Community Food Bank",
        organization: "SAO Club",
        orgContact: "Youssef Bouziane",
        orgEmail: "y.bouziane@aui.ma",
        orgPhone: "(555) 321-0987",
        category: "Environmental",
        startDate: "2024-03-10",
        endDate: "2024-04-15",
        hoursLogged: 15,
        status: "pending",
        description:
          "Participated in park cleanups and tree planting activities.",
        skills: [
          "Environmental Awareness",
          "Physical Activity",
          "Conservation",
        ],
        verificationDate: null,
        verificationNotes: "Pending final documentation from organization.",
        orgRating: 4.6,
        certificateUrl: "/assets/images/Certificate of Volunteer (1).png",
        submissionDate: "2024-04-20",
      },
      {
        id: 3,
        name: "NoteSwap Tutoring & Note Sharing",
        organization: "NoteSwap Inc.",
        orgContact: "NoteSwap Support Team",
        orgEmail: "noteswap@support.org",
        orgPhone: "(212) 456-7890",
        category: "Community Service",
        startDate: "2024-02-01",
        endDate: "2024-05-30",
        hoursLogged: 28,
        status: "verified",
        description:
          "Provided tutoring in math subjects to high school students and shared class notes through the NoteSwap platform.",
        skills: ["Community Engagement"],
        verificationDate: "2024-06-01",
        verificationNotes: "Verified through the NoteSwap platform. ",
        orgRating: 4.8,
        certificateUrl: "/assets/images/Certificate of Volunteer (1).png",
      },
    ],
    internalActivities: [
      {
        id: 1,
        name: "Lunar new year preparation",
        teacher: "Ms. Anne Shillingsburg",
        teacherEmail: "a.shillingsburg@alakhawaynschool.ma",
        department: "Student Affairs",
        category: "Organization",
        startDate: "2025-06-05",
        endDate: "2025-06-05",
        hoursLogged: 6,
        status: "approved",
        description:
          "Helped organize and prepare for the Lunar New Year celebration at school, including decorations, event planning, and logistics.",
        skills: [
          "Leadership",
          "Communication",
          "Organization",
          "Public Speaking",
        ],
        approvalDate: "2024-06-12",
        teacherNotes:
          "Sami showed exceptional leadership and organizational skills. Highly dependable.",
      },
      {
        id: 2,
        name: "English Tutoring",
        teacher: "Ms. Anne Shillingsburg",
        teacherEmail: "a.shillingsburg@alakhawaynschool.ma",
        department: "Student Affairs",
        category: "Academic Support",
        startDate: "2024-02-01",
        endDate: "2024-05-31",
        hoursLogged: 3,
        status: "approved",
        description:
          "Tutored freshman in Reading and Grammar during lunch periods.",
        skills: ["Teaching", "Patience", "English", "Mentoring"],
        approvalDate: "2024-06-01",
        teacherNotes:
          "Sami's tutoring helped improve student grades significantly. Natural teacher.",
        studentsHelped: 12,
      },
      {
        id: 3,
        name: "Drama Club Production",
        teacher: "Ms. Jennifer Foster",
        teacherEmail: "j.foster@alakhawaynschool.ma",
        department: "Performing Arts",
        category: "Student Affairs",
        startDate: "2024-03-01",
        endDate: "2024-04-30",
        hoursLogged: 18,
        status: "pending",
        description:
          "Backstage crew for spring musical production 'Into the Woods'.",
        skills: [
          "Teamwork",
          "Technical Skills",
          "Time Management",
          "Creative Problem Solving",
        ],
        approvalDate: null,
        teacherNotes: "Awaiting final grade submission.",
        role: "Lighting Assistant",
      },
    ],
    counselorApproval: {
      status: "pending",
      lastReviewDate: null,
      approvalDate: null,
      digitalSignature: null,
      notes: "",
      requirementsCheck: {
        minimumHours: true,
        categoryDiversity: true,
        verificationComplete: false,
        documentationComplete: true,
      },
    },
  };

  if (!open) {
    return null;
  }

  const handleSendEmail = async () => {
    // Simulate sending email
    const response = await fetch("/api/email/counselor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: studentData.name,
        email: studentData.email,
        counselor: "Anne Shillingsburg",
        internalNotes:
          internalNotes || "No notes provided for internal activities.",
        externalNotes:
          externalNotes || "No notes provided for external activities.",
      }),
    });
    if (response) {
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setOpen(false);
        setInternalNotes("");
        setExternalNotes("");
        setEmailSent(false);
      }}
      title={`Request Revision for ${studentData.name}'s Activities`}
      small="true"
    >
      <div
        style={{
          padding: "30px",
          fontFamily: '"Segoe UI", Roboto, sans-serif',
          background: "linear-gradient(145deg, #ffffff 0%, #e6f0fa 100%)",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
          maxWidth: "800px",
          margin: "0 auto",
          border: "1px solid #d1e0e6",
        }}
      >
        {/* Student Info Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "25px",
            padding: "15px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                marginRight: "40px",
                borderRadius: "50%",
                background: "orange",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                fontWeight: "800",
              }}
            >
              {studentData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>

          <div>
            <h3
              style={{ fontSize: "18px", fontWeight: "600", color: "#1a3c34" }}
            >
              {studentData.name} (Grade {studentData.grade})
            </h3>
            <p style={{ fontSize: "14px", color: "#4a5568" }}>
              Total Hours: {studentData.totalHours}/{studentData.requiredHours}{" "}
              ({studentData.completionRate}%)
            </p>
            <p style={{ fontSize: "14px", color: "#4a5568" }}>
              Counselor: {studentData.counselor}
            </p>
          </div>
        </div>

        {/* Internal Activities */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1a3c34",
              marginBottom: "15px",
              borderBottom: "2px solid #1a3c34",
              paddingBottom: "5px",
            }}
          >
            Internal Activities
          </h3>
          {studentData.internalActivities.map((activity) => (
            <div
              key={activity.id}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "15px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e2e8f0",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#2d3748",
                }}
              >
                {activity.name}
              </h4>
              <p style={{ fontSize: "14px", color: "#4a5568" }}>
                <strong>Category:</strong> {activity.category} |{" "}
                <strong>Hours:</strong> {activity.hoursLogged} |{" "}
                <strong>Status:</strong> {activity.status}
              </p>
              <p
                style={{ fontSize: "14px", color: "#4a5568", marginTop: "5px" }}
              >
                <strong>Description:</strong> {activity.description}
              </p>
              <p
                style={{ fontSize: "14px", color: "#4a5568", marginTop: "5px" }}
              >
                <strong>Skills:</strong> {activity.skills.join(", ")}
              </p>
              <p
                style={{ fontSize: "14px", color: "#4a5568", marginTop: "5px" }}
              >
                <strong>Teacher Notes:</strong>{" "}
                {activity.teacherNotes || "None"}
              </p>
            </div>
          ))}
          <label
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "600",
              color: "#1a3c34",
              marginBottom: "10px",
              marginTop: "20px",
            }}
          >
            Counselor Notes for Internal Activities
          </label>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Add notes for internal activities (e.g., 'Please provide additional documentation for Drama Club Production...')"
            style={{
              width: "100%",
              height: "100px",
              padding: "12px",
              fontSize: "14px",
              border: "2px solid #d1e0e6",
              borderRadius: "8px",
              backgroundColor: "#fff",
              resize: "vertical",
              color: "#1a3c34",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1a3c34")}
            onBlur={(e) => (e.target.style.borderColor = "#d1e0e6")}
          />
        </div>

        {/* External Activities */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1a3c34",
              marginBottom: "15px",
              borderBottom: "2px solid #1a3c34",
              paddingBottom: "5px",
            }}
          >
            External Activities
          </h3>
          {studentData.externalActivities.map((activity) => (
            <div
              key={activity.id}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "15px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e2e8f0",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#2d3748",
                }}
              >
                {activity.name}
              </h4>
              <p style={{ fontSize: "14px", color: "#4a5568" }}>
                <strong>Organization:</strong> {activity.organization} |{" "}
                <strong>Category:</strong> {activity.category} |{" "}
                <strong>Hours:</strong> {activity.hoursLogged} |{" "}
                <strong>Status:</strong> {activity.status}
              </p>
              <p
                style={{ fontSize: "14px", color: "#4a5568", marginTop: "5px" }}
              >
                <strong>Description:</strong> {activity.description}
              </p>
              <p
                style={{ fontSize: "14px", color: "#4a5568", marginTop: "5px" }}
              >
                <strong>Skills:</strong> {activity.skills.join(", ")}
              </p>
              <p
                style={{ fontSize: "14px", color: "#4a5568", marginTop: "5px" }}
              >
                <strong>Verification Notes:</strong>{" "}
                {activity.verificationNotes || "None"}
              </p>
            </div>
          ))}
          <label
            style={{
              display: "block",
              fontSize: "16px",
              fontWeight: "600",
              color: "#1a3c34",
              marginBottom: "10px",
              marginTop: "20px",
            }}
          >
            Counselor Notes for External Activities
          </label>
          <textarea
            value={externalNotes}
            onChange={(e) => setExternalNotes(e.target.value)}
            placeholder="Add notes for external activities (e.g., 'Please submit verification for Ifrane Community Food Bank...')"
            style={{
              width: "100%",
              height: "100px",
              padding: "12px",
              fontSize: "14px",
              border: "2px solid #d1e0e6",
              borderRadius: "8px",
              backgroundColor: "#fff",
              resize: "vertical",
              color: "#1a3c34",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#1a3c34")}
            onBlur={(e) => (e.target.style.borderColor = "#d1e0e6")}
          />
        </div>

        {/* Send Email Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleSendEmail}
            style={{
              padding: "12px 30px",
              backgroundColor: "#1a3c34",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 3px 8px rgba(0, 0, 0, 0.15)",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2e5b52")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1a3c34")}
          >
            Send Email
          </button>
        </div>

        {/* Email Sent Notification */}
        {emailSent && (
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
            Email with notes sent successfully to {studentData.email}!
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
