# User Service API

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-blue)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-lightgrey)](https://www.sqlite.org/)
![Swagger](https://img.shields.io/badge/Swagger-Available-green)

<p align="left">
  <a href="README.ru.md">Переключиться на русский язык</a>
</p>

## 📋 About the Project

User Service API is a backend application for managing users with authentication and role-based access control.

The project demonstrates:

* Modular architecture (Controller → Service → DB)
* REST API design
* Authentication with JWT
* Role-based access control (RBAC)
* Secure password handling (bcrypt)
* Database management with Prisma ORM


## ⚙️ Features

* User registration
* User authentication (JWT)
* Get user by ID (self or admin)
* Get list of users (admin only)
* Block user (self or admin)
* Role system (ADMIN / USER)
* User activity status (active / blocked)

## 📒 API Documentation (Swagger)

Interactive API documentation is available via Swagger UI:

```bash
http://localhost:3000/docs
```

Features:
* Explore all available endpoints
* Test requests directly in the browser
* Authorize using JWT token
* View request/response schemas

How to use:
* Open /docs
* Click Authorize (🔓)
* Paste your JWT token:

```bash
Bearer <token>
```

* Execute requests

## 🛠️ Tech Stack

* Node.js
* Express
* TypeScript
* Prisma ORM
* SQLite
* JWT (jsonwebtoken)
* bcrypt


## 🧱 Project Structure

<details>
<summary>Click to expand</summary>

src/<br>
 ├── controllers/     # Request handling<br>
 ├── services/        # Business logic<br>
 ├── routes/          # API routes<br>
 ├── middlewares/     # Auth & role checks<br>
 ├── prisma/          # Prisma client<br>
 └── app.ts           # Entry point<br>

prisma/<br>
 ├── schema.prisma    # DB schema<br>
 └── seed.ts          # Seed script<br>

</details>


## 🚀 Getting Started

### Requirements

* Node.js
* npm

#### 1. Clone the repository

```bash
git clone https://github.com/paper-apple/user-service.git
cd user-service
```

#### 2. Create an .env file from the example

```bash
copy .env.example .env
```

#### 3. Install dependencies

```bash
npm install
```

#### 4. Apply database migrations

```bash
npx prisma migrate dev
```

#### 5. Start the server

```bash
npm run dev
```

#### Server will run at:

```bash
http://localhost:3000
```

## 👔 Default Admin User

#### After seeding:

```bash
email: admin@test.com
password: 123456
```

## 📡 API Endpoints

### 🚪 Auth ###

#### Register: ####

```bash
POST /auth/register
```

#### Login: ####

```bash
POST /auth/login
```

### 👥Users ###

#### Get user by ID: ####

```bash
GET /users/:id
```

⚠️ The administrator can get any user's data<br>
An ordinary user can only get their own data

#### Get a list of all users: ####

```bash
GET /users
```

⚠️ Only the administrator can receive it

#### Block user: ####

```bash
PATCH /users/:id/block
```

⚠️ The administrator can block any user<br>
An ordinary user can only block himself

## 🧩 Architecture Overview

Request flow:

```bash
Request → Route → Controller → Service → Prisma → Database
```

* Controllers handle HTTP layer
* Services contain business logic
* Prisma handles DB access

## 🛡️ Security

* Passwords are hashed using bcrypt
* JWT authentication
* Role-based access control
* Sensitive data (password) is never returned

## 📞 Contact

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](birdcherrytea@gmail.com)</br>
[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/submarino_amarillo)</br>
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dzmitry-paklonski/)