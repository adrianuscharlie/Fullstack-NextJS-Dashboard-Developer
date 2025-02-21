"use client";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import InputProject from "@/components/InputProject";
import UpdateProject from "@/components/UpdateProject";
import DeleteProject from "@/components/DeleteProject";
import ProjectsTable from "@/components/Projects";
import ReleaseBADev from "@/components/ReleaseBADev";
import ReleaseBAUAT from "@/components/ReleaseBAUAT";
import ReleaseBaRelease from "@/components/ReleaseBARelease";
import axios from "axios";
const CreateBA = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const options = [
    "Release BA Development",
    "Release BA UAT",
    "Release BA Release",
  ];
  const [option, setOption] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    step: 1,
    option: "",
    inputField: "",
    updateField: "",
  });
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    setUser(session.user);
    if (session.user.role === "developer") {
      const option = options.filter(
        (item) => item !== "Release BA UAT" && item !== "Release BA Release"
      );
      setOption(option);
    } else if (session.user.role === "support") {
      const option = options.filter(
        (item) => item !== "Release BA Development"
      );
      setOption(option);
    } else {
      setOption(options);
    }
    const fetchUserData = async () => {
      const url = session.user.role.includes("manager")
        ? process.env.NEXT_PUBLIC_BASE_URL + "/api/projects"
        : process.env.NEXT_PUBLIC_BASE_URL +
          `/api/projects/user/${session.user.namaLengkap}`;
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
            "Content-Type": "application/json", // Optional: set content type if needed
          },
        })
        .then((response) => {
          setProjects(response.data);
        })
        .catch((error) => {
          console.log("Failed to fetch data", error);
          setProjects([]);
        });
      setLoading(false);
    };
    const fetchUsers = async () => {
      await axios
        .get(process.env.NEXT_PUBLIC_BASE_URL + "/api/user", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // Include the Bearer token in Authorization header
            "Content-Type": "application/json", // Optional: set content type if needed
          },
        })
        .then((response) => setUsers(response.data))
        .catch((error) => console.log("error fetching users ", error));
    };

    fetchUserData();
    fetchUsers();
  }, [session]);
  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      option: selectedOption,
    }));
  };
  if (loading) {
    return <Loading />;
  }
  const isAdmin = user.username === "admin";
  return (
    <section className="p-4 sm:ml-64 flex flex-col px-10 gap-10">
      <h1 className="text-start text-4xl font-semibold mt-14 text-sky-500">
        Create Document Berita Acara
        <span className="text-center capitalize"> KIS</span>
      </h1>
      <p className="text-start">
        {
          "Create BA Development, BA UAT and BA Release by select item in combobox"
        }
      </p>
      <div className="grid grid-cols-[1fr,3fr] gap-4 text-lg rounded-md">
        {/* Replace the following divs with your actual content */}
        <div className="p-4">
          <label htmlFor="dropdown">Select an option:</label>
        </div>
        <div className="p-4">
          <select
            id="dropdown"
            onChange={handleSelectChange}
            value={selectedOption || ""}
            className="text-base p-2 bg-gray-100"
          >
            <option value="" disabled>
              Select an action
            </option>
            {option.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      {formData.option === "Input" && <InputProject users={users} />}
      {formData.option === "Update" && (
        <UpdateProject users={users} projects={projects} />
      )}
      {formData.option === "Delete" && <DeleteProject projects={projects} />}
      {formData.option === "View Project" && (
        <>
          {projects ? (
            <ProjectsTable data={projects} />
          ) : (
            <h1>There is no project for you</h1>
          )}
        </>
      )}
      {formData.option === "Release BA Development" && (
        <ReleaseBADev projects={projects} users={users} />
      )}
      {formData.option === "Release BA UAT" && (
        <ReleaseBAUAT projects={projects} users={users} />
      )}
      {formData.option === "Release BA Release" && (
        <ReleaseBaRelease projects={projects} />
      )}
    </section>
  );
};

export default CreateBA;
