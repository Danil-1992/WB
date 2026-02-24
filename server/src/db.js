// const knex = require('knex');
// const config = require('./knexfile.js');
// const env = require('./env.js');

// const environment = env.NODE_ENV || 'development';
// console.log('Connecting to DB host:', env.POSTGRES_HOST);

// const db = knex({
//   client: 'pg',
//   connection: {
//     host: env.POSTGRES_HOST,
//     port: env.POSTGRES_PORT,
//     database: env.POSTGRES_DB,
//     user: env.POSTGRES_USER,
//     password: env.POSTGRES_PASSWORD,
//   },
//   migrations: {
//     directory: './src/migrations',
//     tableName: 'knex_migrations',
//   },
// });

// db.raw('SELECT 1')
//   .then(() => console.log('✅ Подключение к БД успешно'))
//   .catch((err) => console.error('❌ Ошибка подключения к БД:', err.message));

// module.exports =  db;
const knex = require('knex');
const config = require('./knexfile.js');
const env = require('./env.js');

const environment = env.NODE_ENV || 'development';
console.log('Using environment:', environment);
console.log('Connecting to DB host:', config[environment].connection.host);

const db = knex(config[environment]);

module.exports = db;