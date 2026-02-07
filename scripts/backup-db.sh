#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_ROOT}/backups"

cd "$PROJECT_ROOT"

# Source .env for credentials
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

MYSQL_USER="${MYSQL_USER:-ghost}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-}"
MYSQL_DATABASE="${MYSQL_DATABASE:-ghost}"

if [ -z "$MYSQL_PASSWORD" ]; then
  echo "Error: MYSQL_PASSWORD not set. Check your .env file."
  exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/ghost_${TIMESTAMP}.sql.gz"

echo "Backing up Ghost database..."
docker compose exec -T mysql mysqldump \
  -u"$MYSQL_USER" \
  -p"$MYSQL_PASSWORD" \
  "$MYSQL_DATABASE" | gzip > "$BACKUP_FILE"

echo "Backup saved to: $BACKUP_FILE"
echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Keep only last 10 backups
cd "$BACKUP_DIR"
ls -t ghost_*.sql.gz 2>/dev/null | tail -n +11 | xargs -r rm --
echo "Cleanup done. Keeping last 10 backups."
