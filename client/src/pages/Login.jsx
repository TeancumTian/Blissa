import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    localStorage.setItem("token", "your-auth-token");
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>BLISSA</h1>
          <p className={styles.subtitle}>Simplify Skincare</p>
        </div>
        <div className={styles.content}>
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label
                htmlFor="email"
                className={styles.label}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label
                htmlFor="password"
                className={styles.label}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
              />
            </div>
            <button
              type="submit"
              className={styles.loginButton}
            >
              Log In
            </button>
          </form>
          <div className={styles.forgotPassword}>
            <a
              href="#"
              className={styles.link}
            >
              Forgot password?
            </a>
          </div>
          <div className={styles.socialLogin}>
            <p className={styles.socialText}>Or log in with</p>
            <div className={styles.socialButtons}>
              <button className={styles.socialButton}>
                <img
                  src="/placeholder.svg"
                  alt="Google"
                  className={styles.socialIcon}
                />
                Google
              </button>
              <button className={styles.socialButton}>
                <img
                  src="/placeholder.svg"
                  alt="Apple"
                  className={styles.socialIcon}
                />
                Apple
              </button>
            </div>
          </div>
          <p className={styles.signupText}>
            Don't have an account?{" "}
            <a
              href="#"
              className={styles.link}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
