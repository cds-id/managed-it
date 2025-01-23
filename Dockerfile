# Stage 1: Build
FROM node:20-alpine3.17 AS builder

# Set working directory
WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Create uploads directory
RUN mkdir -p /app/public/uploads

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
