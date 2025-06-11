import React, { useState } from "react";

function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    postSecondaryPlan: "",
    alternativePath: "",
    dreamUniversities: [],
    extracurricularTypes: [],
    timeCommitment: "",
    leadershipInterest: "",
    academicFocus: [],
    careerGoals: "",
    personalityType: "",
    preferredEnvironment: "",
    motivations: [],
    currentActivities: "",
  });

  const dreamUniversities = [
    // Canadian Universities
    "University of Toronto",
    "McGill University",
    "University of British Columbia",
    "University of Waterloo",
    "McMaster University",
    "University of Alberta",
    "Western University",
    "Queen's University",
    "University of Ottawa",
    "Simon Fraser University",

    // American Universities
    "Harvard University",
    "Stanford University",
    "MIT",
    "Yale University",
    "Princeton University",
    "Columbia University",
    "University of Chicago",
    "University of Pennsylvania",
    "Northwestern University",
    "Duke University",
    "Johns Hopkins University",
    "Dartmouth College",
    "Brown University",
    "Vanderbilt University",
    "Rice University",
    "Georgetown University",
    "UC Berkeley",
    "UCLA",
    "University of Michigan",
    "Other",
  ];

  const extracurricularCategories = [
    "Academic Clubs & Competitions",
    "Sports & Athletics",
    "Arts & Creative",
    "Community Service & Volunteering",
    "Leadership & Student Government",
    "STEM & Technology",
    "Debate & Public Speaking",
    "Music & Performance",
    "Environmental & Sustainability",
    "Cultural & International",
    "Entrepreneurship & Business",
    "Research & Science Fairs",
  ];

  const academicFocusAreas = [
    "STEM (Science, Technology, Engineering, Math)",
    "Liberal Arts & Humanities",
    "Business & Economics",
    "Social Sciences",
    "Pre-Med/Health Sciences",
    "Engineering",
    "Computer Science",
    "Arts & Design",
    "Law & Politics",
    "International Relations",
    "Environmental Studies",
    "Psychology",
  ];

  const motivationOptions = [
    "Building leadership skills",
    "Making a positive impact",
    "Exploring career interests",
    "Meeting like-minded peers",
    "Developing specific talents",
    "College application enhancement",
    "Personal growth & confidence",
    "Learning new skills",
    "Having fun & relaxation",
    "Giving back to community",
  ];

  const steps = [
    {
      title: "Future Plans",
      subtitle: "What's your vision for after high school?",
      component: "plans",
      icon: "🎯",
    },
    {
      title: "Dream Universities",
      subtitle: "Where do you see yourself thriving?",
      component: "universities",
      icon: "🎓",
    },
    {
      title: "Extracurricular Interests",
      subtitle: "What activities spark your passion?",
      component: "activities",
      icon: "🌟",
    },
    {
      title: "Time & Commitment",
      subtitle: "How do you prefer to invest your time?",
      component: "commitment",
      icon: "⏰",
    },
    {
      title: "Academic Focus",
      subtitle: "What subjects captivate you most?",
      component: "academics",
      icon: "📚",
    },
    {
      title: "Personal Style",
      subtitle: "What environment brings out your best?",
      component: "personality",
      icon: "✨",
    },
    {
      title: "Motivations & Goals",
      subtitle: "What drives your extracurricular choices?",
      component: "goals",
      icon: "🎯",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("Survey Results:", formData);
    alert(
      "Thank you for completing the survey! Your responses have been recorded."
    );
  };

  // Skip university step if not planning to attend university
  const getNextStepIndex = () => {
    if (currentStep === 0 && formData.postSecondaryPlan !== "University") {
      return 2; // Skip universities step
    }
    return currentStep + 1;
  };

  const getPrevStepIndex = () => {
    if (currentStep === 2 && formData.postSecondaryPlan !== "University") {
      return 0; // Skip back to plans step
    }
    return currentStep - 1;
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "whitesmoke",
      padding: "2rem",
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    card: {
      maxWidth: "1000px",
      margin: "0 auto",
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
      backdropFilter: "blur(10px)",
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    header: {
      background:
        "linear-gradient(135deg,rgb(102, 234, 190) 0%, var(--accent-color) 100%)",
      color: "white",
      padding: "3rem 2rem",
      textAlign: "center",
      position: "relative",
    },
    headerOverlay: {
      position: "absolute",
      inset: 0,
      background:
        'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\') repeat',
    },
    title: {
      fontSize: "3rem",
      fontWeight: "800",
      margin: "0 0 1rem",
      background: "linear-gradient(135deg, #fff, #e2e8f0)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      position: "relative",
      zIndex: 1,
    },
    description: {
      fontSize: "1.25rem",
      opacity: 0.95,
      margin: "0 0 2.5rem",
      position: "relative",
      zIndex: 1,
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
      lineHeight: "1.6",
    },
    progressContainer: {
      maxWidth: "500px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
    },
    progressBar: {
      height: "12px",
      background: "rgba(255, 255, 255, 0.25)",
      borderRadius: "6px",
      overflow: "hidden",
      marginBottom: "1rem",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #fff, #f1f5f9)",
      borderRadius: "6px",
      transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 2px 8px rgba(255, 255, 255, 0.3)",
    },
    progressText: {
      fontSize: "1rem",
      opacity: 0.9,
      fontWeight: "500",
    },
    stepIndicator: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginBottom: "2rem",
      position: "relative",
      zIndex: 1,
    },
    stepDot: (isActive, isCompleted) => ({
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.25rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      border: "2px solid",
      borderColor: isCompleted
        ? "#10b981"
        : isActive
        ? "var(--accent-color)"
        : "rgba(255, 255, 255, 0.3)",
      background: isCompleted
        ? "#10b981"
        : isActive
        ? "var(--accent-color)"
        : "rgba(255, 255, 255, 0.1)",
      color: "white",
      cursor: "pointer",
    }),
    stepHeader: {
      padding: "2.5rem 2rem",
      textAlign: "center",
      background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
      borderBottom: "1px solid #e5e7eb",
    },
    stepTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#1f2937",
      margin: "0 0 0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
    },
    stepSubtitle: {
      fontSize: "1.25rem",
      color: "#6b7280",
      margin: "0",
      fontWeight: "400",
    },
    content: {
      padding: "3rem 2rem",
      background: "white",
    },
    instruction: {
      fontSize: "1.25rem",
      color: "#374151",
      margin: "0 0 2.5rem",
      textAlign: "center",
      fontWeight: "500",
      lineHeight: "1.6",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    button: (isSelected, isDisabled) => ({
      padding: "1rem 1.5rem",
      border: "2px solid",
      borderColor: isSelected ? "lightgreen" : "#e5e7eb",
      borderRadius: "16px",
      background: isSelected ? "var(--accent-color)" : "white",
      cursor: isDisabled ? "not-allowed" : "pointer",
      fontSize: "1rem",
      fontWeight: isSelected ? "600" : "500",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      textAlign: "center",
      color: isSelected ? "white" : "#374151",
      opacity: isDisabled ? 0.5 : 1,
      boxShadow: isSelected
        ? "0 8px 25px rgba(102, 126, 234, 0.3)"
        : "0 2px 10px rgba(0, 0, 0, 0.05)",
      transform: isSelected ? "translateY(-2px)" : "none",
    }),
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
    },
    selectionCount: {
      textAlign: "center",
      color: "#6b7280",
      fontWeight: "600",
      marginTop: "1.5rem",
      fontSize: "1.1rem",
    },
    questionGroup: {
      marginBottom: "3rem",
    },
    questionLabel: {
      display: "block",
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "1.5rem",
      lineHeight: "1.5",
    },
    radioGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
    },
    textarea: {
      width: "100%",
      padding: "1.25rem",
      border: "2px solid #e5e7eb",
      borderRadius: "16px",
      fontSize: "1rem",
      resize: "vertical",
      transition: "all 0.3s ease",
      fontFamily: "inherit",
      lineHeight: "1.6",
      minHeight: "120px",
      background: "#fafafa",
    },
    textareaFocus: {
      outline: "none",
      borderColor: "var(--accent-color)",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
      background: "white",
    },
    navigation: {
      display: "flex",
      justifyContent: "space-between",
      padding: "2.5rem",
      background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
      borderTop: "1px solid #e5e7eb",
    },
    navButton: (variant, disabled) => ({
      padding: "1rem 2.5rem",
      border: "none",
      borderRadius: "16px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      background: variant === "primary" ? "var(--accent-color)" : "#f3f4f6",
      color: variant === "primary" ? "white" : "#374151",
      opacity: disabled ? 0.5 : 1,
      boxShadow:
        variant === "primary"
          ? "0 8px 25px rgba(102, 126, 234, 0.3)"
          : "0 2px 10px rgba(0, 0, 0, 0.05)",
      minWidth: "140px",
    }),
    mobile: {
      "@media (max-width: 768px)": {
        grid: {
          gridTemplateColumns: "1fr",
        },
        navigation: {
          flexDirection: "column",
          gap: "1rem",
        },
        title: {
          fontSize: "2.25rem",
        },
      },
    },
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.component) {
      case "plans":
        return (
          <div style={styles.content}>
            <p style={styles.instruction}>
              What are your plans after high school graduation?
            </p>
            <div style={styles.radioGroup}>
              {[
                "University",
                "College/Community College",
                "Trade School/Vocational Training",
                "Gap Year",
                "Enter the Workforce",
                "Start a Business/Entrepreneurship",
                "Other",
              ].map((option) => (
                <button
                  key={option}
                  style={styles.button(
                    formData.postSecondaryPlan === option,
                    false
                  )}
                  onClick={() => handleInputChange("postSecondaryPlan", option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {formData.postSecondaryPlan === "Other" && (
              <div style={styles.questionGroup}>
                <label style={styles.questionLabel}>
                  Please describe your alternative path:
                </label>
                <textarea
                  style={styles.textarea}
                  placeholder="Tell us about your specific plans after high school..."
                  value={formData.alternativePath}
                  onChange={(e) =>
                    handleInputChange("alternativePath", e.target.value)
                  }
                  onFocus={(e) =>
                    Object.assign(e.target.style, styles.textareaFocus)
                  }
                  onBlur={(e) => Object.assign(e.target.style, styles.textarea)}
                  rows={4}
                />
              </div>
            )}
          </div>
        );

      case "universities":
        return (
          <div style={styles.content}>
            <p style={styles.instruction}>
              Select up to 5 universities that represent your academic
              aspirations:
            </p>
            <div style={styles.grid}>
              {dreamUniversities.map((university, index) => (
                <button
                  key={index}
                  style={styles.button(
                    formData.dreamUniversities.includes(university),
                    formData.dreamUniversities.length >= 5 &&
                      !formData.dreamUniversities.includes(university)
                  )}
                  onClick={() => {
                    if (
                      formData.dreamUniversities.length < 5 ||
                      formData.dreamUniversities.includes(university)
                    ) {
                      handleMultiSelect("dreamUniversities", university);
                    }
                  }}
                  disabled={
                    formData.dreamUniversities.length >= 5 &&
                    !formData.dreamUniversities.includes(university)
                  }
                  onMouseEnter={(e) => {
                    if (
                      !e.target.disabled &&
                      !formData.dreamUniversities.includes(university)
                    ) {
                      Object.assign(e.target.style, styles.buttonHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!formData.dreamUniversities.includes(university)) {
                      Object.assign(
                        e.target.style,
                        styles.button(false, false)
                      );
                    }
                  }}
                >
                  {university}
                </button>
              ))}
            </div>
            <p style={styles.selectionCount}>
              {formData.dreamUniversities.length}/5 selected
            </p>
          </div>
        );

      case "activities":
        return (
          <div style={styles.content}>
            <p style={styles.instruction}>
              Choose the extracurricular categories that interest you most:
            </p>
            <div style={styles.grid}>
              {extracurricularCategories.map((category, index) => (
                <button
                  key={index}
                  style={styles.button(
                    formData.extracurricularTypes.includes(category),
                    false
                  )}
                  onClick={() =>
                    handleMultiSelect("extracurricularTypes", category)
                  }
                  onMouseEnter={(e) => {
                    if (!formData.extracurricularTypes.includes(category)) {
                      Object.assign(e.target.style, styles.buttonHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!formData.extracurricularTypes.includes(category)) {
                      Object.assign(
                        e.target.style,
                        styles.button(false, false)
                      );
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        );

      case "commitment":
        return (
          <div style={styles.content}>
            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>
                How much time do you prefer to dedicate to extracurriculars
                weekly?
              </label>
              <div style={styles.radioGroup}>
                {["2-4 hours", "5-8 hours", "9-12 hours", "13+ hours"].map(
                  (option) => (
                    <button
                      key={option}
                      style={styles.button(
                        formData.timeCommitment === option,
                        false
                      )}
                      onClick={() =>
                        handleInputChange("timeCommitment", option)
                      }
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>
            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>
                Are you interested in leadership positions?
              </label>
              <div style={styles.radioGroup}>
                {[
                  "Very interested",
                  "Somewhat interested",
                  "Neutral",
                  "Not particularly interested",
                ].map((option) => (
                  <button
                    key={option}
                    style={styles.button(
                      formData.leadershipInterest === option,
                      false
                    )}
                    onClick={() =>
                      handleInputChange("leadershipInterest", option)
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "academics":
        return (
          <div style={styles.content}>
            <p style={styles.instruction}>
              Select your primary academic interests:
            </p>
            <div style={styles.grid}>
              {academicFocusAreas.map((area, index) => (
                <button
                  key={index}
                  style={styles.button(
                    formData.academicFocus.includes(area),
                    false
                  )}
                  onClick={() => handleMultiSelect("academicFocus", area)}
                >
                  {area}
                </button>
              ))}
            </div>
            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>
                What are your career aspirations?
              </label>
              <textarea
                style={styles.textarea}
                placeholder="Describe your career goals and how extracurriculars might help you achieve them..."
                value={formData.careerGoals}
                onChange={(e) =>
                  handleInputChange("careerGoals", e.target.value)
                }
                onFocus={(e) =>
                  Object.assign(e.target.style, styles.textareaFocus)
                }
                onBlur={(e) => Object.assign(e.target.style, styles.textarea)}
                rows={4}
              />
            </div>
          </div>
        );

      case "personality":
        return (
          <div style={styles.content}>
            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>
                Which best describes your personality in group settings?
              </label>
              <div style={styles.radioGroup}>
                {[
                  "Natural leader who takes charge",
                  "Collaborative team player",
                  "Creative contributor with unique ideas",
                  "Reliable supporter who helps others succeed",
                  "Independent worker who excels solo",
                ].map((option) => (
                  <button
                    key={option}
                    style={styles.button(
                      formData.personalityType === option,
                      false
                    )}
                    onClick={() => handleInputChange("personalityType", option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>
                What environment do you thrive in?
              </label>
              <div style={styles.radioGroup}>
                {[
                  "Competitive and high-energy",
                  "Collaborative and supportive",
                  "Creative and expressive",
                  "Structured and organized",
                  "Flexible and adaptable",
                ].map((option) => (
                  <button
                    key={option}
                    style={styles.button(
                      formData.preferredEnvironment === option,
                      false
                    )}
                    onClick={() =>
                      handleInputChange("preferredEnvironment", option)
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "goals":
        return (
          <div style={styles.content}>
            <div style={styles.questionGroup}>
              <p style={styles.instruction}>
                What motivates you to participate in extracurriculars?
              </p>
              <div style={styles.grid}>
                {motivationOptions.map((motivation, index) => (
                  <button
                    key={index}
                    style={styles.button(
                      formData.motivations.includes(motivation),
                      false
                    )}
                    onClick={() => handleMultiSelect("motivations", motivation)}
                  >
                    {motivation}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.questionGroup}>
              <label style={styles.questionLabel}>
                Tell us about your current extracurricular activities:
              </label>
              <textarea
                style={styles.textarea}
                placeholder="List your current activities and what you enjoy about them..."
                value={formData.currentActivities}
                onChange={(e) =>
                  handleInputChange("currentActivities", e.target.value)
                }
                onFocus={(e) =>
                  Object.assign(e.target.style, styles.textareaFocus)
                }
                onBlur={(e) => Object.assign(e.target.style, styles.textarea)}
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      handleSubmit();
    } else {
      const nextIndex = getNextStepIndex();
      setCurrentStep(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = getPrevStepIndex();
    setCurrentStep(prevIndex);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerOverlay}></div>
          <h1 style={styles.title}>Extracurricular Discovery Survey</h1>
          <p style={styles.description}>
            Help us understand your interests and aspirations to recommend the
            perfect extracurricular activities that align with your goals
          </p>
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            <span style={styles.progressText}>
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div style={styles.stepIndicator}>
            {steps.map((step, index) => (
              <div
                key={index}
                style={styles.stepDot(
                  index === currentStep,
                  index < currentStep
                )}
                title={step.title}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.stepHeader}>
          <h2 style={styles.stepTitle}>
            <span>{steps[currentStep].icon}</span>
            {steps[currentStep].title}
          </h2>
          <p style={styles.stepSubtitle}>{steps[currentStep].subtitle}</p>
        </div>

        {renderStepContent()}

        <div style={styles.navigation}>
          <button
            style={styles.navButton("secondary", currentStep === 0)}
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>
          {currentStep === steps.length - 1 ? (
            <button
              style={styles.navButton("primary", false)}
              onClick={handleSubmit}
            >
              Complete Survey ✨
            </button>
          ) : (
            <button
              style={styles.navButton("primary", false)}
              onClick={handleNext}
            >
              Next Step →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Survey;
