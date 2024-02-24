"use client";
import Loading from "@/components/Loading";
import { useRouter, useSearchParams, usePathname ,redirect} from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
const Project = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [project, setProject] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(true);
  useEffect(() => {
    if(!session){
      redirect('/login');
    }
    const fetchProduct = async () => {
      const url = `${pathname}${searchParams}`;
      const split = pathname.split("/");
      const id = split[2];
      try {
        const result = await fetch(`/api/projects/${id}`);
        if (!result.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await result.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProduct();
  }, []);
  if (loadingProjects) {
    return <Loading/>; // You can replace this with a loading spinner or any other loading indicator
  }
  return (
    <section className="pt-16 mb-20 w-full mx-auto">
      <h1 className="orange_gradient text-4xl font-bold mb-10">
        {project.project_name}
      </h1>
      <div className="grid gap-4 font-semibold text-xl">
        <div className="flex items-center justify start">
          <span className="inline-block mr-5 flex items-center justify start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
            Project ID : {project.id}
          </span>
          <span className="inline-block mr-5 flex items-center justify start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
            PIC : {project.pic}
          </span>
          <span className="inline-block mr-5 flex items-center justify start gap-2">
              {project.status === 'DEV' ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
            </svg>
              ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )}
            Status : {project.status}
          </span>
        </div>
        <p>Notes :</p>
        <div className="w-full mx-auto bg-white border p-4 rounded-md shadow-md">
          <p className="text-black text-base text-xl">
            {project.notes}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Project;
