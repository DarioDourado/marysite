FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
# Full install: server.ts runs through tsx and imports vite at runtime.
RUN npm ci

COPY . .
RUN npm run build && mkdir -p uploads public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]
