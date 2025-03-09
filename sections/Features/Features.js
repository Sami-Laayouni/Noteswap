"use client";
import { motion } from "framer-motion";
import styles from "./Features.module.css";
import { FaUserGraduate, FaChalkboardTeacher, FaSchool } from "react-icons/fa";

export const Features = () => {
  const categories = [
    {
      name: "Students",
      icon: <FaUserGraduate />,
      features: [
        "Access to Opportunities",
        "Generate Custom Portfolios",
        "Share Notes & Peer-Reviewed Tutoring",
      ],
    },
    {
      name: "Administration",
      icon: <FaSchool />,
      features: [
        "Valuable Insights into Student Extracurriculars",
        "Customizable Profiles for Every Student",
        "Automated Report Cards & Performance Tracking",
      ],
    },
    {
      name: "Teachers",
      icon: <FaChalkboardTeacher />,
      features: [
        "Community Service Tracking",
        "Mentorship & Student Support Tools",
        "Classroom Resource Sharing",
      ],
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.title}>Features for Every Role</h2>
      <p className={styles.description}>
        Discover how our platform supports students, administration, and
        teachers with tailored features.
      </p>
      <div className={styles.featuresContainer}>
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            className={styles.featureCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={styles.icon}>{category.icon}</div>
            <h3 className={styles.categoryName}>{category.name}</h3>
            <ul className={styles.featureList}>
              {category.features.map((feature, i) => (
                <li key={i} className={styles.featureItem}>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
