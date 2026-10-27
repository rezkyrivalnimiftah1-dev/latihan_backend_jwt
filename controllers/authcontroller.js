const pool = require('../config/db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) throw new Error('JWT_SECRET belum diset di .env');

const salt_rounds = 10;

module.exports = {
  // POST /api/auth/register
  register: async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      
      // Validasi sederhana
      if (!email || !password) {
        return res.status(400).json({ message: 'email & password wajib' });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: 'password minimal 6 karakter' });
      }

      // Cek apakah user sudah ada
      const [existing] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }

      // Hash password
      const hashed = await bcrypt.hash(password, salt_rounds);
      
      // Insert ke table users
      const [result] = await pool.execute(
        'INSERT INTO users (email, name, password) VALUES (?, ?, ?)',
        [email, name || null, hashed]
      );

      const insertedId = result.insertId;
      return res.status(201).json({ id: insertedId, email, name: name || null });

    } catch (err) {
      next(err);
    }
  },
  
  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
          return res.status(400).json({ message: 'email dan password wajib' });
        }

        // Ambil data user 
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
          return res.status(401).json({ message: 'invalid credential' });
        }

        const user = rows[0];

        // Bandingkan password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ message: 'invalid credential' });
        }

        // Generate JWT
        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' }); // 1 hour

        return res.json({
            message: 'login berhasil',
            token,
            user: { id: user.id, email: user.email, name: user.name } 
        });
    } catch (err) {
        next(err);
    }
  }
};