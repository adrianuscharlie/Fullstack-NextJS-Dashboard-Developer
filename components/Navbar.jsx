"use client"
import Link from 'next/link'
import React, { useEffect,useState } from 'react'
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from 'next/navigation';
const Navbar = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  useEffect(()=>{
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  },[])
  const router = useRouter();
  const  handleSignOut= async()=>{
     await signOut({redirect:false});
     router.push('/')
  }
  if(!session){
    return <></>
  }
  return (
    <nav className='flex justify-between w-full pt-3 px-5'>
        <Link href={"/"} className='flex gap-2 flex-center'>
            <p className='font-bold text-green-800'>Dashboard KIS</p>
        </Link>
        <div className='flex p-3'>
            <div className='flex gap-3 md:gap-5'>
                <Link href={"/"}>Home</Link>
                <Link href={"/projects"}>Projects</Link>
                <button onClick={handleSignOut}>Logout</button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar