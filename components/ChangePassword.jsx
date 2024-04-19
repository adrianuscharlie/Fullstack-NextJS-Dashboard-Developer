"use client";
import React from "react";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ChangePassword = ({ user }) => {
  const [formData, setFormData] = useState({
    namaLengkap: user.namaLengkap,
    password: "",
    newPassword: "",
    confirm: "",
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData)
    if(formData.newPassword==formData.confirm){
      const response =await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/user/changePassword_${user.namaLengkap}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
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
    }else{
      alert("New password must be match")
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
            value={formData.namaLengkap}
            onChange={handleForm}
            className="text-base w-full p-2 bg-gray-100"
            disabled
          />
        </div>
      </div>
      <div className="p-4">
        <label htmlFor="dropdown">Old Password</label>
      </div>
      <div className=" p-4">
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleForm}
            className="text-base w-full p-2 bg-gray-100"
            placeholder="Enter new password..."
            
          />
        </div>
      </div>
      <div className="p-4">
        <label htmlFor="dropdown">New Password</label>
      </div>
      <div className=" p-4">
        <div>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleForm}
            className="text-base w-full p-2 bg-gray-100"
            placeholder="Enter new password..."
          />
        </div>
      </div>
      <div className="p-4">
        <label htmlFor="dropdown">Confirm new password</label>
      </div>
      <div className=" p-4">
        <div>
          <input
            type="password"
            name="confirm"
            value={formData.confirm}
            onChange={handleForm}
            className="text-base w-full p-2 bg-gray-100"
            placeholder="confirm new password"
          />
        </div>
        {formData.newPassword!==formData.confirm&&(
          <p className="text-sm mt-3 font-semibold text-red-500">{"Password doesn't match"}</p>
        )}
      </div>
      <div className=" p-4"></div>
      <div className="p-4">
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
        >
          Change Password
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
