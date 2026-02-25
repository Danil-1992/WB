FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY src ./src

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/src/knexfile.js ./knexfile.js

COPY --from=builder /app/src/migrations ./migrations

COPY --from=builder /app/package*.json ./
COPY credentials.json ./

RUN npm ci --only=production

CMD ["sh", "-c", "npx knex migrate:latest --knexfile=./knexfile.js && node dist/index.js"]