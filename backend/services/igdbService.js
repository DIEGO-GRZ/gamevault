// ─────────────────────────────────────────────
//  services/igdbService.js
//  Diego: todas las consultas a la API de IGDB
// ─────────────────────────────────────────────
const fetch = require('node-fetch');
const { getTwitchToken } = require('./twitchAuth');

async function igdbRequest(endpoint, body) {
  const token = await getTwitchToken();
  const res = await fetch(`${process.env.IGDB_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID':    process.env.TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
  });
  if (!res.ok) throw new Error(`IGDB error: ${res.status}`);
  return res.json();
}

// ── Juegos populares para el Home ────────────
async function getPopularGames() {
  return igdbRequest('/games',
    `fields name,cover.url,rating,genres.name,platforms.name,summary;
     sort rating desc;
     where rating != null & cover != null & rating_count > 100;
     limit 20;`
  );
}

// ── Búsqueda por nombre + filtros ────────────
async function searchGames(query, genre = '', platform = '') {
  let filters = 'where cover != null';
  if (genre)    filters += ` & genres.name = "${genre}"`;
  if (platform) filters += ` & platforms.name = "${platform}"`;

  return igdbRequest('/games',
    `fields name,cover.url,rating,genres.name,platforms.name,summary;
     search "${query}";
     ${filters};
     limit 20;`
  );
}

// ── Detalle completo de un juego ─────────────
async function getGameById(igdbId) {
  const results = await igdbRequest('/games',
    `fields name,cover.url,rating,rating_count,summary,storyline,
            genres.name,platforms.name,involved_companies.company.name,
            first_release_date,screenshots.url,videos.video_id;
     where id = ${igdbId};`
  );
  return results[0] || null;
}

// ── Lista de géneros disponibles ─────────────
async function getGenres() {
  return igdbRequest('/genres', `fields name; limit 30;`);
}

// ── Lista de plataformas disponibles ─────────
async function getPlatforms() {
  return igdbRequest('/platforms',
    `fields name; where category = 1; limit 20;`
  );
}

module.exports = { getPopularGames, searchGames, getGameById, getGenres, getPlatforms };
