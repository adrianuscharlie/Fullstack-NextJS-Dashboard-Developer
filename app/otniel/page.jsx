"use client";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlKpDlhJrPTHz2Mtx6eYN3E_-dRNGo8SM",
  authDomain: "indomaret-100.firebaseapp.com",
  projectId: "indomaret-100",
  storageBucket: "indomaret-100.firebasestorage.app",
  messagingSenderId: "6272334912",
  appId: "1:6272334912:web:89003944163d95eeab73a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Test = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getHeartbit = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        console.log(response.data);
        setData(response.data); // Assuming the response is plain text
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getHeartbit();
  }, []);
  return (
    <div className="px-60 text-4xl py-44">
      {data!==0?<></>:data.map((post) => (
        <div key={post.id} className="mb-10 border border-black">
          <p> Title : {post.title}</p>
          <p>Body : {post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default Test;
