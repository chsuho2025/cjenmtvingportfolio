# Vercel 배포 확인 키트 (Next.js App Router)

## 적용 방법
1. 파일을 프로젝트 루트에 같은 경로로 복사
   - `next.config.js` — 기존 설정이 있으면 `env.BUILD_TIME`만 합치기
   - `components/DeployBadge.tsx`
   - `app/api/health/route.ts`
   - `deploy-check.sh`
2. `app/layout.tsx`의 `<body>` 안에 추가
   ```tsx
   import DeployBadge from "@/components/DeployBadge";
   // ...
   <DeployBadge />
   ```
3. `deploy-check.sh`의 `SITE`를 본인 Vercel 도메인으로 수정

## 실행
```bash
./deploy-check.sh "커밋 메시지"
```
변경사항이 없어도 빈 커밋으로 재배포를 트리거합니다.

## 확인
- 사이트 우측 하단 배지의 SHA가 `git rev-parse --short HEAD`와 같으면 반영 완료
- 또는 `https://<도메인>/api/health` 에서 `commit` 값 확인

확인이 끝나면 `DeployBadge`만 제거하고 `/api/health`는 남겨두는 걸 추천합니다.
