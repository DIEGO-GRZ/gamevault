// ─────────────────────────────────────────────
//  routes/ai.js — Proxy hacia Claude API
//  Andrés: recibe la pregunta del frontend y llama el servicio de Diego
// ─────────────────────────────────────────────
const router = require('express').Router();
  
const { getAITip } = require('../services/aiTipsService');

// POST /api/ai/tips
// body: { igdbId, gameName, genre, question }
router.post('/tips', async (req, res) => {
  const { gameName, genre, question } = req.body;
  if (!gameName || !question) {
    return res.status(400).json({ message: 'gameName y question son requeridos' });
  }
  try {
    const answer = await getAITip({ gameName, genre, question });
    res.json({ answer });
  } catch (err) {
    res.status(502).json({ message: 'Error al consultar la IA', detail: err.message });
  }
});

module.exports = router;
