import React from "react";
import styles from "./Home.module.css";
import Navbar from "../components/Navbar";

// Import team member photos
import teamMember1 from "../assets/images/aboutus/Adela.png";
import teamMember2 from "../assets/images/aboutus/teancum.png";

export default function About() {
  const teamMembers = [
    {
      name: "Adela Montoya",
      role: "Founder & CEO",
      image: teamMember1,
      description:
        "With Many of experience in the skincare industry, dedicated to providing personalized skincare solutions for everyone.",
    },
    {
      name: "Teancum Tian",
      role: "Founder & CTO",
      image: teamMember2,
      description:
        "BYU CS Student, focused on researching personalized skincare solutions.",
    },
  ];

  const companyValues = [
    {
      title: "Personalized Care",
      description:
        "We believe every person's skin is unique and requires a customized care plan.",
    },
    {
      title: "Technological Innovation",
      description:
        "Utilizing the latest AI technology to provide precise skin analysis and care recommendations.",
    },
    {
      title: "Professional Quality",
      description:
        "Collaborating with top dermatologists to ensure every recommendation is scientifically based.",
    },
  ];

  return (
    <div className={styles["min-h-screen"]}>
      <Navbar />
      <div className={`${styles["max-w-7xl"]} pt-20`}>
        {/* Company Introduction */}
        <h1 className="text-3xl font-bold text-emerald-900 mb-4">
          About BLISSA
        </h1>
        <p className="text-lg text-emerald-800 mb-6">
          BLISSA is a technology company dedicated to revolutionizing skincare
          experiences through artificial intelligence. Our mission is to provide
          personalized skincare solutions for everyone, making skincare simple
          and effective.
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

        {/* Team Introduction */}
        <h2 className="text-2xl font-bold text-emerald-900 mb-6">Our Team</h2>
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
                <p className="text-emerald-700 font-medium">{member.role}</p>
                <p className="text-emerald-600 mt-2">{member.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Us */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">
              Contact Information
            </h3>
            <p className="text-emerald-600">
              Email: blissa.app@gmail.com
              <br />
              Phone: 3854243960
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
