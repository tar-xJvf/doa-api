// src/config/db.js
const { Pool } = require('pg');
const env = require('./env'); // Ambil konfigurasi dari env.js

const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_PASS,
  port: env.DB_PORT,
});

module.exports = pool;
