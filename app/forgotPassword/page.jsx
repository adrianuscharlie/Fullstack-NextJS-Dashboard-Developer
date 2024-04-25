"use client"
import React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect,useRouter } from "next/navigation";
import Logo from "@/public/logokis.jpg"
import Image from "next/image";
const ForgotPassword = () => {
    const router = useRouter();
    const [email,setEmail]=useState("");
    const handleSubmit=async(event)=>{
        event.preventDefault();
        const response=await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/user/${email}/forgotPassword`)
        const message=await response.text();
        alert(message);
        if(response.ok){
            router.push('/login');
        }
    }
  return (
    <section className="flex bg-slate-100 login flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <Image width={100} src={Logo} alt="Logo KIS"/>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Forgot Password Project KIS
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                value={email}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="adrianus.charlie@idmsukses.co.id"
                required
              />
            </div> 
            <button
              type="submit"
              className="w-full butt bg-sky-500   font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword