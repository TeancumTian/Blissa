import React from "react";
import styles from "./Home.module.css";

import Navbar from "../components/Navbar";

// 导入团队成员照片
// import teamMember1 from "../assets/images/team/member1.jpg";
// import teamMember2 from "../assets/images/team/member2.jpg";
// import teamMember3 from "../assets/images/team/member3.jpg";

export default function About() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "创始人 & 首席执行官",
      image: teamMember1,
      description:
        "拥有15年护肤品行业经验，致力于为每个人提供个性化的护肤方案。",
    },
    {
      name: "Dr. Michael Chen",
      role: "首席皮肤科专家",
      image: teamMember2,
      description: "哈佛医学院皮肤科博士，专注于研究个性化护肤解决方案。",
    },
    {
      name: "Emily Wang",
      role: "AI研发总监",
      image: teamMember3,
      description: "斯坦福大学AI博士，负责BLISSA的AI算法开发与优化。",
    },
  ];

  const companyValues = [
    {
      title: "个性化护理",
      description: "我们相信每个人的皮肤都是独特的，需要定制化的护理方案。",
    },
    {
      title: "科技创新",
      description: "运用最新的AI技术，为用户提供精准的皮肤分析和护理建议。",
    },
    {
      title: "专业品质",
      description: "与顶级皮肤科专家合作，确保每个建议都基于科学依据。",
    },
  ];

  return (
    <div className={styles["min-h-screen"]}>
      <Navbar />
      <div className={`${styles["max-w-7xl"]} pt-20`}>
        {/* 公司简介 */}
        <Card className={`${styles["bg-white-50"]} mb-6`}>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-emerald-900 mb-4">
              关于 BLISSA
            </h1>
            <p className="text-lg text-emerald-800 mb-6">
              BLISSA
              是一家致力于通过人工智能技术革新护肤体验的科技公司。我们的使命是为每个人提供个性化的护肤解决方案，让护肤变得简单而有效。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companyValues.map((value, index) => (
                <div
                  key={index}
                  className={`${styles["bg-gradient"]} p-6 rounded-lg text-white`}
                >
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 团队介绍 */}
        <Card className={styles["bg-white-50"]}>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              我们的团队
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="text-center space-y-4"
                >
                  <div className="relative w-48 h-48 mx-auto">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="rounded-full w-full h-full object-cover"
                    />
                    <div
                      className={`${styles["bg-gradient"]} absolute inset-0 rounded-full opacity-0 hover:opacity-20 transition-opacity duration-300`}
                    ></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-emerald-900">
                      {member.name}
                    </h3>
                    <p className="text-emerald-700 font-medium">
                      {member.role}
                    </p>
                    <p className="text-emerald-600 mt-2">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 联系我们 */}
        <Card className={`${styles["bg-white-50"]} mt-6`}>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">
              联系我们
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                  办公地址
                </h3>
                <p className="text-emerald-600">
                  上海市浦东新区张江高科技园区
                  <br />
                  科苑路 88 号
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                  联系方式
                </h3>
                <p className="text-emerald-600">
                  邮箱: contact@blissa.com
                  <br />
                  电话: 021-8888-8888
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
