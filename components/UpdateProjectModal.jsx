"use client";
import React from "react";
import Modal from "react-modal";
import { useState } from "react";

const UpdateProjectModal = ({ isOpen, onClose, handleSubmit, project }) => {
  const [formData, setFormData] = useState({
    project_name: project.project_name,
    notes: project.notes,
    version: project.version,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const onSubmit=async(e)=>{
    e.preventDefault();
    const result=await handleSubmit(formData);
    if(result)onClose;
  }
  return (
    <>
      <div className="px-10 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form onSubmit={onSubmit}>
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
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
            <div
              className="relative p-6 flex-auto grid grid-cols-[1fr,3fr] gap-4 text-lg"
            >
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
                    className="text-base w-full p-2"
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
                    className="text-base w-full p-2"
                  />
                </div>
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
                  className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
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
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-yellow-500 rounded-lg mt-4"
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
