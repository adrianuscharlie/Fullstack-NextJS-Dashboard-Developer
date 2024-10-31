"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../public/logokis.jpg";
import {Home,FolderKanban,NotebookPen,MailPlus,Settings, LogOut} from 'lucide-react'
const Sidebar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [dropdown, setDropDown] = useState(false);
  useEffect(() => {
    if (status === "loading") return;
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  }, []);
  const handleSignOut =  () => {
    signOut({redirect:false});
    router.push("/login");
  };

  return session? (
    <>
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        onClick={() => setDropDown(!dropdown)}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      {dropdown && (
        <div className=" sm:hidden absolute flex flex-col gap-3 mx-3 w-1/3 rounded-md bg-slate-100 px-5 py-2.5 text-md font-semibold text-sky-500">
          <Link href={"/"} className="">
            Home
          </Link>
          <Link href={"/projects"} className="">
            Projects
          </Link>
          <Link href={"/ba"} className="">
            Create BA
          </Link>
          <Link href={"/email"} className="">
            Send Email
          </Link>
          <Link href={"/configuration"} className="">
            Configuration
          </Link>
          <button onClick={handleSignOut} className="text-start">
            Logout
          </button>
        </div>
      )}
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col justify-between px-3 py-4 overflow-y-auto bg-gray-800 text-white ">
          <div className="px-3 py-4 overflow-y-auto">
            <ul className="space-y-5 text-lg font-semibold ml-5 h-full justify-co">
              <li>
                <Link href={"/"} className="hover:text-sky-500">
                  <Image alt="logo" src={Logo} style={{ width: "100px" }} />
                </Link>
              </li>
              <li>
                <Link
                  className="text-white hover:text-sky-500 flex gap-3 justify-start items-center"
                  href={"/"}
                >
                  <Home/>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-sky-500 flex justify-start items-center gap-3"
                  href={"/projects"}
                >
                  <FolderKanban/>
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-sky-500 flex justify-start items-center gap-3"
                  href={"/ba"}
                >
                  <NotebookPen />
                  Create BA
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-sky-500 text-white flex justify-start items-center gap-3"
                  href={"/email"}
                >
                  <MailPlus/>
                  Send Email
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-sky-500 text-white flex justify-start items-center gap-3"
                  href={"/configuration"}
                >
                  <Settings/>
                  Configuration
                </Link>
              </li>
            </ul>
          </div>
          <button
            className="px-3 text-white hover:text-sky-500 py-4 flex gap-5 items-center justify-start"
            onClick={handleSignOut}
          >
            <LogOut/>
            <p className="text-lg font-semibold ">Logout</p>
          </button>
        </div>
      </aside>
    </>
  ):<></>;
};

export default Sidebar;
