import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Blissa</Link>
      </div>
      <div className={styles.navLinks}>
        <Link to="/home">Home</Link>
        <Link to="/experts">Experts</Link>
        <Link to="/skintest">Skin Test</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
