FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally for dependency management
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./.next/standalone

EXPOSE 3000

WORKDIR /app/.next/standalone

CMD ["node", "server.js"]
