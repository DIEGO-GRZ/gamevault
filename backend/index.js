require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const allowedOrigins = [
  'http://localhost',
  'http://localhost:80',
  'http://127.0.0.1',
  'http://127.0.0.1:80',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/library', require('./routes/library'));
app.use('/api/tips', require('./routes/tips'));
app.use('/api/ai', require('./routes/ai'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en puerto ${PORT}`));