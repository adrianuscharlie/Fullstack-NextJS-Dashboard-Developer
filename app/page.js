"use client";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminPage from "@/components/AdminPage";
import DashboardPage from "@/components/DashboardPage";
import axios from "axios";

const Home = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      const user = session.user;
      const url =
        user.role.includes("manager") || user.role.includes("ba_dev")
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/user/${user.namaLengkap}`;

      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setProjects(response.data);
          setLoading(false);
        })
        .catch((error) =>
          console.log("Error fetching user data:" + error.message)
        );
    };

    fetchProjects();
  }, [session?.user?.role, status]);

  if (status === "loading" || loading) {
    return <Loading />;
  }

  if (!session || !session.user) {
    router.push("/login");
    return null;
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
