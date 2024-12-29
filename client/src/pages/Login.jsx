import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "登录失败");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("登录成功，token:", data.token);
      console.log("用户信息:", data.user);

      if (data.user.role === "expert") {
        navigate("/expert-dashboard");
      } else {
        navigate("/appointments");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>BLISSA</h1>
          <p className={styles.subtitle}>Simplify Skincare</p>
        </div>
        <div className={styles.content}>
          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            {error && <div className={styles.error}>{error}</div>}
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
                value={formData.email}
                onChange={handleInputChange}
                required
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
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button
              type="submit"
              className={styles.loginButton}
            >
              {isLogin ? "登录" : "注册"}
            </button>
            <div className={styles.links}>
              <Link to="/register">普通用户注册</Link>
              <Link to="/expert-register">成为专家</Link>
            </div>
          </form>
          <p className={styles.signupText}>
            {isLogin ? "还没有账号?" : "已有账号?"}{" "}
            <a
              href="#"
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                setIsLogin(!isLogin);
              }}
            >
              {isLogin ? "注册" : "登录"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
