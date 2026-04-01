const bcrypt   = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  host:     'localhost',
  port:     5432,
  database: 'arcade_vault',
  user:     'postgres',
  password: '011220',
});

const users = [
  { username: 'ADMIN',       password: 'admin2024', role: 'admin' },
  { username: 'CYBER_ACE',   password: 'ace123',    role: 'user'  },
  { username: 'NEON_WOLF',   password: 'wolf456',   role: 'user'  },
  { username: 'VOID_ZERO',   password: 'void789',   role: 'user'  },
  { username: 'GLITCH_X',    password: 'glitch1',   role: 'user'  },
  { username: 'GRID_RUNNER', password: 'grid999',   role: 'user'  },
];

const seedScores = [
  { username: 'CYBER_ACE',   scores: { snake:1840, flappy:520, memory:1200, pong:980,  tetris:3200 } },
  { username: 'NEON_WOLF',   scores: { snake:1420, flappy:380, memory:900,  pong:1100, tetris:2800 } },
  { username: 'VOID_ZERO',   scores: { snake:980,  flappy:290, memory:750,  pong:850,  tetris:2100 } },
  { username: 'GLITCH_X',    scores: { snake:760,  flappy:210, memory:600,  pong:720,  tetris:1600 } },
  { username: 'GRID_RUNNER', scores: { snake:540,  flappy:160, memory:480,  pong:590,  tetris:1200 } },
];

async function seed() {
  console.log('Начало заполнения БД...');

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users (username, password_hash, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO NOTHING`,
      [u.username, hash, u.role]
    );
    console.log('Пользователь создан: ' + u.username);
  }

  for (const s of seedScores) {
    const userRes = await pool.query('SELECT id FROM users WHERE username = $1', [s.username]);
    const userId = userRes.rows[0]?.id;
    if (!userId) continue;

    for (const [gameId, score] of Object.entries(s.scores)) {
      await pool.query(
        `INSERT INTO scores (user_id, game_id, best_score)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, game_id)
         DO UPDATE SET best_score = EXCLUDED.best_score`,
        [userId, gameId, score]
      );
    }

    const totalGames = Object.keys(s.scores).length * 5;
    const xp = Object.values(s.scores).reduce((a,b)=>a+b,0);
    await pool.query(
      'UPDATE users SET total_games_played = $1, xp = $2 WHERE id = $3',
      [totalGames, xp, userId]
    );
    console.log('Очки добавлены: ' + s.username);
  }

  await pool.query(`UPDATE users SET is_banned = TRUE WHERE username = 'GLITCH_X'`);
  console.log('GLITCH_X заблокирован');
  console.log('База данных заполнена успешно!');

  await pool.end();
}

seed().catch(err => {
  console.error('Ошибка: ' + err.message);
  pool.end();
});