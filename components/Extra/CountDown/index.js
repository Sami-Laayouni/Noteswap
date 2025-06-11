// components/CountdownTimer.js
import { useState, useEffect } from "react";
import styles from "./CountdownTimer.module.css"; // We'll create this CSS file next

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      // If the target date is past, show 0
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!targetDate || new Date(targetDate) <= new Date()) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const format = (value) => (value < 10 ? `0${value}` : value);

  if (!targetDate) return null; // Don't render if no target date

  return (
    <div className={styles.countdownContainer}>
      <div className={styles.timeSection}>
        <span className={styles.timeValue}>{format(timeLeft.days)}</span>
        <span className={styles.timeLabel}>DAYS</span>
      </div>
      <div className={styles.timeSection}>
        <span className={styles.timeValue}>{format(timeLeft.hours)}</span>
        <span className={styles.timeLabel}>HRS</span>
      </div>
      <div className={styles.timeSection}>
        <span className={styles.timeValue}>{format(timeLeft.minutes)}</span>
        <span className={styles.timeLabel}>MIN</span>
      </div>
      <div className={styles.timeSection}>
        <span className={styles.timeValue}>{format(timeLeft.seconds)}</span>
        <span className={styles.timeLabel}>SEC</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
