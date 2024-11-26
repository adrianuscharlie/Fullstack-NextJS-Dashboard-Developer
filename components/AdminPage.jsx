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
import CreateUser from "./CreateUser";
const AdminPage = ({projects}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const options = [
    "Update Project",
    "Input Project",
    "Delete Project",
    "View Project",
    "Create New User"
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    step: 1,
    option: "",
    inputField: "",
    updateField: "",
  });
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (status === "loading") return; // Don't do anything while session is loading
    setLoading(false);
    if (!session) {
      // Redirect to login page if not authenticated.
      router.push("/login"); // Ensure router is used within useEffect
    }
    if (!(session.user.role.includes("manager") || session.user.role.includes("ba_dev"))) {
      alert("Access Denied");
      router.push("/");
    }
    const fetchUsers = async () => {
      const userResponse = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/user",{
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          'Content-Type': 'application/json', // Optional: set content type if needed
        }
      });
      const data = await userResponse.json();
      setUsers(data);
    };
    fetchUsers();
  }, [session, router]);
  if (status == "loading") {
    return <Loading />; // You can replace this with a loading spinner or any other loading indicator
  }
  if(loading){
    return <Loading />
  }
  if (!session) {
    // Redirect to login page if not authenticated.
    router.push("/login"); // Ensure router is used within useEffect
  }

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      option: selectedOption,
    }));
  };

  const handleSetLoading=(value)=>{
    setLoading(value)
  }
  return (
    <section className="page p-4 sm:ml-64 flex flex-col px-10 gap-10">
        <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
          {session.user.namaLengkap} Dashboard
        </h1>
        <p className="text-start">
        Welcome {session.user.namaLengkap}, manage all project from your dashboard!
      </p>
      <div className="grid grid-cols-[1fr,3fr] gap-4  text-lg">
        {/* Replace the following divs with your actual content */}
        <div className="p-4">
          <label htmlFor="dropdown">Select an option:</label>
        </div>
        <div className="p-4">
          <select
            id="dropdown"
            onChange={handleSelectChange}
            value={selectedOption || ""}
            className="text-base p-2 bg-gray-100"
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
      {formData.option === "Input Project" && <InputProject users={users} handleSetLoading={handleSetLoading}/>}
      {formData.option === "Update Project" && <UpdateProject users={users} projects={projects} handleSetLoading={handleSetLoading}/>}
      {formData.option === "Delete Project" && <DeleteProject projects={projects} handleSetLoading={handleSetLoading}/>}
      {formData.option === "Create New User" && <CreateUser handleSetLoading={handleSetLoading}/>}
      {formData.option === "View Project" && (
        <>
          {projects ? (
            <ProjectsTable data={projects} />
          ) : (
            <h1>There is no project for you</h1>
          )}
        </>
      )}
    </section>
  );
};

export default AdminPage;
