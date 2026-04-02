# 🎮 ARCADE VAULT

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![WebGL](https://img.shields.io/badge/WebGL-Canvas_API-990000?style=for-the-badge&logo=webgl&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Arcade Vault** — многопользовательская браузерная игровая платформа с пятью аркадными играми, системой аутентификации, профилями игроков, таблицей рекордов и административной панелью.

**Бэкенд:** Node.js + Express + PostgreSQL · **Фронтенд:** React 18 + Vite

[🇷🇺 Русский](#русский) · [🇺🇸 English](#english)

## 🚀 Live Demo

**[▶ Играть онлайн / Play Online](https://effortless-travesseiro-756908.netlify.app/)**

> ⚠️ Демо-версия работает без backend. Для полной версии с PostgreSQL — см. инструкцию по установке.

</div>

---

# Русский

## 📋 Содержание

- [О проекте](#о-проекте)
- [Архитектура](#архитектура)
- [Технологический стек](#технологический-стек)
- [Установка и запуск](#установка-и-запуск)
- [Структура проекта](#структура-проекта)
- [База данных](#база-данных)
- [API](#api)
- [Игры](#игры)
- [Тестовые аккаунты](#тестовые-аккаунты)

---

## О проекте

**Arcade Vault** — дипломный проект, представляющий собой полнофункциональную веб-платформу для браузерных аркадных игр. Реализована трёхуровневая архитектура: React-фронтенд, Node.js/Express бэкенд и PostgreSQL база данных.

Платформа демонстрирует применение:
- трёхуровневой клиент-серверной архитектуры
- RESTful API с JWT-аутентификацией
- реляционной СУБД PostgreSQL с нормализованной схемой
- компонентного подхода к разработке UI на React
- программной графики через Canvas API и WebGL

---

## Архитектура

```
┌─────────────────────┐     HTTP/REST      ┌─────────────────────┐
│   FRONTEND          │ ◄────────────────► │   BACKEND           │
│   React 18 + Vite   │   localhost:3001   │   Node.js + Express │
│   localhost:5173    │                    └──────────┬──────────┘
└─────────────────────┘                              │
                                                     │ SQL
                                              ┌──────▼──────────┐
                                              │   PostgreSQL     │
                                              │   arcade_vault   │
                                              └─────────────────┘
```

---

## Технологический стек

| Технология | Версия | Назначение |
|---|---|---|
| **React** | 18.x | UI-фреймворк, управление состоянием |
| **Vite** | 5.x | Сборщик и dev-сервер |
| **Node.js** | 18.x | Серверная платформа |
| **Express** | 4.x | HTTP-фреймворк для API |
| **PostgreSQL** | 15.x | Реляционная СУБД |
| **bcrypt** | 5.x | Хеширование паролей |
| **jsonwebtoken** | 9.x | JWT-аутентификация |
| **pg** | 8.x | Драйвер PostgreSQL для Node.js |
| **Canvas API** | — | Игровая графика (Snake, Flappy, Tetris) |
| **WebGL / GLSL** | 1.0 | Процедурный фоновый шейдер |

---

## Установка и запуск

### Требования

- **Node.js** 18.0+
- **PostgreSQL** 15.0+
- **npm** 9.0+

### Шаг 1 — Клонирование

```bash
git clone https://github.com/Feride07/arcade-vault.git
cd arcade-vault
```

### Шаг 2 — База данных

Создай БД в pgAdmin или psql:

```sql
CREATE DATABASE arcade_vault WITH ENCODING = 'UTF8';
```

Выполни схему:

```bash
psql -U postgres -d arcade_vault -f database/schema.sql
```

### Шаг 3 — Backend

```bash
cd backend
npm install
```

Укажи пароль PostgreSQL в `backend/server.js`:
```javascript
password: 'ТВО_ПАРОЛЬ',
```

Заполни БД начальными данными:
```bash
node seed.js
```

Запусти сервер:
```bash
npm start
# ✅ Подключено к PostgreSQL
# 🚀 API запущен на http://localhost:3001
```

### Шаг 4 — Frontend

```bash
cd ..
npm install
npm run dev
# → http://localhost:5173
```

---

## Структура проекта

```
arcade-vault/
├── src/
│   └── App.jsx          ← React фронтенд (~3400 строк)
├── backend/
│   ├── server.js        ← Express API сервер
│   ├── seed.js          ← Заполнение БД начальными данными
│   └── package.json
├── database/
│   └── schema.sql       ← SQL схема (таблицы, индексы, views)
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## База данных

### Таблицы

| Таблица | Назначение |
|---|---|
| `users` | Пользователи (логин, пароль-хеш, роль, аватар, XP) |
| `games` | Каталог игр платформы |
| `scores` | Рекорды игроков по каждой игре |
| `achievements` | Справочник достижений |
| `user_achievements` | Полученные пользователями достижения |
| `sessions` | История всех сыгранных партий |

### Представления (Views)

| View | Назначение |
|---|---|
| `leaderboard_view` | Общий рейтинг игроков |
| `game_leaderboard_view` | Рейтинг по каждой игре |
| `platform_stats_view` | Статистика платформы для админа |

---

## API

| Метод | Маршрут | Описание |
|---|---|---|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/auth/me` | Текущий пользователь |
| GET | `/api/leaderboard` | Общий рейтинг |
| GET | `/api/leaderboard/:gameId` | Рейтинг по игре |
| POST | `/api/scores` | Сохранить рекорд |
| GET | `/api/scores/:userId` | Очки пользователя |
| GET | `/api/profile/:userId` | Профиль игрока |
| PATCH | `/api/profile` | Обновить профиль |
| GET | `/api/games` | Список игр |
| GET | `/api/admin/users` | Все пользователи (admin) |
| PATCH | `/api/admin/users/:id/ban` | Бан/разбан (admin) |
| DELETE | `/api/admin/users/:id/scores` | Сброс очков (admin) |
| DELETE | `/api/admin/scores` | Сброс всех очков (admin) |
| GET | `/api/admin/stats` | Статистика платформы (admin) |

---

## Игры

| Игра | Технология | Управление |
|---|---|---|
| 🐍 Змейка | Canvas API | Стрелки / WASD / свайп |
| 🚀 Флаппи | Canvas API | Клик / Пробел / тап |
| 🧠 Память | React DOM | Клик / тап |
| 🏓 Понг | Canvas API | Мышь / палец |
| 🧩 Тетрис | Canvas API | Стрелки / кнопки на экране |

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

# English

## About

**Arcade Vault** is a graduation project — a fully functional browser-based arcade gaming platform built with a three-tier architecture: React frontend, Node.js/Express backend, and PostgreSQL database.

## Tech Stack

React 18 · Node.js · Express · PostgreSQL · bcrypt · JWT · Canvas API · WebGL

## Quick Start

```bash
# 1. Create database
createdb arcade_vault
psql -U postgres -d arcade_vault -f database/schema.sql

# 2. Start backend
cd backend && npm install
node seed.js
npm start

# 3. Start frontend
cd .. && npm install && npm run dev
```

Open: **http://localhost:5173**

## License

MIT License

---

<div align="center">
Разработано как дипломная работа · Developed as a graduation project
<br>
Специальность 09.02.07 · Информационные системы и программирование
</div>
