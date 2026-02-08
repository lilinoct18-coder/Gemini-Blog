#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Check .env exists
if [ ! -f .env ]; then
  echo "Error: .env file not found. Copy from .env.example first:"
  echo "  cp .env.example .env"
  exit 1
fi

echo "Starting Ghost CMS and MySQL..."
docker compose --profile backend up -d

echo ""
echo "Waiting for MySQL to be healthy..."
until docker compose exec mysql mysqladmin ping -h localhost --silent 2>/dev/null; do
  sleep 2
  printf "."
done
echo " MySQL is ready!"

echo ""
echo "Waiting for Ghost to start..."
until curl -s -o /dev/null -w "%{http_code}" http://localhost:2368 | grep -q "200\|301\|302"; do
  sleep 3
  printf "."
done
echo " Ghost is ready!"

echo ""
echo "═══════════════════════════════════════════════"
echo " Ghost CMS is running!"
echo ""
echo " Admin panel: http://localhost:2368/ghost"
echo ""
echo " Next steps:"
echo "   1. Visit the admin panel and create your account"
echo "   2. Create two authors: Novis (slug: novis) and Lilin (slug: lilin)"
echo "   3. Go to Settings > Integrations > Add custom integration"
echo "   4. Copy the Content API Key to your .env file"
echo "═══════════════════════════════════════════════"
