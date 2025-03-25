import { getServerSession } from 'next-auth'
import React, { Suspense } from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getAllProject, getAllUser } from '@/lib/api';
import ProjectsWrapper from '@/components/ProjectsWrapper';
import Loading from '@/components/Loading';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "All Projects - BA Klik Indomaret Sukses",
  description: "Dashboard for managing KIS projects",
};

const page = async() => {
  const session=await getServerSession(authOptions);
  if (!session) {
      redirect("/login");
    }
    let projects = [];
    let users=[]
    try {
      projects = await getAllProject();
      users=await getAllUser();
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  return (
    <Suspense fallback={<Loading/>}>
      <ProjectsWrapper projectsParams={projects} users={users}/>
    </Suspense>
  )
}

export default page