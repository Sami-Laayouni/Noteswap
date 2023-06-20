/**
 * LoginPage component for user login.
 */

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";
import AuthService from "../services/AuthService";
import Head from "next/head";
import style from "../styles/Auth.module.css";
import Link from "next/link";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
/**
 * Login
 *
 * @return {JSX.Element} The rendered page.
 * @date 6/13/2023 - 9:55:38 PM
 * @author Sami Laayouni
 * @license MIT
 */
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
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
   * Handle login
   *
   * @date 6/13/2023 - 9:55:38 PM
   * @author Sami Laayouni
   * @license MIT
   */
  const handleLogin = async () => {
    try {
      const response = await AuthServices.login(email, password);
      if (response.token) {
        // Store the token in local storage
        localStorage.setItem("token", response.token);
        // Redirect to the dashboard page after successful login
        router.push("/dashboard");
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={style.background}>
      <Head>
        <title>Login | Noteswap</title>
      </Head>
      <div className={style.container}>
        <section className={style.left}>
          <h1>Log in to Noteswap</h1>
        </section>

        <form
          className={style.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <label className={style.labelForInput} htmlFor="emailLogin">
            Email or username
          </label>
          <input
            id="emailLogin"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            aria-required="true"
            aria-invalid="true"
            className={style.input}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <label className={style.labelForInput} htmlFor="passwordLogin">
            Password
          </label>
          <div className={style.inputContainer}>
            <input
              id="passwordLogin"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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
          <Link href="/forgotpassword" className={style.forgotpassword}>
            Forgot password?
          </Link>
          <p className={style.error}>{error}</p>
          <button type="submit" className={style.loginBtn}>
            Log in
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

          <div className={style.accountContainer}>
            <Link href="/signup" className={style.createNewAccount}>
              Create a new account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
