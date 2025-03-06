import Header from "../components/New/Header";
import { useState } from "react";
import styles from "../styles/BookADemo.module.css";
import Footer from "../components/Layout/Footer";
import Image from "next/image";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
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
            <Image src={"/asi.jpeg"} width={50} height={50} />
          </div>
          <div className={styles.formSection}>
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

              <button type="submit" className={styles.submitButton}>
                Request a Demo
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
