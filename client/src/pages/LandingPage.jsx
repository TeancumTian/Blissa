import React from "react";
import styles from "./LandingPage.module.css";
import appPreview from "../assets/images/apppreview.png";
import chatPreview from "../assets/images/chatpreview.png";
import chatPreviewBackground from "../assets/images/chatpreviewBackground.png";
import featureDot from "../assets/images/featuredot.png";
import quoteIcon from "../assets/images/quote.png";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import { useState } from "react";

// 在组件外部初始化 EmailJS
emailjs.init("bBuxAXoiHuS0574Fj"); // 您的 Public Key

const LandingPage = () => {
  // 为每个部分创建观察器
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [testimonialRef, testimonialInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [contactRef, contactInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });

    try {
      const result = await emailjs.sendForm(
        "service_kh537tn", // 您的 Service ID
        "template_gfpidun", // 您的 Template ID
        e.target,
        "bBuxAXoiHuS0574Fj" // 您的 Public Key
      );

      console.log("Success:", result.text); // 添加日志

      setFormStatus({
        loading: false,
        success: true,
        error: null,
      });

      e.target.reset();

      setTimeout(() => {
        setFormStatus({
          loading: false,
          success: false,
          error: null,
        });
      }, 3000);
    } catch (error) {
      console.error("Error:", error); // 添加错误日志

      setFormStatus({
        loading: false,
        success: false,
        error: `发送失败: ${error.message || "请稍后重试"}`,
      });
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <svg
          width="92"
          height="50"
          viewBox="0 0 92 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.6842 35.3304V14.6066H21.1137V33.1058H30.9195L30.656 35.3304H18.6842ZM33.777 35.3304V14.6066H36.2065V35.3304H33.777ZM47.3525 35.8865C44.1327 35.8865 41.9082 34.6572 40.2397 31.5544L41.996 30.3543L42.4936 30.4714C43.7815 32.8131 45.1865 33.7498 47.3233 33.7498C49.6942 33.7498 51.3627 32.1106 51.3627 30.1202C51.3627 28.2468 50.426 26.9882 46.6793 25.4368C42.3765 23.6513 40.913 21.8072 40.913 19.1729C40.913 16.3043 43.1668 14.0505 47.0598 14.0505C49.9284 14.0505 51.8895 15.2798 53.0018 17.2703L51.3041 18.4411L50.8065 18.324C49.9284 16.9483 48.8454 16.158 47.0013 16.158C44.7474 16.158 43.4302 17.4166 43.4302 19.1143C43.4302 20.6949 44.2791 21.6023 47.938 23.2708C52.7091 25.4368 53.88 27.2223 53.88 30.0909C53.88 33.2229 51.187 35.8865 47.3525 35.8865ZM63.9318 35.8865C60.712 35.8865 58.4874 34.6572 56.8189 31.5544L58.5752 30.3543L59.0728 30.4714C60.3607 32.8131 61.7657 33.7498 63.9025 33.7498C66.2734 33.7498 67.9419 32.1106 67.9419 30.1202C67.9419 28.2468 67.0052 26.9882 63.2585 25.4368C58.9557 23.6513 57.4922 21.8072 57.4922 19.1729C57.4922 16.3043 59.746 14.0505 63.639 14.0505C66.5076 14.0505 68.4687 15.2798 69.581 17.2703L67.8833 18.4411L67.3857 18.324C66.5076 16.9483 65.4246 16.158 63.5805 16.158C61.3266 16.158 60.0095 17.4166 60.0095 19.1143C60.0095 20.6949 60.8583 21.6023 64.5172 23.2708C69.2883 25.4368 70.4592 27.2223 70.4592 30.0909C70.4592 33.2229 67.7662 35.8865 63.9318 35.8865ZM91.5754 35.3304H88.9702L86.7164 29.8567H76.6472L74.3934 35.3304H71.7882L80.7451 14.6066H82.677L91.5754 35.3304ZM80.189 21.1925L77.4961 27.7785H85.8383L83.1161 21.1925C82.5599 19.8168 82.0916 18.7045 81.6818 17.6215H81.6233C81.2135 18.7045 80.7451 19.8168 80.189 21.1925Z"
            fill="white"
          />
          <path
            d="M9.67931 20.506C9.21259 20.506 8.76255 20.6088 8.3375 20.8004C8.36806 20.5171 8.38195 20.2309 8.38751 19.9392C8.38751 19.8976 8.38751 19.8559 8.38751 19.8142C8.38751 16.2194 6.43453 13.3052 4.02595 13.3052C3.16753 13.3052 2.36745 13.6747 1.69238 14.3165V34.1129H10.9767C12.0184 33.6629 12.9074 32.685 13.5103 31.3876C13.5797 31.2376 13.6464 31.082 13.7075 30.9209C13.7908 30.7042 13.8686 30.482 13.9353 30.2514C14.1798 29.4319 14.3187 28.5262 14.3298 27.5761C14.3298 27.5317 14.3298 27.4872 14.3298 27.4428C14.3298 23.6118 12.2462 20.5032 9.67931 20.5032V20.506Z"
            stroke="white"
            strokeWidth="2.22245"
            strokeMiterlimit="10"
            strokeLinecap="round"
          />
        </svg>
      </header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className={styles.hero}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 50 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Welcome to Blissa</h1>
        <p className={styles.subtitle}>
          Blissa connects skincare seekers with expert estheticians, simplifying
          the search for affordable, accessible solutions. Ask your questions,
          and Blissa finds the perfect match for your needs.
        </p>
        <button
          className={styles.downloadButton}
          onClick={() => {
            window.location.href = "https://testflight.apple.com/join/K2pmVrSj";
          }}
        >
          Download App
        </button>
        <div className={styles.appPreview}>
          <img
            src={appPreview}
            alt="Blissa App Preview"
          />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        className={styles.features}
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: featuresInView ? 1 : 0,
          y: featuresInView ? 0 : 50,
        }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={styles.chatPreviewContainer}
          initial={{ scale: 0.8 }}
          animate={{ scale: featuresInView ? 1 : 0.8 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={chatPreviewBackground}
            alt="Background"
            className={styles.chatPreviewBackground}
          />
          <img
            src={chatPreview}
            alt="Chat Preview"
            className={styles.chatPreview}
          />
        </motion.div>

        <motion.div
          className={styles.featuresList}
          initial={{ opacity: 0 }}
          animate={{ opacity: featuresInView ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <img
                src={featureDot}
                alt="Feature Icon"
              />
            </div>
            <div className={styles.featureContent}>
              <h3>Pressed For Time?</h3>
              <p>
                Blissa offers instant access to expert recommendations without
                lengthy searches.
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <img
                src={featureDot}
                alt="Feature Icon"
              />
            </div>
            <div className={styles.featureContent}>
              <h3>Flexible Solutions</h3>
              <p>
                Blissa offers custom tools for estheticians to manage time
                bookings.
              </p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <img
                src={featureDot}
                alt="Feature Icon"
              />
            </div>
            <div className={styles.featureContent}>
              <h3>Our Beta Program</h3>
              <p>Join now to enjoy early access at reduced rates.</p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Testimonial Section */}
      <motion.section
        ref={testimonialRef}
        className={styles.testimonial}
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: testimonialInView ? 1 : 0,
          y: testimonialInView ? 0 : 50,
        }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={quoteIcon}
          alt="Quote"
          className={styles.quoteIcon}
        />
        <blockquote>
          "Healthy skin is key to confidence, but finding effective solutions
          can be costly and frustrating. Blissa changes this by being the first
          platform to seamlessly connect clients with expert estheticians,
          offering personalized care while empowering professionals in an
          untapped market."
        </blockquote>
        <p className={styles.author}>- Adela Montoya, Founder</p>
      </motion.section>

      {/* Contact Form */}
      <motion.section
        ref={contactRef}
        className={styles.contact}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: contactInView ? 1 : 0, y: contactInView ? 0 : 50 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Contact Us</h2>
        <p>Questions? Let us know how we can help!</p>
        <form
          className={styles.contactForm}
          onSubmit={handleSubmit}
        >
          <div className={styles.formRow}>
            <input
              type="text"
              name="from_name"
              placeholder="First name"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last name"
              required
            />
          </div>
          <div className={styles.formRow}>
            <input
              type="email"
              name="reply_to"
              placeholder="Email"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
            />
          </div>
          <textarea
            name="message"
            placeholder="Type your message..."
            required
          ></textarea>
          <button
            type="submit"
            className={styles.contactButton}
            disabled={formStatus.loading}
          >
            {formStatus.loading ? "Sending..." : "Contact Us"}
          </button>

          {formStatus.success && (
            <p className={styles.successMessage}>Message sent successfully!</p>
          )}

          {formStatus.error && (
            <p className={styles.errorMessage}>{formStatus.error}</p>
          )}
        </form>
      </motion.section>

      {/* Footer */}
      <footer className={styles.footer}>
        <svg
          width="92"
          height="50"
          viewBox="0 0 92 50"
          fill="none"
          xmlns="http://www.w3.org/2000.svg"
        >
          <path
            d="M18.6842 35.3304V14.6066H21.1137V33.1058H30.9195L30.656 35.3304H18.6842ZM33.777 35.3304V14.6066H36.2065V35.3304H33.777ZM47.3525 35.8865C44.1327 35.8865 41.9082 34.6572 40.2397 31.5544L41.996 30.3543L42.4936 30.4714C43.7815 32.8131 45.1865 33.7498 47.3233 33.7498C49.6942 33.7498 51.3627 32.1106 51.3627 30.1202C51.3627 28.2468 50.426 26.9882 46.6793 25.4368C42.3765 23.6513 40.913 21.8072 40.913 19.1729C40.913 16.3043 43.1668 14.0505 47.0598 14.0505C49.9284 14.0505 51.8895 15.2798 53.0018 17.2703L51.3041 18.4411L50.8065 18.324C49.9284 16.9483 48.8454 16.158 47.0013 16.158C44.7474 16.158 43.4302 17.4166 43.4302 19.1143C43.4302 20.6949 44.2791 21.6023 47.938 23.2708C52.7091 25.4368 53.88 27.2223 53.88 30.0909C53.88 33.2229 51.187 35.8865 47.3525 35.8865ZM63.9318 35.8865C60.712 35.8865 58.4874 34.6572 56.8189 31.5544L58.5752 30.3543L59.0728 30.4714C60.3607 32.8131 61.7657 33.7498 63.9025 33.7498C66.2734 33.7498 67.9419 32.1106 67.9419 30.1202C67.9419 28.2468 67.0052 26.9882 63.2585 25.4368C58.9557 23.6513 57.4922 21.8072 57.4922 19.1729C57.4922 16.3043 59.746 14.0505 63.639 14.0505C66.5076 14.0505 68.4687 15.2798 69.581 17.2703L67.8833 18.4411L67.3857 18.324C66.5076 16.9483 65.4246 16.158 63.5805 16.158C61.3266 16.158 60.0095 17.4166 60.0095 19.1143C60.0095 20.6949 60.8583 21.6023 64.5172 23.2708C69.2883 25.4368 70.4592 27.2223 70.4592 30.0909C70.4592 33.2229 67.7662 35.8865 63.9318 35.8865ZM91.5754 35.3304H88.9702L86.7164 29.8567H76.6472L74.3934 35.3304H71.7882L80.7451 14.6066H82.677L91.5754 35.3304ZM80.189 21.1925L77.4961 27.7785H85.8383L83.1161 21.1925C82.5599 19.8168 82.0916 18.7045 81.6818 17.6215H81.6233C81.2135 18.7045 80.7451 19.8168 80.189 21.1925Z"
            fill="white"
          />
          <path
            d="M9.67931 20.506C9.21259 20.506 8.76255 20.6088 8.3375 20.8004C8.36806 20.5171 8.38195 20.2309 8.38751 19.9392C8.38751 19.8976 8.38751 19.8559 8.38751 19.8142C8.38751 16.2194 6.43453 13.3052 4.02595 13.3052C3.16753 13.3052 2.36745 13.6747 1.69238 14.3165V34.1129H10.9767C12.0184 33.6629 12.9074 32.685 13.5103 31.3876C13.5797 31.2376 13.6464 31.082 13.7075 30.9209C13.7908 30.7042 13.8686 30.482 13.9353 30.2514C14.1798 29.4319 14.3187 28.5262 14.3298 27.5761C14.3298 27.5317 14.3298 27.4872 14.3298 27.4428C14.3298 23.6118 12.2462 20.5032 9.67931 20.5032V20.506Z"
            stroke="white"
            strokeWidth="2.22245"
            strokeMiterlimit="10"
            strokeLinecap="round"
          />
        </svg>
      </footer>
    </div>
  );
};

export default LandingPage;
