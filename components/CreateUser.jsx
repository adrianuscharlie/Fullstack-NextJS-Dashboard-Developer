import React from "react";
import { useState, useEffect } from "react";
import {
  useRouter,
  useSearchParams,
  usePathname,
  redirect,
} from "next/navigation";
import Notification from "./Notification";
const CreateUser = ({handleSetLoading}) => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: "",
    namaLengkap: "",
    email: "",
    password: "powerglide",
    role: "",
    isActive: true,
  });

  const [notification, setNotification] = useState({
    show: false,
    title:'',
    type: '', // 'success', 'error', 'general'
  });
  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const handleUser = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit=async(event)=>{
    event.preventDefault();
    setNotification({
      show: true,
      type: 'general',
      title:'Creating new user!'
    });
    handleSetLoading(true);
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL +`/api/user`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
        'Content-Type': 'application/json', // Optional: set content type if needed
      }
    });
    const message=await response.text();
    if(response.ok) {
      setNotification({
        show: true,
        type: 'success',
        title:message,
      });
    }
    else {
      setNotification({
        show: true,
        type: 'error',
        title:message,
      });
    }
  handleSetLoading(false);
  }
  useEffect(() => {
    // If notification is closing, wait for it to close before navigating
    if (notification.isClosing) {
      const timeout = setTimeout(() => {
        setNotification({ ...notification, show: false, isClosing: false });
        router.push('/projects');
      }, 3000); // Adjust the timeout to match your notification close animation duration

      return () => clearTimeout(timeout);
    }
  }, [notification.isClosing, router]);
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
      <div className=" p-4">
      </div>
      <div className="p-4">
      <button
          type="submit"
          className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-sky-500 rounded-lg mt-4"
        >
          Create User
        </button>
      </div>
    </form></>
  );
};

export default CreateUser;
