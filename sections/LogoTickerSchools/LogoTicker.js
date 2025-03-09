"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./LogoTickerSchools.module.css";

export const LogoTickerSchools = () => {
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
              src={"/assets/cis.png"}
              alt="Common App Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/asi.png"}
              alt="Linkedin Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/bms.png"}
              alt="Harvard Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/owis.webp"}
              alt="Canadian International School Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/ohs.png"}
              alt="ASI Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/keio.png"}
              alt="Dartmouth Logo"
            />

            {/* Second set of logos for animation */}
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/cis.png"}
              alt="Common App Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/asi.png"}
              alt="Linkedin Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/bms.png"}
              alt="Harvard Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/owis.webp"}
              alt="Canadian International School Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/ohs.png"}
              alt="ASI Logo"
            />
            <Image
              className={styles.logoTickerImage}
              width={150}
              height={60}
              src={"/assets/keio.png"}
              alt="Dartmouth Logo"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
