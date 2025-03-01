import styles from "./Features.module.css";
import { CgCheck } from "react-icons/cg";
const featureTiers = [
  {
    title: "Basic",
    monthlyPrice: "Free",
    buttonText: "Get started for free",
    popular: false,
    inverse: false,
    features: [
      "Track community service and events",
      "Generate student portfolios",
      "Basic reporting and insights",
      "Up to 150 student profiles",
    ],
  },
  {
    title: "Pro",
    monthlyPrice: "Flexible Price",
    buttonText: "Book a demo",
    popular: true,
    inverse: true,
    features: [
      "Everything in Free, plus:",
      "Access to exclusive opportunities",
      "AI Tutoring Tracking",
      "Advanced reporting & analytics",
      "Export portfolios to Common App format",
      "Up to 500 student profiles",
    ],
  },
  {
    title: "Business",
    monthlyPrice: "Flexible Price",
    buttonText: "Book a demo",
    popular: false,
    inverse: false,
    features: [
      "Everything in Pro, plus:",
      "School-AI trained on school handbook",
      "Advanced security & compliance",
      "Unlimited student profiles",
    ],
  },
];

export const Features = () => {
  return (
    <section className={styles.pricingSection}>
      <div className={styles.container}>
        <div className={styles.sectionDescriptionBox}>
          <h2 className={styles.sectionTitle}>Features</h2>
          <p className={styles.sectionDescription}>
            Automate tracking, manage extracurriculars, and generate exportable
            portfolios—all in one platform.
          </p>
        </div>
        {/* Pricing tiers */}
        <div className={styles.pricingTiersContainer}>
          {featureTiers.map(
            (
              { title, monthlyPrice, buttonText, popular, inverse, features },
              idx
            ) => (
              <div
                key={idx}
                className={`${styles.card} ${
                  inverse ? styles.cardInverse : ""
                }`}
              >
                <div className={styles.cardHeader}>
                  <h3
                    className={`${styles.cardTitle} ${
                      inverse ? styles.cardTitleInverse : ""
                    }`}
                  >
                    {title}
                  </h3>
                  {popular && (
                    <div className={styles.popularBadge}>
                      <span className={styles.popularBadgeText}>Popular</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className={styles.priceInfo}>
                    <span className={styles.priceAmount}>{monthlyPrice}</span>
                  </div>
                  <button
                    className={`${styles.pricingButton} ${
                      inverse ? styles.pricingButtonInverse : ""
                    }`}
                  >
                    {buttonText}
                  </button>
                  <ul className={styles.featuresList}>
                    {features.map((feature, fIdx) => (
                      <li key={fIdx} className={styles.featureItem}>
                        <CgCheck
                          width={15}
                          height={15}
                          className={styles.checkIcon}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
