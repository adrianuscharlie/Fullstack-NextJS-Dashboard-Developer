"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  useRouter,
  useSearchParams,
  usePathname,
  redirect,
} from "next/navigation";
import Notification from "./Notification";
const InputProject = ({ users, handleSetLoading }) => {
  const [project, setProject] = useState({
    project_name: "",
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
  const handleInput = async (event) => {
    event.preventDefault();
    setNotification({
      show: true,
      type: "general",
      title: "Uploading new Project",
    });
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + `/api/projects`,
      {
        method: "POST",
        body: JSON.stringify(project),
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header to JSON
        },
      }
    );
    const message = await response.text();
    if (response.ok) {
      setNotification({
        show: true,
        type: "success",
        title: message,
      });
      router.push(`/projects/${project.project_name + "  " + project.version}`);
    } else {
      setNotification({
        show: true,
        type: "error",
        title: message,
      });
    }
  };
  useEffect(() => {
    // If notification is closing, wait for it to close before navigating
    if (notification.isClosing) {
      const timeout = setTimeout(() => {
        setNotification({ ...notification, show: false, isClosing: false });
        router.push("/projects");
      }, 3000); // Adjust the timeout to match your notification close animation duration

      return () => clearTimeout(timeout);
    }
  }, [notification.isClosing, router]);
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
