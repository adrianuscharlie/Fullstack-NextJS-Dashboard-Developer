import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import stream from "stream";
import { promisify } from "util";
const CommentCard = ({ data }) => {
  const [comment, setComment] = useState(data);
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(true);
  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(`/api/files/comments/${comment.id}`);
        if (response.ok) {
          const data = await response.json();
          setFiles(data);
        }
      } catch (error) {
        // console.error("Error fetching files:", error.message);
      } finally {
        setLoadingFiles(false);
      }
    };

    const inputDate = new Date(comment.date);
    // Extracting hours, minutes, day, month, and year
    const hours = inputDate.getUTCHours();
    const minutes = inputDate.getUTCMinutes();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Extracting day, month, and year
    const day = inputDate.getUTCDate();
    const month = monthNames[inputDate.getUTCMonth()];
    const year = inputDate.getUTCFullYear();
    setDate(`${day} ${month} ${year}  ${hours}:${minutes} `);
    fetchFile();
  }, []);

  const handleDownload = async (file) => {
    const getRequest =
      file.fileName + "_" + file.commentID + "_" + file.projectID;
    const response = await fetch(`/api/files/${getRequest}`);
    if (response.ok) {
      const blob = await response.blob();
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
    } else {
      alert("Failed to download " + file.fileName);
    }
  };
  return (
    <article className="p-6 text-base bg-white rounded-lg shadow-lg">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center justify-center gap gap-2">
          <span className="inline-flex text-xl font-semibold items-center mr-3 text-sm text-gray-900 gap-5 capitalize">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            {comment.username}
          </span>
          {comment.status === "Development" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
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
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          )}
          <p className="text-sm text-gray-600 capitalize">{comment.status}</p>
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
              <li key={index}>
                <button
                  className=" bg-slate-200 inline-flex font-semibold justify-start items-start items-center mr-3 text-sm text-gray-900 gap-2 bg-white p-1 rounded-md"
                  onClick={() => handleDownload(file)}
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
                  {file.fileName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

export default CommentCard;
