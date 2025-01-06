import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // 保存用户信息到 localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userRole", data.role || "user"); // 确保设置默认角色

      // 根据用户角色导航到不同页面
      if (data.role === "expert") {
        navigate("/expert-dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Blissa</h1>
        <h2>Simplify Skincare</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.loginButton}
          >
            Login
          </button>
        </form>
        <p className={styles.registerLink}>
          <a href="/register">Don't have an account? Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
