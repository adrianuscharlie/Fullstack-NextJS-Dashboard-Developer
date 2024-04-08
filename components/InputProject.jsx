"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  useRouter,
  useSearchParams,
  usePathname,
  redirect,
} from "next/navigation";
const InputProject = ({ users }) => {
  const [project, setProject] = useState({
    project_name: "",
    developer: "",
    support: "",
    status: "Development",
    details: "",
    version: "0.0.0.0",
    businessAnalyst: "",
  });
  const router = useRouter();
  const handleProject = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setProject((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInput = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/projects`, {
      method: "POST",
      body: JSON.stringify(project),
    });
    alert("Uploading new Project");
    if (response.ok) {
      const { statusResponse, message, id } = await response.json();
      alert(message);
      router.push(`/projects/${id}`);
    } else {
      alert("gagal input new project");
    }
  };
  return (
    <form
      className="grid grid-cols-[1fr,3fr] gap-4 mt-10  text-lg"
      onSubmit={handleInput}
    >
      <div className="p-4">
        <label htmlFor="dropdown">Project Name</label>
      </div>
      <div className=" p-4">
        <div>
          <input
            type="text"
            id="inputField"
            name="project_name"
            value={project.project_name}
            onChange={handleProject}
            className="text-base w-full p-2 "
          />
        </div>
      </div>
      <div className=" p-4">
        <label htmlFor="dropdown">Developer</label>
      </div>
      <div className="p-4">
        <div>
          <select
            id="dropdown"
            onChange={handleProject}
            value={project.developer || ""}
            name="developer"
            className="text-base p-2"
          >
            <option value="" disabled>
              Select an option
            </option>
            {users
              .filter((user) => user.role === "developer")
              .map((user, index) => (
                <option key={index} value={user.namaLengkap}>
                  {user.namaLengkap}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className=" p-4">
        <label htmlFor="dropdown">Support</label>
      </div>
      <div className="p-4">
        <div>
          <select
            id="dropdown"
            onChange={handleProject}
            value={project.support || ""}
            name="support"
            className="text-base p-2"
          >
            <option value="" disabled>
              Select an option
            </option>
            {users
              .filter((user) => user.role === "support")
              .map((user, index) => (
                <option key={index} value={user.namaLengkap}>
                  {user.namaLengkap}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className=" p-4">
        <label htmlFor="dropdown">Business Analyst</label>
      </div>
      <div className="p-4">
        <div>
          <select
            id="dropdown"
            onChange={handleProject}
            value={project.businessAnalyst || ""}
            name="businessAnalyst"
            className="text-base p-2"
          >
            <option value="" disabled>
              Select an option
            </option>
            {users.map((user, index) => (
              <option key={index} value={user.namaLengkap}>
                {user.namaLengkap}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className=" p-4">
        <label htmlFor="dropdown">Details</label>
      </div>
      <div className=" p-4">
        <label htmlFor="comment" className="sr-only">
          Input project details
        </label>
        <textarea
          onChange={handleProject}
          id="comment"
          className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
          placeholder="Input project details......"
          name="details"
          required
        />
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-yellow-500 rounded-lg mt-4"
        >
          Input Project
        </button>
      </div>
    </form>
  );
};

export default InputProject;
