# Base stage
FROM oven/bun:1.3.0 AS base
WORKDIR /app

# Dependencies stage
FROM base AS builder

# Copy necessary files for installing dependencies
COPY ./bun.lock                     .
COPY ./bunfig.toml                  .
COPY ./package.json                 .
COPY ./apps/client/package.json     ./apps/client/
COPY ./packages/shared/package.json ./packages/shared/

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY ./apps/client     ./apps/client
COPY ./packages/shared ./packages/shared/

# Build
WORKDIR /app/apps/client
RUN bun run build

# Final stage for running with nginx
FROM nginx:alpine
COPY ./apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html