"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import {
  useRouter,
  useSearchParams,
  usePathname,
  redirect,
} from "next/navigation";
import { useSession } from "next-auth/react";
import InputProject from "@/components/InputProject";
import UpdateProject from "@/components/UpdateProject";
import DeleteProject from "@/components/DeleteProject";
const AdminPage = () => {
  const { data: session } = useSession();
  const options = ["Update", "Input", "Delete"];
  const [selectedOption, setSelectedOption] = useState(null);

  const [formData, setFormData] = useState({
    step: 1,
    option: "",
    inputField: "",
    updateField: "",
  });
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const userResponse = await fetch("/api/users");
      const data = await userResponse.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);
  const router = useRouter();
  if (!session) {
    return <Loading />; // You can replace this with a loading spinner or any other loading indicator
  }
  if (!session || session.user.role !== "Admin") {
    router.push("/");
  }
  
  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      option: selectedOption,
    }));
  };
  return (
    <section className="pt-16 mb-10 w-full mx-auto">
      <h1 className="orange_gradient text-4xl font-bold mb-10">
        Admin Dashboard
      </h1>
      <p className="font-semibold text-xl">
        Welcome Admin! Manage all KIS Group Project from this page
      </p>
      <div className="grid grid-cols-[1fr,3fr] gap-4 mt-10  text-lg">
        {/* Replace the following divs with your actual content */}
        <div className="p-4">
          <label htmlFor="dropdown">Select an option:</label>
        </div>
        <div className="p-4">
          <select
            id="dropdown"
            onChange={handleSelectChange}
            value={selectedOption || ""}
            className="text-base p-2"
          >
            <option value="" disabled>
              Select an action
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      {formData.option === "Input" && <InputProject users={users} />}
      {formData.option === "Update" && <UpdateProject users={users} />}
      {formData.option==="Delete"&&<DeleteProject/>}
    </section>
  );
};

export default AdminPage;
