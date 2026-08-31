#!/bin/bash
# Nightly Postgres backup: dumps the db container, uploads to a dedicated
# PRIVATE Object Storage bucket (S3_BACKUP_BUCKET — deliberately separate
# from S3_BUCKET, the public media bucket: on Selectel, "public" access is a
# whole-bucket setting that exposes every object regardless of its own ACL,
# so backups containing guest PII / password hashes can never share a bucket
# with public photos/music), and prunes backups older than KEEP_DAYS. Meant
# to run via cron on the VPS, from the deploy directory (needs
# docker-compose.prod.yml + .env alongside it):
#   0 3 * * * /opt/wedding-press/scripts/backup-db.sh >> /var/log/wedding-backup.log 2>&1
set -euo pipefail
cd "$(dirname "$0")/.."

set -a
source .env
set +a

# AWS CLI's bundled cert store doesn't (yet) include the intermediate CA
# Selectel's Object Storage cert chains through — falls back to the
# system's, which does (verified against the endpoint directly with
# openssl). Without this every `aws s3` call below fails with
# "self-signed certificate in certificate chain".
export AWS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

KEEP_DAYS=30
TIMESTAMP=$(date +%Y-%m-%d_%H-%M)
BACKUP_FILE="/tmp/wedding-backup-${TIMESTAMP}.sql.gz"

docker compose -f docker-compose.prod.yml exec -T db pg_dump -U wedding wedding | gzip > "$BACKUP_FILE"

aws s3 cp "$BACKUP_FILE" "s3://${S3_BACKUP_BUCKET}/${TIMESTAMP}.sql.gz" --endpoint-url "$S3_ENDPOINT"
rm "$BACKUP_FILE"

CUTOFF=$(date -d "-${KEEP_DAYS} days" +%Y-%m-%d)
aws s3 ls "s3://${S3_BACKUP_BUCKET}/" --endpoint-url "$S3_ENDPOINT" | while read -r _ _ _ name; do
  [ -z "$name" ] && continue
  file_date="${name:0:10}"
  if [[ "$file_date" < "$CUTOFF" ]]; then
    aws s3 rm "s3://${S3_BACKUP_BUCKET}/${name}" --endpoint-url "$S3_ENDPOINT"
  fi
done

echo "Backup complete: ${TIMESTAMP}.sql.gz"
