"use client";
import { FaArrowRight } from "react-icons/fa6";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./CallToAction.module.css";
import Link from "next/link";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={sectionRef} className={styles.callToActionSection}>
      <div className={styles.container}>
        <div className={styles.descriptionBox}>
          <h2 className={styles.sectionTitle}>Sign up today</h2>
          <p className={styles.sectionDescription}>
            Expand College & Career Opportunities for Your Students While
            Gaining Valuable Insights into Their Extracurricular Support!
          </p>
        </div>
        <div className={styles.buttonGroup}>
          <Link href="/book_a_demo">
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              Book a demo
            </button>
          </Link>
          <button className={`${styles.btn} ${styles.btnText}`}>
            <span>Learn more</span>
            <FaArrowRight className={styles.arrowIcon} />
          </button>
        </div>
      </div>
    </section>
  );
};
