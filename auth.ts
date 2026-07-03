import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { connectDB } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import User from "@/models/User";
import Partner from "@/models/Partner";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email })
          .select("+password")
          .lean<{
            _id: unknown;
            name: string;
            email: string;
            password?: string;
            role: string;
            image?: string;
          }>();

        if (!user?.password) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.password);
        if (!ok) return null;

        // Attach partner slug so white-label links are one hop away in the UI.
        let partnerSlug: string | undefined;
        if (user.role === "partner") {
          const partner = await Partner.findOne({ user: user._id })
            .select("slug")
            .lean<{ slug: string }>();
          partnerSlug = partner?.slug;
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          partnerSlug,
        };
      },
    }),
  ],
});
