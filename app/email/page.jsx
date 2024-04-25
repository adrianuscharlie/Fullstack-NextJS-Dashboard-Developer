"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
const EmailPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formEmail, setFormEmail] = useState({
    subject: "",
    body: "",
    to: "",
    cc: "",
    from: "",
  });
  const [emailRecipient, setEmailRecipient] = useState(new Set([]));
  const [emailCC, setEmailCC] = useState(new Set([]));
  const [ccText, setCcText] = useState("");
  const [recippientText, setRecipientText] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }
    setFormEmail((prevData) => ({
      ...prevData,
      ["from"]: session.user.email,
    }));
    console.log(session.user);
    setLoading(false);
  }, [session, status, router]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    setFormEmail((prevData)=>({
      ...prevData,
      ["to"]:[...emailRecipient].join(";"),
      ["cc"]:[...emailCC].join(";"),
    }))
    formData.append("email", JSON.stringify(formEmail));
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file, index) => {
        formData.append(`file_${index + 1}`, file);
      });
    }
    const test = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/email", {
      method: "POST",
      body: formData,
    });
    const message = await test.text();
    alert(message);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEmail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
  if (loading) {
    return <Loading />;
  }
  return (
    <section className="page p-4 sm:ml-64 flex flex-col px-10 gap-10">
      <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
        Send Email
        <span className="text-center capitalize"> KIS</span>
      </h1>
      <p className="text-start">
        {"Send email to a few people with subject, message and attachment"}
      </p>
      <div className="grid grid-cols-[1fr,3fr] gap-4 text-lg rounded-md"></div>
      <form
        className="grid grid-cols-[1fr,3fr] gap-4 text-lg"
        onSubmit={handleSubmit}
      >
        <div className="p-4">
          <label htmlFor="dropdown">Subject Email</label>
        </div>
        <div className="p-4">
          <div>
            <input
              type="text"
              id="inputField"
              name="subject"
              value={formEmail.subject}
              onChange={handleChange}
              className="text-base w-full p-2 bg-gray-100"
              placeholder="Enter email subject"
              required
            />
          </div>
        </div>
        <div className="p-4">
          <label htmlFor="dropdown">Recipient</label>
        </div>
        <div className="p-4">
          <div>
            <input
              onChange={(event) => setRecipientText(event.target.value)}
              className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
              placeholder="Masukan email kemudian tekan enter"
              name="to"
              value={recippientText}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  setEmailRecipient(
                    new Set([...emailRecipient, recippientText])
                  );
                  setRecipientText(" ");
                }
              }}
              required
            />
          </div>
          <div className="flex items-center flex-wrap justify-start gap-3 mt-2">
            {emailRecipient.size > 0 &&
              [...emailRecipient].map((email) => (
                <p className="bg-gray-100 p-2 rounded-md" key={email}>
                  {email}
                </p>
              ))}
          </div>
        </div>
        <div className="p-4">
          <label htmlFor="dropdown">Cc</label>
        </div>
        <div className="p-4">
          <div>
            <input
              onChange={(event) => setCcText(event.target.value)}
              className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
              placeholder="Masukan email kemudian tekan enter"
              name="cc"
              value={ccText}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  setEmailCC(new Set([...emailCC, ccText]));
                  setCcText(" ");
                }
              }}
              
            />
          </div>
          <div className="flex items-center flex-wrap justify-start gap-3 mt-2">
            {emailCC.size > 0 &&
              [...emailCC].map((email) => (
                <p className="bg-gray-100 p-2 rounded-md" key={email}>
                  {email}
                </p>
              ))}
          </div>
        </div>
        <div className=" p-4">
          <label htmlFor="dropdown">Body</label>
        </div>
        <div className=" p-4">
          <textarea
            onChange={handleChange}
            className="p-4 w-full text-sm bg-gray-100 text-gray-900 border-0 focus:ring-0 focus:outline-none"
            placeholder="Input email body...."
            name="body"
            required
            value={formEmail.body}
          />
        </div>
        <div className=" p-4">
          <label htmlFor="dropdown">Attachments</label>
        </div>
        <div className=" p-4">
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
        <div className=" p-4">
          {/* <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
          >Send Email</button> */}
        </div>
        <div className=" p-4">
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
          >
            Send Email
          </button>
        </div>
      </form>
    </section>
  );
};

export default EmailPage;
