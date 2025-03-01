import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import LoadingCircle from "../components/Extra/LoadingCircle";
import styles from "../styles/RewardCS.module.css";

// Import chart components and required Chart.js modules
import { Pie, Line, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js/auto";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

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

  // State for editing breakdown tasks
  const [editingTasks, setEditingTasks] = useState({});

  // Check viewport size for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch students from your API
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

  // On mount, load user info and fetch data
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

  // Utility: Format messages for downloads
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

  // Download functions
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

  // Input handling for rewards
  const handleInputChange = (studentId, field, value) => {
    setRewardInputs((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

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
        setRewardStatus((prev) => ({
          ...prev,
          [studentId]: "Successfully rewarded community service",
        }));
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

  // Functions for editing/removing breakdown items
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
      [key]: { ...prev[key], [field]: value },
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
        body: JSON.stringify({ studentId, taskIndex: index }),
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

  const toggleMobileCard = (studentId) => {
    setMobileCardOpen((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  // Filter and sort student list
  const filteredStudents = students.filter((student) =>
    (student.first_name + " " + student.last_name)
      .toLowerCase()
      .includes(search)
  );
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const totalA = Math.floor(a.points / 20) + Math.floor(a.tutor_hours / 60);
    const totalB = Math.floor(b.points / 20) + Math.floor(b.tutor_hours / 60);
    if (sortOption === "nameAsc")
      return a.first_name.localeCompare(b.first_name);
    if (sortOption === "nameDesc")
      return b.first_name.localeCompare(a.first_name);
    if (sortOption === "minutesAsc") return totalA - totalB;
    if (sortOption === "minutesDesc") return totalB - totalA;
    return 0;
  });

  const renderBreakdownList = (student) => (
    <ul className={styles.beautifulBreakdownList}>
      {student.breakdown &&
        student.breakdown.map((entry, index) => {
          const key = `${student._id}_${index}`;
          if (editingTasks[key]) {
            return (
              <li key={key} className={styles.beautifulBreakdownItem}>
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
              <li key={key} className={styles.beautifulBreakdownItem}>
                <span>
                  {entry.message} ({entry.minutes} {t("minute")}
                  {entry.minutes === 1 ? "" : "s"})
                </span>
                <div className={styles.buttonGroup}>
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

  // ---------------- Advanced Analytics & Smart Insights ----------------

  // 1. Summary Statistics
  const computeSummaryStats = () => {
    let totalCommunityService = 0;
    let totalTutoring = 0;
    let totalTasks = 0;
    students.forEach((student) => {
      totalCommunityService += Math.floor(student.points / 20);
      totalTutoring += Math.floor(student.tutor_hours / 60);
      if (student.breakdown && student.breakdown.length > 0)
        totalTasks += student.breakdown.length;
    });
    const totalStudents = students.length;
    const totalMinutes = totalCommunityService + totalTutoring;
    const averageMinutes = totalStudents > 0 ? totalMinutes / totalStudents : 0;
    return { totalCommunityService, totalTutoring, totalTasks, averageMinutes };
  };
  const summaryStats = computeSummaryStats();

  // 2. Charts Data
  const pieData = {
    labels: [t("community_service"), t("tutoring")],
    datasets: [
      {
        data: [summaryStats.totalCommunityService, summaryStats.totalTutoring],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const getTasksByDate = () => {
    const tasksCount = {};
    students.forEach((student) => {
      if (student.breakdown && student.breakdown.length > 0) {
        student.breakdown.forEach((task) => {
          if (task.rewardedOn) {
            tasksCount[task.rewardedOn] =
              (tasksCount[task.rewardedOn] || 0) + 1;
          }
        });
      }
    });
    const sortedDates = Object.keys(tasksCount).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const data = sortedDates.map((date) => tasksCount[date]);
    return { labels: sortedDates, data };
  };
  const { labels: lineLabels, data: lineData } = getTasksByDate();
  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: t("tasks_over_time"),
        data: lineData,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  // 3. Risk Distribution (Doughnut Chart)
  const computeRiskDistribution = () => {
    const studentPerformances = students.map((student) => {
      const total =
        Math.floor(student.points / 20) + Math.floor(student.tutor_hours / 60);
      return {
        name:
          student.first_name.charAt(0).toUpperCase() +
          student.first_name.slice(1) +
          " " +
          student.last_name.charAt(0).toUpperCase() +
          student.last_name.slice(1),
        totalMinutes: total,
        cs: Math.floor(student.points / 20),
        tutoring: Math.floor(student.tutor_hours / 60),
      };
    });
    const totalArr = studentPerformances.map((s) => s.totalMinutes);
    const avgTotal =
      totalArr.reduce((sum, val) => sum + val, 0) / studentPerformances.length;
    const riskCategories = { high: 0, medium: 0, low: 0 };
    studentPerformances.forEach((s) => {
      if (s.totalMinutes < avgTotal) {
        const riskFactor = (avgTotal - s.totalMinutes) / avgTotal;
        if (riskFactor > 0.3) riskCategories.high++;
        else if (riskFactor > 0.15) riskCategories.medium++;
        else riskCategories.low++;
      } else {
        riskCategories.low++;
      }
    });
    return { studentPerformances, avgTotal, riskCategories };
  };
  const {
    studentPerformances,
    avgTotal: computedAvg,
    riskCategories,
  } = computeRiskDistribution();
  const doughnutData = {
    labels: ["High Risk", "Medium Risk", "Low Risk"],
    datasets: [
      {
        data: [riskCategories.high, riskCategories.medium, riskCategories.low],
        backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
      },
    ],
  };

  // 4. Radar Chart: Quartile Performance Comparison
  const computeRadarData = () => {
    const sorted = [...studentPerformances].sort(
      (a, b) => a.totalMinutes - b.totalMinutes
    );
    const n = sorted.length;
    const quartileSize = Math.floor(n / 4) || 1;
    const bottom = sorted.slice(0, quartileSize);
    const middle = sorted.slice(quartileSize, 3 * quartileSize);
    const top = sorted.slice(3 * quartileSize);
    const avgGroup = (group) => {
      let totalCS = 0;
      let totalTutoring = 0;
      group.forEach((s) => {
        totalCS += s.cs;
        totalTutoring += s.tutoring;
      });
      return {
        avgCS: group.length ? totalCS / group.length : 0,
        avgTutoring: group.length ? totalTutoring / group.length : 0,
      };
    };
    return {
      bottomAvg: avgGroup(bottom),
      middleAvg: avgGroup(middle),
      topAvg: avgGroup(top),
    };
  };
  const { bottomAvg, middleAvg, topAvg } = computeRadarData();
  const radarData = {
    labels: [t("community_service"), t("tutoring")],
    datasets: [
      {
        label: t("bottom_quartile"),
        data: [bottomAvg.avgCS, bottomAvg.avgTutoring],
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
      },
      {
        label: t("middle_quartile"),
        data: [middleAvg.avgCS, middleAvg.avgTutoring],
        backgroundColor: "rgba(54,162,235,0.2)",
        borderColor: "rgba(54,162,235,1)",
      },
      {
        label: t("top_quartile"),
        data: [topAvg.avgCS, topAvg.avgTutoring],
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  // 5. Engagement & Leaderboard Metrics
  const computeEngagementScores = () => {
    return students.map((student) => {
      const totalMinutes =
        Math.floor(student.points / 20) + Math.floor(student.tutor_hours / 60);
      const score = summaryStats.averageMinutes
        ? totalMinutes / summaryStats.averageMinutes
        : 0;
      return {
        name:
          student.first_name.charAt(0).toUpperCase() +
          student.first_name.slice(1) +
          " " +
          student.last_name.charAt(0).toUpperCase() +
          student.last_name.slice(1),
        totalMinutes,
        engagementScore: score,
      };
    });
  };
  const engagementScores = computeEngagementScores();
  const leaderboard = [...engagementScores].sort(
    (a, b) => b.engagementScore - a.engagementScore
  );
  const assignBadge = (rank, totalCount) => {
    if (rank < totalCount * 0.1) return "Gold";
    else if (rank < totalCount * 0.3) return "Silver";
    else return "Bronze";
  };

  // 6. Smart AI Insights
  const generateSmartInsights = () => {
    const insights = [];
    if (riskCategories.high > 0) {
      insights.push(
        `${riskCategories.high} ${t("students_at_high_risk")}. ${t(
          "consider_intervention"
        )}`
      );
    } else {
      insights.push(t("no_high_risk_students"));
    }
    insights.push(
      `${t("avg_total_minutes")}: ${computedAvg.toFixed(1)}. ${t(
        "review_below_avg"
      )}`
    );
    const topStudent = studentPerformances.sort(
      (a, b) => b.totalMinutes - a.totalMinutes
    )[0];
    if (topStudent)
      insights.push(
        `${t("top_performer")}: ${topStudent.name} (${
          topStudent.totalMinutes
        } ${t("minute")}).`
      );
    return insights;
  };
  const smartInsights = generateSmartInsights();

  // --------------------- RENDERING ---------------------
  return (
    <>
      <Head>
        <title>{t("reward_cs_full")} | NoteSwap</title>
      </Head>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" />
      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t("students_list")}</h1>
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
            {/* --- Beautiful Smart AI Dashboard --- */}
            {students.length > 0 && (
              <section className={styles.beautifulDashboard}>
                <h2 className={styles.dashboardTitle}>
                  {t("analytics_dashboard")}
                </h2>
                {/* Beautiful Summary Cards */}
                <div className={styles.summaryCards}>
                  <div className={styles.summaryCard}>
                    <h3>{t("total_community_service")}</h3>
                    <p>
                      {summaryStats.totalCommunityService}{" "}
                      {t("minute", {
                        count: summaryStats.totalCommunityService,
                      })}
                    </p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>{t("total_tutoring")}</h3>
                    <p>
                      {summaryStats.totalTutoring}{" "}
                      {t("minute", { count: summaryStats.totalTutoring })}
                    </p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>{t("total_tasks")}</h3>
                    <p>{summaryStats.totalTasks}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>{t("average_minutes_per_student")}</h3>
                    <p>{summaryStats.averageMinutes.toFixed(2)}</p>
                  </div>
                </div>
                {/* Smart AI Insights */}
                <div className={styles.smartInsights}>
                  <h3>{t("smart_ai_insights")}</h3>
                  <ul>
                    {smartInsights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
                {/* Beautiful Charts Grid */}
                <div className={styles.chartsGrid}>
                  <div className={styles.chartContainer}>
                    <h3>{t("service_vs_tutoring")}</h3>
                    <Pie data={pieData} />
                  </div>
                  <div className={styles.chartContainer}>
                    <h3>{t("tasks_over_time")}</h3>
                    <Line data={lineChartData} />
                  </div>
                  <div className={styles.chartContainer}>
                    <h3>{t("risk_distribution")}</h3>
                    <Doughnut data={doughnutData} />
                  </div>
                  <div className={styles.chartContainer}>
                    <h3>{t("performance_comparison")}</h3>
                    <Radar data={radarData} />
                  </div>
                </div>
                {/* Engagement Leaderboard */}
                <div className={styles.leaderboardSection}>
                  <h3>{t("engagement_leaderboard")}</h3>
                  <table className={styles.leaderboardTable}>
                    <thead>
                      <tr>
                        <th>{t("rank")}</th>
                        <th>{t("student_name")}</th>
                        <th>{t("total_minutes")}</th>
                        <th>{t("engagement_score")}</th>
                        <th>{t("badge")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((student, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{student.name}</td>
                          <td>{student.totalMinutes}</td>
                          <td>{student.engagementScore.toFixed(2)}</td>
                          <td>{assignBadge(idx, leaderboard.length)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Student Insights (At-Risk & Top Performers) */}
                <div className={styles.insightsSection}>
                  <div className={styles.insightCard}>
                    <h3>{t("students_needing_help")}</h3>
                    {studentPerformances.filter(
                      (s) => s.totalMinutes < summaryStats.averageMinutes
                    ).length > 0 ? (
                      <ul>
                        {studentPerformances
                          .filter(
                            (s) => s.totalMinutes < summaryStats.averageMinutes
                          )
                          .sort((a, b) => a.totalMinutes - b.totalMinutes)
                          .slice(0, 5)
                          .map((s, idx) => (
                            <li key={idx}>
                              {s.name} - {s.totalMinutes} {t("minute")}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p>{t("no_at_risk_students")}</p>
                    )}
                  </div>
                  <div className={styles.insightCard}>
                    <h3>{t("top_performers")}</h3>
                    {studentPerformances.filter(
                      (s) => s.totalMinutes >= summaryStats.averageMinutes
                    ).length > 0 ? (
                      <ul>
                        {studentPerformances
                          .filter(
                            (s) => s.totalMinutes >= summaryStats.averageMinutes
                          )
                          .sort((a, b) => b.totalMinutes - a.totalMinutes)
                          .slice(0, 5)
                          .map((s, idx) => (
                            <li key={idx}>
                              {s.name} - {s.totalMinutes} {t("minute")}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p>{t("no_top_performers")}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

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
                  {t("sort_by")}:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="nameAsc">{t("name_ascending")}</option>
                  <option value="nameDesc">{t("name_descending")}</option>
                  <option value="minutesAsc">{t("minutes_ascending")}</option>
                  <option value="minutesDesc">{t("minutes_descending")}</option>
                </select>
              </div>
            </div>

            {/* Student List */}
            {isMobile ? (
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
                            ? t("hide_details")
                            : t("show_details")}
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

export default RewardCommunityService;
