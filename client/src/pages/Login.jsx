import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/create";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("登录成功，token:", data.token);
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/");
        } else {
          setError("服务器响应中缺少token");
        }
      } else {
        setError(data.msg || "认证失败");
      }
    } catch (err) {
      console.error("认证错误:", err);
      setError(err.message || "服务器错误,请稍后重试");
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
