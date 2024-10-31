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
    console.log(session)
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session.user);

    const fetchUserData = async () => {
      try {
        const url = session.user.role.includes ("manager") || session.user.role.includes("ba_dev")
          ? process.env.NEXT_PUBLIC_BASE_URL+"/api/projects"
          : process.env.NEXT_PUBLIC_BASE_URL+`/api/projects/user/${session.user.namaLengkap}`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setProjects(data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setProjects([])
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  if (loading) {
    return <Loading />;
  }

  
  const isAdmin = user.role.includes("manager")|| user.role.includes("ba_dev") ;
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
