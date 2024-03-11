"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProjectsTable from "@/components/Projects";
import Loading from "@/components/Loading";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Projects = () => {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const router = useRouter();
  if(!session){
    redirect('/login')
  }
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await fetch("/api/projects");
        if (!result.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await result.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  if (loadingProjects) {
    return <Loading />; // You can replace this with a loading spinner or any other loading indicator
  }
  return (
    <div>
      {session ? (
        <section>
          <h1 className="text-center text-4xl font-semibold mt-14">
            List all project that managed by
            <span className="orange_gradient text-center capitalize"> KIS</span>
          </h1>
          <p className="desc text-center">
            {
              "Dashboard for managing and Monitoring all KIS group Projects. Below, is the list of projects that are already created and managed by KIS group"
            }
          </p>
          <ProjectsTable data={projects} />
        </section>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Projects;
