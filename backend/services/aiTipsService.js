// ─────────────────────────────────────────────
//  services/aiTipsService.js
//  Diego: genera tips usando Gemini API (Google)
// ─────────────────────────────────────────────
const fetch = require('node-fetch');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
async function getAITip({ gameName, genre, question }) {
  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Eres un experto en videojuegos, especializado en "${gameName}" del género ${genre || 'acción'}.
Das consejos prácticos, concisos y útiles.
Evitas spoilers mayores a menos que el usuario los pida explícitamente.
Respondes siempre en español.

Pregunta del usuario: ${question}`
        }]
      }]
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Gemini API error: ${err.error?.message || res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';
}

module.exports = { getAITip };