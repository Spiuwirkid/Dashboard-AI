import { Pool } from 'pg';

export const pool = new Pool({
  user: import.meta.env.VITE_DB_USER,
  password: import.meta.env.VITE_DB_PASSWORD,
  host: import.meta.env.VITE_DB_HOST,
  port: Number(import.meta.env.VITE_DB_PORT),
  database: import.meta.env.VITE_DB_NAME,
}); 