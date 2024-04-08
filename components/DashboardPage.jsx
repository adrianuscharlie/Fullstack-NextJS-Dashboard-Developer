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
  const { data: session, status } = useSession();
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
    if (user.role === "developer") {
        const option = options.filter(
          (item) => item !== "Release BA UAT" && item !== "Release BA Release"
        );
        setOption(option);
      } else if (session.user.role === "support") {
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
    <section className="p-4 sm:ml-64 flex flex-col px-10 gap-10">
        <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
          {user.namaLengkap} Dashboard
          <span className="capitalize"> KIS</span>
        </h1>
        <p className="text-start">
        {
          "Welcome, manage all project from your dashboard! Below are list of all project that you already managed"
        }
      </p>
      {projects ? (
            <ProjectsTable data={projects} />
          ) : (
            <h1>There is no project for you</h1>
          )}
    </section>
  );
};

export default DashboardPage;
