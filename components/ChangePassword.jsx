"use client";
import React from "react";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { CloudUpload } from "lucide-react";
import Notification from "./Notification";
import axios from "axios";
const ChangePassword = ({ user, handleSetLoading }) => {
  const [formData, setFormData] = useState({
    namaLengkap: user.namaLengkap,
    password: "",
    newPassword: "",
    confirm: "",
  });
  const { data: session, status } = useSession();
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    type: "", // 'success', 'error', 'general'
  });
  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const showNotification = async (type, title) => {
    setNotification({ show: true, type, title });
    setTimeout(() => {
      closeNotification();
    }, 3000);
  };
  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.newPassword == formData.confirm) {
      showNotification("general", "Change User Password....");
      await axios
        .put(
          process.env.NEXT_PUBLIC_BASE_URL +
            `/api/user/changePassword_${user.namaLengkap}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
              "Content-Type": "application/json", // Optional: set content type if needed
            },
          }
        )
        .then(async (response) => {
          if (response.status === 200) {
            showNotification("success", "Password has been changed!");
            showNotification(
              "general",
              "Will be redirect into login page to login again"
            );
            await signOut({redirect:false}).then(()=>router.push("/login"))
          } else showNotification("error", "Failed to change password");
        });
    } else showNotification("error", "new password must be match!");
  };
  return (
    <>
      {notification.show && (
        <Notification
          type={notification.type}
          title={notification.title}
          onClose={closeNotification}
        />
      )}
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
              placeholder="Enter old password..."
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
          {formData.newPassword !== formData.confirm && (
            <p className="text-sm mt-3 font-semibold text-red-500">
              {"Password doesn't match"}
            </p>
          )}
        </div>
        <div className=" p-4"></div>
        <div className="p-4">
          <button
            type="submit"
            className="flex items-center gap-3 py-2.5 px-2 text-sm font-medium text-center text-white bg-sky-500 rounded-lg"
          >
            <CloudUpload />
            Change Password
          </button>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
