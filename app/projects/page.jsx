"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProjectsTable from "@/components/Projects";
import Loading from "@/components/Loading";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Accordion from "@/components/Accordion";

const Projects = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState({});
  const [searchResult, setSearchResult] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (status === "loading") return; // Don't do anything while session is loading

    if (!session) {
      // Redirect to login page if not authenticated.
      console.log(session, status);
      router.push("/login"); // Ensure router is used within useEffect
    }

    const fetchProjects = async () => {
      try {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/api/projects");
        if (!result.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await result.json();
        console.log(data)
        const orderedData = groupProjectsByProjectName(data);
        var dataFinal = {};
        Object.entries(orderedData).forEach(([key, value]) => {
          dataFinal[key] = {
            isOpen: false,
            title: key,
            projects: value,
          };
        });
        setProjects(dataFinal);
        setSearchResult(dataFinal);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      } finally {
        setLoadingProjects(false);
      }
    };
    const fetchUsers = async () => {
      const userResponse = await fetch("/api/users");
      const data = await userResponse.json();
      setUsers(data);
    };
    fetchProjects();
    fetchUsers();
  }, [session, status, router]);

  
  if (loadingProjects) {
    return <Loading />; // You can replace this with a loading spinner or any other loading indicator
  }
  function groupProjectsByProjectName(projects) {
    return projects.reduce((acc, project) => {
      const { project_name } = project;
      if (!acc[project_name]) {
        acc[project_name] = [];
      }
      acc[project_name].push(project);
      return acc;
    }, {});
  }
  const toggleAccordion = (projectName) => {
    setSearchResult((prevData) => ({
      ...prevData,
      [projectName]: {
        ...prevData[projectName],
        isOpen: !prevData[projectName].isOpen,
      },
    }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    const searchText=value.toLowerCase()
    setKeyword(searchText);
    if (searchText === "") {
      setSearchResult(projects);
    } else {
      const filteredKeys = Object.keys(projects).filter((key) =>
        key.toLowerCase().includes(searchText)
      );

      const filteredData = {};
      filteredKeys.forEach((key) => {
        filteredData[key] = projects[key];
      });
      setSearchResult(filteredData);
    }
  };

  return (
    <div>
      {session ? (
        <section className="page p-4 sm:ml-64 flex flex-col px-10 gap-10">
          <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
            List all project that managed by
            <span className="text-center capitalize"> KIS</span>
          </h1>
          <p className="text-start">
            {
              "Di bawah ini list setiap project dan di dalam setiap project terdapat versi beserta detailnya."
            }
          </p>
            <label
              for="default-search"
              class="mb-2 text-sm font-medium text-gray-900 sr-only "
            >
              Search
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Search project by name"
                value={keyword}
                onChange={handleSearch}
              />
            </div>
          <div className="flex flex-col gap-5 ">
            {Object.entries(searchResult).map(([key, value]) => (
              <Accordion
                key={key}
                title={value.title}
                projects={value.projects}
                users={users}
                isOpen={value.isOpen}
                toggleAccordion={() => toggleAccordion(key)}
              />
            ))}
          </div>
        </section>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Projects;
