// ─────────────────────────────────────────────
//  api.js — Helper central para llamadas al backend
//  Vinicio: importa este archivo en cada página
// ─────────────────────────────────────────────

// Este archivo contendrá las peticiones fetch reales conectadas a los endpoints de Andrés.
// Recuerden incluir { credentials: 'include' } en peticiones protegidas para heredar la cookie JWT.
console.log("Módulo API cargado y listo para integración.");

const API_URL = 'http://localhost:3000/api';

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include', // necesario para enviar la cookie JWT
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

// ── Juegos ────────────────────────────────────
const GamesAPI = {
  popular: ()              => apiFetch('/games/popular'),
  search:  (q, genre, platform) => apiFetch(`/games/search?q=${q}&genre=${genre || ''}&platform=${platform || ''}`),
  detail:  (igdbId)        => apiFetch(`/games/${igdbId}`),
};

// ── Auth ──────────────────────────────────────
const AuthAPI = {
  register: (data) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login:    (data) => apiFetch('/auth/login',    { method: 'POST', body: JSON.stringify(data) }),
  me:       ()     => apiFetch('/auth/me'),
};

// ── Biblioteca ────────────────────────────────
const LibraryAPI = {
  getAll:  ()             => apiFetch('/library'),
  add:     (igdbId, status) => apiFetch(`/library/${igdbId}`, { method: 'POST', body: JSON.stringify({ status }) }),
  update:  (igdbId, status) => apiFetch(`/library/${igdbId}`, { method: 'PUT',  body: JSON.stringify({ status }) }),
  remove:  (igdbId)       => apiFetch(`/library/${igdbId}`, { method: 'DELETE' }),
};

// ── Tips ──────────────────────────────────────
const TipsAPI = {
  getByGame: (igdbId)      => apiFetch(`/tips/${igdbId}`),
  create:    (igdbId, data)=> apiFetch(`/tips/${igdbId}`, { method: 'POST', body: JSON.stringify(data) }),
  vote:      (tipId)       => apiFetch(`/tips/${tipId}/vote`, { method: 'POST' }),
  askAI:     (data)        => apiFetch('/ai/tips', { method: 'POST', body: JSON.stringify(data) }),
};
