# Use the official Node.js image with Alpine for a lightweight base
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

# Install dependencies only when needed
FROM base AS deps
# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat
# Copy lock files and package.json
COPY package.json pnpm-lock.yaml* ./
# Install dependencies
RUN pnpm install --frozen-lockfile

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

# Set permissions for the Next.js user
RUN chown -R nextjs:nodejs /app

# Setup directories and permissions for runtime
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY package.json ./

# Switch to the non-root user
USER nextjs

# Expose the port Railway will use
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "start"]