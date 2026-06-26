// ─────────────────────────────────────────────
//  routes/library.js — Biblioteca personal del usuario
//  Andrés: todas las rutas requieren autenticación
// ─────────────────────────────────────────────
const router = require('express').Router();
const db     = require('../middleware/db');
const auth   = require('../middleware/auth');

// Todas las rutas de biblioteca requieren login
router.use(auth);

// GET /api/library — obtener mi biblioteca
router.get('/', async (req, res) => {
  const result = await db.query(
    'SELECT * FROM library WHERE user_id = $1 ORDER BY added_at DESC',
    [req.user.id]
  );
  res.json(result.rows);
});

// POST /api/library/:igdbId — agregar juego
router.post('/:igdbId', async (req, res) => {
  const { igdbId } = req.params;
  const { status = 'pending' } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO library (user_id, igdb_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, igdb_id) DO UPDATE SET status = $3, updated_at = NOW()
       RETURNING *`,
      [req.user.id, igdbId, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/library/:igdbId — cambiar estado
router.put('/:igdbId', async (req, res) => {
  const { igdbId } = req.params;
  const { status } = req.body;
  const result = await db.query(
    'UPDATE library SET status = $1, updated_at = NOW() WHERE user_id = $2 AND igdb_id = $3 RETURNING *',
    [status, req.user.id, igdbId]
  );
  if (!result.rows.length) return res.status(404).json({ message: 'No encontrado en tu biblioteca' });
  res.json(result.rows[0]);
});

// DELETE /api/library/:igdbId — quitar de biblioteca
router.delete('/:igdbId', async (req, res) => {
  await db.query(
    'DELETE FROM library WHERE user_id = $1 AND igdb_id = $2',
    [req.user.id, req.params.igdbId]
  );
  res.json({ message: 'Eliminado de tu biblioteca' });
});

module.exports = router;
