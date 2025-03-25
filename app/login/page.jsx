"use client";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Logo from "@/public/logokis.jpg";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

const Login = () => {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return; // Prevent multiple requests

    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password. Please try again.");
    } else {
      router.push("/");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex w-full items-center justify-center h-screen">
        <Loading/>
      </div>
    );
  }

  return (
    <section className="flex bg-slate-100 flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <Image width={100} src={Logo} alt="Logo KIS" />
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Login Dashboard Project KIS
          </h1>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your username
              </label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                name="username"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="adrianuscharlie"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="mt-1 px-2 text-black hover:text-sky-500 font-semibold">
              <Link href="/forgotPassword">Forgot Password?</Link>
            </div>
            <button
              type="submit"
              className="w-full bg-sky-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
