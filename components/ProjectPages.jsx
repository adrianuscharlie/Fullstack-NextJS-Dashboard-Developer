import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import axios from "axios";
import ProjectsPage from "@/components/ProjectsWrapper";

export default async function Projects() {
  const session = await getServerSession(authOptions);

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    
    const projects = response.data;
    const groupedProjects = groupProjectsByProjectName(projects);
    const catalog = Object.values(groupedProjects).map((value) => value[0]);
    const filterOptions = getFilterOptions(catalog);

    return (
      <ProjectsPage 
        session={session} 
        projects={groupedProjects} 
        projectCatalog={catalog} 
        filterOptions={filterOptions} 
      />
    );
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    return <p>Error loading projects</p>;
  }
}

// Helper Functions
const groupProjectsByProjectName = (projects) => {
  return projects.reduce((acc, project) => {
    const { project_name } = project;
    if (!acc[project_name]) acc[project_name] = [];
    acc[project_name].push(project);
    return acc;
  }, {});
};

const getFilterOptions = (projects) => {
  const uniqueValues = projects.reduce((acc, obj) => {
    Object.keys(obj).forEach((key) => {
      if (!acc[key]) acc[key] = new Set();
      acc[key].add(obj[key]);
    });
    return acc;
  }, {});

  return Object.fromEntries(Object.entries(uniqueValues).map(([key, valueSet]) => [key, [...valueSet]]));
};
