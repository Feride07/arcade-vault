# 📤 Инструкция по загрузке на GitHub / GitHub Upload Guide

---

## 🇷🇺 Русский — пошаговая инструкция

---

### Шаг 1 — Создание аккаунта GitHub (если нет)

1. Перейди на [github.com](https://github.com)
2. Нажми **Sign up** → введи email, пароль, имя пользователя
3. Подтверди email

---

### Шаг 2 — Создание репозитория

1. Нажми кнопку **+** (верхний правый угол) → **New repository**
2. Заполни поля:
   - **Repository name:** `arcade-vault`
   - **Description:** `Браузерная аркадная игровая платформа | Browser arcade gaming platform`
   - Видимость: **Public** (чтобы комиссия могла посмотреть)
   - ❌ НЕ ставь галочки "Add README", "Add .gitignore" — мы добавим сами
3. Нажми **Create repository**
4. Скопируй URL репозитория (вида `https://github.com/ТВО_ИМЯ/arcade-vault.git`)

---

### Шаг 3 — Установка Git (если не установлен)

**Windows:**
1. Скачай с [git-scm.com/download/win](https://git-scm.com/download/win)
2. Установи с настройками по умолчанию
3. Открой **Git Bash** (появится в меню Пуск)

**macOS:**
```bash
# В терминале:
xcode-select --install
```

**Проверка установки:**
```bash
git --version
# Должно вывести: git version 2.x.x
```

---

### Шаг 4 — Настройка Git (один раз)

```bash
git config --global user.name "Твоё Имя"
git config --global user.email "твой@email.com"
```

---

### Шаг 5 — Подготовка файлов проекта

Создай папку проекта и помести в неё файлы:

```
arcade-vault/
├── src/
│   ├── App.jsx          ← скопируй arcade-vault.jsx сюда с таким именем
│   └── main.jsx         ← создай этот файл (содержимое ниже)
├── public/
├── index.html           ← будет создан Vite
├── vite.config.js       ← будет создан Vite
├── package.json         ← будет создан Vite
├── .gitignore           ← создай этот файл (содержимое ниже)
└── README.md            ← скопируй наш README.md
```

#### Создание проекта через Vite:
```bash
cd Desktop                        # или куда хочешь
npm create vite@latest arcade-vault -- --template react
cd arcade-vault
npm install
cp /путь/к/arcade-vault.jsx src/App.jsx
```

#### Содержимое `src/main.jsx`:
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

#### Содержимое `.gitignore`:
```
node_modules/
dist/
.DS_Store
*.local
.env
.env.local
.vite/
```

---

### Шаг 6 — Инициализация Git-репозитория

Открой терминал/Git Bash в папке проекта:

```bash
cd arcade-vault          # убедись что ты в папке проекта

git init                 # инициализация репозитория
git add .                # добавить все файлы в индекс
git status               # проверить что добавлено (необязательно)
```

---

### Шаг 7 — Первый коммит

```bash
git commit -m "feat: initial release — Arcade Vault v1.0

- 5 arcade games: Snake, Flappy Bird, Memory, Reflex, Tetris
- Authentication system with roles (user/admin)
- Player profiles with XP, achievements, avatars
- Leaderboard with per-game filtering
- Admin panel: user management, stats, MOTD
- WebGL animated background shader
- Pixel art icon system (16x16 hand-drawn SVGs)
- Full i18n: Russian / English
- Canvas API game engines with requestAnimationFrame"
```

---

### Шаг 8 — Связать локальный репозиторий с GitHub

```bash
git branch -M main
git remote add origin https://github.com/ТВО_ИМЯ/arcade-vault.git
git push -u origin main
```

При первом `push` GitHub попросит авторизацию:
- Введи логин и пароль GitHub
- Или используй Personal Access Token (Settings → Developer settings → PAT)

---

### Шаг 9 — Проверка

1. Открой `https://github.com/ТВО_ИМЯ/arcade-vault`
2. Убедись что файлы загрузились
3. README.md должен автоматически отображаться на странице

---

### Шаг 10 — Публикация через GitHub Pages (опционально)

Чтобы комиссия могла открыть проект в браузере без установки:

```bash
npm install --save-dev gh-pages
```

Добавь в `package.json` в секцию `"scripts"`:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

Добавь в `vite.config.js`:
```js
export default {
  base: '/arcade-vault/',
}
```

Затем:
```bash
npm run deploy
```

Проект будет доступен по адресу:
`https://ТВО_ИМЯ.github.io/arcade-vault/`

---

### Обновление проекта после изменений

```bash
git add .
git commit -m "fix: описание что изменил"
git push
```

---

## 🇺🇸 English — Step by Step

### Quick Reference

```bash
# 1. Create Vite project
npm create vite@latest arcade-vault -- --template react
cd arcade-vault && npm install

# 2. Copy source file
cp /path/to/arcade-vault.jsx src/App.jsx

# 3. Copy README
cp /path/to/README.md ./README.md

# 4. Create .gitignore
echo "node_modules/\ndist/\n.DS_Store\n*.local" > .gitignore

# 5. Initialize git
git init
git add .
git commit -m "feat: initial release — Arcade Vault v1.0"

# 6. Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_NAME/arcade-vault.git
git push -u origin main
```

### Common Errors

| Error | Solution |
|---|---|
| `git: command not found` | Install Git from git-scm.com |
| `npm: command not found` | Install Node.js from nodejs.org |
| `Permission denied (publickey)` | Use HTTPS URL, not SSH |
| `failed to push — remote contains work` | `git pull origin main --allow-unrelated-histories` then push again |
| `403 Forbidden` | Check username/password or create Personal Access Token |
