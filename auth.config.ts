import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe base config (no database / bcrypt imports). Shared by the full
 * Node config in `auth.ts`. Keep this import-light so it can run in `proxy.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? token.sub;
        token.role = (user as { role?: string }).role;
        token.partnerSlug = (user as { partnerSlug?: string }).partnerSlug;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.partnerSlug = token.partnerSlug as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
