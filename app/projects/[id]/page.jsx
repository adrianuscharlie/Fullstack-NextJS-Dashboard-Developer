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
import UpdateProjectModal from "@/components/UpdateProjectModal";
import { Pencil } from "lucide-react";
const Project = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [project, setProject] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (status === "loading") return; // Don't do anything while session is loading
    setLoading(false);
    if (!session) {
      // Redirect to login page if not authenticated.
      router.push("/login");
    }
    const split = pathname.split("/");
    const id = split[2];
    const fetchProject = async () => {
      try {
        const result = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + `/api/projects/${id}`
        );
        if (!result.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await result.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
        setProject(null)
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProject();
  }, [session]);

  if (loadingProjects) {
    return <Loading />; // You can replace this with a loading spinner or any other loading indicator
  }
  const handleStatus = (status) => {
    setProject((previous) => ({
      ...previous,
      ["status"]: status,
    }));
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmitModal=(formData)=>{
    setProject(formData);
  }
  const handleSetLoading=(value)=>{
    setLoading(value)
  }
  if(loading){
    return <Loading />
  }
  return project? (
    <>
      <section className="p-4 sm:ml-64 flex flex-col px-10 gap-10">
        <div className="flex items-center justify-start mt-14 gap-3">
          <h1 className="text-start text-4xl font-semibold  text-sky-500">
            {project.project_name}
          </h1>
          <button
            class="flex p-2.5 text-yellow-500 rounded-xl hover:rounded-3xl "
            onClick={handleModalOpen}
          >
            <Pencil/>
          </button>
        </div>
        <div className="grid gap-5 text-lg">
          <p>Details Project on this version:</p>
          <div className="w-full flex gap-2 items-center justify-start">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <tbody>
                <tr className="odd:bg-white even:bg-gray-50">
                  <td>Version</td>
                  <td>{project.version}</td>
                </tr>
                <tr className="odd:bg-white even:bg-gray-50">
                  <td>Status</td>
                  <td>{project.status}</td>
                </tr>
                <tr className="odd:bg-white even:bg-gray-50">
                  <td>Developer</td>
                  <td>{project.developer}</td>
                </tr>
                <tr className="odd:bg-white even:bg-gray-50 ">
                  <td>Support</td>
                  <td>{project.support}</td>
                </tr>
                <tr className="odd:bg-white even:bg-gray-50 ">
                  <td>Notes</td>
                  <td style={{ whiteSpace: "pre-line" }}>{project.notes}</td>
                </tr>
              </tbody>
            </table>

            {isModalOpen ? (
              <UpdateProjectModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                handleSubmit={handleSubmitModal}
                project={project}
              />
            ) : null}
          </div>
        </div>
      </section>
      <CommentSection project={project} handleStatus={handleStatus} handleSetLoading={handleSetLoading} />
    </>
  ):<>
    <section className="p-4 sm:ml-64 h-screen flex justify-center items-center">
      <h1 className="font-bold text-xl ">404 Project not Found</h1>
    </section>
  </>;
};

export default Project;
