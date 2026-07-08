const router = require('express').Router();
const db = require('../middleware/db');
const auth = require('../middleware/jwtAuth');

router.get('/:igdbId', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
          t.id,
          t.user_id,
          t.igdb_id,
          t.title,
          t.content,
          t.category,
          t.created_at,
          u.username,
          COUNT(tv.id)::int AS votes
       FROM tips t
       JOIN users u ON u.id = t.user_id
       LEFT JOIN tip_votes tv ON tv.tip_id = t.id
       WHERE t.igdb_id = $1
       GROUP BY t.id, u.username
       ORDER BY votes DESC, t.created_at DESC`,
      [req.params.igdbId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener tips' });
  }
});

router.post('/:igdbId', auth, async (req, res) => {
  const { title, content, category = 'general' } = req.body;

  const validCategories = ['historia', 'jefe', 'coleccionables', 'logros', 'speedrun', 'general'];

  if (!title || !content) {
    return res.status(400).json({ message: 'Título y contenido son obligatorios' });
  }

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      message: 'Categoría inválida. Usa: historia, jefe, coleccionables, logros, speedrun o general'
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO tips (user_id, igdb_id, title, content, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, req.params.igdbId, title, content, category]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al publicar tip' });
  }
});

router.post('/:id/vote', auth, async (req, res) => {
  try {
    await db.query(
      'INSERT INTO tip_votes (user_id, tip_id) VALUES ($1, $2)',
      [req.user.id, req.params.id]
    );

    res.json({ message: 'Voto registrado' });

  } catch (err) {
    res.status(409).json({ message: 'Ya votaste este tip o el tip no existe' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM tips WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(403).json({ message: 'No autorizado o tip inexistente' });
    }

    res.json({ message: 'Tip eliminado' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar tip' });
  }
});

module.exports = router;