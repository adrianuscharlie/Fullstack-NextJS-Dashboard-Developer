// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "@/models/User";
import { signOut,signIn } from "next-auth/react";
import { redirect } from "next/navigation";

const handler = NextAuth({
  secret:process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        
        const user = await User.login(credentials.email, credentials.password);
        if (user) {
          return Promise.resolve(user); // Return user object on success
        } else {
          return Promise.resolve(null); // Return null on failure
        }
      },
    }),
  ],
  pages:{
    signIn:'/login',
  }
  ,
  session: {
    jwt:true
  },
  callbacks: {
    async jwt({token,user,account}) {
      if(user){
        token.userId=user.username
      }
      return token;
    },
    async session({session,token}) {
      if(token.userId){
        session.id=token.userId
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
