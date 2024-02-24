"use client";
import Loading from "@/components/Loading";
import ProjectsTable from "@/components/Projects";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession ,signIn} from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    isActive: true,
  });
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [projects, setProjects] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `/api/users/${session.session.user.email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
        const responseProject = await fetch(
          `/api/projects/user/${data.username}`
        );
        if(responseProject.ok){
          const dataProject = await responseProject.json();
          setProjects(dataProject);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoadingProjects(false);
        setLoadingUser(false);
      }
    };
    if(session){
      fetchUserData();
      setLoadingProjects(true);
      setLoadingUser(true);
    }
  }, [session]);
  const handleLogin=async(event)=>{
    event.preventDefault();
    const result=await signIn('credentials',{
        redirect:false,
        email,
        password
    });
}
  if (loadingUser || loadingProjects) {
    return <Loading />; // You can replace this with a loading spinner or any other loading indicator
  }

  return (
    <section className="w-full flex-center flex-col py-10">
      {session ? (
        <>
          <h1 className="text-center text-4xl font-semibold">
            Welcome to KIS Project Dashboard,
            <span className="orange_gradient text-center capitalize">
              {" "}
              {user.username}
            </span>
          </h1>
          <p className="desc text-center">
            {
              "Dashboard for managing and Monitoring all KIS group Projects. Below, is the list of projects that are already created and managed by you"
            }
          </p>
          <>
            {projects?(
              <ProjectsTable data={projects} />
            ):(
              <h1>There is no project for you</h1>
            )}
          </>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <h1 className="orange_gradient text-4xl font-bold mb-10">
          Dashboard KIS
        </h1>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                    onChange={(e)=>setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                onChange={(e)=>setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              <button
                type="submit"
                className="w-full orange_gradient bg-slate-900   font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}
