# ТЕХНИЧЕСКАЯ ДОКУМЕНТАЦИЯ
## Arcade Vault — Браузерная аркадная игровая платформа
### Дипломная работа

---

> **Версия документа:** 1.0  
> **Язык:** Русский / English  
> **Объём кода:** ~3 200 строк (один файл)  
> **Платформа:** Web (SPA, React 18)

---

# ЧАСТЬ I — РУССКИЙ

---

## 1. Введение

### 1.1 Актуальность работы

Браузерные игровые платформы занимают значительную долю рынка интерактивных веб-приложений. Разработка подобной системы требует одновременного применения широкого спектра технологий: реактивных UI-фреймворков, низкоуровневой графики, алгоритмов игровой логики, систем аутентификации и интернационализации.

Данная дипломная работа представляет собой реализацию полнофункциональной аркадной платформы «Arcade Vault», объединяющей перечисленные технические аспекты в единое когерентное приложение.

### 1.2 Цели и задачи

**Цель работы:** разработка многопользовательской браузерной игровой платформы с использованием современных фронтенд-технологий.

**Задачи:**
1. Спроектировать компонентную архитектуру SPA без серверной части
2. Реализовать пять аркадных мини-игр с применением Canvas API
3. Разработать систему аутентификации с ролевой моделью доступа
4. Реализовать интерфейс на двух языках (i18n) без сторонних библиотек
5. Создать процедурный анимированный фон с применением WebGL/GLSL
6. Разработать систему профилей с достижениями и прогрессией
7. Реализовать административную панель управления

### 1.3 Предметная область

Платформа включает следующие функциональные домены:
- **Управление пользователями:** регистрация, аутентификация, ролевая модель
- **Игровой движок:** пять отдельных игровых механик на Canvas
- **Социальная составляющая:** таблица рекордов, профили, достижения
- **Администрирование:** управление пользователями, статистика, рассылка

---

## 2. Технологический стек и его обоснование

### 2.1 Основной фреймворк — React 18

React выбран как основной инструмент разработки по следующим основаниям:

**Декларативность.** React позволяет описывать желаемое состояние интерфейса, а не последовательность DOM-манипуляций. Это особенно важно при реализации сложных состояний (профиль игрока, административная панель), где синхронизация UI с данными вручную привела бы к значительному усложнению кода.

**Хуки как замена классовой архитектуре.** Версия 18 предоставляет зрелую систему хуков (`useState`, `useEffect`, `useRef`, `useCallback`), позволяющую инкапсулировать логику в функциональных компонентах. Это обеспечивает хорошую читаемость и переиспользуемость кода.

**Сосуществование реактивного и императивного стилей.** Игровые движки требуют императивного управления (`requestAnimationFrame`, прямая работа с Canvas-контекстом), тогда как UI требует декларативного подхода. React обеспечивает их корректное сосуществование через `useRef` и `useEffect`.

**Распространённость.** React является наиболее популярным UI-фреймворком по данным ежегодного опроса State of JS, что обеспечивает широкую документацию и сообщество.

**Альтернативы и причины отказа:**
- *Vue 3* — сопоставимые возможности, но меньшее распространение в enterprise-разработке
- *Angular* — избыточная для SPA без backend архитектура
- *Svelte* — компилируемый подход, но меньшая распространённость

### 2.2 Инструмент сборки — Vite 5

Vite выбран вместо традиционного Create React App (CRA) по следующим причинам:

- **Скорость запуска:** Vite использует нативные ES-модули браузера в dev-режиме, что обеспечивает старт dev-сервера менее чем за 1 секунду против 15–30 секунд у CRA/Webpack
- **HMR (Hot Module Replacement):** мгновенное обновление изменённых модулей без полной перезагрузки страницы
- **Rollup-based сборка:** оптимизированный production-бандл с tree-shaking

### 2.3 Canvas API для игровой графики

Canvas API применяется для реализации трёх из пяти игр (Snake, Flappy Bird, Tetris), требующих покадровой отрисовки произвольной сложности.

**Преимущества перед DOM-подходом:**
- Единый растровый буфер вместо тысяч DOM-элементов
- Прямой доступ к пикселям без вычисления layout и reflow
- Поддержка 2D-трансформаций (вращение птицы), радиальных градиентов, теней
- Производительность 60 FPS при отрисовке сотен объектов

**Применение в проекте:**
- Snake: 22×18 ячеек, каждый кадр — полная перерисовка сетки, тела змейки, яблока
- Flappy Bird: птица с анимацией крыла, трубы с градиентами, звёздный фон
- Tetris: игровое поле 10×20, блоки с градиентами, ghost piece

### 2.4 WebGL и GLSL для фонового эффекта

На экране авторизации реализован анимированный фон с применением WebGL 1.0 и языка шейдеров GLSL.

**Алгоритм шейдера:**

```
1. Fractional Brownian Motion (fBm):
   Сложение нескольких октав шума Перлина с убывающей амплитудой.
   Создаёт органичную турбулентность.

2. Метаболы (Metaballs):
   Три точечных источника поля f(x) = 1/distance.
   Когда сумма полей превышает порог — граница "оплавляется".
   Позиции источников анимированы по формулам Лиссажу.

3. Взаимодействие с курсором:
   Мышиный ввод деформирует поле через ripple-функцию:
   force = velocity × exp(-distance × 5)

4. Постобработка:
   Виньетирование, scanline-эффект, затемнение для удобства чтения.
```

**Почему не CSS/SVG?** CSS-анимации и SVG-фильтры не позволяют реализовать попиксельные вычисления на GPU в реальном времени. Эквивалентный эффект на CSS потребовал бы сотен элементов и работал бы на CPU с неприемлемой производительностью.

### 2.5 SVG для пиксельных иконок

Все иконки приложения реализованы как SVG, генерируемые из 16×16 текстовых масок:

```javascript
// Описание иконки — текстовая маска 16×16
// '.' = прозрачно, буква = пиксель нужного цвета
const icon = {
  rows: [
    '......aaa.......',
    '.....aaaaa......',
    // ...
  ],
  palette: { a: '#00f5ff', b: '#0088aa' }
};

// Генерация SVG: каждый символ → <rect> с нужными координатами
rows.forEach((row, ry) => {
  [...row].forEach((ch, cx) => {
    if (ch !== '.') pixels.push(
      <rect x={cx*scale} y={ry*scale} width={scale} height={scale} fill={palette[ch]} />
    );
  });
});
```

**Преимущества подхода:**
- Полный контроль над внешним видом (в отличие от системных emoji)
- Единый визуальный стиль на всех ОС и браузерах
- Масштабируемость без потери качества
- Динамическая перекраска через props (`color` заменяет первичный цвет `a`)
- Нет зависимости от CDN или внешних ресурсов

---

## 3. Архитектура приложения

### 3.1 Структура компонентов

```
App (root)
│
├── GlobalStyles          — CSS переменные и анимации
│
├── AuthPage              — экран входа/регистрации
│   └── LiquidEtherBG     — WebGL-компонент
│
├── Header                — навигация, переключатель языка
│
├── HomePage              — сетка игр, топ-3 игроков
│
├── LeaderboardPage       — таблица рекордов с фильтрами
│
├── ProfilePage           — профиль игрока
│   ├── [Вкладка Stats]   — прогресс по играм
│   ├── [Вкладка Records] — личные рекорды
│   └── [Вкладка Achievements] — система достижений
│
├── AdminPanel            — административная панель
│   ├── [Вкладка Users]   — управление пользователями
│   ├── [Вкладка Stats]   — статистика платформы
│   └── [Вкладка Manage]  — рассылка, сброс данных
│
└── GameWrapper           — обёртка для игр
    ├── SnakeGame         — Canvas-игра "Змейка"
    ├── FlappyGame        — Canvas-игра "Флаппи"
    ├── MemoryGame        — React-игра "Память"
    ├── PongGame          — Canvas-игра "Понг"
    └── TetrisGame        — Canvas-игра "Тетрис"
```

### 3.2 Глобальное состояние

Приложение не использует внешние библиотеки управления состоянием. Всё состояние хранится в корневом компоненте `App` и передаётся через props:

```javascript
// Схема данных пользователя
User = {
  username: string,          // уникальный идентификатор
  password: string,          // хранится в памяти (не хешируется — учебный проект)
  role: 'user' | 'admin',    // ролевая модель
  banned: boolean,           // флаг блокировки
  totalGamesPlayed: number,  // счётчик партий
  bio: string,               // биография (до 80 символов)
  avatar: string,            // ID пиксельного аватара
  avatarColor: number,       // индекс цветовой схемы (0–7)
}

// Схема рекордов
ScoreRecord = {
  name: string,              // username игрока
  scores: {
    snake: number,
    flappy: number,
    memory: number,
    pong: number,
    tetris: number,
  }
}
```

### 3.3 Паттерн игрового цикла

Canvas-игры используют паттерн **ref-based game loop**, изолирующий игровое состояние от React-рендеринга:

```javascript
function SnakeGame({ onEnd, active }) {
  const canvasRef   = useRef(null);  // Canvas DOM-узел
  const stateRef    = useRef(null);  // игровое состояние (не вызывает ре-рендер)
  const animRef     = useRef(null);  // ID текущего RAF
  const activeRef   = useRef(active); // актуальный флаг без пересоздания замыкания

  useEffect(() => {
    stateRef.current = initState(); // инициализация один раз при монтировании

    const tick = (timestamp) => {
      // 1. обновление состояния (физика, коллизии, очки)
      updateGameState(stateRef.current, timestamp);
      // 2. отрисовка текущего кадра
      draw(canvas.getContext('2d'), stateRef.current);
      // 3. планирование следующего кадра
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    // cleanup при unmount
    return () => cancelAnimationFrame(animRef.current);
  }, []); // [] — запускается один раз
}
```

**Ключевой принцип:** изменение `stateRef.current` не вызывает рендер React — перерисовка canvas происходит независимо от React reconciliation.

### 3.4 Решение проблемы устаревших замыканий

Ранее в игровых компонентах использование `useState` для счётчиков внутри `setTimeout`-коллбэков приводило к stale closure — функция видела устаревшие значения переменных.

**Проблема:**
```javascript
// ❌ Неправильно — score захвачен при создании useCallback
const startRound = useCallback(() => {
  setTimeout(() => {
    if (round >= MAX) onEnd(score); // round и score — устаревшие!
  }, delay);
}, []); // пустые зависимости
```

**Решение:**
```javascript
// ✅ Правильно — refs всегда актуальны
const scoreRef = useRef(0);
const roundRef = useRef(0);

const startRound = useCallback(() => {
  setTimeout(() => {
    if (roundRef.current >= MAX) onEnd(scoreRef.current); // всегда актуально
  }, delay);
}, []); // стабильная ссылка на функцию
```

### 3.5 Система интернационализации (i18n)

Переводы хранятся в объекте `T` с двумя ключами (`en`, `ru`). Текущий язык передаётся через props:

```javascript
const T = {
  en: {
    appName: "ARCADE VAULT",
    nav: { arcade: "ARCADE", rankings: "RANKINGS", ... },
    gameNames: { snake: "SNAKE", flappy: "FLAPPY", ... },
    hints: { snake: ["← → ↑ ↓ or WASD", "Eat to grow", ...] },
    // ...
  },
  ru: {
    appName: "АРКАД ВОЛТ",
    nav: { arcade: "АРКАДА", rankings: "РЕЙТИНГ", ... },
    // ...
  }
};

// Использование в компонентах:
function Header({ lang }) {
  const t = T[lang]; // выбор объекта перевода
  return <nav>{t.nav.arcade}</nav>;
}
```

---

## 4. Описание игровых модулей

### 4.1 Snake — «Змейка»

**Игровая логика:**

Поле 22×18 клеток. Каждые `speed` мс змейка двигается на одну клетку в направлении `dir`. Условие проигрыша: выход за границы или столкновение с собственным телом.

```
Подсчёт очков: score += 10 + floor(score / 50)
Ускорение:     speed = max(60, speed - 3) мс за каждое яблоко
Начальная скорость: 150 мс/шаг (≈ 6.7 шагов/сек)
Максимальная:       60 мс/шаг (≈ 16.7 шагов/сек)
```

**Графика змейки:**

Голова, тело и хвост рисуются отдельными функциями:

- `drawHead(head, dir)`: радиальный градиент, глаза с зрачком-щелью, мигающий раздвоенный язык
- `drawSegment(seg, i, total)`: круг с 3D-градиентом, прозрачность `alpha = 1 - (i/total) × 0.55`, декоративные чешуйки
- `drawTail(tail)`: уменьшенный круг, `alpha = 0.45`
- `drawFood(food, t)`: красное яблоко с бликом, листиком и покачиванием `y += sin(t×0.003)×2`

### 4.2 Flappy Bird — «Флаппи»

**Физическая модель:**

```
Каждый кадр (≈16.6 мс при 60 FPS):
  bird.vy += GRAVITY   (GRAVITY = 0.42 px/кадр²)
  bird.y  += bird.vy

При нажатии:
  bird.vy = JUMP       (JUMP = -8 px/кадр)

Угол поворота:
  angle = clamp(vy × 3.5, -50°, 75°)
```

**Генерация труб:**

Трубы спавнятся не по таймеру, а по расстоянию — когда последняя труба прошла более 220px от правого края. Это обеспечивает стабильные интервалы независимо от частоты кадров.

```
Зазор: GAP = 130px
Скорость: 2.8 px/кадр
Вертикальная позиция: случайная в диапазоне [60, H-GAP-120]
```

### 4.3 Memory — «Память»

**Механика:**

16 карточек (8 пар), перемешанных случайно. Игрок открывает по 2 карточки. Если символы совпадают — пара остаётся открытой. Если нет — карточки закрываются через 800 мс. Ввод заблокирован на время анимации.

```
Подсчёт очков:
  Совпадение:   +100 очков
  Ошибка:        -5 очков (не ниже 0)
  Бонус по итогу: +20 × оставшихся_секунд

Время: 60 секунд
```

**Отличие от Canvas-игр:** Memory реализована на React-компонентах (не Canvas), так как состояние карточек хорошо описывается React-моделью.

### 4.4 Pong — «Понг»

**Механика:**

Классический Pong — отбивай мяч ракеткой, не давай ему упасть вниз. 3 жизни.

```
Подсчёт очков: +10 + combo за каждый удар
Комбо:  каждые 5 ударов скорость мяча увеличивается
Скорость начальная: 3.5 px/кадр
Максимальная:       ~6+ px/кадр (растёт бесконечно)

Угол отскока от ракетки:
  vx = (hitPos / paddleHalfWidth) × 5
  затем нормализуется до текущей скорости
```

**Управление:** мышь (ПК) или палец (телефон) по горизонтали.

**Технические особенности:**
- Canvas API, `requestAnimationFrame`, `mousemove` + `touchmove` на одном элементе
- Частицы при каждом ударе (`spawnParticles`)
- Масштабирование координат мыши: `scaleX = W / rect.width`

### 4.5 Tetris — «Тетрис»

**Фигуры (тетромино):**

Все 7 стандартных тетромино (I, O, T, S, Z, J, L) с матрицами вращения.

**Ghost piece:**

Полупрозрачная копия текущей фигуры показывает позицию падения:

```javascript
// Вычисление ghost position:
let ghostY = piece.y;
while (!collision(board, piece, ghostY + 1)) ghostY++;
// Отрисовка с alpha = 0.2
```

**Подсчёт очков:**

```
1 линия:  100 очков
2 линии:  300 очков
3 линии:  500 очков
4 линии:  800 очков (Tetris)
Скорость: увеличивается каждые 10 линий
```

---

## 5. Дизайн-система

### 5.1 Цветовая палитра

| Переменная | Значение | Применение |
|---|---|---|
| `--cyan` | `#00f5ff` | Цвет Flappy Bird, акценты |
| `--magenta` | `#ff00aa` | Цвет Memory, кнопки |
| `--yellow` | `#ffe500` | Цвет Pong, достижения |
| `--green` | `#00ff88` | Цвет Snake, статус онлайн |
| `--orange` | `#ff6b00` | Цвет Tetris |
| `--red` | `#ff3355` | Ошибки, бан |
| `--bg` | `#060612` | Основной фон |
| `--card` | `#12122a` | Фон карточек |

### 5.2 Типографика

- **Orbitron** (Google Fonts, weight 400/700/900): заголовки, HUD, навигация — создаёт футуристический облик
- **Exo 2** (Google Fonts, weight 300/400/600/700): основной текст, описания — высокая читаемость при малых размерах

### 5.3 Анимации

Все анимации реализованы через CSS-keyframes:

| Анимация | Применение |
|---|---|
| `glow-pulse` | Пульсация неонового текста (заголовок, активная игра) |
| `slide-up` | Появление элементов при загрузке страницы |
| `pop-in` | Появление карточек достижений, результатов |
| `float` | Левитация иконок при наведении |
| `flicker` | Мерцание экрана (имитация ЭЛТ-монитора) |
| `banner-in` | Появление MOTD-баннера |

---

## 6. Система достижений

| ID | Название | Условие |
|---|---|---|
| `first_game` | Первая кровь | `gamesPlayed >= 1` |
| `score_1000` | Четыре цифры | `max(scores) >= 1000` |
| `score_5000` | Хай Роллер | `max(scores) >= 5000` |
| `all_games` | Перфекционист | сыграл во все 5 игр |
| `top3` | Пьедестал | место в рейтинге ≤ 3 |
| `ten_games` | Задрот | `gamesPlayed >= 10` |
| `snake_master` | Мастер Змейки | `scores.snake >= 1000` |
| `tetris_god` | Бог Тетриса | `scores.tetris >= 3000` |
| `memory_ace` | Память Слона | `scores.memory >= 500` |
| `pong_ace` | Мастер Понга | 1000+ очков в Pong |

---

## 7. Ограничения и направления развития

### 7.1 Текущие ограничения

- **Отсутствие персистентности:** данные хранятся в памяти и сбрасываются при перезагрузке страницы. В production-системе необходима интеграция с базой данных.
- **Отсутствие хеширования паролей:** пароли хранятся в открытом виде — допустимо для учебного проекта, недопустимо в production.
- **Нет сетевой игры:** рейтинг между реальными пользователями возможен только при наличии backend.
- **Один файл:** весь код (~3 200 строк) в одном файле удобен для демонстрации, но противоречит принципам масштабируемой архитектуры.

### 7.2 Направления развития

- Добавление REST API или Firebase для персистентного хранения данных
- Разбивка на модули: отдельные файлы для каждой игры, компонента и утилит
- Добавление TypeScript для статической типизации
- Реализация WebSocket для онлайн-рейтинга в реальном времени
- Расширение до 10+ игр
- Мобильное приложение на React Native с переиспользованием логики

---

## 8. Выводы

В ходе дипломной работы разработана функционально полная браузерная игровая платформа, демонстрирующая:

1. **Архитектурные решения:** многоуровневая компонентная структура SPA, управление состоянием через контекст props без внешних библиотек
2. **Работу с Canvas API:** три игры с покадровой отрисовкой, реализация физики, коллизий, анимации на уровне пикселей
3. **WebGL-программирование:** разработка GLSL-шейдера с алгоритмами метаболов и fBm-шума
4. **Решение React-специфичных задач:** устранение stale closures, паттерн ref-based game loop, разделение реактивного и императивного кода
5. **UX и дизайн:** целостная дизайн-система, адаптивная вёрстка, pixel art иконки, i18n

Проект достигает поставленных целей и может служить основой для разработки полноценной production-платформы при добавлении серверной части.

---

---

# PART II — ENGLISH

---

## 1. Introduction

### 1.1 Project Overview

Arcade Vault is a fully functional browser-based arcade gaming platform developed as a graduation project. The system demonstrates practical application of modern front-end technologies — React 18, Canvas API, WebGL/GLSL, and SVG — without any back-end infrastructure.

### 1.2 Goals and Objectives

**Goal:** Develop a multi-user browser gaming platform using modern front-end technologies.

**Objectives:**
1. Design a component-based SPA architecture without a server side
2. Implement five arcade mini-games using the Canvas API
3. Develop an authentication system with role-based access control
4. Build a two-language interface (i18n) without third-party libraries
5. Create a procedural animated background using WebGL/GLSL
6. Implement a player profile system with achievements and progression
7. Build an administrative management panel

---

## 2. Technology Stack Rationale

### 2.1 React 18

React was selected as the primary development tool for the following reasons:

**Declarative paradigm.** React enables describing the desired UI state rather than sequences of DOM mutations. This is critical for complex state scenarios (player profile, admin panel) where manual DOM synchronization would introduce significant complexity.

**Hooks system.** The mature hooks API (`useState`, `useEffect`, `useRef`, `useCallback`) enables logic encapsulation within functional components, providing good readability and reusability.

**Coexistence of reactive and imperative styles.** Game engines require imperative control (`requestAnimationFrame`, direct Canvas context manipulation), while the UI requires a declarative approach. React enables their correct coexistence through `useRef` and `useEffect`.

### 2.2 Canvas API

Canvas API is used for three of the five games (Snake, Flappy Bird, Tetris) requiring per-frame rendering:

- Single raster buffer vs. thousands of DOM elements
- Direct pixel access without layout/reflow calculations
- Support for 2D transforms, radial gradients, drop shadows
- 60 FPS performance when rendering hundreds of objects

### 2.3 WebGL / GLSL

The authentication screen features an animated background implemented with WebGL 1.0 and GLSL shaders. The algorithm combines:

1. **Fractional Brownian Motion (fBm):** Summing multiple octaves of Perlin noise with decreasing amplitude, creating organic turbulence
2. **Metaballs algorithm:** Three point sources generating fields `f(x) = 1/distance`; when the field sum exceeds a threshold, boundaries "melt" together
3. **Mouse interaction:** Cursor position deforms the field via a ripple function `force = velocity × exp(-distance × 5)`

CSS animations cannot achieve equivalent per-pixel GPU computation in real time.

### 2.4 SVG Pixel Art Icons

All application icons are SVG elements generated from 16×16 text masks. Each character in a row string maps to a colored `<rect>` in the SVG. This provides:

- Consistent rendering across all OSes and browsers (vs. system emoji)
- Dynamic recoloring via props (primary color `a` is overridden)
- Infinite scalability without quality loss
- Zero external CDN dependency

---

## 3. Architecture

### 3.1 Component Hierarchy

```
App (root state manager)
├── GlobalStyles          — CSS variables and keyframe animations
├── AuthPage              — Login/registration screen
│   └── LiquidEtherBG     — WebGL shader component
├── Header                — Navigation, language toggle
├── HomePage              — Game grid, top-3 players
├── LeaderboardPage       — Score table with filters
├── ProfilePage           — Player profile with three tabs
├── AdminPanel            — Admin management with three tabs
└── GameWrapper           — Game container + overlay
    ├── SnakeGame         — Canvas game
    ├── FlappyGame        — Canvas game
    ├── MemoryGame        — React component game
    ├── PongGame          — Canvas game
    └── TetrisGame        — Canvas game
```

### 3.2 Game Loop Pattern

Canvas games use a **ref-based game loop** that isolates game state from React rendering:

```javascript
useEffect(() => {
  stateRef.current = initState(); // initialize once on mount

  const tick = (timestamp) => {
    update(stateRef.current, timestamp); // physics, collisions, scoring
    draw(ctx, stateRef.current);          // render current frame
    animRef.current = requestAnimationFrame(tick); // schedule next frame
  };

  animRef.current = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(animRef.current); // cleanup
}, []); // run once
```

Mutating `stateRef.current` does not trigger React re-renders — canvas drawing happens independently of the React reconciliation cycle.

### 3.3 Stale Closure Solution

Using `useState` for score/round inside `setTimeout` callbacks caused stale closures — the function captured outdated variable values.

**Solution:** All mutable game counters are stored in `useRef` objects, which always hold current values without needing to be listed as `useCallback` dependencies.

### 3.4 i18n Implementation

All UI strings are stored in a single `T` object with `en` and `ru` keys. The current language is passed as a prop through the component tree. No external library is needed — the pattern is simple, performant, and fully type-checkable.

---

## 4. Game Modules

### 4.1 Snake
- **Grid:** 22×18 cells, cell size 22px → 484×396px canvas
- **Physics:** discrete grid movement, delta-time interval control
- **Scoring:** `+10 + floor(score/50)` per apple, speed increases per apple
- **Graphics:** distinct head/body/tail rendering with 3D gradients, animated tongue, bobbing apple

### 4.2 Flappy Bird
- **Physics:** `vy += 0.42` gravity, `vy = -8` on jump, angle from velocity
- **Pipes:** distance-based spawning (not timer), `gap = 130px`, `speed = 2.8px/frame`
- **Bird:** animated wing, eyes with slit pupil, colored beak

### 4.3 Memory
- **Cards:** 8 pairs of pixel art icons, shuffled on start
- **Timing:** 60s limit, input locked 400ms (match) / 800ms (mismatch)
- **Scoring:** `+100` match, `-5` mismatch, `+20×remaining_seconds` completion bonus

### 4.4 Pong
- **Mechanics:** bounce ball off walls with a paddle, 3 lives
- **Controls:** mouse (desktop) or finger touch (mobile), horizontal movement
- **Scoring:** `+10 + combo` per hit, speed increases every 5 hits
- **Angle:** `vx = (hitPos / paddleHalfWidth) × 5`, then normalized to current speed
- **Architecture:** Canvas API, `mousemove` + `touchmove`, particle effects on hit

### 4.5 Tetris
- **Pieces:** all 7 standard tetrominoes with rotation matrices
- **Ghost piece:** transparent preview of drop position
- **Scoring:** 100/300/500/800 for 1/2/3/4 lines, speed increases every 10 lines

---

## 5. Conclusions

The graduation project successfully achieves all stated objectives, delivering:

- A complete multi-user browser gaming platform
- Five arcade games with distinct mechanics and polished graphics
- Authenticated user system with role-based access control
- Fully bilingual interface (RU/EN) with no external i18n library
- WebGL procedural animation demonstrating GPU shader programming
- Hand-crafted pixel art icon system with dynamic recoloring
- Player progression system with achievements, XP, and leaderboard

The project serves as a practical demonstration of modern front-end engineering, combining reactive UI development with real-time graphics programming in a single cohesive application.
