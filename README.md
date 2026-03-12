# SESI Planejamento Pedagógico

Web application for SESI teachers to create and download pedagogical planning documents.

## Prerequisites

- Docker 24+ and Docker Compose v2
- Node.js 20+ (for local development without Docker)

## Running in Development

```bash
git clone https://github.com/ggggggabriel/planejamento-pedagogico-sesi.git
cd planejamento-pedagogico-sesi
cp .env.example .env
docker compose up -d
```

On first run, run migrations and seed:
```bash
docker compose exec backend npm run db:migrate
docker compose exec backend npm run db:seed
```

Open http://localhost (via Nginx) or http://localhost:4200 (direct Angular).

**Default logins:**
| User | Email | Password | Role |
|---|---|---|---|
| Admin | admin@sesi.com.br | admin123 | ADMIN |
| Professor | professor@sesi.com.br | prof123 | PROFESSOR |

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Prisma MySQL connection string |
| `MYSQL_ROOT_PASSWORD` | MySQL root password |
| `MYSQL_DATABASE` | Database name |
| `MYSQL_USER` / `MYSQL_PASSWORD` | App DB credentials |
| `JWT_SECRET` | Secret for signing JWTs (use a long random string) |
| `JWT_EXPIRES_IN` | Token expiry, e.g. `8h` |

## Deploying to Production (Ubuntu Server)

```bash
# On the server (first time)
chmod +x deploy.sh
./deploy.sh

# On the server (subsequent deploys)
git pull && docker compose -f docker-compose.prod.yml up -d --build
```

Required GitHub Actions secrets for auto-deploy:
- `SERVER_HOST` — server IP or domain
- `SERVER_USER` — SSH user
- `SERVER_SSH_KEY` — private SSH key

## Branch Workflow

```
feature/my-feature → develop → main (auto-deploy)
```

1. Branch from `develop`: `git checkout -b feature/my-feature develop`
2. Open PR to `develop`
3. After review, merge to `develop`
4. Open PR `develop → main` for release
