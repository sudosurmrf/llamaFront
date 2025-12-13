# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/serve.json ./dist/

# Expose port (Railway sets PORT env var)
EXPOSE 3000

# Start the server
CMD ["sh", "-c", "serve dist -l ${PORT:-3000}"]
