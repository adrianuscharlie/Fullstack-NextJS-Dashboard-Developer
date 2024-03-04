"use client";
import React, { useEffect, useState } from "react";
import CommentCard from "./Comment";
import { useSession } from "next-auth/react";
import Loading from "./Loading";

const CommentSection = ({ project }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const result = await fetch(`/api/projects/${project.id}/comments`);
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
    const currentTimestamp = Date.now();
    const mysqlTimestamp = new Date(currentTimestamp)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const commentObject = {
      project_id: project.id,
      username: session.id,
      text: text,
      status: project.status,
      filePath: "",
      date: mysqlTimestamp,
    };
    const response = await fetch(`/api/projects/${project.id}/comments`, {
      method: "POST",
      body: JSON.stringify(commentObject),
    });
    const { statusResponse, message, id } = await response.json();
    commentObject.id = id;

    if(selectedFiles.length>0){const formData = new FormData();
      commentObject.folder=project.project_name;
      // Append files to FormData
      selectedFiles.forEach((file, index) => {
        formData.append(`file_${id}_${index + 1}`, file);
      });
      // Append JSON object as a string
      formData.append('header', JSON.stringify(commentObject));
      const test=await fetch('/api/files/comments', {
          method: 'POST',
          body: formData,
        });
      if(test.ok){
        alert("bisa")
      }else{
        alert("gagal")
      }}
      setComments((prevItems) => [commentObject, ...prevItems]);
      setText("");
      setSelectedFiles([]);
      alert(message);
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
  if(loadingComments){
    return <Loading/>
  }
  return (
    <section className="w-full mx-auto mb-16 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Comments {comments.length}
        </h2>
      </div>
      {session.id === project.developer || session.id === project.support ? (
        <form className="mb-6" onSubmit={handleSubmitComment}>
          <div className="py-2 px-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
            <label htmlFor="comment" className="sr-only">
              Your Comment
            </label>
            <textarea
              onChange={(e) => setText(e.target.value)}
              id="comment"
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
              placeholder="Write a comment about the project...."
              required
            />
          </div>
          <div className="mt-5 flex justify-start items-center w-full">
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
                      <span className="inline-flex font-semibold justify-start items-start items-center mr-3 text-sm text-gray-900 gap-2 bg-white p-1 rounded-md" onClick={handleRemoveFile}>
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
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-yellow-500 rounded-lg mt-4"
          >
            Post Comment
          </button>
        </form>
      ) : null}
      {comments.length > 0 &&
        comments.map((comment) => (
          <CommentCard key={comment.id} data={comment} />
        ))}
    </section>
  );
};

export default CommentSection;
