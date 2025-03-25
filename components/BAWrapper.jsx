"use client"
import React, { useEffect } from 'react'
import InputProject from "@/components/InputProject";
import UpdateProject from "@/components/UpdateProject";
import DeleteProject from "@/components/DeleteProject";
import ProjectsTable from "@/components/Projects";
import ReleaseBADev from "@/components/ReleaseBADev";
import ReleaseBAUAT from "@/components/ReleaseBAUAT";
import ReleaseBaRelease from '@/components/ReleaseBARelease';
import { useState } from 'react';

const BAWrapper = ({projects,users,role}) => {
    const options = [
        "Release BA Development",
        "Release BA UAT",
        "Release BA Release",
      ];
      const [option, setOption] = useState([]);
      const [selectedOption, setSelectedOption] = useState(null);
      const [loading, setLoading] = useState(true);
      const [formData, setFormData] = useState({
        step: 1,
        option: "",
        inputField: "",
        updateField: "",
      });
      const handleSelectChange = (e) => {
        const selectedOption = e.target.value;
        setSelectedOption(selectedOption);
        setFormData((prevData) => ({
          ...prevData,
          option: selectedOption,
        }));
      };
      useEffect(()=>{
        if (role === "developer") {
            const option = options.filter(
              (item) => item !== "Release BA UAT" && item !== "Release BA Release"
            );
            setOption(option);
          } else if (role === "support") {
            const option = options.filter(
              (item) => item !== "Release BA Development"
            );
            setOption(option);
          } else {
            setOption(options);
          }
      },[])
    return (
        <section className="flex flex-col px-10 gap-10 page">
          <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
            Create Document Berita Acara
            <span className="text-center capitalize"> KIS</span>
          </h1>
          <p className="text-start">
            {
              "Create BA Development, BA UAT and BA Release by select item in combobox"
            }
          </p>
          <div className="grid grid-cols-[1fr,3fr] gap-4 text-lg rounded-md">
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
                {option.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {formData.option === "Input" && <InputProject users={users} />}
          {formData.option === "Update" && (
            <UpdateProject users={users} projects={projects} />
          )}
          {formData.option === "Delete" && <DeleteProject projects={projects} />}
          {formData.option === "View Project" && (
            <>
              {projects ? (
                <ProjectsTable data={projects} />
              ) : (
                <h1>There is no project for you</h1>
              )}
            </>
          )}
          {formData.option === "Release BA Development" && (
            <ReleaseBADev projects={projects} users={users} />
          )}
          {formData.option === "Release BA UAT" && (
            <ReleaseBAUAT projects={projects} users={users} />
          )}
          {formData.option === "Release BA Release" && (
            <ReleaseBaRelease projects={projects} />
          )}
        </section>
      );
    };

export default BAWrapper