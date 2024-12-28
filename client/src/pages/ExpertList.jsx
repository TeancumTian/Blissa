import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Navbar from "../components/Navbar";

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/experts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取专家列表失败");
      }

      const data = await response.json();
      setExperts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExpertClick = (expertId) => {
    navigate(`/experts/${expertId}`);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h1>专家列表</h1>
        {error && <div className={styles.error}>{error}</div>}

        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          <div className={styles.expertGrid}>
            {experts.map((expert) => (
              <div
                key={expert._id}
                className={styles.expertCard}
                onClick={() => handleExpertClick(expert._id)}
              >
                <img
                  src={expert.profileImage || "/default-avatar.png"}
                  alt={expert.name}
                  className={styles.expertImage}
                />
                <h3>{expert.name}</h3>
                <p className={styles.specialty}>{expert.specialty}</p>
                <p className={styles.description}>{expert.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertList;
