import knex from 'knex';
// @ts-ignore
import config from '../knexfile.js'; 
import env from './env.js';

const environment = env.NODE_ENV || 'development';
console.log('Using environment:', environment);
console.log('Connecting to DB host:', config[environment].connection.host);

const db = knex(config[environment]);

export default db;
