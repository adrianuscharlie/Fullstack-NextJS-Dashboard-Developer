"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import BAUATDoc from "./BAUATDoc";
const ReleaseBAUAT = ({ projects ,users}) => {
  const [projectVersion, setProjectVersion] = useState([]);
  const [formData, setFormData] = useState({
    noDokumen: "",
    project_name: "",
    jenisTransaksi: "",
    date: "",
    programTerkait: "",
    version: "",
    deskripsi: "",
    lokasi: "",
    peserta: "",
    dokumen: "",
    message:
      "Sesuai dengan pengujian, maka User Acceptance Test(UAT) telah selesai dilakukan finalisasi untuk sistem aplikasi di atas dan hasilnya DITERIMA",
    attachment: "",
    support: "",
    manager: "S.Handika Panudju",
    itDirector: "Eddy Gunawan",
    businessAnalyst: "",
  });
  const handleSelectedProject = (e) => {
    const projectName = e.target.value;
    const selectedProject = projects.filter(
      (project) => project.project_name === projectName
    );
    if (selectedProject.length === 1) {
      setFormData((prevData) => ({
        ...prevData,
        ["project_name"]: selectedProject.project_name,
        ["version"]: selectedProject.version,
        ["deskripsi"]: selectedProject.notes,
        ["support"]: selectedProject.support,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        ["project_name"]: selectedProject.project_name,
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
    setFormData((prevData) => ({
      ...prevData,
      ["project_name"]: foundProject.project_name,
      ["version"]: foundProject.version,
      ["deskripsi"]: foundProject.notes,
      ["support"]: foundProject.support,
    }));
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
      ["support"]: formData.support,
      ["businessAnalyst"]: formData.businessAnalyst,
    }));
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
                      className="text-base w-full p-2 bg-gray-100"
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
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan program terkait..."
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Support Name</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="text"
                      id="inputField"
                      name="support"
                      value={formData.support}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      disabled
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Business Analyst</label>
                </div>
                <div className="p-4">
                  <div>
                    <select
                      id="dropdown"
                      onChange={handleChange}
                      value={formData.businessAnalyst}
                      name="businessAnalyst"
                      className="text-base p-2 bg-gray-100"
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
                <div className="p-4">
                  <label htmlFor="dropdown">Deskripsi</label>
                </div>
                <div className="p-4">
                  <div>
                    <textarea
                      onChange={handleChange}
                      className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
                      placeholder="Masukan nama peserta dipisahkan oleh enter"
                      name="deskripsi"
                      value={formData.deskripsi}
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
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan lokasi..."
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Peserta UAT</label>
                </div>
                <div className="p-4">
                  <div>
                    <textarea
                      onChange={handleChange}
                      className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
                      placeholder="Masukan list dokumen dipisahkan oleh enter"
                      name="peserta"
                      required
                    />
                  </div>
                  <div className="flex p-2 items-center justify-start w-full">
                    <ul className="flex justify-start items-center gap gap-2 w-ful">
                      {formData.peserta.split("\n").map((doc, index) => (
                        <li
                          className="bg-gray-100 px-2 py-1 text-base rounded-md"
                          key={index}
                        >
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">List Dokumen</label>
                </div>
                <div className="p-4">
                  <div>
                    <textarea
                      onChange={handleChange}
                      className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
                      placeholder="Masukan list dokumen dipisahkan oleh enter"
                      name="dokumen"
                      required
                    />
                  </div>
                  <div className="flex p-2 items-center justify-start w-full">
                    <ul className="flex justify-start items-center gap gap-2 w-ful">
                      {formData.dokumen.split("\n").map((doc, index) => (
                        <li
                          className="bg-gray-100 px-2 py-1 text-base rounded-md"
                          key={index}
                        >
                          {doc}
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
                    id="comment"
                    className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
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
                    className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
                    placeholder="Attachment for this BA Development"
                    name="attachment"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
                  >
                    <BlobProvider document={<BAUATDoc formData={formData} filename={formData.noDokumen} />}>
                  {({ url, ...rest }) => {
                    return (
                      <a href={url} target="_blank">
                        Create BA UAT
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

export default ReleaseBAUAT;
