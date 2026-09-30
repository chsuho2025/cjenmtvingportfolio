# 테스트용 페이지

## 기존 Next.js 프로젝트가 있다면
`app/page.js`(또는 page.tsx) 내용만 아래로 교체하고 이전에 넣은 DeployBadge·health 관련 코드는 삭제하세요.

```js
export default function Home() {
  return <h1>테스트용</h1>;
}
```

## 빈 저장소라면
이 폴더 안의 파일 전체를 저장소 루트에 넣고 푸시하세요.

```bash
git add -A
git commit -m "test: 테스트용 페이지"
git push origin main
```

Vercel 프로젝트 설정에서 Framework Preset이 Next.js, Root Directory가 저장소 루트인지 확인하세요.
