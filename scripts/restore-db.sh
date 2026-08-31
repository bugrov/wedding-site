#!/bin/bash
# Restores a Postgres backup previously created by backup-db.sh.
# DESTRUCTIVE — replaces every row in the current database.
# Usage: ./scripts/restore-db.sh 2026-08-31_03-00
set -euo pipefail
cd "$(dirname "$0")/.."

set -a
source .env
set +a

# See backup-db.sh — AWS CLI's own cert bundle doesn't trust Selectel's chain.
export AWS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

TIMESTAMP="${1:?Usage: restore-db.sh <timestamp, e.g. 2026-08-31_03-00>}"
BACKUP_FILE="/tmp/wedding-restore-${TIMESTAMP}.sql.gz"

aws s3 cp "s3://${S3_BACKUP_BUCKET}/${TIMESTAMP}.sql.gz" "$BACKUP_FILE" --endpoint-url "$S3_ENDPOINT"

echo "About to REPLACE the current database with the backup from ${TIMESTAMP}. Ctrl+C to cancel."
sleep 5

gunzip -c "$BACKUP_FILE" | docker compose -f docker-compose.prod.yml exec -T db psql -U wedding wedding

rm "$BACKUP_FILE"
echo "Restore complete."
