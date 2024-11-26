import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
const handler = NextAuth({
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
        console.log(url, credentials);

        try {
          const response = await axios.post(
            url,
            {
              userName: credentials.username, // Match property names in .NET API
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 10000, // 10 seconds timeout
            }
          );

          const data = response.data;
          console.log(data);

          // Check if the response data includes the expected properties
          const { token, user } = data;
          if (user && token) {
            return { ...user, token }; // Pass token and user details back to NextAuth
          } else {
            throw new Error(
              "Authentication failed: Missing token or user data"
            );
          }
        } catch (error) {
          // Log detailed error for debugging
          console.error("Error during authorization:", error.message || error);

          // Optionally, handle specific error types if needed
          if (error.response && error.response.data) {
            console.error("Server response error:", error.response.data);
          } else if (error.code === "ECONNABORTED") {
            console.error("Request timed out");
          }

          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token; // Add token from user object
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
