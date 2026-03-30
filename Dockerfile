FROM node:20-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package*.json ./
RUN NODE_ENV=development npm ci
COPY . .
RUN npx prisma generate
ENV NODE_ENV=production
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/app/generated ./app/generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Prisma CLI — migrate deploy için gerekli
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma/engines ./node_modules/@prisma/engines
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv

# Upload klasörü — yazılabilir olmalı
RUN mkdir -p /app/public/uploads/portfolio /app/public/uploads/templates /app/public/uploads/blog && chown -R nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["sh", "-c", "(npx prisma migrate deploy --schema=./prisma/schema.prisma || echo 'Migration skipped'); node server.js"]
