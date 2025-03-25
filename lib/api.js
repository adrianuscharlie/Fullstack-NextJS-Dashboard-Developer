import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const URL_PROJECT = `${BASE_URL}/api/projects`;
const URL_USER = `${BASE_URL}/api/user`;

/**
 * Get user session and access token
 */
const getSessionToken = async () => {
  const session = await getServerSession(authOptions);
  return session?.accessToken || null;
};

/**
 * Helper function to fetch data with Authorization token
 */
const fetchWithAuth = async (url) => {
  try {
    const token = await getSessionToken();
    if (!token) return null; // Return null if no token

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return [];
  }
};

/**
 * Get all projects (Admin access)
 */
export const getAllProject = async () => fetchWithAuth(URL_PROJECT);

/**
 * Get project by user name
 */
export const getProjectByName = async (name) => {
  const encodedName = encodeURIComponent(name);
  return fetchWithAuth(`${URL_PROJECT}/user/${encodedName}`);
};

/**
 * Get all users
 */
export const getAllUser = async () => fetchWithAuth(URL_USER);


export const Logout=async()=> await signOut({ redirect: true });