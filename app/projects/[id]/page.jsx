"use client";
import Loading from "@/components/Loading";
import {
  useSearchParams,
  usePathname,
  redirect,
  useRouter,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CommentSection from "@/components/CommentSection";
const Project = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [project, setProject] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (status === "loading") return; // Don't do anything while session is loading

    if (!session) {
      // Redirect to login page if not authenticated.
      console.log(session, status);
      router.push("/login"); // Ensure router is used within useEffect
    }
    const split = pathname.split("/");
    const id = split[2];
    console.log(id);
    const fetchProject = async () => {
      try {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL+`/api/projects/${id}`);
        if (!result.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await result.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProject();
  }, [session, status, router]);

  if (loadingProjects) {
    return <Loading />; // You can replace this with a loading spinner or any other loading indicator
  }
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleSubmitModal = async (formData) => {
    const objectForm = {
      ...formData,
      id: project.id,
      developer: project.developer,
      support: project.support,
      status: project.status,
    };
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL+`/api/projects/${project.id}`, {
      method: "PUT",
      body: JSON.stringify(objectForm),
    });
    alert("Updating Project");
    const { statusResponse, message, id } = await response.json();
    alert(message);
    if (response.ok) {
      setProject(objectForm);
      setIsModalOpen(false);
      return true;
    } else {
      return false;
    }
  };
  const handleVersionChange=(version,status)=>{
    setProject((previous) => ({
      ...previous,
      ["version"]: version,
      ["status"]:status
    }));
  }
  return (
    <>
      <section className="p-4 sm:ml-64 flex flex-col px-10 gap-10">
        <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
          {project.project_name}
          <span className="capitalize"> KIS</span>
        </h1>
        <div className="grid gap-5 text-lg">
        <p>Details Project on this version:</p>
          <div className="w-full flex gap-2 items-center justify-start">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <tbody>
                <tr className="odd:bg-white even:bg-gray-50 hover:cursor-pointer ">
                  <td>Version</td>
                  <td>{project.version}</td>
                </tr>
                <tr className="odd:bg-white even:bg-gray-50 hover:cursor-pointer ">
                  <td>Status</td>
                  <td>{project.status}</td>
                </tr>
                <tr className="odd:bg-white even:bg-gray-50 hover:cursor-pointer ">
                  <td>Developer</td>
                  <td>{project.developer}</td>
                </tr>
                <tr className="odd:bg-white even:bg-gray-50 hover:cursor-pointer ">
                  <td>Support</td>
                  <td>{project.support}</td>
                </tr>
                <tr className="odd:bg-white even:bg-gray-50 hover:cursor-pointer ">
                  <td>Notes</td>
                  <td style={{ whiteSpace: "pre-line" }}>{project.notes}</td>
                </tr>
              </tbody>
            </table>
            {/* <button
              class="flex p-2.5 text-yellow-500 rounded-xl hover:rounded-3xl "
              onClick={handleModalOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button> */}
            {/* {isModalOpen ? (
              <UpdateProjectModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                handleSubmit={handleSubmitModal}
                project={project}
              />
            ) : null} */}
          </div>
        </div>
      </section>
      <CommentSection project={project} handleVersionChange={handleVersionChange} />
    </>
  );
};

export default Project;
