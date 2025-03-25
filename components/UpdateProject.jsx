import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const UpdateProject = ({ users, projects }) => {
  const { data: session, status } = useSession();
  const [projectVersion, setProjectVersion] = useState([]);
  const [project, setProject] = useState({
    project_name: "",
    type: "",
    developer: "",
    support: "",
    version: "",
    status: "Development",
    notes: "",
    details: "",
  });
  const choice = [
    "Development",
    "Bugs",
    "Fixing Bugs",
    "SIT",
    "UAT",
    "Test Support",
    "Test Release",
    "Release",
  ];
  const [options, setOptions] = useState(choice);
  const handleSelectedProject = (e) => {
    const projectName = e.target.value;
    const selectedProject = projects.filter(
      (project) => project.project_name === projectName
    );
    if (selectedProject.length === 1) {
      setProject((prevData) => ({
        ...prevData,
        ["project_name"]: selectedProject[0].project_name,
        ["type"]: selectedProject[0].type,
        ["version"]: selectedProject[0].version,
        ["developer"]: selectedProject[0].developer,
        ["support"]: selectedProject[0].support,
        ["details"]: selectedProject[0].details,
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
    console.log(foundProject);
    setProject((prevData) => ({
      ...prevData,
      ["project_name"]: foundProject.project_name,
      ["version"]: foundProject.version,
      ["developer"]: foundProject.developer,
      ["support"]: foundProject.support,
      ["details"]: foundProject.details,
      ["type"]: foundProject.type,
    }));
  };

  const router = useRouter();
  const handleProject = (e) => {
    const { name, value } = e.target;
    setProject((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInput = async (event) => {
    event.preventDefault();
    const toastID = toast.loading("Updating project....");

    await axios
      .put(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/api/projects/${project.project_name}  ${project.version}`,
        project,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
            "Content-Type": "application/json", // Optional: set content type if needed
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast.update(toastID, {
            render:
              response.status === 200
                ? "Success updating project"
                : "Failed updating project",
            type: response.status === 200 ? "success" : "error",
            isLoading: false,
            autoClose: 3000,
          });
          router.push(`/projects/${project.project_name}  ${project.version}`);
        } else {
          toast.update(toastID, {
            render: "Failed updating project",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      });
  };

  return (
    <>
      <ToastContainer />
      <form
        className="grid grid-cols-[1fr,3fr] gap-4  text-lg"
        onSubmit={handleInput}
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
            </div>
            {project.version !== "" && (
              <>
                <div className="p-4">
                  <label htmlFor="dropdown">Status</label>
                </div>
                <div className="p-4">
                  <select
                    id="dropdown"
                    onChange={handleProject}
                    name="status"
                    value={project.status || ""}
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
                <div className=" p-4">
                  <label htmlFor="dropdown">Developer</label>
                </div>
                <div className="p-4">
                  <div>
                    <select
                      onChange={handleProject}
                      value={project.developer || ""}
                      name="developer"
                      className="text-base p-2"
                    >
                      {users
                        .filter((user) => user.role === "developer")
                        // .filter((user) => user.username !== project.developer)
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
                      onChange={handleProject}
                      value={project.support || ""}
                      name="support"
                      className="text-base p-2"
                    >
                      <option value={project.support}>{project.support}</option>
                      {users
                        .filter((user) => user.role === "support")
                        // .filter((user) => user.username !== project.support)
                        .map((user, index) => (
                          <option key={index} value={user.namaLengkap}>
                            {user.namaLengkap}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className=" p-4">
                  <label htmlFor="dropdown">Project Type</label>
                </div>
                <div className=" p-4">
                  <label htmlFor="comment" className="sr-only">
                    Project Type
                  </label>
                  <input
                    onChange={handleProject}
                    id="comment"
                    className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Enter project type...."
                    name="type"
                    required
                    value={project.type}
                  />
                </div>
                <div className=" p-4">
                  <label htmlFor="dropdown">Notes</label>
                </div>
                <div className=" p-4">
                  <label htmlFor="comment" className="sr-only">
                    Notes
                  </label>
                  <textarea
                    onChange={handleProject}
                    id="comment"
                    className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Write a comment about the project...."
                    name="notes"
                    required
                    value={project.notes}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
                  >
                    Edit Project
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </form>
    </>
  );
};

export default UpdateProject;
