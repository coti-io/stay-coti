# ================================
# COTI Community Backend Dockerfile
# Multi-stage build optimized for monorepo
# ================================

# Stage 1: Builder
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# ================================
# Stage 2: Production
# ================================
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 backend

# Copy necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy built application
COPY --from=builder --chown=backend:nodejs /app/dist ./dist

# Switch to non-root user
USER backend

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["yarn", "start"]
