import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════
const T = {
  en: {
    appName: "ARCADE VAULT",
    nav: { arcade: "ARCADE", rankings: "RANKINGS", admin: "ADMIN", profile: "PROFILE" },
    auth: {
      signIn: "SIGN IN", signUp: "SIGN UP", logout: "LOGOUT",
      username: "Username", password: "Password", confirmPassword: "Confirm Password",
      noAccount: "No account?", hasAccount: "Already have one?",
      loginBtn: "ENTER VAULT", registerBtn: "CREATE ACCOUNT",
      error: { badLogin: "Wrong username or password.", passMismatch: "Passwords don't match.", shortUser: "Username must be 3+ chars.", takenName: "Username already taken.", shortPass: "Password must be 6+ chars.", adminForbidden: "Cannot register as admin." },
      tagline: "Compete. Dominate. Be Legendary.",
    },
    home: {
      welcome: "WELCOME TO", playAs: "PLAYING AS", setBefore: "SIGN IN TO PLAY", topPlayers: "◈ TOP PLAYERS",
      callsign: "ENTER YOUR CALLSIGN", go: "GO", best: "BEST",
    },
    leaderboard: { title: "◈ HALL OF FAME ◈", rank: "RANK", player: "PLAYER", score: "SCORE", bar: "BAR", overall: "OVERALL" },
    game: { back: "◄ BACK", player: "PLAYER", finalScore: "FINAL SCORE", saveScore: "◈ SAVE SCORE", saved: "✓ SCORE SAVED!", playAgain: "PLAY AGAIN", gameOver: "GAME OVER" },
    hints: {
      snake:    ["← → ↑ ↓ or WASD to move", "Eat food to grow", "Don't hit walls or yourself", "Speed increases as you grow"],
      flappy:   ["Click or SPACE to flap", "Don't touch the pipes", "Each pipe passed = +1 point", "Tap rhythm is key!"],
      memory:   ["Click cards to flip them", "Find all matching pairs", "Fewer moves = higher score", "You have 60 seconds!"],
      reaction: ["Click the glowing target", "DON'T click too early!", "Faster reaction = more points", "8 rounds total"],
      tetris:   ["← → move  ↑ rotate", "↓ soft drop  SPACE hard drop", "Clear lines for big points", "Multiple lines = combo bonus"],
    },
    admin: {
      title: "ADMIN PANEL", users: "USERS", stats: "STATS", manage: "MANAGE",
      totalUsers: "Total Users", totalGames: "Games Played", topScore: "Highest Score",
      banUser: "BAN", unbanUser: "UNBAN", banned: "BANNED", resetScore: "RESET SCORES",
      announce: "BROADCAST MESSAGE", announceBtn: "SEND", announcePlaceholder: "Message to all players...",
      msgSent: "✓ Message broadcast!", cols: { user: "USER", role: "ROLE", score: "TOTAL SCORE", status: "STATUS", actions: "ACTIONS" },
      motd: "MESSAGE OF THE DAY",
    },
    motd: "",
    gameDesc: {
      snake: "Classic snake. Eat, grow, survive.",
      flappy: "Dodge the pillars. Don't crash.",
      memory: "Match the pairs. Train your brain.",
      reaction: "Hit the target. Test your reflexes.",
      tetris: "Stack the blocks. Clear the lines.",
    },
    gameNames: { snake: "SNAKE", flappy: "FLAPPY", memory: "MEMORY", reaction: "REFLEX", tetris: "TETRIS" },
    profile: {
      title: "PLAYER PROFILE", editBio: "Write something about yourself...", saveBio: "SAVE", bioLabel: "BIO",
      statsTitle: "STATISTICS", totalScore: "TOTAL SCORE", gamesPlayed: "GAMES PLAYED",
      rank: "GLOBAL RANK", bestGame: "BEST GAME", winRate: "AVG / GAME",
      recordsTitle: "PERSONAL RECORDS", achievementsTitle: "ACHIEVEMENTS",
      noRecord: "—", changeAvatar: "AVATAR", avatarTitle: "CHOOSE AVATAR",
      achievements: {
        first_game:   { name:"First Blood",     desc:"Play your first game",           icon:"🎮" },
        score_1000:   { name:"Four Digits",     desc:"Score 1000+ in any game",        icon:"💯" },
        score_5000:   { name:"High Roller",     desc:"Score 5000+ in any game",        icon:"🔥" },
        all_games:    { name:"Completionist",   desc:"Play all 5 games",               icon:"⭐" },
        top3:         { name:"Podium Finish",   desc:"Reach top 3 on leaderboard",     icon:"🏆" },
        ten_games:    { name:"Grinder",         desc:"Play 10+ total games",           icon:"⚡" },
        snake_master: { name:"Snake Master",    desc:"Score 1000+ in Snake",           icon:"🐍" },
        tetris_god:   { name:"Tetris God",      desc:"Score 3000+ in Tetris",          icon:"🧩" },
        memory_ace:   { name:"Memory Ace",      desc:"Score 500+ in Memory",           icon:"🧠" },
        speedster:    { name:"Speedster",       desc:"React under 200ms in Reflex",    icon:"💨" },
      },
    },
  },
  ru: {
    appName: "АРКАД ВОЛТ",
    nav: { arcade: "АРКАДА", rankings: "РЕЙТИНГ", admin: "АДМИН", profile: "ПРОФИЛЬ" },
    auth: {
      signIn: "ВОЙТИ", signUp: "РЕГИСТРАЦИЯ", logout: "ВЫЙТИ",
      username: "Имя пользователя", password: "Пароль", confirmPassword: "Повторите пароль",
      noAccount: "Нет аккаунта?", hasAccount: "Уже есть аккаунт?",
      loginBtn: "ВОЙТИ В ИГРУ", registerBtn: "СОЗДАТЬ АККАУНТ",
      error: { badLogin: "Неверный логин или пароль.", passMismatch: "Пароли не совпадают.", shortUser: "Имя: минимум 3 символа.", takenName: "Имя уже занято.", shortPass: "Пароль: минимум 6 символов.", adminForbidden: "Нельзя зарегистрироваться как администратор." },
      tagline: "Соревнуйся. Побеждай. Стань легендой.",
    },
    home: {
      welcome: "ДОБРО ПОЖАЛОВАТЬ В", playAs: "ИГРАЕШЬ КАК", setBefore: "ВОЙДИТЕ ЧТОБЫ ИГРАТЬ", topPlayers: "◈ ЛУЧШИЕ ИГРОКИ",
      callsign: "ВВЕДИТЕ ИМЯ", go: "ОК", best: "РЕКОРД",
    },
    leaderboard: { title: "◈ ЗАЛ СЛАВЫ ◈", rank: "МЕСТО", player: "ИГРОК", score: "ОЧКИ", bar: "ПРОГРЕСС", overall: "ОБЩИЙ" },
    game: { back: "◄ НАЗАД", player: "ИГРОК", finalScore: "СЧЁТ", saveScore: "◈ СОХРАНИТЬ", saved: "✓ СОХРАНЕНО!", playAgain: "ЕЩЁ РАЗ", gameOver: "ИГРА ОКОНЧЕНА" },
    hints: {
      snake:    ["← → ↑ ↓ или WASD для движения", "Ешь еду — становись длиннее", "Не врезайся в стены и себя", "Скорость растёт с длиной"],
      flappy:   ["Клик или ПРОБЕЛ — взмах крыльями", "Не задевай трубы", "Каждая труба = +1 очко", "Ритм — залог успеха!"],
      memory:   ["Кликай на карточки чтобы открыть", "Найди все пары", "Меньше ходов = больше очков", "У тебя 60 секунд!"],
      reaction: ["Кликай на светящуюся мишень", "НЕ кликай слишком рано!", "Быстрее реакция = больше очков", "Всего 8 раундов"],
      tetris:   ["← → двигать  ↑ повернуть", "↓ ускорить  ПРОБЕЛ — сбросить", "Заполняй линии для очков", "Несколько линий = бонус"],
    },
    admin: {
      title: "ПАНЕЛЬ АДМИНИСТРАТОРА", users: "ПОЛЬЗОВАТЕЛИ", stats: "СТАТИСТИКА", manage: "УПРАВЛЕНИЕ",
      totalUsers: "Всего игроков", totalGames: "Сыграно игр", topScore: "Рекорд",
      banUser: "БАНИ", unbanUser: "РАЗБАНЬ", banned: "ЗАБЛОКИРОВАН", resetScore: "СБРОС ОЧКОВ",
      announce: "ОБЪЯВЛЕНИЕ", announceBtn: "ОТПРАВИТЬ", announcePlaceholder: "Сообщение всем игрокам...",
      msgSent: "✓ Сообщение отправлено!", cols: { user: "ИГРОК", role: "РОЛЬ", score: "ОБЩИЙ СЧЁТ", status: "СТАТУС", actions: "ДЕЙСТВИЯ" },
      motd: "СООБЩЕНИЕ ДНЯ",
    },
    motd: "",
    gameDesc: {
      snake: "Классическая змейка. Ешь, расти, выживай.",
      flappy: "Уклоняйся от труб. Не разбейся.",
      memory: "Найди пары. Тренируй память.",
      reaction: "Бей по цели. Проверь реакцию.",
      tetris: "Складывай блоки. Убирай линии.",
    },
    gameNames: { snake: "ЗМЕЙКА", flappy: "ФЛАППИ", memory: "ПАМЯТЬ", reaction: "РЕФЛЕКС", tetris: "ТЕТРИС" },
    profile: {
      title: "ПРОФИЛЬ ИГРОКА", editBio: "Напишите о себе...", saveBio: "СОХРАНИТЬ", bioLabel: "О СЕБЕ",
      statsTitle: "СТАТИСТИКА", totalScore: "ОБЩИЙ СЧЁТ", gamesPlayed: "ИГР СЫГРАНО",
      rank: "МЕСТО В РЕЙТИНГЕ", bestGame: "ЛУЧШАЯ ИГРА", winRate: "СРЕДНЕЕ / ИГРА",
      recordsTitle: "ЛИЧНЫЕ РЕКОРДЫ", achievementsTitle: "ДОСТИЖЕНИЯ",
      noRecord: "—", changeAvatar: "АВАТАР", avatarTitle: "ВЫБРАТЬ АВАТАР",
      achievements: {
        first_game:   { name:"Первая кровь",    desc:"Сыграй первую партию",             icon:"🎮" },
        score_1000:   { name:"Четыре цифры",    desc:"Набери 1000+ в любой игре",        icon:"💯" },
        score_5000:   { name:"Хай Роллер",      desc:"Набери 5000+ в любой игре",        icon:"🔥" },
        all_games:    { name:"Перфекционист",   desc:"Сыграй во все 5 игр",              icon:"⭐" },
        top3:         { name:"Пьедестал",       desc:"Войди в топ-3 рейтинга",           icon:"🏆" },
        ten_games:    { name:"Задрот",          desc:"Сыграй 10+ партий",                icon:"⚡" },
        snake_master: { name:"Мастер Змейки",   desc:"1000+ в Змейке",                   icon:"🐍" },
        tetris_god:   { name:"Бог Тетриса",     desc:"3000+ в Тетрисе",                  icon:"🧩" },
        memory_ace:   { name:"Память Слона",    desc:"500+ в Памяти",                    icon:"🧠" },
        speedster:    { name:"Молния",          desc:"Реакция менее 200ms в Рефлексе",   icon:"💨" },
      },
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#060612; --bg2:#0c0c20; --bg3:#111128; --card:#12122a;
      --border:#1e1e4a; --cyan:#00f5ff; --magenta:#ff00aa;
      --yellow:#ffe500; --green:#00ff88; --orange:#ff6b00; --red:#ff3355;
      --text:#e8e8ff; --muted:#5a5a8a;
      --font-hd:'Orbitron',monospace; --font-body:'Exo 2',sans-serif;
    }
    html,body,#root{height:100%;}
    body{font-family:var(--font-body);background:var(--bg);color:var(--text);overflow-x:hidden;}
    ::-webkit-scrollbar{width:6px;} ::-webkit-scrollbar-track{background:var(--bg2);} ::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}
    button{font-family:var(--font-body);cursor:pointer;border:none;background:none;}
    canvas{display:block;}
    .scanline{position:fixed;inset:0;pointer-events:none;z-index:9999;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);}
    input{font-family:var(--font-body);}
    @keyframes flicker{0%,100%{opacity:1}92%{opacity:.97}94%{opacity:.9}96%{opacity:.97}}
    @keyframes glow-pulse{0%,100%{text-shadow:0 0 10px currentColor,0 0 20px currentColor}50%{text-shadow:0 0 20px currentColor,0 0 40px currentColor,0 0 60px currentColor}}
    @keyframes slide-up{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes slide-in-left{from{transform:translateX(-40px);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes pop-in{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
    @keyframes hint-slide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes banner-in{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
    @media (max-width: 480px) {
      .nav-label { display: none; }
      .header-inner { gap: 6px !important; padding: 8px 10px !important; }
    }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════════
const SEED_SCORES = [
  { name:"CYBER_ACE",  scores:{snake:1840,flappy:520,memory:1200,reaction:980,tetris:3200} },
  { name:"NEON_WOLF",  scores:{snake:1420,flappy:380,memory:900, reaction:1100,tetris:2800} },
  { name:"VOID_ZERO",  scores:{snake:980, flappy:290,memory:750, reaction:850, tetris:2100} },
  { name:"GLITCH_X",   scores:{snake:760, flappy:210,memory:600, reaction:720, tetris:1600} },
  { name:"GRID_RUNNER",scores:{snake:540, flappy:160,memory:480, reaction:590, tetris:1200} },
];
const SEED_USERS = [
  { username:"CYBER_ACE",  password:"ace123",   role:"user",  banned:false, totalGamesPlayed:42 },
  { username:"NEON_WOLF",  password:"wolf456",  role:"user",  banned:false, totalGamesPlayed:35 },
  { username:"VOID_ZERO",  password:"void789",  role:"user",  banned:false, totalGamesPlayed:28 },
  { username:"GLITCH_X",   password:"glitch1",  role:"user",  banned:true,  totalGamesPlayed:17 },
  { username:"GRID_RUNNER",password:"grid999",  role:"user",  banned:false, totalGamesPlayed:22 },
];

const GAMES_META = [
  { id:"snake",    color:"var(--green)"   },
  { id:"flappy",   color:"var(--cyan)"    },
  { id:"memory",   color:"var(--magenta)" },
  { id:"reaction", color:"var(--yellow)"  },
  { id:"tetris",   color:"var(--orange)"  },
];

const computeTotal = s => Object.values(s).reduce((a,b)=>a+b,0);
const clamp = (v,mn,mx) => Math.min(Math.max(v,mn),mx);

// ═══════════════════════════════════════════════════════════════
// PIXEL ART ICONS  — hand-drawn 16×16 pixel grids
// Each icon is defined as a compact string: each char = 1 pixel
// '.' = transparent, any other char maps to a color slot
// ═══════════════════════════════════════════════════════════════

// Palette keys per icon: a=primary, b=secondary, c=accent, d=dark, e=light
const PIXEL_ICONS = {

  // 🐍 Snake — green snake head facing right, body segments
  snake: {
    size: 16,
    palette: { a:'#00ff88', b:'#00c860', c:'#005a30', d:'#ff4466', e:'#ffffff' },
    rows: [
      '................',
      '................',
      '....bbbb........',
      '...bbaaab.......',
      '..bbaaaaab......',
      '..baaaaaaeb.....',
      '..baaaaaaab.....',
      '..baaaadaab.....',
      '..bbaaaaaab.....',
      '...bbaaaaabb....',
      '....bbbbbbbb....',
      '.....bbbbbbb....',
      '......bbbbbb....',
      '.......bbbbb....',
      '................',
      '................',
    ]
  },

  // 🚀 Flappy — rocket ship
  flappy: {
    size: 16,
    palette: { a:'#00f5ff', b:'#0088aa', c:'#ffffff', d:'#ff6b00', e:'#ffdd00' },
    rows: [
      '......aaa.......',
      '.....aaaaa......',
      '....aaacaaa.....',
      '....aaacaaa.....',
      '...aaacccaaa....',
      '...aaacccaaa....',
      '..baaaaaaaaab...',
      '..baaaaaaaaab...',
      '..baaaaaaaaab...',
      '..baabbbbbabb...',
      '...bbbdddbbbb...',
      '....bddddddb....',
      '....bdeeedb.....',
      '.....bdddb......',
      '......bbb.......',
      '................',
    ]
  },

  // 🧠 Memory — card with question mark
  memory: {
    size: 16,
    palette: { a:'#ff00aa', b:'#aa0066', c:'#ffffff', d:'#ffaadd', e:'#ff66cc' },
    rows: [
      '................',
      '..bbbbbbbbbbbb..',
      '..baaaaaaaaaab..',
      '..baaaaaaaaaab..',
      '..baaacccccaab..',
      '..baaacaaaacab..',
      '..baaaaaacaaab..',
      '..baaaacaaaab...',
      '..baaaacaaaab...',
      '..baaaaaaaaab...',
      '..baaacaaaacab..',  // two cards side by side effect
      '..baaacccccaab..',
      '..baaaaaaaaaab..',
      '..baaaaaaaaaab..',
      '..bbbbbbbbbbbb..',
      '................',
    ]
  },

  // ⚡ Reaction — lightning bolt
  reaction: {
    size: 16,
    palette: { a:'#ffe500', b:'#aa9900', c:'#ffffff', d:'#ff9900', e:'#fff8aa' },
    rows: [
      '........aaa.....',
      '.......aaaa.....',
      '......aaaaa.....',
      '.....aaaaaa.....',
      '....aaaaaaa.....',
      '...aaaaaaaaa....',
      '..aaaaaaaaaa....',
      '.aaaaaaaaaaa....',
      '....aaaaaaa.....',
      '....aaaaaa......',
      '....aaaaa.......',
      '....aaaa........',
      '....aaa.........',
      '....aa..........',
      '....a...........',
      '................',
    ]
  },

  // 🧩 Tetris — T-piece + L-piece
  tetris: {
    size: 16,
    palette: { a:'#ff6b00', b:'#cc4400', c:'#00f5ff', d:'#0088aa', e:'#ffffff' },
    rows: [
      '................',
      '..aaaaaa........',
      '..aaaaaa........',
      '..aaaaaa........',
      '..aaaaaaaaaaaa..',
      '..aaaaaaaaaaaa..',
      '..aaaaaaaaaaaa..',
      '........cccccc..',
      '........cccccc..',
      '........cccccc..',
      '........cccccc..',
      '........cccccc..',
      '........cccccc..',
      '................',
      '................',
      '................',
    ]
  },

  // ── ACHIEVEMENT ICONS ──

  // 🎮 first_game — game controller
  gamepad: {
    size: 16,
    palette: { a:'#8888bb', b:'#555588', c:'#ffffff', d:'#ff4466', e:'#00f5ff' },
    rows: [
      '................',
      '................',
      '..bbbbbbbbbbbb..',
      '.baaaaaaaaaaaaab',
      'baaabaaaaaadaaab',
      'baaabaaaaaadaaab',
      'babbbaaaaadddaab',
      'baaabaaaaaadaaab',
      'baaabaaaaaadaaab',
      '.baaaaaaaaaaaaab',
      '..bbbbbbbbbbbb..',
      '................',
      '................',
      '................',
      '................',
      '................',
    ]
  },

  // 💯 score_1000 — "100" digits
  hundred: {
    size: 16,
    palette: { a:'#ffe500', b:'#aa9900', c:'#ffffff', d:'#ffaa00', e:'#fff8aa' },
    rows: [
      '................',
      '..aa.aaaa.aaaa..',
      '..aa.a..a.a..a..',
      '..aa.a..a.a..a..',
      '..aa.a..a.a..a..',
      '..aa.aaaa.aaaa..',
      '................',
      '....aaaa.aaaa...',
      '....a..a.a..a...',
      '....a..a.a..a...',
      '....a..a.a..a...',
      '....aaaa.aaaa...',
      '................',
      '................',
      '................',
      '................',
    ]
  },

  // 🔥 score_5000 — flame
  fire: {
    size: 16,
    palette: { a:'#ff6b00', b:'#ff0000', c:'#ffdd00', d:'#ff3300', e:'#ffffff' },
    rows: [
      '......ccc.......',
      '.....ccccc......',
      '....ccaacc......',
      '....caaaac......',
      '...caaaaac......',
      '...caaaaac......',
      '..caaaaaac.ccc..',
      '..caaaaaaaaccc..',
      '..caaaaaaaaac...',
      '..caaaaaaaac....',
      '...caaaaaaaac...',
      '....caaaaaac....',
      '.....caaaaac....',
      '......caaac.....',
      '.......ccc......',
      '................',
    ]
  },

  // ⭐ all_games — star
  star: {
    size: 16,
    palette: { a:'#ffe500', b:'#cc9900', c:'#ffffff', d:'#fff8aa', e:'#ffaa00' },
    rows: [
      '................',
      '.......aa.......',
      '.......aa.......',
      '..aa..aaaa..aa..',
      '...aaaaaaaaa....',
      '....aaaaaaaa....',
      '.....aaaaaa.....',
      '....aaaaaaaa....',
      '...aa.aaaa.aa...',
      '..aa...aa...aa..',
      '.aa....aa....aa.',
      '...............a',
      '................',
      '................',
      '................',
      '................',
    ]
  },

  // 🏆 top3 — trophy
  trophy: {
    size: 16,
    palette: { a:'#ffe500', b:'#aa8800', c:'#ffffff', d:'#ffcc00', e:'#fff8aa' },
    rows: [
      '................',
      '.baaaaaaaaaaaab.',
      '.baaaaaaaaaaaab.',
      '.baaaaaaaaaaaab.',
      'bbaaaaaaaaaaaaabb',
      'bbaaaaaaaaaaaaaab',
      '.baaaaaaaaaaaab.',
      '..baaaaaaaaab...',
      '...baaaaaab.....',
      '....bbaaabb.....',
      '.....baaab......',
      '.....baaab......',
      '....bbbbbbb.....',
      '....bbbbbbb.....',
      '................',
      '................',
    ]
  },

  // ⚡ ten_games — bolt (reuse reaction palette)
  bolt: {
    size: 16,
    palette: { a:'#00f5ff', b:'#0088aa', c:'#ffffff', d:'#aaffff', e:'#004455' },
    rows: [
      '................',
      '.....aaaa.......',
      '....aaaaa.......',
      '...aaaaaaa......',
      '..aaaaaaaaa.....',
      '.aaaaaaaaaa.....',
      'aaaaaaaaaaa.....',
      '....aaaaaaa.....',
      '....aaaaaa......',
      '....aaaaa.......',
      '....aaaa........',
      '....aaa.........',
      '....aa..........',
      '....a...........',
      '................',
      '................',
    ]
  },

  // 🐍 snake_master — snake (reuse)
  snakeMaster: {
    size: 16,
    palette: { a:'#00ff88', b:'#00c860', c:'#005a30', d:'#ff4466', e:'#ffffff' },
    rows: [
      '................',
      '....bbbb........',
      '...bbaaab.......',
      '..bbaaaaab......',
      '..baaaaaaeb.....',
      '..baaaaaaab.....',
      '..baaaadaab.....',
      '..bbaaaaaab.....',
      '...bbaaaaabb....',
      '....bbbbbbbb....',
      '.....bbbbbbb....',
      '......bbbbbb....',
      '.......bbbbb....',
      '................',
      '................',
      '................',
    ]
  },

  // 🧩 tetris_god — tetris piece with crown
  tetrisGod: {
    size: 16,
    palette: { a:'#ff6b00', b:'#cc4400', c:'#ffe500', d:'#ffcc00', e:'#ffffff' },
    rows: [
      '................',
      '.c.....c.....c..',
      '.cc...ccc...cc..',
      '.ccc.ccccc.ccc..',
      '.cccccccccccc...',
      '................',
      '..aaaaaa........',
      '..aaaaaa........',
      '..aaaaaaaaaaaa..',
      '..aaaaaaaaaaaa..',
      '..aaaaaaaaaaaa..',
      '........aaaaaa..',
      '........aaaaaa..',
      '................',
      '................',
      '................',
    ]
  },

  // 🧠 memory_ace — brain outline
  brainAce: {
    size: 16,
    palette: { a:'#ff00aa', b:'#aa0066', c:'#ffffff', d:'#ff66cc', e:'#ffaadd' },
    rows: [
      '................',
      '....bbbbbbb.....',
      '...baaaaaaab....',
      '..baaabaaaab....',
      '..baaabaaaab....',
      '..baaaaaaaab....',
      '..baaabaaaab....',
      '..baaabaaaab....',
      '..baaaaaaaab....',
      '..baaabaaaab....',
      '..baaabaaaab....',
      '...baaaaaaab....',
      '....bbbbbbb.....',
      '................',
      '................',
      '................',
    ]
  },

  // 💨 speedster — speed lines + circle
  speed: {
    size: 16,
    palette: { a:'#ffffff', b:'#aaaaaa', c:'#00f5ff', d:'#0088aa', e:'#555555' },
    rows: [
      '................',
      'bbbbbbbb........',
      '................',
      'bbbbbbbbbb......',
      '..........cccc..',
      'bbbbbbbbbbbcccb.',
      'bbbbbbbbbbbcccb.',
      'bbbbbbbbbb.cccc.',
      'bbbbbbbbbb......',
      'bbbbbbbbbb......',
      '................',
      'bbbbbbbbbb......',
      '................',
      'bbbbbbbb........',
      '................',
      '................',
    ]
  },

  // ── AVATAR PIXEL ICONS ──
  robot:    {
    size:16,
    palette:{a:'#8888ff',b:'#4444cc',c:'#ffffff',d:'#ff4466',e:'#ffdd00'},
    rows:[
      '................',
      '....bbbbbbbb....',
      '...baaaaaaab....',
      '...baceaaecab...',  // eyes
      '...baaaaaaab....',
      '...bdddddddab...',  // mouth
      '...baaaaaaab....',
      '..bbbbbbbbbbbb..',
      '.baaaaaaaaaaaaab',
      '.baaaaaaaaaaaaab',
      '.baaaaaaaaaaaaab',
      '..bbbbbbbbbbbb..',
      '....bbaa.aabb...',
      '....bbaa.aabb...',
      '................',
      '................',
    ]
  },
  crown:    {
    size:16,
    palette:{a:'#ffe500',b:'#aa8800',c:'#ff4466',d:'#00f5ff',e:'#ffffff'},
    rows:[
      '................',
      'a....a....a.....',
      'aa...aa...aa....',
      'aaa.aaaa.aaa....',
      'aaaaaaaaaaa.....',
      'aaaaaaaaaaa.....',
      'acaaadaaaaca....',
      'aaaaaaaaaaa.....',
      'aaaaaaaaaaa.....',
      'aaaaaaaaaaa.....',
      '.aaaaaaaaa......',
      '..aaaaaaa.......',
      '................',
      '................',
      '................',
      '................',
    ]
  },
  skull:    {
    size:16,
    palette:{a:'#ddddee',b:'#888899',c:'#060612',d:'#aaaacc',e:'#ffffff'},
    rows:[
      '................',
      '....bbbbbb......',
      '...baaaaaab.....',
      '..baaaaaaab.....',
      '..bacaaacab.....',  // eyes
      '..baaaaaaab.....',
      '..baaaaaaab.....',
      '..bbabababbb....',
      '...baaaaaab.....',
      '...bbbbbbb......',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
    ]
  },
  alien:    {
    size:16,
    palette:{a:'#00ff88',b:'#005a30',c:'#ffffff',d:'#ff00aa',e:'#ffff00'},
    rows:[
      '................',
      '.....bbbbbb.....',
      '....baaaaaab....',
      '...baaaaaaab....',
      '...baceaaecab...',
      '...baaaaaaab....',
      '...baaaaaaaab...',
      '....bbbbbbbbb...',
      '...bababababab..',
      '..ba.a.a.a.a.ab.',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
    ]
  },
  ninja:    {
    size:16,
    palette:{a:'#222244',b:'#000011',c:'#ff4466',d:'#ffffff',e:'#aaaacc'},
    rows:[
      '................',
      '....bbbbbb......',
      '...bbbbbbbb.....',
      '..bbbbbbbbb.....',
      '..bbbddbbbbb....',
      '..bbbbbbbbbbb...',
      '...bbbbbbbbbb...',
      '....bbbbbbb.....',
      '..bbbbbbbbbbb...',
      '.baaabbbbbaaab..',
      '.baaabbbbbaaab..',
      '..baaabbbaaab...',
      '...bbbbbbbbb....',
      '....bbbbbbb.....',
      '................',
      '................',
    ]
  },
  dragon:   {
    size:16,
    palette:{a:'#ff6b00',b:'#cc3300',c:'#ffdd00',d:'#00ff88',e:'#ffffff'},
    rows:[
      '................',
      '..bb....bb......',
      '.bab....bab.....',
      'baaab..baaab....',
      '.baaabbaaab.....',
      '..baaaaaab......',
      '...baaaab.......',
      '..baaaaaab......',
      '.baaacaaaab.....',
      'baaaacaaaaab....',
      '.baaacaaaab.....',
      '..baaaaaaab.....',
      '...bbbbbbb......',
      '......bbb.......',
      '................',
      '................',
    ]
  },
  wizard:   {
    size:16,
    palette:{a:'#a855f7',b:'#6b21a8',c:'#ffe500',d:'#ffffff',e:'#ffaaff'},
    rows:[
      '......aaa.......',
      '.....aaaaa......',
      '....aaaaaaa.....',
      '...aaaaaaaaaa...',
      '..aaaaaaaaaaaaa.',
      '..aacaaaaaacaa..',
      '..aaaaaaaaaaa...',
      '..aaadaaaaaaa...',
      '..aaaaaaaaaaaa..',
      '...aaaaaaaaaa...',
      '....aaaaaaaa....',
      '.....aaaaaa.....',
      '......aaaa......',
      '.......aa.......',
      '................',
      '................',
    ]
  },
  knight:   {
    size:16,
    palette:{a:'#c0c0c0',b:'#888888',c:'#ffe500',d:'#ffffff',e:'#444444'},
    rows:[
      '................',
      '....bbbbbb......',
      '...baaaaaab.....',
      '..baaaaaaab.....',
      '..badaaadab.....',
      '..baaaaaab......',
      '..baaaaaaab.....',
      '..bbaaaaabb.....',
      '...bbbbbbb......',
      '..baaaaaaab.....',
      '..baaaaaaab.....',
      '..baaaaaaab.....',
      '...bbbbbbbb.....',
      '................',
      '................',
      '................',
    ]
  },
  cat:      {
    size:16,
    palette:{a:'#ffaa44',b:'#cc6600',c:'#ffffff',d:'#ff4466',e:'#ffeecc'},
    rows:[
      '................',
      '.bb........bb...',
      '.bab......bab...',
      '.baab....baab...',
      '..bbbbbbbbb.....',
      '..baeaaaeab.....',
      '..baaeaaaeab....',
      '..baaaaaaaaab...',
      '..baadaaadaab...',
      '..baaaaaaaaaab..',
      '...bbaaaaaaabb..',
      '....bbbbbbbb....',
      '................',
      '................',
      '................',
      '................',
    ]
  },
  ghost:    {
    size:16,
    palette:{a:'#eeeeff',b:'#aaaacc',c:'#060612',d:'#ff4466',e:'#ffffff'},
    rows:[
      '................',
      '.....bbbbb......',
      '....baaaabb.....',
      '...baaaaaab.....',
      '...bacaacab.....',
      '...baaaaaaab....',
      '...baaaaaaab....',
      '...baaaaaaab....',
      '...baaaaaaab....',
      '...bababababab..',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
    ]
  },
  fire2:    {
    size:16,
    palette:{a:'#ff6b00',b:'#ff0000',c:'#ffdd00',d:'#ff3300',e:'#ffffff'},
    rows:[
      '......ccc.......',
      '.....ccccc......',
      '....ccaacc......',
      '....caaaaac.....',
      '...caaaaaaaac...',
      '...caaaaaaaac...',
      '..caaaaaaaaac...',
      '..caaaaaaaaaaac.',
      '..caaaaaaaaac...',
      '..caaaaaaaac....',
      '...caaaaaaaac...',
      '....caaaaaac....',
      '.....caaaaac....',
      '......caaac.....',
      '.......ccc......',
      '................',
    ]
  },
  gem:      {
    size:16,
    palette:{a:'#00f5ff',b:'#0088aa',c:'#ffffff',d:'#aaffff',e:'#004455'},
    rows:[
      '................',
      '.....bbbbb......',
      '....baaaabb.....',
      '...baaacaaab....',
      '..baaacccaaab...',
      '.baaacccccaaab..',
      '.baacccccccaab..',
      '..baaccccaab....',
      '...baaccab......',
      '....baab........',
      '.....bb.........',
      '................',
      '................',
      '................',
      '................',
      '................',
    ]
  },
  moon:     {
    size:16,
    palette:{a:'#ffe500',b:'#aa9900',c:'#ffffff',d:'#fff8aa',e:'#ffcc00'},
    rows:[
      '................',
      '.....bbbbb......',
      '....baaaaaab....',
      '...baaaaaaab....',
      '...baaaaaab.....',
      '...baaaaaab.....',
      '...baaaaaab.....',
      '...baaaaaab.....',
      '...baaaaaaab....',
      '....baaaaaab....',
      '.....bbbbb......',
      '................',
      '................',
      '................',
      '................',
      '................',
    ]
  },
  target:   {
    size:16,
    palette:{a:'#ff4466',b:'#cc0033',c:'#ffffff',d:'#ffaaaa',e:'#000000'},
    rows:[
      '................',
      '.....bbbbb......',
      '....baaaaaab....',
      '...baacccaab....',
      '...bacaaaacab...',
      '...bacabacab....',
      '...bacaaacab....',
      '...bacaaacab....',
      '...bacabacab....',
      '...bacaaaacab...',
      '...baacccaab....',
      '....baaaaaab....',
      '.....bbbbb......',
      '................',
      '................',
      '................',
    ]
  },
  heart:    {
    size:16,
    palette:{a:'#ff4466',b:'#cc0033',c:'#ffffff',d:'#ff99aa',e:'#ffccdd'},
    rows:[
      '................',
      '...bbb...bbb....',
      '..baaab.baaab...',
      '.baaaaaaaaab....',
      '.baaaaaaaaab....',
      '.baaaaaaaaab....',
      '..baaaaaaaaab...',
      '...baaaaaab.....',
      '....baaaaab.....',
      '.....baaab......',
      '......bab.......',
      '.......b........',
      '................',
      '................',
      '................',
      '................',
    ]
  },
};

// Render a pixel icon as an inline SVG
function PixelIcon({ id, size = 32, color, style = {} }) {
  const icon = PIXEL_ICONS[id];
  if (!icon) return <span style={{ fontSize: size * 0.6, ...style }}>■</span>;

  const scale = size / icon.size;
  const palette = { ...icon.palette };
  // Override primary color 'a' if color prop provided
  if (color) {
    // convert CSS var to hex
    const varMap = {
      'var(--green)': '#00ff88', 'var(--cyan)': '#00f5ff',
      'var(--magenta)': '#ff00aa', 'var(--yellow)': '#ffe500',
      'var(--orange)': '#ff6b00', 'var(--red)': '#ff3355',
    };
    palette.a = varMap[color] || color;
  }

  const pixels = [];
  icon.rows.forEach((row, ry) => {
    for (let cx = 0; cx < row.length && cx < icon.size; cx++) {
      const ch = row[cx];
      if (ch === '.' || ch === ' ') continue;
      const fill = palette[ch] || '#ffffff';
      pixels.push(
        <rect key={`${ry}-${cx}`}
          x={cx * scale} y={ry * scale}
          width={scale} height={scale}
          fill={fill}
        />
      );
    }
  });

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ imageRendering: 'pixelated', display: 'inline-block', flexShrink: 0, ...style }}
    >
      {pixels}
    </svg>
  );
}

// Animated pixel icon with optional float/glow
function PixelIconAnimated({ id, size = 32, color, animate = false, glow = false, style = {} }) {
  const varMap = {
    'var(--green)': '#00ff88', 'var(--cyan)': '#00f5ff',
    'var(--magenta)': '#ff00aa', 'var(--yellow)': '#ffe500',
    'var(--orange)': '#ff6b00', 'var(--red)': '#ff3355',
  };
  const hex = varMap[color] || color || '#ffffff';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      animation: animate ? 'float 2s ease-in-out infinite' : 'none',
      filter: glow ? `drop-shadow(0 0 6px ${hex}) drop-shadow(0 0 12px ${hex}60)` : 'none',
      ...style
    }}>
      <PixelIcon id={id} size={size} color={color} />
    </div>
  );
}

// Map game ID → pixel icon ID
const GAME_PIXEL_ICON = {
  snake: 'snake', flappy: 'flappy', memory: 'memory',
  reaction: 'reaction', tetris: 'tetris',
};
// Map achievement key → pixel icon ID
const ACH_PIXEL_ICON = {
  first_game: 'gamepad', score_1000: 'hundred', score_5000: 'fire',
  all_games: 'star', top3: 'trophy', ten_games: 'bolt',
  snake_master: 'snakeMaster', tetris_god: 'tetrisGod',
  memory_ace: 'brainAce', speedster: 'speed',
};
// Avatar pixel icon list
const AVATAR_PIXEL_IDS = ['robot','crown','skull','alien','ninja','dragon','wizard','knight','cat','ghost','fire2','gem','moon','target','heart','snake'];

// ═══════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════
function NeonText({children,color="var(--cyan)",size="1rem",pulse=false,style={}}) {
  return <span style={{fontFamily:"var(--font-hd)",fontSize:size,fontWeight:700,color,
    textShadow:`0 0 8px ${color},0 0 16px ${color}`,
    animation:pulse?"glow-pulse 2s ease-in-out infinite":"none",letterSpacing:"0.05em",...style}}>{children}</span>;
}

function GlowButton({children,color="var(--cyan)",onClick,disabled,small,danger,full,style={}}) {
  const c = danger?"var(--red)":color;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:small?"7px 16px":full?"12px 0":"12px 28px",
      width:full?"100%":"auto",
      border:`1px solid ${c}`,borderRadius:4,background:`${c}18`,color:c,
      fontFamily:"var(--font-hd)",fontSize:small?"0.68rem":"0.82rem",fontWeight:700,
      letterSpacing:"0.1em",textTransform:"uppercase",transition:"all 0.2s",
      boxShadow:`0 0 12px ${c}40`,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.4:1,...style}}
      onMouseEnter={e=>{if(!disabled){e.currentTarget.style.background=`${c}35`;e.currentTarget.style.boxShadow=`0 0 20px ${c}80`;}}}
      onMouseLeave={e=>{e.currentTarget.style.background=`${c}18`;e.currentTarget.style.boxShadow=`0 0 12px ${c}40`;}}
    >{children}</button>
  );
}

function Card({children,color="var(--border)",glow=false,style={},onClick}) {
  return <div onClick={onClick} style={{background:"var(--card)",border:`1px solid ${color}`,borderRadius:8,padding:"20px",
    boxShadow:glow?`0 0 20px ${color}30,inset 0 0 20px ${color}08`:"none",
    transition:"all 0.25s",cursor:onClick?"pointer":"default",...style}}>{children}</div>;
}

function Input({label,type="text",value,onChange,placeholder,error}) {
  return (
    <div style={{marginBottom:16}}>
      {label && <div style={{fontFamily:"var(--font-hd)",fontSize:"0.65rem",color:"var(--muted)",letterSpacing:"0.15em",marginBottom:6}}>{label}</div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{width:"100%",padding:"10px 14px",background:"var(--bg2)",border:`1px solid ${error?"var(--red)":"var(--border)"}`,
          borderRadius:4,color:"var(--text)",fontFamily:"var(--font-hd)",fontSize:"0.82rem",outline:"none",letterSpacing:"0.05em",
          transition:"border-color 0.2s"}}
        onFocus={e=>e.target.style.borderColor="var(--cyan)"}
        onBlur={e=>e.target.style.borderColor=error?"var(--red)":"var(--border)"}
      />
      {error && <div style={{color:"var(--red)",fontSize:"0.7rem",marginTop:4,fontFamily:"var(--font-hd)"}}>{error}</div>}
    </div>
  );
}

function ScoreTag({value,color}) {
  return <span style={{fontFamily:"var(--font-hd)",fontSize:"0.9rem",fontWeight:700,color,
    textShadow:`0 0 8px ${color}`,background:`${color}18`,border:`1px solid ${color}40`,
    padding:"2px 10px",borderRadius:3}}>{value.toLocaleString()}</span>;
}

// ═══════════════════════════════════════════════════════════════
// HINT OVERLAY  (corner tooltip shown during gameplay)
// ═══════════════════════════════════════════════════════════════
function HintCorner({gameId, lang}) {
  const [open, setOpen] = useState(false);
  const hints = T[lang].hints[gameId] || [];
  return (
    <div style={{position:"absolute",top:8,right:8,zIndex:50}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:28,height:28,borderRadius:"50%",border:"1px solid var(--cyan)60",
        background:"rgba(6,6,18,0.85)",color:"var(--cyan)",fontSize:"0.8rem",
        fontFamily:"var(--font-hd)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 0 10px var(--cyan)40",transition:"all 0.2s"
      }}>?</button>
      {open && (
        <div style={{position:"absolute",top:34,right:0,width:220,background:"rgba(6,6,18,0.97)",
          border:"1px solid var(--cyan)60",borderRadius:6,padding:"12px 14px",
          animation:"hint-slide 0.2s both",boxShadow:"0 0 20px rgba(0,245,255,0.2)"}}>
          <div style={{fontFamily:"var(--font-hd)",fontSize:"0.62rem",color:"var(--cyan)",letterSpacing:"0.15em",marginBottom:8}}>
            {lang==="ru"?"ПОДСКАЗКИ":"CONTROLS"}
          </div>
          {hints.map((h,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:6}}>
              <span style={{color:"var(--cyan)",fontSize:"0.65rem",marginTop:1,flexShrink:0}}>▸</span>
              <span style={{color:"var(--muted)",fontSize:"0.72rem",lineHeight:1.4}}>{h}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LIQUID ETHER BACKGROUND  (WebGL fluid simulation)
// ═══════════════════════════════════════════════════════════════
function LiquidEtherBG() {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0 });
  const autoRef = useRef({ angle: 0, t: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;
    glRef.current = gl;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; gl.viewport(0, 0, canvas.width, canvas.height); };
    resize();
    window.addEventListener("resize", resize);

    // Track mouse
    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = 1.0 - (e.clientY - r.top) / r.height;
      mouseRef.current.vx = nx - mouseRef.current.x;
      mouseRef.current.vy = ny - mouseRef.current.y;
      mouseRef.current.x = nx;
      mouseRef.current.y = ny;
    };
    window.addEventListener("mousemove", onMove);

    // Vertex shader
    const vsrc = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    // Fragment shader — Navier-Stokes-inspired fluid with 3 color blobs
    const fsrc = `
      precision highp float;
      uniform vec2  u_res;
      uniform float u_time;
      uniform vec2  u_mouse;
      uniform vec2  u_mvel;

      // Simplex-like noise
      vec3 hash3(vec2 p) {
        vec3 q = vec3(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)),dot(p,vec2(419.2,371.9)));
        return fract(sin(q)*43758.5453);
      }
      float noise(vec2 p) {
        vec2 i=floor(p), f=fract(p);
        f=f*f*(3.0-2.0*f);
        float a=dot(hash3(i),vec3(1,0,0));
        float b=dot(hash3(i+vec2(1,0)),vec3(1,0,0));
        float c=dot(hash3(i+vec2(0,1)),vec3(1,0,0));
        float d=dot(hash3(i+vec2(1,1)),vec3(1,0,0));
        return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
      }
      float fbm(vec2 p) {
        float v=0.0, a=0.5;
        for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.1+vec2(1.7,9.2);a*=0.5;}
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        uv.y = 1.0 - uv.y;
        float ar = u_res.x / u_res.y;
        vec2 st = vec2(uv.x * ar, uv.y);

        float t = u_time * 0.5;

        // Mouse ripple distortion
        vec2 mst = vec2(u_mouse.x * ar, 1.0 - u_mouse.y);
        float mdist = length(st - mst);
        float ripple = exp(-mdist * 4.0) * sin(mdist * 18.0 - t * 6.0) * 0.04;
        vec2 mforce = u_mvel * exp(-mdist * 5.0) * 0.12;
        st += mforce + ripple * normalize(st - mst + 0.001);

        // 3 fluid blobs matching colors: #5227FF, #FF9FFC, #B19EEF
        vec2 b1 = vec2(0.3 + 0.35*sin(t*0.7 + fbm(st*1.2+t*0.3)*1.5),
                       0.5 + 0.3*cos(t*0.5 + fbm(st*1.1+t*0.2)*1.2));
        vec2 b2 = vec2(0.6 + 0.3*cos(t*0.6 + fbm(st*0.9+t*0.25)*1.8),
                       0.4 + 0.35*sin(t*0.8 + fbm(st*1.3+t*0.35)*1.0));
        vec2 b3 = vec2(0.5 + 0.4*sin(t*0.4 + 1.2 + fbm(st*1.0+t*0.15)*1.3),
                       0.6 + 0.3*cos(t*0.9 + 0.8 + fbm(st*0.8+t*0.4)*1.6));

        b1 = vec2(b1.x * ar, b1.y);
        b2 = vec2(b2.x * ar, b2.y);
        b3 = vec2(b3.x * ar, b3.y);

        float d1 = 1.0 / (length(st - b1) * 3.5 + 0.001);
        float d2 = 1.0 / (length(st - b2) * 3.5 + 0.001);
        float d3 = 1.0 / (length(st - b3) * 3.5 + 0.001);
        float total = d1 + d2 + d3;
        float w1 = d1/total, w2 = d2/total, w3 = d3/total;

        // Target colors
        vec3 c1 = vec3(0.322, 0.153, 1.000); // #5227FF
        vec3 c2 = vec3(1.000, 0.624, 0.988); // #FF9FFC
        vec3 c3 = vec3(0.694, 0.620, 0.937); // #B19EEF

        vec3 col = c1*w1 + c2*w2 + c3*w3;

        // Turbulence overlay
        float turb = fbm(st*2.5 - t*0.4) * 0.18;
        col = mix(col, col*1.4, turb);

        // Metaball threshold glow
        float meta = smoothstep(0.55, 0.75, (d1+d2+d3)*0.18);
        col = mix(col * 0.6, col, meta);
        col += vec3(0.08, 0.04, 0.18) * (1.0 - meta);

        // Vignette
        float vig = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.6);
        col *= vig;

        // Subtle scanline shimmer
        float scan = 0.97 + 0.03*sin(uv.y*u_res.y*0.5);
        col *= scan;

        // Darken overall to keep it as background
        col *= 0.72;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uMvel  = gl.getUniformLocation(prog, "u_mvel");

    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      // Auto-demo: cursor drifts in a lissajous pattern
      const a = autoRef.current;
      a.t += 0.016;
      const ax = 0.5 + 0.38 * Math.sin(a.t * 0.5) * Math.cos(a.t * 0.31);
      const ay = 0.5 + 0.38 * Math.cos(a.t * 0.4) * Math.sin(a.t * 0.27);
      const m = mouseRef.current;
      // Blend auto + real mouse
      const fx = m.x * 0.6 + ax * 0.4;
      const fy = m.y * 0.6 + ay * 0.4;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, fx, fy);
      gl.uniform2f(uMvel, m.vx * 60, m.vy * 60);
      m.vx *= 0.85; m.vy *= 0.85;
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:"absolute", inset:0, width:"100%", height:"100%",
      display:"block", zIndex:0
    }}/>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUTH PAGE
// ═══════════════════════════════════════════════════════════════
function AuthPage({lang, users, onLogin, onRegister}) {
  const t = T[lang].auth;
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    const u = users.find(u => u.username === username.toUpperCase() && u.password === password);
    if (!u) { setError(t.error.badLogin); return; }
    if (u.banned) { setError(lang==="ru"?"Ваш аккаунт заблокирован.":"Account is banned."); return; }
    onLogin(u);
  };

  const handleRegister = () => {
    setError("");
    if (username.length < 3) { setError(t.error.shortUser); return; }
    if (password.length < 6) { setError(t.error.shortPass); return; }
    if (password !== confirm) { setError(t.error.passMismatch); return; }
    if (username.toLowerCase() === "admin") { setError(t.error.adminForbidden); return; }
    if (users.find(u => u.username === username.toUpperCase())) { setError(t.error.takenName); return; }
    onRegister({ username: username.toUpperCase(), password, role:"user", banned:false, totalGamesPlayed:0 });
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",
      background:"#06060f", position:"relative", overflow:"hidden"}}>
      {/* Liquid Ether WebGL background */}
      <LiquidEtherBG />
      {/* Frosted glass overlay to slightly dim the bg behind the card */}
      <div style={{position:"absolute",inset:0,background:"rgba(6,6,18,0.28)",zIndex:1,pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:400,animation:"pop-in 0.4s both",position:"relative",zIndex:2}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <NeonText color="var(--cyan)" size="2rem" pulse>◈ {T[lang].appName}</NeonText>
          <div style={{color:"var(--muted)",fontSize:"0.8rem",marginTop:8,letterSpacing:"0.2em"}}>{t.tagline}</div>
        </div>
        <Card color="var(--cyan)40" glow style={{padding:"28px 32px"}}>
          {/* Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:24,background:"var(--bg2)",borderRadius:4,padding:3}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}} style={{
                flex:1,padding:"8px",borderRadius:3,fontFamily:"var(--font-hd)",fontSize:"0.68rem",
                fontWeight:700,letterSpacing:"0.1em",border:"none",cursor:"pointer",transition:"all 0.2s",
                background:mode===m?"var(--card)":"transparent",
                color:mode===m?"var(--cyan)":"var(--muted)",
                boxShadow:mode===m?"0 0 10px var(--cyan)20":""
              }}>{m==="login"?t.signIn:t.signUp}</button>
            ))}
          </div>
          <Input label={t.username} value={username} onChange={e=>setUsername(e.target.value)} placeholder="PLAYER_01" />
          <Input label={t.password} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" />
          {mode==="register" && <Input label={t.confirmPassword} type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••" />}
          {error && <div style={{color:"var(--red)",fontSize:"0.72rem",fontFamily:"var(--font-hd)",marginBottom:12,
            background:"var(--red)10",border:"1px solid var(--red)40",borderRadius:4,padding:"8px 12px",animation:"shake 0.4s"}}>{error}</div>}
          <GlowButton full color="var(--cyan)"
            onClick={mode==="login"?handleLogin:handleRegister}
            style={{marginTop:4}}>
            {mode==="login"?t.loginBtn:t.registerBtn}
          </GlowButton>
        </Card>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════
function Header({page, setPage, user, lang, setLang, onLogout, motd}) {
  const t = T[lang];
  const navItems = [
    {id:"home", label:t.nav.arcade},
    {id:"leaderboard", label:t.nav.rankings},
    {id:"profile", label:t.nav.profile},
    ...(user?.role==="admin"?[{id:"admin",label:t.nav.admin}]:[]),
  ];
  return (
    <>
      {motd && (
        <div style={{background:"var(--yellow)18",borderBottom:"1px solid var(--yellow)40",
          padding:"7px 24px",textAlign:"center",animation:"banner-in 0.4s both"}}>
          <span style={{fontFamily:"var(--font-hd)",fontSize:"0.7rem",color:"var(--yellow)",letterSpacing:"0.1em"}}>
            ◈ {motd}
          </span>
        </div>
      )}
      <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(6,6,18,0.95)",
        backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",
        padding:"0 20px",height:58,display:"flex",alignItems:"center",gap:20}}>
        <NeonText color="var(--cyan)" size="1.1rem" pulse>◈ {t.appName}</NeonText>
        <nav style={{display:"flex",gap:6,flex:1}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{
              padding:"5px 14px",borderRadius:4,fontFamily:"var(--font-hd)",fontSize:"0.65rem",
              fontWeight:700,letterSpacing:"0.1em",
              color:page===n.id?(n.id==="admin"?"var(--yellow)":"var(--cyan)"):"var(--muted)",
              background:page===n.id?(n.id==="admin"?"var(--yellow)18":"var(--cyan)18"):"transparent",
              border:page===n.id?`1px solid ${n.id==="admin"?"var(--yellow)40":"var(--cyan)40"}`:"1px solid transparent",
              transition:"all 0.2s"}}>{n.label}</button>
          ))}
        </nav>
        {/* Lang toggle */}
        <button onClick={()=>setLang(l=>l==="en"?"ru":"en")} style={{
          padding:"8px 14px",border:"1px solid var(--border)",borderRadius:4,
          background:"var(--bg2)",color:"var(--text)",fontFamily:"var(--font-hd)",
          fontSize:"0.68rem",fontWeight:700,cursor:"pointer",transition:"all 0.2s",
          letterSpacing:"0.05em", minWidth:56, minHeight:36, touchAction:"manipulation",
          WebkitTapHighlightColor:"transparent"
        }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--cyan)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
        >{lang==="en"?"RU":"EN"}</button>
        {user && (
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",
              background:user.role==="admin"?"var(--yellow)":"var(--green)",
              boxShadow:`0 0 8px ${user.role==="admin"?"var(--yellow)":"var(--green)"}`}} />
            <NeonText color={user.role==="admin"?"var(--yellow)":"var(--green)"} size="0.75rem">
              {user.username}{user.role==="admin"?" ★":""}
            </NeonText>
            <GlowButton small danger onClick={onLogout}>{t.auth.logout}</GlowButton>
          </div>
        )}
      </header>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════
function HomePage({lang, user, scores, onPlayGame}) {
  const t = T[lang];
  const [hovered, setHovered] = useState(null);
  const topScores = [...scores].sort((a,b)=>computeTotal(b.scores)-computeTotal(a.scores)).slice(0,3);
  const medalColors = ["var(--yellow)","#c0c0c0","#cd7f32"];
  const medalIcons  = ["trophy","crown","star"];

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 20px"}}>
      {/* Hero */}
      <div style={{textAlign:"center",marginBottom:52,animation:"slide-up 0.5s both"}}>
        <div style={{fontSize:"0.7rem",fontFamily:"var(--font-hd)",color:"var(--muted)",letterSpacing:"0.3em",marginBottom:14}}>
          ◈ ◈ ◈ &nbsp; {t.home.welcome} &nbsp; ◈ ◈ ◈
        </div>
        <h1 style={{fontFamily:"var(--font-hd)",fontSize:"clamp(2.8rem,7vw,5.5rem)",fontWeight:900,
          lineHeight:1,background:"linear-gradient(135deg,var(--cyan) 0%,var(--magenta) 50%,var(--yellow) 100%)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          filter:"drop-shadow(0 0 28px var(--cyan))",marginBottom:10}}>{t.appName}</h1>
        {user ? (
          <div style={{color:"var(--green)",fontFamily:"var(--font-hd)",fontSize:"0.82rem",
            letterSpacing:"0.15em",textShadow:"0 0 8px var(--green)"}}>
            ► {t.home.playAs}: <span style={{color:"white"}}>{user.username}</span>
            {user.role==="admin"&&<span style={{color:"var(--yellow)",marginLeft:8}}>★ ADMIN</span>}
          </div>
        ) : (
          <div style={{color:"var(--muted)",fontFamily:"var(--font-hd)",fontSize:"0.72rem",letterSpacing:"0.15em"}}>
            {t.home.setBefore}
          </div>
        )}
      </div>

      {/* Games grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:14,marginBottom:52}}>
        {GAMES_META.map((game,i)=>{
          const best = scores.find(s=>s.name===user?.username)?.scores?.[game.id]??0;
          const isHov = hovered===game.id;
          return (
            <div key={game.id} style={{animation:`slide-up 0.5s ${i*0.08}s both`}}
              onMouseEnter={()=>setHovered(game.id)} onMouseLeave={()=>setHovered(null)}>
              <Card color={isHov?game.color:"var(--border)"} glow={isHov}
                onClick={()=>user&&onPlayGame(game.id)}
                style={{height:"100%",textAlign:"center",
                  transform:isHov?"translateY(-5px)":"none",
                  opacity:user?1:0.55}}>
              <div style={{marginBottom:10, display:'flex', justifyContent:'center',
                  animation:isHov?"float 1.5s ease-in-out infinite":"none"}}>
                <PixelIconAnimated id={GAME_PIXEL_ICON[game.id]} size={52} color={game.color} glow={isHov} />
              </div>
                <NeonText color={game.color} size="0.95rem" style={{display:"block",marginBottom:6}}>
                  {t.gameNames[game.id]}
                </NeonText>
                <p style={{color:"var(--muted)",fontSize:"0.76rem",lineHeight:1.5,marginBottom:12}}>
                  {t.gameDesc[game.id]}
                </p>
                {best>0 && <div style={{fontSize:"0.65rem",color:"var(--muted)",fontFamily:"var(--font-hd)"}}>
                  {t.home.best}: <span style={{color:game.color}}>{best.toLocaleString()}</span>
                </div>}
                {!user && <div style={{fontSize:"0.62rem",color:"var(--muted)",fontFamily:"var(--font-hd)",marginTop:6}}>
                  {t.home.setBefore}
                </div>}
              </Card>
            </div>
          );
        })}
      </div>

      {/* Top 3 */}
      <div style={{animation:"slide-up 0.5s 0.45s both"}}>
        <div style={{marginBottom:14}}><NeonText color="var(--yellow)" size="0.78rem" style={{letterSpacing:"0.2em"}}>{t.home.topPlayers}</NeonText></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {topScores.map((p,i)=>(
            <Card key={p.name} color={`${medalColors[i]}40`} glow style={{textAlign:"center",padding:"16px"}}>
              <div style={{marginBottom:5,display:"flex",justifyContent:"center"}}>
                <PixelIconAnimated id={["trophy","crown","star"][i]} size={32} color={medalColors[i]} glow />
              </div>
              <NeonText color={medalColors[i]} size="0.78rem" style={{display:"block",marginBottom:4}}>{p.name}</NeonText>
              <div style={{fontFamily:"var(--font-hd)",fontSize:"1rem",color:medalColors[i]}}>{computeTotal(p.scores).toLocaleString()}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEADERBOARD
// ═══════════════════════════════════════════════════════════════
function LeaderboardPage({lang, scores, user}) {
  const t = T[lang];
  const [filter, setFilter] = useState("total");
  const sorted = [...scores].sort((a,b)=>{
    const va=filter==="total"?computeTotal(a.scores):(a.scores[filter]??0);
    const vb=filter==="total"?computeTotal(b.scores):(b.scores[filter]??0);
    return vb-va;
  });
  const options=[{id:"total",label:t.leaderboard.overall,color:"var(--cyan)"},
    ...GAMES_META.map(g=>({id:g.id,label:t.gameNames[g.id],color:g.color}))];
  return (
    <div style={{maxWidth:860,margin:"0 auto",padding:"36px 20px"}}>
      <div style={{textAlign:"center",marginBottom:36,animation:"slide-up 0.4s both"}}>
        <NeonText color="var(--yellow)" size="1.8rem" pulse>{t.leaderboard.title}</NeonText>
      </div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:24,justifyContent:"center"}}>
        {options.map(o=>(
          <button key={o.id} onClick={()=>setFilter(o.id)} style={{
            padding:"6px 14px",borderRadius:4,fontFamily:"var(--font-hd)",fontSize:"0.62rem",fontWeight:700,
            letterSpacing:"0.08em",color:filter===o.id?o.color:"var(--muted)",
            background:filter===o.id?`${o.color}20`:"var(--bg2)",
            border:`1px solid ${filter===o.id?o.color:"var(--border)"}`,
            transition:"all 0.2s",cursor:"pointer"}}>{o.label}</button>
        ))}
      </div>
      <Card color="var(--border)" style={{padding:0,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"52px 1fr auto 110px",
          padding:"10px 18px",background:"var(--bg2)",borderBottom:"1px solid var(--border)"}}>
          {[t.leaderboard.rank,t.leaderboard.player,t.leaderboard.score,t.leaderboard.bar].map(h=>(
            <div key={h} style={{fontFamily:"var(--font-hd)",fontSize:"0.58rem",color:"var(--muted)",letterSpacing:"0.12em"}}>{h}</div>
          ))}
        </div>
        {sorted.map((p,i)=>{
          const val=filter==="total"?computeTotal(p.scores):(p.scores[filter]??0);
          const maxVal=filter==="total"?computeTotal(sorted[0]?.scores??{}):sorted[0]?.scores?.[filter]??1;
          const pct=maxVal>0?val/maxVal:0;
          const isMe=p.name===user?.username;
          const rc=i===0?"var(--yellow)":i===1?"#aaa":i===2?"#cd7f32":"var(--muted)";
          const fc=options.find(o=>o.id===filter)?.color??"var(--cyan)";
          return (
            <div key={p.name} style={{display:"grid",gridTemplateColumns:"52px 1fr auto 110px",
              padding:"13px 18px",alignItems:"center",
              borderBottom:"1px solid var(--border)",
              background:isMe?"var(--cyan)08":i%2===0?"transparent":"rgba(255,255,255,0.01)",
              animation:`slide-in-left 0.35s ${i*0.04}s both`}}>
              <div style={{fontFamily:"var(--font-hd)",fontWeight:900,color:rc,fontSize:i<3?"1rem":"0.82rem"}}>
                {i<3 ? <PixelIcon id={["trophy","crown","star"][i]} size={22} color={["#ffe500","#c0c0c0","#cd7f32"][i]} /> : `#${i+1}`}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <div style={{width:26,height:26,borderRadius:"50%",
                  background:`linear-gradient(135deg,${fc}60,${fc}20)`,
                  border:`1px solid ${fc}40`,display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"var(--font-hd)",fontSize:"0.62rem",fontWeight:700,color:fc,flexShrink:0}}>{p.name[0]}</div>
                <span style={{fontFamily:"var(--font-hd)",fontSize:"0.82rem",fontWeight:700,
                  color:isMe?"var(--green)":"var(--text)",
                  textShadow:isMe?"0 0 8px var(--green)":"none"}}>
                  {p.name}{isMe&&<span style={{fontSize:"0.58rem",color:"var(--green)",marginLeft:6}}>◄ {lang==="ru"?"ВЫ":"YOU"}</span>}
                </span>
              </div>
              <ScoreTag value={val} color={fc}/>
              <div style={{width:90,height:5,background:"var(--bg2)",borderRadius:3,overflow:"hidden",marginLeft:14}}>
                <div style={{height:"100%",width:`${pct*100}%`,borderRadius:3,
                  background:`linear-gradient(90deg,${fc},${fc}80)`,
                  boxShadow:`0 0 5px ${fc}`,transition:"width 0.7s ease"}}/>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════
function AdminPanel({lang, users, setUsers, scores, setScores, motd, setMotd}) {
  const t = T[lang].admin;
  const [tab, setTab] = useState("users");
  const [announce, setAnnounce] = useState("");
  const [announceSent, setAnnounceSent] = useState(false);

  const normalUsers = users.filter(u=>u.role!=="admin");
  const totalGames = normalUsers.reduce((a,u)=>a+(u.totalGamesPlayed??0),0);
  const topScore = Math.max(0,...scores.map(s=>computeTotal(s.scores)));

  const handleBan = (username) => setUsers(prev=>prev.map(u=>u.username===username?{...u,banned:!u.banned}:u));
  const handleResetScore = (username) => setScores(prev=>prev.map(s=>s.name===username?{...s,scores:{}}:s));
  const handleAnnounce = () => { if(announce.trim()){setMotd(announce.trim());setAnnounceSent(true);setTimeout(()=>setAnnounceSent(false),3000);} };

  const tabs=[{id:"users",label:t.users},{id:"stats",label:t.stats},{id:"manage",label:t.manage}];

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"36px 20px"}}>
      <div style={{textAlign:"center",marginBottom:32,animation:"slide-up 0.4s both"}}>
        <NeonText color="var(--yellow)" size="1.8rem" pulse>{t.title}</NeonText>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:24,background:"var(--bg2)",
        borderRadius:4,padding:3,width:"fit-content"}}>
        {tabs.map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
            padding:"8px 22px",borderRadius:3,fontFamily:"var(--font-hd)",fontSize:"0.68rem",fontWeight:700,
            letterSpacing:"0.1em",border:"none",cursor:"pointer",transition:"all 0.2s",
            background:tab===tb.id?"var(--card)":"transparent",
            color:tab===tb.id?"var(--yellow)":"var(--muted)",
            boxShadow:tab===tb.id?"0 0 10px var(--yellow)20":""
          }}>{tb.label}</button>
        ))}
      </div>

      {/* USERS TAB */}
      {tab==="users" && (
        <Card color="var(--yellow)40" style={{padding:0,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 90px 120px 100px 160px",
            padding:"10px 18px",background:"var(--bg2)",borderBottom:"1px solid var(--border)"}}>
            {[t.cols.user,t.cols.role,t.cols.score,t.cols.status,t.cols.actions].map(h=>(
              <div key={h} style={{fontFamily:"var(--font-hd)",fontSize:"0.58rem",color:"var(--muted)",letterSpacing:"0.1em"}}>{h}</div>
            ))}
          </div>
          {normalUsers.map((u,i)=>{
            const us=scores.find(s=>s.name===u.username);
            const total=us?computeTotal(us.scores):0;
            return (
              <div key={u.username} style={{display:"grid",gridTemplateColumns:"1fr 90px 120px 100px 160px",
                padding:"12px 18px",alignItems:"center",
                borderBottom:"1px solid var(--border)20",
                animation:`slide-in-left 0.3s ${i*0.04}s both`}}>
                <div style={{fontFamily:"var(--font-hd)",fontSize:"0.82rem",fontWeight:700,
                  color:u.banned?"var(--red)":"var(--text)"}}>{u.username}</div>
                <div style={{fontFamily:"var(--font-hd)",fontSize:"0.68rem",color:"var(--cyan)"}}>USER</div>
                <ScoreTag value={total} color="var(--yellow)"/>
                <div style={{fontFamily:"var(--font-hd)",fontSize:"0.65rem",
                  color:u.banned?"var(--red)":"var(--green)"}}>
                  {u.banned?`✕ ${t.banned}`:"✓ ACTIVE"}
                </div>
                <div style={{display:"flex",gap:6}}>
                  <GlowButton small danger={!u.banned} color={u.banned?"var(--green)":undefined}
                    onClick={()=>handleBan(u.username)}>
                    {u.banned?t.unbanUser:t.banUser}
                  </GlowButton>
                  <GlowButton small color="var(--magenta)" onClick={()=>handleResetScore(u.username)}>
                    {lang==="ru"?"СБРОС":"RESET"}
                  </GlowButton>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* STATS TAB */}
      {tab==="stats" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {[
            {label:t.totalUsers,value:normalUsers.length,color:"var(--cyan)",  iconId:"robot"},
            {label:t.totalGames,value:totalGames,         color:"var(--green)", iconId:"gamepad"},
            {label:t.topScore,  value:topScore.toLocaleString(),color:"var(--yellow)",iconId:"trophy"},
            {label:lang==="ru"?"Заблокировано":"Banned",value:normalUsers.filter(u=>u.banned).length,color:"var(--red)",iconId:"skull"},
          ].map(s=>(
            <Card key={s.label} color={`${s.color}40`} glow style={{textAlign:"center",animation:"pop-in 0.4s both"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
                <PixelIconAnimated id={s.iconId} size={36} color={s.color} glow />
              </div>
              <div style={{fontFamily:"var(--font-hd)",fontSize:"2rem",fontWeight:900,color:s.color,
                textShadow:`0 0 15px ${s.color}`}}>{s.value}</div>
              <div style={{fontFamily:"var(--font-hd)",fontSize:"0.65rem",color:"var(--muted)",
                letterSpacing:"0.1em",marginTop:4}}>{s.label}</div>
            </Card>
          ))}
          {/* Per-game breakdown */}
          <div style={{gridColumn:"1/-1"}}>
            <Card color="var(--border)">
              <div style={{fontFamily:"var(--font-hd)",fontSize:"0.7rem",color:"var(--yellow)",marginBottom:14,letterSpacing:"0.15em"}}>
                {lang==="ru"?"ПО ИГРАМ":"PER GAME STATS"}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
                {GAMES_META.map(g=>{
                  const best=Math.max(0,...scores.map(s=>s.scores[g.id]??0));
                  return (
                    <div key={g.id} style={{textAlign:"center",padding:"12px",background:"var(--bg2)",borderRadius:6,
                      border:`1px solid ${g.color}30`}}>
                      <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
                        <PixelIconAnimated id={GAME_PIXEL_ICON[g.id]} size={28} color={g.color} />
                      </div>
                      <div style={{fontFamily:"var(--font-hd)",fontSize:"0.65rem",color:g.color,margin:"4px 0"}}>
                        {T[lang].gameNames[g.id]}
                      </div>
                      <div style={{fontFamily:"var(--font-hd)",fontSize:"0.82rem",color:"var(--text)"}}>
                        {best.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* MANAGE TAB */}
      {tab==="manage" && (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card color="var(--cyan)40">
            <div style={{fontFamily:"var(--font-hd)",fontSize:"0.72rem",color:"var(--cyan)",
              letterSpacing:"0.15em",marginBottom:14}}>◈ {t.announce}</div>
            <div style={{display:"flex",gap:10}}>
              <input value={announce} onChange={e=>setAnnounce(e.target.value)}
                placeholder={t.announcePlaceholder}
                style={{flex:1,padding:"10px 14px",background:"var(--bg2)",border:"1px solid var(--border)",
                  borderRadius:4,color:"var(--text)",fontSize:"0.85rem",outline:"none"}}
                onKeyDown={e=>e.key==="Enter"&&handleAnnounce()}/>
              <GlowButton onClick={handleAnnounce}>{t.announceBtn}</GlowButton>
            </div>
            {announceSent&&<div style={{color:"var(--green)",fontFamily:"var(--font-hd)",fontSize:"0.7rem",marginTop:8}}>{t.msgSent}</div>}
            {motd&&<div style={{marginTop:10,padding:"8px 12px",background:"var(--yellow)10",
              border:"1px solid var(--yellow)40",borderRadius:4,
              fontFamily:"var(--font-hd)",fontSize:"0.7rem",color:"var(--yellow)"}}>
              {lang==="ru"?"Текущее:":"Current:"} {motd}
              <button onClick={()=>setMotd("")} style={{marginLeft:10,color:"var(--red)",
                fontFamily:"var(--font-hd)",fontSize:"0.65rem",cursor:"pointer",background:"none",border:"none"}}>
                {lang==="ru"?"УБРАТЬ":"CLEAR"}
              </button>
            </div>}
          </Card>
          <Card color="var(--magenta)40">
            <div style={{fontFamily:"var(--font-hd)",fontSize:"0.72rem",color:"var(--magenta)",
              letterSpacing:"0.15em",marginBottom:14}}>◈ {lang==="ru"?"СБРОС ВСЕХ РЕЙТИНГОВ":"RESET ALL SCORES"}</div>
            <p style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:14}}>
              {lang==="ru"?"Это действие обнулит все очки всех игроков. Необратимо!":"This will wipe all player scores. Irreversible!"}
            </p>
            <GlowButton danger onClick={()=>setScores(SEED_SCORES.map(s=>({...s,scores:{}})))}>
              {lang==="ru"?"⚠ СБРОСИТЬ ВСЁ":"⚠ WIPE ALL SCORES"}
            </GlowButton>
          </Card>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GAME WRAPPER
// ═══════════════════════════════════════════════════════════════
function GameWrapper({gameId, user, lang, onBack, onSubmitScore}) {
  const t = T[lang].game;
  const game = GAMES_META.find(g=>g.id===gameId);
  const [finalScore, setFinalScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [gameKey, setGameKey] = useState(0); // increment to fully remount game
  const handleGameEnd = useCallback(score=>setFinalScore(score),[]);
  const handleSubmit = () => { if(!submitted&&finalScore!==null){onSubmitScore(gameId,finalScore);setSubmitted(true);}};
  const handleRestart = () => { setFinalScore(null); setSubmitted(false); setGameKey(k=>k+1); };

  return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"28px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
        <GlowButton small onClick={onBack}>{t.back}</GlowButton>
        <PixelIconAnimated id={GAME_PIXEL_ICON[gameId]} size={28} color={game.color} glow />
        <NeonText color={game.color} size="1.1rem">{T[lang].gameNames[gameId]}</NeonText>
        {user&&<span style={{marginLeft:"auto",fontFamily:"var(--font-hd)",fontSize:"0.68rem",color:"var(--muted)"}}>
          {t.player}: <span style={{color:"var(--green)"}}>{user.username}</span>
        </span>}
      </div>
      <Card color={`${game.color}40`} glow style={{padding:0,overflow:"hidden",position:"relative"}}>
        {gameId==="snake"    && <SnakeGame    key={gameKey} onEnd={handleGameEnd} active={finalScore===null} color={game.color} lang={lang}/>}
        {gameId==="flappy"   && <FlappyGame   key={gameKey} onEnd={handleGameEnd} active={finalScore===null} color={game.color} lang={lang}/>}
        {gameId==="memory"   && <MemoryGame   key={gameKey} onEnd={handleGameEnd} active={finalScore===null} color={game.color} lang={lang}/>}
        {gameId==="reaction" && <ReactionGame key={gameKey} onEnd={handleGameEnd} active={finalScore===null} color={game.color} lang={lang}/>}
        {gameId==="tetris"   && <TetrisGame   key={gameKey} onEnd={handleGameEnd} active={finalScore===null} color={game.color} lang={lang}/>}
        <HintCorner gameId={gameId} lang={lang}/>
        {finalScore!==null && (
          <div style={{position:"absolute",inset:0,background:"rgba(6,6,18,0.93)",
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            gap:16,animation:"pop-in 0.4s both"}}>
            <div style={{display:"flex",justifyContent:"center"}}>
              <PixelIconAnimated id="trophy" size={52} color={game.color} glow animate />
            </div>
            <NeonText color={game.color} size="1.4rem" pulse>{t.gameOver}</NeonText>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"var(--font-hd)",fontSize:"0.65rem",color:"var(--muted)",
                letterSpacing:"0.2em",marginBottom:4}}>{t.finalScore}</div>
              <div style={{fontFamily:"var(--font-hd)",fontSize:"2.8rem",fontWeight:900,
                color:game.color,textShadow:`0 0 20px ${game.color}`}}>{finalScore.toLocaleString()}</div>
            </div>
            <div style={{display:"flex",gap:12}}>
              {!submitted
                ? <GlowButton color="var(--green)" onClick={handleSubmit}>{t.saveScore}</GlowButton>
                : <div style={{fontFamily:"var(--font-hd)",fontSize:"0.75rem",color:"var(--green)",
                    textShadow:"0 0 8px var(--green)"}}>{t.saved}</div>}
              <GlowButton onClick={handleRestart}>{t.playAgain}</GlowButton>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SNAKE GAME  — smooth rounded snake with proper head/body/tail
// ═══════════════════════════════════════════════════════════════
function SnakeGame({onEnd, active, color, lang}) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);
  const animRef   = useRef(null);
  const lastRef   = useRef(0);
  const activeRef = useRef(active);
  const onEndRef  = useRef(onEnd);
  useEffect(()=>{ activeRef.current=active; },[active]);
  useEffect(()=>{ onEndRef.current=onEnd; },[onEnd]);

  const CELL=22, COLS=22, ROWS=18, W=CELL*COLS, H=CELL*ROWS;

  // resolve CSS var → hex
  const COL = resolveCSSColor(color);
  const COL_DARK = shadeColor(COL,-60);
  const COL_MID  = shadeColor(COL,-25);

  const placeFood = snake => {
    let f;
    do { f={x:Math.floor(Math.random()*COLS), y:Math.floor(Math.random()*ROWS)}; }
    while (snake.some(s=>s.x===f.x&&s.y===f.y));
    return f;
  };

  const initState = () => ({
    snake: [{x:11,y:9},{x:10,y:9},{x:9,y:9},{x:8,y:9}],
    dir:{x:1,y:0}, nextDir:{x:1,y:0},
    food: {x:16,y:9},
    score:0, speed:150, started:false, dead:false,
    eatAnim:0, // countdown for eat flash
  });

  useEffect(()=>{
    stateRef.current = initState();
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    // ── drawing helpers ──────────────────────────────────────────

    // Draw one rounded body segment, connecting to prev/next
    const drawSegment = (seg, prev, next, i, total) => {
      const cx = seg.x*CELL + CELL/2;
      const cy = seg.y*CELL + CELL/2;
      const r  = CELL/2 - 1.5;
      const fade = 1 - (i/(total)) * 0.55;

      // Body gradient — bright top, darker bottom for 3D feel
      const g = ctx.createRadialGradient(cx-r*0.3, cy-r*0.3, r*0.1, cx, cy, r);
      g.addColorStop(0, COL);
      g.addColorStop(0.55, COL_MID);
      g.addColorStop(1, COL_DARK);
      ctx.globalAlpha = fade;
      ctx.fillStyle = g;
      ctx.shadowColor = COL;
      ctx.shadowBlur = i===0 ? 14 : 5;

      // Draw circle segment
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.fill();

      // Scale pattern on body (subtle hex dots)
      if (i > 0 && i < total-1) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(0,0,0,0.15)`;
        ctx.beginPath();
        ctx.arc(cx + r*0.2, cy + r*0.2, r*0.22, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - r*0.3, cy - r*0.1, r*0.16, 0, Math.PI*2);
        ctx.fill();
      }

      // Highlight on top-left
      ctx.fillStyle = `rgba(255,255,255,0.22)`;
      ctx.beginPath();
      ctx.arc(cx - r*0.3, cy - r*0.3, r*0.32, 0, Math.PI*2);
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.shadowBlur  = 0;
    };

    // Draw snake head with eyes + tongue
    const drawHead = (head, dir) => {
      const cx = head.x*CELL + CELL/2;
      const cy = head.y*CELL + CELL/2;
      const r  = CELL/2 - 0.5;

      // Glowing head body
      const g = ctx.createRadialGradient(cx-r*0.25,cy-r*0.25,1, cx,cy,r);
      g.addColorStop(0, shadeColor(COL,40));
      g.addColorStop(0.5, COL);
      g.addColorStop(1, COL_DARK);
      ctx.shadowColor = COL; ctx.shadowBlur = 18;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.arc(cx-r*0.3, cy-r*0.35, r*0.35, 0, Math.PI*2);
      ctx.fill();

      // Eyes — positioned relative to movement direction
      const ex = dir.x, ey = dir.y;
      // perpendicular offset
      const px = -ey, py = ex;
      const eyeDist = r * 0.42;
      const eyeFwd  = r * 0.3;

      [[px,py],[-px,-py]].forEach(([ox,oy]) => {
        const ex2 = cx + ex*eyeFwd + ox*eyeDist;
        const ey2 = cy + ey*eyeFwd + oy*eyeDist;
        // white sclera
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(ex2, ey2, r*0.3, 0, Math.PI*2); ctx.fill();
        // pupil — slit (vertical ellipse)
        ctx.fillStyle = "#111122";
        ctx.beginPath(); ctx.ellipse(ex2+ex*1.5, ey2+ey*1.5, r*0.12, r*0.2, Math.atan2(ey,ex)+Math.PI/2, 0, Math.PI*2); ctx.fill();
        // gleam
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath(); ctx.arc(ex2+ex*1-r*0.05, ey2+ey*1-r*0.05, r*0.07, 0, Math.PI*2); ctx.fill();
      });

      // Tongue (only when moving, flickers)
      const tongueOut = (Date.now() / 200) % 2 < 1;
      if (tongueOut) {
        const tx = cx + ex*(r+4);
        const ty = cy + ey*(r+4);
        ctx.strokeStyle = "#ff3355";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.shadowColor = "#ff3355"; ctx.shadowBlur = 6;
        // fork
        ctx.beginPath();
        ctx.moveTo(cx + ex*(r-2), cy + ey*(r-2));
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx + ex*4 + px*4, ty + ey*4 + py*4);
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx + ex*4 - px*4, ty + ey*4 - py*4);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    // Draw tail tip (tapered)
    const drawTail = (tail, prev) => {
      const cx = tail.x*CELL + CELL/2;
      const cy = tail.y*CELL + CELL/2;
      const r  = CELL/2 - 4;
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = COL_MID;
      ctx.shadowColor = COL; ctx.shadowBlur = 4;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    };

    // Draw apple food
    const drawFood = (food, t) => {
      const cx = food.x*CELL + CELL/2;
      const cy = food.y*CELL + CELL/2;
      const bob = Math.sin(t*0.003) * 2;  // bobbing
      const r = CELL*0.38;

      // Glow halo
      const halo = ctx.createRadialGradient(cx,cy+bob,r*0.5, cx,cy+bob,r*2.2);
      halo.addColorStop(0,"rgba(255,50,80,0.35)");
      halo.addColorStop(1,"transparent");
      ctx.fillStyle=halo;
      ctx.beginPath(); ctx.arc(cx,cy+bob,r*2.2,0,Math.PI*2); ctx.fill();

      // Apple body — red gradient
      const ag = ctx.createRadialGradient(cx-r*0.3,cy-r*0.3+bob,r*0.1, cx,cy+bob,r);
      ag.addColorStop(0,"#ff6688");
      ag.addColorStop(0.6,"#ee1133");
      ag.addColorStop(1,"#880011");
      ctx.shadowColor="#ff2244"; ctx.shadowBlur=12;
      ctx.fillStyle=ag;
      ctx.beginPath(); ctx.arc(cx,cy+bob,r,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;

      // Shine
      ctx.fillStyle="rgba(255,255,255,0.4)";
      ctx.beginPath(); ctx.ellipse(cx-r*0.25,cy-r*0.25+bob,r*0.2,r*0.28,-0.5,0,Math.PI*2); ctx.fill();

      // Stem
      ctx.strokeStyle="#66aa22"; ctx.lineWidth=2; ctx.lineCap="round";
      ctx.beginPath(); ctx.moveTo(cx+1,cy-r+bob); ctx.lineTo(cx+3,cy-r-5+bob); ctx.stroke();

      // Tiny leaf
      ctx.fillStyle="#44bb22";
      ctx.beginPath();
      ctx.ellipse(cx+5,cy-r-4+bob,5,3,0.6,0,Math.PI*2);
      ctx.fill();
    };

    // ── main draw ────────────────────────────────────────────────
    const draw = (s, ts) => {
      // Background + grid dots
      ctx.fillStyle="#060612"; ctx.fillRect(0,0,W,H);
      ctx.fillStyle="rgba(255,255,255,0.025)";
      for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
        ctx.fillRect(c*CELL+CELL/2-1, r*CELL+CELL/2-1, 2, 2);

      // Food
      drawFood(s.food, ts);

      // Body (from tail → segment before head)
      const n = s.snake.length;
      for (let i=n-1; i>=1; i--) {
        if (i===n-1) drawTail(s.snake[i], s.snake[i-1]);
        else drawSegment(s.snake[i], s.snake[i+1]||null, s.snake[i-1], i, n);
      }
      // Head last (on top)
      drawHead(s.snake[0], s.dir);

      // HUD
      ctx.fillStyle=COL; ctx.font="bold 13px 'Orbitron'";
      ctx.fillText(`${s.score}`, 10, 18);

      if (!s.started) {
        ctx.fillStyle="rgba(6,6,18,0.75)"; ctx.fillRect(0,0,W,H);
        ctx.fillStyle=COL; ctx.shadowColor=COL; ctx.shadowBlur=16;
        ctx.textAlign="center"; ctx.font="bold 15px 'Orbitron'";
        ctx.fillText(lang==="ru"?"СТРЕЛКИ / WASD ДЛЯ СТАРТА":"ARROW KEYS / WASD TO START",W/2,H/2);
        ctx.shadowBlur=0; ctx.textAlign="left";
      }
    };

    // ── tick ─────────────────────────────────────────────────────
    const tick = ts => {
      if (!activeRef.current) { animRef.current=requestAnimationFrame(tick); return; }
      const s = stateRef.current;
      if (s.started && !s.dead && ts-lastRef.current > s.speed) {
        lastRef.current = ts;
        s.dir = s.nextDir;
        const h = {x:s.snake[0].x+s.dir.x, y:s.snake[0].y+s.dir.y};
        if (h.x<0||h.x>=COLS||h.y<0||h.y>=ROWS ||
            s.snake.slice(1).some(sg=>sg.x===h.x&&sg.y===h.y)) {
          s.dead=true; onEndRef.current(s.score); return;
        }
        s.snake.unshift(h);
        if (h.x===s.food.x && h.y===s.food.y) {
          s.score += 10+Math.floor(s.score/50);
          s.food = placeFood(s.snake);
          s.speed = Math.max(60, s.speed-3);
        } else s.snake.pop();
      }
      if (!s.dead) draw(s, ts);
      animRef.current = requestAnimationFrame(tick);
    };

    const onKey = e => {
      const s=stateRef.current; if(!s.started) s.started=true;
      const map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},
                 w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}};
      const nd=map[e.key];
      if(nd && !(nd.x===-s.dir.x && nd.y===-s.dir.y)) { s.nextDir=nd; e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    animRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("keydown",onKey); };
  }, []);

  const tsRef = useRef(null);
  return <canvas ref={canvasRef} width={W} height={H}
    style={{width:"100%", touchAction:"none", display:"block"}}
    onTouchStart={e=>{
      e.preventDefault();
      tsRef.current={x:e.touches[0].clientX, y:e.touches[0].clientY};
      const s=stateRef.current; if(!s.started) s.started=true;
    }}
    onTouchEnd={e=>{
      e.preventDefault();
      if(!tsRef.current) return;
      const dx=e.changedTouches[0].clientX-tsRef.current.x;
      const dy=e.changedTouches[0].clientY-tsRef.current.y;
      const s=stateRef.current;
      if(Math.abs(dx)<10 && Math.abs(dy)<10) return; // tap — ignore
      if(Math.abs(dx)>Math.abs(dy)){
        if(dx>0 && s.dir.x!==-1) s.nextDir={x:1,y:0};
        if(dx<0 && s.dir.x!==1)  s.nextDir={x:-1,y:0};
      } else {
        if(dy>0 && s.dir.y!==-1) s.nextDir={x:0,y:1};
        if(dy<0 && s.dir.y!==1)  s.nextDir={x:0,y:-1};
      }
      tsRef.current=null;
    }}/>;
}

// ═══════════════════════════════════════════════════════════════
// FLAPPY GAME  (fixed: proper game loop, colorful bird, pipes)
// ═══════════════════════════════════════════════════════════════
// Resolve CSS variable → real hex for canvas use
function resolveCSSColor(varStr) {
  const map = {
    "var(--cyan)":    "#00f5ff",
    "var(--magenta)": "#ff00aa",
    "var(--yellow)":  "#ffe500",
    "var(--green)":   "#00ff88",
    "var(--orange)":  "#ff6b00",
  };
  return map[varStr] || varStr;
}

function FlappyGame({onEnd, active, color, lang}) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const gameRef   = useRef(null);   // mutable game state — never triggers re-render
  const activeRef = useRef(active); // keep latest active value inside closure
  const onEndRef  = useRef(onEnd);

  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { onEndRef.current = onEnd; },  [onEnd]);

  const COL = resolveCSSColor(color);   // real hex color for canvas
  const W=480, H=360, PW=50, GAP=130, SPEED=2.8, GRAVITY=0.42, JUMP=-8;

  // ── init / restart game state ──
  const newGame = () => ({
    bird:    { x:90, y:H/2, vy:0 },
    pipes:   [],
    stars:   Array.from({length:35}, ()=>({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.4+0.4, twinkle:Math.random()*Math.PI*2 })),
    frame:   0,
    score:   0,
    best:    gameRef.current?.best ?? 0,
    started: false,
    over:    false,
    wingPhase: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    gameRef.current = newGame();

    // ── input handlers ──
    const doJump = () => {
      const g = gameRef.current;
      if (g.over) return;
      g.started = true;
      g.bird.vy = JUMP;
      g.wingPhase = Math.PI; // trigger wing flap animation
    };
    const onKey = e => { if (e.code==="Space" || e.key===" " || e.key==="ArrowUp") { doJump(); e.preventDefault(); } };
    canvas.addEventListener("click",     doJump);
    canvas.addEventListener("touchstart", e=>{ doJump(); e.preventDefault(); }, {passive:false});
    window.addEventListener("keydown",   onKey);

    // ── draw helpers ──
    const drawBird = (g) => {
      const {x,y,vy} = g.bird;
      const angle = clamp(vy * 3.5, -50, 75) * Math.PI/180;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Glow aura
      ctx.shadowColor = COL;
      ctx.shadowBlur  = 18;

      // Body — vivid gradient teardrop shape
      const bodyGrd = ctx.createRadialGradient(-2, -3, 1, 0, 0, 13);
      bodyGrd.addColorStop(0, "#ffffff");
      bodyGrd.addColorStop(0.3, COL);
      bodyGrd.addColorStop(1, shadeColor(COL, -50));
      ctx.fillStyle = bodyGrd;
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 11, 0, 0, Math.PI*2);
      ctx.fill();

      // Wing (flapping)
      g.wingPhase += 0.28;
      const wingY = Math.sin(g.wingPhase) * 5;
      ctx.shadowBlur = 6;
      ctx.fillStyle = shadeColor(COL, 30);
      ctx.beginPath();
      ctx.ellipse(-3, wingY, 9, 5, -0.4, 0, Math.PI*2);
      ctx.fill();

      // Eye
      ctx.shadowBlur = 0;
      ctx.fillStyle  = "#fff";
      ctx.beginPath(); ctx.arc(6, -4, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle  = "#111";
      ctx.beginPath(); ctx.arc(7.5, -4, 2, 0, Math.PI*2); ctx.fill();
      // Pupil shine
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(8.5, -5, 0.8, 0, Math.PI*2); ctx.fill();

      // Beak
      ctx.fillStyle = "#ffb830";
      ctx.beginPath();
      ctx.moveTo(13, -1); ctx.lineTo(20, 1); ctx.lineTo(13, 3);
      ctx.closePath(); ctx.fill();

      ctx.restore();
    };

    const drawPipe = (p) => {
      // Pipe body gradient
      const grad = ctx.createLinearGradient(p.x, 0, p.x+PW, 0);
      grad.addColorStop(0,   COL + "99");
      grad.addColorStop(0.4, COL + "cc");
      grad.addColorStop(1,   shadeColor(COL,-40) + "99");

      // Top pipe
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, 0, PW, p.top);
      // Top cap
      ctx.fillStyle = COL;
      ctx.shadowColor = COL; ctx.shadowBlur = 10;
      ctx.fillRect(p.x-5, p.top-22, PW+10, 22);
      ctx.shadowBlur = 0;
      // Highlight stripe on top pipe
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(p.x+6, 0, 8, p.top-22);

      // Bottom pipe
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, p.bottom, PW, H-p.bottom);
      // Bottom cap
      ctx.fillStyle = COL;
      ctx.shadowColor = COL; ctx.shadowBlur = 10;
      ctx.fillRect(p.x-5, p.bottom, PW+10, 22);
      ctx.shadowBlur = 0;
      // Highlight stripe on bottom pipe
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(p.x+6, p.bottom+22, 8, H-p.bottom-22);
    };

    const drawBG = (g, ts) => {
      // Deep space background
      const bgGrd = ctx.createLinearGradient(0,0,0,H);
      bgGrd.addColorStop(0, "#03030f");
      bgGrd.addColorStop(1, "#06061a");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0,0,W,H);

      // Twinkling stars
      g.stars.forEach(st => {
        st.twinkle += 0.04;
        const alpha = 0.3 + 0.3*Math.sin(st.twinkle);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2); ctx.fill();
      });

      // Neon ground line
      ctx.strokeStyle = COL + "50";
      ctx.lineWidth   = 1;
      ctx.setLineDash([8,6]);
      ctx.beginPath(); ctx.moveTo(0,H-2); ctx.lineTo(W,H-2); ctx.stroke();
      ctx.setLineDash([]);
    };

    // ── main game loop ──
    let lastPipeX = W + PW;  // track when to spawn next pipe

    const tick = (ts) => {
      if (!activeRef.current) { rafRef.current = requestAnimationFrame(tick); return; }
      const g = gameRef.current;

      // ── physics ──
      if (g.started && !g.over) {
        g.frame++;
        g.bird.vy += GRAVITY;
        g.bird.y  += g.bird.vy;

        // Move pipes
        g.pipes.forEach(p => { p.x -= SPEED; });

        // Spawn new pipe when last one moved far enough
        const lastPipe = g.pipes[g.pipes.length-1];
        if (!lastPipe || lastPipe.x < W - 220) {
          const top = 60 + Math.random() * (H - GAP - 120);
          g.pipes.push({ x: W+20, top, bottom: top+GAP, scored: false });
        }

        // Remove off-screen pipes
        g.pipes = g.pipes.filter(p => p.x > -PW-20);

        // Score + collision
        for (const p of g.pipes) {
          if (!p.scored && p.x + PW < g.bird.x) { p.scored=true; g.score++; }
          const bx=g.bird.x, by=g.bird.y, br=10;
          if (bx+br > p.x && bx-br < p.x+PW) {
            if (by-br < p.top || by+br > p.bottom) { g.over=true; break; }
          }
        }

        // Floor/ceiling
        if (g.bird.y > H-12 || g.bird.y < 5) g.over = true;

        if (g.over) {
          if (g.score > g.best) g.best = g.score;
          onEndRef.current(g.score);
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
      }

      // ── render ──
      drawBG(g, ts);
      g.pipes.forEach(drawPipe);
      drawBird(g);

      // Score HUD
      ctx.textAlign  = "center";
      ctx.fillStyle  = "#ffffff";
      ctx.shadowColor = COL; ctx.shadowBlur = 12;
      ctx.font = "bold 28px 'Orbitron'";
      ctx.fillText(g.score, W/2, 44);
      ctx.shadowBlur = 0; ctx.textAlign = "left";

      // Start prompt
      if (!g.started) {
        ctx.fillStyle = "rgba(3,3,15,0.62)";
        ctx.fillRect(0,0,W,H);
        ctx.textAlign  = "center";
        ctx.shadowColor = COL; ctx.shadowBlur = 16;
        ctx.fillStyle  = COL;
        ctx.font = "bold 16px 'Orbitron'";
        ctx.fillText(lang==="ru"?"КЛИК / ПРОБЕЛ — СТАРТ":"CLICK / SPACE TO START", W/2, H/2-10);
        ctx.font = "12px 'Orbitron'";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(lang==="ru"?"Не задевай трубы!":"Don't touch the pipes!", W/2, H/2+16);
        ctx.shadowBlur = 0; ctx.textAlign = "left";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("click",     doJump);
      window.removeEventListener("keydown",   onKey);
    };
  }, []); // run once — activeRef/onEndRef stay current via refs

  return <canvas ref={canvasRef} width={W} height={H} style={{width:"100%",cursor:"pointer",display:"block"}}/>;
}

// darken/lighten a hex color by amt (-100..100)
function shadeColor(hex, amt) {
  const h = hex.replace(/^#/,"");
  if (h.length !== 6) return hex;
  const r = clamp(parseInt(h.slice(0,2),16)+amt,0,255);
  const g = clamp(parseInt(h.slice(2,4),16)+amt,0,255);
  const b = clamp(parseInt(h.slice(4,6),16)+amt,0,255);
  return "#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
}

// ═══════════════════════════════════════════════════════════════
// MEMORY GAME
// ═══════════════════════════════════════════════════════════════
// 8 pixel icon IDs used as memory card symbols
const MEMORY_ICONS = ["star","trophy","fire","bolt","gem","moon","target","heart"];
function MemoryGame({onEnd,active,color,lang}) {
  const [cards,setCards]=useState([]);const [flipped,setFlipped]=useState([]);
  const [matched,setMatched]=useState([]);const [moves,setMoves]=useState(0);
  const [score,setScore]=useState(0);const [lock,setLock]=useState(false);
  const [started,setStarted]=useState(false);const [time,setTime]=useState(60);
  const timerRef=useRef(null);
  const initGame=useCallback(()=>{
    const pairs=MEMORY_ICONS.slice(0,8);
    const deck=[...pairs,...pairs].map((iconId,i)=>({id:i,iconId,pairId:i%8})).sort(()=>Math.random()-0.5);
    setCards(deck);setFlipped([]);setMatched([]);setMoves(0);setScore(0);setTime(60);setStarted(true);
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>setTime(t=>{if(t<=1){clearInterval(timerRef.current);return 0;}return t-1;}),1000);
  },[]);
  useEffect(()=>{if(time===0&&started){clearInterval(timerRef.current);onEnd(score);}},[time,started,score]);
  useEffect(()=>()=>clearInterval(timerRef.current),[]);
  useEffect(()=>{if(matched.length===16&&started){clearInterval(timerRef.current);onEnd(score+time*20);}},[matched]);
  const handleFlip=card=>{
    if(!started||lock||flipped.includes(card.id)||matched.includes(card.id))return;
    const nf=[...flipped,card.id];setFlipped(nf);
    if(nf.length===2){
      setMoves(m=>m+1);const[a,b]=nf.map(id=>cards.find(c=>c.id===id));setLock(true);
      if(a.pairId===b.pairId){setTimeout(()=>{setMatched(m=>[...m,a.id,b.id]);setFlipped([]);setScore(s=>s+100);setLock(false);},400);}
      else{setTimeout(()=>{setFlipped([]);setScore(s=>Math.max(0,s-5));setLock(false);},800);}
    }
  };
  const tc=time<15?"var(--red)":time<30?"var(--yellow)":"var(--green)";
  if(!started)return(
    <div style={{height:360,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
      <PixelIconAnimated id="memory" size={56} color={color} glow animate />
      <NeonText color={color} size="1.1rem">{T[lang].gameNames.memory}</NeonText>
      <p style={{color:"var(--muted)",fontSize:"0.82rem",textAlign:"center"}}>{T[lang].gameDesc.memory}</p>
      <GlowButton color={color} onClick={initGame}>{lang==="ru"?"НАЧАТЬ":"START GAME"}</GlowButton>
    </div>
  );
  return(
    <div style={{padding:"16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontFamily:"var(--font-hd)",fontSize:"0.72rem",color}}>{lang==="ru"?"ОЧКИ":"SCORE"}: {score}</span>
        <span style={{fontFamily:"var(--font-hd)",fontSize:"0.72rem",color:time<15?"var(--red)":time<30?"var(--yellow)":"var(--green)"}}>⏱ {time}s</span>
        <span style={{fontFamily:"var(--font-hd)",fontSize:"0.72rem",color:"var(--muted)"}}>{lang==="ru"?"ХОДЫ":"MOVES"}: {moves}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {cards.map(card=>{
          const isFl=flipped.includes(card.id)||matched.includes(card.id);
          const isMa=matched.includes(card.id);
          return(
            <div key={card.id} onClick={()=>handleFlip(card)} style={{height:68,borderRadius:6,cursor:"pointer",
              background:isMa?`${color}25`:isFl?"var(--bg2)":"var(--bg3)",
              border:`1px solid ${isMa?color:isFl?`${color}60`:"var(--border)"}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:isMa?`0 0 12px ${color}60`:"none",transition:"all 0.2s",
              animation:isMa?"pop-in 0.3s both":"none"}}>
              {isFl
                ? <PixelIconAnimated id={card.iconId} size={36} color={isMa?color:"var(--cyan)"} glow={isMa} />
                : <span style={{fontFamily:"var(--font-hd)",color:"var(--border)",fontSize:"1.3rem",fontWeight:900}}>?</span>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REACTION GAME  — fixed stale closures + proper restart
// ═══════════════════════════════════════════════════════════════
function ReactionGame({onEnd,active,color,lang}) {
  const MAX=8, W=480, H=300;

  const [phase,   setPhase]   = useState("intro");
  const [target,  setTarget]  = useState(null);
  const [rt,      setRt]      = useState(null);
  const [history, setHistory] = useState([]);

  const scoreRef  = useRef(0);
  const roundRef  = useRef(0);
  const timerRef  = useRef(null);
  const fireRef   = useRef(null);
  const phaseRef  = useRef("intro");
  const onEndRef  = useRef(onEnd);
  useEffect(()=>{ onEndRef.current=onEnd; },[onEnd]);
  useEffect(()=>{ phaseRef.current=phase; },[phase]);
  useEffect(()=>()=>clearTimeout(timerRef.current), []);

  const startRound = useCallback(()=>{
    clearTimeout(timerRef.current);
    setPhase("wait");
    setTarget(null);
    const delay = 1200 + Math.random()*2200;
    timerRef.current = setTimeout(()=>{
      const t = {
        x: 60  + Math.random()*(W-120),
        y: 40  + Math.random()*(H-80),
        r: 22  + Math.random()*20,
      };
      setTarget(t);
      setPhase("fire");
      fireRef.current = Date.now();
    }, delay);
  },[]);

  const handleClick = useCallback(e=>{
    const ph = phaseRef.current;

    if(ph==="wait"){
      clearTimeout(timerRef.current);
      scoreRef.current = Math.max(0, scoreRef.current-100);
      const nr = roundRef.current + 1;
      roundRef.current = nr;
      setHistory(h=>[...h,{miss:true}]);
      if(nr>=MAX){
        setPhase("gameover");
        setTimeout(()=>onEndRef.current(scoreRef.current), 400);
      } else {
        setTimeout(startRound, 800);
      }
      return;
    }

    if(ph!=="fire") return;

    // Support both mouse (clientX) and touch events
    const clientX = e.clientX ?? e.pageX;
    const clientY = e.clientY ?? e.pageY;
    const el = e.currentTarget ?? document.querySelector('[data-game="reflex"]');
    const rect = el?.getBoundingClientRect?.() ?? {left:0, top:0};
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;

    setTarget(prev=>{
      if(!prev) return prev;
      if(Math.hypot(cx-prev.x, cy-prev.y) > prev.r+20) return prev;

      const reaction = Date.now() - fireRef.current;
      const pts = Math.max(10, Math.round(1000 - reaction*0.8));
      scoreRef.current += pts;
      const nr = roundRef.current + 1;
      roundRef.current = nr;

      setRt(reaction);
      setHistory(h=>[...h,{rt:reaction,pts}]);
      setPhase("result");

      if(nr>=MAX){
        setTimeout(()=>{ onEndRef.current(scoreRef.current); setPhase("gameover"); }, 900);
      } else {
        setTimeout(startRound, 900);
      }
      return null;
    });
  },[startRound]);

  if(phase==="intro") return(
    <div style={{height:H+60,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
      <PixelIconAnimated id="reaction" size={56} color={color} glow animate />
      <NeonText color={color} size="1.1rem">{T[lang].gameNames.reaction}</NeonText>
      <p style={{color:"var(--muted)",fontSize:"0.82rem",textAlign:"center"}}>{T[lang].gameDesc.reaction}</p>
      <GlowButton color={color} onClick={()=>{ scoreRef.current=0; roundRef.current=0; setHistory([]); startRound(); }}>
        {lang==="ru"?"НАЧАТЬ":"START"}
      </GlowButton>
    </div>
  );

  const score = scoreRef.current;
  const round = roundRef.current;

  return(
    <div data-game="reflex" style={{position:"relative",width:"100%",height:H+40,cursor:"crosshair",userSelect:"none",touchAction:"manipulation"}}
      onClick={handleClick}
      onTouchEnd={e=>{ e.preventDefault(); handleClick(e.changedTouches[0]); }}>
      {/* BG */}
      <div style={{position:"absolute",inset:0,background:"#050515"}}/>
      <svg style={{position:"absolute",inset:0,pointerEvents:"none"}} width="100%" height={H+40}>
        {Array.from({length:8},(_,i)=>(
          <line key={`v${i}`} x1={`${i*14.28}%`} y1="0" x2={`${i*14.28}%`} y2={H+40} stroke="rgba(255,255,255,0.04)"/>
        ))}
        {Array.from({length:6},(_,i)=>(
          <line key={`h${i}`} x1="0" y1={(i*(H+40))/5} x2="100%" y2={(i*(H+40))/5} stroke="rgba(255,255,255,0.04)"/>
        ))}
      </svg>

      {/* HUD */}
      <div style={{position:"absolute",top:10,left:14,right:14,display:"flex",justifyContent:"space-between",zIndex:10,pointerEvents:"none"}}>
        <span style={{fontFamily:"var(--font-hd)",fontSize:"0.72rem",color}}>{score}</span>
        <span style={{fontFamily:"var(--font-hd)",fontSize:"0.72rem",color:"var(--muted)"}}>
          {lang==="ru"?"РАУНД":"ROUND"} {Math.min(round+1,MAX)}/{MAX}
        </span>
      </div>

      {/* Center message */}
      <div style={{position:"absolute",top:"45%",left:"50%",transform:"translate(-50%,-50%)",
        textAlign:"center",pointerEvents:"none",zIndex:5,minWidth:200}}>
        {phase==="wait" && (
          <div style={{fontFamily:"var(--font-hd)",color:"var(--muted)",fontSize:"0.88rem",
            animation:"glow-pulse 1s infinite"}}>
            {lang==="ru"?"ЖДИТЕ ЦЕЛЬ...":"WAIT FOR TARGET..."}
          </div>
        )}
        {phase==="result" && (
          <div style={{animation:"pop-in 0.3s both",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <PixelIconAnimated id="bolt" size={22} color="var(--yellow)" glow />
              <span style={{fontFamily:"var(--font-hd)",color:"var(--yellow)",fontSize:"1.1rem"}}>{rt}ms</span>
            </div>
            <div style={{fontFamily:"var(--font-hd)",color,fontSize:"0.72rem"}}>
              +{history[history.length-1]?.pts??0}
            </div>
          </div>
        )}
        {phase==="wait" && history.some(h=>h.miss) && history[history.length-1]?.miss && (
          <div style={{fontFamily:"var(--font-hd)",color:"var(--red)",fontSize:"0.7rem",marginTop:6}}>
            {lang==="ru"?"Рано! -100":"Too early! -100"}
          </div>
        )}
      </div>

      {/* Target */}
      {phase==="fire" && target && (
        <div style={{
          position:"absolute",
          left: target.x - target.r,
          top:  target.y - target.r,
          width:  target.r*2,
          height: target.r*2,
          borderRadius:"50%",
          background:`radial-gradient(circle,${color}ff 0%,${color}80 50%,transparent 100%)`,
          boxShadow:`0 0 20px ${color},0 0 40px ${color}60`,
          animation:"pop-in 0.15s both",
          pointerEvents:"none",
        }}>
          <div style={{position:"absolute",inset:"25%",borderRadius:"50%",background:"rgba(255,255,255,0.9)"}}/>
        </div>
      )}

      {/* Round progress bar */}
      <div style={{position:"absolute",bottom:8,left:14,right:14,display:"flex",gap:5,pointerEvents:"none"}}>
        {Array.from({length:MAX},(_,i)=>{
          const h=history[i];
          return(
            <div key={i} style={{flex:1,height:7,borderRadius:2,
              background:h?(h.miss?"var(--red)":color):"var(--border)",
              boxShadow:h&&!h.miss?`0 0 5px ${color}`:"none",
              transition:"all 0.3s"}}/>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TETRIS GAME
// ═══════════════════════════════════════════════════════════════
const TETROS={
  I:{cells:[[0,1],[1,1],[2,1],[3,1]],color:"#00f5ff"},O:{cells:[[0,0],[1,0],[0,1],[1,1]],color:"#ffe500"},
  T:{cells:[[1,0],[0,1],[1,1],[2,1]],color:"#ff00aa"},S:{cells:[[1,0],[2,0],[0,1],[1,1]],color:"#00ff88"},
  Z:{cells:[[0,0],[1,0],[1,1],[2,1]],color:"#ff6b00"},J:{cells:[[0,0],[0,1],[1,1],[2,1]],color:"#3a86ff"},
  L:{cells:[[2,0],[0,1],[1,1],[2,1]],color:"#ff9500"},
};
const TK=Object.keys(TETROS);
function TetrisGame({onEnd,active,color,lang}) {
  const canvasRef=useRef(null),stateRef=useRef(null),animRef=useRef(null),dropRef=useRef(0);
  const COLS=10,ROWS=20,CELL=24,W=COLS*CELL,H=ROWS*CELL;
  const rp=()=>{const k=TK[Math.floor(Math.random()*TK.length)],t=TETROS[k];return{cells:t.cells.map(([x,y])=>[x+3,y]),color:t.color,key:k};};
  const rot=cells=>cells.map(([x,y])=>[y,-x]).map(([x,y])=>{const mn=Math.min(...cells.map(c=>c[1]));return[x-mn,y+Math.max(...cells.map(c=>c[0]))];});
  const vld=(cells,board)=>cells.every(([x,y])=>x>=0&&x<COLS&&y<ROWS&&(y<0||!board[y]?.[x]));
  useEffect(()=>{
    const is=()=>({board:Array.from({length:ROWS},()=>Array(COLS).fill(null)),current:rp(),next:rp(),score:0,lines:0,level:1,started:false,dead:false});
    stateRef.current=is();
    const canvas=canvasRef.current,ctx=canvas.getContext("2d");
    const lock=s=>{
      s.current.cells.forEach(([x,y])=>{if(y>=0)s.board[y][x]=s.current.color;});
      let cl=0;s.board=s.board.filter(row=>{if(row.every(c=>c)){cl++;return false;}return true;});
      while(s.board.length<ROWS)s.board.unshift(Array(COLS).fill(null));
      if(cl>0){s.score+=[0,100,300,500,800][cl]*s.level;s.lines+=cl;s.level=Math.floor(s.lines/10)+1;}
      s.current=s.next;s.next=rp();
      if(!vld(s.current.cells,s.board)){s.dead=true;onEnd(s.score);}
    };
    const draw=s=>{
      ctx.fillStyle="#060612";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(255,255,255,0.04)";ctx.lineWidth=0.5;
      for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)ctx.strokeRect(c*CELL,r*CELL,CELL,CELL);
      if(s.started){
        let gh={...s.current,cells:s.current.cells.map(c=>[...c])};
        while(vld(gh.cells.map(([x,y])=>[x,y+1]),s.board))gh.cells=gh.cells.map(([x,y])=>[x,y+1]);
        gh.cells.forEach(([x,y])=>{if(y>=0){ctx.strokeStyle=`${s.current.color}35`;ctx.lineWidth=1;ctx.strokeRect(x*CELL+1,y*CELL+1,CELL-2,CELL-2);}});
      }
      s.board.forEach((row,r)=>row.forEach((cell,c)=>{
        if(cell){ctx.fillStyle=cell;ctx.fillRect(c*CELL+1,r*CELL+1,CELL-2,CELL-2);
          ctx.fillStyle="rgba(255,255,255,0.2)";ctx.fillRect(c*CELL+1,r*CELL+1,CELL-2,3);
          ctx.fillStyle="rgba(0,0,0,0.3)";ctx.fillRect(c*CELL+1,r*CELL+CELL-3,CELL-2,2);}
      }));
      if(s.started){s.current.cells.forEach(([x,y])=>{if(y>=0){
        ctx.fillStyle=s.current.color;ctx.shadowColor=s.current.color;ctx.shadowBlur=8;
        ctx.fillRect(x*CELL+1,y*CELL+1,CELL-2,CELL-2);ctx.shadowBlur=0;
        ctx.fillStyle="rgba(255,255,255,0.3)";ctx.fillRect(x*CELL+1,y*CELL+1,CELL-2,3);
      }});}
      ctx.fillStyle=color;ctx.font="bold 11px 'Orbitron'";ctx.fillText(`${s.score}`,4,13);
      ctx.fillStyle="var(--muted)";ctx.font="9px 'Orbitron'";ctx.fillText(`LV${s.level}`,W-28,13);
      if(!s.started){
        ctx.fillStyle="rgba(6,6,18,0.78)";ctx.fillRect(0,0,W,H);
        ctx.fillStyle=color;ctx.font="bold 12px 'Orbitron'";ctx.textAlign="center";
        ctx.fillText(lang==="ru"?"НАЖМИТЕ СТРЕЛКИ":"PRESS ARROW KEYS",W/2,H/2-8);
        ctx.fillText(lang==="ru"?"ДЛЯ СТАРТА":"TO START",W/2,H/2+12);
        ctx.textAlign="left";
      }
    };
    const tick=ts=>{
      if(!active){cancelAnimationFrame(animRef.current);return;}
      const s=stateRef.current;
      if(s.started&&!s.dead){
        const sp=Math.max(100,600-(s.level-1)*60);
        if(ts-dropRef.current>sp){dropRef.current=ts;const mv=s.current.cells.map(([x,y])=>[x,y+1]);if(vld(mv,s.board))s.current.cells=mv;else lock(s);}
      }
      if(!s.dead)draw(s,ts);
      animRef.current=requestAnimationFrame(tick);
    };
    const onKey=e=>{
      const s=stateRef.current;if(!s.started)s.started=true;if(s.dead)return;
      if(e.key==="ArrowLeft"){const m=s.current.cells.map(([x,y])=>[x-1,y]);if(vld(m,s.board))s.current.cells=m;}
      else if(e.key==="ArrowRight"){const m=s.current.cells.map(([x,y])=>[x+1,y]);if(vld(m,s.board))s.current.cells=m;}
      else if(e.key==="ArrowDown"){const m=s.current.cells.map(([x,y])=>[x,y+1]);if(vld(m,s.board)){s.current.cells=m;s.score+=1;}}
      else if(e.key==="ArrowUp"){const r=rot(s.current.cells);if(vld(r,s.board))s.current.cells=r;}
      else if(e.key===" "){while(vld(s.current.cells.map(([x,y])=>[x,y+1]),s.board)){s.current.cells=s.current.cells.map(([x,y])=>[x,y+1]);s.score+=2;}lock(s);e.preventDefault();}
    };
    window.addEventListener("keydown",onKey);
    animRef.current=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(animRef.current);window.removeEventListener("keydown",onKey);};
  },[active]);

  // Touch controls for Tetris
  const touchRef = useRef(null);
  const lastTapRef = useRef(0);

  const handleTouchStart = e => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  };
  const handleTouchEnd = e => {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    const dt = Date.now() - touchRef.current.time;
    const s = stateRef.current;
    if (!s.started) { s.started = true; return; }
    if (s.dead) return;

    // Double tap = hard drop
    const now = Date.now();
    if (dt < 200 && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      if (now - lastTapRef.current < 300) {
        // hard drop
        while(vld(s.current.cells.map(([x,y])=>[x,y+1]),s.board)){s.current.cells=s.current.cells.map(([x,y])=>[x,y+1]);s.score+=2;}
        lock(s);
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;
      // single tap = rotate
      const r = rot(s.current.cells);
      if (vld(r, s.board)) s.current.cells = r;
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      // horizontal swipe
      if (dx > 20) { const m=s.current.cells.map(([x,y])=>[x+1,y]); if(vld(m,s.board))s.current.cells=m; }
      else if (dx < -20) { const m=s.current.cells.map(([x,y])=>[x-1,y]); if(vld(m,s.board))s.current.cells=m; }
    } else {
      // swipe down = soft drop
      if (dy > 20) { const m=s.current.cells.map(([x,y])=>[x,y+1]); if(vld(m,s.board)){s.current.cells=m;s.score+=1;} }
    }
  };

  const doAction = (action) => {
    const s = stateRef.current;
    if (!s) return;
    if (!s.started) { s.started = true; }
    if (s.dead) return;
    if (action==="left")  { const m=s.current.cells.map(([x,y])=>[x-1,y]); if(vld(m,s.board))s.current.cells=m; }
    if (action==="right") { const m=s.current.cells.map(([x,y])=>[x+1,y]); if(vld(m,s.board))s.current.cells=m; }
    if (action==="down")  { const m=s.current.cells.map(([x,y])=>[x,y+1]); if(vld(m,s.board)){s.current.cells=m;s.score+=1;} }
    if (action==="rot")   { const r=rot(s.current.cells); if(vld(r,s.board))s.current.cells=r; }
    if (action==="drop")  { while(vld(s.current.cells.map(([x,y])=>[x,y+1]),s.board)){s.current.cells=s.current.cells.map(([x,y])=>[x,y+1]);s.score+=2;} lock(s); }
  };

  const btnStyle = (bg) => ({
    background: bg+"33", border:`1px solid ${bg}60`, borderRadius:8,
    color: bg, fontFamily:"var(--font-hd)", fontSize:"1.2rem", fontWeight:900,
    padding:"14px 0", flex:1, cursor:"pointer", touchAction:"manipulation",
    WebkitTapHighlightColor:"transparent", userSelect:"none",
  });

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <canvas ref={canvasRef} width={W} height={H} style={{width:"100%",maxWidth:300,display:"block"}}
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}/>
      {/* Mobile controls */}
      <div style={{width:"100%",maxWidth:300,padding:"8px 8px 4px",display:"flex",flexDirection:"column",gap:6}}>
        <div style={{display:"flex",gap:6}}>
          <button style={btnStyle(color)} onTouchStart={e=>{e.preventDefault();doAction("left");}} onClick={()=>doAction("left")}>◄</button>
          <button style={btnStyle("#ff00aa")} onTouchStart={e=>{e.preventDefault();doAction("rot");}} onClick={()=>doAction("rot")}>↻</button>
          <button style={btnStyle(color)} onTouchStart={e=>{e.preventDefault();doAction("right");}} onClick={()=>doAction("right")}>►</button>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button style={{...btnStyle("#ff6b00"),flex:2}} onTouchStart={e=>{e.preventDefault();doAction("down");}} onClick={()=>doAction("down")}>▼</button>
          <button style={{...btnStyle("#ffe500"),flex:1}} onTouchStart={e=>{e.preventDefault();doAction("drop");}} onClick={()=>doAction("drop")}>⬇</button>
        </div>
        <div style={{textAlign:"center",fontFamily:"var(--font-hd)",fontSize:"0.52rem",color:"var(--muted)"}}>
          {lang==="ru"?"◄► движение  ↻ поворот  ▼ вниз  ⬇ сброс":"◄► move  ↻ rotate  ▼ soft  ⬇ drop"}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════
const AVATAR_COLORS = [
  ["#00f5ff","#005a61"],["#ff00aa","#5a003d"],["#ffe500","#5a4e00"],
  ["#00ff88","#005a30"],["#ff6b00","#5a2500"],["#a855f7","#3d1f5a"],
  ["#3a86ff","#0f2a5a"],["#ff3355","#5a0012"],
];

function computeAchievements(scores, userData, allScores) {
  const sc = scores?.scores ?? {};
  const total = computeTotal(sc);
  const games = Object.keys(sc).filter(k => sc[k] > 0);
  const gamesPlayed = userData?.totalGamesPlayed ?? 0;
  const sorted = [...allScores].sort((a,b) => computeTotal(b.scores)-computeTotal(a.scores));
  const rank = sorted.findIndex(s => s.name === userData?.username) + 1;
  const maxAny = Math.max(0, ...Object.values(sc));

  return {
    first_game:   gamesPlayed >= 1,
    score_1000:   maxAny >= 1000,
    score_5000:   maxAny >= 5000,
    all_games:    games.length >= 5,
    top3:         rank >= 1 && rank <= 3 && sorted.length >= 3,
    ten_games:    gamesPlayed >= 10,
    snake_master: (sc.snake ?? 0) >= 1000,
    tetris_god:   (sc.tetris ?? 0) >= 3000,
    memory_ace:   (sc.memory ?? 0) >= 500,
    speedster:    false, // awarded externally via fastest reaction
  };
}

function ProfilePage({ lang, user, users, scores, setUsers, onPlayGame }) {
  const t = T[lang].profile;
  const tp = T[lang];
  const userData = users.find(u => u.username === user.username);
  const userScores = scores.find(s => s.name === user.username) ?? { scores: {} };
  const sc = userScores.scores;
  const total = computeTotal(sc);
  const gamesPlayed = userData?.totalGamesPlayed ?? 0;
  const avgScore = gamesPlayed > 0 ? Math.round(total / gamesPlayed) : 0;

  // Rank
  const sorted = [...scores].sort((a,b) => computeTotal(b.scores)-computeTotal(a.scores));
  const rank = sorted.findIndex(s => s.name === user.username) + 1;

  // Best game
  const bestGameId = Object.entries(sc).sort(([,a],[,b])=>b-a)[0]?.[0] ?? null;
  const bestGame = bestGameId ? GAMES_META.find(g=>g.id===bestGameId) : null;

  // Achievements
  const achieved = computeAchievements(userScores, { ...userData, username: user.username }, scores);

  // Local editable state
  const [bio, setBio] = useState(userData?.bio ?? "");
  const [editingBio, setEditingBio] = useState(false);
  const [avatar, setAvatar] = useState(userData?.avatar ?? "robot");
  const [avatarColor, setAvatarColor] = useState(userData?.avatarColor ?? 0);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [tab, setTab] = useState("stats");

  const saveProfile = (newBio, newAvatar, newAvatarColor) => {
    setUsers(prev => prev.map(u =>
      u.username === user.username
        ? { ...u, bio: newBio ?? bio, avatar: newAvatar ?? avatar, avatarColor: newAvatarColor ?? avatarColor }
        : u
    ));
  };

  const [ac1, ac2] = AVATAR_COLORS[avatarColor % AVATAR_COLORS.length];
  const achKeys = Object.keys(t.achievements);
  const achUnlocked = achKeys.filter(k => achieved[k]).length;

  // XP / level system
  const xp = total + gamesPlayed * 50;
  const level = Math.floor(xp / 2000) + 1;
  const xpInLevel = xp % 2000;
  const xpPct = xpInLevel / 2000;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 20px" }}>

      {/* ── HERO BANNER ── */}
      <div style={{
        position: "relative", borderRadius: 12, overflow: "hidden",
        marginBottom: 28, animation: "slide-up 0.4s both",
        border: "1px solid var(--border)",
        background: `linear-gradient(135deg, ${ac1}22 0%, var(--card) 60%, ${ac2}33 100%)`,
      }}>
        {/* Decorative grid lines */}
        <div style={{ position:"absolute",inset:0, backgroundImage: `linear-gradient(${ac1}15 1px, transparent 1px), linear-gradient(90deg, ${ac1}15 1px, transparent 1px)`, backgroundSize:"32px 32px", pointerEvents:"none" }}/>
        <div style={{ padding: "32px 28px", display:"flex", alignItems:"center", gap:28, flexWrap:"wrap", position:"relative" }}>

          {/* Avatar */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <div onClick={()=>setShowAvatarPicker(v=>!v)} style={{
              width:90, height:90, borderRadius:"50%", cursor:"pointer",
              background:`linear-gradient(135deg, ${ac1}, ${ac2})`,
              border:`3px solid ${ac1}`,
              boxShadow:`0 0 24px ${ac1}60, 0 0 48px ${ac1}20`,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.08)"; e.currentTarget.style.boxShadow=`0 0 36px ${ac1}80`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow=`0 0 24px ${ac1}60`; }}
            ><PixelIconAnimated id={avatar} size={52} glow /></div>
            <div style={{
              position:"absolute", bottom:2, right:2,
              width:22, height:22, borderRadius:"50%",
              background: ac1, border:"2px solid var(--bg)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"0.6rem", color:"#000", fontWeight:900, fontFamily:"var(--font-hd)",
              boxShadow:`0 0 8px ${ac1}`
            }}>✎</div>

            {/* Avatar picker popup */}
            {showAvatarPicker && (
              <div style={{
                position:"absolute", top:100, left:0, zIndex:50,
                background:"var(--bg2)", border:`1px solid ${ac1}60`,
                borderRadius:10, padding:14, width:260,
                boxShadow:`0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${ac1}30`,
                animation:"pop-in 0.2s both"
              }}>
                <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.6rem", color:ac1, letterSpacing:"0.15em", marginBottom:10 }}>
                  {t.avatarTitle}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:12 }}>
                  {AVATAR_PIXEL_IDS.map(pid=>(
                    <button key={pid} onClick={()=>{ setAvatar(pid); saveProfile(undefined,pid,undefined); }}
                      style={{ padding:"8px 4px", borderRadius:6, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                        background: avatar===pid ? `${ac1}30` : "var(--bg3)",
                        border:`1px solid ${avatar===pid ? ac1 : "var(--border)"}`,
                        transition:"all 0.15s" }}>
                      <PixelIcon id={pid} size={28} />
                    </button>
                  ))}
                </div>
                <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.58rem", color:"var(--muted)", marginBottom:6, letterSpacing:"0.1em" }}>COLOR</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {AVATAR_COLORS.map(([c1],i)=>(
                    <button key={i} onClick={()=>{ setAvatarColor(i); saveProfile(undefined,undefined,i); }}
                      style={{ width:22, height:22, borderRadius:"50%", cursor:"pointer",
                        background:c1, border:`2px solid ${avatarColor===i?"#fff":"transparent"}`,
                        boxShadow: avatarColor===i ? `0 0 8px ${c1}` : "none" }}/>
                  ))}
                </div>
                <button onClick={()=>setShowAvatarPicker(false)}
                  style={{ marginTop:10, width:"100%", padding:"6px", background:"var(--bg3)",
                    border:"1px solid var(--border)", borderRadius:4, color:"var(--muted)",
                    fontFamily:"var(--font-hd)", fontSize:"0.62rem", cursor:"pointer" }}>
                  ✕ {lang==="ru"?"ЗАКРЫТЬ":"CLOSE"}
                </button>
              </div>
            )}
          </div>

          {/* Name + level + bio */}
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:6 }}>
              <NeonText color={ac1} size="1.5rem" style={{ letterSpacing:"0.08em" }}>{user.username}</NeonText>
              {user.role==="admin" && <span style={{ fontFamily:"var(--font-hd)", fontSize:"0.65rem", color:"var(--yellow)", background:"var(--yellow)18", border:"1px solid var(--yellow)40", padding:"2px 8px", borderRadius:3 }}>★ ADMIN</span>}
              {rank > 0 && rank <= 3 && (
                <PixelIcon id={["trophy","crown","star"][rank-1]} size={22} color={["#ffe500","#c0c0c0","#cd7f32"][rank-1]} />
              )}
            </div>

            {/* Level + XP bar */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.72rem", color:ac1,
                background:`${ac1}20`, border:`1px solid ${ac1}50`, padding:"2px 10px", borderRadius:3 }}>
                LV {level}
              </div>
              <div style={{ flex:1, maxWidth:200 }}>
                <div style={{ height:5, background:"var(--bg3)", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${xpPct*100}%`, borderRadius:3,
                    background:`linear-gradient(90deg, ${ac1}, ${ac2})`,
                    boxShadow:`0 0 6px ${ac1}`, transition:"width 1s ease" }}/>
                </div>
                <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.55rem", color:"var(--muted)", marginTop:2 }}>
                  {xpInLevel} / 2000 XP
                </div>
              </div>
            </div>

            {/* Bio */}
            {editingBio ? (
              <div style={{ display:"flex", gap:8 }}>
                <input value={bio} onChange={e=>setBio(e.target.value)}
                  maxLength={80}
                  placeholder={t.editBio}
                  style={{ flex:1, padding:"6px 10px", background:"var(--bg2)", border:`1px solid ${ac1}60`,
                    borderRadius:4, color:"var(--text)", fontSize:"0.82rem", outline:"none" }}
                  onKeyDown={e=>{ if(e.key==="Enter"){ setEditingBio(false); saveProfile(bio,undefined,undefined); }}}
                />
                <button onClick={()=>{ setEditingBio(false); saveProfile(bio,undefined,undefined); }}
                  style={{ padding:"6px 12px", background:`${ac1}25`, border:`1px solid ${ac1}`,
                    borderRadius:4, color:ac1, fontFamily:"var(--font-hd)", fontSize:"0.62rem", cursor:"pointer" }}>
                  {t.saveBio}
                </button>
              </div>
            ) : (
              <div onClick={()=>setEditingBio(true)} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color: bio ? "var(--muted)" : "var(--border)", fontSize:"0.82rem", fontStyle: bio?"normal":"italic" }}>
                  {bio || t.editBio}
                </span>
                <span style={{ color: ac1, fontSize:"0.65rem", opacity:0.7 }}>✎</span>
              </div>
            )}
          </div>

          {/* Quick stats right side */}
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            {[
              { label: t.totalScore, value: total.toLocaleString(), color: ac1 },
              { label: t.rank, value: rank > 0 ? `#${rank}` : "—", color: rank===1?"var(--yellow)":rank===2?"#ccc":rank===3?"#cd7f32":ac1 },
              { label: t.gamesPlayed, value: gamesPlayed, color:"var(--green)" },
            ].map(s => (
              <div key={s.label} style={{ textAlign:"center", padding:"12px 16px",
                background:"rgba(0,0,0,0.3)", border:`1px solid ${s.color}30`,
                borderRadius:8, minWidth:80 }}>
                <div style={{ fontFamily:"var(--font-hd)", fontSize:"1.5rem", fontWeight:900,
                  color:s.color, textShadow:`0 0 12px ${s.color}` }}>{s.value}</div>
                <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.56rem", color:"var(--muted)",
                  letterSpacing:"0.1em", marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {[
          { id:"stats",        label: lang==="ru"?"СТАТИСТИКА":"STATS" },
          { id:"records",      label: lang==="ru"?"РЕКОРДЫ":"RECORDS" },
          { id:"achievements", label: `${lang==="ru"?"ДОСТИЖЕНИЯ":"ACHIEVEMENTS"} (${achUnlocked}/${achKeys.length})` },
        ].map(tb=>(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{
            padding:"8px 18px", borderRadius:4, fontFamily:"var(--font-hd)", fontSize:"0.65rem",
            fontWeight:700, letterSpacing:"0.08em", border:"none", cursor:"pointer", transition:"all 0.2s",
            background: tab===tb.id ? `${ac1}22` : "var(--bg2)",
            color: tab===tb.id ? ac1 : "var(--muted)",
            borderBottom: tab===tb.id ? `2px solid ${ac1}` : "2px solid transparent",
          }}>{tb.label}</button>
        ))}
      </div>

      {/* ── STATS TAB ── */}
      {tab==="stats" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16, animation:"slide-up 0.3s both" }}>
          {/* Per-game scores */}
          <div style={{ gridColumn:"1/-1" }}>
            <Card color={`${ac1}30`} style={{ padding:"20px" }}>
              <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.68rem", color:ac1, letterSpacing:"0.15em", marginBottom:16 }}>
                {lang==="ru"?"◈ ПРОГРЕСС ПО ИГРАМ":"◈ GAME PROGRESS"}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {GAMES_META.map(game=>{
                  const score = sc[game.id] ?? 0;
                  const maxScore = Math.max(...scores.map(s=>s.scores[game.id]??0), 1);
                  const pct = score / maxScore;
                  const myRank = [...scores].sort((a,b)=>(b.scores[game.id]??0)-(a.scores[game.id]??0)).findIndex(s=>s.name===user.username)+1;
                  return (
                    <div key={game.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:28, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <PixelIcon id={GAME_PIXEL_ICON[game.id]} size={22} color={score>0?game.color:"var(--muted)"} />
                    </div>
                      <div style={{ width:90, fontFamily:"var(--font-hd)", fontSize:"0.7rem", color:score>0?game.color:"var(--muted)" }}>
                        {tp.gameNames[game.id]}
                      </div>
                      <div style={{ flex:1, height:8, background:"var(--bg2)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct*100}%`, borderRadius:4,
                          background:`linear-gradient(90deg,${game.color},${game.color}80)`,
                          boxShadow:`0 0 6px ${game.color}60`, transition:"width 1s ease" }}/>
                      </div>
                      <div style={{ width:80, textAlign:"right", fontFamily:"var(--font-hd)", fontSize:"0.72rem",
                        color: score>0 ? game.color : "var(--muted)" }}>
                        {score>0 ? score.toLocaleString() : t.noRecord}
                      </div>
                      <div style={{ width:34, textAlign:"right", fontFamily:"var(--font-hd)", fontSize:"0.62rem",
                        color: myRank===1?"var(--yellow)":myRank===2?"#aaa":myRank===3?"#cd7f32":"var(--muted)" }}>
                        {score>0 ? `#${myRank}` : ""}
                      </div>
                      {score>0 && (
                        <button onClick={()=>onPlayGame(game.id)}
                          style={{ padding:"4px 10px", background:`${game.color}20`, border:`1px solid ${game.color}50`,
                            borderRadius:3, color:game.color, fontFamily:"var(--font-hd)", fontSize:"0.58rem",
                            cursor:"pointer", whiteSpace:"nowrap" }}>
                          {lang==="ru"?"ИГРАТЬ":"PLAY"}
                        </button>
                      )}
                      {score===0 && (
                        <button onClick={()=>onPlayGame(game.id)}
                          style={{ padding:"4px 10px", background:"var(--bg2)", border:"1px solid var(--border)",
                            borderRadius:3, color:"var(--muted)", fontFamily:"var(--font-hd)", fontSize:"0.58rem",
                            cursor:"pointer", whiteSpace:"nowrap" }}>
                          {lang==="ru"?"НАЧАТЬ":"START"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Summary cards */}
          {[
            { label:t.totalScore,  value:total.toLocaleString(), iconId:'trophy',  color:ac1 },
            { label:t.gamesPlayed, value:gamesPlayed,             iconId:'gamepad', color:"var(--green)" },
            { label:t.winRate,     value:avgScore.toLocaleString(), iconId:'bolt',  color:"var(--cyan)" },
            { label:t.bestGame,    value:bestGame ? tp.gameNames[bestGame.id] : t.noRecord, iconId: bestGame ? GAME_PIXEL_ICON[bestGame.id] : 'star', color: bestGame?.color ?? "var(--muted)" },
          ].map(s=>(
            <Card key={s.label} color={`${s.color}30`} glow style={{ display:"flex", alignItems:"center", gap:16 }}>
              <PixelIconAnimated id={s.iconId} size={36} color={s.color} glow />
              <div>
                <div style={{ fontFamily:"var(--font-hd)", fontSize:"1.4rem", fontWeight:900,
                  color:s.color, textShadow:`0 0 10px ${s.color}` }}>{s.value}</div>
                <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.58rem", color:"var(--muted)",
                  letterSpacing:"0.1em", marginTop:2 }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── RECORDS TAB ── */}
      {tab==="records" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, animation:"slide-up 0.3s both" }}>
          {GAMES_META.map((game,i)=>{
            const score = sc[game.id] ?? 0;
            const myRank = score>0 ? [...scores].sort((a,b)=>(b.scores[game.id]??0)-(a.scores[game.id]??0)).findIndex(s=>s.name===user.username)+1 : null;
            return (
              <div key={game.id} style={{ animation:`pop-in 0.3s ${i*0.06}s both` }}>
                <Card color={score>0?`${game.color}50`:"var(--border)"} glow={score>0}
                  style={{ textAlign:"center", padding:"24px 16px", cursor:"pointer" }}
                  onClick={()=>onPlayGame(game.id)}>
                  <div style={{ marginBottom:8, display:"flex", justifyContent:"center",
                    filter: score>0?`drop-shadow(0 0 8px ${game.color})`:"grayscale(1) opacity(0.4)" }}>
                    <PixelIconAnimated id={GAME_PIXEL_ICON[game.id]} size={44} color={score>0?game.color:"var(--muted)"} glow={score>0} />
                  </div>
                  <NeonText color={score>0?game.color:"var(--muted)"} size="0.78rem"
                    style={{ display:"block", marginBottom:10 }}>
                    {tp.gameNames[game.id]}
                  </NeonText>
                  {score>0 ? (
                    <>
                      <div style={{ fontFamily:"var(--font-hd)", fontSize:"1.8rem", fontWeight:900,
                        color:game.color, textShadow:`0 0 16px ${game.color}` }}>
                        {score.toLocaleString()}
                      </div>
                      {myRank && (
                        <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.62rem", marginTop:6,
                          color: myRank===1?"var(--yellow)":myRank===2?"#ccc":myRank===3?"#cd7f32":"var(--muted)" }}>
                          {myRank<=3?["🥇","🥈","🥉"][myRank-1]:""} #{myRank} {lang==="ru"?"в рейтинге":"global"}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.75rem", color:"var(--muted)",
                      marginTop:8 }}>{lang==="ru"?"Нет рекорда":"No record yet"}</div>
                  )}
                  <div style={{ marginTop:12 }}>
                    <span style={{ fontFamily:"var(--font-hd)", fontSize:"0.58rem",
                      color: score>0 ? game.color : "var(--muted)",
                      background: score>0 ? `${game.color}15` : "var(--bg2)",
                      border:`1px solid ${score>0?game.color+"40":"var(--border)"}`,
                      padding:"3px 10px", borderRadius:3 }}>
                      {score>0 ? (lang==="ru"?"↻ УЛУЧШИТЬ":"↻ IMPROVE") : (lang==="ru"?"▶ СЫГРАТЬ":"▶ PLAY")}
                    </span>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ACHIEVEMENTS TAB ── */}
      {tab==="achievements" && (
        <div style={{ animation:"slide-up 0.3s both" }}>
          <div style={{ marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1, height:8, background:"var(--bg2)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:4, transition:"width 1s ease",
                width:`${(achUnlocked/achKeys.length)*100}%`,
                background:`linear-gradient(90deg, ${ac1}, ${ac2})`,
                boxShadow:`0 0 8px ${ac1}` }}/>
            </div>
            <span style={{ fontFamily:"var(--font-hd)", fontSize:"0.68rem", color:ac1, whiteSpace:"nowrap" }}>
              {achUnlocked} / {achKeys.length}
            </span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
            {achKeys.map((key,i)=>{
              const ach = t.achievements[key];
              const unlocked = achieved[key];
              return (
                <div key={key} style={{ animation:`pop-in 0.3s ${i*0.04}s both` }}>
                  <Card color={unlocked?`${ac1}50`:"var(--border)"}
                    glow={unlocked}
                    style={{ display:"flex", gap:14, alignItems:"center", padding:"14px 16px",
                      opacity: unlocked ? 1 : 0.45,
                      filter: unlocked ? "none" : "grayscale(0.6)" }}>
                    <div style={{
                      width:44, height:44, borderRadius:"50%", flexShrink:0,
                      background: unlocked ? `linear-gradient(135deg,${ac1}60,${ac2}40)` : "var(--bg2)",
                      border:`1px solid ${unlocked?ac1:"var(--border)"}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow: unlocked ? `0 0 14px ${ac1}50` : "none"
                    }}>
                      <PixelIcon id={ACH_PIXEL_ICON[key] ?? 'star'} size={28} color={unlocked ? ac1 : "#555577"} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.72rem", fontWeight:700,
                        color: unlocked ? ac1 : "var(--muted)",
                        textShadow: unlocked ? `0 0 6px ${ac1}` : "none",
                        marginBottom:3 }}>{ach.name}</div>
                      <div style={{ fontSize:"0.7rem", color:"var(--muted)", lineHeight:1.3 }}>{ach.desc}</div>
                      {unlocked && <div style={{ fontFamily:"var(--font-hd)", fontSize:"0.55rem", color:ac1, marginTop:4, letterSpacing:"0.1em" }}>✓ {lang==="ru"?"ПОЛУЧЕНО":"UNLOCKED"}</div>}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [lang, setLang] = useState("ru");
  const [page, setPage] = useState("home");
  const [playingGame, setPlayingGame] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([
    { username:"ADMIN", password:"admin2024", role:"admin", banned:false, totalGamesPlayed:0 },
    ...SEED_USERS
  ]);
  const [scores, setScores] = useState(SEED_SCORES);
  const [motd, setMotd] = useState("");

  const handleLogin = (u) => { setUser(u); setPage("home"); };
  const handleRegister = (newUser) => {
    setUsers(prev=>[...prev,newUser]);
    setScores(prev=>[...prev,{name:newUser.username,scores:{}}]);
    setUser(newUser);setPage("home");
  };
  const handleLogout = () => { setUser(null); setPage("home"); setPlayingGame(null); };
  const handlePlayGame = (id) => { setPlayingGame(id); setPage("game"); };
  const handleBack = () => { setPlayingGame(null); setPage("home"); };
  const handleSubmitScore = (gameId, score) => {
    if(!user)return;
    setScores(prev=>{
      const ex=prev.find(p=>p.name===user.username);
      if(ex)return prev.map(p=>p.name===user.username?{...p,scores:{...p.scores,[gameId]:Math.max(p.scores[gameId]??0,score)}}:p);
      return [...prev,{name:user.username,scores:{[gameId]:score}}];
    });
    setUsers(prev=>prev.map(u2=>u2.username===user.username?{...u2,totalGamesPlayed:(u2.totalGamesPlayed??0)+1}:u2));
  };

  // If not logged in → show auth
  if(!user) return (
    <>
      <GlobalStyles/>
      <div className="scanline"/>
      <div style={{minHeight:"100vh",animation:"flicker 8s infinite"}}>
        {/* Lang toggle on auth screen */}
        <div style={{position:"fixed",top:14,right:18,zIndex:200}}>
          <button onClick={()=>setLang(l=>l==="en"?"ru":"en")} style={{
            padding:"6px 12px",border:"1px solid var(--border)",borderRadius:4,
            background:"var(--bg2)",color:"var(--text)",fontFamily:"var(--font-hd)",
            fontSize:"0.68rem",cursor:"pointer"}}>
            {lang==="en"?"🇷🇺 RU":"🇺🇸 EN"}
          </button>
        </div>
        <AuthPage lang={lang} users={users} onLogin={handleLogin} onRegister={handleRegister}/>
      </div>
    </>
  );

  const navSetPage = (p) => { setPlayingGame(null); setPage(p); };

  return (
    <>
      <GlobalStyles/>
      <div className="scanline"/>
      <div style={{minHeight:"100vh",animation:"flicker 8s infinite"}}>
        <Header page={page} setPage={navSetPage} user={user} lang={lang} setLang={setLang}
          onLogout={handleLogout} motd={motd}/>
        {page==="home"        && <HomePage lang={lang} user={user} scores={scores} onPlayGame={handlePlayGame}/>}
        {page==="leaderboard" && <LeaderboardPage lang={lang} scores={scores} user={user}/>}
        {page==="profile"     && <ProfilePage lang={lang} user={user} users={users} setUsers={setUsers} scores={scores} onPlayGame={handlePlayGame}/>}
        {page==="admin" && user?.role==="admin" && (
          <AdminPanel lang={lang} users={users} setUsers={setUsers}
            scores={scores} setScores={setScores} motd={motd} setMotd={setMotd}/>
        )}
        {page==="game" && playingGame && (
          <GameWrapper gameId={playingGame} user={user} lang={lang}
            onBack={handleBack} onSubmitScore={handleSubmitScore}/>
        )}
      </div>
    </>
  );
}
