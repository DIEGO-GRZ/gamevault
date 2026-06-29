// ─────────────────────────────────────────────
//  services/cheapSharkService.js
// ─────────────────────────────────────────────
const fetch = require('node-fetch');

const BASE_URL = 'https://www.cheapshark.com/api/1.0';

async function getGamePrice(gameName) {
  try {
    const res = await fetch(
      `${BASE_URL}/games?title=${encodeURIComponent(gameName)}&limit=1`
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

module.exports = { getGamePrice };