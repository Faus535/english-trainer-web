FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY --from=build /app/dist/english-trainer-web/browser /usr/share/nginx/html
EXPOSE 80
CMD ["/bin/sh", "-c", "sed -e 's|__PORT__|'\"${PORT:-80}\"'|g' -e 's|__BACKEND_URL__|'\"${BACKEND_URL}\"'|g' /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
