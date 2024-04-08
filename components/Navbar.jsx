"use client"
import Link from 'next/link'
import React, { useEffect,useState } from 'react'
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from "../public/logokis.jpg";
const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  useEffect(()=>{
    const setUpProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    setUpProviders();
  },[])
  const  handleSignOut= async()=>{
     await signOut();
     router.push('/login')
  }
  if(!session){
    return <></>
  }
  return (
    <nav className='flex justify-between w-full pt-3 px-5'>
        <Link href={"/"} className=''>
            <Image alt="logo" src={Logo} style={{width:"100px"}}/>
        </Link>
        <div className='flex p-3 font-semibold'>
            <div className='flex gap-3 md:gap-5 items-center'>
                <Link href={"/"}>Home</Link>
                <Link href={"/projects"}>Projects</Link>
                <button onClick={handleSignOut}>Logout</button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar