import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

 const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const url = `${process.env.NEXTAUTH_URL_INTERNAL}/auth/login`;
        try {
          const response = await axios.post(
            url,
            {
              userName: credentials.username,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
              timeout: 10000, // 10 seconds timeout
            }
          );

          const { token, user } = response.data;
          if (user && token) {
            return { ...user, token }; 
          } else {
            throw new Error("Authentication failed: Missing token or user data");
          }
        } catch (error) {
          console.error("Error during authorization:", error.message || error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: { strategy: "jwt" },
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions }; 
