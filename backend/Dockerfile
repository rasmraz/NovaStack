# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 novastack

# Copy built application
COPY --from=builder --chown=novastack:nodejs /app/dist ./dist
COPY --from=builder --chown=novastack:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=novastack:nodejs /app/package.json ./package.json

# Create logs directory
RUN mkdir -p logs && chown novastack:nodejs logs

USER novastack

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]