# User Service API

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-blue)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-lightgrey)](https://www.sqlite.org/)
[![Swagger](https://img.shields.io/badge/Swagger-Available-green)]

---

## 📋 О проекте

User Service API — это backend-приложение для управления пользователями с поддержкой аутентификации и ролевой модели доступа.

Проект демонстрирует:

* Модульную архитектуру (Controller → Service → DB)
* Проектирование REST API
* Аутентификацию с использованием JWT
* Ролевую модель доступа (RBAC)
* Безопасное хранение паролей (bcrypt)
* Работу с базой данных через Prisma ORM

---

## ⚙️ Функциональность

* Регистрация пользователя
* Авторизация пользователя (JWT)
* Получение пользователя по ID (сам пользователь или администратор)
* Получение списка пользователей (только администратор)
* Блокировка пользователя (сам пользователь или администратор)
* Система ролей (ADMIN / USER)
* Статус пользователя (активен / заблокирован)

---

📄 Документация API (Swagger)

Интерактивная документация API доступна через Swagger UI:

```bash
http://localhost:3000/docs
```

Возможности:
* Просмотр всех endpoint’ов
* Тестирование запросов прямо в браузере
* Авторизация через JWT
* Просмотр схем запросов и ответов
Как использовать:
* Открой /docs
* Нажми Authorize
* Вставь JWT токен:

```bash
Bearer <your_token>
```

* Выполняй запросы

---

## 🛠️ Технологии

**Backend:**

* Node.js
* Express
* TypeScript
* Prisma ORM
* SQLite
* JWT (jsonwebtoken)
* bcrypt

---

## 🧱 Структура проекта

<details>
<summary>Нажмите, чтобы раскрыть</summary>

src/<br>
 ├── controllers/     # Обработка запросов<br>
 ├── services/        # Бизнес-логика<br>
 ├── routes/          # Роуты API<br>
 ├── middlewares/     # Проверка авторизации и ролей<br>
 ├── prisma/          # Prisma клиент<br>
 └── app.ts           # Точка входа<br>

prisma/<br>
 ├── schema.prisma    # Схема БД<br>
 └── seed.ts          # Скрипт начальных данных<br>

</details>

---

## 🚀 Запуск проекта

### Требования

* Node.js
* npm

---

### 1. Клонировать репозиторий

```bash
git clone <your-repo-url>
cd user-service
```

---

### 2. Установить зависимости

```bash
npm install
```

---

### 3. Применить миграции

```bash
npx prisma migrate dev
```

---

### 4. Заполнить базу данных (seed)

```bash
npx prisma db seed
```

---

### 5. Запустить сервер

```bash
npm run dev
```

---

### Сервер будет доступен по адресу:

```bash
http://localhost:3000
```

---

## 👤 Данные администратора

После выполнения seed:

```bash
email: admin@test.com  
password: admin123
```

---

## 🔐 Аутентификация

API использует JWT.

Передавайте токен в заголовке:

```bash
Authorization: Bearer <your_token>
```

---

## 📡 API Endpoints

### 🔹 Аутентификация

#### Регистрация

```bash
POST /auth/register
```

#### Авторизация

```bash
POST /auth/login
```

---

### 🔹 Пользователи

#### Получить пользователя по ID

```bash
GET /users/:id
```

* Администратор → любой пользователь
* Обычный пользователь → только себя

---

#### Получить список пользователей (только ADMIN)

```bash
GET /users
```

---

#### Заблокировать пользователя

```bash
PATCH /users/:id/block
```

* Администратор → любого пользователя
* Пользователь → самого себя

---

## 🧠 Архитектура

Поток обработки запроса:

```bash
Request → Route → Controller → Service → Prisma → Database
```

* Controller — обрабатывает HTTP-запросы
* Service — содержит бизнес-логику
* Prisma — взаимодействует с базой данных

---

## 🔒 Безопасность

* Пароли хешируются с помощью bcrypt
* Используется JWT-аутентификация
* Реализована ролевая модель доступа
* Пароли не возвращаются в ответах API

---

## 📞 Contact

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](birdcherrytea@gmail.com)</br>
[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/submarino_amarillo)</br>
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dzmitry-paklonski/)