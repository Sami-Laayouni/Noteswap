import { useState, useEffect, useContext } from "react";
import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

// A simple confetti component for fun
const Confetti = ({ show }) => {
  return show ? (
    <div style={styles.confettiContainer}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={styles.confettiPiece(i)}
        ></div>
      ))}
    </div>
  ) : null;
};

// Compute the SHA-256 hash of a base64-encoded file
async function computeSHA256(base64) {
  const binaryData = atob(base64.split(",")[1]);
  const binaryArray = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    binaryArray[i] = binaryData.charCodeAt(i);
  }
  const hashBuffer = await crypto.subtle.digest("SHA-256", binaryArray);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Load a DOCX template file from a URL
function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

// Returns optimized summaries based on the selected college and the activity message.
function getCollegeOptimizedSummaries(college, itemMessage) {
  let commonApp;
  let bullet;
  let reflection;
  switch (college) {
    case "Harvard":
      commonApp = `At Harvard, excellence is paramount. Through ${itemMessage}, I demonstrated innovation and leadership.`;
      bullet = `• ${itemMessage} – Exemplifies Harvard's tradition of academic rigor and community impact.`;
      reflection = `This experience in ${itemMessage} has prepared me to thrive in Harvard's challenging and dynamic environment.`;
      break;
    case "Stanford":
      commonApp = `Stanford values creativity and collaboration. ${itemMessage} reflects my commitment to these ideals.`;
      bullet = `• ${itemMessage} – Showcases a blend of innovation and teamwork in line with Stanford's culture.`;
      reflection = `My involvement in ${itemMessage} has honed my ability to think differently and work collaboratively—qualities essential at Stanford.`;
      break;
    case "MIT":
      commonApp = `Innovation and problem-solving lie at the heart of MIT's mission. ${itemMessage} allowed me to contribute meaningfully in these areas.`;
      bullet = `• ${itemMessage} – A practical demonstration of analytical thinking and creative solutions, echoing MIT’s values.`;
      reflection = `Engaging in ${itemMessage} has furthered my passion for technology and innovation, which MIT champions.`;
      break;
    case "Yale":
      commonApp = `At Yale, commitment to community and intellectual growth is essential. ${itemMessage} stands as a testament to that dedication.`;
      bullet = `• ${itemMessage} – Highlights a balanced approach towards academic excellence and social responsibility, key to Yale's legacy.`;
      reflection = `My experience with ${itemMessage} has deeply influenced my perspective and prepared me for Yale's vibrant community.`;
      break;
    default:
      commonApp = `Demonstrated teamwork and leadership through ${itemMessage}, creating lasting impact.`;
      bullet = `• ${itemMessage} – Enhanced collaboration & problem-solving skills.`;
      reflection = `This experience helped me grow personally, fostering empathy and responsibility.`;
      break;
  }
  return { commonApp, bullet, reflection };
}

const themeColors = {
  Modern: { primary: "#1a3c34", secondary: "#e8f0fe" },
  Classic: { primary: "#b58900", secondary: "#fdf6e3" },
  Minimalist: { primary: "#333", secondary: "#fff" },
  Elegant: { primary: "#8e806a", secondary: "#f7f1e1" },
};

const MagicalTranscriptModal = () => {
  const { certificateModal } = useContext(ModalContext);
  const [open, setOpen] = certificateModal;

  // User and school data
  const [userData, setUserData] = useState(null);
  const [schoolData, setSchoolData] = useState(null);

  // Format selection (docx, pdf, txt)
  const [format, setFormat] = useState("docx");

  // Portfolio items array (each with a category)
  const [portfolioItems, setPortfolioItems] = useState([]);

  // Toggles for categories
  const [includeActivities, setIncludeActivities] = useState(true);
  const [includeTutoring, setIncludeTutoring] = useState(true);
  const [includeService, setIncludeService] = useState(true);

  // “Magic AI” summaries (multiple formats per item)
  const [summaries, setSummaries] = useState({});

  // Visual effects states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Design Theme Selection
  const [theme, setTheme] = useState("Modern"); // Options: Modern, Classic, Minimalist, Elegant

  // College Selection
  const [selectedCollege, setSelectedCollege] = useState("None");

  // Load user data from localStorage (or use fallback demo data)
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      const uData = JSON.parse(localStorage.getItem("userInfo"));
      const sData = JSON.parse(localStorage.getItem("schoolInfo"));
      setUserData(uData);
      setSchoolData(sData);

      let events = [];
      if (uData.breakdown && Array.isArray(uData.breakdown)) {
        events = uData.breakdown.map((act, idx) => ({
          id: idx + 1,
          category: act.category || "activity",
          ...act,
        }));
      }

      const allocatedPoints = uData.breakdown.reduce(
        (sum, entry) => sum + parseInt(entry.minutes, 10),
        0
      );

      const leftoverPoints = Math.max(uData.points / 200 - allocatedPoints, 0);

      if (leftoverPoints > 0) {
        events.unshift({
          id: events.length + 1,
          category: "activity",
          message: "Sharing notes on NoteSwap",
          minutes: Math.round(leftoverPoints / 20),
          organization: "NoteSwap",
          rewardedOn: new Date().toLocaleDateString("en-US"),
        });
      }

      if (uData.tutor_hours && uData.tutor_hours !== 0) {
        events.unshift({
          id: events.length + 1,
          category: "tutoring",
          message: "Tutoring Students",
          minutes: Math.round(uData.tutor_hours / 60),
          organization: "NoteSwap",
          rewardedOn: new Date().toLocaleDateString("en-US"),
        });
      }

      setPortfolioItems(events);
    } else {
      setUserData({
        first_name: "Jane",
        last_name: "Doe",
        createdAt: "2022-10-01",
        points: 40,
        tutor_hours: 120,
        counselorApproval: { status: "pending" }, // Default to pending for demo
      });
      setSchoolData({
        schoolFullName: "NoteSwap Academy",
      });
      setPortfolioItems([
        {
          id: 1,
          category: "activity",
          message: "Volunteered at Local Animal Shelter",
          minutes: 120,
          organization: "City Animal Shelter",
          rewardedOn: "2023-05-01",
          points: 0,
        },
        {
          id: 2,
          category: "tutoring",
          message: "Tutored Algebra for Freshmen",
          minutes: 90,
          organization: "Math Club",
          rewardedOn: "2023-06-15",
          points: 0,
        },
        {
          id: 3,
          category: "community_service",
          message: "Beach Cleanup Initiative",
          minutes: 180,
          organization: "Green Earth Org",
          rewardedOn: "2023-07-20",
          points: 0,
        },
      ]);
    }
  }, []);

  if (!open) return null;

  // Filter items based on category toggles
  const getFilteredItems = () => {
    return portfolioItems.filter((item) => {
      if (item.category === "activity" && !includeActivities) return false;
      if (item.category === "tutoring" && !includeTutoring) return false;
      if (item.category === "community_service" && !includeService)
        return false;
      return true;
    });
  };

  // Generate all summaries
  const handleGenerateAllSummaries = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setShowConfetti(false);

    const finalItems = getFilteredItems();
    const total = finalItems.length;
    const newSummaries = {};

    for (let i = 0; i < total; i++) {
      const item = finalItems[i];
      await new Promise((res) => setTimeout(res, 500));

      const { commonApp, bullet, reflection } = getCollegeOptimizedSummaries(
        selectedCollege,
        item.message
      );

      newSummaries[item.id] = {
        commonApp,
        bullet,
        reflection,
      };

      setSummaries((prev) => ({ ...prev, ...newSummaries }));
      setGenerationProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsGenerating(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // DOCX Generation
  const generateDocx = async () => {
    loadFile(
      `${
        process.env.NEXT_PUBLIC_URL?.includes("noteswap")
          ? "https://www.noteswap.org/"
          : process.env.NEXT_PUBLIC_URL
      }assets/pdf/NoteSwap_Transcript.docx`,
      async (error, content) => {
        if (error) throw error;

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        const currentDate = new Date();
        const pastDate = new Date(userData?.createdAt || "2022-01-01");
        const formattedDate = currentDate.toLocaleDateString("en-US");
        const pastFormattedDate = pastDate.toLocaleDateString("en-US");

        const finalItems = getFilteredItems();

        const totalCommunityService = finalItems.reduce(
          (sum, entry) => sum + parseInt(entry.minutes, 10),
          0
        );

        doc.render({
          full_name: `${userData?.first_name || "Jane"} ${
            userData?.last_name || "Doe"
          }`,
          school_name: schoolData?.schoolFullName || "NoteSwap Academy",
          service_dates: `${pastFormattedDate} to ${formattedDate}`,
          events: finalItems,
          current_date: formattedDate,
          total_community_service: `${totalCommunityService} minute${
            totalCommunityService === 1 ? "" : "s"
          }`,
          theme,
        });

        try {
          const docBlob = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            compression: "DEFLATE",
          });

          const reader = new FileReader();
          reader.onload = async () => {
            const result = reader.result;
            const sha256Hash = await computeSHA256(result);
            console.log("SHA-256 for docx:", sha256Hash);
            await fetch("/api/certificate/download_certificate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sha256: sha256Hash,
                userId: localStorage.getItem("userInfo")
                  ? JSON.parse(localStorage.getItem("userInfo"))._id
                  : "demoUser",
                downloadedAt: new Date(),
              }),
            });
          };
          reader.readAsDataURL(docBlob);
          saveAs(docBlob, "NoteSwap_Portfolio.docx");
        } catch (err) {
          console.error("Error generating DOCX:", err);
        }
      }
    );
  };

  // PDF Generation
  const generatePDF = () => {
    const doc = new jsPDF();

    // Set font based on theme
    if (theme === "Modern" || theme === "Minimalist") {
      doc.setFont("helvetica");
    } else if (theme === "Classic" || theme === "Elegant") {
      doc.setFont("times");
    }

    // Set text color for Minimalist theme
    if (theme === "Minimalist") {
      doc.setTextColor(100, 100, 100); // Medium gray
    } else {
      doc.setTextColor(0, 0, 0); // Black
    }

    // Header
    doc.setFontSize(16);
    if (theme === "Elegant") {
      doc.setFont("times", "bold");
    }
    doc.text("NoteSwap Magical Portfolio", 10, 10);
    if (theme === "Elegant") {
      doc.setFont("times", "normal");
    }

    // User Info
    doc.setFontSize(12);
    let yPos = 20;
    doc.text(`Name: ${userData?.first_name} ${userData?.last_name}`, 10, yPos);
    yPos += 6;
    doc.text(`School: ${schoolData?.schoolFullName}`, 10, yPos);
    yPos += 6;
    doc.text(`Theme: ${theme}`, 10, yPos);
    yPos += 6;

    // Total Community Service
    const finalItems = getFilteredItems();
    const totalCommunityService = finalItems.reduce(
      (sum, entry) => sum + parseInt(entry.minutes, 10),
      0
    );
    doc.text(
      `Total Community Service: ${totalCommunityService} minutes`,
      10,
      yPos
    );
    yPos += 10;

    // Items with Pagination and Text Wrapping
    finalItems.forEach((item, index) => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 10;
      }
      if (theme === "Elegant") {
        doc.setFont("times", "bold");
      }
      const itemTitle = `${index + 1}. ${item.message} (${item.category})`;
      const itemTitleLines = doc.splitTextToSize(itemTitle, 180);
      doc.text(itemTitleLines, 10, yPos);
      yPos += itemTitleLines.length * 6;
      if (theme === "Elegant") {
        doc.setFont("times", "normal");
      }

      if (summaries[item.id]) {
        const commonAppText = doc.splitTextToSize(
          `CommonApp: ${summaries[item.id].commonApp}`,
          170
        );
        if (yPos + commonAppText.length * 6 > 280) {
          doc.addPage();
          yPos = 10;
        }
        doc.text(commonAppText, 15, yPos);
        yPos += commonAppText.length * 6;

        const bulletText = doc.splitTextToSize(
          `Bullet: ${summaries[item.id].bullet}`,
          170
        );
        if (yPos + bulletText.length * 6 > 280) {
          doc.addPage();
          yPos = 10;
        }
        doc.text(bulletText, 15, yPos);
        yPos += bulletText.length * 6;

        const reflectionText = doc.splitTextToSize(
          `Reflection: ${summaries[item.id].reflection}`,
          170
        );
        if (yPos + reflectionText.length * 6 > 280) {
          doc.addPage();
          yPos = 10;
        }
        doc.text(reflectionText, 15, yPos);
        yPos += reflectionText.length * 6;
      }
      yPos += 4; // Extra spacing between items
    });

    const pdfBlob = doc.output("blob");
    saveAs(pdfBlob, "NoteSwap_Portfolio.pdf");
  };

  // Plain Text Generation
  const generatePlainText = () => {
    const finalItems = getFilteredItems();
    const totalCommunityService = finalItems.reduce(
      (sum, entry) => sum + parseInt(entry.minutes, 10),
      0
    );
    let content = "NoteSwap Magical Portfolio\n\n";
    content += `Name: ${userData?.first_name} ${userData?.last_name}\n`;
    content += `School: ${schoolData?.schoolFullName}\n`;
    content += `Theme: ${theme}\n`;
    content += `Total Community Service: ${totalCommunityService} minutes\n\n`;
    finalItems.forEach((item, i) => {
      content += `- ${item.message} (${item.category}) [${item.minutes} minutes]\n`;
      if (summaries[item.id]) {
        content += `  Common App: ${summaries[item.id].commonApp}\n`;
        content += `  Bullet: ${summaries[item.id].bullet}\n`;
        content += `  Reflection: ${summaries[item.id].reflection}\n`;
      }
      content += "\n";
    });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "NoteSwap_Portfolio.txt");
  };

  // Handle Download
  const handleDownload = () => {
    if (userData?.approved !== true) {
      return; // Prevent download if not approved
    }
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    if (format === "docx") generateDocx();
    else if (format === "pdf") generatePDF();
    else generatePlainText();
  };

  // Button Styles
  const generateButtonStyle = {
    padding: "8px 14px",
    backgroundColor: themeColors[theme].primary,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "background-color 0.2s ease",
  };

  const downloadButtonStyle = {
    marginTop: "1.5rem",
    padding: "10px 16px",
    backgroundColor:
      userData?.approved === true ? themeColors[theme].primary : "#d1d9e6",
    color: userData?.approved === true ? "#fff" : "#718096",
    border: "none",
    borderRadius: "4px",
    cursor: userData?.approved === true ? "pointer" : "not-allowed",
    fontWeight: 600,
    transition: "background-color 0.2s ease",
  };

  // Calculate filtered items and total community service for preview
  const finalItems = getFilteredItems();
  const totalCommunityService = finalItems.reduce(
    (sum, entry) => sum + parseInt(entry.minutes, 10),
    0
  );

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="NoteSwap Portfolio Builder"
      small={false}
    >
      <Confetti show={showConfetti} />

      <div style={styles.container}>
        {/* Warning Message */}
        {userData?.approved !== true && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              color: "#856404",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #ffeeba",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              animation: "fadeIn 0.5s ease-in-out",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#856404",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>⚠</span> Not Verified
            </h3>
            <p>
              Your extracurricular activities have not been approved by your
              counselor. Please ensure your counselor verifies your transcript.
            </p>
          </div>
        )}

        <p style={styles.description}>
          Create Your Personalized NoteSwap Transcript for Your Dream University
          NoteSwap can tailor your portfolio to match your ideal college. Toggle
          which categories to include, choose a design theme, generate
          compelling Common App summaries, and download your portfolio in
          multiple formats.
        </p>

        {/* Category Toggles */}
        <div style={styles.toggles}>
          <label>
            <input
              type="checkbox"
              checked={includeActivities}
              onChange={() => setIncludeActivities(!includeActivities)}
            />
            Activities
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeTutoring}
              onChange={() => setIncludeTutoring(!includeTutoring)}
            />
            Tutoring
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeService}
              onChange={() => setIncludeService(!includeService)}
            />
            Community Service
          </label>
        </div>

        {/* Design Theme Selection */}
        <div style={{ margin: "1rem 0" }}>
          <label style={styles.formatLabel}>Choose Design Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={styles.select}
          >
            <option value="Modern">Modern</option>
            <option value="Classic">Classic</option>
            <option value="Minimalist">Minimalist</option>
            <option value="Elegant">Elegant</option>
          </select>
        </div>

        {/* College Selection Dropdown */}
        <div style={{ margin: "1rem 0" }}>
          <label style={styles.formatLabel}>Select College:</label>
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            style={styles.select}
          >
            <option value="None">None</option>
            <option value="Harvard">Harvard</option>
            <option value="Stanford">Stanford</option>
            <option value="MIT">MIT</option>
            <option value="Yale">Yale</option>
          </select>
        </div>

        {/* One-click AI Summaries */}
        <button
          style={generateButtonStyle}
          onClick={handleGenerateAllSummaries}
          disabled={isGenerating}
        >
          {isGenerating
            ? "Generating Summaries..."
            : "Generate AI Summary for Your College"}
        </button>

        {/* Progress Bar */}
        {isGenerating && (
          <div style={styles.progressBarContainer}>
            <div
              style={{ ...styles.progressBar, width: `${generationProgress}%` }}
            >
              {generationProgress}%
            </div>
          </div>
        )}

        {/* Format Selection */}
        <div style={{ marginTop: "1rem" }}>
          <label style={styles.formatLabel}>Choose Download Format:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={styles.select}
          >
            <option value="docx">DOCX</option>
            <option value="pdf">PDF</option>
            <option value="txt">Plain Text</option>
          </select>
        </div>

        {/* Portfolio Preview */}
        <h4 style={{ marginTop: "2rem" }}>Portfolio Preview ({theme} Theme)</h4>
        <div
          style={{
            ...styles.portfolioPreview,
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontFamily:
                theme === "Elegant" ? "'Georgia', serif" : "Roboto, sans-serif",
            }}
          >
            NoteSwap Portfolio
          </h2>
          <p>
            <strong>Name:</strong> {userData?.first_name} {userData?.last_name}
          </p>
          <p>
            <strong>School:</strong> {schoolData?.schoolFullName}
          </p>
          <p>
            <strong>Theme:</strong> {theme}
          </p>
          <p>
            <strong>Total Community Service:</strong> {totalCommunityService}{" "}
            minutes
          </p>
          <hr
            style={{
              margin: "15px 0",
              borderColor: themeColors[theme].primary,
            }}
          />
          {finalItems.map((item, index) => (
            <div key={item.id} style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  color: themeColors[theme].primary,
                  fontSize: "1.1rem",
                  marginBottom: "8px",
                }}
              >
                {index + 1}. {item.message} ({item.category})
              </h3>
              <p style={{ fontSize: "0.9rem" }}>
                <strong>Minutes:</strong> {item.minutes}
              </p>
              <p style={{ fontSize: "0.9rem" }}>
                <strong>Organization/Person:</strong> {item.organization}
              </p>
              <p style={{ fontSize: "0.9rem" }}>
                <strong>Date:</strong> {item.rewardedOn}
              </p>
              {summaries[item.id] && (
                <div
                  style={{
                    marginTop: "10px",
                    paddingLeft: "10px",
                    borderLeft: `2px solid ${themeColors[theme].primary}`,
                  }}
                >
                  <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                    Common App Summary:
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>
                    {summaries[item.id].commonApp}
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      marginTop: "8px",
                    }}
                  >
                    Bullet Point:
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>
                    {summaries[item.id].bullet}
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      marginTop: "8px",
                    }}
                  >
                    Reflective Paragraph:
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>
                    {summaries[item.id].reflection}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Download Button */}
        <button
          style={downloadButtonStyle}
          onClick={handleDownload}
          disabled={!(userData?.approved == true)}
        >
          Download Portfolio
        </button>
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
};

export default MagicalTranscriptModal;

// Styles
const styles = {
  container: {
    width: "100%",
    minHeight: "400px",
    padding: "2rem",
    position: "relative",
    fontFamily: "Roboto, sans-serif",
  },
  description: {
    marginBottom: "1.5rem",
    fontSize: "1.1rem",
    color: "#333",
  },
  toggles: {
    display: "flex",
    gap: "1.5rem",
    marginBottom: "1.5rem",
    fontSize: "1rem",
  },
  progressBarContainer: {
    width: "100%",
    background: "#eee",
    borderRadius: "4px",
    overflow: "hidden",
    marginTop: "1rem",
  },
  progressBar: {
    background: "#4CAF50",
    color: "#fff",
    height: "24px",
    lineHeight: "24px",
    textAlign: "center",
    transition: "width 0.3s ease",
  },
  formatLabel: {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "1rem",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "200px",
    fontSize: "1rem",
  },
  portfolioPreview: {
    marginTop: "1rem",
    maxHeight: "300px",
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: "8px",
  },
  confettiContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: 9999,
    overflow: "hidden",
  },
  confettiPiece: (i) => {
    const colors = ["#FF4136", "#2ECC40", "#0074D9", "#FFDC00", "#B10DC9"];
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const color = colors[i % colors.length];
    return {
      position: "absolute",
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      top: "-10vh",
      left: `${left}vw`,
      animation: `confettiFall 3s ${delay}s ease-in-out forwards`,
      borderRadius: "50%",
    };
  },
};
