import { getServerSession } from 'next-auth'
import React, { Suspense } from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getAllProject, getAllUser,getProjectByName } from '@/lib/api';
import { redirect } from 'next/navigation';
import BAWrapper from '@/components/BAWrapper';
import Loading from '@/components/Loading';

export const metadata = {
  title: "Create BA - BA Klik Indomaret Sukses",
  description: "Create BA documentation",
};
async function fetchProjects(session) {
  if (!session || !session.user) {
    throw new Error("User session is missing or invalid");
  }

  const userRoles = Array.isArray(session.user.role) ? session.user.role : [];
  const isAdmin = userRoles.includes("manager") || userRoles.includes("ba_dev");

  return isAdmin
    ? getAllProject()
    : getProjectByName(session.user.namaLengkap || "Unknown User");
}

const page = async () => {
  const session=await getServerSession(authOptions);
  if(!session){
    redirect("/login");
  }
  const projects=await fetchProjects(session)
  const users=await getAllUser();
  const role=session.user.role;
  return (
    <Suspense fallback={<Loading />}>
      <BAWrapper projects={projects} users={users} role={role}/>
    </Suspense>
  )
}

export default page