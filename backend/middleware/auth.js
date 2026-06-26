// ─────────────────────────────────────────────
//  middleware/auth.js — Verificación de JWT
//  Andrés: aplica este middleware en rutas protegidas
//  Uso: router.get('/ruta', authMiddleware, handler)
// ─────────────────────────────────────────────
const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, email }
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
