"use client"
import React from "react";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import { useState } from "react";
const ConfigurationWrapper = ({ user }) => {
  const options = ["Edit Profile", "Change Password"];
  const [selectedOption, setSelectedOption] = useState(null);
  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
  };
  return (
    <section className="page flex flex-col px-10 gap-10">
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
      {selectedOption === "Edit Profile" && <EditProfile user={user} />}
      {selectedOption === "Change Password" && <ChangePassword user={user} />}
    </section>
  );
};

export default ConfigurationWrapper;
