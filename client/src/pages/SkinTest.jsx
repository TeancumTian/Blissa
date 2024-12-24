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
    question: "您的皮肤通常感觉如何？",
    options: ["平衡舒适", "干燥紧绷", "某些部位油腻，其他部位正常"],
  },
  {
    question: "您的毛孔状况如何？",
    options: ["非常明显", "有些明显", "不太明显"],
  },
  {
    question: "您是否容易长痘？",
    options: ["很少", "偶尔", "经常"],
  },
  {
    question: "洗脸后皮肤会持续出油吗？",
    options: ["部分区域都会", "仅T区会", "很少出油"],
  },
  {
    question: "您的皮肤会感觉紧绷干燥吗？",
    options: ["很少", "脸颊部位会", "经常"],
  },
  {
    question: "您有细纹和皱纹吗？",
    options: ["完全没有", "眼部有一些", "比较明显"],
  },
  {
    question: "您多久使用一次护肤品？",
    options: ["从不使用", "每周2-3次", "每天使用"],
  },
  {
    question: "您的肤色是否不均匀，有色斑？",
    options: ["很少", "有一些", "比较多"],
  },
  {
    question: "您的皮肤对某些护肤品是否会过敏？",
    options: ["从不", "偶尔", "经常"],
  },
  {
    question: "您的皮肤会分泌过多油脂吗？",
    options: ["不会", "有一点", "会"],
  },
  {
    question: "您的眼部是否有细纹？",
    options: ["没有", "有", "比较明显"],
  },
  {
    question: "季节变化时您的皮肤会有什么反应？",
    options: ["保持不变", "冬天更干", "夏天更油"],
  },
];

// 修改 API 调用地址
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
          console.log("未登录状态");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/skintest/latest`, {
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
        console.error("获取历史记录失败:", error);
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
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/skintest/submit`, {
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
        throw new Error("提交测试失败");
      }

      const data = await response.json();
      setResult(data.result);
      setPreviousTest(data.result);
    } catch (error) {
      console.error("Error:", error);
      alert("测试提交失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const skinTestData = {
        message: "请根据我的皮肤测试结果，为我提供个性化的护肤建议。",
        skinTestResult: {
          summary: `用户的皮肤类型为${
            result.skinType
          }，主要特征包括：${result.description.join("；")}`,
          skinType: result.skinType,
        },
      };

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(skinTestData),
      });

      if (!response.ok) {
        throw new Error("请求失败");
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
      const saveResponse = await fetch(`${API_BASE_URL}/api/skintest/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ result: updatedResult }),
      });

      if (!saveResponse.ok) {
        console.error("保存分析结果失败");
      }
    } catch (error) {
      console.error("处理继续按钮错误:", error);
      alert("获取个性化建议失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["min-h-screen"]}>
      <Navbar />
      <div className={`${styles["max-w-7xl"]} mx-auto px-4 pt-20`}>
        <h1 className="text-3xl font-bold text-emerald-900 mb-8 text-center">
          皮肤测试
        </h1>

        {previousTest && !result && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
            <h3 className="text-xl font-semibold text-emerald-800 mb-4">
              您的上次测试结果
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={skinTypeImages[previousTest.skinType]}
                alt={`${previousTest.skinType} skin type`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-emerald-900">
                  皮肤类型: {previousTest.skinType}
                </p>
                <p className="text-sm text-emerald-600">
                  测试时间:{" "}
                  {new Date(previousTest.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setResult(previousTest)}
              className={`${styles["bg-gradient"]} px-4 py-2 rounded-lg text-white mr-2`}
            >
              查看详细结果
            </button>
            <button
              onClick={handleStartNewTest}
              className="px-4 py-2 text-emerald-700 hover:text-emerald-900"
            >
              重新测试
            </button>
          </div>
        )}

        {!result ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-emerald-800 text-center">
                问题 {currentQuestion + 1} / {questions.length}
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
                您的皮肤类型: {result.skinType}
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
                  个性化护肤建议
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
                          您可能想问：
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
                {loading ? "分析中..." : "开始个性化咨询"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
