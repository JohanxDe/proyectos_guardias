// scripts/createAdmin.js
const bcrypt = require('bcrypt');
const db = require('./src/config/db');
require('dotenv').config();

console.log("DB_PASSWORD:", process.env.DB_PASSWORD);


async function createAdmin() {
  const nombre = 'Tu Nombre';
  const email = 'tu@correo.com';
  const passwordPlain = 'tuPasswordSeguro';

  const saltRounds = 10;
  const hashed = await bcrypt.hash(passwordPlain, saltRounds);

  const query = 'INSERT INTO admins (nombre, email, password) VALUES ($1, $2, $3) RETURNING id';
  const values = [nombre, email, hashed];

  try {
    const res = await db.query(query, values);
    console.log('Admin creado con id', res.rows[0].id);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
