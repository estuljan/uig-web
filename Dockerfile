# Multi-stage build for uig-web production image

# Builder stage
FROM node:alpine AS builder

WORKDIR /app

# Copy package.json and optionally package-lock.json if present
COPY package*.json ./

RUN npm install

COPY src ./src
COPY public ./public

RUN npm run build

# Server stage
FROM nginx:alpine AS server

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
