"use client";
import React, { useEffect, useState } from "react";
import CommentCard from "./Comment";
import { useSession } from "next-auth/react";
import Loading from "./Loading";

const CommentSection = ({ project, handleStatus }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const choice = ["Bugs", "Fixing Bugs", "Test Support", "Test Release"];
  const [options, setOptions] = useState(choice);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [emailCC, setEmailCC] = useState(
    new Set([
      // "handika_sp@indomaret.co.id",
      // "bima_ans@indomaret.co.id",
      // "hali.wimboko@indomaret.co.id",
    ])
  );
  const [ccText, setCcText] = useState("");
  const [isChecked, setChecked] = useState(false);
  useEffect(() => {
    const fetchComment = async () => {
      if (session.user.role === "developer") {
        setOptions(["Fixing Bugs", "Test Support"]);
      } else if (session.user.role === "support") {
        setOptions(["Bugs", "Test Release"]);
      }
      try {
        const result = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL +
            `/api/projects/${
              project.project_name + "  " + project.version
            }/comments`
        );
        if (result.ok) {
          const data = await result.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComment();
  }, []);
  const handleSubmitComment = async (event) => {
    event.preventDefault();
    const commentObject = {
      project_name: project.project_name,
      author: session.user.namaLengkap,
      text: text,
      version: project.version,
      status: selectedOption,
      filePath: "",
    };
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        `/api/projects/${
          project.project_name + "  " + project.version
        }/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header to JSON
        },
        body: JSON.stringify(commentObject),
      }
    );
    handleStatus(commentObject.status);
    const { message, id, date } = await response.json();
    if (response.ok) {
      commentObject.id = id;
      commentObject.date = date;
      if (selectedFiles.length > 0) {
        alert("Uploading file into server....");
        const formData = new FormData();
        commentObject.folder = project.project_name;
        // Append files to FormData
        selectedFiles.forEach((file, index) => {
          formData.append(`file_${id}_${index + 1}`, file);
        });
        // Append JSON object as a string
        formData.append("header", JSON.stringify(commentObject));
        const test = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/files",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadMessage = await test.text();
        alert(uploadMessage);
      } else {
        alert(message);
      }
      const emailResponse = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/api/email/${project.project_name}_${project.version}`
      );
      const { emailDeveloper, emailSupport } = await emailResponse.json();
      var emailFrom = "";
      var emailRecipient = "";
      if (session.user.email === emailDeveloper) {
        emailFrom = emailDeveloper;
        emailRecipient = emailSupport;
      } else {
        emailFrom = emailSupport;
        emailRecipient = emailDeveloper;
      }
      alert("Sending email notification, please wait for a moment...");
      const emailObject = {
        subject: `[${project.status}] Program ${project.project_name} Version ${project.version}`,
        body: text,
        from: emailFrom,
        to: emailRecipient,
        cc: [...emailCC].join(";"),
      };
      const formEmailData = new FormData();
      formEmailData.append("email", JSON.stringify(emailObject));
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file, index) => {
          formEmailData.append(`file_${index + 1}`, file);
        });
      }
      const sendEmail = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/email",
        {
          method: "POST",
          body: formEmailData,
        }
      );
      const emailMessage = await sendEmail.text();
      alert(emailMessage);
    }
    setComments((prevItems) => [commentObject, ...prevItems]);
    setText("");
    setSelectedFiles([]);
    setIsOpen(false);
    setCcText("");
    setEmailCC(new Set([]));
    setSelectedOption(null);
  };
  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };
  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };
  if (loadingComments) {
    return <Loading />;
  }
  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
    // setFormData((prevData) => ({
    //   ...prevData,
    //   option: selectedOption,
    // }));
  };

  return (
    <section className="p-4 sm:ml-64 flex flex-col px-10 gap-10">
      {session.user.namaLengkap === project.developer ||
      session.user.namaLengkap === project.support ||
      session.user.role.includes("manager") ? (
        <>
          <form
            className="mb-6 flex flex-col gap-3 bg-slate-100 p-5 rounded-md"
            onSubmit={handleSubmitComment}
          >
            <p className="font-semibold text-lg">Insert Comment Below: </p>
            <div className="py-2 px-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
              <textarea
                onChange={(e) => setText(e.target.value)}
                id="comment"
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                placeholder="Write a comment about the project...."
                required
              />
            </div>
            <div className="flex gap-3 justify-start items-center w-full">
              <select
                id="dropdown"
                onChange={handleSelectChange}
                value={selectedOption || ""}
                className="text-base p-2 bg-slate-200 rounded-sm"
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="file"
                className=""
                multiple
                onChange={handleFileChange}
              />
              {selectedFiles.length > 0 && (
                <div className="flex p-5 items-center justify-start w-full">
                  <ul className="flex justify-start items-center gap gap-2 w-ful">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>
                        <span
                          className="inline-flex font-semibold justify-start items-start  mr-3 text-sm text-gray-900 gap-2 bg-white p-1 rounded-md"
                          onClick={handleRemoveFile}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="15"
                            height="15"
                            viewBox="0 0 48 48"
                          >
                            <path d="M 12.5 4 C 10.019 4 8 6.019 8 8.5 L 8 39.5 C 8 41.981 10.019 44 12.5 44 L 35.5 44 C 37.981 44 40 41.981 40 39.5 L 40 20 L 28.5 20 C 26.019 20 24 17.981 24 15.5 L 24 4 L 12.5 4 z M 27 4.8789062 L 27 15.5 C 27 16.327 27.673 17 28.5 17 L 39.121094 17 L 27 4.8789062 z"></path>
                          </svg>
                          {file.name}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="15"
                            height="15"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#f44336"
                              d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
                            ></path>
                            <path
                              fill="#fff"
                              d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
                            ></path>
                          </svg>
                        </span>
                      </li>
                    ))}
                  </ul>
                  {/* Additional file-related information can be displayed here */}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={isChecked}
                value={isChecked}
                onChange={(event) => setChecked(!isChecked)}
              />
              <label
                htmlFor="checkbox"
                className="ml-2 block text-sm text-gray-900"
              >
                Add notification cc email
              </label>
            </div>

            {isChecked && (
              <div className="flex items-center justify-start w-full p-2 gap-5">
                <input
                  className="w-1/2 p-2"
                  type="email"
                  name="ccText"
                  value={ccText}
                  placeholder="Input email cc and press enter"
                  onChange={(event) => setCcText(event.target.value)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter" && ccText.includes("@")) {
                      event.preventDefault();
                      setEmailCC((prevData) => new Set([...prevData, ccText]));
                      setCcText(""); // Clear the input field after pressing Enter
                    }
                  }}
                />
              </div>
            )}

            <div className="flex items-center flex-wrap justify-start gap-3">
              {isChecked &&
                [...emailCC].map((email) => (
                  <p className="bg-white p-2 rounded-md" key={email}>
                    {email}
                    <span className="text-red-500 ml-3 hover:cursor-pointer" onClick={()=>{
                      const updatedEmailCC = new Set(emailCC);
                      updatedEmailCC.delete(email);
                      setEmailCC(updatedEmailCC);
                    }}>x</span>
                  </p>
                ))}
            </div>
            <button
              type="submit"
              className="w-32 items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg"
            >
              Post Comment
            </button>
          </form>
        </>
      ) : null}
      <div className="border rounded-md mb-1 ">
        <button
          className="w-full p-5 text-left bg-gray-200  text-lg font-semibold
                           hover:bg-gray-300 transition duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          Comments ({comments.length})
          <span
            className={`float-right transform ${
              isOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-300`}
          >
            &#9660;
          </span>
        </button>
        {comments !== null &&
          comments.length > 0 &&
          isOpen &&
          comments.map((comment) => (
            <CommentCard key={comment.id} data={comment} />
          ))}
      </div>
    </section>
  );
};

export default CommentSection;
