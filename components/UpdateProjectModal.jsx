"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Notification from "./Notification";
const UpdateProjectModal = ({ isOpen, onClose, handleSubmit, project }) => {
  const [formData, setFormData] = useState({
    project_name: project.project_name,
    type:project.type,
    notes: project.notes,
    details: project.details,
    version: project.version,
    developer: project.developer,
    support: project.support,
    status: project.status,
  });
  const {data:session,status}=useSession();
  const [options, setOptions] = useState([
    "Development",
    "Bugs",
    "Fixing Bugs",
    "SIT",
    "UAT",
    "Test Support",
    "Test Release",
    "Release",
  ]);
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    type: "", // 'success', 'error', 'general'
  });
  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [users, setUsers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const userResponse = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/user"
      ,{
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          'Content-Type': 'application/json', // Optional: set content type if needed
        }
      });
      const data = await userResponse.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setNotification({
      show: true,
      type: "general",
      title: "Editing Project",
    });
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        `/api/projects/${project.project_name}  ${project.version}`,
      {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          'Content-Type': 'application/json', // Optional: set content type if needed
        },
        body: JSON.stringify(formData),
      }
    );
    const message=await response.text();
    if (response.ok) {
      setNotification({
        show: true,
        type: "success",
        title: message,
      });
      handleSubmit(formData);
    } else {
      setNotification({
        show: true,
        type: "error",
        title: message,
      });
    }
    onClose();
  };
  useEffect(() => {
    // If notification is closing, wait for it to close before navigating
    if (notification.isClosing) {
      const timeout = setTimeout(() => {
        setNotification({ ...notification, show: false, isClosing: false });
      }, 3000); // Adjust the timeout to match your notification close animation duration

      return () => clearTimeout(timeout);
    }
  }, [notification]);
  return (
    <>
      {notification.show && (
        <Notification
          type={notification.type}
          title={notification.title}
          onClose={closeNotification}
        />
      )}
      <div className="fixed top-0 right-0 left-0 z-40 overflow-y-auto overflow-x-hidden flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-100 bg-opacity-50">
        <form
          className="relative p-4 w-full max-w-4xl max-h-full"
          onSubmit={onSubmit}
        >
          <div className="relative bg-white rounded-lg shado">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-3xl font-semibold text-center px-5">
                  Edit Project
                </h3>
                <button
                  className="text-black hover:text-red background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
              <div className="relative p-6 flex-auto grid grid-cols-[1fr,3fr] gap-4 text-lg">
                <div className="p-4">
                  <label htmlFor="dropdown">Project Name</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="text"
                      id="inputField"
                      name="project_name"
                      value={formData.project_name}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      disabled
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Project Type</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="text"
                      id="inputField"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Project Version</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="text"
                      id="inputField"
                      name="version"
                      value={formData.version}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      disabled
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Project Developer</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="text"
                      id="inputField"
                      name="developer"
                      value={formData.developer}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      disabled
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Project Support</label>
                </div>
                <div className="p-4">
                  <div>
                    <select
                      onChange={handleChange}
                      value={formData.support || ""}
                      name="support"
                      className="text-base p-2 bg-gray-100"
                    >
                      <option value="Hali Wimboko">Hali Wimboko</option>
                      {users.length !== 0 &&
                        users
                          .filter((obj) => obj["role"] === "support")
                          .map((user, index) => (
                            <option key={index} value={user.namaLengkap}>
                              {user.namaLengkap}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Status</label>
                </div>
                <div className="p-4">
                  <select
                    id="dropdown"
                    onChange={handleChange}
                    value={formData['status'] || ""}
                    name="status"
                    className="text-base p-2 bg-gray-100 rounded-sm"
                    required
                  >
                    <option value={project.status}>{project.status}</option>
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="p-4">
                  <label htmlFor="notes">Notes</label>
                </div>
                <div className="p-4">
                  <label htmlFor="notes" className="sr-only">
                    Notes
                  </label>
                  <textarea
                    onChange={handleChange}
                    id="comment"
                    className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
                    placeholder="Write a comment about the project...."
                    name="notes"
                    required
                    value={formData.notes}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  type="submit"
                  className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
                >
                  Edit Project
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProjectModal;
