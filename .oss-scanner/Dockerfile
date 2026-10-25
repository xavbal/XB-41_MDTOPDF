# Build image for Anthropic's OSS Scanner (https://github.com/anthropics/oss-scanner).
FROM node:22-bookworm-slim

# Install Chromium and required fonts for headless PDF rendering in Linux
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=/usr/bin/chromium \
    CI=true

# Scanner contract: checkout lives at /src
COPY . /src
WORKDIR /src

# Install dependencies and run tests while network is active
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
RUN npm test
