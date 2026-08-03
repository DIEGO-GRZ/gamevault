// ─────────────────────────────────────────────
//  services/cheapSharkService.js
// ─────────────────────────────────────────────
const fetch = require('node-fetch');

const BASE_URL = 'https://www.cheapshark.com/api/1.0';

async function searchByTitle(title) {
  try {
    const res = await fetch(
      `${BASE_URL}/games?title=${encodeURIComponent(title)}&limit=1`,
      {
        headers: {
          // CheapShark rechaza peticiones sin un User-Agent descriptivo (400 Bad Request)
          'User-Agent': 'GameVault/1.0 (proyecto escolar UTMA)',
        },
      }
    );
    if (!res.ok) return null;

    const games = await res.json();
    if (!games.length) return null;

    const game = games[0];

    return {
      currentPrice:  parseFloat(game.cheapest || 0),
      cheapestPrice: parseFloat(game.cheapestPriceEver?.price || game.cheapest || 0),
      dealUrl: game.cheapestDealID
        ? `https://www.cheapshark.com/redirect?dealID=${decodeURIComponent(game.cheapestDealID)}`
        : null,
    };
  } catch {
    return null;
  }
}

// Corta el título en el primer ":" o "-" seguido de espacio.
// "The Witcher 3: Wild Hunt - Game of the Year Edition" -> "The Witcher 3"
// Los subtítulos de edición (GOTY, Complete, Ultimate, etc.) casi nunca
// están catalogados así en CheapShark, pero el juego base sí.
function simplifyTitle(name) {
  return name.split(/\s*[-:]\s+/)[0].trim();
}

async function getGamePrice(gameName) {
  if (!gameName) return null;

  // Intento 1: título completo tal cual viene de IGDB
  const exactMatch = await searchByTitle(gameName);
  if (exactMatch) return exactMatch;

  // Intento 2: título simplificado (sin subtítulo de edición)
  const simplified = simplifyTitle(gameName);
  if (simplified && simplified !== gameName) {
    return searchByTitle(simplified);
  }

  return null;
}

module.exports = { getGamePrice };
