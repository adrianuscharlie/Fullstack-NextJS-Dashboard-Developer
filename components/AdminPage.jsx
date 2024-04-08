"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import {
  useRouter,
  useSearchParams,
  usePathname,
  redirect,
} from "next/navigation";
import { useSession } from "next-auth/react";
import InputProject from "@/components/InputProject";
import UpdateProject from "@/components/UpdateProject";
import DeleteProject from "@/components/DeleteProject";
import ProjectsTable from "@/components/Projects";
import ReleaseBADev from "@/components/ReleaseBADev";
import ReleaseBAUAT from "./ReleaseBAUAT";
import ReleaseBaRelease from "./ReleaseBARelease";
const AdminPage = ({user,projects}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const options = [
    "Update",
    "Input",
    "Delete",
    "View Project",
    "Release BA Development",
    "Release BA UAT",
    "Release BA Release",
  ];
  const [selectedOption, setSelectedOption] = useState(null);

  const [formData, setFormData] = useState({
    step: 1,
    option: "",
    inputField: "",
    updateField: "",
  });
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (status === "loading") return; // Don't do anything while session is loading

    if (!session) {
      // Redirect to login page if not authenticated.
      console.log(session, status);
      router.push("/login"); // Ensure router is used within useEffect
    }
    if (session.user.role !== "admin") {
      alert("Access Denied");
      router.push("/");
    }
    const fetchUsers = async () => {
      const userResponse = await fetch("/api/users");
      const data = await userResponse.json();
      setUsers(data);
    };
    fetchUsers();
  }, [session, status, router]);
  if (status == "loading") {
    return <Loading />; // You can replace this with a loading spinner or any other loading indicator
  }

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      option: selectedOption,
    }));
  };
  return (
    <section className="p-4 sm:ml-64 flex flex-col px-10 gap-10">
        <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
          {user.namaLengkap} Dashboard
          <span className="capitalize"> KIS</span>
        </h1>
        <p className="text-start">
        {
          "Welcome Admin, manage all project from your dashboard!"
        }
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
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      {formData.option === "Input" && <InputProject users={users} />}
      {formData.option === "Update" && <UpdateProject users={users} projects={projects} />}
      {formData.option === "Delete" && <DeleteProject projects={projects} />}
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
      {formData.option==="Release BA UAT"&&(
        <ReleaseBAUAT projects={projects}/>
      )}
      {formData.option==="Release BA Release"&&(
        <ReleaseBaRelease projects={projects}/>
      )}
    </section>
  );
};

export default AdminPage;
