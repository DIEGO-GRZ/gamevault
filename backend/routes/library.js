const router = require('express').Router();
const db = require('../middleware/db');
const auth = require('../middleware/jwtAuth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM library WHERE user_id = $1 ORDER BY added_at DESC',
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener biblioteca' });
  }
});

router.post('/:igdbId', async (req, res) => {
  const { igdbId } = req.params;
  const { status = 'pending' } = req.body;

  const validStatuses = ['playing', 'completed', 'pending', 'favorite'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: 'Estado inválido. Usa: playing, completed, pending o favorite'
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO library (user_id, igdb_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, igdb_id)
       DO UPDATE SET status = $3, updated_at = NOW()
       RETURNING *`,
      [req.user.id, igdbId, status]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al agregar juego' });
  }
});

router.put('/:igdbId', async (req, res) => {
  const { igdbId } = req.params;
  const { status } = req.body;

  const validStatuses = ['playing', 'completed', 'pending', 'favorite'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: 'Estado inválido. Usa: playing, completed, pending o favorite'
    });
  }

  try {
    const result = await db.query(
      `UPDATE library
       SET status = $1, updated_at = NOW()
       WHERE user_id = $2 AND igdb_id = $3
       RETURNING *`,
      [status, req.user.id, igdbId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Juego no encontrado en tu biblioteca' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar juego' });
  }
});

router.delete('/:igdbId', async (req, res) => {
  try {
    const result = await db.query(
      `DELETE FROM library
       WHERE user_id = $1 AND igdb_id = $2
       RETURNING id`,
      [req.user.id, req.params.igdbId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Juego no encontrado en tu biblioteca' });
    }

    res.json({ message: 'Juego eliminado de tu biblioteca' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar juego' });
  }
});

module.exports = router;