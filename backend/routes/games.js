// ─────────────────────────────────────────────
//  routes/games.js — Consultas a IGDB + CheapShark
//  Andrés: aquí llamas los servicios de Diego
// ─────────────────────────────────────────────
const router = require('express').Router();
const igdb   = require('../services/igdbService');
const cheap  = require('../services/cheapSharkService');

// GET /api/games/popular
router.get('/popular', async (req, res) => {
  try {
    const games = await igdb.getPopularGames();
    res.json(games);
  } catch (err) {
    res.status(502).json({ message: 'Error al obtener juegos de IGDB', detail: err.message });
  }
});

// GET /api/games/search?q=&genre=&platform=
router.get('/search', async (req, res) => {
  const { q, genre, platform } = req.query;
  if (!q) return res.status(400).json({ message: 'Parámetro q requerido' });
  try {
    const games = await igdb.searchGames(q, genre, platform);
    res.json(games);
  } catch (err) {
    res.status(502).json({ message: 'Error en la búsqueda', detail: err.message });
  }
});

// GET /api/games/:igdbId — detalle + precio
router.get('/:igdbId', async (req, res) => {
  const { igdbId } = req.params;
  try {
    // Llamadas en paralelo para mayor velocidad
    const [game, price] = await Promise.all([
      igdb.getGameById(igdbId),
      cheap.getGamePrice('').catch(() => null), // Diego: pasar el nombre del juego
    ]);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' });

    // Llamar CheapShark con el nombre real del juego
    const priceData = await cheap.getGamePrice(game.name).catch(() => null);
    res.json({ ...game, price: priceData });
  } catch (err) {
    res.status(502).json({ message: 'Error al obtener el juego', detail: err.message });
  }
});

module.exports = router;
