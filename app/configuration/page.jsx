"use client";
import React from "react";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EditProfile from "@/components/EditProfile";
import ChangePassword from "@/components/ChangePassword";
const Configuration = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const options = [
    "Edit Profile",
    "Change Password",
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(()=>{
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(false);
  },[session])

  if (loading) {
    return <Loading />;
  }
  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
  };

  const handleSetLoading=(value)=>{
    setLoading(value)
  }
  return (
    <section className="p-4 sm:ml-64 flex flex-col px-10 gap-10">
      <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
        Profile Configuration
      </h1>
      <p className="text-start">{"Customize your user profile in this page"}</p>
      <div className="grid grid-cols-[1fr,3fr] gap-4  text-lg">
        {/* Replace the following divs with your actual content */}
        <div className="p-4">
          <label htmlFor="dropdown">Select an option:</label>
        </div>
        <div className="p-4">
          <select
            id="dropdown"
            onChange={handleSelectChange}
            value={selectedOption || ""}
            className="text-base p-2 bg-gray-100"
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
      {selectedOption==="Edit Profile"&&(
        <EditProfile user={session.user} handleSetLoading={handleSetLoading}/>
      )}
      {selectedOption==="Change Password"&&(
        <ChangePassword user={session.user} handleSetLoading={handleSetLoading}/>
      )}
    </section>
  );
};

export default Configuration;
