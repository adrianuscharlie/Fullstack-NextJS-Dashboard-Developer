"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../public/logokis.jpg";
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
                  <svg
                    className="w-5 h-5 text-white hover:text-sky-500 transition duration-75 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-sky-500 flex justify-start items-center gap-3"
                  href={"/projects"}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 transition duration-75 text-white hover:text-sky-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                  </svg>{" "}
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-sky-500 flex justify-start items-center gap-3"
                  href={"/ba"}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-white hover:text-sky-500 transition duration-75 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                  </svg>{" "}
                  Create BA
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-sky-500 text-white flex justify-start items-center gap-3"
                  href={"/email"}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-white hover:text-sky-500  transition duration-75 "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 128 96"
                    id="email"
                    fill="currentColor"
                  >
                    <g>
                      <path d="M0 11.283V8a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8v3.283l-64 40zm66.12 48.11a4.004 4.004 0 0 1-4.24 0L0 20.717V88a8 8 0 0 0 8 8h112a8 8 0 0 0 8-8V20.717z"></path>
                    </g>
                  </svg>
                  Send Email
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-sky-500 text-white flex justify-start items-center gap-3"
                  href={"/configuration"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                    id="configuration"
                    className="flex-shrink-0 w-5 h-5 text-white hover:text-sky-500  transition duration-75 "
                    fill="currentColor"
                  >
                    <g
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-miterlimit="10"
                      stroke-width="2"
                    >
                      <path d="M39.941 42.473a3.52 3.52 0 01-4.5-2.146 3.509 3.509 0 012.146-4.49 3.509 3.509 0 014.49 2.146 3.511 3.511 0 01-2.136 4.49zM23.443 18.003c0 2.79-2.265 5.064-5.064 5.064s-5.064-2.274-5.064-5.064c0-2.799 2.265-5.064 5.064-5.064s5.064 2.265 5.064 5.064z"></path>
                      <path d="M30.792 28.2l-1.701-4.173c.485-.84.86-1.76 1.127-2.73l4.145-1.74V16.43l-4.145-1.741a12.03 12.03 0 00-1.127-2.73l1.701-4.154-2.215-2.216-4.174 1.702c-.841-.485-1.751-.86-2.71-1.128L19.942 2.02 16.826 2l-1.76 4.164c-.95.267-1.87.653-2.71 1.128L8.182 5.59 5.966 7.806l1.701 4.154c-.484.86-.86 1.76-1.127 2.73l-4.144 1.74v3.126l4.144 1.741c.267.97.643 1.89 1.127 2.73l-1.7 4.174 2.215 2.195 4.154-1.7c.84.484 1.76.88 2.73 1.137l1.75 4.154h3.116l1.74-4.154c.97-.257 1.9-.653 2.74-1.138l4.165 1.701 2.215-2.195zM18.38 23.068a5.067 5.067 0 01-5.064-5.064c0-2.799 2.265-5.064 5.064-5.064s5.064 2.265 5.064 5.064a5.067 5.067 0 01-5.064 5.064zM47.29 38.576l2.314-2.107-.722-2.037-3.125-.188a8.518 8.518 0 00-1.385-1.533l.148-3.116-1.948-.95-2.344 2.088a7.847 7.847 0 00-2.047-.1l-2.107-2.314-2.048.722-.178 3.126a8.411 8.411 0 00-1.533 1.365l-3.125-.149-.93 1.969 2.077 2.344a7.75 7.75 0 00-.099 2.037l-2.314 2.107.712 2.047 3.135.188c.396.554.86 1.069 1.365 1.514l-.148 3.135 1.968.94 2.334-2.087a8.326 8.326 0 002.048.109L41.444 50l2.048-.722.178-3.125a7.791 7.791 0 001.523-1.375l3.135.148.93-1.958-2.077-2.335a8.351 8.351 0 00.109-2.057zm-7.349 3.897a3.52 3.52 0 01-4.5-2.146 3.509 3.509 0 012.146-4.49 3.509 3.509 0 014.49 2.146 3.511 3.511 0 01-2.136 4.49z"></path>
                      <path d="M39.941 42.473a3.52 3.52 0 0 1-4.5-2.146 3.509 3.509 0 0 1 2.146-4.49 3.509 3.509 0 0 1 4.49 2.146 3.511 3.511 0 0 1-2.136 4.49z"></path>
                    </g>
                    <g
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-miterlimit="10"
                      stroke-width="2"
                    >
                      <path d="M39.941 42.473a3.52 3.52 0 01-4.5-2.146 3.509 3.509 0 012.146-4.49 3.509 3.509 0 014.49 2.146 3.511 3.511 0 01-2.136 4.49zM23.443 18.003c0 2.79-2.265 5.064-5.064 5.064s-5.064-2.274-5.064-5.064c0-2.799 2.265-5.064 5.064-5.064s5.064 2.265 5.064 5.064z"></path>
                      <path d="M30.792 28.2l-1.701-4.173c.485-.84.86-1.76 1.127-2.73l4.145-1.74V16.43l-4.145-1.741a12.03 12.03 0 00-1.127-2.73l1.701-4.154-2.215-2.216-4.174 1.702c-.841-.485-1.751-.86-2.71-1.128L19.942 2.02 16.826 2l-1.76 4.164c-.95.267-1.87.653-2.71 1.128L8.182 5.59 5.966 7.806l1.701 4.154c-.484.86-.86 1.76-1.127 2.73l-4.144 1.74v3.126l4.144 1.741c.267.97.643 1.89 1.127 2.73l-1.7 4.174 2.215 2.195 4.154-1.7c.84.484 1.76.88 2.73 1.137l1.75 4.154h3.116l1.74-4.154c.97-.257 1.9-.653 2.74-1.138l4.165 1.701 2.215-2.195zM18.38 23.068a5.067 5.067 0 01-5.064-5.064c0-2.799 2.265-5.064 5.064-5.064s5.064 2.265 5.064 5.064a5.067 5.067 0 01-5.064 5.064zM47.29 38.576l2.314-2.107-.722-2.037-3.125-.188a8.518 8.518 0 00-1.385-1.533l.148-3.116-1.948-.95-2.344 2.088a7.847 7.847 0 00-2.047-.1l-2.107-2.314-2.048.722-.178 3.126a8.411 8.411 0 00-1.533 1.365l-3.125-.149-.93 1.969 2.077 2.344a7.75 7.75 0 00-.099 2.037l-2.314 2.107.712 2.047 3.135.188c.396.554.86 1.069 1.365 1.514l-.148 3.135 1.968.94 2.334-2.087a8.326 8.326 0 002.048.109L41.444 50l2.048-.722.178-3.125a7.791 7.791 0 001.523-1.375l3.135.148.93-1.958-2.077-2.335a8.351 8.351 0 00.109-2.057zm-7.349 3.897a3.52 3.52 0 01-4.5-2.146 3.509 3.509 0 012.146-4.49 3.509 3.509 0 014.49 2.146 3.511 3.511 0 01-2.136 4.49z"></path>
                      <path d="M39.941 42.473a3.52 3.52 0 0 1-4.5-2.146 3.509 3.509 0 0 1 2.146-4.49 3.509 3.509 0 0 1 4.49 2.146 3.511 3.511 0 0 1-2.136 4.49z"></path>
                    </g>
                  </svg>
                  Configuration
                </Link>
              </li>
            </ul>
          </div>
          <button
            className="px-3 text-white hover:text-sky-500 py-4 flex gap-5 items-center justify-start"
            onClick={handleSignOut}
          >
            <svg
              className="flex-shrink-0 w-5 h-5 text-white hover:text-sky-500  transition duration-75 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
              />
            </svg>
            <p className="text-lg font-semibold ">Logout</p>
          </button>
        </div>
      </aside>
    </>
  ):<></>;
};

export default Sidebar;
