import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import LoadingCircle from "../components/Extra/LoadingCircle";
import { requireAuthenticationTeacher } from "../middleware/teacher";
import styles from "../styles/RewardCS.module.css";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const RewardCommunityService = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  // Primary state declarations
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [rewardInputs, setRewardInputs] = useState({});
  const [rewardStatus, setRewardStatus] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [mobileCardOpen, setMobileCardOpen] = useState({});
  const [sortOption, setSortOption] = useState("nameAsc");

  // New state for editing individual breakdown tasks
  const [editingTasks, setEditingTasks] = useState({});

  // Check viewport size for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Modified fetchStudents: accepts schoolId parameter.
  const fetchStudents = async (schoolId) => {
    try {
      const res = await fetch("/api/schools/get_cs_for_students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: schoolId }),
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
      } else {
        setError(t("error"));
      }
    } catch (err) {
      console.error(err);
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  // On mount, wait until window and localStorage are ready.
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userInfoRaw = localStorage.getItem("userInfo");
        if (!userInfoRaw) {
          setError(t("user_info_missing"));
          setLoading(false);
          return;
        }
        const userInfo = JSON.parse(userInfoRaw);
        if (!userInfo || !userInfo.schoolId) {
          setError(t("user_info_invalid"));
          setLoading(false);
          return;
        }
        fetchStudents(userInfo.schoolId);
      } catch (err) {
        console.error("Error reading userInfo from localStorage:", err);
        setError(t("error"));
        setLoading(false);
      }
    }
  }, [t]);

  // Format the breakdown messages (for downloads)
  const formatMessagesWithMinutes = (points, tutor_hours, messagesArray) => {
    let formattedMessages = "";
    if (points !== 0) {
      const minutes = Math.floor(points / 20);
      formattedMessages += `${minutes} ${t("minute")}${
        minutes === 1 ? "" : "s"
      } ${t("typing_and_sharing")}\n`;
    }
    if (tutor_hours !== 0) {
      const minutes = Math.floor(tutor_hours / 60);
      formattedMessages += `${minutes} ${t("minute")}${
        minutes === 1 ? "" : "s"
      } ${t("tutoring_other")}\n`;
    }
    if (messagesArray) {
      messagesArray.forEach((obj) => {
        if (obj.message && obj.minutes !== undefined) {
          formattedMessages += `${obj.minutes} ${t("minute")}${
            obj.minutes === 1 ? "" : "s"
          } ${t("for")} ${obj.message}\n`;
        }
      });
    }
    return formattedMessages;
  };

  // Download as Excel
  const downloadDataAsExcel = async () => {
    if (!students.length) return;
    const modifiedData = students.map((item) => {
      const fixed_first_name =
        item.first_name.charAt(0).toUpperCase() + item.first_name.slice(1);
      const fixed_last_name =
        item.last_name.charAt(0).toUpperCase() + item.last_name.slice(1);
      const totalPoints =
        Math.floor(item.points / 20) + Math.floor(item.tutor_hours / 60);
      const full_breakdown = formatMessagesWithMinutes(
        item.points,
        item.tutor_hours,
        item.breakdown
      );
      return {
        fixed_first_name,
        fixed_last_name,
        totalPoints: `${totalPoints} ${t("minute")}${
          totalPoints === 1 ? "" : "s"
        }`,
        full_breakdown,
      };
    });
    const headers = [
      t("student_first_name"),
      t("student_last_name"),
      t("total_cs_earned"),
      t("breakdown_cs"),
    ];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...modifiedData.map((item) => Object.values(item)),
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "_CS");
    XLSX.writeFile(workbook, "_CS.xlsx");
  };

  // Download as CSV
  const downloadDataAsCSV = async () => {
    if (!students.length) return;
    const modifiedData = students.map((item) => {
      const totalPoints =
        Math.floor(item.points / 20) + Math.floor(item.tutor_hours / 60);
      const full_breakdown = formatMessagesWithMinutes(
        item.points,
        item.tutor_hours,
        item.breakdown
      );
      return {
        first_name: item.first_name,
        last_name: item.last_name,
        totalPoints,
        full_breakdown,
      };
    });
    const headers = [
      t("student_first_name"),
      t("student_last_name"),
      t("total_cs_earned"),
      t("breakdown_cs"),
    ];
    const rows = modifiedData.map((item) => [
      item.first_name,
      item.last_name,
      item.totalPoints,
      item.full_breakdown,
    ]);
    const csvContent =
      headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "_CS.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open("data:text/csv;charset=utf-8," + escape(csvContent));
    }
  };

  // Handle input changes for adding new community service reward
  const handleInputChange = (studentId, field, value) => {
    setRewardInputs((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  // Submit new community service reward
  const handleRewardSubmit = async (e, student) => {
    e.preventDefault();
    const studentId = student._id;
    const input = rewardInputs[studentId];
    if (!input || !input.task || !input.minutes) {
      setRewardStatus((prev) => ({
        ...prev,
        [studentId]: t("please_fill_all_fields"),
      }));
      return;
    }
    try {
      const minutesValue = parseInt(input.minutes);
      const res = await fetch("/api/profile/add_community_minutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: studentId, points: minutesValue * 20 }),
      });
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      await fetch("/api/profile/add_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: studentId,
          task: {
            message: input.task,
            minutes: minutesValue,
            rewardedOn: formattedDate,
            organization: `${
              JSON.parse(localStorage.getItem("userInfo")).first_name
            } ${JSON.parse(localStorage.getItem("userInfo")).last_name}`,
          },
        }),
      });
      if (res.ok) {
        setRewardStatus((prev) => ({ ...prev, [studentId]: t("success") }));
        setRewardInputs((prev) => ({
          ...prev,
          [studentId]: { task: "", minutes: "" },
        }));
        fetchStudents(JSON.parse(localStorage.getItem("userInfo")).schoolId);
      } else {
        setRewardStatus((prev) => ({
          ...prev,
          [studentId]: t("error_occurred"),
        }));
      }
    } catch (error) {
      setRewardStatus((prev) => ({
        ...prev,
        [student._id]: t("error_occurred"),
      }));
    }
  };

  // --- New Functions for Editing & Removing Breakdown Items ---
  const startEditingTask = (studentId, index, currentTask) => {
    const key = `${studentId}_${index}`;
    setEditingTasks((prev) => ({
      ...prev,
      [key]: { message: currentTask.message, minutes: currentTask.minutes },
    }));
  };

  const handleEditChange = (studentId, index, field, value) => {
    const key = `${studentId}_${index}`;
    setEditingTasks((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const saveEditedTask = async (studentId, index) => {
    const key = `${studentId}_${index}`;
    const edited = editingTasks[key];
    try {
      const res = await fetch("/api/profile/edit_community_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          taskIndex: index,
          newMessage: edited.message,
          newMinutes: parseInt(edited.minutes),
        }),
      });
      if (res.ok) {
        setEditingTasks((prev) => {
          const newObj = { ...prev };
          delete newObj[key];
          return newObj;
        });
        fetchStudents(JSON.parse(localStorage.getItem("userInfo")).schoolId);
      } else {
        alert(t("error_occurred"));
      }
    } catch (error) {
      alert(t("error_occurred"));
    }
  };

  const cancelEditingTask = (studentId, index) => {
    const key = `${studentId}_${index}`;
    setEditingTasks((prev) => {
      const newObj = { ...prev };
      delete newObj[key];
      return newObj;
    });
  };

  const removeTask = async (studentId, index) => {
    try {
      const res = await fetch("/api/profile/remove_community_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          taskIndex: index,
        }),
      });
      if (res.ok) {
        fetchStudents(JSON.parse(localStorage.getItem("userInfo")).schoolId);
      } else {
        alert(t("error_occurred"));
      }
    } catch (error) {
      alert(t("error_occurred"));
    }
  };

  // Toggle mobile card details
  const toggleMobileCard = (studentId) => {
    setMobileCardOpen((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  // Filter students by full name (first + last) based on search input
  const filteredStudents = students.filter((student) =>
    (student.first_name + " " + student.last_name)
      .toLowerCase()
      .includes(search)
  );

  // Sort filtered students based on sortOption
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const totalA = Math.floor(a.points / 20) + Math.floor(a.tutor_hours / 60);
    const totalB = Math.floor(b.points / 20) + Math.floor(b.tutor_hours / 60);
    if (sortOption === "nameAsc") {
      return a.first_name.localeCompare(b.first_name);
    } else if (sortOption === "nameDesc") {
      return b.first_name.localeCompare(a.first_name);
    } else if (sortOption === "minutesAsc") {
      return totalA - totalB;
    } else if (sortOption === "minutesDesc") {
      return totalB - totalA;
    }
    return 0;
  });

  // Helper: Render breakdown list for a student (used in both desktop and mobile)
  const renderBreakdownList = (student) => (
    <ul className={styles.breakdownList}>
      {student.breakdown &&
        student.breakdown.map((entry, index) => {
          const key = `${student._id}_${index}`;
          if (editingTasks[key]) {
            return (
              <li key={key}>
                <input
                  type="text"
                  value={editingTasks[key].message}
                  onChange={(e) =>
                    handleEditChange(
                      student._id,
                      index,
                      "message",
                      e.target.value
                    )
                  }
                  className={styles.editInput}
                />
                <input
                  type="number"
                  value={editingTasks[key].minutes}
                  onChange={(e) =>
                    handleEditChange(
                      student._id,
                      index,
                      "minutes",
                      e.target.value
                    )
                  }
                  className={styles.editInput}
                />
                <button
                  onClick={() => saveEditedTask(student._id, index)}
                  className={styles.saveButton}
                >
                  Save
                </button>
                <button
                  onClick={() => cancelEditingTask(student._id, index)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </li>
            );
          } else {
            return (
              <li
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between", // Ensures text is on the left, buttons on the right
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <span>
                  {entry.message} ({entry.minutes} {t("minute")}
                  {entry.minutes === 1 ? "" : "s"})
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {" "}
                  {/* Buttons container */}
                  <button
                    onClick={() => startEditingTask(student._id, index, entry)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeTask(student._id, index)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          }
        })}
    </ul>
  );

  return (
    <>
      <Head>
        <title>{t("reward_cs_full")} | NoteSwap</title>
      </Head>
      {/* Load XLSX library for file downloads */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" />

      <section className={styles.container}>
        <header className={styles.header}>
          <h1>{t("students_list")}</h1>
        </header>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <LoadingCircle />
          </div>
        ) : error ? (
          <div className={styles.errorWrapper}>
            <p className={styles.error}>{error}</p>
          </div>
        ) : (
          <>
            {/* Controls, Downloads & Sorting */}
            <div className={styles.controls}>
              <div className={styles.leftControls}>
                <p className={styles.downloadText}>{t("download_cs_as")}</p>
                <div className={styles.buttonGroup}>
                  <button
                    onClick={downloadDataAsExcel}
                    className={styles.downloadButton}
                  >
                    Excel
                  </button>
                  <button
                    onClick={downloadDataAsCSV}
                    className={styles.downloadButton}
                  >
                    CSV
                  </button>
                </div>
              </div>
              <div className={styles.rightControls}>
                <label htmlFor="sort" className={styles.sortLabel}>
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="nameAsc">Name Ascending</option>
                  <option value="nameDesc">Name Descending</option>
                  <option value="minutesAsc">Minutes Ascending</option>
                  <option value="minutesDesc">Minutes Descending</option>
                </select>
              </div>
            </div>

            {/* Search */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                className={styles.searchInput}
              />
            </div>

            {isMobile ? (
              // MOBILE CARD LAYOUT
              <div className={styles.cardContainer}>
                {sortedStudents.map((student) => {
                  const totalMinutes =
                    Math.floor(student.points / 20) +
                    Math.floor(student.tutor_hours / 60);
                  return (
                    <div key={student._id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                          <span className={styles.studentName}>
                            {student.first_name.charAt(0).toUpperCase() +
                              student.first_name.slice(1)}{" "}
                            {student.last_name.charAt(0).toUpperCase() +
                              student.last_name.slice(1)}
                          </span>
                          <span className={styles.totalMinutes}>
                            {totalMinutes} {t("minute")}
                            {totalMinutes === 1 ? "" : "s"}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleMobileCard(student._id)}
                          className={styles.cardToggleButton}
                        >
                          {mobileCardOpen[student._id]
                            ? "Hide details"
                            : "Show details"}
                        </button>
                      </div>
                      {mobileCardOpen[student._id] && (
                        <div className={styles.cardContent}>
                          {renderBreakdownList(student)}
                          <form
                            onSubmit={(e) => handleRewardSubmit(e, student)}
                            className={styles.rewardForm}
                          >
                            <input
                              type="text"
                              placeholder={t("enter_task_name")}
                              value={rewardInputs[student._id]?.task || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  student._id,
                                  "task",
                                  e.target.value
                                )
                              }
                              className={styles.inputTask}
                              required
                            />
                            <input
                              type="number"
                              min="1"
                              max="10000"
                              placeholder={t("enter_amount_in_min")}
                              value={rewardInputs[student._id]?.minutes || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  student._id,
                                  "minutes",
                                  e.target.value
                                )
                              }
                              className={styles.inputMinutes}
                              required
                            />
                            <button
                              type="submit"
                              className={styles.rewardButton}
                            >
                              {t("reward")}
                            </button>
                          </form>
                          {rewardStatus[student._id] && (
                            <p className={styles.rewardStatus}>
                              {rewardStatus[student._id]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // DESKTOP TABLE LAYOUT
              <div className={styles.tableWrapper}>
                <table className={styles.styledTable}>
                  <thead>
                    <tr>
                      <th>{t("students_name")}</th>
                      <th>{t("total_cs_earned")}</th>
                      <th>{t("reward_cs_in_min")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((student) => {
                      const totalMinutes =
                        Math.floor(student.points / 20) +
                        Math.floor(student.tutor_hours / 60);
                      return (
                        <tr key={student._id}>
                          <td className={styles.studentName}>
                            <strong>
                              {student.first_name.charAt(0).toUpperCase() +
                                student.first_name.slice(1)}{" "}
                              {student.last_name.charAt(0).toUpperCase() +
                                student.last_name.slice(1)}
                            </strong>
                            {renderBreakdownList(student)}
                          </td>
                          <td>
                            <p>
                              {totalMinutes} {t("minute")}
                              {totalMinutes === 1 ? "" : "s"}
                            </p>
                          </td>
                          <td>
                            <form
                              onSubmit={(e) => handleRewardSubmit(e, student)}
                              className={styles.rewardForm}
                            >
                              <div className={styles.inputGroup}>
                                <input
                                  type="text"
                                  placeholder={t("enter_task_name")}
                                  value={rewardInputs[student._id]?.task || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      student._id,
                                      "task",
                                      e.target.value
                                    )
                                  }
                                  className={styles.inputTask}
                                  required
                                />
                                <input
                                  type="number"
                                  min="1"
                                  max="10000"
                                  placeholder={t("enter_amount_in_min")}
                                  value={
                                    rewardInputs[student._id]?.minutes || ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      student._id,
                                      "minutes",
                                      e.target.value
                                    )
                                  }
                                  className={styles.inputMinutes}
                                  required
                                />
                              </div>
                              <button
                                type="submit"
                                className={styles.rewardButton}
                              >
                                {t("reward")}
                              </button>
                            </form>
                            {rewardStatus[student._id] && (
                              <p className={styles.rewardStatus}>
                                {rewardStatus[student._id]}
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default requireAuthenticationTeacher(RewardCommunityService);
