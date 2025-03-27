"use client";
import { motion } from "framer-motion";
import styles from "./Features.module.css";
import { FaUserGraduate, FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import { useState } from "react";

export const Features = () => {
  const [activeTab, setActiveTab] = useState("Teachers");
  const [selectedFeature, setSelectedFeature] = useState("Staff timesheets");

  const tabs = [
    { name: "Students", icon: <FaUserGraduate /> },

    { name: "Teachers", icon: <FaChalkboardTeacher /> },
    { name: "Administration", icon: <FaSchool /> },
  ];

  const featuresByCategory = {
    Teachers: [
      "Community Service Tracking",
      "Event Creating and Management",
      "Staff timesheets",
    ],
    Students: [
      "Access to Opportunities",
      "Tutoring Peer-Reviewed",
      "Note-Taking and Sharing",
      "AI-Chat Bot on School Handbook",
      "Extracurricular Tracking",
    ],
    Administration: [
      "Smart Insightful Data",
      "Handsfree Extracurricular Tracking",
      "Better Student Results and College Placements",
    ],
  };

  const featureDetails = {
    "Community Service Tracking": {
      Teachers: {
        title: "Community Service Tracking for Teachers",
        description:
          "Easily track and manage student community service hours, ensuring accurate records for graduation requirements and college applications.",
        image: "/path-to-image.png", // Replace with actual image path
      },
    },
    "Event Creating and Management": {
      Teachers: {
        title: "Event Creating and Management for Teachers",
        description:
          "Create and manage school events such as field trips, workshops, or parent-teacher conferences with streamlined scheduling and communication tools.",
        image: "/path-to-image.png",
      },
    },
    "Staff timesheets": {
      Teachers: {
        title: "Staff timesheets for Teachers",
        description:
          "Schools save up to $100K each year and multiple days of staff time each year by using Clipboard timesheets. Clipboard flags hours entries that don’t match up with the schedule, giving your confidence that timesheets are always accurate. Plus, the system automatically calculates pay rates, overtime, allowances, penalty rates classifications and costs in line with relevant awards.",
        image: "/path-to-image.png",
      },
    },
    "Access to Opportunities": {
      Students: {
        title: "Access to Opportunities for Students",
        description:
          "Get access to opportunities not just on a local level but the best opportunities on a global scale - internships, scholarships, international competitions/clubs, and awards personalized to your preference.",
        image: "/path-to-image.png",
      },
    },
    "Tutoring Peer-Reviewed": {
      Students: {
        title: "Tutoring Peer-Reviewed for Students",
        description:
          "Connect with peers for tutoring sessions, share knowledge, and receive peer-reviewed feedback to improve your understanding of subjects.",
        image: "/path-to-image.png",
      },
    },
    "Note-Taking and Sharing": {
      Students: {
        title: "Note-Taking and Sharing for Students",
        description:
          "Take notes directly on the platform and share them with classmates, ensuring everyone has access to important study materials.",
        image: "/path-to-image.png",
      },
    },
    "AI-Chat Bot on School Handbook": {
      Students: {
        title: "AI-Chat Bot on School Handbook for Students",
        description:
          "Instantly get answers to school-related questions with an AI-powered chatbot that knows the school handbook inside and out.",
        image: "/path-to-image.png",
      },
    },
    "Extracurricular Tracking": {
      Students: {
        title: "Extracurricular Tracking for Students",
        description:
          "Track your participation in extracurricular activities, log hours, and showcase your achievements for college applications.",
        image: "/path-to-image.png",
      },
    },
    "Smart Insightful Data": {
      Administration: {
        title: "Smart Insightful Data for Administration",
        description:
          "Gain deep insights into student performance, attendance, and behavior with advanced analytics to make data-driven decisions.",
        image: "/path-to-image.png",
      },
    },
    "Handsfree Extracurricular Tracking": {
      Administration: {
        title: "Handsfree Extracurricular Tracking for Administration",
        description:
          "Automatically track student participation in extracurricular activities, reducing manual work and ensuring accurate records.",
        image: "/path-to-image.png",
      },
    },
    "Better Student Results and College Placements": {
      Administration: {
        title:
          "Better Student Results and College Placements for Administration",
        description:
          "Leverage data and tracking tools to improve student outcomes, leading to better academic results and higher college placement rates.",
        image: "/path-to-image.png",
      },
    },
  };

  // Update selectedFeature when the tab changes to the first feature of the new category
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSelectedFeature(featuresByCategory[tabName][0]);
  };

  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.title}>Features</h2>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`${styles.tabButton} ${
              activeTab === tab.name ? styles.activeTab : ""
            }`}
            onClick={() => handleTabChange(tab.name)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.name}

            {tab.name === "Administration" && (
              <span className={styles.badge}>High School</span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.contentContainer}>
        {/* Left: Key Features */}
        <div className={styles.keyFeatures}>
          <h3>Key Features</h3>
          <p className={styles.note}>
            Features relevant to the {activeTab.toLowerCase()}.
          </p>
          <ul className={styles.featureList}>
            {featuresByCategory[activeTab].map((feature, index) => (
              <li
                key={index}
                className={`${styles.featureItem} ${
                  selectedFeature === feature ? styles.highlighted : ""
                }`}
                onClick={() => setSelectedFeature(feature)}
              >
                {feature}
              </li>
            ))}
          </ul>
          <a href="#" className={styles.learnMore}>
            Read Our Case Studies →
          </a>
        </div>

        {/* Right: Feature Details */}
        <motion.div
          className={styles.tabContent}
          key={`${activeTab}-${selectedFeature}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>{featureDetails[selectedFeature][activeTab].title}</h3>
          <p>{featureDetails[selectedFeature][activeTab].description}</p>
          <img
            src={featureDetails[selectedFeature][activeTab].image}
            alt={featureDetails[selectedFeature][activeTab].title}
            className={styles.contentImage}
          />
        </motion.div>
      </div>
    </section>
  );
};
