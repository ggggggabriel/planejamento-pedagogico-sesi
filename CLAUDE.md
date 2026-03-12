# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Full-stack web application for SESI teachers to create and download pedagogical planning documents (.docx).

**Stack:** Node.js/Express + Angular 19 + MySQL 8 + Docker + Nginx

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — triggers auto-deploy via GitHub Actions |
| `develop` | Integration branch — all features merge here first |
| `feature/*` | Individual feature branches |

Always branch from `develop`, open PRs to `develop`. Only `develop → main` for releases.

## Running in Development

```bash
cp .env.example .env          # fill in secrets
docker compose up -d          # starts mysql, backend, frontend, nginx
```

Services:
- Frontend: http://localhost:4200 (or http://localhost via nginx)
- Backend: http://localhost:3000
- MySQL: localhost:3306

First run only:
```bash
docker compose exec backend npm run db:migrate
docker compose exec backend npm run db:seed
```

Default credentials after seed: `admin@sesi.com.br` / `admin123`, `professor@sesi.com.br` / `prof123`

## Backend (`backend/`)

**Run commands:**
```bash
npm run dev          # nodemon dev server
npm run db:migrate   # run Prisma migrations
npm run db:seed      # seed disciplines and default users
npm run db:generate  # regenerate Prisma client after schema changes
```

**Key files:**
- `src/app.js` — Express app, route mounting
- `src/server.js` — HTTP server entry point
- `src/routes/` — auth, disciplinas, planejamentos
- `src/middleware/auth.middleware.js` — JWT validation
- `src/services/docx.service.js` — .docx generation with `docx` npm library
- `prisma/schema.prisma` — DB schema (Usuario, Disciplina, Habilidade, Planejamento)
- `prisma/seed.js` — seeds disciplines and default users

**Auth:** JWT Bearer tokens. Protected routes require `Authorization: Bearer <token>` header.

**Roles:** PROFESSOR (own planejamentos only), COORDENADOR/ADMIN (all planejamentos).

## Frontend (`frontend/`)

**Run commands:**
```bash
npm start    # ng serve on port 4200
npm run build  # production build → dist/
```

**Architecture:** Angular 19 standalone components, lazy-loaded routes.

- `src/app/auth/login/` — login screen
- `src/app/planejamento/form/` — planning form with dynamic skill loading
- `src/app/historico/` — teacher's planning history
- `src/app/dashboard/` — coordinator view (all planejamentos)
- `src/app/core/services/auth.service.ts` — JWT login/logout, localStorage
- `src/app/core/services/planejamento.service.ts` — API calls
- `src/app/core/interceptors/auth.interceptor.ts` — attaches Bearer token to all requests
- `src/app/core/guards/auth.guard.ts` — redirects unauthenticated users to /login
- `src/environments/` — `apiUrl` differs between dev (localhost:3000) and prod (/api)

## Infrastructure

- `docker-compose.yml` — dev (with volume mounts for hot reload)
- `docker-compose.prod.yml` — prod (no volume mounts, optimized builds)
- `nginx/nginx.dev.conf` — proxies `/api/*` to backend, `/` to frontend dev server
- `nginx/nginx.prod.conf` — same but with SSL termination; replace `yourdomain` with actual domain
- `.github/workflows/ci.yml` — runs on every PR: backend syntax check + frontend build
- `.github/workflows/deploy.yml` — runs on push to `main`: SSH deploy via `appleboy/ssh-action`
- `deploy.sh` — manual deploy script for Ubuntu server

## Legacy

`legacy/` preserves the original Flask implementation for reference.
