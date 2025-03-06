"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./Hero.module.css";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={heroRef} className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Effortless Student Portfolios</h1>
            <p className={styles.heroDescription}>
              We create your students' portfolios, managing all their
              extracurriculars while providing your school with valuable
              insights to support them.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/signup">
                <button className={styles.btnPrimary}>Sign up</button>
              </Link>
              <Link href="/book_a_demo">
                <button className={styles.btnText}>
                  <span>Book demo</span>
                  <FaArrowRight className={styles.arrowIcon} />
                </button>
              </Link>
            </div>
          </div>
          <div className={styles.heroImages}>
            <motion.img
              src="/assets/product-image.png"
              alt="Cog image"
              className={styles.cogImage}
              animate={{ translateY: [-30, 30] }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src="/assets/shape.png"
              alt="Cylinder image"
              width={220}
              height={220}
              className={styles.cylinderImage}
              style={{ translateY: translateY }}
            />
            <motion.img
              src="/assets/noodle.png"
              alt="Noodle image"
              width={220}
              height={220}
              className={styles.noodleImage}
              style={{ rotate: 30, translateY: translateY }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
