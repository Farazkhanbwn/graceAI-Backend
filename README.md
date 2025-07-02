<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Grace AI - Backend API</h1>

<p align="center">
  🚀 A scalable and modular server-side application built using the <a href="https://nestjs.com" target="_blank">NestJS</a> framework with PostgreSQL, TypeORM, and Swagger documentation.
</p>

---

## 📆 Project Setup

Install dependencies:

```bash
npm install
```

---

## 🚀 Run the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm run start:prod
```

---

## ⚙️ Available Commands

| Command               | Description                               |
| --------------------- | ----------------------------------------- |
| `npm run build`       | Build the project using NestJS compiler   |
| `npm run dev`         | Start the app in watch mode (development) |
| `npm run start`       | Start the app normally                    |
| `npm run start:prod`  | Run compiled app for production           |
| `npm run start:debug` | Run the app in debug mode                 |
| `npm run lint`        | Run ESLint and fix issues                 |
| `npm run format`      | Format files with Prettier                |

---

## 🧩 Features

- ✅ **NestJS**: Modular architecture
- ✅ **TypeORM**: PostgreSQL integration
- ✅ **Custom Config Module** with `Joi` validation
- ✅ **Global ValidationPipe** for DTO validation
- ✅ **Swagger** integration for auto-generated API docs
- ✅ **CORS** and secure headers configuration
- ✅ **Global API Prefix** (e.g., `/v1`)
- ✅ **Environment-based configuration** via `.env`

---

## 📃 Environment Variables

Create a `.env` file in the root directory. Example:

```env
NODE_ENV=development
PORT=3000
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=grace_ai
DB_HOST=localhost
DB_PORT=5432
GLOBAL_API_PREFIX=v1
```

> Your `ConfigService` will validate all required variables using `Joi`.

---

## 📘 API Documentation

Swagger UI is available at:

```
http://localhost:3000/docs
```

You can explore all available REST endpoints with full request/response details.

---

## 📁 Folder Structure

```bash
src/
├── app.module.ts         # Root application module
├── main.ts               # Bootstrap the NestJS app
├── config/               # Custom config logic
├── database/             # Database module & service
├── users/                # Example resource module
└── shared/               # Shared enums, interfaces, etc.
```

---

## 🚀 Deployment

When you're ready to deploy, check out the official [NestJS Deployment Guide](https://docs.nestjs.com/deployment).

---

## 🤝 Support

- 📛 Official Docs: [https://docs.nestjs.com](https://docs.nestjs.com)
- 💬 Community Help: [NestJS Discord](https://discord.gg/nestjs)

---

## 📝 License

Grace AI is [MIT licensed](https://opensource.org/licenses/MIT).
