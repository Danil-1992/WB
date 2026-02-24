// require('dotenv').config({ path: '../.env' });

// const config = {
//   development: {
//     client: 'pg',
//     connection: {
//       host: process.env.POSTGRES_HOST,
//       port: process.env.POSTGRES_PORT,
//       database: process.env.POSTGRES_DB,
//       user: process.env.POSTGRES_USER,
//       password: process.env.POSTGRES_PASSWORD,
//     },
//     migrations: {
//       directory: './src/migrations',
//       tableName: 'knex_migrations',
//     },
//     seeds: {
//       directory: './src/seeds',
//     },
//   },
// };

// config.production = {
//   client: 'pg',
//   connection: {
//     host: process.env.POSTGRES_HOST,
//     port: process.env.POSTGRES_PORT,
//     database: process.env.POSTGRES_DB,
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//   },
//   migrations: {
//     directory: './src/migrations',
//     tableName: 'knex_migrations',
//   },
// };

// module.exports = config;

// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// const config = {
//   development: {
//     client: 'pg',
//     connection: {
//       host: process.env.POSTGRES_HOST || 'localhost',
//       port: parseInt(process.env.POSTGRES_PORT || '5432'),
//       database: process.env.POSTGRES_DB || 'mydb',
//       user: process.env.POSTGRES_USER || 'myuser',
//       password: process.env.POSTGRES_PASSWORD || 'mypassword',
//     },
//     migrations: {
//       directory: './src/migrations',
//       tableName: 'knex_migrations',
//     },
//   },
//   production: {
//     client: 'pg',
//     connection: {
//       host: process.env.POSTGRES_HOST,
//       port: parseInt(process.env.POSTGRES_PORT || '5432'),
//       database: process.env.POSTGRES_DB,
//       user: process.env.POSTGRES_USER,
//       password: process.env.POSTGRES_PASSWORD,
//     },
//     migrations: {
//       directory: './src/migrations',
//       tableName: 'knex_migrations',
//     },
//   },
// };

// export default config;

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// АБСОЛЮТНЫЙ путь к папке миграций - без всяких хитростей
const migrationsPath = '/app/src/migrations';

console.log('=================================');
console.log('KNEX CONFIGURATION:');
console.log('Migrations path:', migrationsPath);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('DB Host:', process.env.POSTGRES_HOST);
console.log('=================================');

const config = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST || 'postgres',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'mydb',
      user: process.env.POSTGRES_USER || 'myuser',
      password: process.env.POSTGRES_PASSWORD || 'mypassword',
    },
    migrations: {
      directory: migrationsPath,
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: migrationsPath,
      tableName: 'knex_migrations',
    },
  },
};

module.exports = config;