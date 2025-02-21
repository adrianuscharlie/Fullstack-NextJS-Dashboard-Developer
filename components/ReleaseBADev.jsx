"use client";
import React, { useState, useEffect } from "react";
import BADevDoc from "./BADevDoc";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { XIcon, PlusCircle } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "next-auth/react";

const ReleaseBADev = ({ projects, users }) => {
  const [projectVersion, setProjectVersion] = useState([]);
  const [attachments, setAttachments] = useState([
    { name: "", skenario: "", expected: "", passFail: "" },
  ]);
  const [formData, setFormData] = useState({
    kesimpulan: "",
    project_name: "",
    kebutuhanUser: "",
    date: "",
    persyaratanProgram: "",
    version: "",
    lokasi: "",
    dependensi: "",
    konfigurasi:"",
    attachments: attachments,
    developer: "",
    tglAwal: "",
    tglAkhir: "",
    penguji:""
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
        ["deskripsi"]: selectedProject[0].notes,
        ["developer"]: selectedProject[0].developer,
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
      ["deskripsi"]: foundProject.notes,
      ["developer"]: foundProject.developer,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      ["developer"]: formData.developer,
      ["businessAnalyst"]: formData.businessAnalyst,
    }));
  };

  const handleAddAttachment = () => {
    setAttachments([
      ...attachments,
      { name: "", skenario: "", expected: "",passFail:"" },
    ]);
  };

  // Handle removing an attachment
  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  // Handle updating attachment data
  const handleInputChange = (index, field, value) => {
    const newAttachments = [...attachments];
    newAttachments[index][field] = value;
    setAttachments(newAttachments);
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      attachments: attachments,
    }));
  }, [attachments]);

  return (
    <>
      <form
        className="grid grid-cols-[1fr,3fr] gap-4 text-lg"
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
                <div className=" p-4">
                  <label htmlFor="dropdown">No PRPK</label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Nomor PRPK"
                    name="noPRPK"
                    required
                    value={formData.noPRPK}
                    onChange={handleChange}
                  />
                </div>
                <div className=" p-4">
                  <label htmlFor="dropdown">PIC PRPK</label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="PIC PRPK"
                    name="picPRPK"
                    required
                    value={formData.picPRPK}
                    onChange={handleChange}
                  />
                </div>

                <div className=" p-4">
                  <label htmlFor="dropdown">No Memo CPS/CIA</label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Nomor Memo CPS/CIA"
                    name="noCPS"
                    required
                    value={formData.noCPS}
                    onChange={handleChange}
                  />
                </div>

                <div className=" p-4">
                  <label htmlFor="dropdown">PIC CPS/CIA</label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="PIC CPS/CIA"
                    name="picCPS"
                    required
                    value={formData.picCPS}
                    onChange={handleChange}
                  />
                </div>
                <div className=" p-4">
                  <label htmlFor="dropdown">Nama Penguji</label>
                </div>
                <div className=" p-4">
                  <input
                    //   onChange={handleProject}
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Message for this BA Development"
                    name="penguji"
                    required
                    value={formData.penguji}
                    onChange={handleChange}
                  />
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Kebutuhan User</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="text"
                      id="inputField"
                      name="kebutuhanUser"
                      value={formData.kebutuhanUser}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan kebutuhan user"
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Persyaratan Program</label>
                </div>
                <div className="p-4">
                  <div>
                    <textarea
                      type="text"
                      id="inputField"
                      name="persyaratanProgram"
                      value={formData.persyaratanProgram}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan persyaratan program..."
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Lokasi/Server</label>
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
                      placeholder="Masukan lokasi program"
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Dependensi</label>
                </div>
                <div className="p-4">
                  <div>
                    <textarea
                      type="text"
                      id="inputField"
                      name="dependensi"
                      value={formData.dependensi}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan dependensi program"
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Konfigurasi Program</label>
                </div>
                <div className="p-4">
                  <div>
                    <textarea
                      type="text"
                      id="inputField"
                      name="konfigurasi"
                      value={formData.konfigurasi}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan konfigurasi program"
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Kesimpulan</label>
                </div>
                <div className="p-4">
                  <div>
                    <textarea
                      type="text"
                      id="inputField"
                      name="kesimpulan"
                      value={formData.kesimpulan}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan dependensi program"
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown"> Developer</label>
                </div>
                <div className="p-4">
                  <div>
                    <select
                      id="dropdown"
                      onChange={handleChange}
                      value={formData.developer}
                      name="developer"
                      className="text-base p-2 bg-gray-100"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {users
                        .filter((user) => user.role === "developer") // Filter by role
                        .map((user, index) => (
                          <option key={index} value={user.namaLengkap}>
                            {user.namaLengkap}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Tanggal Awal</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="date"
                      id="inputField"
                      name="tglAwal"
                      value={formData.tglAwal}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan Tanggal Awal..."
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Tanggal Akhir</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="date"
                      id="inputField"
                      name="tglAkhir"
                      value={formData.tglAkhir}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan Tanggal Akhir..."
                      required
                    />
                  </div>
                </div>

                
                

                <div className="p-4">Detail Hasil Test</div>
                <div className="">
                  <div className="mx-auto p-6">
                    {attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="border bg-gray-100 border-gray-200 p-4 rounded-md mb-4"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium mb-2">
                            Detail {index + 1}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className=""
                          >
                            <XIcon className="hover:text-red-500 cursor-pointer" />
                          </button>
                        </div>

                        {/* Title of Attachment */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Nama Program
                          </label>
                          <input
                            type="text"
                            value={attachment.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                            placeholder="Masukan nama program"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Skenario Test
                          </label>
                          <textarea
                            value={attachment.skenario}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "skenario",
                                e.target.value
                              )
                            }
                            placeholder="Masukan skenario pengujian"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Hasil yang Diharapkan
                          </label>
                          <textarea
                            value={attachment.expected}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "expected",
                                e.target.value
                              )
                            }
                            placeholder="Masukan hasil yang diharapkan"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Pass/Fail
                          </label>
                          <textarea
                            value={attachment.passFail}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "passFail",
                                e.target.value
                              )
                            }
                            placeholder="Masukan hasil pass/fail"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                    ))}

                    {/* Add New Attachment Button */}
                    <button
                      type="button"
                      onClick={handleAddAttachment}
                      className="inline-flex items-center gap-2 p-2 px-4 text-xs font-medium text-center text-white bg-green-500 rounded-lg mt-4 "
                    >
                      <PlusCircle /> Add Attachment
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
                  >
                    <BlobProvider
                      document={
                        <BADevDoc
                          formData={formData}
                          fileName={formData.noDokumen}
                        />
                      }
                    >
                      {({ url, ...rest }) => {
                        return (
                          <a href={url} target="_blank">
                            Create BA Development
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
      <div className="w-full h-full flex justify-center items-center p-10">
        <div className="w-full flex flex-col justify-center items-center p-10">
          <h1 className="h1 text-lg font-bold mb-5">Preview Document</h1>

          <PDFViewer
            fileName={`BA Development ${formData.noDokumen}`}
            style={{ width: "100%", height: "100vh" }}
          >
            <BADevDoc formData={formData} />
          </PDFViewer>
        </div>
      </div>
    </>
  );
};

export default ReleaseBADev;
