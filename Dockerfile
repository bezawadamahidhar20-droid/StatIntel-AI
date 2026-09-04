# Multi-stage build for StatIntel-AI Frontend
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json tsconfig*.json vite.config.ts ./
RUN npm ci

COPY . .
RUN npm run build

# Production runtime stage
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
