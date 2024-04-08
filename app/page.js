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
  const [projects, setProjects] = useState([]);
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
        const url = session.user.username === "admin"
          ? "/api/projects"
          : `/api/projects/user/${session.user.namaLengkap}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setProjects([])
      } finally {
        console.log(user)
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, router]);

  if (loading) {
    return <Loading />;
  }

  

  const isAdmin = user.username === "admin";

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
