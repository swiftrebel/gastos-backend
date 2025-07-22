require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,  // Esto permite conectarse sin verificar el certificado (útil para AWS RDS)
  },
});

pool.on('connect', () => {
  console.log('Conectado a la base de datos PostgreSQL en AWS RDS');
});

pool.on('error', (err) => {
  console.error('Error inesperado en la conexión a la base de datos', err);
  process.exit(-1);
});

module.exports = pool;
