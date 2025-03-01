"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./LogoTicker.module.css";

export const LogoTicker = () => {
  return (
    <div className={styles.logoTickerWrapper}>
      <div className={styles.container}>
        <div className={styles.tickerContainer}>
          <motion.div
            className={styles.tickerAnimation}
            animate={{ translateX: "-50%" }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          >
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/commonapp.png"}
              alt="Common App Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/linkedin.png"}
              alt="Linkedin Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/harvard.png"}
              alt="Harvard Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/uom.png"}
              alt="Canadian International School Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/uol.png"}
              alt="ASI Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/dartmouth.png"}
              alt="Dartmouth Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/uot.png"}
              alt="Dartmouth Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/vt.png"}
              alt="Dartmouth Logo"
            />
            {/* Second set of logos for animation */}
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/commonapp.png"}
              alt="Common App Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/linkedin.png"}
              alt="Linkedin Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/harvard.png"}
              alt="Harvard Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/uom.png"}
              alt="Canadian International School Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/uol.png"}
              alt="ASI Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/dartmouth.png"}
              alt="Dartmouth Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/uot.png"}
              alt="Dartmouth Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/vt.png"}
              alt="Dartmouth Logo"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
