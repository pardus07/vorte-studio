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
        // Hash dogrudan burada — Coolify/Docker $ isaretini bozuyor
        const hash = "$2b$12$KIAJd2XBeHYFHsC61L737OcurZ15XYeGe1XdGssW8jo.rYnkCuNt6";
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
