import React, { useEffect, useState } from "react";
import { File, Pencil, User2, Day, Trash2 } from "lucide-react";
import Notification from "./Notification";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
const CommentCard = ({ data, onAction }) => {
  const { data: session, status } = useSession();
  const [comment, setComment] = useState(data);
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    type: "", // 'success', 'error', 'general'
  });
  useEffect(() => {
    const fetchFile = async () => {
      await axios
        .get(
          process.env.NEXT_PUBLIC_BASE_URL +
            `/api/files/comments/${comment.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
            },
          }
        )
        .then((response) => {
          setFiles(response.data);
        })
        .catch((error) => console.error("No files for comment"));
      setLoadingFiles(false);
    };
    fetchFile();
    const datetime = new Date(comment.date);
    setDate(
      `${("0" + datetime.getHours()).slice(-2)}:${(
        "0" + datetime.getMinutes()
      ).slice(-2)} ${("0" + datetime.getDate()).slice(-2)}/${(
        "0" +
        (datetime.getMonth() + 1)
      ).slice(-2)}/${datetime.getFullYear()}`
    );
  }, []);

  const handleDownload = async (file) => {
    const getRequest =
      file.fileName +
      "_" +
      file.commentID +
      "_" +
      file.project_name +
      "_" +
      file.version;
    const toastID=toast.loading("Downloading File :" + file.fileName + " .....")
    await axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + `/api/files/${getRequest}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          "Content-Type": "application/json", // Optional: set content type if needed
        },
        responseType: "blob",
      })
      .then(async (response) => {
        if (response.status === 200) {
          const blob = await response.data
          // Create a blob URL for the file content
          const url = window.URL.createObjectURL(blob);

          // Create a temporary link element
          const link = document.createElement("a");
          link.href = url;

          // Set the download attribute with the desired filename
          link.download = file.fileName;

          // Programmatically trigger the click event
          link.click();

          // Clean up by revoking the blob URL
          window.URL.revokeObjectURL(url);
          toast.update(toastID,{
            render:"Success downloading File :" + file.fileName,
            type:"success",
            isLoading:false,
            autoClose:3000
          })
        } else {
          toast.update(toastID,{
            render:"Failed Downloading File :" + file.fileName,
            type:"error",
            isLoading:false,
            autoClose:3000
          })
        }
      })
      .catch((error) => {
        toast.update(toastID,{
          render:"Failed Downloading File :" + file.fileName,
          type:"error",
          isLoading:false,
          autoClose:3000
        })
      });
  };

  const handleFileRemove = async (index) => {
    const updatedFiles = [...files];
    const fileObject = files[index];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    const check = confirm("Are you sure want to delete this file?");
    if (check) {
      const filePath = encodeURIComponent(fileObject.filePath);
      const toastID=toast.loading("Deleting file in server")
      await axios
        .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/files/${filePath}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
            "Content-Type": "application/json", // Optional: set content type if needed
          },
        })
        .then((response) => {
          toast.update(toastID,{
            render:response.status===200?"Success deleting file in server!":"Failed deleting file in server!",
            type:response.status===200?"success":"error",
            isLoading:false,
            autoClose:3000
          })
        });
    }
  };
  return (
    <>
  <ToastContainer/>
      <article className="p-6 text-base bg-slate-100 rounded-lg  m-5">
        <footer className="flex justify-between items-center mb-2">
          <div className="flex items-center justify-center gap gap-2">
            <span className="inline-flex text-xl font-semibold items-center mr-3  text-gray-900 gap-5 capitalize">
              <User2 />
              {comment.author}
            </span>
            {comment.status === "Development" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-yellow-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
            <p className="text-sm font-semibold text-gray-600 capitalize">
              {comment.status}
            </p>
            {comment.author === session.user.namaLengkap ? (
              <CommentModal onAction={onAction} id={comment.id} />
            ) : (
              <></>
            )}
          </div>
          <p className="text-sm text-gray-600 capitalize">{date}</p>
        </footer>

        <p className="text-gray-500 text-md" style={{ whiteSpace: "pre-line" }}>
          {comment.text}
        </p>
        {files.length > 0 && (
          <div className="flex p-5 items-center justify-start w-full">
            <ul className="flex justify-start items-center gap gap-2 w-ful">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="bg-slate-200 inline-flex font-semibold justify-start gap-2  p-1 rounded-md"
                >
                  <button
                    className="  inline-flex font-semibold justify-start items-start  mr-3 text-sm text-gray-900"
                    onClick={() => handleDownload(file)}
                  >
                    <File />
                    {file.fileName.substring(0, 20) + "..."}
                  </button>
                  {comment.author === session.user.namaLengkap ? (
                    <button
                      type="button"
                      className="ml-2"
                      onClick={() => handleFileRemove(index)}
                    >
                      <Trash2 className="text-red-500" />
                    </button>
                  ) : (
                    <></>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </>
  );
};

export default CommentCard;

const CommentModal = ({ id, onAction }) => {
  const options = ["edit", "delete"];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSelectChange = async (e) => {
    const result = e.target.value;
    setSelectedOption(result);
    await onAction({
      command: result,
      id: id,
    });
    setIsModalOpen(false);
  };
  const handleModalOpen = (e) => {
    setIsModalOpen(true);
  };
  return isModalOpen ? (
    <div className="">
      <select
        id="dropdown"
        onChange={handleSelectChange}
        value={selectedOption || ""}
        className="text-base p-2 bg-slate-200 rounded-sm"
        required
      >
        <option value="" disabled>
          Select Action
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  ) : (
    <>
      <button
        className="flex p-2.5 text-yellow-500 rounded-xl hover:rounded-3xl "
        onClick={handleModalOpen}
      >
        <Pencil />
      </button>
    </>
  );
};
