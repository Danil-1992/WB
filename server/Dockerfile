FROM node:18-alpine

WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm ci

# Копируем весь код
COPY . .

# Делаем скрипт исполняемым
RUN chmod +x /app

# Запускаем миграции и приложение
CMD ["sh", "-c", "cd /app && NODE_ENV=development npx knex migrate:latest --knexfile=src/knexfile.js && node src/index.js"]