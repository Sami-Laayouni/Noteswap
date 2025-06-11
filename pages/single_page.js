import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Award,
  User,
  Mail,
  Phone,
  GraduationCap,
  Star,
  FileText,
  Signature,
  Download,
  Eye,
  Edit,
  MessageSquare,
  Shield,
  ExternalLink,
  Users,
  Trophy,
  Target,
  PenTool,
  X,
} from "lucide-react";
import { useContext } from "react";
import ModalContext from "../context/ModalContext";
import ViewCertificate from "../components/Modals/ViewCertificate";
import RemoveCertificate from "../components/Modals/RemoveCertificate";
import SignatureModal from "../components/Modals/Approve";
import RequestRevision from "../components/Modals/RequestRevision";

// Detailed fake data for Sami Johnson
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
  completionRate: 87,

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
      skills: ["Environmental Awareness", "Physical Activity", "Conservation"],
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
    status: "pending", // pending, approved, revision_needed
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

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureInput, setSignatureInput] = useState("");
  const [counselorNotes, setCounselorNotes] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(
    studentData.counselorApproval.status
  );

  const {
    certificateShow,
    certificateData,
    removeCertificate,
    approve,
    requestRevision,
  } = useContext(ModalContext);
  const [open, setOpen] = certificateShow;
  const [open2, setOpen2] = removeCertificate;
  const [open3, setOpen3] = approve;
  const [open4, setOpen4] = requestRevision;

  const [data, setData] = certificateData;

  const pageStyle = {
    minHeight: "100vh",
    background: "whitesmoke",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#1f2937",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "20px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const cardStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
  };

  const tabStyle = {
    display: "flex",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "0.5rem",
    marginBottom: "2rem",
    backdropFilter: "blur(10px)",
  };

  const tabButtonStyle = (isActive) => ({
    flex: 1,
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    border: "none",
    background: isActive ? "var(--accent-color)" : "transparent",
    color: isActive ? "white" : "#64748b",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const buttonStyle = {
    background: "var(--accent-color)",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const badgeStyle = {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  };

  const modalStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "20px",
    padding: "2rem",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  };

  const getStatusBadge = (status) => {
    const styles = {
      verified: { ...badgeStyle, background: "#d1fae5", color: "#065f46" },
      approved: { ...badgeStyle, background: "#d1fae5", color: "#065f46" },
      pending: { ...badgeStyle, background: "#fef3c7", color: "#92400e" },
      rejected: { ...badgeStyle, background: "#fee2e2", color: "#991b1b" },
    };
    return styles[status] || styles.pending;
  };

  const handleCounselorApproval = () => {
    if (signatureInput.trim()) {
      setApprovalStatus("approved");
      setShowSignatureModal(false);
      setSignatureInput("");
      setCounselorNotes("");
      alert("Student profile has been approved and digitally signed!");
    }
  };

  const handleRequestRevision = () => {
    setApprovalStatus("revision_needed");
    alert("Revision request sent to student");
  };

  const progressPercentage = Math.min(
    (studentData.totalHours / studentData.requiredHours) * 100,
    100
  );

  return (
    <div style={pageStyle}>
      <ViewCertificate />
      <RemoveCertificate />
      <SignatureModal />
      <RequestRevision />
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginRight: "1rem",
              }}
            >
              <ArrowLeft size={24} style={{ color: "var(--accent-color)" }} />
            </button>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                margin: 0,
                color: "#1f2937",
              }}
            >
              Student Profile
            </h1>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            {/* Profile Image & Basic Info */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
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
              <div>
                <h2
                  style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}
                >
                  {studentData.name}
                </h2>
                <p style={{ color: "#6b7280", margin: "0.25rem 0" }}>
                  Grade {studentData.grade} • Class of{" "}
                  {studentData.graduationYear}
                </p>
              </div>
            </div>

            {/* Progress Overview */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Progress to Graduation
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "var(--accent-color)",
                  }}
                >
                  {studentData.totalHours}/{studentData.requiredHours} hours
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#e5e7eb",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressPercentage}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #10b981 0%, var(--accent-color) 100%)",
                    borderRadius: "4px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  margin: "0.5rem 0 0 0",
                }}
              >
                {studentData.requiredHours - studentData.totalHours > 0
                  ? `${
                      studentData.requiredHours - studentData.totalHours
                    } hours remaining`
                  : "Requirements exceeded!"}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={buttonStyle}>
                <Download size={18} />
                Export Report
              </button>
              <button style={buttonStyle}>
                <MessageSquare size={18} />
                Contact Student
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={tabStyle}>
          <button
            style={tabButtonStyle(activeTab === "overview")}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            style={tabButtonStyle(activeTab === "external")}
            onClick={() => setActiveTab("external")}
          >
            External Activities
          </button>
          <button
            style={tabButtonStyle(activeTab === "internal")}
            onClick={() => setActiveTab("internal")}
          >
            Internal Activities
          </button>
          <button
            style={tabButtonStyle(activeTab === "approval")}
            onClick={() => setActiveTab("approval")}
          >
            Counselor Approval
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <div style={cardStyle}>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Clock size={20} style={{ color: "#667eea" }} />
                  Hours Summary
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "800",
                        color: "#10b981",
                      }}
                    >
                      75
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      External Hours
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "800",
                        color: "#667eea",
                      }}
                    >
                      58
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      Internal Hours
                    </div>
                  </div>
                </div>
              </div>

              <div style={cardStyle}>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Target size={20} style={{ color: "#f59e0b" }} />
                  Categories Covered
                </h3>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {[
                    "Community Service",
                    "Leadership",
                    "Academic Support",
                    "Environmental",
                    "Arts",
                  ].map((category) => (
                    <span
                      key={category}
                      style={{
                        ...badgeStyle,
                        background: "#e0e7ff",
                        color: "#3730a3",
                        fontSize: "0.75rem",
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Recent Activity Timeline
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    date: "2024-06-20",
                    activity: "Leos Club Verification completed",
                    type: "verification",
                  },
                  {
                    date: "2024-06-12",
                    activity:
                      "Lunar New Year Prep approved by Ms. Shillingsburg",
                    type: "approval",
                  },
                  {
                    date: "2024-06-01",
                    activity: "Food Bank volunteer work verified",
                    type: "verification",
                  },
                  {
                    date: "2024-04-20",
                    activity: "Environmental cleanup work submitted",
                    type: "submission",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.75rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background:
                          item.type === "verification"
                            ? "#10b981"
                            : item.type === "approval"
                            ? "#667eea"
                            : "#f59e0b",
                      }}
                    />
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {item.date}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                      {item.activity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* External Activities Tab */}
        {activeTab === "external" && (
          <div>
            {studentData.externalActivities.map((activity) => (
              <div key={activity.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      {activity.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "#667eea",
                          fontWeight: "600",
                        }}
                      >
                        {activity.organization}
                      </span>
                      <span style={getStatusBadge(activity.status)}>
                        {activity.status}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        fontSize: "0.875rem",
                        color: "#6b7280",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Calendar size={14} />
                        {activity.startDate} - {activity.endDate}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Clock size={14} />
                        {activity.hoursLogged} hours
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {activity.status === "verified" && (
                      <button
                        style={{
                          ...buttonStyle,
                          padding: "0.5rem",
                          background: "#10b981",
                        }}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {activity.id != "3" && (
                      <button
                        onClick={() => {
                          setOpen(true);
                          setData({
                            name: activity.name,
                            certificateUrl: activity.certificateUrl,
                          });
                        }}
                        style={{ ...buttonStyle, padding: "0.5rem" }}
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setOpen2(true);
                      }}
                      style={{
                        ...buttonStyle,
                        padding: "0.5rem",
                        backgroundColor: "red",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#374151",
                    marginBottom: "1rem",
                  }}
                >
                  {activity.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Organization Contact
                    </h4>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      <div>{activity.orgContact}</div>
                      <div>{activity.orgEmail}</div>
                      <div>{activity.orgPhone}</div>
                    </div>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Skills Developed
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {activity.skills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            ...badgeStyle,
                            background: "#e0f2fe",
                            color: "#0369a1",
                            fontSize: "0.75rem",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {activity.status === "verified" && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "8px",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <CheckCircle size={16} style={{ color: "#10b981" }} />
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#065f46",
                        }}
                      >
                        Verified on {activity.verificationDate}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#065f46",
                        margin: 0,
                      }}
                    >
                      <strong>Organization Notes:</strong>{" "}
                      {activity.verificationNotes}
                    </p>
                    {activity.impactMetrics && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.875rem",
                          color: "#065f46",
                        }}
                      >
                        <strong>Impact:</strong>{" "}
                        {Object.entries(activity.impactMetrics)
                          .map(
                            ([key, value]) =>
                              `${value} ${key
                                .replace(/([A-Z])/g, " $1")
                                .toLowerCase()}`
                          )
                          .join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {activity.status === "pending" && (
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fed7aa",
                      borderRadius: "8px",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <AlertCircle size={16} style={{ color: "#f59e0b" }} />
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#92400e",
                        }}
                      >
                        Pending Verification
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#92400e",
                        margin: 0,
                      }}
                    >
                      Submitted on {activity.submissionDate}. Awaiting
                      organization confirmation.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Internal Activities Tab */}
        {activeTab === "internal" && (
          <div>
            {studentData.internalActivities.map((activity) => (
              <div key={activity.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      {activity.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "#667eea",
                          fontWeight: "600",
                        }}
                      >
                        {activity.department}
                      </span>
                      <span style={getStatusBadge(activity.status)}>
                        {activity.status}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        fontSize: "0.875rem",
                        color: "#6b7280",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Calendar size={14} />
                        {activity.startDate} - {activity.endDate}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Clock size={14} />
                        {activity.hoursLogged} hours
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {activity.status === "approved" && (
                      <button
                        style={{
                          ...buttonStyle,
                          padding: "0.5rem",
                          background: "#10b981",
                        }}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button style={{ ...buttonStyle, padding: "0.5rem" }}>
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setOpen2(true);
                      }}
                      style={{
                        ...buttonStyle,
                        padding: "0.5rem",
                        backgroundColor: "red",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#374151",
                    marginBottom: "1rem",
                  }}
                >
                  {activity.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Teacher Contact
                    </h4>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      <div>{activity.teacher}</div>
                      <div>{activity.teacherEmail}</div>
                    </div>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Skills Developed
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {activity.skills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            ...badgeStyle,
                            background: "#e0f2fe",
                            color: "#0369a1",
                            fontSize: "0.75rem",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {activity.status === "approved" && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "8px",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <CheckCircle size={16} style={{ color: "#10b981" }} />
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#065f46",
                        }}
                      >
                        Approved on {activity.approvalDate}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#065f46",
                        margin: 0,
                      }}
                    >
                      <strong>Teacher Notes:</strong> {activity.teacherNotes}
                    </p>
                    {activity.achievements && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.875rem",
                          color: "#065f46",
                        }}
                      >
                        <strong>Achievements:</strong>{" "}
                        {activity.achievements.join(", ")}
                      </div>
                    )}
                    {activity.projects && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.875rem",
                          color: "#065f46",
                        }}
                      >
                        <strong>Projects:</strong>
                        {activity.projects.map((project) => (
                          <div
                            key={project.name}
                            style={{ marginTop: "0.5rem" }}
                          >
                            {project.name} - {project.role} ({project.outcome})
                          </div>
                        ))}
                      </div>
                    )}
                    {activity.studentsHelped && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.875rem",
                          color: "#065f46",
                        }}
                      >
                        <strong>Impact:</strong> Helped{" "}
                        {activity.studentsHelped} students
                      </div>
                    )}
                  </div>
                )}

                {activity.status === "pending" && (
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1px solid #fed7aa",
                      borderRadius: "8px",
                      padding: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <AlertCircle size={16} style={{ color: "#f59e0b" }} />
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#92400e",
                        }}
                      >
                        Pending Approval
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#92400e",
                        margin: 0,
                      }}
                    >
                      Awaiting teacher confirmation.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Counselor Approval Tab */}
        {activeTab === "approval" && (
          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Shield size={20} style={{ color: "#667eea" }} />
              Counselor Approval
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Counselor Details
                </h4>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <User size={14} />
                    {studentData.counselor}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <Mail size={14} />
                    {studentData.email}
                  </div>
                </div>
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Approval Status
                </h4>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={getStatusBadge(approvalStatus)}>
                    {approvalStatus}
                  </span>
                  {studentData.counselorApproval.lastReviewDate && (
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      Last Reviewed:{" "}
                      {studentData.counselorApproval.lastReviewDate || "N/A"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Requirements Checklist
              </h4>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {Object.entries(
                  studentData.counselorApproval.requirementsCheck
                ).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {value ? (
                      <CheckCircle size={16} style={{ color: "#10b981" }} />
                    ) : (
                      <XCircle size={16} style={{ color: "#ef4444" }} />
                    )}
                    <span style={{ color: value ? "#065f46" : "#991b1b" }}>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {approvalStatus === "approved" &&
              studentData.counselorApproval.digitalSignature && (
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Signature size={16} style={{ color: "#10b981" }} />
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#065f46",
                      }}
                    >
                      Digitally Signed on{" "}
                      {studentData.counselorApproval.approvalDate}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#065f46",
                      margin: 0,
                    }}
                  >
                    <strong>Signature:</strong>{" "}
                    {studentData.counselorApproval.digitalSignature}
                  </p>
                  {studentData.counselorApproval.notes && (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#065f46",
                        marginTop: "0.5rem",
                      }}
                    >
                      <strong>Notes:</strong>{" "}
                      {studentData.counselorApproval.notes}
                    </p>
                  )}
                </div>
              )}

            {approvalStatus === "revision_needed" && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fed7aa",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <AlertCircle size={16} style={{ color: "#f59e0b" }} />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#92400e",
                    }}
                  >
                    Revision Requested
                  </span>
                </div>
                <p
                  style={{ fontSize: "0.875rem", color: "#92400e", margin: 0 }}
                >
                  {studentData.counselorApproval.notes ||
                    "Awaiting student revisions."}
                </p>
              </div>
            )}

            {approvalStatus !== "approved" && (
              <div style={{ display: "flex", gap: "1rem" }}>
                <button style={buttonStyle} onClick={() => setOpen3(true)}>
                  <Signature size={18} />
                  Approve & Sign
                </button>
                <button
                  style={{ ...buttonStyle, background: "#ef4444" }}
                  onClick={() => setOpen4(true)}
                >
                  <PenTool size={18} />
                  Request Revision
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
