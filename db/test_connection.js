require('dotenv').config({ path: '../.env' });

const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});


const TABLAS_ESPERADAS = ['users', 'library', 'reviews', 'tips', 'tip_votes'];

async function main() {
  console.log('🔌 Probando conexión a PostgreSQL...');
  console.log(`   host=${process.env.DB_HOST} db=${process.env.DB_NAME} user=${process.env.DB_USER}`);

  try {
    
    const ping = await pool.query('SELECT NOW() AS ahora');
    console.log(`✅ Conexión exitosa. Hora del servidor: ${ping.rows[0].ahora}`);


    const tablasResult = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    const tablasEncontradas = tablasResult.rows.map(r => r.table_name);

    const faltantes = TABLAS_ESPERADAS.filter(t => !tablasEncontradas.includes(t));
    if (faltantes.length > 0) {
      console.error(`❌ Faltan tablas: ${faltantes.join(', ')}`);
      process.exit(1);
    }
    console.log(`✅ Las 5 tablas existen: ${TABLAS_ESPERADAS.join(', ')}`);

   
    const usuarios = await pool.query('SELECT COUNT(*) FROM users');
    const tips = await pool.query('SELECT COUNT(*) FROM tips');
    console.log(`ℹ️  Usuarios de prueba: ${usuarios.rows[0].count}`);
    console.log(`ℹ️  Tips de prueba: ${tips.rows[0].count}`);

    if (parseInt(usuarios.rows[0].count) < 2 || parseInt(tips.rows[0].count) < 5) {
      console.warn('⚠️  Advertencia: se esperaban al menos 2 usuarios y 5 tips.');
    }

    console.log('\n🎉 Todo en orden. La base de datos está lista.');
    process.exit(0);
  } catch (err) {
    console.error('❌ No se pudo conectar o validar la base de datos.');
    console.error(err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();