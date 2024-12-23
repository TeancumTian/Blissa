import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import {
  Button,
  Card,
  CardContent,
  Progress,
} from "./components/ui/PlaceHolder";
import {
  Book,
  HomeIcon,
  MessageCircle,
  TreesIcon as Plant,
  Video,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function App() {
  const [currentQuote, setCurrentQuote] = useState({
    content: "Loading...",
    category: "",
    language: "en",
  });

  const fetchRandomQuote = async () => {
    try {
      // 可以通过 language 参数指定获取中文或英文语录
      const response = await fetch("/api/quotes/random?language=en");
      if (!response.ok) {
        throw new Error("获取语录失败");
      }
      const data = await response.json();
      setCurrentQuote(data);
    } catch (error) {
      console.error("Error fetching quote:", error);
      // 设置一个默认语录，以防获取失败
      setCurrentQuote({
        content: "Beauty comes from inner confidence.",
        category: "confidence",
        language: "en",
      });
    }
  };

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  return (
    <div className={styles["min-h-screen"]}>
      <div className={styles["max-w-7xl"]}>
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-900">BLISSA</h1>
            <p className="text-lg text-emerald-800">Simplify Skincare</p>
          </div>
          <Navbar />
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Welcome Section - Updated with Quote */}
          <Card className={styles["bg-white-50"]}>
            <CardContent className="p-6 flex flex-col items-center gap-6">
              <div className="space-y-4 text-center w-full">
                <h2 className="text-3xl font-bold text-emerald-900">
                  Daily Inspiration
                </h2>
                <button
                  onClick={fetchRandomQuote}
                  className={`${styles["bg-gradient"]} px-4 py-2 rounded-lg w-full`}
                >
                  <p className="text-xl text-gray-900 italic">
                    "{currentQuote.content}"
                  </p>
                  <div className="mt-4 text-sm text-gray-700 capitalize">
                    #{currentQuote.category}
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Ask AI Card */}
          <Card className={styles["bg-white-50"]}>
            <CardContent className="p-6 flex flex-col items-center gap-6">
              <div className="space-y-4 text-center w-full">
                <h3 className="text-xl font-semibold text-emerald-900 mb-4">
                  Ask Blissa AI
                </h3>
                <Link to="/chat">
                  <button
                    className={`${styles["bg-gradient"]} px-4 py-2 rounded-lg text-white w-full`}
                  >
                    Ask Now
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Card */}
          <Card className={styles["bg-white-50"]}>
            <CardContent className="p-6 flex flex-col items-center gap-6">
              <div className="space-y-4 text-center w-full">
                <h3 className="text-xl font-semibold text-emerald-900 mb-4">
                  Create Appointment
                </h3>
                <Link to="/appointment">
                  <button
                    className={`${styles["bg-gradient"]} px-4 py-2 rounded-lg text-white w-full`}
                  >
                    Book Now
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
