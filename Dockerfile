FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/english-trainer-web/browser /usr/share/nginx/html
ENV NGINX_ENVSUBST_FILTER=^(PORT|BACKEND_URL)$
EXPOSE 80
