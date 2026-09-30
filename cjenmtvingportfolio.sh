#!/usr/bin/env bash
set -e

SITE="https://your-portfolio.vercel.app"   # 본인 도메인으로 변경
BRANCH="main"
MSG="${1:-chore: deploy check $(date '+%Y-%m-%d %H:%M')}"

git add -A
git commit --allow-empty -m "$MSG"
git push origin "$BRANCH"

SHA=$(git rev-parse HEAD)
echo "푸시 완료: ${SHA:0:7} — Vercel 반영 대기 중..."

for i in {1..30}; do
  if curl -s "$SITE/api/health" | grep -q "$SHA"; then
    echo "✅ 배포 확인 완료 (${i}회 시도)"
    exit 0
  fi
  sleep 10
done

echo "❌ 5분 내 반영 안 됨 — Vercel 대시보드의 빌드 로그 확인 필요"
exit 1
