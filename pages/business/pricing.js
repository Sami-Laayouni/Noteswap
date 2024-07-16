import { useState } from "react";
import style from "../../styles/Pricing.module.css";
import { useRouter } from "next/router";

// Configuration object with per-student rates and features
const pricingConfig = [
  {
    range: [5, 250],
    rates: {
      Basic: 0,
      Standard: 1,
      Premium: 2,
    },
    features: {
      Basic: [
        "Note Swapping",
        "Access to All Opportunities",
        "Community Service Tracking",
        "Self-building Transcripts",
        "School Calendar",
      ],
      Standard: [
        "Includes all Basic features",
        "Tutoring",
        "School Handbook Chatbot",
        "AI Feedback for Notes",
        "Detect AI Text",
      ],
      Premium: [
        "Complete Feature Suite",
        "Enhanced Security Features",
        "Multi-Campus Management",
        "Priority Support",
      ],
    },
  },
  {
    range: [251, 500],
    rates: {
      Basic: 0.5,
      Standard: 0.8,
      Premium: 1.8,
    },
    features: {
      Basic: [
        "Note Swapping",
        "Access to All Opportunities",
        "Community Service Tracking",
        "Self-building Transcripts",
        "School Calendar",
      ],
      Standard: [
        "Includes all Basic features",
        "Tutoring",
        "School Handbook Chatbot",
        "AI Feedback for Notes",
        "Detect AI Text",
      ],
      Premium: [
        "Complete Feature Suite",
        "Enhanced Security Features",
        "Multi-Campus Management",
        "Priority Support",
      ],
    },
  },
  {
    range: [501, 1000],
    rates: {
      Basic: 0.6,
      Standard: 1,
      Premium: 1.2,
    },
    features: {
      Basic: [
        "Note Swapping",
        "Access to All Opportunities",
        "Community Service Tracking",
        "Self-building Transcripts",
        "School Calendar",
      ],
      Standard: [
        "Includes all Basic features",
        "Tutoring",
        "School Handbook Chatbot",
        "AI Feedback for Notes",
        "Detect AI Text",
      ],
      Premium: [
        "Complete Feature Suite",
        "Enhanced Security Features",
        "Multi-Campus Management",
        "Priority Support",
      ],
    },
  },
  {
    range: [1001, 5000],
    rates: {
      Basic: 0.5,
      Standard: 0.8,
      Premium: 1.1,
    },
    features: {
      Basic: [
        "Note Swapping",
        "Access to All Opportunities",
        "Community Service Tracking",
        "Self-building Transcripts",
        "School Calendar",
      ],
      Standard: [
        "Includes all Basic features",
        "Tutoring",
        "School Handbook Chatbot",
        "AI Feedback for Notes",
        "Detect AI Text",
      ],
      Premium: [
        "Complete Feature Suite",
        "Enhanced Security Features",
        "Multi-Campus Management",
        "Priority Support",
      ],
    },
  },
];

function Pricing() {
  const [students, setStudents] = useState("");
  const router = useRouter();

  const handleSelect = (packageType) => {
    console.log(`Selected package: ${packageType}`);
    if (localStorage.getItem("userInfo")) {
      localStorage.setItem("schoolPlan", packageType);
      router.push("/for_schools");
    } else {
      router.push("/business/signup");
    }
  };

  const getPricingCards = () => {
    const numStudents = parseInt(students);
    if (!numStudents || numStudents < 5) {
      return <p>Please enter a valid number of students (5 or more).</p>;
    }

    const matchedTier = pricingConfig.find(
      (config) =>
        numStudents >= config.range[0] && numStudents <= config.range[1]
    );
    if (matchedTier) {
      const maxStudents = matchedTier.range[1];
      return (
        <div className={style.cardContainer}>
          {Object.entries(matchedTier.rates).map(([tier, rate]) => (
            <div
              key={tier}
              className={`${style.card} ${
                tier === "Standard" ? style.recommended : ""
              }`}
            >
              <h2>{tier} Package</h2>
              {tier === "Standard" && (
                <div className={style.recommendedLabel}>Recommended</div>
              )}
              <ul>
                {matchedTier.features[tier].map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              {rate ? (
                <p>Price: ${rate * maxStudents}/month</p>
              ) : (
                <p>Price: Free</p>
              )}
              <button
                className={style.selectButton}
                onClick={() => handleSelect(tier)}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      );
    }

    return <p>No pricing available for this number of students.</p>;
  };

  return (
    <div className={style.body}>
      <h1 className={style.header}>Flexible to meet your needs</h1>
      <input
        className={style.input}
        type="number"
        min={5}
        placeholder="Enter the number of students in your school"
        value={students}
        onChange={(e) => setStudents(e.target.value)}
      />
      <div className={style.pricingInfo}>
        {students ? (
          getPricingCards()
        ) : (
          <p>Enter the number of students to see pricing options</p>
        )}
      </div>
    </div>
  );
}

export default Pricing;
