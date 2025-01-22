"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Notification from "./Notification";
import axios from "axios";
const InputProject = ({ users }) => {
  const { data: session, status } = useSession();
  const [project, setProject] = useState({
    project_name: "",
    type: "",
    developer: "",
    support: "",
    status: "Development",
    details: "",
    version: "0.0.0.0",
    notes: "",
  });
  const router = useRouter();
  const handleProject = (e) => {
    const { name, value } = e.target;
    setProject((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    type: "", // 'success', 'error', 'general'
  });
  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const showNotification = async (type, title) => {
    setNotification({ show: true, type, title });
    setTimeout(() => {
      closeNotification();
    }, 3000);
  };

  const handleInput = async (event) => {
    event.preventDefault();
    showNotification("general", "Uploading new Project");
    await axios
      .post(process.env.NEXT_PUBLIC_BASE_URL + `/api/projects`, project, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          "Content-Type": "application/json", // Optional: set content type if needed
        },
      })
      .then((response) => {
        if (response.status === 200) {
          showNotification("success", "Success input new project!");
          router.push(
            `/projects/${project.project_name + "  " + project.version}`
          );
        } else {
          showNotification("error", "Failed input new project!");
        }
      })
      .catch((error) => showNotification("error", "Failed input new project!"));
  };
  return (
    <>
      {notification.show && (
        <Notification
          type={notification.type}
          title={notification.title}
          onClose={closeNotification}
        />
      )}
      <form
        className="grid grid-cols-[1fr,3fr] gap-4 text-lg"
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
              className="text-base w-full p-2 bg-gray-100"
              placeholder="Enter project name..."
            />
          </div>
        </div>
        <div className="p-4">
          <label htmlFor="dropdown">Project Type</label>
        </div>
        <div className=" p-4">
          <div>
            <input
              type="text"
              id="inputField"
              name="type"
              value={project.type}
              onChange={handleProject}
              className="text-base w-full p-2 bg-gray-100"
              placeholder="Enter project type..."
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
              className="text-base p-2 bg-gray-100"
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
              className="text-base p-2 bg-gray-100"
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
        <div className="p-4">
          <label htmlFor="dropdown">Version Notes</label>
        </div>
        <div className=" p-4">
          <div>
            <input
              type="text"
              id="inputField"
              name="notes"
              value={project.notes}
              onChange={handleProject}
              className="text-base w-full p-2 bg-gray-100"
              placeholder="Enter note for this initial version"
            />
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
            className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
            placeholder="Input project details......"
            name="details"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
          >
            Input Project
          </button>
        </div>
      </form>
    </>
  );
};

export default InputProject;
