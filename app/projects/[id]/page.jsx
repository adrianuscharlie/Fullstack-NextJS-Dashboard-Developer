"use client";
import Loading from "@/components/Loading";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CommentSection from "@/components/CommentSection";
import UpdateProjectModal from "@/components/UpdateProjectModal";
import { Pencil } from "lucide-react";
import axios from "axios";
const Project = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    refetchOnWindowFocus: false,
  });
  const pathname = usePathname();
  const [project, setProject] = useState({});
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (status === "loading") return; 

    if (!session) {
      router.push("/login");
      return;
    }
    const split = pathname.split("/");
    const id = split[2];
    const fetchProject = async () => {
      await axios
        .get(process.env.NEXT_PUBLIC_BASE_URL + `/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
            "Content-Type": "application/json", // Optional: set content type if needed
          },
        })
        .then((response) => setProject(response.data))
        .catch((error) =>
          console.log("Error fetching projects:", error.message)
        );
      setLoadingProjects(false);
    };
    fetchProject();
  }, [session?.user?.role, status]);



  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmitModal = (formData) => {
    setProject(formData);
  };
  const handleSetLoading = (value) => {
    setLoading(value);
  };

  if (loadingProjects) {
    return <Loading />;
  }

  if (!session || !session.user) {
    router.push("/login");
    return null;
  }

  return project ? (
    <>
      <section className="p-4 sm:ml-64 flex flex-col px-10 gap-10">
        <div className="flex items-center justify-start mt-14 gap-3">
          <h1 className="text-start text-4xl font-semibold  text-sky-500">
            {project.project_name}
          </h1>
          <button
            className="flex p-2.5 text-yellow-500 rounded-xl hover:rounded-3xl "
            onClick={handleModalOpen}
          >
            <Pencil />
          </button>
        </div>
        <div className="grid gap-5 text-lg">
          <p>Details Project on this version:</p>
          <div className="w-full flex gap-2 items-center justify-start">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <tbody>
                <tr className="odd:bg-white even:bg-gray-50">
                  <td>Project Type</td>
                  <td>{project.type}</td>
                </tr>
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
      <CommentSection
        project={project}
        handleSetLoading={handleSetLoading}
      />
    </>
  ) : (
    <>
      <section className="p-4 sm:ml-64 h-screen flex justify-center items-center">
        <h1 className="font-bold text-xl ">404 Project not Found</h1>
      </section>
    </>
  );
};

export default Project;
