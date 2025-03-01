import { useState, useEffect, useContext } from "react";
import Modal from "../../Template/Modal";
import ModalContext from "../../../context/ModalContext";

// External libs for DOCX, PDF, file saving
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
  // Example: { itemId: { commonApp: "", bullet: "", reflection: "" } }

  // Visual effects states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- NEW: Design Theme Selection ---
  // Let the user choose from multiple design themes
  const [theme, setTheme] = useState("Modern"); // Options: Modern, Classic, Minimalist, Elegant

  // --- NEW: College Selection ---
  const [selectedCollege, setSelectedCollege] = useState("None");

  // Load user data from localStorage (or use fallback demo data)
  // and create events while computing note sharing minutes as “leftover” points.
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      const uData = JSON.parse(localStorage.getItem("userInfo"));
      const sData = JSON.parse(localStorage.getItem("schoolInfo"));
      setUserData(uData);
      setSchoolData(sData);

      let events = [];
      // Process any breakdown events if they exist.
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

      console.log("Allocated Points:", allocatedPoints);

      // Leftover points for note sharing:
      const leftoverPoints = Math.max(uData.points / 200 - allocatedPoints, 0);
      console.log(uData.points);
      console.log("Leftover Points:", leftoverPoints);

      if (leftoverPoints > 0) {
        events.unshift({
          id: events.length + 1,
          category: "activity",
          message: "Sharing notes on NoteSwap",
          // Calculate minutes based on leftover points:
          minutes: Math.round(leftoverPoints / 20),
          organization: "NoteSwap",
          rewardedOn: new Date().toLocaleDateString("en-US"),
        });
      }

      // Add tutoring event if tutor_hours is provided.
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
      // Fallback demo data (for which breakdown events may not have point details)
      setUserData({
        first_name: "Jane",
        last_name: "Doe",
        createdAt: "2022-10-01",
        points: 40, // Total points earned
        tutor_hours: 120, // Tutoring hours earned
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
          points: 0, // No points allocated here
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

  // ------------------------------
  // MAGIC AI: Generate "perfect" summaries
  // ------------------------------
  const handleGenerateAllSummaries = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setShowConfetti(false);

    const finalItems = getFilteredItems();
    const total = finalItems.length;
    const newSummaries = {};

    for (let i = 0; i < total; i++) {
      const item = finalItems[i];
      // Simulate a delay to mimic an AI call
      await new Promise((res) => setTimeout(res, 500));

      // Get a college-optimized summary based on the selected college.
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

  // ------------------------------
  // DOCX, PDF, and TXT Generation Functions
  // ------------------------------
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

        // Sum up the minutes for all events.
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
          theme, // include theme if your docx template supports it
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
            // Send the certificate info for verification (integrity check)
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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("NoteSwap Magical Portfolio", 10, 10);

    doc.setFontSize(12);
    let yPos = 20;
    doc.text(`Name: ${userData?.first_name} ${userData?.last_name}`, 10, yPos);
    yPos += 6;
    doc.text(`School: ${schoolData?.schoolFullName}`, 10, yPos);
    yPos += 6;
    doc.text(`Theme: ${theme}`, 10, yPos);
    yPos += 10;

    const finalItems = getFilteredItems();
    finalItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.message} (${item.category})`, 10, yPos);
      yPos += 6;
      if (summaries[item.id]) {
        doc.text(`   CommonApp: ${summaries[item.id].commonApp}`, 10, yPos);
        yPos += 6;
        doc.text(`   Bullet: ${summaries[item.id].bullet}`, 10, yPos);
        yPos += 6;
        doc.text(`   Reflection: ${summaries[item.id].reflection}`, 10, yPos);
        yPos += 6;
      }
      yPos += 2;
    });
    const pdfBlob = doc.output("blob");
    saveAs(pdfBlob, "NoteSwap_Portfolio.pdf");
  };

  const generatePlainText = () => {
    let content = "NoteSwap Magical Portfolio\n\n";
    content += `Name: ${userData?.first_name} ${userData?.last_name}\n`;
    content += `School: ${schoolData?.schoolFullName}\n`;
    content += `Theme: ${theme}\n\n`;
    const finalItems = getFilteredItems();
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

  const handleDownload = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    if (format === "docx") generateDocx();
    else if (format === "pdf") generatePDF();
    else generatePlainText();
  };

  // --- Return the Modal with all the magical UI ---
  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Your Epic NoteSwap Portfolio Builder"
      small={false}
    >
      <Confetti show={showConfetti} />

      <div style={styles.container}>
        <p style={styles.description}>
          Welcome to your magical portfolio builder. Toggle which categories to
          include, pick a design theme, generate perfect Common App summaries,
          and download your portfolio in multiple formats.
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

        {/* NEW: College Selection Dropdown */}
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
          style={styles.generateButton}
          onClick={handleGenerateAllSummaries}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating Summaries..." : "Generate All Summaries"}
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
        <div style={styles.portfolioPreview}>
          {getFilteredItems().map((item) => (
            <div
              key={item.id}
              style={{ ...styles.itemCard, ...getThemeCardStyles(theme) }}
            >
              <div style={styles.itemHeader}>
                <strong>{item.message}</strong>
                <em style={styles.itemCategory}>({item.category})</em>
              </div>
              <div style={styles.itemMeta}>
                <span>Minutes: {item.minutes}</span>
                <span>Org: {item.organization}</span>
                <span>Date: {item.rewardedOn}</span>
              </div>
              {summaries[item.id] && (
                <div style={styles.summarySection}>
                  <p style={{ fontWeight: "bold", marginBottom: 4 }}>
                    Common App Summary:
                  </p>
                  <p>{summaries[item.id].commonApp}</p>
                  <p style={{ fontWeight: "bold", margin: "8px 0 4px 0" }}>
                    Bullet Point:
                  </p>
                  <p>{summaries[item.id].bullet}</p>
                  <p style={{ fontWeight: "bold", margin: "8px 0 4px 0" }}>
                    Reflective Paragraph:
                  </p>
                  <p>{summaries[item.id].reflection}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Download Button */}
        <button style={styles.downloadButton} onClick={handleDownload}>
          Download Portfolio
        </button>
      </div>
    </Modal>
  );
};

export default MagicalTranscriptModal;

// -------------------------------
// Base Styles & Theme Overrides
// -------------------------------
const styles = {
  container: {
    width: "100%",
    minHeight: "400px",
    padding: "1rem",
    position: "relative",
  },
  description: {
    marginBottom: "1rem",
    fontSize: "1rem",
  },
  toggles: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  generateButton: {
    padding: "8px 14px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 600,
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
  },
  select: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  portfolioPreview: {
    marginTop: "1rem",
    maxHeight: "250px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "8px",
  },
  itemCard: {
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "8px",
    marginBottom: "8px",
    backgroundColor: "#fff",
  },
  itemHeader: {
    display: "flex",
    gap: "8px",
    alignItems: "baseline",
    marginBottom: "4px",
  },
  itemCategory: {
    color: "#888",
    fontSize: "0.85rem",
  },
  itemMeta: {
    display: "flex",
    gap: "1rem",
    fontSize: "0.85rem",
    color: "#666",
    marginBottom: "6px",
  },
  summarySection: {
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    padding: "8px",
    marginTop: "6px",
  },
  downloadButton: {
    marginTop: "1.5rem",
    padding: "10px 16px",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 600,
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

function getThemeCardStyles(theme) {
  switch (theme) {
    case "Classic":
      return {
        backgroundColor: "#fdf6e3",
        borderColor: "#b58900",
        fontFamily: "'Times New Roman', serif",
      };
    case "Minimalist":
      return {
        backgroundColor: "#ffffff",
        borderColor: "#ddd",
        fontFamily: "Arial, sans-serif",
      };
    case "Elegant":
      return {
        backgroundColor: "#f7f1e1",
        borderColor: "#8e806a",
        fontFamily: "'Georgia', serif",
      };
    case "Modern":
    default:
      return {
        backgroundColor: "#e8f0fe",
        borderColor: "#4285f4",
        fontFamily: "Roboto, sans-serif",
      };
  }
}
