#!/bin/bash
set -e

echo "=== SESI Planejamento — Deploy ==="

APP_DIR="/opt/sesi-planejamento"

if [ ! -d "$APP_DIR" ]; then
  git clone https://github.com/ggggggabriel/planejamento-pedagogico-sesi.git "$APP_DIR"
fi

cd "$APP_DIR"
git pull origin main

if [ ! -f .env ]; then
  echo "ERRO: arquivo .env não encontrado em $APP_DIR"
  echo "Crie o arquivo .env baseado em .env.example antes de fazer o deploy."
  exit 1
fi

docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec -T backend node prisma/seed.js

echo "=== Deploy concluído ==="
