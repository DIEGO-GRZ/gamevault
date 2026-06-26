// ─────────────────────────────────────────────
//  middleware/db.js — Pool de conexión a PostgreSQL
//  Ricardo: aquí está la configuración de la DB
//  Uso: const db = require('../middleware/db')
//       const result = await db.query('SELECT ...', [params])
// ─────────────────────────────────────────────
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', () => console.log('✅ Conectado a PostgreSQL'));
pool.on('error',   (err) => console.error('❌ Error DB:', err));

module.exports = pool;
