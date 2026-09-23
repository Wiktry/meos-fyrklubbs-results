# Use official Node.js image on Debian bookworm-slim
FROM node:20-bookworm-slim

# Set working directory
WORKDIR /app

# Copy package files first (leverages Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Run as non-root user (bookworm images include 'node' user)
USER node

RUN npm run build

ENV NODE_ENV=production

# Start the app
CMD ["node", "build"]
