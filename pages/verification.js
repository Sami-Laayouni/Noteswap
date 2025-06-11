"use client";
import React, { useState, useMemo, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Award,
  Star,
  Filter,
  Search,
  Download,
} from "lucide-react";
import { useRouter } from "next/router";

// Fake data for the dashboard
const fakeData = {
  students: [
    {
      id: 1,
      name: "Sami Laayouni",
      grade: 11,
      totalHours: 128,
      inSchool: 85,
      external: 60,
      verified: 120,
      pending: 25,
      gpa: 38,
    },
    {
      id: 2,
      name: "Marcus Chen",
      grade: 12,
      totalHours: 203,
      inSchool: 120,
      external: 83,
      verified: 180,
      pending: 23,
      gpa: 39,
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      grade: 10,
      totalHours: 98,
      inSchool: 65,
      external: 33,
      verified: 85,
      pending: 13,
      gpa: 37,
    },
    {
      id: 4,
      name: "James Wilson",
      grade: 11,
      totalHours: 167,
      inSchool: 92,
      external: 75,
      verified: 142,
      pending: 25,
      gpa: 36,
    },
    {
      id: 5,
      name: "Aisha Patel",
      grade: 12,
      totalHours: 189,
      inSchool: 110,
      external: 79,
      verified: 165,
      pending: 24,
      gpa: 40,
    },
    {
      id: 6,
      name: "David Kim",
      grade: 9,
      totalHours: 76,
      inSchool: 55,
      external: 21,
      verified: 68,
      pending: 8,
      gpa: 35,
    },
    {
      id: 7,
      name: "Isabella Martinez",
      grade: 11,
      totalHours: 134,
      inSchool: 78,
      external: 56,
      verified: 115,
      pending: 19,
      gpa: 38,
    },
    {
      id: 8,
      name: "Ryan Thompson",
      grade: 10,
      totalHours: 112,
      inSchool: 70,
      external: 42,
      verified: 95,
      pending: 17,
      gpa: 34,
    },
  ],
  activities: [
    {
      id: 1,
      name: "Student Council",
      type: "in-school",
      participants: 25,
      totalHours: 450,
      status: "verified",
    },
    {
      id: 2,
      name: "Red Cross Volunteering",
      type: "external",
      participants: 42,
      totalHours: 680,
      status: "verified",
      orgName: "American Red Cross",
    },
    {
      id: 3,
      name: "Math Olympiad",
      type: "in-school",
      participants: 18,
      totalHours: 320,
      status: "verified",
    },
    {
      id: 4,
      name: "Local Food Bank",
      type: "external",
      participants: 35,
      totalHours: 520,
      status: "verified",
      orgName: "Community Food Bank",
    },
    {
      id: 5,
      name: "Drama Club",
      type: "in-school",
      participants: 28,
      totalHours: 380,
      status: "verified",
    },
    {
      id: 6,
      name: "Environmental Club",
      type: "external",
      participants: 22,
      totalHours: 290,
      status: "pending",
      orgName: "Green Earth Initiative",
    },
    {
      id: 7,
      name: "Debate Team",
      type: "in-school",
      participants: 15,
      totalHours: 240,
      status: "verified",
    },
    {
      id: 8,
      name: "Animal Shelter",
      type: "external",
      participants: 19,
      totalHours: 310,
      status: "verified",
      orgName: "City Animal Shelter",
    },
  ],
  monthlyTrends: [
    { month: "Jan", inSchool: 420, external: 280, verified: 650, pending: 50 },
    { month: "Feb", inSchool: 380, external: 320, verified: 680, pending: 20 },
    { month: "Mar", inSchool: 450, external: 350, verified: 750, pending: 50 },
    { month: "Apr", inSchool: 520, external: 380, verified: 820, pending: 80 },
    { month: "May", inSchool: 480, external: 420, verified: 850, pending: 50 },
    { month: "Jun", inSchool: 510, external: 460, verified: 920, pending: 50 },
  ],
  verificationStats: [
    { name: "Verified", value: 2840, color: "#10B981" },
    { name: "Pending", value: 245, color: "#F59E0B" },
    { name: "Rejected", value: 45, color: "#EF4444" },
  ],
  topOrganizations: [
    { name: "American Red Cross", students: 42, hours: 680, rating: 4.9 },
    { name: "Community Food Bank", students: 35, hours: 520, rating: 4.8 },
    { name: "City Animal Shelter", students: 19, hours: 310, rating: 4.7 },
    { name: "Green Earth Initiative", students: 22, hours: 290, rating: 4.6 },
    { name: "Local Library", students: 28, hours: 380, rating: 4.8 },
  ],
};

export default function Verification() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("6months");
  const router = useRouter();

  // Calculate key metrics
  const totalStudents = fakeData.students.length;
  const totalHours = fakeData.students.reduce(
    (sum, student) => sum + student.totalHours,
    0
  );
  const verifiedHours = fakeData.students.reduce(
    (sum, student) => sum + student.verified,
    0
  );
  const pendingHours = fakeData.students.reduce(
    (sum, student) => sum + student.pending,
    0
  );
  const averageGPA = (
    fakeData.students.reduce((sum, student) => sum + student.gpa, 0) /
    totalStudents
  ).toFixed(2);

  // Filter students based on search and filter
  const filteredStudents = useMemo(() => {
    return fakeData.students.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "high-achievers" && student.totalHours > 150) ||
        (selectedFilter === "pending" && student.pending > 20);
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  const dashboardStyle = {
    minHeight: "100vh",
    background: "whitesmoke",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#1f2937",
  };

  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  };

  const headerStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    padding: "2rem",
    borderRadius: "16px",
    marginBottom: "2rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const cardStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    marginTop: "2rem",
  };

  const metricCardStyle = {
    ...cardStyle,
    textAlign: "center",
    padding: "2rem",
    position: "relative",
    overflow: "hidden",
  };

  const gridStyle = {
    display: "grid",
    gap: "1.5rem",
    marginBottom: "2rem",
  };

  const grid4Style = {
    ...gridStyle,
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  };

  const grid2Style = {
    ...gridStyle,
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
  };

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

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.9)",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
    backgroundPosition: "right 0.5rem center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "1.5em 1.5em",
    paddingRight: "2.5rem",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  };

  const thStyle = {
    background: "var(--accent-color)",
    color: "white",
    padding: "1rem",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "0.875rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
    background: "rgba(255, 255, 255, 0.9)",
  };

  const badgeStyle = {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const getStatusBadge = (status) => {
    const styles = {
      verified: { ...badgeStyle, background: "#d1fae5", color: "#065f46" },
      pending: { ...badgeStyle, background: "#fef3c7", color: "#92400e" },
      rejected: { ...badgeStyle, background: "#fee2e2", color: "#991b1b" },
    };
    return styles[status] || styles.pending;
  };

  return (
    <div style={dashboardStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  color: "var(--accent-color)",
                  margin: 0,
                }}
              >
                Verification Dashboard
              </h1>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#6b7280",
                  margin: "0.5rem 0 0 0",
                }}
              >
                Al Akhawayn School of Ifrane - Academic Year 2024-2025
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={buttonStyle}>
                <Download size={18} />
                Export Report
              </button>
              <button style={buttonStyle}>
                <Filter size={18} />
                Advanced Filters
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative" }}>
              <Search
                size={20}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280",
                }}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...inputStyle, paddingLeft: "3rem" }}
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Students</option>
              <option value="high-achievers">
                High Achievers (150+ hours)
              </option>
              <option value="pending">Pending Verification</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={selectStyle}
            >
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={grid4Style}>
          <div style={metricCardStyle}>
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                opacity: 0.1,
              }}
            >
              <Users size={60} />
            </div>
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "var(--accent-color)",
                marginBottom: "0.5rem",
              }}
            >
              {totalStudents}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Active Students
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginTop: "0.5rem",
              }}
            >
              +12% from last semester
            </div>
          </div>

          <div style={metricCardStyle}>
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                opacity: 0.1,
              }}
            >
              <Clock size={60} />
            </div>
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#10b981",
                marginBottom: "0.5rem",
              }}
            >
              {totalHours.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Total Hours
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginTop: "0.5rem",
              }}
            >
              {Math.round((verifiedHours / totalHours) * 100)}% verified
            </div>
          </div>

          <div style={metricCardStyle}>
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                opacity: 0.1,
              }}
            >
              <CheckCircle size={60} />
            </div>
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#f59e0b",
                marginBottom: "0.5rem",
              }}
            >
              {verifiedHours.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Verified Hours
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginTop: "0.5rem",
              }}
            >
              {pendingHours} pending verification
            </div>
          </div>

          <div style={metricCardStyle}>
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                opacity: 0.1,
              }}
            >
              <Star size={60} />
            </div>
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#8b5cf6",
                marginBottom: "0.5rem",
              }}
            >
              {averageGPA}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Average Tutoring
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginTop: "0.5rem",
              }}
            >
              Among active participants
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={grid2Style}>
          {/* Monthly Trends */}
          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <TrendingUp size={24} style={{ color: "var(--accent-color)" }} />
              Monthly Activity Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={fakeData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="verified"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Verification Status */}
          <div style={cardStyle}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <CheckCircle size={24} style={{ color: "#10b981" }} />
              Verification Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fakeData.verificationStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fakeData.verificationStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Breakdown */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Trophy size={24} style={{ color: "var(--accent-color)" }} />
            In-School vs External Activities
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={fakeData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="inSchool"
                fill="#667eea"
                name="In-School Activities"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="external"
                fill="#10b981"
                name="External Activities"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Organizations */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Award size={24} style={{ color: "var(--accent-color)" }} />
            Top Partner Organizations
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {fakeData.topOrganizations.map((org, index) => (
              <div
                key={index}
                style={{
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h4
                    style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0 }}
                  >
                    {org.name}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Star
                      size={16}
                      style={{ color: "#f59e0b", fill: "#f59e0b" }}
                    />
                    <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                      {org.rating}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  }}
                >
                  <span>{org.students} students</span>
                  <span>{org.hours} hours</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Table */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Users size={24} style={{ color: "var(--accent-color)" }} />
            Student Overview
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Student</th>
                  <th style={thStyle}>Grade</th>
                  <th style={thStyle}>Total Hours</th>
                  <th style={thStyle}>In-School</th>
                  <th style={thStyle}>External</th>
                  <th style={thStyle}>Verified</th>
                  <th style={thStyle}>Pending</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    onClick={() => {
                      router.push("/single_page");
                    }}
                    key={student.id}
                    style={{ transition: "all 0.3s ease" }}
                  >
                    <td style={tdStyle}>
                      <div style={{ fontWeight: "600" }}>{student.name}</div>
                    </td>

                    <td style={tdStyle}>{student.grade}</td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: "600", color: "#667eea" }}>
                        {student.totalHours}
                      </div>
                    </td>
                    <td style={tdStyle}>{student.inSchool}</td>
                    <td style={tdStyle}>{student.external}</td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: "600", color: "#10b981" }}>
                        {student.verified}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: "600", color: "#f59e0b" }}>
                        {student.pending}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={getStatusBadge(
                          student.pending > 20 ? "pending" : "verified"
                        )}
                      >
                        {student.pending > 20 ? "Pending" : "Verified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
