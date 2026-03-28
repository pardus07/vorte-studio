import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const nextAuth = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Sifre", type: "password" },
      },
      async authorize(credentials) {
        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          hash
        );
        if (valid) {
          return {
            id: "1",
            email: credentials.email as string,
            name: "Ibrahim Abi",
          };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
});

export const { handlers, signIn, signOut, auth } = nextAuth;
