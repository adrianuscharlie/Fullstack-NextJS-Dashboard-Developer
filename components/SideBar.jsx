"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Logo from "../public/logokis.jpg";
import {
  Home,
  FolderKanban,
  NotebookPen,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session,status } = useSession();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (!session) return null;
  if(status==="loading") return null;

  return (
    <aside className="top-0 left-0 z-40" >
      {/* Sidebar */}
      <div
        className={`h-full bg-gray-800 text-white transition-all duration-300 ${
          isExpanded ? "w-48" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 text-white  hover:bg-gray-700 w-full flex justify-start"
        >
          <div
            className={`flex items-center space-x-2 ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
          >
            <Image alt="logo" src={Logo} width={isExpanded ? 100 : 40} />
          </div>
        </button>

        {/* Sidebar Content */}
        <div className="px-4 py-4 flex flex-col">
          {/* Logo */}

          {/* Navigation Links */}
          <ul className="mt-5 space-y-4">
            <li>
              <Link
                href="/"
                className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md"
              >
                <Home />
                {isExpanded && <span>Home</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md"
              >
                <FolderKanban />
                {isExpanded && <span>Projects</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/ba"
                className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md"
              >
                <NotebookPen />
                {isExpanded && <span>Create BA</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/configuration"
                className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md"
              >
                <Settings />
                {isExpanded && <span>Configuration</span>}
              </Link>
            </li>
          </ul>
          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md w-full"
          >
            <LogOut />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
