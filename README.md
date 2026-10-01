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
| 최상단 결과물 넣기 | `outcome.media.src` (mp4 경로 또는 유튜브 임베드 주소, 그때 `type: "embed"`) |
| 세로 영상 | `aspect: "9/16"` (잘리거나 늘어나지 않음) |
| 문구 채우기 | `PH("...")` 를 실제 문장 `"..."` 으로 교체 |
| 섹션 숨기기 | 섹션에 `hidden: true` |
| 자리표시자 전부 숨기기(제출용) | `site.showPlaceholders: false` → `draft: true` 섹션과 빈 미디어가 사라짐 |
| 데모 버튼 켜기 | Antiframe `outcome.action.url` |
| 연락처 | `site.contact` |
| 카드 물결·탄성 모션 | `wave-gallery.js`의 fragment shader와 스프링 설정. `data.js`의 `motion.enabled: false`면 끔 |
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
- `cards` 번호가 있는 2단 설명 카드
- `matrix` 행·열 구분선이 있는 검수 기준 표 (모바일 내부 스크롤)
- `cta` 새 탭으로 여는 버튼

각 상세페이지는 `resume`의 소제목·설명과 `outcome`의 결과물을 **하나의 프로젝트 요약**에 표시합니다. 그 아래에는 목차와 `sections`의 상세 제작기가 이어집니다. 요약은 카드나 2단 배치 없이 한 열로 읽습니다.

- `article`: `parts`별 소제목·본문·미디어·순서·표·오디오 비교를 이어 붙이는 블로그 본문
- `resume`: `heading`과 `body`로 구성한 이력서 형식의 프로젝트 요약

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
- Antiframe: 실제 생성 영상과 42명 베타 테스트 현황, 로그인 없이 이용하는 제작 체험 URL.
- 원본 마스터와 작업 문서는 저장소에 포함하지 않았습니다. 사이트에는 선별 이미지와 압축 오디오만 포함합니다.
- 메인은 WebGL 물방울 모션을 사용합니다. 화면 밖·백그라운드·팝업 열람 중에는 모션을 중단하고, 모션 감소 설정·WebGL 미지원 시 정적인 이미지로 표시합니다.

## 2026-10-01 설명·인터랙션 개선

- 원본 Antiframe 로고를 새 썸네일 파일로 반영해 기존 이미지 캐시와 구분했습니다.
- 인트로·물결·팝업 전환을 느리게 조정하고, 마우스 위치에 반응하는 탄성 움직임을 적용했습니다.
- 상세페이지 상단에 요약과 결과물을 우선 배치하고, 이후 제작 워크플로·문제 해결·검수 기준을 번호로 구분했습니다.
- 공녀님은 화자 분리·합성과 실제 편집 타임라인, 맹종은 음성·효과음·음악의 생성 및 직접 편집 과정을 중심으로 설명합니다.

## 2026-10-01 상세페이지 블로그 전환

- 요약과 결과물을 하나의 상단 섹션에 통합했습니다. 소제목 아래 설명이 이어지는 이력서 형식이며, 격자 요약 카드는 사용하지 않습니다.
- 서비스 버튼을 ‘서비스 체험하기’로 변경했습니다.
- 상세 본문은 단일 읽기 열로 구성하고, 제작 배경·공정 설계·문제 해결·검수·결과를 기존 자료에 근거해 확장했습니다.
- 목차는 팝업 내부의 해당 장으로 이동합니다. 미디어는 필요한 문단에 배치하며, 표와 비교 자료의 구분선 및 모바일 내부 스크롤을 유지합니다.
- 구성 참고: [토스의 AI 그래픽 생성기 개발기](https://toss.tech/article/ai-graphic-generator-1), [카카오뱅크 시퀀스 기반 FDS 모델 개발기](https://tech.kakaobank.com/posts/2606-sequence-based-fds-model/), [카카오엔터테인먼트 기술블로그](https://tech.kakaoent.com/). 글의 전개와 읽기 레이아웃만 참고했으며, 프로젝트 사실과 수치는 본인의 작업 자료에서 가져왔습니다.

## 2026-10-01 결과물 우선 배치·입체 도입 모션

- 모든 프로젝트는 제목과 요약보다 결과물 영상을 먼저 표시합니다. 상단 플레이어는 16:9이며, 세로 원본은 크롭 없이 여백을 두고 재생합니다.
- CJ 형태의 세 물방울이 같은 표면을 유지한 채 깊이 이동, X/Y/Z 회전, 탄성 변형을 거쳐 프로젝트 카드로 이어집니다. 도입부는 약 6.7초이며, 이동하는 소프트박스 반사광과 가장자리 광택을 기존 셰이더에 통합했습니다.
- 캔버스 수와 해상도 제한은 유지합니다. 새 입자나 무거운 후처리를 추가하지 않으며, 모션 감소·탭 비활성화·Escape/Tab 건너뛰기 동작을 유지합니다.

## 2026-10-02 물 재질·핵심 역량 해시태그

- 메인 카드에서 원작 플랫폼 표시를 제거하고, 제목과 설명 사이에 프로젝트별 핵심 역량 3개를 해시태그로 표시합니다. 상세페이지의 출처 정보는 유지합니다.
- 불투명한 구형 명암을 투명한 색, 가장자리 굴절, 얇은 수면 반사광으로 교체했습니다. 표면과 윤곽의 잔물결, 이동 중 늘어남과 복원으로 물의 유동성을 표현합니다.
- 도입 타임라인을 6.65초에서 5.32초로 20% 단축했습니다. 텍스트 등장도 함께 비례 조정합니다.

## 2026-10-02 Liquid Glass 재질 시스템

### 적용 범위
- Hero 카드: WebGL 렌즈. 프로젝트 이미지 텍스처를 곡면 법선과 굴절률(1.333)에 따라 재샘플링합니다. DOM 전체를 캡처하거나 전체 화면을 굴절시키지 않습니다.
- 상단 이름 링크·서비스 체험 CTA·팝업 닫기·다른 작업 링크: 공통 `.glass-control`. 본문 텍스트 위에 효과를 씌우지 않고, 글자 아래의 얇은 재질 레이어에서 처리합니다.
- 팝업: 투명감을 주는 테두리만 적용하고 읽기 영역은 흰 배경으로 유지합니다.
- 도입부: 5.32초 유지. 가까운 물방울 사이에 짧은 액체 연결부를 그린 뒤 분리합니다. 이는 제한된 2D 메타볼 스타일 연결이며 유체 시뮬레이션은 아닙니다.

### 기술·동작
- WebGL: `refract()`로 렌즈 확대·가장자리 왜곡, 표면 잔물결, 커서 방향 반사광을 계산합니다. Hover 시 굴절 강도를 높이고, 누르면 가로로 늘어나고 세로로 눌리는 변형을 적용합니다.
- SVG: 데스크톱 Chromium의 작은 버튼에만 캡슐형 변위 맵 + `feDisplacementMap`을 `backdrop-filter`로 적용합니다. 버튼마다 크기 변경 시에만 맵을 만들고, 동적 CTA가 사라지면 관련 필터를 정리합니다.
- CSS: 투명 그라데이션·베젤·얕은 그림자·180~220ms 반응을 공통 재질로 사용합니다. Safari/iOS와 터치 환경의 작은 버튼에는 CSS 대체 효과를 사용합니다.
- WebGL 미지원은 SVG 이미지 카드, `prefers-reduced-motion`은 정적 렌즈와 변형 없는 버튼, 고대비 설정에서는 불투명 버튼으로 대체합니다.
- Hero 캔버스 3개와 제한 해상도를 유지합니다. 화면 밖·탭 비활성화·팝업 열람 중에는 Hero 렌더링을 중단합니다. 작은 버튼의 커서 추적은 입력이 있을 때만 실행됩니다.

### 유지보수
- `assets/js/wave-gallery.js`: Hero 렌즈·광원·변형.
- `assets/js/glass-controls.js`: 작은 버튼의 변위 맵·상호작용·필터 수명 관리. 새 UI는 `initGlassControls(root)`로 초기화합니다.
- `assets/js/liquid-intro.js`: 로고에서 카드로 이어지는 타임라인·짧은 연결부.
- `assets/css/style.css`: 공통 재질·모바일·접근성 대체 스타일.
- 검증: Chrome 데스크톱/모바일 에뮬레이션, 실제 배경 굴절 전후 비교, 반복 팝업 필터 정리, WebGL 미지원 및 모션 감소 경로. Safari/iOS 실기기 검증은 수행하지 않았습니다.
- 구현 참고: [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter), [MDN feDisplacementMap](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap).
