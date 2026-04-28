
-- DROP DATABASE IF EXISTS arcade_vault;
-- CREATE DATABASE arcade_vault;

-- Подключиться к БД:
-- \c arcade_vault

-- ───────────────────────────────────────────────────────────────
-- ТАБЛИЦА: users
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id                  SERIAL PRIMARY KEY,
    username            VARCHAR(32)  NOT NULL UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    role                VARCHAR(10)  NOT NULL DEFAULT 'user'
                        CHECK (role IN ('user', 'admin')),
    is_banned           BOOLEAN      NOT NULL DEFAULT FALSE,
    bio                 VARCHAR(80)  DEFAULT '',
    avatar_id           VARCHAR(32)  DEFAULT 'robot',
    avatar_color        SMALLINT     DEFAULT 0
                        CHECK (avatar_color >= 0 AND avatar_color <= 7),
    total_games_played  INTEGER      NOT NULL DEFAULT 0,
    xp                  INTEGER      NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────────
-- ТАБЛИЦА: games
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS games (
    id              VARCHAR(16)  PRIMARY KEY,
    name_ru         VARCHAR(32)  NOT NULL,
    name_en         VARCHAR(32)  NOT NULL,
    description_ru  VARCHAR(128) DEFAULT '',
    description_en  VARCHAR(128) DEFAULT '',
    color           VARCHAR(20)  NOT NULL DEFAULT '#ffffff',
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE
);

-- ───────────────────────────────────────────────────────────────
-- ТАБЛИЦА: scores (лучший результат пользователя по каждой игре)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scores (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id     VARCHAR(16)  NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    best_score  INTEGER      NOT NULL DEFAULT 0
                CHECK (best_score >= 0),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, game_id)
);

-- ───────────────────────────────────────────────────────────────
-- ТАБЛИЦА: achievements (справочник достижений)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
    id               VARCHAR(32)  PRIMARY KEY,
    name_ru          VARCHAR(64)  NOT NULL,
    name_en          VARCHAR(64)  NOT NULL,
    description_ru   VARCHAR(128) DEFAULT '',
    description_en   VARCHAR(128) DEFAULT '',
    icon_id          VARCHAR(32)  DEFAULT 'star',
    condition_type   VARCHAR(32)  NOT NULL,
    condition_value  INTEGER      DEFAULT 0,
    condition_game   VARCHAR(16)  REFERENCES games(id) ON DELETE SET NULL
);

-- ───────────────────────────────────────────────────────────────
-- ТАБЛИЦА: user_achievements (полученные достижения)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_achievements (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER      NOT NULL REFERENCES users(id)        ON DELETE CASCADE,
    achievement_id  VARCHAR(32)  NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, achievement_id)
);

-- ───────────────────────────────────────────────────────────────
-- ТАБЛИЦА: sessions (история всех сыгранных партий)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id     VARCHAR(16)  NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    score       INTEGER      NOT NULL DEFAULT 0 CHECK (score >= 0),
    played_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────────
-- ИНДЕКСЫ
-- ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_username        ON users(username);
CREATE INDEX IF NOT EXISTS idx_scores_user_id        ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_game_score     ON scores(game_id, best_score DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id      ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_played_at    ON sessions(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_game_id      ON sessions(game_id);

-- ───────────────────────────────────────────────────────────────
-- НАЧАЛЬНЫЕ ДАННЫЕ: игры
-- ───────────────────────────────────────────────────────────────
INSERT INTO games (id, name_ru, name_en, description_ru, description_en, color) VALUES
  ('snake',  'ЗМЕЙКА', 'SNAKE',  'Ешь, расти, выживай.',         'Eat, grow, survive.',        '#00ff88'),
  ('flappy', 'ФЛАППИ', 'FLAPPY', 'Уклоняйся от труб.',           'Dodge the pipes.',            '#00f5ff'),
  ('memory', 'ПАМЯТЬ', 'MEMORY', 'Найди все пары.',               'Find all matching pairs.',    '#ff00aa'),
  ('pong',   'ПОНГ',   'PONG',   'Отбивай мяч. Не пропусти.',    'Bounce the ball. Don''t miss.','#ffe500'),
  ('tetris', 'ТЕТРИС', 'TETRIS', 'Складывай блоки. Убирай линии.','Stack blocks. Clear lines.', '#ff6b00')
ON CONFLICT (id) DO NOTHING;

-- ───────────────────────────────────────────────────────────────
-- НАЧАЛЬНЫЕ ДАННЫЕ: достижения
-- ───────────────────────────────────────────────────────────────
INSERT INTO achievements (id, name_ru, name_en, description_ru, description_en, icon_id, condition_type, condition_value, condition_game) VALUES
  ('first_game',   'Первая кровь',   'First Blood',   'Сыграй первую партию',        'Play your first game',         'gamepad',     'games_played',  1,    NULL),
  ('score_1000',   'Четыре цифры',   'Four Digits',   'Набери 1000+ в любой игре',   'Score 1000+ in any game',      'hundred',     'any_score',     1000, NULL),
  ('score_5000',   'Хай Роллер',     'High Roller',   'Набери 5000+ в любой игре',   'Score 5000+ in any game',      'fire',        'any_score',     5000, NULL),
  ('all_games',    'Перфекционист',  'Completionist', 'Сыграй во все 5 игр',         'Play all 5 games',             'star',        'all_games',     5,    NULL),
  ('top3',         'Пьедестал',      'Podium Finish', 'Войди в топ-3 рейтинга',      'Reach top 3 on leaderboard',   'trophy',      'leaderboard',   3,    NULL),
  ('ten_games',    'Задрот',         'Grinder',       'Сыграй 10+ партий',           'Play 10+ total games',         'bolt',        'games_played',  10,   NULL),
  ('snake_master', 'Мастер Змейки',  'Snake Master',  '1000+ в Змейке',              'Score 1000+ in Snake',         'snakeMaster', 'game_score',    1000, 'snake'),
  ('tetris_god',   'Бог Тетриса',    'Tetris God',    '3000+ в Тетрисе',             'Score 3000+ in Tetris',        'tetrisGod',   'game_score',    3000, 'tetris'),
  ('memory_ace',   'Память Слона',   'Memory Ace',    '500+ в Памяти',               'Score 500+ in Memory',         'brainAce',    'game_score',    500,  'memory'),
  ('pong_ace',     'Мастер Понга',   'Pong Ace',      '1000+ в Понге',               'Score 1000+ in Pong',          'tennis',      'game_score',    1000, 'pong')
ON CONFLICT (id) DO NOTHING;

-- ───────────────────────────────────────────────────────────────
-- НАЧАЛЬНЫЕ ДАННЫЕ: пользователи (пароли — bcrypt hash "password")
-- Настоящие пароли указаны в комментариях, хеши генерируются сервером
-- ───────────────────────────────────────────────────────────────
-- Пароли будут созданы через API /api/auth/register
-- Для первого запуска используй seed.js

-- ───────────────────────────────────────────────────────────────
-- ПРЕДСТАВЛЕНИЯ (VIEWS) для удобства запросов
-- ───────────────────────────────────────────────────────────────

-- Общий рейтинг игроков
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
    u.id,
    u.username,
    u.avatar_id,
    u.avatar_color,
    u.role,
    COALESCE(SUM(s.best_score), 0) AS total_score,
    COUNT(DISTINCT s.game_id)       AS games_with_score,
    u.total_games_played
FROM users u
LEFT JOIN scores s ON s.user_id = u.id
WHERE u.role = 'user' AND u.is_banned = FALSE
GROUP BY u.id, u.username, u.avatar_id, u.avatar_color, u.role, u.total_games_played
ORDER BY total_score DESC;

-- Рейтинг по конкретной игре
CREATE OR REPLACE VIEW game_leaderboard_view AS
SELECT
    u.id          AS user_id,
    u.username,
    u.avatar_id,
    g.id          AS game_id,
    g.name_ru,
    g.name_en,
    s.best_score,
    RANK() OVER (PARTITION BY g.id ORDER BY s.best_score DESC) AS rank_in_game
FROM scores s
JOIN users u ON u.id = s.user_id
JOIN games g ON g.id = s.game_id
WHERE u.is_banned = FALSE AND s.best_score > 0;

-- Статистика платформы (для админа)
CREATE OR REPLACE VIEW platform_stats_view AS
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'user')    AS total_users,
    (SELECT COUNT(*) FROM users WHERE is_banned = TRUE) AS banned_users,
    (SELECT COUNT(*) FROM sessions)                     AS total_sessions,
    (SELECT COALESCE(MAX(best_score), 0) FROM scores)  AS all_time_top_score,
    (SELECT COUNT(*) FROM user_achievements)            AS achievements_unlocked;
