"use client";
import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
const DeleteProject = ({ projects }) => {
  const { data: session } = useSession();
  const [projectVersion, setProjectVersion] = useState([]);
  const [project, setProject] = useState({
    project_name: "",
    version: "",
  });
  const handleSelectedProject = (e) => {
    const projectName = e.target.value;
    const selectedProject = projects.filter(
      (project) => project.project_name === projectName
    );
    if (selectedProject.length === 1) {
      setProject((prevData) => ({
        ...prevData,
        ["project_name"]: selectedProject[0].project_name,
        ["version"]: selectedProject[0].version,
      }));
    } else {
      setProject((prevData) => ({
        ...prevData,
        ["project_name"]: projectName,
      }));
    }
    setProjectVersion(selectedProject);
  };
  const handleVersionChange = (e) => {
    const version = e.target.value;
    const foundProject = projectVersion.find(
      (project) => project.version === version
    );
    setProject((prevData) => ({
      ...prevData,
      ["project_name"]: foundProject.project_name,
      ["version"]: foundProject.version,
    }));
  };
  const handleDelete = async (event) => {
    event.preventDefault();
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (userConfirmed) {
      const toastID=toast.loading("Deleting project....");
      await axios
        .delete(
          process.env.NEXT_PUBLIC_BASE_URL +
            `/api/projects/${project.project_name + "  " + project.version}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
              "Content-Type": "application/json", // Optional: set content type if needed
            },
          }
        )
        .then((response) => {
          toast.update(toastID,{
            render:response.data.message,
            type:response.status===200?"success":"error",
            isLoading:false,
            autoClose:3000
          })
          setProject({
            project_name: "",
            version: "",
          })
        })
        .catch((error) => {
          toast.update(toastID,{
            render:error,
            type:"error",
            isLoading:false,
            autoClose:3000
          })
        });
    }
  };
  return (
    <>
      <ToastContainer/>
      <form
        className="grid grid-cols-[1fr,3fr] gap-4  text-lg"
        onSubmit={handleDelete}
      >
        <div className="p-4">
          <label htmlFor="dropdown">Select Project</label>
        </div>
        <div className="p-4">
          <div>
            <select
              onChange={handleSelectedProject}
              value={project.project_name || ""}
              name="project_name"
              className="text-base p-2 bg-gray-100"
            >
              <option value="" disabled>
                Select an option
              </option>
              {projects &&
                Array.from(
                  new Set(projects.map((obj) => obj.project_name))
                ).map((project_name) => (
                  <option key={project_name} value={project_name}>
                    {project_name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {projectVersion.length > 0 && (
          <>
            <div className="p-4">
              <label htmlFor="dropdown">Project Version</label>
            </div>
            <div className="p-4">
              <div>
                <select
                  onChange={handleVersionChange}
                  value={project.version || ""}
                  name="project_name"
                  className="text-base p-2 bg-gray-100"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {projectVersion &&
                    projectVersion.map((project, index) => (
                      <option key={index} value={project.version}>
                        {project.version}
                      </option>
                    ))}
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
              >
                Delete Project
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default DeleteProject;
