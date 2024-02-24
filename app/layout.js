import "@/styles/globals.css";
import Provider from "@/components/Provider";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
export const metadata = {
  title: "Dashboard Project KIS",
  description: "Dashboard for managing KIS projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="main">
            <div className="gradient"/>
          </div>
          <main className="app">
          <Navbar/>
          {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
