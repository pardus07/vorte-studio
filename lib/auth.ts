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
        token.role = (user as Record<string, unknown>).role as string;
        token.portalUserId = (user as Record<string, unknown>).portalUserId as string | undefined;
        token.firmName = (user as Record<string, unknown>).firmName as string | undefined;
        token.proposalId = (user as Record<string, unknown>).proposalId as string | undefined;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as Record<string, unknown>;
        u.role = token.role;
        u.portalUserId = token.portalUserId;
        u.firmName = token.firmName;
        u.proposalId = token.proposalId;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
});

export const { handlers, signIn, signOut, auth } = nextAuth;
