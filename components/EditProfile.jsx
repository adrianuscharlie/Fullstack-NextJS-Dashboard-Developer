"use client";
import React from "react";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const EditProfile = ({ user }) => {
  const [userData, setUserData] = useState(user);
  const handleUser = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
      ["isActive"]:true
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response =await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + `/api/user/edit__${user.namaLengkap}`,
      {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header to JSON
        },
      }
    );
    const message=await response.text();
    alert(message);
    if(response.ok){
        alert("Will be redirect into login page to login again");
        signOut();
    }
  };
  return (
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
            disabled
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
          </select>
        </div>
      </div>
      <div className="p-4">
        <label htmlFor="dropdown">Enter password</label>
      </div>
      <div className=" p-4">
        <div>
          <input
            type="password"
            id="inputField"
            name="password"
            value={userData.password || ""}
            onChange={handleUser}
            className="text-base w-full p-2 bg-gray-100"
            placeholder="Enter password to update profile"
          />
        </div>
      </div>
      <div className=" p-4"></div>
      <div className="p-4">
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
        >
          Edit Profile
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
