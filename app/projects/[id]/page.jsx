"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Loading from "@/components/Loading";
import CommentSection from "@/components/CommentSection";
import UpdateProjectModal from "@/components/UpdateProjectModal";
import { Pencil } from "lucide-react";

const Project = () => {
  const router = useRouter();
  const { data: session, status } = useSession({ refetchOnWindowFocus: false });
  const pathname = usePathname();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const id = pathname.split("/")[2];
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [session, status]);

  if (loading) {
    return (
      <section className="flex justify-center items-center h-screen">
        <Loading />
      </section>
    );
  }

  if (!project) {
    return (
      <section className="flex justify-center items-center h-screen">
        <h1 className="font-bold text-xl">404 Project Not Found</h1>
      </section>
    );
  }

  return (
    <section className="p-4 flex flex-col px-10 gap-10">
      <div className="flex items-center justify-start mt-14 gap-3">
        <h1 className="text-4xl font-semibold text-sky-500">
          {project.project_name}
        </h1>
        <button
          className="p-2.5 text-yellow-500 rounded-xl hover:rounded-3xl"
          onClick={() => setIsModalOpen(true)}
        >
          <Pencil />
        </button>
      </div>

      <div className="grid gap-5 text-lg">
        <p>Details about this version:</p>
        <table className="w-full text-sm text-left text-gray-500">
          <tbody>
            {[
              { label: "Project Type", value: project.type },
              { label: "Version", value: project.version },
              { label: "Status", value: project.status },
              { label: "Developer", value: project.developer },
              { label: "Support", value: project.support },
              { label: "Notes", value: project.notes },
            ].map((row, index) => (
              <tr key={row.label} className={index % 2 ? "bg-gray-50" : "bg-white"}>
                <td className="font-medium text-gray-700">{row.label}</td>
                <td className="whitespace-pre-line">{row.value || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <UpdateProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          handleSubmit={(formData) => setProject(formData)}
          project={project}
        />
      )}

      <CommentSection project={project} handleSetLoading={setLoading} />
    </section>
  );
};

export default Project;
