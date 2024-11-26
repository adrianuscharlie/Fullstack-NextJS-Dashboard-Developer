"use client"
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminPage from "@/components/AdminPage";
import DashboardPage from "@/components/DashboardPage";

const Home = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (status === "loading") return; // Don't do anything while session is loading

    if (!session) {
      router.push("/login");
    }
    const fetchSession = async () => {
      if (!session) {
        router.push("/login");
        return;
      }

      const user = session.user;
      const url =
        user.role.includes("manager") || user.role.includes("ba_dev")
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/user/${user.namaLengkap}`;

      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
            'Content-Type': 'application/json', // Optional: set content type if needed
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setProjects([]); // Handle the error case
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [session,router]);

  if (loading) {
    return <Loading />;
  }

  if (!session) {
    router.push("/login");
  }

  return (
    <>
      {session.user.role.includes("manager") || session.user.role.includes("ba_dev") ? (
        <AdminPage user={session.user} projects={projects} />
      ) : (
        <DashboardPage user={session.user} projects={projects} />
      )}
    </>
  );
};

export default Home;
