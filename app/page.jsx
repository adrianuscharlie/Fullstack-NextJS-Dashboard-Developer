import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminPage from "@/components/AdminPage";
import DashboardPage from "@/components/DashboardPage";
import { getAllProject, getAllUser, getProjectByName } from "@/lib/api";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Dashboard - BA Klik Indomaret Sukses",
  description: "Dashboard for managing KIS projects",
};

async function fetchProjects(session) {
  if (!session || !session.user) {
    throw new Error("User session is missing or invalid");
  }

  const isAdmin = session.user.role.includes("manager") || session.user.role.includes("ba_dev");
  return isAdmin
    ? getAllProject()
    : getProjectByName(session.user.namaLengkap || "Unknown User");
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let projects = [];
  let users=[];
  try {
    projects = await fetchProjects(session);
    users=await getAllUser();
  } catch (error) {
    console.error("Error fetching projects:", error.message);
  }

  return (
    <Suspense fallback={<Loading />}>
      {session.user.role.includes("manager") ||
      session.user.role.includes("ba_dev") ? (
        <AdminPage session={session} projects={projects} users={users} />
      ) : (
        <DashboardPage user={session.user} projects={projects} />
      )}
    </Suspense>
  );
}
