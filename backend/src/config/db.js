// src/config/db.js
const { Pool } = require('pg')
const dotenv = require ('dotenv')
dotenv.config();

const pool = new Pool({
   connectionString: process.env.DATABASE_URL || 'postgresql://johan:johan0204@127.0.0.1:5432/GGSSguardias'
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};
