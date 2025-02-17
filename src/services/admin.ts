import { pool } from '../config/db';
import bcrypt from 'bcrypt';

export const verifyAdmin = async (username: string, password: string) => {
  try {
    const query = 'SELECT * FROM admins WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return false;
    }

    const admin = result.rows[0];
    const isValid = await bcrypt.compare(password, admin.password_hash);
    
    return isValid;
  } catch (error) {
    console.error('Error verifying admin:', error);
    return false;
  }
};

// Fungsi untuk menambahkan admin baru (gunakan dengan hati-hati)
export const createAdmin = async (username: string, password: string) => {
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const query = 'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id';
    const result = await pool.query(query, [username, passwordHash]);
    
    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
}; 