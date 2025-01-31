import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", 
  },
});

// Only protect these paths
export const config = {
  matcher: ["/", "/projects/:path*","/configuration/:path*"], 
};
