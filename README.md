# SOOHO CHOI · AI Content Builder Portfolio

티빙 AI Content Builder 지원용 포트폴리오 사이트입니다.
빌드 과정이 없는 정적 사이트(HTML·CSS·JS)라서, 파일을 GitHub에 올리면 Vercel이 그대로 배포합니다.

## 구조

```
index.html                 메인 (카드 3개)
projects/antiframe.html    Antiframe 상세
projects/gongnyeo.html     점괘보는 공녀님 상세
projects/maengjong.html    맹종 상세
assets/js/data.js          ★ 문구·미디어·링크·연락처 (대부분 이 파일만 수정)
assets/js/app.js           화면 구성·재생 제어 (구조를 바꿀 때만)
assets/js/wave-gallery.js  WebGL 이미지 곡면·물결 모션
assets/css/style.css       ★ 맨 위 :root 에 색·글꼴·간격·카드 크기
assets/media/<작업명>/      이미지·영상 파일 (assets/media/README.md 참고)
vercel.json                정적 배포 설정 (/projects/antiframe 처럼 .html 없이 접속)
```

## 자주 하는 수정

| 하고 싶은 것 | 고칠 곳 |
|---|---|
| 카드 이미지 넣기 | `data.js` → 해당 작업 `card.src` |
| 카드에 짧은 무음 영상 | `card.type: "video"`, `card.src`, `card.poster` |
| 카드에서 잘리는 위치 | `card.position` (예: `"50% 30%"`) |
| 완성 영상 넣기 | `hero.src` (mp4 경로 또는 유튜브 임베드 주소, 그때 `type: "embed"`) |
| 세로 영상 | `aspect: "9/16"` (잘리거나 늘어나지 않음) |
| 문구 채우기 | `PH("...")` 를 실제 문장 `"..."` 으로 교체 |
| 섹션 숨기기 | 섹션에 `hidden: true` |
| 자리표시자 전부 숨기기(제출용) | `site.showPlaceholders: false` → `draft: true` 섹션과 빈 미디어가 사라짐 |
| 데모 버튼 켜기 | Antiframe `type: "cta"` 섹션의 `url` |
| 연락처 | `site.contact` |
| 카드 물결 모션 | `wave-gallery.js`의 vertex shader. `data.js`의 `motion.enabled: false`면 끔 |
| 배경·글자색, 카드 간격·크기, 여백 | `style.css` 맨 위 `:root` |
| 글꼴 | 각 HTML의 Google Fonts 링크 + `style.css`의 `--font-sans` |

자료가 들어와 섹션을 채웠다면 그 섹션의 `draft: true` 를 지우세요.

### 섹션 종류 (data.js 의 `type`)

- `text` 소제목 + 문단 (`facts`, `media` 선택)
- `flow` 단계별 제작 흐름 (단계마다 화면 이미지 선택)
- `cases` 사례별 “문제 / 수정 / 결과” + 전후 비교 + 과정 스틸컷
- `compare` 전후 비교 한 쌍. `type: "image"` 는 드래그 슬라이더, `"video"`·`"audio"` 는 나란히 재생 + ‘같은 지점에서 바꿔 듣기’
- `layers` 사운드 역할별 구성(대사·효과음·환경음·음악). `source` 로 AI 생성 / 직접 제작·편집 / AI 생성 후 직접 편집 표시
- `gallery` 이미지·영상 모음
- `cta` 새 탭으로 여는 버튼

소리가 있는 영상·오디오는 사용자가 누를 때만 재생됩니다. HTML 영상·오디오끼리는 하나를 재생하면 나머지가 멈추며, YouTube 임베드는 별도로 제어합니다.

## 로컬에서 보기

`index.html` 을 더블클릭하면 대부분 보이지만, 영상 확인은 로컬 서버를 권장합니다.

```bash
npx serve .          # 또는
python3 -m http.server 8000
```

## 배포

1. 이 폴더의 파일 전체를 저장소 루트에 올리고 커밋 (웹에서 “Add files via upload” 도 가능)
2. Vercel 프로젝트 설정: Framework Preset **Other**, Build Command 비움, Output Directory 비움(루트), Root Directory 저장소 루트
3. 푸시하면 자동 배포

기존 테스트 설정(`"framework": null`)을 그대로 유지했습니다. 예전 README에 적힌 Next.js 설정은 더 이상 필요하지 않습니다.

## 영상 용량

GitHub 웹 업로드는 파일당 25MB, git 푸시는 100MB가 한도입니다.
긴 완성 영상은 유튜브(일부 공개)·비메오에 올리고 `type: "embed"` 로 넣는 편이 안정적입니다.
카드용 무음 영상은 3~6초, 720px, 2MB 이하 mp4 를 권장합니다.

## 2026-09-30 자료 반영

- 공녀님: 원작 컷과 세로 프레임, 화자별 생성 이미지, 합성 결과 및 공개 홍보 영상.
- 맹종: 완성본, 대사 생성 소재, 효과음 후보 비교, 장면별 음악 큐.
- Antiframe: 기존 서비스 화면과 42명 베타 테스트 현황. 실제 제작 체험 URL은 확인 후 연결합니다.
- 원본 마스터와 작업 문서는 저장소에 포함하지 않았습니다. 사이트에는 선별 이미지와 압축 오디오만 포함합니다.
- 메인은 곡면에 이미지를 그리는 WebGL 모션을 사용합니다. 모바일·모션 감소 설정·WebGL 미지원 시 정적인 이미지로 표시합니다.
