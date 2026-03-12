FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS dev
RUN npm install -g nodemon
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "dev"]

FROM base AS prod
COPY . .
RUN npx prisma generate
CMD ["npm", "start"]
