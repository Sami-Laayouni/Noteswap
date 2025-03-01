// pages/demo-analytics.js
import Head from "next/head";
import { useState, useEffect } from "react";
import { Pie, Line, Doughnut, Radar, Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from "chart.js/auto";
import styles from "../styles/DemoAnalytics.module.css";

// ----------------------
// Hard-Coded Demo Analytics Data
// ----------------------
const demoAnalyticsData = {
  // Detailed per–student data (added new "notes" properties)
  students: [
    {
      id: 1,
      firstName: "Alice",
      lastName: "Smith",
      communityService: {
        totalMinutes: 120,
        events: 3,
        categories: { Environmental: 2, Social: 1, Educational: 0 },
        qualityRating: 4.2,
        participationRate: "80%",
        monthlyTrends: [20, 30, 25, 15, 20, 10],
      },
      tutoring: {
        totalMinutes: 90,
        sessions: 4,
        effectiveness: 85,
        qualityRating: 4.5,
        improvementTrend: "Increasing",
        baselineComparisons: {
          previousTotalMinutes: 80,
          improvementPercentage: 12.5,
        },
      },
      opportunities: {
        applied: 2,
        offered: 3,
        categories: { Internship: 1, Volunteer: 1, Leadership: 1, Research: 0 },
        conversionRate: "66%",
      },
      intern: { active: false, rating: null },
      leadership: { positions: 1, rating: 3.5 },
      extracurricular: {
        clubs: 2,
        sports: 1,
        arts: 0,
        hours: { clubs: 10, sports: 5, arts: 0 },
        involvementQuality: 4.0,
        activityTrends: [2, 2, 3, 2, 1],
      },
      research: { projects: 1, outputs: 0, qualityRating: 4.0 },
      engagement: {
        score: 1.2,
        attendanceRate: "95%",
        eventParticipation: "High",
        satisfaction: 4.3,
      },
      digitalUsage: {
        onlineClassAttendance: "90%",
        assignmentSubmissionRate: "98%",
        libraryCheckouts: 5,
        computerLabUsage: "70%",
      },
      demographics: {
        gradeLevel: "10",
        gender: "Female",
        ethnicity: "Hispanic",
      },
      notes: {
        shared: 12,
        communityServiceEarned: 15,
        cited: 7,
        visited: 30,
        comments: 4,
        perSubject: { Math: 3, Science: 2, English: 5, History: 1 },
      },
    },
    {
      id: 2,
      firstName: "Bob",
      lastName: "Johnson",
      communityService: {
        totalMinutes: 240,
        events: 4,
        categories: { Social: 2, Environmental: 2, Educational: 0 },
        qualityRating: 3.9,
        participationRate: "90%",
        monthlyTrends: [40, 50, 30, 20, 25, 25],
      },
      tutoring: {
        totalMinutes: 120,
        sessions: 5,
        effectiveness: 90,
        qualityRating: 4.7,
        improvementTrend: "Stable",
        baselineComparisons: {
          previousTotalMinutes: 110,
          improvementPercentage: 9.1,
        },
      },
      opportunities: {
        applied: 3,
        offered: 3,
        categories: { Internship: 1, Volunteer: 2, Leadership: 0, Research: 1 },
        conversionRate: "100%",
      },
      intern: { active: true, rating: 4.5 },
      leadership: { positions: 2, rating: 4.0 },
      extracurricular: {
        clubs: 3,
        sports: 2,
        arts: 1,
        hours: { clubs: 12, sports: 8, arts: 3 },
        involvementQuality: 4.2,
        activityTrends: [3, 3, 3, 4, 3],
      },
      research: { projects: 2, outputs: 1, qualityRating: 4.2 },
      engagement: {
        score: 1.8,
        attendanceRate: "97%",
        eventParticipation: "Very High",
        satisfaction: 4.7,
      },
      digitalUsage: {
        onlineClassAttendance: "92%",
        assignmentSubmissionRate: "99%",
        libraryCheckouts: 8,
        computerLabUsage: "75%",
      },
      demographics: {
        gradeLevel: "11",
        gender: "Male",
        ethnicity: "Caucasian",
      },
      notes: {
        shared: 8,
        communityServiceEarned: 10,
        cited: 5,
        visited: 25,
        comments: 6,
        perSubject: { Math: 2, Science: 3, English: 4, History: 2 },
      },
    },
    {
      id: 3,
      firstName: "Carol",
      lastName: "Williams",
      communityService: {
        totalMinutes: 180,
        events: 3,
        categories: { Educational: 3, Social: 0, Environmental: 0 },
        qualityRating: 4.8,
        participationRate: "85%",
        monthlyTrends: [30, 20, 40, 25, 35, 30],
      },
      tutoring: {
        totalMinutes: 150,
        sessions: 6,
        effectiveness: 95,
        qualityRating: 4.9,
        improvementTrend: "Increasing",
        baselineComparisons: {
          previousTotalMinutes: 140,
          improvementPercentage: 7.1,
        },
      },
      opportunities: {
        applied: 1,
        offered: 2,
        categories: { Volunteer: 1, Leadership: 1, Internship: 0, Research: 0 },
        conversionRate: "50%",
      },
      intern: { active: false, rating: null },
      leadership: { positions: 1, rating: 4.2 },
      extracurricular: {
        clubs: 1,
        sports: 0,
        arts: 2,
        hours: { clubs: 5, sports: 2, arts: 4 },
        involvementQuality: 4.5,
        activityTrends: [1, 2, 2, 2, 1],
      },
      research: { projects: 1, outputs: 0, qualityRating: 4.5 },
      engagement: {
        score: 1.5,
        attendanceRate: "93%",
        eventParticipation: "Medium",
        satisfaction: 4.0,
      },
      digitalUsage: {
        onlineClassAttendance: "88%",
        assignmentSubmissionRate: "97%",
        libraryCheckouts: 4,
        computerLabUsage: "65%",
      },
      demographics: {
        gradeLevel: "10",
        gender: "Female",
        ethnicity: "African American",
      },
      notes: {
        shared: 15,
        communityServiceEarned: 20,
        cited: 10,
        visited: 40,
        comments: 8,
        perSubject: { Math: 4, Science: 4, English: 3, History: 3 },
      },
    },
    {
      id: 4,
      firstName: "David",
      lastName: "Brown",
      communityService: {
        totalMinutes: 90,
        events: 1,
        categories: { Social: 1, Environmental: 0, Educational: 0 },
        qualityRating: 3.0,
        participationRate: "60%",
        monthlyTrends: [15, 10, 20, 15, 10, 10],
      },
      tutoring: {
        totalMinutes: 60,
        sessions: 2,
        effectiveness: 70,
        qualityRating: 3.2,
        improvementTrend: "Decreasing",
        baselineComparisons: {
          previousTotalMinutes: 50,
          improvementPercentage: 20,
        },
      },
      opportunities: {
        applied: 0,
        offered: 1,
        categories: { Volunteer: 1, Leadership: 0, Internship: 0, Research: 0 },
        conversionRate: "0%",
      },
      intern: { active: false, rating: null },
      leadership: { positions: 0, rating: 2.8 },
      extracurricular: {
        clubs: 1,
        sports: 1,
        arts: 0,
        hours: { clubs: 4, sports: 6, arts: 0 },
        involvementQuality: 3.0,
        activityTrends: [1, 1, 1, 0, 1],
      },
      research: { projects: 0, outputs: 0, qualityRating: null },
      engagement: {
        score: 0.9,
        attendanceRate: "80%",
        eventParticipation: "Low",
        satisfaction: 3.2,
      },
      digitalUsage: {
        onlineClassAttendance: "85%",
        assignmentSubmissionRate: "90%",
        libraryCheckouts: 2,
        computerLabUsage: "50%",
      },
      demographics: {
        gradeLevel: "9",
        gender: "Male",
        ethnicity: "Asian",
      },
      notes: {
        shared: 5,
        communityServiceEarned: 8,
        cited: 2,
        visited: 15,
        comments: 3,
        perSubject: { Math: 1, Science: 2, English: 2, History: 1 },
      },
    },
    {
      id: 5,
      firstName: "Eve",
      lastName: "Davis",
      communityService: {
        totalMinutes: 300,
        events: 5,
        categories: { Environmental: 3, Social: 2, Educational: 0 },
        qualityRating: 4.5,
        participationRate: "95%",
        monthlyTrends: [50, 60, 40, 50, 40, 60],
      },
      tutoring: {
        totalMinutes: 180,
        sessions: 7,
        effectiveness: 88,
        qualityRating: 4.4,
        improvementTrend: "Stable",
        baselineComparisons: {
          previousTotalMinutes: 160,
          improvementPercentage: 12.5,
        },
      },
      opportunities: {
        applied: 4,
        offered: 5,
        categories: { Internship: 2, Leadership: 3, Volunteer: 0, Research: 1 },
        conversionRate: "80%",
      },
      intern: { active: true, rating: 4.8 },
      leadership: { positions: 3, rating: 4.7 },
      extracurricular: {
        clubs: 4,
        sports: 3,
        arts: 2,
        hours: { clubs: 15, sports: 10, arts: 5 },
        involvementQuality: 4.8,
        activityTrends: [4, 4, 5, 4, 4],
      },
      research: { projects: 3, outputs: 2, qualityRating: 4.6 },
      engagement: {
        score: 2.0,
        attendanceRate: "98%",
        eventParticipation: "Very High",
        satisfaction: 4.8,
      },
      digitalUsage: {
        onlineClassAttendance: "95%",
        assignmentSubmissionRate: "99%",
        libraryCheckouts: 10,
        computerLabUsage: "80%",
      },
      demographics: {
        gradeLevel: "12",
        gender: "Female",
        ethnicity: "Mixed",
      },
      notes: {
        shared: 20,
        communityServiceEarned: 25,
        cited: 12,
        visited: 50,
        comments: 10,
        perSubject: { Math: 5, Science: 6, English: 4, History: 3 },
      },
    },
  ],
  overall: {
    teacherStudentRatio: "1:20",
    scholarshipAwards: 5,
    fundingAllocation: "$100,000",
    opportunitiesTrend: [5, 8, 7, 10, 6, 9],
    riskDistribution: { high: 2, medium: 3, low: 10 },
    smartInsights: [
      "2 students are at high risk—consider targeted intervention.",
      "Tutoring effectiveness is trending upward at 88%.",
      "Community service quality ratings average 4.3.",
      "Extracurricular participation is robust across clubs and sports.",
      "Digital resource usage indicates strong online engagement.",
    ],
  },
  teacherMetrics: {
    teacherEffectivenessRatings: [4.2, 4.5, 3.9],
    professionalDevelopmentSessions: 3,
  },
};

// ---------------------------------------------------------------------
// NEW: Advanced “Never‐Before-Seen” Metrics Calculations & Helpers
// ---------------------------------------------------------------------

// (A) First, compute a normalization constant for community service
const maxCommunityService = Math.max(
  ...demoAnalyticsData.students.map((s) => s.communityService.totalMinutes)
);

// 1. Holistic Growth Index (HGI)
// Combines tutoring effectiveness, normalized community service minutes,
// extracurricular quality (scaled to 100), and online class attendance.
const computeHGI = (student) => {
  const tutoringEffectiveness = student.tutoring.effectiveness; // already percentage
  const csNormalized =
    (student.communityService.totalMinutes / maxCommunityService) * 100;
  const extracurricularScore = student.extracurricular.involvementQuality * 20; // assuming max 5 rating
  const digitalAttendance = parseFloat(
    student.digitalUsage.onlineClassAttendance
  );
  const HGI =
    0.25 * tutoringEffectiveness +
    0.25 * csNormalized +
    0.25 * extracurricularScore +
    0.25 * digitalAttendance;
  return Math.round(HGI);
};

// 2. Portfolio Completeness Ratio (PCR)
// Checks if key portfolio categories (community service, tutoring, extracurricular,
// research, leadership, opportunities, and notes) have at least some activity.
const computePCR = (student) => {
  const requiredCategories = 7;
  let completed = 0;
  if (student.communityService.totalMinutes > 0) completed++;
  if (student.tutoring.totalMinutes > 0) completed++;
  if (
    student.extracurricular.clubs +
      student.extracurricular.sports +
      student.extracurricular.arts >
    0
  )
    completed++;
  if (student.research.projects > 0) completed++;
  if (student.leadership.positions > 0) completed++;
  if (student.opportunities.applied > 0) completed++;
  if (student.notes.shared > 0) completed++;
  return Math.round((completed / requiredCategories) * 100);
};

// 3. Opportunity Conversion Rate (OCR)
// (For demo purposes, we calculate as applied/offered if offered > 0)
const computeOCR = (student) => {
  const { applied, offered } = student.opportunities;
  return offered > 0 ? Math.round((applied / offered) * 100) : 0;
};

// 4. Tutor Efficacy Index (TEI)
// Average of tutoring improvement percentage and normalized quality rating.
const computeTEI = (student) => {
  const improvement =
    student.tutoring.baselineComparisons.improvementPercentage;
  const qualityNormalized = (student.tutoring.qualityRating / 5) * 100;
  return Math.round((improvement + qualityNormalized) / 2);
};

// 5. Subject Mastery Velocity (SMV)
// Uses notes-per-subject relative to tutoring sessions (scaled to 100).
const computeSMV = (student) => {
  const totalNotes = Object.values(student.notes.perSubject).reduce(
    (a, b) => a + b,
    0
  );
  return student.tutoring.sessions > 0
    ? Math.min(Math.round((totalNotes / student.tutoring.sessions) * 20), 100)
    : 0;
};

// 6. Peer Collaboration Quotient (PCQ)
// Sum of notes shared and cited, normalized by the maximum among all students.
const computePCQ = (student) => {
  const interactions = student.notes.shared + student.notes.cited;
  const maxInteractions = Math.max(
    ...demoAnalyticsData.students.map((s) => s.notes.shared + s.notes.cited)
  );
  return maxInteractions > 0
    ? Math.round((interactions / maxInteractions) * 100)
    : 0;
};

// 7. Extracurricular Synergy Score (ESS)
// For demo, we use the extracurricular involvement quality scaled to 100.
const computeESS = (student) => {
  return Math.min(
    Math.round(student.extracurricular.involvementQuality * 20),
    100
  );
};

// 8. Resource Utilization Impact (RUI)
// Average of digital usage metrics (attendance, assignment submission, computer lab usage).
const computeRUI = (student) => {
  const online = parseFloat(student.digitalUsage.onlineClassAttendance);
  const assignment = parseFloat(student.digitalUsage.assignmentSubmissionRate);
  const computerLab = parseFloat(student.digitalUsage.computerLabUsage);
  return Math.round((online + assignment + computerLab) / 3);
};

// 9. Engagement Consistency Index (ECI)
// Average of attendance rate and satisfaction (with satisfaction scaled to 100).
const computeECI = (student) => {
  const attendance = parseFloat(student.engagement.attendanceRate);
  const satisfaction = student.engagement.satisfaction * 20;
  return Math.round((attendance + satisfaction) / 2);
};

// 10. Predictive Common App Readiness Score (PCARS)
// A simple composite of portfolio completeness and key areas.
const computePCARS = (student) => {
  const pcr = computePCR(student);
  const leadershipScore = student.leadership.positions > 0 ? 20 : 0;
  const researchScore = student.research.projects > 0 ? 20 : 0;
  const notesScore = student.notes.shared > 0 ? 20 : 0;
  const tutoringScore = student.tutoring.totalMinutes > 0 ? 20 : 0;
  const extracurricularScore =
    student.extracurricular.clubs +
      student.extracurricular.sports +
      student.extracurricular.arts >
    0
      ? 20
      : 0;
  return Math.min(
    Math.round(
      (pcr +
        leadershipScore +
        researchScore +
        notesScore +
        tutoringScore +
        extracurricularScore) /
        6
    ),
    100
  );
};

// Prepare a computed metrics array for each student
const computedMetrics = demoAnalyticsData.students.map((student) => ({
  id: student.id,
  name: `${student.firstName} ${student.lastName}`,
  HGI: computeHGI(student),
  PCR: computePCR(student),
  OCR: computeOCR(student),
  TEI: computeTEI(student),
  SMV: computeSMV(student),
  PCQ: computePCQ(student),
  ESS: computeESS(student),
  RUI: computeRUI(student),
  ECI: computeECI(student),
  PCARS: computePCARS(student),
}));

// Compute average values for the radar chart
const averageMetrics = {
  HGI: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.HGI, 0) / computedMetrics.length
  ),
  PCR: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.PCR, 0) / computedMetrics.length
  ),
  OCR: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.OCR, 0) / computedMetrics.length
  ),
  TEI: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.TEI, 0) / computedMetrics.length
  ),
  SMV: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.SMV, 0) / computedMetrics.length
  ),
  PCQ: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.PCQ, 0) / computedMetrics.length
  ),
  ESS: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.ESS, 0) / computedMetrics.length
  ),
  RUI: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.RUI, 0) / computedMetrics.length
  ),
  ECI: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.ECI, 0) / computedMetrics.length
  ),
  PCARS: Math.round(
    computedMetrics.reduce((sum, m) => sum + m.PCARS, 0) /
      computedMetrics.length
  ),
};

// Data for the radar chart displaying average metrics
const metricsRadarData = {
  labels: [
    "HGI",
    "PCR",
    "OCR",
    "TEI",
    "SMV",
    "PCQ",
    "ESS",
    "RUI",
    "ECI",
    "PCARS",
  ],
  datasets: [
    {
      label: "Average Metrics",
      data: [
        averageMetrics.HGI,
        averageMetrics.PCR,
        averageMetrics.OCR,
        averageMetrics.TEI,
        averageMetrics.SMV,
        averageMetrics.PCQ,
        averageMetrics.ESS,
        averageMetrics.RUI,
        averageMetrics.ECI,
        averageMetrics.PCARS,
      ],
      backgroundColor: "rgba(255,206,86,0.2)",
      borderColor: "rgba(255,206,86,1)",
    },
  ],
};

// -------------------------------
// Existing Chart Data Computations (unchanged)
// -------------------------------

// (1) Community Service Categories (Pie)
const aggregateCSCategories = () => {
  const totals = {};
  demoAnalyticsData.students.forEach((s) => {
    Object.entries(s.communityService.categories).forEach(([cat, count]) => {
      totals[cat] = (totals[cat] || 0) + count;
    });
  });
  return totals;
};
const csTotals = aggregateCSCategories();
const csPieData = {
  labels: Object.keys(csTotals),
  datasets: [
    {
      data: Object.values(csTotals),
      backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#8BC34A"],
      hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#8BC34A"],
    },
  ],
};

// (2) Risk Distribution (Doughnut)
const riskDist = demoAnalyticsData.overall.riskDistribution;
const riskDoughnutData = {
  labels: ["High Risk", "Medium Risk", "Low Risk"],
  datasets: [
    {
      data: [riskDist.high, riskDist.medium, riskDist.low],
      backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
      hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
    },
  ],
};

// (3) Average Performance (Radar: Community Service, Tutoring, Opportunities Applied)
const averageCS =
  demoAnalyticsData.students.reduce(
    (sum, s) => sum + s.communityService.totalMinutes,
    0
  ) / demoAnalyticsData.students.length;
const averageTutoring =
  demoAnalyticsData.students.reduce(
    (sum, s) => sum + s.tutoring.totalMinutes,
    0
  ) / demoAnalyticsData.students.length;
const averageOpportunities =
  demoAnalyticsData.students.reduce(
    (sum, s) => sum + s.opportunities.applied,
    0
  ) / demoAnalyticsData.students.length;
const radarData = {
  labels: ["Community Service", "Tutoring", "Opportunities Applied"],
  datasets: [
    {
      label: "Average Metrics",
      data: [averageCS, averageTutoring, averageOpportunities],
      backgroundColor: "rgba(75,192,192,0.2)",
      borderColor: "rgba(75,192,192,1)",
    },
  ],
};

// (4) Monthly Community Service Trends (Line)
const aggregatedMonthlyServiceTrends = demoAnalyticsData.students.reduce(
  (acc, student) => {
    student.communityService.monthlyTrends.forEach((minutes, idx) => {
      acc[idx] = (acc[idx] || 0) + minutes;
    });
    return acc;
  },
  []
);
const monthlyServiceTrendsData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      label: "Total Community Service Minutes",
      data: aggregatedMonthlyServiceTrends,
      fill: false,
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.4)",
    },
  ],
};

// (5) Digital Engagement Comparison (Radar)
const avgOnlineClassAttendance =
  demoAnalyticsData.students.reduce(
    (sum, s) => sum + parseFloat(s.digitalUsage.onlineClassAttendance),
    0
  ) / demoAnalyticsData.students.length;
const avgAssignmentSubmissionRate =
  demoAnalyticsData.students.reduce(
    (sum, s) => sum + parseFloat(s.digitalUsage.assignmentSubmissionRate),
    0
  ) / demoAnalyticsData.students.length;
const avgLibraryCheckouts =
  demoAnalyticsData.students.reduce(
    (sum, s) => sum + s.digitalUsage.libraryCheckouts,
    0
  ) / demoAnalyticsData.students.length;
const avgComputerLabUsage =
  demoAnalyticsData.students.reduce(
    (sum, s) => sum + parseFloat(s.digitalUsage.computerLabUsage),
    0
  ) / demoAnalyticsData.students.length;
const digitalEngagementRadarData = {
  labels: [
    "Online Attendance",
    "Assignment Submission",
    "Library Checkouts",
    "Computer Lab Usage",
  ],
  datasets: [
    {
      label: "Average Digital Engagement",
      data: [
        avgOnlineClassAttendance,
        avgAssignmentSubmissionRate,
        avgLibraryCheckouts,
        avgComputerLabUsage,
      ],
      backgroundColor: "rgba(153,102,255,0.2)",
      borderColor: "rgba(153,102,255,1)",
    },
  ],
};

// (6) Leadership & Research Correlation (Scatter)
const leadershipResearchScatterData = {
  datasets: [
    {
      label: "Leadership vs Research Projects",
      data: demoAnalyticsData.students.map((s) => ({
        x: s.leadership.rating,
        y: s.research.projects,
      })),
      backgroundColor: "rgba(75,192,192,0.7)",
    },
  ],
};

// (7) Satisfaction vs Engagement (Bar)
const satisfactionEngagementData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Satisfaction",
      data: demoAnalyticsData.students.map((s) => s.engagement.satisfaction),
      backgroundColor: "rgba(255,99,132,0.7)",
    },
    {
      label: "Engagement Score",
      data: demoAnalyticsData.students.map((s) => s.engagement.score),
      backgroundColor: "rgba(54,162,235,0.7)",
    },
  ],
};

// --------------------
// NOTES CHARTS (for "Notes" screen)
// --------------------

// (A) Notes Shared (Bar)
const notesSharedData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Notes Shared",
      data: demoAnalyticsData.students.map((s) => s.notes.shared),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
};

// (B) Community Service Earned through Notes (Bar)
const communityServiceEarnedNotesData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Community Service Earned (Notes)",
      data: demoAnalyticsData.students.map(
        (s) => s.notes.communityServiceEarned
      ),
      backgroundColor: "rgba(255, 159, 64, 0.6)",
    },
  ],
};

// (C) Notes Cited (Bar)
const notesCitedData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Notes Cited",
      data: demoAnalyticsData.students.map((s) => s.notes.cited),
      backgroundColor: "rgba(153, 102, 255, 0.6)",
    },
  ],
};

// (D) Notes Visited (Bar)
const notesVisitedData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Notes Visited",
      data: demoAnalyticsData.students.map((s) => s.notes.visited),
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
  ],
};

// (E) Notes Comments (Bar)
const notesCommentsData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Notes Comments",
      data: demoAnalyticsData.students.map((s) => s.notes.comments),
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    },
  ],
};

// (F) Notes per Subject (Stacked Bar)
const subjects = ["Math", "Science", "English", "History"];
const notesPerSubjectData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: subjects.map((subject) => ({
    label: subject,
    data: demoAnalyticsData.students.map(
      (s) => s.notes.perSubject[subject] || 0
    ),
    backgroundColor:
      subject === "Math"
        ? "rgba(75, 192, 192, 0.6)"
        : subject === "Science"
        ? "rgba(255, 159, 64, 0.6)"
        : subject === "English"
        ? "rgba(153, 102, 255, 0.6)"
        : "rgba(54, 162, 235, 0.6)",
  })),
};

// --------------------
// TUTORING CHARTS (for "Tutoring" screen)
// --------------------

// (G) Tutoring Quality Ratings (Bar)
const tutoringQualityData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Tutoring Quality Rating",
      data: demoAnalyticsData.students.map((s) => s.tutoring.qualityRating),
      backgroundColor: "rgba(54,162,235,0.6)",
      borderColor: "rgba(54,162,235,1)",
      borderWidth: 1,
    },
  ],
};

// (H) Tutoring Total Minutes (Bar)
const tutoringTotalMinutesData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Tutoring Total Minutes",
      data: demoAnalyticsData.students.map((s) => s.tutoring.totalMinutes),
      backgroundColor: "rgba(255,206,86,0.6)",
    },
  ],
};

// (I) Tutoring Sessions Count (Bar)
const tutoringSessionsData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Tutoring Sessions Count",
      data: demoAnalyticsData.students.map((s) => s.tutoring.sessions),
      backgroundColor: "rgba(255,99,132,0.6)",
    },
  ],
};

// (J) Tutoring Improvement Scatter
const tutoringImprovementScatterData = {
  datasets: [
    {
      label: "Tutoring Improvement",
      data: demoAnalyticsData.students.map((s) => ({
        x: s.tutoring.baselineComparisons.improvementPercentage,
        y: s.tutoring.effectiveness,
      })),
      backgroundColor: "rgba(255,159,64,0.7)",
    },
  ],
};

// --------------------
// EVENTS & OPPORTUNITIES CHARTS (for "Events" screen)
// --------------------

// (K) Community Service Events (Bar)
const communityServiceEventsData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Community Service Events",
      data: demoAnalyticsData.students.map((s) => s.communityService.events),
      backgroundColor: "rgba(75,192,192,0.6)",
    },
  ],
};

// (L) Opportunities Data (Grouped Bar)
const opportunitiesData = {
  labels: demoAnalyticsData.students.map((s) => `${s.firstName} ${s.lastName}`),
  datasets: [
    {
      label: "Opportunities Applied",
      data: demoAnalyticsData.students.map((s) => s.opportunities.applied),
      backgroundColor: "rgba(153,102,255,0.6)",
    },
    {
      label: "Opportunities Offered",
      data: demoAnalyticsData.students.map((s) => s.opportunities.offered),
      backgroundColor: "rgba(54,162,235,0.6)",
    },
  ],
};

// -------------------------------
// Dashboard Page Component
// -------------------------------
const DemoAnalyticsDashboard = () => {
  // activeScreen can be: "notes", "tutoring", "events", "overall", or now "metrics"
  const [activeScreen, setActiveScreen] = useState("notes");
  const [loading, setLoading] = useState(true);
  // For AI Assistant section:
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [interventionsApplied, setInterventionsApplied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // --------------------- AI Assistant Handler ---------------------
  const handleAIChat = (e) => {
    e.preventDefault();
    // Hardcoded AI response with list of at-risk students and recommended interventions
    setAiResponse(
      `AI Insight: The following students are at risk: Sami Laayouni.

Risks: 
- Low community service participation
- Little community service outside of sports
Recommended interventions:
• Increase community service notifications
• Recommend less sports activities.

Press "Apply Interventions" to update NoteSwap.`
    );
    setAiInput("");
  };

  const applyInterventions = () => {
    setInterventionsApplied(true);
  };

  // ===============================
  // NEW: Advanced Metrics Chart Data Definitions
  // ===============================

  // (These use the previously computed "computedMetrics" array)
  // Create one Bar chart data object for each metric.

  const hgiChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "HGI",
        data: computedMetrics.map((m) => m.HGI),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const pcrChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "PCR",
        data: computedMetrics.map((m) => m.PCR),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const ocrChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "OCR",
        data: computedMetrics.map((m) => m.OCR),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const teiChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "TEI",
        data: computedMetrics.map((m) => m.TEI),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const smvChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "SMV",
        data: computedMetrics.map((m) => m.SMV),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const pcqChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "PCQ",
        data: computedMetrics.map((m) => m.PCQ),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const essChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "ESS",
        data: computedMetrics.map((m) => m.ESS),
        backgroundColor: "rgba(54, 205, 50, 0.6)",
      },
    ],
  };

  const ruiChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "RUI",
        data: computedMetrics.map((m) => m.RUI),
        backgroundColor: "rgba(201, 203, 207, 0.6)",
      },
    ],
  };

  const eciChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "ECI",
        data: computedMetrics.map((m) => m.ECI),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const pcarsChartData = {
    labels: computedMetrics.map((m) => m.name),
    datasets: [
      {
        label: "PCARS",
        data: computedMetrics.map((m) => m.PCARS),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Professional School Analytics Dashboard</title>
        <meta
          name="description"
          content="A professional analytics dashboard showcasing detailed school data, charts, and insights."
        />
      </Head>
      <div className={styles.dashboardContainer}>
        <header className={styles.header}>
          <h1>School Analytics Dashboard</h1>
          <p className={styles.subtitle}>
            Comprehensive insights into community service, tutoring,
            opportunities, extracurriculars, notes, and more.
          </p>
        </header>

        {/* Navigation for switching screens */}
        <nav className={styles.navContainer}>
          <button
            className={activeScreen === "notes" ? styles.active : ""}
            onClick={() => setActiveScreen("notes")}
          >
            Notes
          </button>
          <button
            className={activeScreen === "tutoring" ? styles.active : ""}
            onClick={() => setActiveScreen("tutoring")}
          >
            Tutoring
          </button>
          <button
            className={activeScreen === "events" ? styles.active : ""}
            onClick={() => setActiveScreen("events")}
          >
            Events &amp; Opportunities
          </button>
          <button
            className={activeScreen === "overall" ? styles.active : ""}
            onClick={() => setActiveScreen("overall")}
          >
            Overall
          </button>
          <button
            className={activeScreen === "metrics" ? styles.active : ""}
            onClick={() => setActiveScreen("metrics")}
          >
            Metrics
          </button>
        </nav>

        {loading ? (
          <div className={styles.loading}>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {/* SCREEN 1: NOTES */}
            {activeScreen === "notes" && (
              <section className={styles.notesScreen}>
                <h2>Summary Metrics & Student Details</h2>
                <div className={styles.summaryCards}>
                  <div className={styles.card}>
                    <h3>Total Community Service</h3>
                    <p>
                      {demoAnalyticsData.students.reduce(
                        (sum, s) => sum + s.communityService.totalMinutes,
                        0
                      )}{" "}
                      minutes
                    </p>
                  </div>
                  <div className={styles.card}>
                    <h3>Total Tutoring</h3>
                    <p>
                      {demoAnalyticsData.students.reduce(
                        (sum, s) => sum + s.tutoring.totalMinutes,
                        0
                      )}{" "}
                      minutes
                    </p>
                  </div>
                  <div className={styles.card}>
                    <h3>Opportunities &amp; Funding</h3>
                    <p>
                      {demoAnalyticsData.overall.scholarshipAwards} Scholarship
                      Awards &amp; {demoAnalyticsData.overall.fundingAllocation}
                    </p>
                  </div>
                  <div className={styles.card}>
                    <h3>Teacher-Student Ratio</h3>
                    <p>{demoAnalyticsData.overall.teacherStudentRatio}</p>
                  </div>
                </div>
                <div>
                  <h2>Notes Data Charts</h2>
                  <div className={styles.chartGrid}>
                    <div className={styles.chartItem}>
                      <h3>Notes Shared</h3>
                      <Bar
                        data={notesSharedData}
                        options={{ responsive: true }}
                      />
                    </div>
                    <div className={styles.chartItem}>
                      <h3>Community Service Earned (Notes)</h3>
                      <Bar
                        data={communityServiceEarnedNotesData}
                        options={{ responsive: true }}
                      />
                    </div>
                    <div className={styles.chartItem}>
                      <h3>Notes Cited</h3>
                      <Bar
                        data={notesCitedData}
                        options={{ responsive: true }}
                      />
                    </div>
                    <div className={styles.chartItem}>
                      <h3>Notes Visited</h3>
                      <Bar
                        data={notesVisitedData}
                        options={{ responsive: true }}
                      />
                    </div>
                    <div className={styles.chartItem}>
                      <h3>Notes Comments</h3>
                      <Bar
                        data={notesCommentsData}
                        options={{ responsive: true }}
                      />
                    </div>
                    <div className={styles.chartItem}>
                      <h3>Notes per Subject</h3>
                      <Bar
                        data={notesPerSubjectData}
                        options={{
                          responsive: true,
                          scales: {
                            x: { stacked: true },
                            y: { stacked: true },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {demoAnalyticsData.students.map((student) => (
                  <div key={student.id} className={styles.studentCard}>
                    <h3>
                      {student.firstName} {student.lastName}
                    </h3>
                    <p>
                      <strong>Community Service:</strong>{" "}
                      {student.communityService.totalMinutes} minutes over{" "}
                      {student.communityService.events} events (Quality:{" "}
                      {student.communityService.qualityRating}, Participation:{" "}
                      {student.communityService.participationRate})
                      <br />
                      <em>Monthly Trends:</em>{" "}
                      {student.communityService.monthlyTrends.join(", ")}
                    </p>
                    <p>
                      <strong>Tutoring:</strong> {student.tutoring.totalMinutes}{" "}
                      minutes in {student.tutoring.sessions} sessions,
                      Effectiveness: {student.tutoring.effectiveness}%, Quality:{" "}
                      {student.tutoring.qualityRating} (Trend:{" "}
                      {student.tutoring.improvementTrend})
                      <br />
                      <em>Baseline Comparisons:</em> Previous Minutes:{" "}
                      {
                        student.tutoring.baselineComparisons
                          .previousTotalMinutes
                      }
                      , Improvement:{" "}
                      {
                        student.tutoring.baselineComparisons
                          .improvementPercentage
                      }
                      %
                    </p>
                    <p>
                      <strong>Opportunities:</strong>{" "}
                      {student.opportunities.applied} applied /{" "}
                      {student.opportunities.offered} offered, Conversion:{" "}
                      {student.opportunities.conversionRate} (Categories:{" "}
                      {Object.keys(student.opportunities.categories).join(", ")}
                      )
                    </p>
                    <p>
                      <strong>Internship:</strong>{" "}
                      {student.intern.active
                        ? `Active (Rating: ${student.intern.rating})`
                        : "Not Active"}
                    </p>
                    <p>
                      <strong>Leadership:</strong>{" "}
                      {student.leadership.positions} positions (Rating:{" "}
                      {student.leadership.rating})
                    </p>
                    <p>
                      <strong>Extracurricular:</strong> Clubs:{" "}
                      {student.extracurricular.clubs}, Sports:{" "}
                      {student.extracurricular.sports}, Arts:{" "}
                      {student.extracurricular.arts}
                      <br />
                      <em>Hours:</em> Clubs:{" "}
                      {student.extracurricular.hours.clubs}, Sports:{" "}
                      {student.extracurricular.hours.sports}, Arts:{" "}
                      {student.extracurricular.hours.arts}
                      <br />
                      <em>Involvement Quality:</em>{" "}
                      {student.extracurricular.involvementQuality}
                      <br />
                      <em>Activity Trends:</em>{" "}
                      {student.extracurricular.activityTrends.join(", ")}
                    </p>
                    <p>
                      <strong>Research:</strong> {student.research.projects}{" "}
                      projects (Quality: {student.research.qualityRating})
                    </p>
                    <p>
                      <strong>Engagement:</strong> Score:{" "}
                      {student.engagement.score}, Attendance:{" "}
                      {student.engagement.attendanceRate}, Satisfaction:{" "}
                      {student.engagement.satisfaction}
                    </p>
                    <p>
                      <strong>Digital Usage:</strong> Online Attendance:{" "}
                      {student.digitalUsage.onlineClassAttendance}, Submission
                      Rate: {student.digitalUsage.assignmentSubmissionRate}
                    </p>
                    <p>
                      <strong>Demographics:</strong> Grade:{" "}
                      {student.demographics.gradeLevel}, Gender:{" "}
                      {student.demographics.gender}, Ethnicity:{" "}
                      {student.demographics.ethnicity}
                    </p>
                    <p>
                      <strong>Notes:</strong> Shared: {student.notes.shared},
                      Community Service Earned:{" "}
                      {student.notes.communityServiceEarned}, Cited:{" "}
                      {student.notes.cited}, Visited: {student.notes.visited},
                      Comments: {student.notes.comments}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* SCREEN 2: TUTORING */}
            {activeScreen === "tutoring" && (
              <section className={styles.tutoringScreen}>
                <h2>Tutoring Data</h2>
                <div className={styles.chartGrid}>
                  <div className={styles.chartItem}>
                    <h3>Tutoring Quality Ratings</h3>
                    <Bar
                      data={tutoringQualityData}
                      options={{ responsive: true }}
                    />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Tutoring Total Minutes</h3>
                    <Bar
                      data={tutoringTotalMinutesData}
                      options={{ responsive: true }}
                    />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Tutoring Sessions Count</h3>
                    <Bar
                      data={tutoringSessionsData}
                      options={{ responsive: true }}
                    />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Tutoring Improvement Scatter</h3>
                    <Scatter
                      data={tutoringImprovementScatterData}
                      options={{
                        responsive: true,
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: "Baseline Improvement (%)",
                            },
                          },
                          y: {
                            title: {
                              display: true,
                              text: "Tutoring Effectiveness (%)",
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SCREEN 3: EVENTS & OPPORTUNITIES */}
            {activeScreen === "events" && (
              <section className={styles.eventsScreen}>
                <h2>Events &amp; Opportunities</h2>
                <div className={styles.chartGrid}>
                  <div className={styles.chartItem}>
                    <h3>Community Service Events</h3>
                    <Bar
                      data={communityServiceEventsData}
                      options={{ responsive: true }}
                    />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Opportunities Data</h3>
                    <Bar
                      data={opportunitiesData}
                      options={{
                        responsive: true,
                        scales: { x: { stacked: true }, y: { stacked: true } },
                      }}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SCREEN 4: OVERALL */}
            {activeScreen === "overall" && (
              <section className={styles.overallScreen}>
                <h2>Overall Data &amp; Metrics</h2>
                <div className={styles.chartGrid}>
                  <div className={styles.chartItem}>
                    <h3>Community Service Categories</h3>
                    <Pie data={csPieData} />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Risk Distribution</h3>
                    <Doughnut data={riskDoughnutData} />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Average Performance</h3>
                    <Radar data={radarData} />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Monthly Community Service Trends</h3>
                    <Line
                      data={monthlyServiceTrendsData}
                      options={{
                        responsive: true,
                        scales: { y: { beginAtZero: true } },
                      }}
                    />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Digital Engagement Comparison</h3>
                    <Radar data={digitalEngagementRadarData} />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Leadership &amp; Research Correlation</h3>
                    <Scatter
                      data={leadershipResearchScatterData}
                      options={{
                        responsive: true,
                        scales: {
                          x: {
                            title: { display: true, text: "Leadership Rating" },
                          },
                          y: {
                            title: { display: true, text: "Research Projects" },
                          },
                        },
                      }}
                    />
                  </div>
                  <div className={styles.chartItem}>
                    <h3>Satisfaction vs Engagement</h3>
                    <Bar
                      data={satisfactionEngagementData}
                      options={{ responsive: true }}
                    />
                  </div>
                </div>

                <section className={styles.overallMetrics}>
                  <h2>Overall School Metrics</h2>
                  <p>
                    <strong>Teacher-Student Ratio:</strong>{" "}
                    {demoAnalyticsData.overall.teacherStudentRatio}
                  </p>
                  <p>
                    <strong>Scholarship Awards &amp; Funding:</strong>{" "}
                    {demoAnalyticsData.overall.scholarshipAwards} awards,{" "}
                    {demoAnalyticsData.overall.fundingAllocation}
                  </p>
                  <p>
                    <strong>Risk Distribution:</strong> High:{" "}
                    {demoAnalyticsData.overall.riskDistribution.high}, Medium:{" "}
                    {demoAnalyticsData.overall.riskDistribution.medium}, Low:{" "}
                    {demoAnalyticsData.overall.riskDistribution.low}
                  </p>
                  <h3>Smart Insights</h3>
                  <ul>
                    {demoAnalyticsData.overall.smartInsights.map(
                      (insight, idx) => (
                        <li key={idx}>{insight}</li>
                      )
                    )}
                  </ul>
                </section>

                <section className={styles.teacherSection}>
                  <h2>Teacher &amp; Operational Metrics</h2>
                  <p>
                    <strong>Teacher Effectiveness Ratings:</strong>{" "}
                    {demoAnalyticsData.teacherMetrics.teacherEffectivenessRatings.join(
                      ", "
                    )}
                  </p>
                  <p>
                    <strong>Professional Development Sessions:</strong>{" "}
                    {
                      demoAnalyticsData.teacherMetrics
                        .professionalDevelopmentSessions
                    }
                  </p>
                </section>

                {/* AI Assistant Section */}
                <section className={styles.aiSection}>
                  <h2>AI Assistant</h2>
                  <p>Ask our AI for insights on school data:</p>
                  <form onSubmit={handleAIChat}>
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Enter your question..."
                    />
                    <button type="submit">Ask AI</button>
                  </form>
                  {aiResponse && (
                    <div className={styles.aiResponse}>
                      <p>{aiResponse}</p>
                      {!interventionsApplied && (
                        <button onClick={applyInterventions}>
                          Apply Interventions
                        </button>
                      )}
                      {interventionsApplied && (
                        <p>Interventions applied: NoteSwap updated.</p>
                      )}
                    </div>
                  )}
                </section>
              </section>
            )}

            {/* SCREEN 5: METRICS */}
            {activeScreen === "metrics" && (
              <section className={styles.metricsScreen}>
                <h2>Advanced Metrics Overview</h2>
                <p>
                  Our advanced metrics offer a deep dive into student
                  performance by measuring critical dimensions of growth and
                  readiness. Below, you’ll find:
                  <br />
                  <br />
                  <strong>1. Holistic Growth Index (HGI):</strong> A composite
                  score integrating tutoring effectiveness, normalized community
                  service, extracurricular quality, and digital engagement.
                  <br />
                  <br />
                  <strong>2. Portfolio Completeness Ratio (PCR):</strong> A
                  measure of how fully a student’s portfolio meets key criteria.
                  <br />
                  <br />
                  <strong>3. Opportunity Conversion Rate (OCR):</strong> The
                  percentage of offered opportunities that are converted to
                  actual engagement.
                  <br />
                  <br />
                  <strong>4. Tutor Efficacy Index (TEI):</strong> An average
                  indicator of tutoring success based on improvements and
                  session quality.
                  <br />
                  <br />
                  <strong>5. Subject Mastery Velocity (SMV):</strong> How
                  quickly a student masters subjects relative to tutoring
                  sessions.
                  <br />
                  <br />
                  <strong>6. Peer Collaboration Quotient (PCQ):</strong> The
                  effectiveness of peer-to-peer interactions.
                  <br />
                  <br />
                  <strong>7. Extracurricular Synergy Score (ESS):</strong> The
                  alignment of extracurricular activities with academic and
                  career goals.
                  <br />
                  <br />
                  <strong>8. Resource Utilization Impact (RUI):</strong> The
                  impact of digital resource usage on performance.
                  <br />
                  <br />
                  <strong>9. Engagement Consistency Index (ECI):</strong> A
                  measure of consistent participation and satisfaction.
                  <br />
                  <br />
                  <strong>
                    10. Predictive Common App Readiness Score (PCARS):
                  </strong>{" "}
                  A composite predictor of college application readiness.
                </p>

                {/* ---------------- Overall Average Metrics ---------------- */}
                <div className={styles.overallChart}>
                  <h3>Overall Average Advanced Metrics (Radar Chart)</h3>
                  <Radar
                    data={metricsRadarData}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Overall Average Advanced Metrics",
                        },
                        tooltip: { enabled: true },
                      },
                    }}
                    aria-label="Overall Average Advanced Metrics Radar Chart"
                  />
                </div>

                {/* ---------------- Detailed Metric Charts with Actionable Recommendations ---------------- */}

                {/* 1. Holistic Growth Index (HGI) */}
                <div className={styles.metricItem}>
                  <h3>1. Holistic Growth Index (HGI)</h3>
                  <p>
                    <strong>Description:</strong> HGI evaluates overall student
                    growth by combining tutoring effectiveness, normalized
                    community service participation, extracurricular involvement
                    (quality), and digital engagement. A higher score indicates
                    balanced, holistic development.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For students scoring
                    below 60, consider scheduling additional tutoring, promoting
                    extracurricular engagement, and increasing digital learning
                    sessions.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={hgiChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "HGI per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing HGI per Student"
                    />
                    <Doughnut
                      data={{
                        labels: ["High (≥80)", "Medium (50–79)", "Low (<50)"],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.HGI >= 80).length,
                              computedMetrics.filter(
                                (m) => m.HGI >= 50 && m.HGI < 80
                              ).length,
                              computedMetrics.filter((m) => m.HGI < 50).length,
                            ],
                            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "HGI Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of HGI scores"
                    />
                  </div>
                </div>

                {/* 2. Portfolio Completeness Ratio (PCR) */}
                <div className={styles.metricItem}>
                  <h3>2. Portfolio Completeness Ratio (PCR)</h3>
                  <p>
                    <strong>Description:</strong> PCR measures the completeness
                    of a student&apos;s portfolio across key components:
                    community service, tutoring, extracurriculars, research,
                    leadership, opportunities, and notes.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For PCR scores below 70,
                    encourage students to add missing portfolio items such as
                    documenting community service hours or extracurricular
                    achievements.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={pcrChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "PCR per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing PCR per Student"
                    />
                    <Doughnut
                      data={{
                        labels: [
                          "Complete (≥80)",
                          "Moderate (50–79)",
                          "Incomplete (<50)",
                        ],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.PCR >= 80).length,
                              computedMetrics.filter(
                                (m) => m.PCR >= 50 && m.PCR < 80
                              ).length,
                              computedMetrics.filter((m) => m.PCR < 50).length,
                            ],
                            backgroundColor: ["#4BC0C0", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "PCR Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of PCR scores"
                    />
                  </div>
                </div>

                {/* 3. Opportunity Conversion Rate (OCR) */}
                <div className={styles.metricItem}>
                  <h3>3. Opportunity Conversion Rate (OCR)</h3>
                  <p>
                    <strong>Description:</strong> OCR calculates the percentage
                    of available opportunities that a student converts. This
                    metric helps gauge how effectively a student is engaging
                    with recommended opportunities.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For students with OCR
                    below 50%, review and tailor the opportunity
                    recommendations, and consider personalized counseling to
                    overcome engagement barriers.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={ocrChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "OCR per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing OCR per Student"
                    />
                    <Doughnut
                      data={{
                        labels: [
                          "High Conversion (≥80%)",
                          "Moderate (50–79%)",
                          "Low (<50%)",
                        ],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.OCR >= 80).length,
                              computedMetrics.filter(
                                (m) => m.OCR >= 50 && m.OCR < 80
                              ).length,
                              computedMetrics.filter((m) => m.OCR < 50).length,
                            ],
                            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "OCR Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of OCR scores"
                    />
                  </div>
                </div>

                {/* 4. Tutor Efficacy Index (TEI) */}
                <div className={styles.metricItem}>
                  <h3>4. Tutor Efficacy Index (TEI)</h3>
                  <p>
                    <strong>Description:</strong> TEI is determined by averaging
                    the student&apos;s tutoring improvement percentage with the
                    normalized quality rating of tutoring sessions. It reflects
                    the impact of tutoring on academic performance.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For TEI values below 60,
                    consider adjusting tutoring methods, providing alternative
                    tutors, or increasing session frequency.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={teiChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "TEI per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing TEI per Student"
                    />
                    <Doughnut
                      data={{
                        labels: ["High (≥80)", "Moderate (50–79)", "Low (<50)"],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.TEI >= 80).length,
                              computedMetrics.filter(
                                (m) => m.TEI >= 50 && m.TEI < 80
                              ).length,
                              computedMetrics.filter((m) => m.TEI < 50).length,
                            ],
                            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "TEI Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of TEI scores"
                    />
                  </div>
                </div>

                {/* 5. Subject Mastery Velocity (SMV) */}
                <div className={styles.metricItem}>
                  <h3>5. Subject Mastery Velocity (SMV)</h3>
                  <p>
                    <strong>Description:</strong> SMV reflects how quickly a
                    student masters academic subjects by comparing the total
                    notes per subject to the number of tutoring sessions. Higher
                    scores indicate faster mastery.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For SMV scores below 60,
                    provide additional subject-specific practice sessions and
                    distribute more targeted learning materials.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={smvChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "SMV per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing SMV per Student"
                    />
                    <Doughnut
                      data={{
                        labels: [
                          "High Velocity (≥80)",
                          "Moderate (50–79)",
                          "Low (<50)",
                        ],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.SMV >= 80).length,
                              computedMetrics.filter(
                                (m) => m.SMV >= 50 && m.SMV < 80
                              ).length,
                              computedMetrics.filter((m) => m.SMV < 50).length,
                            ],
                            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "SMV Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of SMV scores"
                    />
                  </div>
                </div>

                {/* 6. Peer Collaboration Quotient (PCQ) */}
                <div className={styles.metricItem}>
                  <h3>6. Peer Collaboration Quotient (PCQ)</h3>
                  <p>
                    <strong>Description:</strong> PCQ quantifies the
                    effectiveness of peer-to-peer interactions by summing the
                    number of notes shared and cited and then normalizing the
                    result. Higher scores imply more robust collaboration.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For low PCQ values (below
                    60), encourage students to join group projects, peer
                    tutoring, and collaborative study sessions.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={pcqChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "PCQ per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing PCQ per Student"
                    />
                    <Doughnut
                      data={{
                        labels: ["High (≥80)", "Moderate (50–79)", "Low (<50)"],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.PCQ >= 80).length,
                              computedMetrics.filter(
                                (m) => m.PCQ >= 50 && m.PCQ < 80
                              ).length,
                              computedMetrics.filter((m) => m.PCQ < 50).length,
                            ],
                            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "PCQ Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of PCQ scores"
                    />
                  </div>
                </div>

                {/* 7. Extracurricular Synergy Score (ESS) */}
                <div className={styles.metricItem}>
                  <h3>7. Extracurricular Synergy Score (ESS)</h3>
                  <p>
                    <strong>Description:</strong> ESS measures the alignment of
                    a student&apos;s extracurricular activities with their
                    academic and career goals. A high score suggests strong
                    synergy between personal interests and future aspirations.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For ESS values below 60,
                    guide students in selecting extracurriculars that better
                    align with their academic and career interests, and offer
                    mentorship in the selection process.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={essChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "ESS per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing ESS per Student"
                    />
                    <Doughnut
                      data={{
                        labels: ["High (≥80)", "Moderate (50–79)", "Low (<50)"],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.ESS >= 80).length,
                              computedMetrics.filter(
                                (m) => m.ESS >= 50 && m.ESS < 80
                              ).length,
                              computedMetrics.filter((m) => m.ESS < 50).length,
                            ],
                            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "ESS Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of ESS scores"
                    />
                  </div>
                </div>

                {/* 8. Resource Utilization Impact (RUI) */}
                <div className={styles.metricItem}>
                  <h3>8. Resource Utilization Impact (RUI)</h3>
                  <p>
                    <strong>Description:</strong> RUI measures the impact of
                    digital resource usage, incorporating online attendance,
                    assignment submission rates, and computer lab usage into one
                    score.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For students with RUI
                    below 60, offer training sessions on using digital
                    resources, and track improvements with targeted workshops.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={ruiChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "RUI per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing RUI per Student"
                    />
                    <Doughnut
                      data={{
                        labels: ["High (≥80)", "Moderate (50–79)", "Low (<50)"],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.RUI >= 80).length,
                              computedMetrics.filter(
                                (m) => m.RUI >= 50 && m.RUI < 80
                              ).length,
                              computedMetrics.filter((m) => m.RUI < 50).length,
                            ],
                            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "RUI Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of RUI scores"
                    />
                  </div>
                </div>

                {/* 9. Engagement Consistency Index (ECI) */}
                <div className={styles.metricItem}>
                  <h3>9. Engagement Consistency Index (ECI)</h3>
                  <p>
                    <strong>Description:</strong> ECI is calculated by averaging
                    a student’s attendance rate with a scaled satisfaction
                    score, reflecting how consistently they engage with school
                    activities.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For ECI values below 60,
                    set up regular check-ins, provide motivational support, and
                    establish consistent routines.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={eciChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "ECI per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing ECI per Student"
                    />
                    <Doughnut
                      data={{
                        labels: ["High (≥80)", "Moderate (50–79)", "Low (<50)"],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.ECI >= 80).length,
                              computedMetrics.filter(
                                (m) => m.ECI >= 50 && m.ECI < 80
                              ).length,
                              computedMetrics.filter((m) => m.ECI < 50).length,
                            ],
                            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "ECI Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of ECI scores"
                    />
                  </div>
                </div>

                {/* 10. Predictive Common App Readiness Score (PCARS) */}
                <div className={styles.metricItem}>
                  <h3>10. Predictive Common App Readiness Score (PCARS)</h3>
                  <p>
                    <strong>Description:</strong> PCARS predicts a student’s
                    readiness for college applications by combining the
                    portfolio completeness ratio with contributions from
                    leadership, research, tutoring, and extracurricular
                    activities.
                  </p>
                  <p>
                    <strong>Actionable Steps:</strong> For students scoring
                    below 70 on PCARS, implement a comprehensive college
                    readiness program that includes portfolio review, interview
                    preparation, and enhanced leadership opportunities.
                  </p>
                  <div className={styles.chartPair}>
                    <Bar
                      data={pcarsChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "PCARS per Student (Bar Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Bar chart showing PCARS per Student"
                    />
                    <Doughnut
                      data={{
                        labels: [
                          "Ready (≥80)",
                          "Almost Ready (50–79)",
                          "Not Ready (<50)",
                        ],
                        datasets: [
                          {
                            data: [
                              computedMetrics.filter((m) => m.PCARS >= 80)
                                .length,
                              computedMetrics.filter(
                                (m) => m.PCARS >= 50 && m.PCARS < 80
                              ).length,
                              computedMetrics.filter((m) => m.PCARS < 50)
                                .length,
                            ],
                            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          title: {
                            display: true,
                            text: "PCARS Distribution (Doughnut Chart)",
                          },
                          tooltip: { enabled: true },
                        },
                      }}
                      aria-label="Doughnut chart showing distribution of PCARS scores"
                    />
                  </div>
                </div>

                {/* ---------------- Personalized Interventions Section ---------------- */}
                <div className={styles.interventionSection}>
                  <h2>Personalized Interventions &amp; NoteSWAP Updates</h2>
                  <p>
                    Based on the computed metrics above, the following
                    actionable recommendations have been identified. Click
                    “Update NoteSWAP” for each student to modify their learning
                    plan to address areas needing improvement.
                  </p>
                  {computedMetrics.map((student) => (
                    <div key={student.id} className={styles.interventionCard}>
                      <h3>{student.name}</h3>
                      <ul>
                        {student.HGI < 60 && (
                          <li>
                            Increase tutoring sessions and extracurricular
                            activities to boost overall growth.
                          </li>
                        )}
                        {student.PCR < 70 && (
                          <li>
                            Encourage completion of portfolio components (e.g.,
                            community service, extracurricular records).
                          </li>
                        )}
                        {student.OCR < 50 && (
                          <li>
                            Review opportunity recommendations and provide
                            tailored guidance.
                          </li>
                        )}
                        {student.TEI < 60 && (
                          <li>
                            Reevaluate tutoring methods and consider alternate
                            strategies or tutors.
                          </li>
                        )}
                        {student.SMV < 60 && (
                          <li>
                            Offer extra subject-specific practice and distribute
                            targeted study materials.
                          </li>
                        )}
                        {student.PCQ < 60 && (
                          <li>
                            Promote peer study groups and collaborative
                            projects.
                          </li>
                        )}
                        {student.ESS < 60 && (
                          <li>
                            Recommend extracurricular activities that align more
                            closely with the student’s goals.
                          </li>
                        )}
                        {student.RUI < 60 && (
                          <li>
                            Increase training on digital resource usage and
                            monitor engagement.
                          </li>
                        )}
                        {student.ECI < 60 && (
                          <li>
                            Implement regular check-ins and motivational
                            sessions to ensure consistent engagement.
                          </li>
                        )}
                        {student.PCARS < 70 && (
                          <li>
                            Provide a comprehensive college readiness program,
                            including portfolio review and leadership
                            development.
                          </li>
                        )}
                      </ul>
                      <button onClick={() => modifyNoteSwapForStudent(student)}>
                        Update NoteSWAP for {student.name}
                      </button>
                    </div>
                  ))}
                  <p>
                    <em>
                      Accessible Suggestion: In addition to clear text and color
                      contrast, consider adding ARIA attributes to each button
                      and card to ensure they are fully navigable by keyboard
                      and screen readers.
                    </em>
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DemoAnalyticsDashboard;
