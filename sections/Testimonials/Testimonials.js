"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    text: "NoteSwap makes portfolios effortless and the AI data is super helpful!",
    imageSrc: "/assets/avatar-1.png",
    name: "Ava Chen",
    username: "From Lincoln High",
  },
  {
    text: "Love how NoteSwap organizes my extracurriculars—clean and smart!",
    imageSrc: "/assets/avatar-2.png",
    name: "Ethan Rodriguez",
    username: "From Westview Academy",
  },
  {
    text: "NoteSwap’s a lifesaver—easy portfolios and cool AI insights.",
    imageSrc: "/assets/avatar-3.png",
    name: "Sophia Patel",
    username: "From Riverdale Prep",
  },
  {
    text: "NoteSwap keeps everything tidy, and the AI stats are awesome!",
    imageSrc: "/assets/avatar-4.png",
    name: "Liam Harper",
    username: "From Oakwood School",
  },
  {
    text: "Effortless portfolios with NoteSwap—the smart data’s a game-changer!",
    imageSrc: "/assets/avatar-5.png",
    name: "Isabella Kim",
    username: "From Maple Grove High",
  },
  {
    text: "NoteSwap’s AI insights make my extracurriculars way easier to track!",
    imageSrc: "/assets/avatar-6.png",
    name: "Noah Sullivan",
    username: "From Crestmont Academy",
  },
  {
    text: "Portfolios are a breeze with NoteSwap, and the data’s so useful!",
    imageSrc: "/assets/avatar-7.png",
    name: "Mia Torres",
    username: "From Hillside High",
  },
  {
    text: "NoteSwap simplifies everything—love the smart AI features!",
    imageSrc: "/assets/avatar-8.png",
    name: "Jacob Nguyen",
    username: "From Brookstone Prep",
  },
  {
    text: "NoteSwap’s perfect for managing my activities—AI data rocks!",
    imageSrc: "/assets/avatar-9.png",
    name: "Emma Davis",
    username: "From Sunnyvale School",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props) => (
  <div className={`${styles.testimonialsColumn} ${props.className || ""}`}>
    <motion.div
      animate={{ translateY: "-50%" }}
      transition={{
        duration: props.duration || 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className={styles.testimonialsList}
    >
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {props.testimonials.map(({ text, imageSrc, name, username }, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.testimonialText}>{text}</div>
              <div className={styles.testimonialMeta}>
                <Image
                  src={imageSrc}
                  alt={name}
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
                <div className={styles.testimonialInfo}>
                  <div className={styles.testimonialName}>{name}</div>
                  <div className={styles.testimonialUsername}>{username}</div>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

export const Testimonials = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.descriptionBox}>
          <div className={styles.centered}>
            <div className={styles.tag}>Testimonials</div>
          </div>
          <h2 className={styles.title}>What our users say</h2>
          <p className={styles.description}>
            By eliminating manual work, NoteSwap can help save schools an
            estimated $70,000 per year in administrative costs.
          </p>
        </div>
        <div className={styles.columnsContainer}>
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className={styles.showOnMd}
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className={styles.showOnLg}
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
