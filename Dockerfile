FROM node:22-alpine AS base
WORKDIR /app

FROM base AS builder
# sharp 0.34+ Alpine musl icin bundled libvips ile geliyor — apk dep'e gerek yok.
# (Onceki "vips-dev build-base python3 || true" satiri Alpine CDN throttle'da
# 21dk build timeout'a sebep oluyordu; sharp pre-built binary yeterli.)
COPY package*.json ./
RUN NODE_ENV=development npm ci
COPY . .
RUN npx prisma generate
ENV NODE_ENV=production
# TypeScript checker heap'i Coolify VPS'te default limite (~1.5GB) sıkışırsa
# "Running TypeScript..." adımında sessizce OOM ile ölür. 4GB'a çıkarıyoruz.
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
# sharp runtime libvips'i node_modules/@img/sharp-libvips-linux-musl-x64 icinde
# bundled tasiyor — runner stage'de apk vips paketi gereksiz.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/app/generated ./app/generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/fonts ./fonts

# Prisma CLI — migrate deploy için gerekli
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma/engines ./node_modules/@prisma/engines
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv

# sharp native modul — serverExternalPackages ile bundle dışına alındı,
# runner stage'e ayrıca kopyalanmalı
COPY --from=builder /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder /app/node_modules/@img ./node_modules/@img

# Upload klasörü — yazılabilir olmalı (brand: logo brand asset bundle'ları)
RUN mkdir -p /app/public/uploads/portfolio /app/public/uploads/templates /app/public/uploads/blog /app/public/uploads/brand /app/public/uploads/logos && chown -R nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["sh", "-c", "(npx prisma migrate deploy || echo 'Migration skipped'); node server.js"]
