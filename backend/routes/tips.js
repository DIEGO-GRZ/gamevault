// ─────────────────────────────────────────────
//  routes/tips.js — Tips de comunidad
//  Andrés: leer es público, escribir/votar requiere auth
// ─────────────────────────────────────────────
const router = require('express').Router();
const db     = require('../middleware/db');
const auth   = require('../middleware/auth');

// GET /api/tips/:igdbId — tips públicos de un juego
router.get('/:igdbId', async (req, res) => {
  const result = await db.query(
    `SELECT t.*, u.username,
            COUNT(tv.id) AS votes
     FROM tips t
     JOIN users u ON u.id = t.user_id
     LEFT JOIN tip_votes tv ON tv.tip_id = t.id
     WHERE t.igdb_id = $1
     GROUP BY t.id, u.username
     ORDER BY votes DESC, t.created_at DESC`,
    [req.params.igdbId]
  );
  res.json(result.rows);
});

// POST /api/tips/:igdbId — publicar tip (auth)
router.post('/:igdbId', auth, async (req, res) => {
  const { title, content, category } = req.body;
  const result = await db.query(
    'INSERT INTO tips (user_id, igdb_id, title, content, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [req.user.id, req.params.igdbId, title, content, category]
  );
  res.status(201).json(result.rows[0]);
});

// POST /api/tips/:id/vote — votar un tip (auth)
router.post('/:id/vote', auth, async (req, res) => {
  try {
    await db.query(
      'INSERT INTO tip_votes (user_id, tip_id) VALUES ($1, $2)',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'Voto registrado' });
  } catch {
    res.status(409).json({ message: 'Ya votaste este tip' });
  }
});

// DELETE /api/tips/:id — borrar mi tip (auth)
router.delete('/:id', auth, async (req, res) => {
  const result = await db.query(
    'DELETE FROM tips WHERE id = $1 AND user_id = $2 RETURNING id',
    [req.params.id, req.user.id]
  );
  if (!result.rows.length) return res.status(403).json({ message: 'No autorizado' });
  res.json({ message: 'Tip eliminado' });
});

module.exports = router;
