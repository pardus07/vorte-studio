import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  checkFailureCount,
  recordFailure,
  resetFailures,
  getClientIp,
} from "@/lib/rate-limit";

/**
 * Custom error: NextAuth'a kilitli durumu bildirir, kullanıcı login sayfasında
 * `?error=Locked` query parametresiyle anlamlı mesaj görür.
 */
class LockedError extends CredentialsSignin {
  code = "Locked";
}

// Brute force politikası — admin ve portal için ayrı eşikler
const ADMIN_MAX_FAILURES = 5;
const ADMIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 dk
const PORTAL_MAX_FAILURES = 8;
const PORTAL_LOCKOUT_MS = 30 * 60 * 1000; // 30 dk

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
      async authorize(credentials, request) {
        // IP-bazlı brute force koruması
        const ip = getClientIp(request as Request);
        const failureKey = `admin-login:${ip}`;

        const status = checkFailureCount(
          failureKey,
          ADMIN_MAX_FAILURES,
          ADMIN_LOCKOUT_MS
        );
        if (status.blocked) {
          throw new LockedError();
        }

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
          // Başarılı giriş — sayacı sıfırla
          resetFailures(failureKey);
          return {
            id: "1",
            email: credentials.email as string,
            name: "Ibrahim Abi",
            role: "admin",
          };
        }

        // Başarısız — sayacı artır
        recordFailure(failureKey);
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
      async authorize(credentials, request) {
        const ip = getClientIp(request as Request);
        const email = (credentials.email as string)?.toLowerCase() || "";
        // IP + email kombinasyonu — saldırgan email rotate edemesin
        const failureKey = `portal-login:${ip}:${email}`;

        const status = checkFailureCount(
          failureKey,
          PORTAL_MAX_FAILURES,
          PORTAL_LOCKOUT_MS
        );
        if (status.blocked) {
          throw new LockedError();
        }

        try {
          const user = await prisma.portalUser.findUnique({
            where: { email },
          });
          if (!user || !user.isActive) {
            recordFailure(failureKey);
            return null;
          }

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );
          if (!valid) {
            recordFailure(failureKey);
            return null;
          }

          // Başarılı giriş — sayacı sıfırla, son giriş zamanını güncelle
          resetFailures(failureKey);
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
        } catch (err) {
          if (err instanceof LockedError) throw err;
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
