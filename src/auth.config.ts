import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma, no Node.js built-ins.
// Used ONLY by the middleware.
export const authConfig: NextAuthConfig = {
  providers: [], // filled in auth.ts with the Credentials provider
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        // Already logged in → redirect to dashboard
        return isLoggedIn ? Response.redirect(new URL("/admin/cours", nextUrl)) : true;
      }

      // All other /admin routes require auth
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  session: { strategy: "jwt" },
};
