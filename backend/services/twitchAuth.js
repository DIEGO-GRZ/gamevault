// ─────────────────────────────────────────────
//  services/twitchAuth.js
//  Diego: maneja el token OAuth2 de Twitch para IGDB
//  El token se renueva automáticamente cuando expira
// ─────────────────────────────────────────────
const fetch = require('node-fetch');

let cachedToken  = null;
let tokenExpires = 0;

async function getTwitchToken() {
  // Si el token sigue vigente, reutilizarlo
  if (cachedToken && Date.now() < tokenExpires) {
    return cachedToken;
  }

  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type:    'client_credentials',
    }),
  });

  if (!res.ok) throw new Error(`Twitch auth falló: ${res.status}`);

  const data = await res.json();
  cachedToken  = data.access_token;
  // Renovar 60 segundos antes de que expire
  tokenExpires = Date.now() + (data.expires_in - 60) * 1000;

  console.log('🔑 Token de Twitch obtenido, expira en', data.expires_in, 'segundos');
  return cachedToken;
}

module.exports = { getTwitchToken };
