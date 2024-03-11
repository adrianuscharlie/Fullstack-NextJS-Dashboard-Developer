"use client";
import Loading from "@/components/Loading";
import ProjectsTable from "@/components/Projects";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession ,signIn} from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  if(!session){
    redirect('/login');
  }
  const [user, setUser] = useState(session.user);
  const [projects, setProjects] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseProject = await fetch(
          `/api/projects/user/${user.username}`
        );
        if(responseProject.ok){
          const dataProject = await responseProject.json();
          setProjects(dataProject);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoadingProjects(false);
        setLoadingUser(false);
      }
    };
    fetchUserData();
  },[]);
  
  if (loadingUser || loadingProjects) {
    return <Loading />; // You can replace this with a loading spinner or any other loading indicator
  }
  return (
    <section className="w-full flex-center flex-col py-10">
      <h1 className="text-center text-4xl font-semibold">
            Welcome to KIS Project Dashboard,
            <span className="orange_gradient text-center capitalize">
              {" "}
              {user.username}
            </span>
          </h1>
          <p className="desc text-center">
            {
              "Dashboard for managing and Monitoring all KIS group Projects. Below, is the list of projects that are already created and managed by you"
            }
          </p>
          <>
            {projects?(
              <ProjectsTable data={projects} />
            ):(
              <h1>There is no project for you</h1>
            )}
            </>
    </section>
  );
}
