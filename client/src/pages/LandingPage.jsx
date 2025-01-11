import React from "react";
import styles from "./LandingPage.module.css";
import appPreview from "../assets/images/app-preview.png";
import blissaLogo from "../assets/images/blissa-logo.png";
import chatPreview from "../assets/images/chat-preview.png";

const LandingPage = () => {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <img
          src={blissaLogo}
          alt="Blissa"
          className={styles.logo}
        />
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Welcome to Blissa</h1>
        <p className={styles.subtitle}>
          Blissa connects skincare seekers with expert estheticians, simplifying
          the search for affordable, accessible solutions. Ask your questions,
          and Blissa finds the perfect match for your needs.
        </p>
        <button className={styles.downloadButton}>Download App</button>
        <div className={styles.appPreview}>
          <img
            src={appPreview}
            alt="Blissa App Preview"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <img
          src={chatPreview}
          alt="Chat Preview"
          className={styles.chatPreview}
        />
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}></div>
            <h3>Pressed For Time?</h3>
            <p>
              Blissa offers instant access to expert recommendations without
              lengthy searches.
            </p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}></div>
            <h3>Flexible Solutions</h3>
            <p>
              Blissa offers custom tools for estheticians to manage time
              bookings.
            </p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}></div>
            <h3>Our Beta Program</h3>
            <p>Join now to enjoy early access at reduced rates.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className={styles.testimonial}>
        <blockquote>
          "Healthy skin is key to confidence, but finding effective solutions
          can be costly and frustrating. Blissa changes this by being the first
          platform to seamlessly connect clients with expert estheticians,
          offering personalized care while empowering professionals in an
          untapped market."
        </blockquote>
        <p className={styles.author}>- Adela Montoya, Founder</p>
      </section>

      {/* Contact Form */}
      <section className={styles.contact}>
        <h2>Contact Us</h2>
        <p>Questions? Let us know how we can help!</p>
        <form className={styles.contactForm}>
          <div className={styles.formRow}>
            <input
              type="text"
              placeholder="First name"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              required
            />
          </div>
          <div className={styles.formRow}>
            <input
              type="email"
              placeholder="Email"
              required
            />
            <input
              type="tel"
              placeholder="Phone number"
            />
          </div>
          <textarea
            placeholder="Type your message..."
            required
          ></textarea>
          <button
            type="submit"
            className={styles.contactButton}
          >
            Contact Us
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <img
          src={blissaLogo}
          alt="Blissa"
          className={styles.footerLogo}
        />
      </footer>
    </div>
  );
};

export default LandingPage;
