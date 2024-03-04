import "@/styles/globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Dashboard Project KIS",
  description: "Dashboard for managing KIS projects",
};

export default async function RootLayout({ children }) {
  const session=await getServerSession();
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
        <div className="main">
            <div className="gradient"/>
          </div>
          <main className="app">
          <Navbar/>
          {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
