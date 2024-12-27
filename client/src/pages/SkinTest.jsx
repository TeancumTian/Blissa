import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Navbar from "../components/Navbar";

// 导入皮肤类型图片
import normalSkin from "../assets/images/skintypes/normal.png";
import drySkin from "../assets/images/skintypes/dry.png";
import oilySkin from "../assets/images/skintypes/oily.png";
import combinationSkin from "../assets/images/skintypes/combination.png";
import sensitiveSkin from "../assets/images/skintypes/sensitive.png";
import agingMatureSkin from "../assets/images/skintypes/mature.png";

const skinTypeImages = {
  normal: normalSkin,
  dry: drySkin,
  oily: oilySkin,
  combination: combinationSkin,
  sensitive: sensitiveSkin,
  agingMature: agingMatureSkin,
};

// 添加问题数组
const questions = [
  {
    question: "Your skin usually feels how?",
    options: [
      "Balanced and comfortable",
      "Dry and tight",
      "Some areas oily, others normal",
    ],
  },
  {
    question: "How is your skin's pore condition?",
    options: ["Very obvious", "Somewhat obvious", "Not very obvious"],
  },
  {
    question: "Do you tend to break out?",
    options: ["Rarely", "Occasionally", "Frequently"],
  },
  {
    question: "Does your skin feel oily after washing?",
    options: ["All areas", "Only T-zone", "Very little oil"],
  },
  {
    question: "Does your skin feel tight and dry?",
    options: ["Rarely", "Cheeks", "Often"],
  },
  {
    question: "Do you have fine lines and wrinkles?",
    options: ["None", "Eye area", "Quite noticeable"],
  },
  {
    question: "How often do you use skincare products?",
    options: ["Never", "2-3 times a week", "Every day"],
  },
  {
    question: "Is your skin uneven, with spots?",
    options: ["Rarely", "Some", "Quite a lot"],
  },
  {
    question: "Does your skin react negatively to certain skincare products?",
    options: ["Never", "Occasionally", "Frequently"],
  },
  {
    question: "Does your skin produce too much oil?",
    options: ["No", "A little", "Yes"],
  },
  {
    question: "Do you have wrinkles around your eyes?",
    options: ["No", "Yes", "Quite noticeable"],
  },
  {
    question: "How does your skin react during seasonal changes?",
    options: ["Stay the same", "Dry in winter", "Oilier in summer"],
  },
];

export default function SkinTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousTest, setPreviousTest] = useState(null);
  const [gptAnalysis, setGptAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const navigate = useNavigate();

  // 获取历史测试记录
  useEffect(() => {
    const fetchPreviousTest = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Not logged in");
          return;
        }

        const response = await fetch(`/api/skintest/latest`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            setPreviousTest(data.result);
            setResult(data.result);
            if (data.result.gptAnalysis) {
              setGptAnalysis({
                content: data.result.gptAnalysis,
                followUpQuestions: data.result.followUpQuestions || [],
              });
              setShowAnalysis(true);
            }
          }
        }
      } catch (error) {
        console.error("Failed to get history:", error);
      }
    };

    fetchPreviousTest();
  }, []);

  // 开始新测试的处理函数
  const handleStartNewTest = () => {
    setStartNewTest(true);
    setResult(null);
    setPreviousTest(null);
    setAnswers({});
    setCurrentQuestion(0);
    setGptAnalysis(null);
    setShowAnalysis(false);
  };

  const handleAnswer = async (index) => {
    const newAnswers = { ...answers, [currentQuestion]: index };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 转换答案对象为数组
      const answersArray = Array.from(
        { length: questions.length },
        (_, i) => newAnswers[i]
      );
      await submitTest(answersArray);
    }
  };

  const submitTest = async (finalAnswers) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Not logged in");
        return;
      }

      const response = await fetch(`/api/skintest/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          answers: Object.values(finalAnswers),
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Test submission failed");
      }

      const data = await response.json();
      setResult(data.result);
      setPreviousTest(data.result);
    } catch (error) {
      console.error("Error:", error);
      alert("Test submission failed, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Not logged in");
        return;
      }

      const skinTestData = {
        message:
          "Based on my skin test results, please provide personalized skincare advice.",
        skinTestResult: {
          summary: `User's skin type is ${
            result.skinType
          }, main characteristics include: ${result.description.join("; ")}`,
          skinType: result.skinType,
        },
      };

      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(skinTestData),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      // 更新 GPT 分析状态
      setGptAnalysis(data);
      setShowAnalysis(true);

      // 更新测试结果，包含 GPT 分析
      const updatedResult = {
        ...result,
        gptAnalysis: data.content,
        followUpQuestions: data.followUpQuestions,
      };
      setResult(updatedResult);

      // 保存更新后的结果
      const saveResponse = await fetch(`/api/skintest/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ result: updatedResult }),
      });

      if (!saveResponse.ok) {
        console.error("Failed to save analysis result");
      }
    } catch (error) {
      console.error("Continue button error:", error);
      alert("Failed to get personalized advice, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["min-h-screen"]}>
      <Navbar />
      <div className={`${styles["max-w-7xl"]} mx-auto px-4 pt-20`}>
        <h1 className="text-3xl font-bold text-emerald-900 mb-8 text-center">
          Skin Test
        </h1>

        {previousTest && !result && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
            <h3 className="text-xl font-semibold text-emerald-800 mb-4">
              Your Last Test Result
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={skinTypeImages[previousTest.skinType]}
                alt={`${previousTest.skinType} skin type`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-emerald-900">
                  Skin Type: {previousTest.skinType}
                </p>
                <p className="text-sm text-emerald-600">
                  Test Date:{" "}
                  {new Date(previousTest.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setResult(previousTest)}
              className={`${styles["bg-gradient"]} px-4 py-2 rounded-lg text-white mr-2`}
            >
              View Details
            </button>
            <button
              onClick={handleStartNewTest}
              className="px-4 py-2 text-emerald-700 hover:text-emerald-900"
            >
              Take New Test
            </button>
          </div>
        )}

        {!result ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-emerald-800 text-center">
                Question {currentQuestion + 1} / {questions.length}
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className={`${styles["bg-gradient"]} h-2.5 rounded-full transition-all duration-300`}
                  style={{
                    width: `${
                      ((currentQuestion + 1) / questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-emerald-800 text-center">
                {questions[currentQuestion].question}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`${styles["bg-gradient"]} px-6 py-4 rounded-lg text-white w-full text-left hover:opacity-90 transition-opacity`}
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-emerald-900 mb-4">
                Your Skin Type: {result.skinType}
              </h2>
              <div className="relative w-64 h-64 mx-auto mb-8">
                <img
                  src={skinTypeImages[result.skinType]}
                  alt={`${result.skinType} skin type`}
                  className="w-full h-full object-cover rounded-full"
                />
                <div
                  className={`${styles["bg-gradient"]} absolute inset-0 rounded-full opacity-10`}
                ></div>
              </div>
            </div>

            <div className="space-y-4 bg-white/50 backdrop-blur-sm rounded-lg p-6">
              {result.description.map((desc, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`${styles["bg-gradient"]} w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-emerald-800 flex-1">{desc}</p>
                </div>
              ))}
            </div>

            {showAnalysis ? (
              <div className="space-y-6 bg-white/50 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-emerald-800">
                  Personalized Skincare Advice
                </h3>
                {loading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
                  </div>
                ) : (
                  <>
                    <div className="prose prose-emerald max-w-none">
                      <p className="text-emerald-800 whitespace-pre-wrap">
                        {gptAnalysis?.content}
                      </p>
                    </div>

                    {gptAnalysis?.followUpQuestions?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-emerald-800 mb-3">
                          You might want to ask:
                        </h4>
                        <div className="space-y-2">
                          {gptAnalysis.followUpQuestions.map(
                            (question, index) => (
                              <div
                                key={index}
                                className="p-3 bg-emerald-50 rounded-lg text-emerald-700 cursor-pointer hover:bg-emerald-100 transition-colors"
                                onClick={() =>
                                  navigate("/chat", {
                                    state: {
                                      initialQuestion: question,
                                      skinTestResult: result,
                                    },
                                  })
                                }
                              >
                                {question}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={handleContinue}
                disabled={loading}
                className={`${
                  styles["bg-gradient"]
                } px-6 py-3 rounded-lg text-white w-full text-center text-lg font-medium hover:opacity-90 transition-opacity ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Analyzing..." : "Get Personalized Advice"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
