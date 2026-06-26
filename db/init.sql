-- ─────────────────────────────────────────────
--  init.sql — Esquema de GameVault
--  Ricardo: este archivo se ejecuta automáticamente
--  cuando Docker levanta el contenedor de PostgreSQL
-- ─────────────────────────────────────────────

-- ── Tablas ────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS library (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  igdb_id    INTEGER NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'pending'
               CHECK (status IN ('playing', 'completed', 'pending', 'favorite')),
  added_at   TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, igdb_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  igdb_id    INTEGER NOT NULL,
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 10),
  content    TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, igdb_id)
);

CREATE TABLE IF NOT EXISTS tips (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  igdb_id    INTEGER NOT NULL,
  title      VARCHAR(150) NOT NULL,
  content    TEXT NOT NULL,
  category   VARCHAR(30) NOT NULL DEFAULT 'general'
               CHECK (category IN ('historia', 'jefe', 'coleccionables', 'logros', 'speedrun', 'general')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tip_votes (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tip_id     INTEGER NOT NULL REFERENCES tips(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, tip_id)   -- un usuario solo puede votar un tip una vez
);

-- ── Índices para mejorar performance ──────────

CREATE INDEX IF NOT EXISTS idx_library_user     ON library(user_id);
CREATE INDEX IF NOT EXISTS idx_library_igdb     ON library(igdb_id);
CREATE INDEX IF NOT EXISTS idx_tips_igdb        ON tips(igdb_id);
CREATE INDEX IF NOT EXISTS idx_tip_votes_tip    ON tip_votes(tip_id);
CREATE INDEX IF NOT EXISTS idx_reviews_igdb     ON reviews(igdb_id);

-- ── Datos de prueba ───────────────────────────
-- Contraseña de ambos usuarios: "password123"

INSERT INTO users (username, email, password_hash) VALUES
  ('diego',   'diego@gamevault.com',   '$2a$10$rBmRzBGlr6wP3cX2fR0TW.xQvL6QJEiVTDHq1qGvJn.9bOFNHjv0q'),
  ('andres',  'andres@gamevault.com',  '$2a$10$rBmRzBGlr6wP3cX2fR0TW.xQvL6QJEiVTDHq1qGvJn.9bOFNHjv0q')
ON CONFLICT DO NOTHING;

INSERT INTO tips (user_id, igdb_id, title, content, category) VALUES
  (1, 1942, 'Tip de speedrun para Dark Souls',   'Usa el glitch de la escalera en el primer castillo para saltarte 3 jefes.', 'speedrun'),
  (1, 1942, 'Cómo vencer al primer jefe fácil',  'Ataca por la izquierda y rueda hacia la derecha cuando levante el hacha.', 'jefe'),
  (2, 1942, 'Consejo para principiantes',         'No te rindas. Cada muerte te enseña algo. Aprende los patrones.', 'general')
ON CONFLICT DO NOTHING;
