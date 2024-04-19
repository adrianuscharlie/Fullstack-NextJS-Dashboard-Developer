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

  useEffect(() => {
    if (user.role === "developer") {
      const option = options.filter(
        (item) => item !== "Release BA UAT" && item !== "Release BA Release"
      );
      setOption(option);
    } else if (session.user.role === "support") {
      const option = options.filter(
        (item) => item !== "Release BA Development"
      );
      setOption(option);
    } else {
      setOption(options);
    }
  }, []);

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
    <section className="page p-4 sm:ml-64 flex flex-col px-10 gap-5">
      <div className="flex justify-start items-end gap-5">
        <span className="w-20 text-gray-100">
          <svg
            
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 29 29"
            id="user"
            className="fill-current text-gray-500"
          >
            <path d="M14.5 2A12.514 12.514 0 0 0 2 14.5 12.521 12.521 0 0 0 14.5 27a12.5 12.5 0 0 0 0-25Zm7.603 19.713a8.48 8.48 0 0 0-15.199.008A10.367 10.367 0 0 1 4 14.5a10.5 10.5 0 0 1 21 0 10.368 10.368 0 0 1-2.897 7.213ZM14.5 7a4.5 4.5 0 1 0 4.5 4.5A4.5 4.5 0 0 0 14.5 7Z"></path>
          </svg>
        </span>
        <h1 className="text-start text-4xl font-semibold  text-sky-500">
          {user.namaLengkap}
        </h1>
      </div>
      <div className="flex justify-start items-center gap-5 text-md font-semibold border-b-2 border-black">
        <p>Email : {user.email}</p>
        <p>Role : {user.role}</p>
        <p>Status : {user.isActive}</p>
        <p>Total Project : {projects.length}</p>
      </div>

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
