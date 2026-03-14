# 🎮 ARCADE VAULT
## 🚀 Live Demo
**[▶ Играть онлайн / Play Online](https://arcade-vault.netlify.app/)**
<div align="center">
  
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![WebGL](https://img.shields.io/badge/WebGL-Canvas_API-990000?style=for-the-badge&logo=webgl&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Arcade Vault** — многопользовательская браузерная игровая платформа с пятью аркадными играми, системой аутентификации, профилями игроков, таблицей рекордов и административной панелью.

[🇷🇺 Русский](#русский) · [🇺🇸 English](#english)

</div>


---

# Русский

## 📋 Содержание

- [О проекте](#о-проекте)
- [Технологический стек](#технологический-стек)
- [Архитектура](#архитектура)
- [Функциональность](#функциональность)
- [Установка и запуск](#установка-и-запуск)
- [Структура проекта](#структура-проекта)
- [Игры](#игры)
- [Система аутентификации](#система-аутентификации)
- [Профиль игрока](#профиль-игрока)
- [Административная панель](#административная-панель)
- [Тестовые аккаунты](#тестовые-аккаунты)

---

## О проекте

**Arcade Vault** — это дипломный проект, представляющий собой полнофункциональную веб-платформу для браузерных аркадных игр. Проект разработан с использованием современного стека фронтенд-технологий без применения серверной части: всё состояние приложения управляется на стороне клиента средствами React.

Платформа демонстрирует практическое применение следующих концепций:
- компонентный подход к разработке пользовательского интерфейса;
- управление состоянием без внешних библиотек (Redux, Zustand и др.);
- программная графика средствами Canvas API и WebGL;
- интернационализация (i18n) без сторонних фреймворков;
- ролевая модель доступа (RBAC) на клиентской стороне.

---

## Технологический стек

| Технология | Версия | Назначение |
|---|---|---|
| **React** | 18.x | UI-фреймворк, управление состоянием |
| **Vite** | 5.x | Сборщик и dev-сервер |
| **Canvas API** | — | Отрисовка игровой графики (Snake, Flappy, Tetris) |
| **WebGL** | 1.0 | Процедурный фоновый шейдер (экран входа) |
| **GLSL** | — | Фрагментный шейдер с алгоритмом метаболов + fBm-турбулентность |
| **SVG** | — | Система пиксельных иконок (16×16) |
| **CSS Variables** | — | Дизайн-токены, цветовая система |
| **Google Fonts** | — | Orbitron (заголовки), Exo 2 (основной текст) |

### Обоснование выбора технологий

**React** выбран как наиболее распространённый в индустрии UI-фреймворк с концепцией декларативного рендеринга. Хуки (`useState`, `useEffect`, `useRef`, `useCallback`) позволяют управлять как реактивным состоянием UI, так и императивной логикой игровых циклов без смешения парадигм.

**Canvas API** используется для игр требующих покадровой отрисовки (Snake, Flappy Bird, Tetris), так как прямая работа с растровым буфером обеспечивает производительность 60 FPS при минимальных накладных расходах по сравнению с DOM-манипуляциями.

**WebGL** применён для процедурного анимированного фона на экране авторизации. GLSL-шейдер реализует алгоритм метаболов (metaballs) в сочетании с фрактальным броуновским движением (fBm), что невозможно реализовать средствами CSS с сопоставимой производительностью.

**Vite** выбран вместо Create React App как более производительный инструмент сборки, использующий нативные ES-модули в dev-режиме.

---

## Архитектура

Приложение построено по принципу **монолитного SPA** (Single Page Application) с явным разделением на слои:

```
┌─────────────────────────────────────────────────────────┐
│                    ROOT APP (App)                        │
│  Глобальное состояние: user, page, scores, users, motd  │
└────────────┬────────────────────────────────────────────┘
             │ props / callbacks
    ┌────────┴────────────────────────────────────────┐
    │              СТРАНИЦЫ (Pages)                    │
    │  HomePage · LeaderboardPage · ProfilePage        │
    │  AdminPanel · GameWrapper · AuthPage             │
    └────────┬─────────────────────────────────────────┘
             │
    ┌────────┴────────────────────────────────────────┐
    │           UI-ПРИМИТИВЫ (Primitives)              │
    │  NeonText · GlowButton · Card · Input            │
    │  PixelIcon · PixelIconAnimated · HintCorner      │
    └────────┬─────────────────────────────────────────┘
             │
    ┌────────┴────────────────────────────────────────┐
    │             ИГРОВЫЕ ДВИЖКИ (Games)               │
    │  SnakeGame · FlappyGame · MemoryGame             │
    │  ReactionGame · TetrisGame                       │
    └─────────────────────────────────────────────────┘
```

### Управление состоянием

Состояние приложения хранится в корневом компоненте `App` и передаётся вниз через props:

```
App state:
  ├── user          — текущий авторизованный пользователь (null | User)
  ├── users[]       — список всех пользователей
  ├── scores[]      — таблица рекордов
  ├── page          — текущая страница ('home' | 'leaderboard' | ...)
  ├── playingGame   — идентификатор активной игры (null | string)
  ├── lang          — язык интерфейса ('en' | 'ru')
  └── motd          — сообщение дня от администратора
```

### Паттерн игрового цикла

Для Canvas-игр применяется паттерн **Ref-based game loop** — все изменяемые данные игры хранятся в `useRef` (не в `useState`), что исключает лишние рендеры React во время игрового цикла:

```
useEffect (mount once)
  └── stateRef.current = initState()
  └── requestAnimationFrame(tick)
       └── tick(timestamp)
            ├── читает/пишет stateRef.current
            ├── вызывает ctx.draw*()
            └── requestAnimationFrame(tick) — следующий кадр
```

---

## Функциональность

| Модуль | Описание |
|---|---|
| 🔐 Аутентификация | Регистрация, вход, валидация, бан-проверка, ролевая модель |
| 🎮 5 аркадных игр | Snake, Flappy Bird, Memory, Reflex, Tetris |
| 🏆 Таблица рекордов | Фильтр по играм, прогресс-бар, топ-3 на главной |
| 👤 Профиль игрока | Аватар, биография, XP/уровень, достижения, личные рекорды |
| 🛡️ Админ-панель | Управление пользователями, статистика, рассылка сообщений |
| 🌍 i18n | Русский / Английский, полный перевод всего интерфейса |
| 🎨 Pixel Art | Ручные 16×16 SVG-иконки для всех элементов |
| 💡 Подсказки | Всплывающие подсказки управления для каждой игры |
| ✨ WebGL-фон | Анимированный шейдер на экране авторизации |

---

## Установка и запуск

### Требования

- **Node.js** версии 18.0 или выше
- **npm** версии 9.0 или выше (входит в поставку Node.js)
- Современный браузер с поддержкой WebGL (Chrome 90+, Firefox 88+, Safari 15+)

### Шаг 1 — Клонирование репозитория

```bash
git clone https://github.com/ВАШ_ЛОГИН/arcade-vault.git
cd arcade-vault
```

### Шаг 2 — Создание проекта Vite

```bash
npm create vite@latest . -- --template react
```

> При запросе "Current directory is not empty" выберите **Ignore files and continue**

### Шаг 3 — Установка зависимостей

```bash
npm install
```

### Шаг 4 — Замена главного файла

Скопируйте файл `arcade-vault.jsx` в директорию `src/` и переименуйте в `App.jsx`:

```bash
# Windows (PowerShell)
Copy-Item arcade-vault.jsx src\App.jsx

# macOS / Linux
cp arcade-vault.jsx src/App.jsx
```

### Шаг 5 — Настройка точки входа

Откройте `src/main.jsx` и убедитесь что содержимое соответствует:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Шаг 6 — Запуск dev-сервера

```bash
npm run dev
```

Откройте браузер по адресу: **http://localhost:5173**

### Сборка для production

```bash
npm run build
npm run preview   # предварительный просмотр сборки
```

---

## Структура проекта

```
arcade-vault/
├── src/
│   ├── App.jsx          ← весь исходный код приложения (~3200 строк)
│   └── main.jsx         ← точка входа React
├── public/
│   └── vite.svg
├── index.html           ← HTML-шаблон
├── vite.config.js       ← конфигурация Vite
├── package.json
└── README.md
```

---

## Игры

### 🐍 Snake (Змейка)

**Механика:** классическая змейка на сетке 22×18 клеток.

- Управление: стрелки клавиатуры или WASD; свайп на сенсорных устройствах
- Подсчёт очков: +10 за яблоко, бонус растёт с накопленным счётом
- Сложность: скорость движения увеличивается при каждом съедении
- Графика: круглые сегменты с 3D-градиентом, голова с глазами и языком, анимированное яблоко с листиком

**Технические особенности:**
- Игровой цикл на `requestAnimationFrame` с управлением delta-time (`ts - lastRef.current > speed`)
- Голова, тело и хвост рисуются отдельными функциями (`drawHead`, `drawSegment`, `drawTail`)
- Раздвоенный язык мигает с периодом 200 мс через `Date.now() % 2`

### 🚀 Flappy Bird

**Механика:** персонаж летит вправо, игрок управляет высотой нажатием.

- Управление: клик мышью, пробел, стрелка вверх, тап
- Подсчёт очков: +1 за каждую пару труб
- Препятствия: трубы со случайным зазором (GAP=130px), скорость постоянная
- Графика: птица с машущим крылом, глазами и клювом; трубы с неоновым свечением

**Технические особенности:**
- Физика: гравитация (`vy += 0.42` за кадр), прыжок устанавливает `vy = -8`
- `activeRef` + `onEndRef` вместо зависимостей `useEffect` — предотвращает пересоздание замыканий
- Спавн труб по расстоянию (`lastPipe.x < W - 220`), а не по таймеру

### 🧠 Memory (Память)

**Механика:** классическая игра на совпадение карточек.

- 16 карточек (8 пар) с уникальными pixel-иконками
- Время: 60 секунд
- Подсчёт: +100 за совпадение, -5 за ошибку; бонус за оставшееся время (+20 × секунд)
- Эффект: блокировка ввода на 400 мс при совпадении и 800 мс при ошибке

**Технические особенности:**
- Реализована на React (не Canvas): карточки — это DOM-элементы
- Таймер через `setInterval` с очисткой в `useEffect` cleanup

### ⚡ Reflex (Рефлекс)

**Механика:** тест скорости реакции — 8 раундов, нужно кликнуть по цели как можно быстрее.

- Цель появляется через случайную задержку (1.2–3.4 сек)
- Ранний клик: штраф -100 очков
- Подсчёт: `pts = max(10, 1000 − reaction_ms × 0.8)`
- Цель: случайная позиция и размер

**Технические особенности:**
- `scoreRef` и `roundRef` вместо `useState` — устраняет проблему устаревших замыканий (stale closures) в обработчиках
- `phaseRef` зеркалирует `phase` state для синхронного чтения в `handleClick`
- Сброс игры через отслеживание перехода `active: false → true`

### 🧩 Tetris

**Механика:** классический тетрис с 7 типами фигур.

- Управление: ←→ движение, ↑ вращение, ↓ ускорение, Пробел — мгновенный сброс
- Ghost piece: полупрозрачная подсказка куда упадёт фигура
- Подсчёт: 100/300/500/800 очков за 1/2/3/4 линии
- Сложность: скорость увеличивается каждые 10 линий

---

## Система аутентификации

Реализована без серверной части — данные хранятся в памяти (`useState` в корневом компоненте).

```
Роли:
  user  — стандартный игрок
  admin — доступ к AdminPanel (username: ADMIN, password: admin2024)

Валидация при регистрации:
  ✓ Имя пользователя: минимум 3 символа
  ✓ Пароль: минимум 6 символов
  ✓ Имена 'admin' / 'ADMIN' зарезервированы
  ✓ Уникальность имени пользователя
  ✓ Совпадение паролей
  ✓ Заблокированные пользователи не могут войти
```

---

## Профиль игрока

- **Аватар:** 16 pixel-art персонажей × 8 цветовых схем
- **Биография:** редактируемое поле (до 80 символов)
- **XP и уровень:** `XP = сумма_очков + games_played × 50`, уровень каждые 2000 XP
- **10 достижений:** автоматически разблокируются по условиям игры
- **Вкладка Статистика:** прогресс по всем 5 играм с позицией в рейтинге
- **Вкладка Рекорды:** личные рекорды с медалями (🥇🥈🥉)
- **Вкладка Достижения:** прогресс-бар, иконки с анимацией разблокировки

---

## Административная панель

Доступна только пользователю с `role === "admin"`.

| Вкладка | Функции |
|---|---|
| Пользователи | Список всех игроков, бан/разбан, сброс очков отдельного игрока |
| Статистика | Всего игроков, сыграно партий, рекорд, разбивка по играм |
| Управление | Рассылка MOTD-объявления, сброс всех рекордов |

---

## Тестовые аккаунты

| Логин | Пароль | Роль | Статус |
|---|---|---|---|
| `ADMIN` | `admin2024` | admin | активен |
| `CYBER_ACE` | `ace123` | user | активен |
| `NEON_WOLF` | `wolf456` | user | активен |
| `VOID_ZERO` | `void789` | user | активен |
| `GLITCH_X` | `glitch1` | user | **заблокирован** |
| `GRID_RUNNER` | `grid999` | user | активен |

---

---

# English

## 📋 Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Installation](#installation)
- [Games](#games-en)
- [Authentication](#authentication)
- [Player Profile](#player-profile)
- [Admin Panel](#admin-panel)
- [Test Accounts](#test-accounts)

---

## About

**Arcade Vault** is a graduation project — a fully functional browser-based arcade gaming platform. Built with a modern front-end stack with no back-end: all application state is managed client-side using React.

The platform demonstrates practical application of:
- component-based UI architecture;
- state management without third-party libraries;
- programmatic graphics via Canvas API and WebGL;
- i18n without external frameworks;
- client-side role-based access control (RBAC).

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.x | UI framework, state management |
| **Vite** | 5.x | Bundler and dev server |
| **Canvas API** | — | Game graphics rendering (Snake, Flappy, Tetris) |
| **WebGL** | 1.0 | Procedural background shader (login screen) |
| **GLSL** | — | Fragment shader: metaballs + fBm turbulence |
| **SVG** | — | Pixel art icon system (16×16 grids) |
| **CSS Variables** | — | Design tokens, color system |
| **Google Fonts** | — | Orbitron (headings), Exo 2 (body) |

---

## Architecture

The application is a **monolithic SPA** with clear layer separation:

```
┌─────────────────────────────────────────────────────────┐
│                    ROOT APP (App)                        │
│  Global state: user, page, scores, users, motd          │
└────────────┬────────────────────────────────────────────┘
             │ props / callbacks
    ┌────────┴──────────────────────────────────────┐
    │                  PAGES                         │
    │  HomePage · LeaderboardPage · ProfilePage      │
    │  AdminPanel · GameWrapper · AuthPage           │
    └────────┬──────────────────────────────────────┘
             │
    ┌────────┴──────────────────────────────────────┐
    │             UI PRIMITIVES                      │
    │  NeonText · GlowButton · Card · Input          │
    │  PixelIcon · PixelIconAnimated · HintCorner    │
    └────────┬──────────────────────────────────────┘
             │
    ┌────────┴──────────────────────────────────────┐
    │              GAME ENGINES                      │
    │  SnakeGame · FlappyGame · MemoryGame           │
    │  ReactionGame · TetrisGame                     │
    └────────────────────────────────────────────────┘
```

---

## Features

| Module | Description |
|---|---|
| 🔐 Authentication | Register, login, validation, ban check, role model |
| 🎮 5 Arcade Games | Snake, Flappy Bird, Memory, Reflex, Tetris |
| 🏆 Leaderboard | Per-game filter, progress bar, top-3 on home page |
| 👤 Player Profile | Avatar, bio, XP/levels, achievements, personal records |
| 🛡️ Admin Panel | User management, statistics, broadcast messages |
| 🌍 i18n | Russian / English, full UI translation |
| 🎨 Pixel Art | Hand-drawn 16×16 SVG icons for all UI elements |
| 💡 Hints | In-game control hints popup for every game |
| ✨ WebGL BG | Animated shader on the auth screen |

---

## Installation

### Requirements

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- Modern browser with WebGL support (Chrome 90+, Firefox 88+, Safari 15+)

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/arcade-vault.git
cd arcade-vault
```

### Step 2 — Create Vite project

```bash
npm create vite@latest . -- --template react
```

> When prompted about non-empty directory, choose **Ignore files and continue**

### Step 3 — Install dependencies

```bash
npm install
```

### Step 4 — Replace the main file

```bash
# macOS / Linux
cp arcade-vault.jsx src/App.jsx

# Windows (PowerShell)
Copy-Item arcade-vault.jsx src\App.jsx
```

### Step 5 — Verify entry point

`src/main.jsx` should contain:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Step 6 — Start dev server

```bash
npm run dev
```

Open: **http://localhost:5173**

---

## Games (EN)

See the Russian section above for full game descriptions — all game mechanics, controls, and technical implementation details are identical regardless of the selected language.

---

## Authentication

No back-end — data lives in React `useState` in the root component.

```
Roles:
  user  — standard player
  admin — access to AdminPanel (username: ADMIN, password: admin2024)

Registration validation:
  ✓ Username: minimum 3 characters
  ✓ Password: minimum 6 characters
  ✓ 'admin' / 'ADMIN' are reserved usernames
  ✓ Username uniqueness check
  ✓ Password confirmation match
  ✓ Banned users cannot log in
```

---

## Player Profile

- **Avatar:** 16 pixel-art characters × 8 color schemes
- **Bio:** editable field (up to 80 characters)
- **XP & Level:** `XP = total_score + games_played × 50`, new level every 2000 XP
- **10 Achievements:** auto-unlocked based on in-game conditions
- **Stats tab:** progress across all 5 games with leaderboard position
- **Records tab:** personal bests with medals
- **Achievements tab:** progress bar, icons with unlock animation

---

## Admin Panel

Accessible only to users with `role === "admin"`.

| Tab | Functions |
|---|---|
| Users | Full player list, ban/unban, reset individual scores |
| Statistics | Total players, games played, top score, per-game breakdown |
| Manage | Broadcast MOTD announcement, reset all scores |

---

## Test Accounts

| Login | Password | Role | Status |
|---|---|---|---|
| `ADMIN` | `admin2024` | admin | active |
| `CYBER_ACE` | `ace123` | user | active |
| `NEON_WOLF` | `wolf456` | user | active |
| `VOID_ZERO` | `void789` | user | active |
| `GLITCH_X` | `glitch1` | user | **banned** |
| `GRID_RUNNER` | `grid999` | user | active |

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Разработано как дипломная работа · Developed as a graduation project
</div>
