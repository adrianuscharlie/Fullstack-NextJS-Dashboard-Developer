"use client";
import React, { useState } from "react";
import ProjectsTable from "./Projects";
import AddVersionModal from "@/components/AddVersionModal";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CircleFadingPlus } from "lucide-react";
const Accordion = ({ title, projects,users, isOpen, toggleAccordion }) => {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModal=()=>{
    setIsModalOpen(!isModalOpen);
  }
  const handleModalClose=()=>{
    setIsModalOpen(false);
  }
  return (
    <div className="border rounded-md mb-1">
      <button
        className="w-full p-4 text-left bg-gray-200  
                           hover:bg-gray-300 transition duration-300"
        onClick={toggleAccordion}
      >
        {title}
        <span
          className={`float-right transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }  
                                 transition-transform duration-300`}
        >
          &#9660;
        </span>
      </button>
      {isOpen && (
        <div className="flex flex-col p-10 gap-5">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">Details</p>
            {!session.user.role.includes("support")&&(
              <button onClick={handleModal} className=" bg-green-500 flex gap-2 p-2 rounded-md text-base text-white">
              <CircleFadingPlus/> Version
            </button>
            )}
            {isModalOpen ? (
              <AddVersionModal
                users={users}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                projectName={title}
                type={projects[0].type}
                details={projects[0].details}
                projects={projects}
              />
            ) : null}
          </div>
          <p className="text-lg">{projects[0].details}</p>
          <p className="text-lg font-semibold">Project Version</p>
          <ProjectsTable data={projects} />
        </div>
      )}
    </div>
  );
};

export default Accordion;
