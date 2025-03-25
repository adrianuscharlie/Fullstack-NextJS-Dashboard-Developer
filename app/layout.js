import "@/styles/globals.css";
import Provider from "@/components/SessionProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/components/SideBar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export const metadata = {
  title: "BA Klik Indomaret Sukses",
  description: "Dashboard for managing KIS projects",
};
export default async function RootLayout({ children }) {
  const session = getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return (
    <html lang="en">
      <body>
        <Provider>
          <main className="flex w-full justify-start min-h-screen ">
            <Sidebar />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
