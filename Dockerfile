# Stage 1: Build
FROM node:20-alpine3.17 AS builder

# Set working directory
WORKDIR /app

# Install necessary build tools and SSL libraries
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    openssl \
    openssl-dev \
    ca-certificates \
    build-base \
    curl \
    && mkdir -p /usr/local/share/ca-certificates \
    && update-ca-certificates \
    && ln -sf /usr/lib/libssl.so /usr/lib/libssl.so.1.1 \
    && ln -sf /usr/lib/libcrypto.so /usr/lib/libcrypto.so.1.1

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY db ./db/
COPY .env ./.env
COPY . .

# Install dependencies
RUN npm ci

# Generate Prisma client with explicit binary target
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl
RUN npx prisma generate

# Build application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine3.17 AS runner

# Install necessary production dependencies and SSL libraries
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    ca-certificates \
    && mkdir -p /usr/local/share/ca-certificates \
    && update-ca-certificates \
    && ln -sf /usr/lib/libssl.so /usr/lib/libssl.so.1.1 \
    && ln -sf /usr/lib/libcrypto.so /usr/lib/libcrypto.so.1.1

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/db ./db
COPY --from=builder /app/prisma ./prisma

# Copy Prisma generated files specifically
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port the app runs on
EXPOSE 3000

# Create volume for uploads
VOLUME ["/app/public/uploads"]

# Create uploads directory with proper permissions
RUN mkdir -p /app/public/uploads && chmod 777 /app/public/uploads

# Add non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership of the uploads directory and prisma directory
RUN chown -R nextjs:nodejs /app/public/uploads /app/node_modules/.prisma

USER nextjs

# Start the application
CMD ["npm", "start"]
