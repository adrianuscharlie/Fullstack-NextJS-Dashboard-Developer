import React, { Suspense } from "react";
import Loading from "@/components/Loading";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ConfigurationWrapper from "@/components/ConfigurationWrapper";
const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <Suspense fallback={<Loading />}>
      <ConfigurationWrapper user={session.user} />
    </Suspense>
  );
};

export default page;
