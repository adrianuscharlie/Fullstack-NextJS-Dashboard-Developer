"use client";
import React, {  useState } from "react";
import InputProject from "@/components/InputProject";
import UpdateProject from "@/components/UpdateProject";
import DeleteProject from "@/components/DeleteProject";
import ProjectsTable from "@/components/Projects";
import CreateUser from "@/components/CreateUser";
const AdminPage = ({session,projects,users}) => {
  const options = [
    "Update Project",
    "Input Project",
    "Delete Project",
    "View Project",
    "Create New User"
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    step: 1,
    option: "",
    inputField: "",
    updateField: "",
  });
  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      option: selectedOption,
    }));
  };

  return (
    <section className="page flex flex-col px-10 gap-10">
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
      {formData.option === "Input Project" && <InputProject users={users} />}
      {formData.option === "Update Project" && <UpdateProject users={users} projects={projects} />}
      {formData.option === "Delete Project" && <DeleteProject projects={projects} />}
      {formData.option === "Create New User" && <CreateUser />}
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
