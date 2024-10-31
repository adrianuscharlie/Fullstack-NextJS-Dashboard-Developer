import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // authorize: async (credentials) => {
      //   try {
      //     console.log(process.env.NEXTAUTH_URL_INTERNAL)
      //     const response = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL}/auth/login`, {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({
      //         username: credentials.username,
      //         password: credentials.password,
      //       }),
      //     });
          
      //     console.log(`Response status: ${response.status}`);
      //     const data = await response.json();
      //     console.log(`Response data: ${JSON.stringify(data)}`);
          
      //     if (!response.ok) {
      //       throw new Error(`Authentication failed: ${data.message || 'Unknown error'}`);
      //     }
      //     const { token, user } = data
      //     if (user && token) {
      //       return { ...user, token };
      //     } else {
      //       return null;
      //     }
      //   } catch (error) {
      //     console.error("Error during authorization", error);
      //     return null;
      //   }
      // },
      authorize: async (credentials) => {
        const user = await User.login(credentials.username, credentials.password);
        if (user) {
          return Promise.resolve(user); // Return user object on success
        } else {
          return Promise.resolve(null); // Return null on failure
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut:'/login'
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = {
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          namaLengkap: user.namaLengkap,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
