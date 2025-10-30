# Base stage
FROM oven/bun:1.3.0 AS base
WORKDIR /app

# Dependencies stage
FROM base AS builder

# Copy necessary files for installing dependencies
COPY ./bun.lock                     .
COPY ./bunfig.toml                  .
COPY ./package.json                 .
COPY ./apps/server/package.json     ./apps/server/
COPY ./packages/shared/package.json ./packages/shared/

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY ./apps/server     ./apps/server
COPY ./packages/shared ./packages/shared/
WORKDIR /app/apps/server

# Build
CMD ["bun", "run", "start"]