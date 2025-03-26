# OH School Embedded System

A backend system built with Bun, Hono, and PostgreSQL for school management.

## 🚀 Features

- Modern TypeScript-based backend
- Fast and efficient Bun runtime
- RESTful API using Hono framework
- PostgreSQL database with Drizzle ORM
- JWT-based authentication
- Type-safe API with Zod validation

## 📦 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Hono](https://hono.dev/)
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JSON Web Tokens (JWT)

## 🛠️ Project Structure

```
src/
├── db/           # Database configurations and connections
├── middlewares/  # Custom middleware functions
├── routes/       # API route handlers
├── schema/       # Database schema and type definitions
└── index.ts      # Application entry point
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Bun (latest version)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/happpy/oh_school_embedded_system.git
cd oh_school_embedded_system
```

2. Install dependencies:
```bash
bun install
```

3. Set up your environment variables (if needed)

4. Start the development server:
```bash
bun run dev
```

The server will start on `http://localhost:3000` by default.

## 🔧 Development

- `bun run dev` - Start the development server with hot reload
- Database migrations (if using Drizzle Kit):
  ```bash
  bun drizzle-kit generate:pg   # Generate migrations
  bun drizzle-kit push:pg       # Apply migrations
  ```

## 📝 API Documentation

For detailed API documentation, please refer to the [Oracle.md](./Oracle.md) file.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
