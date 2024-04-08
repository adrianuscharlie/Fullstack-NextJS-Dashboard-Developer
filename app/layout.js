import "@/styles/globals.css";
import Provider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/SideBar";
export const metadata = {
  title: "Dashboard Project KIS",
  description: "Dashboard for managing KIS projects",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {/* <div className="main">
            <div className="gradient"/>
          </div>
          <main className="app">
          <Navbar/>
          {children}
          </main> */}
          <Sidebar />
          <div>{children}</div>
        </Provider>
      </body>
    </html>
  );
}