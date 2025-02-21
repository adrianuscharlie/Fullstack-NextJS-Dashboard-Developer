"use client";
import React, { useState, useEffect } from "react";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import BAUATDoc from "./BAUATDoc";
import Image from "next/image";
import { PlusCircle, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
const ReleaseBAUAT = ({ projects, users }) => {
  const { data: session, status } = useSession();
  const [projectVersion, setProjectVersion] = useState([]);
  const [attachments, setAttachments] = useState([
    { name: "", skenario: "", expected: "", passFail: "", images: [] },
  ]);
  const [formData, setFormData] = useState({
    project_name: "",
    picUAT: "",
    noPRPK: "",
    noCPS: "",
    noCIA: "",
    tglUAT: "",
    tglLive: "",
    uatKE: "",
    date: "",
    version: "",
    lokasi: "",
    peserta: "",
    ttd: "",
    date: "",
    doktekAPI: "",
    attachments: attachments,
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
        ["support"]: selectedProject[0].support,
      }));
    } else {
      setFormData((prevData) => ({
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
    setFormData((prevData) => ({
      ...prevData,
      ["project_name"]: foundProject.project_name,
      ["version"]: foundProject.version,
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
    setFormData((prevData) => ({
      ...prevData,
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
    setFormData((prevData) => ({
      ...prevData,
      ["date"]: formatedDate,
      ["support"]: formData.support,
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

  // Handle adding a new attachment
  const handleAddAttachment = () => {
    setAttachments([
      ...attachments,
      { title: "", desc: "", skenario:"",expected:"",keterangan:"",images: [] },
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

  // Handle multiple image uploads via file input
  const handleImageUpload = (index, event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then((images) => {
      const newAttachments = [...attachments];
      newAttachments[index].images = [
        ...newAttachments[index].images,
        ...images,
      ];
      setAttachments(newAttachments);
    });
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
                <div className=" p-4">
                  <label htmlFor="dropdown">PIC UAT</label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Masukan nama PIC UAT"
                    name="picUAT"
                    required
                    value={formData.pic}
                    onChange={handleChange}
                  />
                </div>
                <div className=" p-4">
                  <label htmlFor="dropdown">
                    DokTek / API / Table (jika ada)
                  </label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="PRPK_999_06-24_E_PMO / 20 Mei 2024 / Agus"
                    name="doktekAPI"
                    required
                    value={formData.doktekAPI}
                    onChange={handleChange}
                  />
                </div>
                <div className=" p-4">
                  <label htmlFor="dropdown">
                    No. PRPK / Tanggal / PIC PRPK
                  </label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="PRPK_999_06-24_E_PMO / 20 Mei 2024 / Agus"
                    name="prpk"
                    required
                    value={formData.prpk}
                    onChange={handleChange}
                  />
                </div>

                <div className=" p-4">
                  <label htmlFor="dropdown">
                    No. Memo CPS / Tanggal (jika ada)
                  </label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="814 - CPS – 24 / 15 Mei 2024"
                    name="cps"
                    required
                    value={formData.cps}
                    onChange={handleChange}
                  />
                </div>

                <div className=" p-4">
                  <label htmlFor="dropdown">
                    No. Memo CIA / Tanggal (jika ada)
                  </label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder=""
                    name="cia"
                    required
                    value={formData.picCPS}
                    onChange={handleChange}
                  />
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
                      placeholder=" (HO/Cabang/Regional)"
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Tanggal UAT</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="date"
                      id="inputField"
                      name="tglUAT"
                      value={formData.tglUAT}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan Tanggal UAT..."
                      required
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Tanggal Live</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="date"
                      id="inputField"
                      name="tglLive"
                      value={formData.tglLive}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan Tanggal Akhir..."
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
                      placeholder="Charlie:IT Development;Lian:IT QA & Support"
                      name="peserta"
                      required
                    />
                  </div>
                  <div className="flex p-2 items-center justify-start w-full">
                    <ul className="flex justify-start items-center gap gap-2 w-ful">
                      {formData.peserta.split(";").map((doc, index) => (
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
                  <label htmlFor="dropdown">Tanda Tangan UAT</label>
                </div>
                <div className="p-4">
                  <div>
                    <textarea
                      onChange={handleChange}
                      className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
                      placeholder="Charlie:User:GA Manager;Charlie:User:SSD6 Manager"
                      name="ttd"
                      required
                    />
                  </div>
                  <div className="flex p-2 items-center justify-start w-full">
                    <ul className="flex justify-start items-center gap gap-2 w-ful">
                      {formData.ttd.split(";").map((doc, index) => (
                        <li
                          className="bg-gray-100 px-2 py-1 text-base rounded-md"
                          key={index}
                        >
                          {doc.replace("|", " - ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className=" p-4">
                  <label htmlFor="dropdown">UAT Ke {"(1/2/3/4)"}</label>
                </div>
                <div className=" p-4">
                  <input
                    id="comment"
                    className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
                    placeholder="Message for this BA Development"
                    name="uatKE"
                    required
                    value={formData.uatKE}
                    onChange={handleChange}
                  />
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
                            Deskripsi
                          </label>
                          <input
                            type="text"
                            value={attachment.desc}
                            onChange={(e) =>
                              handleInputChange(index, "desc", e.target.value)
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
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Keterangan
                          </label>
                          <input
                            type="text"
                            value={attachment.keterangan}
                            onChange={(e) =>
                              handleInputChange(index, "keterangan", e.target.value)
                            }
                            placeholder="Masukan Keterangan"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Attachment Image Upload */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Attachment Title
                          </label>
                          
                          <input
                            type="text"
                            value={attachment.title}
                            onChange={(e) =>
                              handleInputChange(index, "title", e.target.value)
                            }
                            placeholder="Masukan nama attachment"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Attachment Image Upload */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Attachment Image
                          </label>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                        </div>
                        {/* Preview of Uploaded Images */}
                        {attachment.images.length > 0 && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Image Previews:
                            </label>
                            <div className="flex flex-wrap gap-3 mt-1">
                              {attachment.images.map((image, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={image}
                                  alt={`Preview ${imgIndex + 1}`}
                                  className="w-24 h-24 object-cover border border-gray-300 rounded-md"
                                />
                              ))}
                            </div>
                          </div>
                        )}
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
                        <BAUATDoc
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
      
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="h1 text-lg font-bold mb-5">Preview Document</h1>

          <PDFViewer
            fileName={`BA Development ${formData.noDokumen}`}
            style={{ width: "100%", height: "100vh" }}
          >
            <BAUATDoc formData={formData} />
          </PDFViewer>
        </div>
      </div>
    </>
  );
};

export default ReleaseBAUAT;
