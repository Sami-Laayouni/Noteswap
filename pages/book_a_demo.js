import Header from "../components/New/Header";
import { useState } from "react";
import styles from "../styles/BookADemo.module.css";
import Footer from "../components/Layout/Footer";
import Image from "next/image";
import { FaGraduationCap } from "react-icons/fa";
export default function BookADemo() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    school: "",
    position: "",
    heardFrom: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/email/book_a_demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          school: "",
          position: "",
          heardFrom: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.infoSection}>
            <h1 style={{ fontFamily: "DMSans-Bold", fontSize: "2.3rem" }}>
              Ready to see our platform in action?
            </h1>
            <p>
              Talk to our team to see how we can manage all your extracurricular
              activities while providing you with valuable insights.
            </p>
            <h2 style={{ color: "var(--primary-color)" }}>
              Benefits of NoteSwap
            </h2>
            <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
              <li>
                ✔{" "}
                <span style={{ paddingLeft: "5px" }}>
                  Cut down on administrative work
                </span>
              </li>
              <li>
                ✔{" "}
                <span style={{ paddingLeft: "5px" }}>
                  Enhance your students&apos; portfolios
                </span>
              </li>
              <li>
                ✔{" "}
                <span style={{ paddingLeft: "5px" }}>
                  Valuable smart insights into students
                </span>
              </li>
            </ul>
            <h2 style={{ color: "var(--primary-color)" }}>
              Leading Schools Use NoteSwap
            </h2>
            <img width={110} height={110} src="/assets/asi.png"></img>
          </div>
          <div className={styles.formSection}>
            <FaGraduationCap className={styles.gradCapIcon} />
            <h2>Book a Demo</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="school"
                placeholder="School"
                value={formData.school}
                onChange={handleChange}
                required
              />
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className={styles.selectField}
              >
                <option value="" disabled>
                  Position Type
                </option>
                <option value="teacher">Teacher</option>
                <option value="administrator">Administrator</option>
                <option value="student">Student</option>
              </select>
              <select
                name="heardFrom"
                value={formData.heardFrom}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="" disabled>
                  How did you hear about us?
                </option>
                <option value="social-media">Social Media</option>
                <option value="friend">Friend/Colleague</option>
                <option value="website">Website</option>
              </select>
              <textarea
                name="message"
                placeholder="What are you looking for?"
                value={formData.message}
                onChange={handleChange}
                className={styles.textArea}
              ></textarea>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Request a Demo"}
              </button>
              {submitStatus === "success" && (
                <p style={{ color: "green" }}>
                  Demo request submitted successfully!
                </p>
              )}
              {submitStatus === "error" && (
                <p style={{ color: "red" }}>
                  Failed to submit demo request. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
