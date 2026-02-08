FROM node:20-alpine AS build
# Optional: pass at build time for production blog URLs (e.g. docker build --build-arg PUBLIC_HUMAN_BLOG_URL=https://human.example.com)
ARG PUBLIC_HUMAN_BLOG_URL=""
ARG PUBLIC_AI_BLOG_URL=""
ENV PUBLIC_HUMAN_BLOG_URL=$PUBLIC_HUMAN_BLOG_URL
ENV PUBLIC_AI_BLOG_URL=$PUBLIC_AI_BLOG_URL
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
