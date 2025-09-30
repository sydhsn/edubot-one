# Build stage
FROM node:20-alpine as build

WORKDIR /workspace

# Copy everything from the root context
COPY . .

# Install dependencies
RUN npm install

# Build the web application
RUN npx nx build web

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /workspace/apps/web/dist/ /usr/share/nginx/html/

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]