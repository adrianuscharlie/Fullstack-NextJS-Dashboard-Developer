import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer,toast } from "react-toastify";
import Notification from "./Notification";
import axios from "axios";
const CreateUser = () => {
  const [userData, setUserData] = useState({
    username: "",
    namaLengkap: "",
    email: "",
    password: "powerglide",
    role: "",
    isActive: true,
  });


  const handleUser = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const toastID=toast.loading("Creating new user....")
    await axios
      .post(process.env.NEXT_PUBLIC_BASE_URL + `/api/user`, userData, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
          "Content-Type": "application/json", // Optional: set content type if needed
        },
      })
      .then((response) => {
        toast.update(toastID,{
          render:response.status===200?"Success creating new User!":"Failed creating new user!",
          type:response.status===200?"success":"error",
          isLoading:false,
          autoClose:3000
        })
      });
  };
  return (
    <>
    <ToastContainer/>
      <form
        className="grid grid-cols-[1fr,3fr] gap-4 text-lg"
        onSubmit={handleSubmit}
      >
        <div className="p-4">
          <label htmlFor="dropdown">Nama Lengkap</label>
        </div>
        <div className=" p-4">
          <div>
            <input
              type="text"
              id="namaLengkap"
              name="namaLengkap"
              value={userData.namaLengkap}
              onChange={handleUser}
              className="text-base w-full p-2 bg-gray-100"
              placeholder="Enter nama lengkap..."
            />
          </div>
        </div>
        <div className="p-4">
          <label htmlFor="dropdown">Username</label>
        </div>
        <div className=" p-4">
          <div>
            <input
              type="text"
              id="inputField"
              name="username"
              value={userData.username}
              onChange={handleUser}
              className="text-base w-full p-2 bg-gray-100"
              placeholder="Enter username..."
            />
          </div>
        </div>
        <div className="p-4">
          <label htmlFor="dropdown">Email</label>
        </div>
        <div className=" p-4">
          <div>
            <input
              type="email"
              id="inputField"
              name="email"
              value={userData.email}
              onChange={handleUser}
              className="text-base w-full p-2 bg-gray-100"
              placeholder="Enter email..."
            />
          </div>
        </div>
        <div className=" p-4">
          <label htmlFor="dropdown">Role</label>
        </div>
        <div className="p-4">
          <div>
            <select
              id="dropdown"
              onChange={handleUser}
              value={userData.role}
              name="role"
              className="text-base p-2 bg-gray-100"
            >
              <option value="" disabled>
                Select user role
              </option>
              <option value="developer">Developer</option>
              <option value="support">Support</option>
              <option value="manager">Manager</option>
              <option value="ba_dev">Business Analyst</option>
            </select>
          </div>
        </div>
        <div className=" p-4"></div>
        <div className="p-4">
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
          >
            Create User
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateUser;
