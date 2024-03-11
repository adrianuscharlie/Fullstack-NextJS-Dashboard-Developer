import React from "react";
import { useState, useEffect } from "react";
import {
  useRouter,
  useSearchParams,
  usePathname,
  redirect,
} from "next/navigation";
const UpdateProject = ({ users }) => {
  const [project, setProject] = useState({
    project_name: "",
    developer: "",
    support: "",
    status: "Development",
    notes: "",
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    };
    fetchProject();
  }, []);
  const router = useRouter();
  const handleProject = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setProject((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSelectedProject = (e) => {
    const projectName = e.target.value;
    const foundProject = projects.find(
      (project) => project.project_name === projectName
    );
    setProject(foundProject);
  };
  const handleInput = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    });
    console.log(response.status);
    alert("Updating Project");
    const { statusResponse, message, id } = await response.json();
    alert(message);
    if (response.ok) {
      router.push(`/projects/${id}`);
    }
  };
  return (
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
            className="text-base p-2"
          >
            <option value="" disabled>
              Select an option
            </option>
            {projects.map((project, index) => (
              <option key={index} value={project.project_name}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {project.project_name !== "" && (
        <>
          <div className="p-4">
            <label htmlFor="dropdown">Status Project</label>
          </div>
          <div className="p-4">
            <div>
              <select
                onChange={handleProject}
                value={project.status || ""}
                name="status"
                className="text-base p-2"
              >
                <option value={project.status}>{project.status}</option>
                {project.status === "Development" ? (
                  <option value={"Production"}>Production</option>
                ) : (
                  <option value={"Development"}>Development</option>
                )}
              </select>
            </div>
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
                <option value={project.developer} disabled>
                  {project.developer}
                </option>
                {users
                  .filter((user) => user.role === "Developer")
                  .filter((user) => user.username !== project.developer)
                  .map((user, index) => (
                    <option key={index} value={user.username}>
                      {user.username}
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
                <option value={project.support} disabled>
                  {project.support}
                </option>
                {users
                  .filter((user) => user.role === "Support")
                  .filter((user) => user.username !== project.support)
                  .map((user, index) => (
                    <option key={index} value={user.username}>
                      {user.username}
                    </option>
                  ))}
              </select>
            </div>
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
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-yellow-500 rounded-lg mt-4"
            >
              Edit Project
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default UpdateProject;
