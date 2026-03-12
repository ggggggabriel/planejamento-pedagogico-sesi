FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS dev
COPY . .
CMD ["npm", "start"]

FROM base AS build
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS prod
COPY --from=build /app/dist/sesi-planejamento/browser /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf
