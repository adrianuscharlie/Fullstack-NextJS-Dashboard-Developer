// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "@/models/User";
import { signOut,signIn } from "next-auth/react";
import { redirect } from "next/navigation";

const handler = NextAuth({
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
    jwt: true,
    strategy:"jwt"
    
  },
  callbacks: {
    async session(session, user) {
      session.user=user
      return session;
    },
    async jwt({ token, account, profile }) { 
      if(account && account.type === "credentials") { //(2)
        token.userId = account.providerAccountId; // this is Id that coming from authorize() callback 
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
