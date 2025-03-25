"use client";
import React, { useEffect, useState } from "react";
import CommentCard from "./Comment";
import { useSession } from "next-auth/react";
import Loading from "./Loading";
import { ToastContainer, toast } from "react-toastify";
import {
  CloudUpload,
  File,
  Trash2,
  Loader,
  MessageSquareCode,
} from "lucide-react";
import axios from "axios";

const CommentSection = ({ project }) => {
  const { data: session } = useSession({ refetchOnWindowFocus: false });
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
    "Test Release",
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
      session.user.email,
    ])
  );
  const [ccText, setCcText] = useState("");
  const [isChecked, setChecked] = useState(false);
  useEffect(() => {
    const fetchComment = async () => {
      await axios
        .get(
          process.env.NEXT_PUBLIC_BASE_URL +
            `/api/projects/${
              project.project_name + "  " + project.version
            }/comments`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
              "Content-Type": "application/json", // Optional: set content type if needed
            },
          }
        )
        .then((response) => {
          setComments(response.data);
          setIsOpen(true);
        })
        .catch((error) =>
          console.log("Error fetching comments:", error.message)
        );
      setLoadingComments(false);
      setIsOpen(true);
    };
    fetchComment();
  }, []);

  const resetState = () => {
    setText("");
    setSelectedFiles([]);
    setIsOpen(false);
    setCcText("");
    setEmailCC(
      new Set([
        "handika_sp@indomaret.co.id",
        "bima_ans@indomaret.co.id",
        "hali.wimboko@indomaret.co.id",
        session.user.email,
      ])
    );
    setSelectedOption(null);
    setChecked(false);
    setEditTogle(null);
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    const isEditing = editTogle !== null;
    var commentObject = {
      project_name: project.project_name,
      author: session.user.namaLengkap,
      text: text,
      version: project.version,
      status: selectedOption,
      filePath: "",
      id: isEditing ? String(editTogle) : "",
    };

    const method = isEditing ? "put" : "post";
    const actionTitle = isEditing
      ? `Editing Comment with ID: ${editTogle}`
      : "Uploading New Comment";
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${commentObject.project_name}  ${commentObject.version}/comments/${editTogle}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${commentObject.project_name}  ${commentObject.version}/comments`;

    const toastComment = toast.loading(actionTitle);
    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        data: commentObject,
      });
      if (response.status === 200) {
        commentObject.date = response.data.date;
        if (!isEditing) {
          commentObject.id = response.data.id;
          commentObject.folder = project.project_name;
        }
        const newComments = isEditing
          ? comments.map((item) =>
              String(item.id) === String(commentObject.id)
                ? { ...commentObject }
                : item
            )
          : [commentObject, ...comments];
        setComments(newComments);
      }
      await toast.update(toastComment, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastComment, {
        render: error.response?.data?.message || "Failed to submit comment",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } 

    // File Upload Handling
    if (selectedFiles.length > 0) {
      const toastFiles = toast.loading("Uploading file into server...",{
        autoClose:3000
      });
      const formData = new FormData();
      formData.append("header", JSON.stringify(commentObject));
      selectedFiles.forEach((file, index) => {
        formData.append(`file_${commentObject.id}_${index + 1}`, file);
      });

      try {
        const response=await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/files`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if(response.status===200){
          toast.update(toastFiles, {
            render: "Success saving files into Server!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.update(toastFiles, {
          render: `File upload failed: ${error.message}`,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    }

    // Email Notification Handling
    if (isChecked) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/email/${project.project_name}_${project.version}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const { emailDeveloper, emailSupport } = response.data;
        let emailFrom = session.user.email;
        let emailRecipient = emailDeveloper;

        if (emailFrom === emailDeveloper) {
          emailRecipient = emailSupport;
        } else if (emailFrom === emailSupport) {
          emailRecipient = emailDeveloper;
        } else {
          emailRecipient += `;${emailSupport}`;
        }

        const toastEmail = toast.loading(
          "Sending email notification, please wait..."
        );

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

        let emailSent = false;
        for (let i = 0; i < 3; i++) {
          try {
            const emailResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/email`,
              emailFormData,
              {
                headers: {
                  Authorization: `Bearer ${session.accessToken}`,
                },
              }
            );

            if (emailResponse.status === 200) {
              toast.update(toastEmail, {
                render: "Success sending email!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
              emailSent = true;
              break;
            }
          } catch (error) {
            toast.update(toastEmail, {
              render: `Retry ${i + 1}/3 failed: ${error.message}`,
              type: "error",
              isLoading: false,
              autoClose: 3000,
            });
          }
        }

        if (!emailSent) {
          toast.update(toastEmail, {
            render: "Failed to send email after 3 attempts",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`Error fetching email details: ${error.message}`);
      }
    }

    // Reset state and close modal
    resetState();
    setIsOpen(!isOpen);
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
        const toastDelete = toast.loading("Deleting file in server");
        await axios
          .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/${filePath}`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
              "Content-Type": "application/json", // Optional: set content type if needed
            },
          })
          .then((response) => {
            toast.update(toastDelete, {
              render: response.data.message,
              type: response.status === 200 ? "success" : "error",
              isLoading: false,
              autoClose: 3000,
            });
          })
          .catch((error) => console.log(error.message));
      }
    }
  };
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
        const toastComment = toast.loading("Deleting comment...");
        await axios
          .delete(
            process.env.NEXT_PUBLIC_BASE_URL +
              `/api/projects/${
                project.project_name +
                "  " +
                project.version +
                "/comments/" +
                id
              }`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
                "Content-Type": "application/json", // Optional: set content type if needed
              },
            }
          )
          .then((response) => {
            if (response.status === 200) {
              setComments((prevItems) =>
                prevItems.filter((item) => item.id !== id)
              );
              toast.update(toastComment, {
                render: "Success deleting comment",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
            } else {
              toast.update(toastComment, {
                render: "Failed deleting comment",
                type: "error",
                isLoading: false,
                autoClose: 3000,
              });
            }
          })
          .catch((error) => console.log(error.message));
      }
      resetState();
    }
  };

  return (
    <section className="flex flex-col ">
      <ToastContainer />
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
