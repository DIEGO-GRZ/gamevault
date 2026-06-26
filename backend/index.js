// ─────────────────────────────────────────────
//  index.js — Punto de entrada del servidor
//  Andrés: aquí registras tus rutas
// ─────────────────────────────────────────────
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// ── Middleware ────────────────────────────────
app.use(cors({
  origin: 'http://localhost',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── Rutas (Andrés) ────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/games',   require('./routes/games'));
app.use('/api/library', require('./routes/library'));
app.use('/api/tips',    require('./routes/tips'));
app.use('/api/ai',      require('./routes/ai'));

// ── Health check ──────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Start ─────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en puerto ${PORT}`));
