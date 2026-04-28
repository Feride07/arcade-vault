// ═══════════════════════════════════════════════════════════════
// ARCADE VAULT — Backend API Server
// Node.js + Express + PostgreSQL
// ═══════════════════════════════════════════════════════════════

const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'arcade_vault_secret_2024';

// ── Подключение к PostgreSQL ──────────────────────────────────
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'arcade_vault',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '011220',
});

// Проверка подключения
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Ошибка подключения к PostgreSQL:', err.message);
    process.exit(1);
  }
  release();
  console.log('✅ Подключено к PostgreSQL');
});

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ── JWT авторизация ───────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Нет токена' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Токен недействителен' });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Нет прав администратора' });
  }
  next();
}

// ════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════════════════════════════

// POST /api/auth/register — регистрация
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || username.length < 3)
    return res.status(400).json({ error: 'Имя должно быть минимум 3 символа' });
  if (!password || password.length < 6)
    return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов' });
  if (username.toLowerCase() === 'admin')
    return res.status(400).json({ error: 'Имя "admin" зарезервировано' });

  try {
    const exists = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (exists.rows.length > 0)
      return res.status(400).json({ error: 'Имя уже занято' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, password_hash, role)
       VALUES ($1, $2, 'user') RETURNING id, username, role`,
      [username, hash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/auth/login — вход
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Неверный логин или пароль' });
    if (user.is_banned) return res.status(403).json({ error: 'Аккаунт заблокирован' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Неверный логин или пароль' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: user.id, username: user.username, role: user.role,
        bio: user.bio, avatar_id: user.avatar_id,
        avatar_color: user.avatar_color, xp: user.xp,
        total_games_played: user.total_games_played,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/auth/me — получить текущего пользователя
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, role, bio, avatar_id, avatar_color, xp, total_games_played
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ════════════════════════════════════════════════════════════════
// SCORES ROUTES
// ════════════════════════════════════════════════════════════════

// GET /api/leaderboard — общий рейтинг
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Используем прямой запрос вместо view чтобы включить всех пользователей
    const result = await pool.query(`
      SELECT
        u.id,
        u.username,
        u.avatar_id,
        u.avatar_color,
        u.role,
        COALESCE(SUM(s.best_score), 0)::int AS total_score,
        COUNT(DISTINCT s.game_id)::int       AS games_with_score,
        u.total_games_played
      FROM users u
      LEFT JOIN scores s ON s.user_id = u.id
      WHERE u.is_banned = FALSE
      GROUP BY u.id, u.username, u.avatar_id, u.avatar_color, u.role, u.total_games_played
      ORDER BY total_score DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/leaderboard/:gameId — рейтинг по игре
app.get('/api/leaderboard/:gameId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM game_leaderboard_view WHERE game_id = $1 ORDER BY best_score DESC LIMIT 50',
      [req.params.gameId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/scores/:userId — очки пользователя по всем играм
app.get('/api/scores/:userId', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT game_id, best_score FROM scores WHERE user_id = $1',
      [req.params.userId]
    );
    // Преобразуем в объект { snake: 1000, flappy: 500, ... }
    const scores = {};
    result.rows.forEach(r => { scores[r.game_id] = r.best_score; });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/scores — сохранить результат игры
app.post('/api/scores', authMiddleware, async (req, res) => {
  const { game_id, score } = req.body;
  if (!game_id || score === undefined)
    return res.status(400).json({ error: 'Нет game_id или score' });

  try {
    // Проверяем что игра существует
    const gameExists = await pool.query('SELECT id FROM games WHERE id = $1', [game_id]);
    if (!gameExists.rows.length)
      return res.status(400).json({ error: 'Игра не найдена' });

    // Обновляем рекорд только если новый результат лучше
    await pool.query(
      `INSERT INTO scores (user_id, game_id, best_score, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, game_id)
       DO UPDATE SET
         best_score = GREATEST(scores.best_score, EXCLUDED.best_score),
         updated_at = NOW()
       WHERE EXCLUDED.best_score > scores.best_score`,
      [req.user.id, game_id, score]
    );

    // Записываем сессию
    await pool.query(
      'INSERT INTO sessions (user_id, game_id, score) VALUES ($1, $2, $3)',
      [req.user.id, game_id, score]
    );

    // Обновляем счётчик партий и XP
    await pool.query(
      `UPDATE users SET
         total_games_played = total_games_played + 1,
         xp = xp + $1
       WHERE id = $2`,
      [Math.floor(score / 10) + 50, req.user.id]
    );

    // Проверяем и выдаём достижения
    await checkAchievements(req.user.id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ════════════════════════════════════════════════════════════════
// PROFILE ROUTES
// ════════════════════════════════════════════════════════════════

// GET /api/profile/:userId — профиль игрока
app.get('/api/profile/:userId', authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query(
      `SELECT id, username, role, bio, avatar_id, avatar_color, xp, total_games_played, created_at
       FROM users WHERE id = $1`,
      [req.params.userId]
    );
    if (!userResult.rows.length)
      return res.status(404).json({ error: 'Пользователь не найден' });

    const scoresResult = await pool.query(
      'SELECT game_id, best_score FROM scores WHERE user_id = $1',
      [req.params.userId]
    );

    const achResult = await pool.query(
      `SELECT a.id, a.name_ru, a.name_en, a.icon_id, ua.unlocked_at
       FROM user_achievements ua
       JOIN achievements a ON a.id = ua.achievement_id
       WHERE ua.user_id = $1`,
      [req.params.userId]
    );

    const scores = {};
    scoresResult.rows.forEach(r => { scores[r.game_id] = r.best_score; });

    res.json({
      user: userResult.rows[0],
      scores,
      achievements: achResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PATCH /api/profile — обновить профиль
app.patch('/api/profile', authMiddleware, async (req, res) => {
  const { bio, avatar_id, avatar_color } = req.body;
  try {
    await pool.query(
      `UPDATE users SET
         bio = COALESCE($1, bio),
         avatar_id = COALESCE($2, avatar_id),
         avatar_color = COALESCE($3, avatar_color)
       WHERE id = $4`,
      [bio, avatar_id, avatar_color, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ════════════════════════════════════════════════════════════════
// GAMES ROUTES
// ════════════════════════════════════════════════════════════════

// GET /api/games — список игр
app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games WHERE is_active = TRUE ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ════════════════════════════════════════════════════════════════

// GET /api/admin/users — все пользователи
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.role, u.is_banned, u.total_games_played, u.created_at,
              COALESCE(SUM(s.best_score), 0) AS total_score
       FROM users u
       LEFT JOIN scores s ON s.user_id = u.id
       WHERE u.role != 'admin'
       GROUP BY u.id ORDER BY total_score DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PATCH /api/admin/users/:id/ban — бан/разбан
app.patch('/api/admin/users/:id/ban', authMiddleware, adminMiddleware, async (req, res) => {
  const { is_banned } = req.body;
  try {
    await pool.query('UPDATE users SET is_banned = $1 WHERE id = $2', [is_banned, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/admin/users/:id/scores — сброс очков игрока
app.delete('/api/admin/users/:id/scores', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM scores WHERE user_id = $1', [req.params.id]);
    await pool.query('UPDATE users SET xp = 0, total_games_played = 0 WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/admin/scores — сброс всех очков
app.delete('/api/admin/scores', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM scores');
    await pool.query('UPDATE users SET xp = 0, total_games_played = 0');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/admin/stats — статистика платформы
app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM platform_stats_view');
    const gameStats = await pool.query(
      `SELECT g.id, g.name_ru, g.name_en,
              MAX(s.best_score) AS top_score,
              COUNT(s.id) AS players
       FROM games g
       LEFT JOIN scores s ON s.game_id = g.id
       GROUP BY g.id, g.name_ru, g.name_en`
    );
    res.json({ platform: result.rows[0], games: gameStats.rows });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ════════════════════════════════════════════════════════════════
// ACHIEVEMENTS LOGIC
// ════════════════════════════════════════════════════════════════

async function checkAchievements(userId) {
  try {
    const userResult = await pool.query(
      'SELECT total_games_played FROM users WHERE id = $1', [userId]
    );
    const scoresResult = await pool.query(
      'SELECT game_id, best_score FROM scores WHERE user_id = $1', [userId]
    );
    const rankResult = await pool.query(
      `SELECT RANK() OVER (ORDER BY total_score DESC) AS rank
       FROM leaderboard_view WHERE id = $1`, [userId]
    );

    const gamesPlayed = userResult.rows[0]?.total_games_played ?? 0;
    const scores = {};
    scoresResult.rows.forEach(r => { scores[r.game_id] = r.best_score; });
    const maxScore = Math.max(0, ...Object.values(scores));
    const gamesWithScore = Object.keys(scores).length;
    const rank = rankResult.rows[0]?.rank ?? 999;

    const toUnlock = [];

    if (gamesPlayed >= 1)  toUnlock.push('first_game');
    if (maxScore >= 1000)  toUnlock.push('score_1000');
    if (maxScore >= 5000)  toUnlock.push('score_5000');
    if (gamesWithScore>=5) toUnlock.push('all_games');
    if (rank <= 3)         toUnlock.push('top3');
    if (gamesPlayed >= 10) toUnlock.push('ten_games');
    if ((scores.snake  ?? 0) >= 1000) toUnlock.push('snake_master');
    if ((scores.tetris ?? 0) >= 3000) toUnlock.push('tetris_god');
    if ((scores.memory ?? 0) >= 500)  toUnlock.push('memory_ace');
    if ((scores.pong   ?? 0) >= 1000) toUnlock.push('pong_ace');

    for (const achId of toUnlock) {
      await pool.query(
        `INSERT INTO user_achievements (user_id, achievement_id)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [userId, achId]
      );
    }
  } catch (err) {
    console.error('Achievement check error:', err.message);
  }
}

// ── Запуск сервера ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Arcade Vault API запущен на http://localhost:${PORT}`);
});
