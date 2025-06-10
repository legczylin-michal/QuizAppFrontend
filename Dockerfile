# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies (production only)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Build the application (standalone mode)
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
