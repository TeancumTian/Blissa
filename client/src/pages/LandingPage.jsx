import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>BLISSA</div>
        <div className={styles.navLinks}>
          <Link
            to="/login"
            className={styles.loginButton}
          >
            登录
          </Link>
          <Link
            to="/expert-register"
            className={styles.registerButton}
          >
            成为专家
          </Link>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            智能护肤专家
            <br />
            您的个性化皮肤顾问
          </h1>
          <p className={styles.subtitle}>
            利用AI技术为您提供专业的皮肤护理建议
            <br />
            连接真实专家，获得个性化解决方案
          </p>
          <div className={styles.cta}>
            <Link
              to="/login"
              className={styles.primaryButton}
            >
              开始护理旅程
            </Link>
            <Link
              to="/about"
              className={styles.secondaryButton}
            >
              了解更多
            </Link>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🤖</div>
            <h3>AI智能分析</h3>
            <p>快速准确的皮肤状况分析</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>👩‍⚕️</div>
            <h3>专家咨询</h3>
            <p>连接真实皮肤护理专家</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            <h3>个性化方案</h3>
            <p>定制专属护肤建议</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
