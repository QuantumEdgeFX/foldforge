#!/bin/bash
# FoldForge — Quick Start Script (Production)
# Runs the compiled build. Run `pnpm run build` first.
set -e

echo "=== FoldForge Startup ==="

# Check for .env (local / non-Render deployments)
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "No .env found — copying .env.example to .env"
    cp .env.example .env
    echo "⚠️  Please edit .env and set JWT_SECRET before running in production!"
  fi
fi

# Install dependencies if needed
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  pnpm install --frozen-lockfile
fi

# Build if dist/index.js is missing
if [ ! -f dist/index.js ]; then
  echo "No build found — running pnpm build..."
  pnpm run build
fi

# Create data and logs directories
mkdir -p data logs

# Start server using compiled output
echo "Starting FoldForge (production build)..."
NODE_ENV=production node dist/index.js
