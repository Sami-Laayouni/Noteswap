"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./ProductShowcase.module.css";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section ref={sectionRef} className={styles.productShowcase}>
      <div className={styles.container}>
        <div className={styles.sectionDescriptionBox}>
          <div className={styles.centerFlex}>
            <div className={styles.tag}>Boost your productivity</div>
          </div>
          <h2 className={styles.sectionTitle}>
            A smarter & cheaper way to track student progress
          </h2>
          <p className={styles.sectionDescription}>
            We collect and organize all student data—from community service to
            tutoring and events—giving you a complete view to better support
            your students. Our platform generates a ready-to-export portfolio
            for applications like the Common App and others listed above.
          </p>
        </div>
        <div className={styles.relativeContainer}>
          <img
            src="/assets/product-image.png"
            alt="Product Image"
            style={{ width: "80vw" }}
            className={styles.productImage}
          />
          <motion.img
            src="/assets/noodle2.png"
            alt="Pyramid Image"
            height={262}
            width={262}
            className={styles.pyramidImage}
            style={{ translateY }}
          />
          <motion.img
            src="/assets/tube.png"
            alt="Tube Image"
            height={248}
            width={248}
            className={styles.tubeImage}
            style={{ translateY }}
          />
        </div>
      </div>
    </section>
  );
};
