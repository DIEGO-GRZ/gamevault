// ─────────────────────────────────────────────
//  services/aiTipsService.js
//  Diego: genera tips usando Claude API (Anthropic)
// ─────────────────────────────────────────────
const fetch = require('node-fetch');

async function getAITip({ gameName, genre, question }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001', // modelo rápido y económico
      max_tokens: 512,
      system: `Eres un experto en videojuegos, especializado en "${gameName}" 
               del género ${genre || 'acción'}. 
               Das consejos prácticos, concisos y útiles.
               Evitas spoilers mayores a menos que el usuario los pida explícitamente.
               Respondes siempre en español.`,
      messages: [
        { role: 'user', content: question },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Claude API error: ${err.error?.message || res.status}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text || 'No pude generar una respuesta.';
}

module.exports = { getAITip };
