import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const nextAuth = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Sifre", type: "password" },
      },
      async authorize(credentials) {
        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash) {
          console.error("[auth] ADMIN_PASSWORD_HASH env tanımlı değil!");
          return null;
        }
        const valid = await bcrypt.compare(
          credentials.password as string,
          hash
        );
        if (valid) {
          return {
            id: "1",
            email: credentials.email as string,
            name: "Ibrahim Abi",
            role: "admin",
          };
        }
        return null;
      },
    }),
    Credentials({
      id: "portal",
      name: "Portal",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Sifre", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.portalUser.findUnique({
            where: { email: (credentials.email as string).toLowerCase() },
          });
          if (!user || !user.isActive) return null;

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );
          if (!valid) return null;

          // Son giriş zamanını güncelle
          await prisma.portalUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: "portal",
            portalUserId: user.id,
            firmName: user.firmName,
            proposalId: user.proposalId,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.portalUserId = user.portalUserId;
        token.firmName = user.firmName;
        token.proposalId = user.proposalId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.portalUserId = token.portalUserId;
        session.user.firmName = token.firmName;
        session.user.proposalId = token.proposalId;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
});

export const { handlers, signIn, signOut, auth } = nextAuth;
