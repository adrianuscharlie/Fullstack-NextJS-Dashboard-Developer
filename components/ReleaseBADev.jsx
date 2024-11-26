"use client";
import React, { useState,useEffect } from "react";
import ReactDOM from "react-dom";
import BADevDoc from "./BADevDoc";
import { BlobProvider,PDFViewer } from "@react-pdf/renderer";
import DatePicker from "react-datepicker";
import { XIcon,PlusCircle } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "next-auth/react";

const ReleaseBADev = ({ projects, users }) => {
  const {data:session,status}=useSession();
  const [projectVersion, setProjectVersion] = useState([]);
  const [attachments, setAttachments] = useState([
    { title: "", description: "", images: [], hasil: "Sesuai" },
  ]);
  const [formData, setFormData] = useState({
    noDokumen: "",
    project_name: "",
    jenisTransaksi: "",
    date: "",
    programTerkait: "",
    version: "",
    deskripsi: "",
    partner: "",
    dokumen: "",
    message:
      "Sesuai dengan pengujian, maka Berita Acara Development telah selesai dilakukan finalisasi untuk sistem aplikasi di atas dan hasilnya DITERIMA",
    attachments: attachments,
    developer: "",
    manager: "S.Handika Panudju",
    businessAnalyst: "",
    tglAwal: "",
    tglAkhir: "",
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
  const handleNoDokumen = async (e) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/dokumen",{
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          'Content-Type': 'application/json', // Optional: set content type if needed
        }
      }
    );
    const docomentNumber = await response.text();
    setFormData((prevData) => ({
      ...prevData,
      ["noDokumen"]: docomentNumber,
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
      { title: "", description: "", images: [] },
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
                {/* <div className="p-4">
                  <label htmlFor="dropdown">Developer Name</label>
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
                </div> */}
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
                  <label htmlFor="dropdown">Deskripsi</label>
                </div>
                <div className="p-4">
                  <div>
                    <textarea
                      onChange={handleChange}
                      className="p-4 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
                      placeholder=" sukan nama peserta dipisahkan oleh enter"
                      name="deskripsi"
                      value={formData.deskripsi}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <label htmlFor="dropdown">Partner</label>
                </div>
                <div className="p-4">
                  <div>
                    <input
                      type="text"
                      id="inputField"
                      name="partner"
                      value={formData.partner}
                      onChange={handleChange}
                      className="text-base w-full p-2 bg-gray-100"
                      placeholder="Masukan Partner..."
                      required
                    />
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
                
                <div className=" p-4">
                  <label htmlFor="dropdown">Message</label>
                </div>
                <div className=" p-4">
                  <textarea
                    //   onChange={handleProject}
                    id="comment"
                    className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
                    placeholder="Message for this BA Development"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="p-4">Attachment Form</div>
                <div className="">
                  <div className="mx-auto p-6">
                    {attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="border bg-gray-100 border-gray-200 p-4 rounded-md mb-4"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium mb-2">
                            Attachment {index + 1}
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
                            Title of Attachment
                          </label>
                          <textarea
                            type="text"
                            value={attachment.title}
                            onChange={(e) =>
                              handleInputChange(index, "title", e.target.value)
                            }
                            placeholder="Enter title"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* Attachment Description */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Attachment Description
                          </label>
                          <textarea
                            value={attachment.description}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Enter description"
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

                        {/* Remove Attachment Button */}
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
                          filename={formData.noDokumen}
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
