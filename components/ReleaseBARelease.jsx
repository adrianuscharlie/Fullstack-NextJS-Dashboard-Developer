"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import BAUATDoc from "./BAUATDoc";
import BAReleaseDoc from "./BAReleaseDoc";
import { useSession } from "next-auth/react";
const ReleaseBaRelease = ({ projects }) => {
  const { data: session, status } = useSession();
  const [projectVersion, setProjectVersion] = useState([]);
  const [formData, setFormData] = useState({
    noDokumen: "",
    project_name: "",
    jenisTransaksi: "",
    date: "",
    version: "",
    informasi: "",
    support: "",
    developer: "S.Handika Setiawan Panudju",
    support: "Bima Adi Nugroho",
    managerDeveloper: "Ade ",
    managerSupport: "Krissetyo Budi",
    itDirector: "Eddy Gunawan",
  });
  const handleSelectedProject = (e) => {
    const projectName = e.target.value;
    const selectedProject = projects.filter(
      (project) => project.project_name === projectName
    );
    if (selectedProject.length === 1) {
      setFormData((prevData) => ({
        ...prevData,
        ["project_name"]: selectedProject[0].project_name,
        ["version"]: selectedProject[0].version,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        ["project_name"]: projectName,
      }));
    }
    setProjectVersion(selectedProject);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const currentDate = new Date();
    const day = currentDate.getDate(); // Returns the day of the month (1-31)
    const month = currentDate.getMonth() + 1; // Returns the month (0-11), add 1 to get the correct month (1-12)
    const year = currentDate.getFullYear(); // Returns the full year (e.g., 2023)
    const formatedDate = currentDate.toLocaleDateString("en-GB");
    const documentNumber = `${day}/KIS/${month}/${year}`;
    setFormData((prevData) => ({
      ...prevData,
      ["noDokumen"]: documentNumber,
      ["date"]: formatedDate,
    }));
  };
  const handleNoDokumen = async (e) => {
    await axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/api/dokumen", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          "Content-Type": "application/json", // Optional: set content type if needed
        },
      })
      .then((response) => {
        setFormData((prevData) => ({
          ...prevData,
          ["noDokumen"]: response.data,
        }));
      })
      .catch((error) => console.log(error.message));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date();

    // Get the day, month, and year separately
    const day = currentDate.getDate(); // Returns the day of the month (1-31)
    const month = currentDate.getMonth() + 1; // Returns the month (0-11), add 1 to get the correct month (1-12)
    const year = currentDate.getFullYear(); // Returns the full year (e.g., 2023)
    const formatedDate = currentDate.toLocaleDateString("en-GB");
    const documentNumber = `${day}/KIS/${month}/${year}`;
    setFormData((prevData) => ({
      ...prevData,
      ["noDokumen"]: documentNumber,
      ["date"]: formatedDate,
    }));
  };
  const handleVersionChange = (e) => {
    const version = e.target.value;
    const foundProject = projectVersion.find(
      (project) => project.version === version
    );
    setFormData((prevData) => ({
      ...prevData,
      ["project_name"]: foundProject.project_name,
      ["version"]: foundProject.version,
    }));
  };
  return (
    <>
      <form
        className="grid grid-cols-[1fr,3fr] gap-4  text-lg"
        onSubmit={handleSubmit}
      >
        <div className="p-4">
          <label htmlFor="dropdown">Select Project</label>
        </div>
        <div className="p-4">
          <div>
            <select
              onChange={handleSelectedProject}
              value={formData.project_name || ""}
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
                  value={formData.version || ""}
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
            {formData.version !== "" && (
              <>
                <div className="p-4">
                  <label htmlFor="dropdown">No Dokumen</label>
                </div>
                <div className="p-4 flex items-start gap-10">
                  {/* Conditionally render the button when noDokumen is null */}
                  {!formData.noDokumen && (
                    <button
                      onClick={handleNoDokumen}
                      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg"
                    >
                      Generate No Dokumen
                    </button>
                  )}

                  {/* Display the noDokumen value if available */}
                  {formData.noDokumen && <div>{formData.noDokumen}</div>}
                </div>
                <div className=" p-4">
                  <label htmlFor="dropdown">Informasi Perubahan</label>
                </div>
                <div className=" p-4">
                  <textarea
                    onChange={handleChange}
                    id="comment"
                    className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
                    placeholder="Attachment for this BA Development"
                    name="informasi"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
                  >
                    <BlobProvider
                      document={
                        <BAReleaseDoc
                          formData={formData}
                          filename={formData.noDokumen}
                        />
                      }
                    >
                      {({ url, ...rest }) => {
                        return (
                          <a href={url} target="_blank">
                            Create BA Release
                          </a>
                        );
                      }}
                    </BlobProvider>
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

export default ReleaseBaRelease;
