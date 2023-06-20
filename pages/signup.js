/**
 * SignupPage component for user registration.
 */

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import style from "../styles/Auth.module.css";
import Head from "next/head";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
/**
 * Signup
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/13/2023 - 9:55:38 PM
 * @author Sami Laayouni
 * @license MIT
 */
const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState();
  const [state, setState] = useState(0);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const authContext = useContext(AuthContext);
  const AuthServices = new AuthService(authContext);

  /**
   * Handle Toggle Password
   *
   * @date 6/13/2023 - 9:55:38 PM
   * @author Sami Laayouni
   * @license MIT
   */
  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };
  /**
   * Handles the signup action when the user clicks the signup button.
   */
  const handleSignup = async () => {
    try {
      console.log(first, last);
      const response = await AuthServices.create_user(
        email,
        password,
        first,
        last,
        selectedRole
      );
      if (response.token) {
        localStorage.setItem("token", response.token); // Store the token in local storage
        router.push("/dashboard"); // Redirect to the dashboard page
      } else {
        setError(response.error);
        document.getElementById("createAccount").innerText = "Create account.";
        document.getElementById("createAccount").disabled = false;
      }
    } catch (error) {
      setError(error.message);
      document.getElementById("createAccount").innerText = "Create account.";
      document.getElementById("createAccount").disabled = false;
    }
  };

  return (
    <div className={style.background}>
      <Head>
        <title>Signup | Noteswap</title>
      </Head>
      <div className={style.container}>
        <section className={style.left}>
          <h1>Sign up to Noteswap</h1>

          <p>Swap your way to success with Noteswap!</p>

          <p>Noteswap </p>

          <p>
            By signing up to Noteswap, you agree to our{" "}
            <Link href="/boring/terms-conditions">Terms and conditions</Link>{" "}
            and <Link href="/boring/privacy-policy">Privacy Policy</Link>
          </p>
        </section>

        <form
          className={style.form}
          onSubmit={(e) => {
            e.preventDefault();
            if (state == 0) {
              setState(1);
              setError("");
            } else {
              document.getElementById("createAccount").innerText =
                "Creating...";
              document.getElementById("createAccount").disabled = true;
              setError("");
              handleSignup();
            }
          }}
        >
          {!selectedRole && (
            <>
              <p className={style.labelCenter}>I am joining as a</p>

              <ul className={style.roles}>
                <li id="student" onClick={() => setSelectedRole("student")}>
                  Student
                </li>
                <li id="teacher" onClick={() => setSelectedRole("teacher")}>
                  Teacher
                </li>
              </ul>
            </>
          )}

          {selectedRole &&
            (state == 0 ? (
              <>
                <label className={style.labelForInput} htmlFor="emailSignup">
                  Email or username
                </label>
                <input
                  id="emailSignup"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  aria-required="true"
                  aria-invalid="true"
                  className={style.input}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <label className={style.labelForInput} htmlFor="passwordSignup">
                  Password
                </label>
                <div className={style.inputContainer}>
                  <input
                    id="passwordSignup"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    aria-required="true"
                    aria-invalid="true"
                    className={style.inputBlank}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className={style.toggleButton}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className={style.error}>{error}</p>
                <button type="submit" className={style.loginBtn}>
                  Next
                </button>
                <p className={style.orText}>-or-</p>
                <button type="button" className={style.thirdpartyloginBtn}>
                  Continue with Google
                </button>
                <button type="button" className={style.thirdpartyloginBtn}>
                  Continue with Metamask
                </button>
                <button type="button" className={style.thirdpartyloginBtn}>
                  Continue with Facebook (Boomer)
                </button>
              </>
            ) : (
              <>
                <label className={style.labelForInput} htmlFor="nameSignup">
                  First name
                </label>
                <input
                  id="nameSignup"
                  type="text"
                  placeholder="Enter your first name"
                  value={first}
                  aria-required="true"
                  aria-invalid="true"
                  className={style.input}
                  onChange={(e) => setFirst(e.target.value)}
                  required
                  autoFocus
                />
                <label className={style.labelForInput} htmlFor="namelSignup">
                  Last name
                </label>
                <input
                  id="namelSignup"
                  type="text"
                  placeholder="Enter your last name"
                  value={last}
                  aria-required="true"
                  aria-invalid="true"
                  className={style.input}
                  onChange={(e) => setLast(e.target.value)}
                  required
                  autoFocus
                />
                <p className={style.error}>{error}</p>
                <button
                  type="submit"
                  className={style.loginBtn}
                  id="createAccount"
                >
                  Create account
                </button>
              </>
            ))}

          <div className={style.accountContainer}>
            <Link href="/login" className={style.createNewAccount}>
              Already have an account?
            </Link>
          </div>
          {selectedRole && (
            <p
              style={{ cursor: "pointer" }}
              className={style.createNewAccount}
              onClick={() => {
                if (state != 0) {
                  setState(0);
                  setError("");
                } else {
                  setSelectedRole(null);
                  setError("");
                }
              }}
            >
              Back
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
