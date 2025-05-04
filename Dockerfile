# Use the official Node.js image with Alpine for a lightweight base
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat
# Copy lock files and package.json
COPY package.json pnpm-lock.yaml* ./
# Enable pnpm and install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application files
COPY . .
# Build the application
RUN pnpm run build

# Prepare the production image
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Add a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application and static files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions for the Next.js user
RUN chown -R nextjs:nodejs /app

# Switch to the non-root user
USER nextjs

# Expose the port Railway will use
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]