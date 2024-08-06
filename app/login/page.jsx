"use client"
import React from "react";
import { useState,useEffect } from "react";
import { signIn ,signOut} from "next-auth/react";
import { redirect,useRouter } from "next/navigation";
import Logo from "@/public/logokis.jpg"
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";

const Login = () => {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router=useRouter();

  useEffect(()=>{
    if (session) {
      router.push("/");
      return;
    }
  },[session])
  const handleLogin=async(event)=>{
    event.preventDefault();
    setLoading(true);
    const result=await signIn('credentials',{
        redirect:false,
        username,
        password
    })
    setLoading(false);
    if(result.ok){
      router.push('/')
    }else{
      alert("Login failed");
    }
}


if(loading){
  return <Loading />
}

  return (
    <section className="flex bg-slate-100 login flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <Image width={100} src={Logo} alt="Logo KIS"/>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Login Dashboard Project KIS
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your username
              </label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="username"
                name="username"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="adrianuscharlie"
                required=""
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <div className="mt-1 px-2 text-black hover:text-sky-500 font-semibold"><Link href="/forgotPassword">Forgot Password?</Link></div>
            <button
              type="submit"
              className="w-full butt bg-sky-500   font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
