import React, { useState } from "react";
import {
  FiUpload,
  FiAward,
  FiUsers,
  FiCalendar,
  FiClock,
  FiPhone,
  FiMail,
  FiFileText,
  FiLayers,
} from "react-icons/fi";

export default function AddExtracurricularPage() {
  const [form, setForm] = useState({
    activityName: "",
    orgName: "",
    orgEmail: "",
    orgPhone: "",
    date: "",
    hours: "",
    certificate: null,
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setForm({ ...form, certificate: e.dataTransfer.files[0] });
      setErrors({ ...errors, certificate: null });
    }
  };

  const validateEmailDomain = (email) => {
    const domain = email.split("@")[1];
    return (
      domain && !domain.includes("noteswap") && !domain.endsWith("@gmail.com")
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.activityName)
      newErrors.activityName = "Activity name is required.";
    if (!form.orgName) newErrors.orgName = "Organization name is required.";
    if (!form.orgEmail || !validateEmailDomain(form.orgEmail))
      newErrors.orgEmail =
        "Please enter a valid organizational email address (not personal or NoteSwap).";
    if (!form.orgPhone) newErrors.orgPhone = "Organization phone is required.";
    if (!form.date) newErrors.date = "Date is required.";
    if (!form.hours || form.hours <= 0)
      newErrors.hours = "Please enter a valid number of hours.";
    if (!form.certificate)
      newErrors.certificate = "Certificate upload is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const schoolInfo = JSON.parse(localStorage.getItem("schoolInfo"));

    try {
      const response = await fetch("/api/email/confirmation_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: `${userInfo.first_name} ${userInfo.last_name}`,
          email: userInfo.email,
          school: schoolInfo.schoolFullName,
          position: formData.get("activityName"),
          orgEmail: formData.get("orgEmail"),
          orgName: formData.get("orgName"),
          hours: formData.get("hours"),
          date: formData.get("date"),
        }),
      });

      if (response.ok) {
        alert(
          "Validation email sent to organization. Well confirm this activity once they approve."
        );
        // Reset form after successful submission
        setForm({
          activityName: "",
          orgName: "",
          orgEmail: "",
          orgPhone: "",
          date: "",
          hours: "",
          certificate: null,
        });
        setErrors({});
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting. Please try again later.");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)",
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      borderBottom: "1px solid #e5e7eb",
    },
    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: "24px",
      paddingBottom: "24px",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    logoIcon: {
      background: "linear-gradient(135deg, var(--accent-color), #16a34a)",
      padding: "8px",
      borderRadius: "8px",
    },
    logoText: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#111827",
      margin: 0,
    },
    logoSubtext: {
      fontSize: "14px",
      color: "#6b7280",
      margin: 0,
    },
    nav: {
      display: "flex",
      gap: "32px",
    },
    navLink: {
      color: "#6b7280",
      textDecoration: "none",
      transition: "color 0.2s",
      cursor: "pointer",
    },
    navLinkActive: {
      color: "var(--accent-color)",
      fontWeight: "500",
    },
    main: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "48px 24px",
    },
    hero: {
      textAlign: "center",
      marginBottom: "48px",
    },
    heroIcon: {
      background: "linear-gradient(135deg, var(--accent-color), #16a34a)",
      padding: "16px",
      borderRadius: "50%",
      width: "80px",
      height: "80px",
      margin: "0 auto 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    heroTitle: {
      fontSize: "36px",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "16px",
      margin: 0,
    },
    heroSubtitle: {
      fontSize: "18px",
      color: "#6b7280",
      maxWidth: "600px",
      margin: "0 auto",
      lineHeight: "1.6",
    },
    benefitsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
      marginBottom: "48px",
    },
    benefitCard: {
      backgroundColor: "#ffffff",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #f3f4f6",
      transition: "box-shadow 0.2s, transform 0.2s",
      cursor: "default",
    },
    benefitCardHover: {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      transform: "translateY(-2px)",
    },
    benefitIcon: {
      padding: "12px",
      borderRadius: "8px",
      width: "fit-content",
      marginBottom: "16px",
    },
    benefitTitle: {
      fontWeight: "600",
      color: "#111827",
      marginBottom: "8px",
      fontSize: "16px",
      margin: 0,
    },
    benefitDescription: {
      color: "#6b7280",
      fontSize: "14px",
      lineHeight: "1.5",
      margin: 0,
    },
    formContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "1px solid #f3f4f6",
      padding: "32px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      margin: 0,
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
    },
    inputGroup: {
      marginBottom: "24px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "16px",
      transition: "all 0.2s",
      outline: "none",
      boxSizing: "border-box",
    },
    inputError: {
      borderColor: "#ef4444",
      backgroundColor: "#fef2f2",
    },
    inputFocus: {
      borderColor: "var(--accent-color)",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
    inputWithIcon: {
      paddingLeft: "44px",
    },
    inputIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      pointerEvents: "none",
    },
    inputWrapper: {
      position: "relative",
    },
    helpText: {
      fontSize: "12px",
      color: "#6b7280",
      marginTop: "4px",
    },
    errorText: {
      fontSize: "14px",
      color: "#ef4444",
      marginTop: "8px",
    },
    uploadArea: {
      border: "2px dashed #d1d5db",
      borderRadius: "12px",
      padding: "32px",
      textAlign: "center",
      transition: "all 0.2s",
      position: "relative",
      cursor: "pointer",
    },
    uploadAreaActive: {
      borderColor: "var(--accent-color)",
      backgroundColor: "#eff6ff",
    },
    uploadAreaError: {
      borderColor: "#ef4444",
      backgroundColor: "#fef2f2",
    },
    uploadIcon: {
      width: "64px",
      height: "64px",
      backgroundColor: "#f3f4f6",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px",
    },
    uploadText: {
      fontSize: "18px",
      fontWeight: "500",
      color: "#111827",
      marginBottom: "4px",
      margin: 0,
    },
    uploadSubtext: {
      color: "#6b7280",
      marginBottom: "8px",
      margin: 0,
    },
    uploadHint: {
      fontSize: "12px",
      color: "#9ca3af",
      margin: 0,
    },
    hiddenInput: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0,
      cursor: "pointer",
    },
    submitButton: {
      width: "100%",
      background: "linear-gradient(135deg, var(--accent-color), #16a34a)",
      color: "#ffffff",
      padding: "16px 32px",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
      outline: "none",
    },
    submitButtonHover: {
      background: "linear-gradient(135deg, var(--accent-color), #16a34a)",
      transform: "translateY(-1px)",
    },
    submitNote: {
      textAlign: "center",
      fontSize: "14px",
      color: "#6b7280",
      marginTop: "16px",
    },
    sectionDivider: {
      borderTop: "1px solid #f3f4f6",
      paddingTop: "32px",
      marginTop: "32px",
    },
    footer: {
      backgroundColor: "#f9fafb",
      borderTop: "1px solid #e5e7eb",
      marginTop: "64px",
    },
    footerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "32px 24px",
      textAlign: "center",
    },
    footerText: {
      color: "#6b7280",
      fontSize: "14px",
      margin: 0,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}

      {/* Main Content */}
      <main style={styles.main}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroIcon}>
            <FiUsers size={40} color="white" />
          </div>
          <h2 style={styles.heroTitle}>Add Extracurricular Activity</h2>
          <p style={styles.heroSubtitle}>
            Share your community service and extracurricular achievements.
            We&apos;ll verify your activities with the organization directly.
          </p>
        </div>

        {/* Benefits Cards */}
        <div style={styles.benefitsGrid}>
          <div style={styles.benefitCard}>
            <div style={{ ...styles.benefitIcon, backgroundColor: "#dcfce7" }}>
              <FiAward size={24} color="#16a34a" />
            </div>
            <h3 style={styles.benefitTitle}>Verified Records</h3>
            <p style={styles.benefitDescription}>
              All activities are verified directly with organizations for
              authenticity.
            </p>
          </div>
          <div style={styles.benefitCard}>
            <div style={{ ...styles.benefitIcon, backgroundColor: "#dcfce7" }}>
              <FiFileText size={24} color="#16a34a" />
            </div>
            <h3 style={styles.benefitTitle}>Digital Portfolio</h3>
            <p style={styles.benefitDescription}>
              Build a comprehensive digital record of your achievements.
            </p>
          </div>
          <div style={styles.benefitCard}>
            <div style={{ ...styles.benefitIcon, backgroundColor: "#dcfce7" }}>
              <FiClock size={24} color="#16a34a" />
            </div>
            <h3 style={styles.benefitTitle}>Quick Process</h3>
            <p style={styles.benefitDescription}>
              Simple submission process with fast verification turnaround.
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={styles.formContainer}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {/* Activity Details Section */}
            <div>
              <h3 style={styles.sectionTitle}>
                <FiAward size={20} color="var(--accent-color)" />
                Activity Details
              </h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Activity Name *</label>
                  <input
                    name="activityName"
                    value={form.activityName}
                    onChange={handleChange}
                    placeholder="e.g., Community Garden Volunteer"
                    style={{
                      ...styles.input,
                      ...(errors.activityName ? styles.inputError : {}),
                    }}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                  />
                  {errors.activityName && (
                    <p style={styles.errorText}>{errors.activityName}</p>
                  )}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Date of Activity *</label>
                  <div style={styles.inputWrapper}>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...styles.inputWithIcon,
                        ...(errors.date ? styles.inputError : {}),
                      }}
                      onFocus={(e) =>
                        Object.assign(e.target.style, styles.inputFocus)
                      }
                    />
                    <FiCalendar size={20} style={styles.inputIcon} />
                  </div>
                  {errors.date && <p style={styles.errorText}>{errors.date}</p>}
                </div>
              </div>
              <div style={{ ...styles.inputGroup, maxWidth: "300px" }}>
                <label style={styles.label}>Community Service Hours *</label>
                <div style={styles.inputWrapper}>
                  <input
                    name="hours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.hours}
                    onChange={handleChange}
                    placeholder="0"
                    style={{
                      ...styles.input,
                      ...styles.inputWithIcon,
                      ...(errors.hours ? styles.inputError : {}),
                    }}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                  />
                  <FiClock size={20} style={styles.inputIcon} />
                </div>
                {errors.hours && <p style={styles.errorText}>{errors.hours}</p>}
              </div>
            </div>

            {/* Organization Details Section */}
            <div style={styles.sectionDivider}>
              <h3 style={styles.sectionTitle}>
                <FiUsers size={20} color="var(--accent-color)" />
                Organization Information
              </h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Organization Name *</label>
                  <input
                    name="orgName"
                    value={form.orgName}
                    onChange={handleChange}
                    placeholder="e.g., Local Food Bank"
                    style={{
                      ...styles.input,
                      ...(errors.orgName ? styles.inputError : {}),
                    }}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                  />
                  {errors.orgName && (
                    <p style={styles.errorText}>{errors.orgName}</p>
                  )}
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Organization Phone *</label>
                  <div style={styles.inputWrapper}>
                    <input
                      name="orgPhone"
                      type="tel"
                      value={form.orgPhone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      style={{
                        ...styles.input,
                        ...styles.inputWithIcon,
                        ...(errors.orgPhone ? styles.inputError : {}),
                      }}
                      onFocus={(e) =>
                        Object.assign(e.target.style, styles.inputFocus)
                      }
                    />
                    <FiPhone size={20} style={styles.inputIcon} />
                  </div>
                  {errors.orgPhone && (
                    <p style={styles.errorText}>{errors.orgPhone}</p>
                  )}
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Organization Email *</label>
                <div style={styles.inputWrapper}>
                  <input
                    name="orgEmail"
                    type="email"
                    value={form.orgEmail}
                    onChange={handleChange}
                    placeholder="coordinator@organization.org"
                    style={{
                      ...styles.input,
                      ...styles.inputWithIcon,
                      ...(errors.orgEmail ? styles.inputError : {}),
                    }}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                  />
                  <FiMail size={20} style={styles.inputIcon} />
                </div>
                <p style={styles.helpText}>
                  Must be a valid organizational email (not Gmail or personal
                  accounts)
                </p>
                {errors.orgEmail && (
                  <p style={styles.errorText}>{errors.orgEmail}</p>
                )}
              </div>
            </div>

            {/* Organization Details Section */}
            <div style={styles.sectionDivider}>
              <h3 style={styles.sectionTitle}>
                <FiLayers size={20} color="var(--accent-color)" />
                Other Information
              </h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Skills Developed (comma separated) *
                  </label>
                  <input
                    name="skillsDeveloped"
                    value={form.skillsDeveloped}
                    onChange={handleChange}
                    placeholder="e.g., Leadership, Teamwork, Communication"
                    style={{
                      ...styles.input,
                      ...(errors.skillsDeveloped ? styles.inputError : {}),
                    }}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                  />
                  {errors.skillsDeveloped && (
                    <p style={styles.errorText}>{errors.skillsDeveloped}</p>
                  )}
                </div>
              </div>
              <div style={styles.inputGroup}>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Impact (comma separated) *</label>

                  <input
                    name="impact"
                    type="text"
                    value={form.impact}
                    onChange={handleChange}
                    placeholder="eg., 150 donors helped, 120 blood units collected"
                    style={{
                      ...styles.input,
                      ...(errors.impact ? styles.inputError : {}),
                    }}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>
                    Short description of what you did *
                  </label>

                  <textarea
                    name="Description"
                    type="text"
                    value={form.desc}
                    onChange={handleChange}
                    placeholder="eg., Organized and participated in food drives, assisted with logistics, and provided support during distribution events."
                    style={{
                      ...styles.input,
                      resize: "none",
                      height: "100px",
                      ...(errors.desc ? styles.inputError : {}),
                    }}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Certificate Upload Section */}
            <div style={styles.sectionDivider}>
              <h3 style={styles.sectionTitle}>
                <FiUpload size={20} color="var(--accent-color)" />
                Certificate Upload
              </h3>
              <div
                style={{
                  ...styles.uploadArea,
                  ...(dragActive ? styles.uploadAreaActive : {}),
                  ...(errors.certificate ? styles.uploadAreaError : {}),
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  name="certificate"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleChange}
                  style={styles.hiddenInput}
                />
                <div style={styles.uploadIcon}>
                  <FiUpload size={32} color="#9ca3af" />
                </div>
                <p style={styles.uploadText}>
                  {form.certificate
                    ? form.certificate.name
                    : "Drop your certificate here"}
                </p>
                <p style={styles.uploadSubtext}>
                  or{" "}
                  <span
                    style={{ color: "var(--accent-color)", fontWeight: "500" }}
                  >
                    browse files
                  </span>
                </p>
                <p style={styles.uploadHint}>
                  Supports PDF, PNG, JPG, JPEG (max 10MB)
                </p>
              </div>
              {errors.certificate && (
                <p style={styles.errorText}>{errors.certificate}</p>
              )}
            </div>

            {/* Submit Button */}
            <div style={styles.sectionDivider}>
              <button onClick={handleSubmit} style={styles.submitButton}>
                Submit & Request Validation
              </button>
              <p style={styles.submitNote}>
                We&apos;ll send a verification email to the organization and
                notify you once confirmed.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
