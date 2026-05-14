# User Service API

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-blue)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-grey)](https://www.sqlite.org/)
![Swagger](https://img.shields.io/badge/Swagger-Available-green)

<p align="left">
  <a href="README.ru.md">Переключиться на русский язык</a>
</p>


## 📋 About the Project

User Service API is a backend application for managing users with authentication and role-based access control.

The project demonstrates:

* Modular architecture (Controller → Service → DB)
* REST API design
* JWT-based authentication
* Role-based access control (RBAC)
* Secure password handling (bcrypt)
* Working with PostgreSQL via Prisma ORM


## ⚙️ Features

* User registration
* User login (JWT)
* Get user by ID (user or admin)
* Get list of users (admin only)
* Block/unblock user (self or admin)
* Role system (ADMIN / USER)
* User status (active / blocked)


## 📒 API Documentation (Swagger)

Interactive API documentation is available via Swagger UI:

```bash
http://localhost:3000/docs
```

Features:
* Explore all available endpoints
* Test requests directly in the browser
* Authenticate using JWT
* View request and response schemas

How to use:
* Open /docs
* Click Authorize (🔓)
* Insert JWT token:

```bash
Bearer <token>
```

* Execute requests


## 🛠️ Tech Stack

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT (jsonwebtoken)
* bcrypt
* Zod


## 🧱 Project Structure

<details>
<summary>Click to expand</summary>

src/<br>
├── controllers/     # Request handlers<br>
├── services/        # Business logic<br>
├── routes/          # API routes<br>
├── middlewares/     # Authentication, authorization, error handling<br>
├── prisma/          # Prisma client<br>
├── test/            # Tests<br>
└── server.ts        # Entry point<br>

prisma/<br>
├── schema.prisma    # Database schema<br>
├── migrations/      # Auto-generated migrations<br>
└── seed.ts          # Initial data script<br>

</details>


## 🖐️ Manual Project Setup

### Requirements
* Node.js
* npm
* PostgreSQL

#### 1. Clone the repository:
```bash
git clone https://github.com/paper-apple/user-service.git
cd user-service
```

#### 2. Create .env file from example and adjust values if needed:
```bash
copy .env.example .env
```

#### 3. Install dependencies:
```bash
npm install
```

#### 4. Apply database migrations:
```bash
npx prisma migrate deploy
```

#### 5. Seed test data (optional):
```bash
npx prisma db seed
```

#### 6. Start the server:
```bash
npm run dev
```

#### The server will be available at:
```bash
http://localhost:3000
```

#### You can view the database content using Prisma Studio (run in a separate terminal if the server is already running. Make sure that you are in the 'user-service' folder):
```bash
npx prisma studio
```


## 🐳 Run with Docker

### Requirements

* [Docker](https://docker.com)
* [Docker Compose](https://docs.docker.com/compose/)

#### 1. Clone the repository:
```bash
git clone https://github.com/paper-apple/user-service.git
cd user-service
```

#### 2. Create .env file from example and adjust values if needed:
```bash
copy .env.example .env
```

#### 3. Launch Docker Desktop:
Wait until Docker starts completely (status "Running")

#### 4. Start containers:
```bash
docker compose up -d
```

#### 5. Apply database migrations:
```bash
docker compose run --rm app npx prisma migrate deploy
```

#### 6. Seed test data (optional):
```bash
docker compose exec app npx prisma db seed
```

#### The server will be available at:
```bash
http://localhost:3000
```

#### You can view the database content using Prisma Studio (run in a separate terminal if the server is already running. Make sure that you are in the 'user-service' folder):
```bash
docker compose exec app npx prisma studio
```


## 👔 Admin Credentials

#### After seeding:

```bash
email: admin@test.com
password: 123456
```


## 📡 API Endpoints

### 🚪 Authentication ###

#### Registration: ####

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

⚠️ Admin can get any user's data<br>
Regular user can get only their own data

#### Get all users: ####

```bash
GET /users
```

⚠️ Only admin can access this endpoint

#### Block user: ####

```bash
PATCH /users/:id/block
```

⚠️ Admin can block any user except themselves<br>
Regular user can block only themselves


## 🧪 Testing
The project includes a testing system covering key API scenarios.

Tests are divided into two levels: unit and integration, allowing verification of both individual functions and full HTTP request cycles.

The following tools were used for testing:

* Vitest — testing framework based on Vite
* Supertest — sending HTTP requests to the Express server
* Prisma Client — direct interaction with the database in tests
* Factory pattern — creating predictable test data

⚠️ A test database is created before running integration tests. Please check the .env file and adjust values if needed.

### Running tests locally

#### Run unit tests:
```Bash
npm run test:unit
```

#### Run integration tests:
```Bash
npm run test:integration
```

### Running tests in Docker

#### Run unit tests:
```Bash
docker compose run --rm test-unit
```

#### Run integration tests:
```Bash
docker compose run --rm test-integration
```

## 🧩 Architecture Overview

### Request processing flow:

```bash
Request → Middleware → Route → Controller → Service → Prisma → Database
```

* Controllers handle HTTP layer
* Services contain business logic
* Prisma handles DB access

### Input Validation

All input data (registration, login, etc.) is strictly validated using Zod:

```TypeScript
const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  birthDate: z.string().date(),
});
```

Advantages:

* Protection against invalid or dangerous data
* Automatic TypeScript type generation
* Clear error messages in API responses

### HTTP-Level Protection

The API is protected at the incoming request level with the following middleware:


* Helmet<br>
  Automatically sets secure HTTP headers, disables Cross-Origin-Resource-Policy for Swagger UI compatibility

* CORS<br>
  Allows requests only from trusted frontend:
  ```TypeScript
  origin: process.env.CLIENT_URL, // e.g., http://localhost:5173
  credentials: true
  ```

* Rate Limiting<br>
  Limits the number of requests from a single IP
  Global limit: 100 requests per 15 minutes<br>
  For /auth: 5 login attempts per 10 minutes

### Error Handling

All errors in the application are caught by a single middleware — errorMiddleware. It ensures:

* Unified error response format:
  ```JSON
  {
    "error": "Invalid credentials",
    "details": null
  }
  ```

* Correct HTTP statuses (400, 401, 403, 500, etc.)
* Protection against leaking internal details (stack traces, paths, variable names)
* Support for custom errors via AppError


## 🛡️ Security

* Passwords are hashed using bcrypt
* JWT authentication is used
* Role-based access control is implemented
* Passwords are not returned in API responses
* Input data is validated using Zod
* Errors are centrally handled via middleware
* Protection against XSS, header attacks, and others via Helmet
* CORS restricts access to trusted domains only
* Rate limiting prevents brute-force and DDoS attacks


## 📞 Contact

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](birdcherrytea@gmail.com)</br>
[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/submarino_amarillo)</br>
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dzmitry-paklonski/)