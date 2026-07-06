// ─────────────────────────────────────────────
//  routes/auth.js — Registro, Login, Logout (Corregido)
// ─────────────────────────────────────────────
const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../middleware/db');

// Bypass temporal mientras Andrés entrega el middleware real
const authMiddlewareBypass = (req, res, next) => {
  // Simulamos que el usuario está logueado temporalmente para no romper la ruta
  req.user = { id: 1, username: "Invitado", email: "invitado@gamevault.com" };
  next();
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada' });
});

// GET /api/auth/me — ruta protegida con bypass temporal
router.get('/me', authMiddlewareBypass, async (req, res) => {
  res.json(req.user);
});

module.exports = router;




// updated.
