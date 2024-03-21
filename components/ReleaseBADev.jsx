"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import BADevDoc from "./BADevDoc";

const ReleaseBADev = ({ projects }) => {
  const [project, setProject] = useState({
    project_name: "",
    developer: "",
    support: "",
    status: "",
    notes: "",
    version: "",
  });
  const [formData, setFormData] = useState({
    noDokumen: "",
    project_name: project.project_name,
    jenisTransaksi: "",
    date: "",
    programTerkait: "",
    version: project.version,
    deskripsi: project.notes,
    lokasi: "",
    peserta: "",
    message: "",
    attachment: "",
  });
  const handleSelectedProject = (e) => {
    const projectName = e.target.value;
    const foundProject = projects.find(
      (project) => project.project_name === projectName
    );
    setProject(foundProject);
    setFormData((prevData) => ({
      ...prevData,
      ["project_name"]: foundProject.project_name,
      ["version"]: foundProject.version,
      ["deskripsi"]: foundProject.notes,
    }));
    console.log(formData);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    console.log(formData);
  };
  return (
    <>
      <form
        className="grid grid-cols-[1fr,3fr] gap-4 mt-10  text-lg"
        onSubmit={handleSubmit}
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
              {project&&projects.map((project, index) => (
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
              <label htmlFor="dropdown">Jenis Transaksi</label>
            </div>
            <div className="p-4">
              <div>
                <input
                  type="text"
                  id="inputField"
                  name="jenisTransaksi"
                  value={formData.jenisTransaksi}
                  onChange={handleChange}
                  className="text-base w-full p-2"
                  placeholder="Masukan jenis transaksi"
                  required
                />
              </div>
            </div>
            <div className="p-4">
              <label htmlFor="dropdown">Program Terkait</label>
            </div>
            <div className="p-4">
              <div>
                <input
                  type="text"
                  id="inputField"
                  name="programTerkait"
                  value={formData.programTerkait}
                  onChange={handleChange}
                  className="text-base w-full p-2"
                  placeholder="Masukan program terkait..."
                  required
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
                  value={project.version}
                  onChange={handleChange}
                  className="text-base w-full p-2"
                  disabled
                />
              </div>
            </div>
            <div className="p-4">
              <label htmlFor="dropdown">Deskripsi</label>
            </div>
            <div className="p-4">
              <div>
                <textarea
                  onChange={handleChange}
                  className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                  placeholder="Masukan nama peserta dipisahkan oleh enter"
                  name="deskripsi"
                  value={project.notes}
                  disabled
                />
              </div>
            </div>
            <div className="p-4">
              <label htmlFor="dropdown">Lokasi</label>
            </div>
            <div className="p-4">
              <div>
                <input
                  type="text"
                  id="inputField"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  className="text-base w-full p-2"
                  placeholder="Masukan lokasi..."
                  required
                />
              </div>
            </div>
            <div className="p-4">
              <label htmlFor="dropdown">Peserta</label>
            </div>
            <div className="p-4">
              <div>
                <textarea
                  onChange={handleChange}
                  className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                  placeholder="Masukan nama peserta dipisahkan oleh enter"
                  name="peserta"
                  required
                />
              </div>
              <div className="flex p-2 items-center justify-start w-full">
                <ul className="flex justify-start items-center gap gap-2 w-ful">
                  {formData.peserta.split("\n").map((person, index) => (
                    <li
                      className="bg-slate-300 px-2 py-1 text-base rounded-md"
                      key={index}
                    >
                      {person}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className=" p-4">
              <label htmlFor="dropdown">Message</label>
            </div>
            <div className=" p-4">
              <textarea
                //   onChange={handleProject}
                id="comment"
                className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                placeholder="Message for this BA Development"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <div className=" p-4">
              <label htmlFor="dropdown">Attachment</label>
            </div>
            <div className=" p-4">
              <textarea
                onChange={handleChange}
                id="comment"
                className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                placeholder="Attachment for this BA Development"
                name="attachment"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-yellow-500 rounded-lg mt-4"
              >
                Create BA Development
              </button>
            </div>
          </>
        )}
      </form>
      <div className="w-full h-full flex justify-center items-center p-10">
        <div className="w-full flex flex-col justify-center items-center p-10">
          <h1 className="h1 text-lg font-bold mb-5">Preview Document</h1>
          
            <BADevDoc formData={formData} />
          
        </div>
      </div>
    </>
  );
};

export default ReleaseBADev;
