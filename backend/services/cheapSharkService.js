// ─────────────────────────────────────────────
//  services/cheapSharkService.js
//  Diego: consulta precios de juegos en tiendas digitales
//  Documentación: https://apidocs.cheapshark.com
// ─────────────────────────────────────────────
const fetch = require('node-fetch');

const BASE_URL = 'https://www.cheapshark.com/api/1.0';

// Busca el precio más bajo de un juego por nombre
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
      name:       game.external?.steam ? gameName : game.info?.title,
      cheapestPrice: parseFloat(game.cheapestPriceEver?.price || 0),
      currentPrice:  parseFloat(game.deals?.[0]?.price || 0),
      storeId:       game.deals?.[0]?.storeID,
      dealUrl:       `https://www.cheapshark.com/redirect?dealID=${game.deals?.[0]?.dealID}`,
    };
  } catch {
    // Si CheapShark falla, no rompemos la página de detalle
    return null;
  }
}

module.exports = { getGamePrice };
