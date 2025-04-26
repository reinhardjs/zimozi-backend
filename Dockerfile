FROM node:22.13.1 as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --build-from-source  # Force native module rebuild
COPY . .
RUN npm run build

# Production stage
FROM node:22.13.1-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./
CMD ["node", "dist/index.js"]
