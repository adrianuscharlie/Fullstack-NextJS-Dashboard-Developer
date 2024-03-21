"use client";
import React, { useEffect } from "react";
import Loading from "@/components/Loading";
import ProjectsTable from "@/components/Projects";
import ReleaseBADev from "@/components/ReleaseBADev";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
const DashboardPage = ({ user, projects }) => {
    console.log(projects)
  const [formData, setFormData] = useState({
    step: 1,
    option: "",
    inputField: "",
    updateField: "",
  });
  const options = [
    "View Project",
    "Release BA Development",
    "Release BA UAT",
    "Release BA Release",
  ];
  const [option, setOption] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(()=>{
    if (user.role === "Developer") {
        const option = options.filter(
          (item) => item !== "Release BA UAT" && item !== "Release BA Release"
        );
        setOption(option);
      } else if (session.user.role === "Support") {
        const option = options.filter((item) => item !== "Release BA Development");
        setOption(option);
      } else {
        setOption(options);
      }
  },[])

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      option: selectedOption,
    }));
  };
  // Fetch user data
  return (
    <section className="pt-16 mb-10 w-full mx-auto">
      <h1 className="orange_gradient text-4xl font-bold mb-10 capitalize">
        {user.username} Dashboard
      </h1>
      <p className="font-semibold text-xl">
        Manage your project from this page
      </p>
      <div className="grid grid-cols-[1fr,3fr] gap-4 mt-10  text-lg">
        {/* Replace the following divs with your actual content */}
        <div className="p-4">
          <label htmlFor="dropdown">Select an option:</label>
        </div>
        <div className="p-4">
          <select
            id="dropdown"
            onChange={handleSelectChange}
            value={selectedOption || ""}
            className="text-base p-2"
          >
            <option value="" disabled>
              Select an action
            </option>
            {option.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      {formData.option === "View Project" && (
        <>
          {projects ? (
            <ProjectsTable data={projects} />
          ) : (
            <h1>There is no project for you</h1>
          )}
        </>
      )}
      {formData.option === "Release BA Development" && (
        <ReleaseBADev projects={projects} />
      )}
    </section>
  );
};

export default DashboardPage;
