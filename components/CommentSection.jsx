"use client";
import React, { useEffect, useState } from "react";
import CommentCard from "./Comment";
import { useSession } from "next-auth/react";
import Loading from "./Loading";
import Notification from "./Notification";
import {
  CloudUpload,
  File,
  Trash2,
  Loader,
  MessageSquareCode,
} from "lucide-react";

const CommentSection = ({ project, handleStatus, handleSetLoading }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [options, setOptions] = useState([
    "Development",
    "Bugs",
    "Fixing Bugs",
    "SIT",
    "UAT",
    "Test Support",
    "Release",
  ]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editTogle, setEditTogle] = useState(null);
  const [emailCC, setEmailCC] = useState(
    new Set([
      "handika_sp@indomaret.co.id",
      "bima_ans@indomaret.co.id",
      "hali.wimboko@indomaret.co.id",
      session.user.email
    ])
  );
  const [ccText, setCcText] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    type: "", // 'success', 'error', 'general'
  });
  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const result = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL +
            `/api/projects/${
              project.project_name + "  " + project.version
            }/comments`,
            {
              headers: {
                'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
                'Content-Type': 'application/json', // Optional: set content type if needed
              }
            }
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
    // If notification is closing, wait for it to close before navigating
    if (notification.isClosing) {
      const timeout = setTimeout(() => {
        setNotification({ ...notification, show: false, isClosing: false });
      }, 3000); // Adjust the timeout to match your notification close animation duration

      return () => clearTimeout(timeout);
    }
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
      id: editTogle || "", // Include id only if editing
    };

    const isEditing = editTogle !== null;
    const method = isEditing ? "PUT" : "POST";
    const actionTitle = isEditing
      ? `Editing Comment with ID: ${editTogle}`
      : "Uploading New Comment";

    setNotification({
      show: true,
      type: "general",
      title: actionTitle,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${
        project.project_name + "  " + project.version
      }/comments`,
      {
        method,
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          'Content-Type': 'application/json', // Optional: set content type if needed
        },
        body: JSON.stringify(commentObject),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      setNotification({
        show: true,
        type: "error",
        title: result.message || "Failed to submit comment",
      });
      handleSetLoading(false);
      return;
    }

    // Update the comment with ID and Date received from the response
    commentObject.id = result.id;
    commentObject.date = result.date;
    commentObject.folder = project.project_name;
    // Handle file uploads if any files are selected
    if (selectedFiles.length > 0) {
      setNotification({
        show: true,
        type: "general",
        title: "Uploading file into server...",
      });

      const formData = new FormData();
      formData.append("header", JSON.stringify(commentObject));
      selectedFiles.forEach((file, index) => {
        formData.append(`file_${commentObject.id}_${index + 1}`, file);
      });

      const fileUploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/files`,
        {
          method: "POST",
          body: formData,
          headers: {
            'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          }
        }
      );

      const uploadMessage = await fileUploadResponse.text();
      setNotification({
        show: true,
        type: fileUploadResponse.ok ? "success" : "error",
        title: uploadMessage,
      });
    }

    // Send email notifications if needed
    const emailResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/email/${project.project_name}_${project.version}`,{
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          'Content-Type': 'application/json', // Optional: set content type if needed
        }
      }
    );

    const { emailDeveloper, emailSupport } = await emailResponse.json();
    let emailFrom = session.user.email;
    let emailRecipient = emailDeveloper;

    if (emailFrom === emailDeveloper) {
      emailRecipient = emailSupport;
    } else if (emailFrom === emailSupport) {
      emailRecipient = emailDeveloper;
    } else {
      emailRecipient += `;${emailSupport}`;
    }

    setNotification({
      show: true,
      type: "general",
      title: "Sending email notification, please wait...",
    });

    const emailObject = {
      subject: `[${commentObject.status}] Program ${project.project_name} Version ${project.version}`,
      body: text,
      from: emailFrom,
      to: emailRecipient,
      cc: [...emailCC].join(";"),
    };

    const emailFormData = new FormData();
    emailFormData.append("email", JSON.stringify(emailObject));
    selectedFiles.forEach((file, index) => {
      emailFormData.append(`file_${index + 1}`, file);
    });

    const sendEmail = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/email`,
      {
        method: "POST",
        body: emailFormData,
        headers: {
          'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
        }
      }
    );

    const emailMessage = await sendEmail.text();
    if (!sendEmail.ok) {
      for (let i = 0; i < 3; i++) {
        setNotification({
          show: true,
          type: "general",
          title: "Resending Email...",
        });

        const resendEmail = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/email`,
          {
            method: "POST",
            body: emailFormData,
            headers: {
              'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
            }
          }
        );

        const resendMessage = await resendEmail.text();
        if (resendEmail.ok) {
          setNotification({
            show: true,
            type: "success",
            title: resendMessage,
          });
          break;
        } else {
          setNotification({
            show: true,
            type: "error",
            title: resendMessage,
          });
        }
      }
    } else {
      setNotification({
        show: true,
        type: "success",
        title: emailMessage,
      });
    }

    // Update UI and clear form
    setComments((prevItems) => {
      if (editTogle === null) {
        // Adding a new comment
        return [commentObject, ...prevItems];
      } else {
        // Updating an existing comment
        return prevItems.map((item) =>
          item.id === commentObject.id ? commentObject : item
        );
      }
    });
    setText("");
    setSelectedFiles([]);
    setIsOpen(false);
    setCcText("");
    setEmailCC(new Set([
      "handika_sp@indomaret.co.id",
      "bima_ans@indomaret.co.id",
      "hali.wimboko@indomaret.co.id",
      session.user.email
    ]));
    setSelectedOption(null);
    handleSetLoading(false);
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    // Filter the new files to reject those with underscores
    const filteredFiles = newFiles.filter((file) => {
      if (file.name.includes("_")) {
        alert(
          `The file "${file.name}" contains an underscore and will be rejected.`
        );
        return false;
      }
      return true;
    });

    if (filteredFiles.length > 0) {
      setSelectedFiles((prevSelectedFiles) => [
        ...prevSelectedFiles,
        ...filteredFiles,
      ]);
    }
  };
  const handleRemoveFile = async (index) => {
    const updatedFiles = [...selectedFiles];
    const fileObject = selectedFiles[index];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    if (editTogle) {
      const check = confirm("Are you sure want to delete this file?");
      if (check) {
        const filePath = encodeURIComponent(fileObject.filePath);
        setNotification({
          show: true,
          type: "general",
          title: "Deleting file in server",
        });
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/files/${filePath}`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
            'Content-Type': 'application/json', // Optional: set content type if needed
          }
        });
        const message = await response.text();
        if (response.ok) {
          setNotification({
            show: true,
            type: "success",
            title: message,
          });
          setEditTogle(null)
        } else {
          setNotification({
            show: true,
            type: "error",
            title: message,
          });
        }
      }
    }
  };
  if (loadingComments) {
    return <Loading />;
  }
  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
  };

  const handleOnAction = async (action) => {
    const { command, id } = action;
    if (command === "edit") {
      window.scrollTo({
        top: 120,
        behavior: "smooth",
      });
      const commentData = comments.filter((item) => item.id === id)[0];
      setText(commentData.text);
      setSelectedOption(commentData.status);
      setEditTogle(id);
    } else {
      const confirm = window.confirm("Are you sure?");
      if (confirm) {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL +
            `/api/projects/${
              project.project_name + "  " + project.version + "/comments/" + id
            }`,
          {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
              'Content-Type': 'application/json', // Optional: set content type if needed
            }
          }
        );
        const { message } = await response.json();
        if (response.ok) {
          setComments((prevItems) =>
            prevItems.filter((item) => item.id !== id)
          );
          setNotification({
            show: true,
            type: "success",
            title: message,
          });
        }
      }
    setText("");
    setSelectedFiles([]);
    setIsOpen(false);
    setCcText("");
    setEmailCC(new new Set([
      "handika_sp@indomaret.co.id",
      "bima_ans@indomaret.co.id",
      "hali.wimboko@indomaret.co.id",
      session.user.email
    ]));
    setSelectedOption(null);
    handleSetLoading(false);
    }
  };

  return (
    <section className="p-4 sm:ml-64 flex flex-col px-10 gap-10">
      {notification.show && (
        <Notification
          type={notification.type}
          title={notification.title}
          onClose={closeNotification}
        />
      )}
      {session.user.namaLengkap === project.developer ||
      session.user.namaLengkap === project.support ||
      session.user.role.includes("manager") ||
      session.user.role.includes("ba_dev") ? (
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
                value={text}
                required
              />
            </div>
            <div className="flex flex-col container gap-3 justify-start items-start w-full">
              <div className="flex w-full gap-3 justify-start items-center">
                {/* Dropdown */}
                <Loader className="text-yellow-500" />
                <select
                  id="dropdown"
                  onChange={handleSelectChange}
                  value={selectedOption || ""}
                  className="text-base p-2 bg-slate-200 rounded-sm w-1/3"
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

                {/* File Input */}
                <input
                  type="file"
                  className="p-2 rounded-sm w-2/3"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              {/* Display selected files */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap p-5 items-start justify-start gap-2 w-ful rounded-md">
                  <ul className="flex flex-wrap justify-start items-start gap-2 w-full">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="w-full sm:w-auto flex items-center bg-slate-200"
                      >
                        <span className="inline-flex items-center font-semibold text-sm text-gray-900 gap-2  p-2 rounded-md shadow-sm w-full sm:w-auto">
                          <File className="text-xs" />
                          {file.name}
                          <button
                            type="button"
                            className="ml-2"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <Trash2 className="text-red-500" />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
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
                    <span
                      className="text-red-500 ml-3 hover:cursor-pointer"
                      onClick={() => {
                        const updatedEmailCC = new Set(emailCC);
                        updatedEmailCC.delete(email);
                        setEmailCC(updatedEmailCC);
                      }}
                    >
                      x
                    </span>
                  </p>
                ))}
            </div>
            <button
              type="submit"
              className="w-40 flex items-center gap-3 py-2.5 px-2 text-sm font-medium text-center text-white bg-sky-500 rounded-lg"
            >
              <CloudUpload />
              Post Comment
            </button>
          </form>
        </>
      ) : null}
      <div className="border rounded-md mb-1 ">
        <button
          className="w-full flex justify-between p-5 text-left bg-gray-200  text-lg font-semibold
                           hover:bg-gray-300 transition duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageSquareCode className="text-yellow-500" />
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
            <CommentCard
              key={comment.id}
              data={comment}
              onAction={handleOnAction}
            />
          ))}
      </div>
    </section>
  );
};

export default CommentSection;
