"use client";
import React, { useEffect, useState } from "react";
import ProjectsTable from "@/components/Projects";
import Loading from "@/components/Loading";
import {  useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Accordion from "@/components/Accordion";
import axios from "axios";

const Projects = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState({});
  const [isToggled, setIsToggled] = useState(false);
  const [searchResult, setSearchResult] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [projectCatalog, setProjectCatalog] = useState([]);
  const [filteredProject,setFilteredProject]=useState([])
  const [listFilters,setListFilters]=useState({})
  const [filters, setFilters] = useState({
    type: "",
    developer:"",
    support: "",
    status: "",
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
  
    setFilters((prev) => {
      const updatedFilters = { ...prev, [name]: value };
  
      const filteredProjects = projectCatalog.filter((project) => {
        return (
          (updatedFilters.type === "" || project["type"] === updatedFilters.type) &&
          (updatedFilters.developer === "" || project["developer"] === updatedFilters.developer) &&
          (updatedFilters.support === "" || project["support"] === updatedFilters.support) &&
          (updatedFilters.status === "" || project["status"] === updatedFilters.status)
        );
      });
  
      setFilteredProject(filteredProjects);
  
      return updatedFilters;
    });
  };
  
  
  useEffect(() => {
    if (status === "loading") return; 

    if (!session) {
      router.push("/login");
      return;
    }

    const fetchProjects = async () => {
      await axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/api/projects",{headers:{
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      }}).then((response)=>{
        const orderedData=groupProjectsByProjectName(response.data);
        var catalogFinal = [];
      Object.entries(orderedData).forEach(([key, value]) => {
        catalogFinal.push(value[0]);
      });
      var dataFinal = {};
      Object.entries(orderedData).forEach(([key, value]) => {
        dataFinal[key] = {
          isOpen: false,
          title: key,
          projects: value,
        };
      })

      const filters=getFilter(catalogFinal)
      setProjectCatalog(catalogFinal);
      setFilteredProject(catalogFinal)
      setProjects(dataFinal);
      setSearchResult(dataFinal);
      setListFilters(filters)
      }).catch((error)=>console.log(error.message));
      setLoadingProjects(false)
    };
    fetchProjects();
  }, [session, router,status]);

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

  function getFilter(projects){
    const uniqueValues = projects.reduce((acc, obj) => {
      Object.keys(obj).forEach((key) => {
          if (!acc[key]) acc[key] = new Set(); // Initialize a set for each key
          acc[key].add(obj[key]); // Add the value to the set
      });
      return acc;
  }, {});
  
  // Convert sets to arrays for better usability
  const result = Object.fromEntries(
      Object.entries(uniqueValues).map(([key, valueSet]) => [key, [...valueSet]])
  );
  return result
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
    const searchText = value.toLowerCase();
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

  
  if (loadingProjects) {
    return <Loading />;
  }

  if (!session) {
    router.push("/login");
  }
  return (
    <div>
      {session ? (
        <section className="page p-4 sm:ml-64 flex flex-col px-10 gap-10 mb-20">
          <div className="flex justify-between">
            <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
              List all project that managed by KIS
            </h1>
            <div className="flex items-end gap-4">
              {/* Toggle Switch */}
              <div
                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  isToggled ? "bg-green-500" : "bg-gray-300"
                }`}
                onClick={() => setIsToggled(!isToggled)}
              >
                {/* Circle */}
                <div
                  className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform ${
                    isToggled ? "translate-x-4" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
          </div>
          {!isToggled ? (
            <>
              <p className="text-start">
                {
                  "Di bawah ini list setiap project dan di dalam setiap project terdapat versi beserta detailnya."
                }
              </p>

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
                    isOpen={value.isOpen}
                    toggleAccordion={() => toggleAccordion(key)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-10">
                <p>Filter</p>
                <div className="flex justify-start items-center gap-10">
                  <select className="p-2 bg-gray-200" name="type" value={filters.type} onChange={handleFilterChange}>
                    <option selected value={""}>Project Type</option>
                    {listFilters.type.map((value,index)=>(
                      <option value={value} key={index}>{value}</option>
                    ))}
                  </select>
                  <select className="p-2 bg-gray-200" name="developer" value={filters.developer} onChange={handleFilterChange}>
                    <option  selected value={""}>Project Developer</option>
                    {listFilters.developer.map((value,index)=>(
                      <option value={value} key={index}>{value}</option>
                    ))}
                  </select>
                  <select className="p-2 bg-gray-200" name="support" value={filters.support} onChange={handleFilterChange}>
                    <option selected value={""}>Project Support</option>
                    {listFilters.support.map((value,index)=>(
                      <option value={value} key={index}>{value}</option>
                    ))}
                  </select>
                  <select className="p-2 bg-gray-200" name="status" value={filters.status} onChange={handleFilterChange}>
                    <option selected value={""}>Project Status</option>
                    {listFilters.status.map((value,index)=>(
                      <option value={value} key={index}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>
              <ProjectsTable data={filteredProject} />
            </div>
          )}
        </section>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Projects;
