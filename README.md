# Nebbler API

Node.js + Express + TypeScript backend with PostgreSQL.

## Prerequisites

- Node.js >= 20.0.0 (recommend using nvm: `nvm use`)
- PostgreSQL 15+ (local) or hosted database account
- npm

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file:
   ```bash
   cp .env.example .env
   ```
4. Configure your database connection in `.env`
5. Start development server:
   ```bash
   npm run dev
   ```

## Environment Configuration

### Local Development

Configure individual database parameters in `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=nebbler_dev
DB_SSL=false
```

### Hosted Database (Supabase/Railway/Neon)

Use the `DATABASE_URL` connection string and set `DB_SSL=true`:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DB_SSL=true
```

## Database Setup

### Local PostgreSQL

```bash
# Create database
createdb nebbler_dev

# Verify connection
npm run dev
```

### Hosted Providers

1. Create a new PostgreSQL database
2. Copy the connection string to `DATABASE_URL`
3. Set `DB_SSL=true`

## Development

```bash
npm run dev        # Start with hot reload
npm run lint       # Run ESLint
npm run lint:fix   # Fix lint errors
npm run format     # Format with Prettier
npm run typecheck  # TypeScript type checking
npm run build      # Compile TypeScript
npm start          # Run production build
```

## API Endpoints

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| GET    | /health     | Health check      |
| GET    | /health/db  | Database health   |

## Project Structure

```
src/
├── config/      # Configuration and environment
├── middleware/  # Express middleware
├── routes/      # API routes
├── utils/       # Utility functions
├── types/       # TypeScript types
├── app.ts       # Express app setup
└── server.ts    # Server entry point
```

## Environment Variables

| Variable      | Default       | Description                          |
| ------------- | ------------- | ------------------------------------ |
| NODE_ENV      | development   | Environment mode                     |
| PORT          | 3000          | Server port                          |
| HOST          | 0.0.0.0       | Server host                          |
| DATABASE_URL  | -             | Full connection string (hosted)      |
| DB_HOST       | localhost     | Database host (local)                |
| DB_PORT       | 5432          | Database port                        |
| DB_USER       | postgres      | Database username                    |
| DB_PASSWORD   | -             | Database password                    |
| DB_NAME       | nebbler_dev   | Database name                        |
| DB_SSL        | false         | Enable SSL for database              |
| LOG_LEVEL     | info          | Pino log level                       |

## Deployment

### Build

```bash
npm run build
```

### Run Production

```bash
NODE_ENV=production npm start
```

Ensure all required environment variables are set in your deployment environment.
