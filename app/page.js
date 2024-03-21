"use client"
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminPage from "@/components/AdminPage";
import DashboardPage from "@/components/DashboardPage";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    setUser(session.user);

    const fetchUserData = async () => {
      try {
        const url = session.user.role === "Admin"
          ? "/api/projects"
          : `/api/projects/user/${session.user.username}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        // Handle error gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user || !projects) {
    // Handle the case when user or projects are not yet loaded
    return <Loading />;
  }

  const isAdmin = user.role === "Admin";

  return (
    <>
      {isAdmin ? (
        <AdminPage user={user} projects={projects} />
      ) : (
        <DashboardPage user={user} projects={projects} />
      )}
    </>
  );
}
