const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Client } = require('pg');

async function initDatabase() {
  const client = process.env.DATABASE_URL
    ? new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
    : new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(sql);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

initDatabase();
