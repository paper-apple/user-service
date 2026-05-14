# User Service API

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-blue)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-grey)](https://www.sqlite.org/)
![Swagger](https://img.shields.io/badge/Swagger-Available-green)


<p align="left">
  <a href="README.md">Switch to English</a>
</p>

## 📋 О проекте

User Service API — это backend-приложение для управления пользователями с поддержкой аутентификации и ролевой модели доступа.

Проект демонстрирует:

* Модульную архитектуру (Controller → Service → DB)
* Проектирование REST API
* Аутентификацию с использованием JWT
* Ролевую модель доступа (RBAC)
* Безопасное хранение паролей (bcrypt)
* Работу с PostgreSQL через Prisma ORM


## ⚙️ Функциональность

* Регистрация пользователя
* Авторизация пользователя (JWT)
* Получение пользователя по ID (сам пользователь или администратор)
* Получение списка пользователей (только администратор)
* Блокировка пользователя (сам пользователь или администратор)
* Система ролей (ADMIN / USER)
* Статус пользователя (активен / заблокирован)

## 📒 Документация API (Swagger)

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
* Открыть /docs
* Нажать Authorize (🔓)
* Вставить JWT токен:
  ```bash
    Bearer <token>
  ```


* Выполнять запросы

## 🛠️ Технологии

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT (jsonwebtoken)
* bcrypt
* Zod


## 🧱 Структура проекта

<details>
<summary>Нажмите, чтобы раскрыть</summary>

src/<br>
 ├── controllers/     # Обработка запросов<br>
 ├── services/        # Бизнес-логика<br>
 ├── routes/          # Роуты API<br>
 ├── middlewares/     # Проверка авторизации, ролей и обработка ошибок<br>
 ├── prisma/          # Prisma клиент<br>
 ├── test/            # Тесты<br>
 └── server.ts        # Точка входа<br>

prisma/<br>
 ├── schema.prisma    # Схема БД<br>
 ├── migrations/      # Автогенерируемые миграции<br>
 └── seed.ts          # Скрипт начальных данных<br>

</details>


## 🖐️ Ручной запуск проекта

### Требования
* Node.js
* npm
* PostgreSQL

#### 1. Клонируйте репозиторий:
```bash
git clone https://github.com/paper-apple/user-service.git
cd user-service
```

#### 2. Создайте .env файл из примера и измените данные при надобности:
```bash
copy .env.example .env
```

#### 3. Установите зависимости:
```bash
npm install
```

#### 4. Примените миграции:
```bash
npx prisma migrate deploy
```

#### 5. Загрузите тестовые данные (по желанию):
```bash
npx prisma db seed
```

#### 6. Запустите сервер:
```bash
npm run dev
```

#### Сервер будет доступен по адресу:
```bash
http://localhost:3000
```

#### Вы можете просматривать содержимое БД используя prisma studio (если сервер уже запущен, выполняйте команду в отдельном терминале. Убедитесь, что находитесь в папке 'user-service'):
```bash
npx prisma studio
```


## 🐳 Запуск проекта через Docker

### Требования:

* [Docker](https://docker.com)
* [Docker Compose](https://docs.docker.com/compose/)

#### 1. Клонируйте репозиторий:

```bash
git clone https://github.com/paper-apple/user-service.git
cd user-service
```

#### 2. Создайте .env файл из примера и измените данные при надобности:
```bash
copy .env.example .env
```

#### 3. Запустите Docker Desktop:
Дождитесь, пока Docker полностью запустится (статус "Running")

#### 4. Запустите контейнеры:
```bash
docker compose up -d
```

#### 5. Примените миграции:
```bash
docker compose run --rm app npx prisma migrate deploy
```

#### 6. Загрузите тестовые данные (по желанию):
```bash
docker compose exec app npx prisma db seed
```

#### Сервер будет доступен по адресу:
```bash
http://localhost:3000
```

#### Вы можете просматривать содержимое БД используя prisma studio (если сервер уже запущен, выполняйте команду в отдельном терминале. Убедитесь, что находитесь в папке 'user-service'):
```bash
docker compose exec app npx prisma studio
```

## 👔 Данные администратора

#### После выполнения seed:
```bash
email: admin@test.com  
password: 123456
```


## 📡 API Endpoints

### 🚪 Аутентификация ###

#### Регистрация: ####

```bash
POST /auth/register
```

#### Авторизация: ####

```bash
POST /auth/login
```

### 👥 Пользователи

#### Получить пользователя по ID: ####

```bash
GET /users/:id
```

⚠️ Администратор может получить данные любого пользователя<br>
Обычный пользователь может получить только свои данные

#### Получить список всех пользователей:

```bash
GET /users
```

⚠️ Получить может только администратор

#### Заблокировать пользователя:

```bash
PATCH /users/:id/block
```

⚠️ Администратор может заблокировать любого пользователя, кроме самого себя<br>
Обычный пользователь может заблокировать только самого себя


## 🧪 Тестирование

Проект включает систему тестирования, охватывающую ключевые сценарии работы API.

Тесты делятся на два уровня: модульные и интеграционные, что позволяет проверять как отдельные функции, так и полный цикл запросов через HTTP.

Для реализации тестирования использовались следующие инструменты:

* Vitest — фреймворк для тестирования на базе Vite
* Supertest — для отправки HTTP-запросов к Express-серверу
* Prisma Client — прямое взаимодействие с БД в тестах
* Factory-паттерн — создание предсказуемых тестовых данных

⚠️ Перед запуском интеграционных тестов создаётся тестовая база данных. Проверьте файл .env и измените данные при надобности

### Локальный запуск тестов

#### Запуск unit-тестов:
```bash
npm run test:unit
```

#### Запуск интеграционных тестов:
```bash
npm run test:integration
```

### Запуск тестов в Docker

#### Запуск unit-тестов:
```bash
docker compose run --rm test-unit
```

#### Запуск интеграционных тестов:
```bash
docker compose run --rm test-integration
```

## 🧩 Архитектура

### Поток обработки запроса:

```bash
Request → Middleware → Route → Controller → Service → Prisma → Database
```

* Controller — обрабатывает HTTP-запросы
* Service — содержит бизнес-логику
* Prisma — взаимодействует с базой данных

### Валидация входных данных

Все входные данные (регистрация, вход и т.д.) проходят строгую валидацию с помощью Zod:

```ts
const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  birthDate: z.string().date(),
});
```

Преимущества:

* Защита от невалидных или опасных данных
* Автогенерация TypeScript-типов
* Удобное чтение ошибок в ответах API

### Защита на уровне HTTP

API защищён на уровне входящих запросов с помощью следующих middleware:

* Helmet<br>
  Автоматически устанавливает безопасные HTTP-заголовки, отключает Cross-Origin-Resource-Policy для совместимости со Swagger UI

* CORS<br>
  Разрешает запросы только с доверенного фронтенда:
  ```TypeScript
  origin: process.env.CLIENT_URL, // например, http://localhost:5173
  credentials: true
  ```

* Rate Limiting<br>
  Ограничивает количество запросов с одного IP
  Глобальный лимит: 100 запросов за 15 минут<br>
  Для /auth: 5 попыток входа за 10 минут


### Обработка ошибок

Все ошибки в приложении перехватываются единым middleware — `errorMiddleware`. Он гарантирует:

* Единый формат ответов об ошибках:
  ```json
  {
    "error": "Invalid credentials",
    "details": null
  }
* Корректные HTTP-статусы (400, 401, 403, 500 и др.)
* Защиту от утечки внутренних деталей (стека, путей, имён переменных)
* Поддержку кастомных ошибок через AppError


## 🛡️ Безопасность

* Пароли хешируются с помощью bcrypt
* Используется JWT-аутентификация
* Реализована ролевая модель доступа
* Пароли не возвращаются в ответах API
* Входные данные валидируются с помощью Zod
* Ошибки централизованно обрабатываются через middleware
* Защита от XSS, заголовков и других атак — через Helmet
* Контроль доступа по CORS: разрешены только доверенные домены
* Ограничение частоты запросов (rate limiting)


## 📞 Контакты

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](birdcherrytea@gmail.com)</br>
[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/submarino_amarillo)</br>
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dzmitry-paklonski/)