/* =====================================================================
   포트폴리오 콘텐츠 · 설정 파일
   문구, 이미지, 영상, 링크, 모션 강도는 이 파일에서만 고치면 됩니다.

   ■ 자리표시자
     PH("메모")  → 아직 자료가 없는 문구. 화면에 '자리표시자'로 표시됩니다.
     src: null  → 아직 없는 이미지·영상. 회색 빗금 상자로 표시됩니다.
     draft: true → 자료가 없는 섹션. site.showPlaceholders 가 false면 통째로 숨겨집니다.
     hidden: true → 자료 유무와 관계없이 그 섹션을 숨깁니다.

   ■ 미디어 경로
     - 저장소 안 파일: "assets/media/antiframe/hero.mp4" (앞에 / 없이, 사이트 루트 기준)
     - 외부 주소:     "https://..." 그대로
     - 영상 type: "video"(mp4 파일) | "embed"(유튜브·비메오 임베드 주소) | "image"
     - aspect: 원본 비율. 가로 "16/9", 세로 "9/16", 정사각 "1/1".
       상세 페이지 영상·이미지는 이 비율 그대로 보이고, 잘리거나 늘어나지 않습니다.
     - 카드 썸네일(card)은 상세 페이지와 별개로 항상 정사각형으로 잘려 보입니다.
       position 으로 잘리는 위치를 조정하세요 (예: "50% 30%").
   ===================================================================== */

const PH = (note) => ({ placeholder: note });

window.PORTFOLIO = {
  site: {
    name: "SOOHO CHOI",
    subtitle: "AI Content Builder Portfolio",
    intro: "창작자의 의도를 AI 제작 워크플로로 구현합니다.",
    showIntro: true,

    // true  : 자리표시자와 자료 없는 섹션을 보여줌 (작업용)
    // false : 자리표시자를 모두 숨김 (제출용)
    showPlaceholders: true,

    // 연락처. 비워두면 표시하지 않습니다.
    contact: {
      email: null,            // 예: "name@example.com"
      phone: null,            // 예: "010-0000-0000"
      links: [],              // 예: [{ label: "GitHub", url: "https://github.com/..." }]
    },
  },

  /* 모션 강도. 0으로 두면 해당 효과가 꺼집니다.
     사용자가 기기에서 '동작 줄이기'를 켜면 이 값과 관계없이 모두 꺼집니다. */
  motion: {
    enabled: true,
    tilt: 6,              // 카드 최대 기울기 (도)
    imageShift: 14,       // 카드 속 이미지가 반대로 움직이는 거리 (px)
    hoverScale: 1.045,    // 마우스를 올렸을 때 이미지 확대 배율
    lift: 18,             // 마우스를 올렸을 때 카드가 앞으로 나오는 거리 (px)
    smoothing: 0.12,      // 0~1. 작을수록 느리고 부드럽게 따라옴
    intro: true,          // 첫 화면 카드 등장 모션
    cardVideoAutoplay: true, // 카드 영상: 화면에 보일 때만 무음 반복 재생
  },

  projects: [
    /* ───────────────────────────── ① Antiframe ───────────────────────────── */
    {
      slug: "antiframe",
      title: "Antiframe",
      summary: "창작자를 위한 AI 영상 제작 도구",
      competency: "제작 워크플로 설계·서비스 구현",
      lead: "정보성 영상을 만드는 창작자를 위한 AI 영상 제작 도구입니다.",

      card: {
        type: "image",          // "image" | "video"(무음 짧은 영상)
        src: null,              // 예: "assets/media/antiframe/card.jpg"
        poster: null,           // 카드 영상일 때 첫 화면 이미지
        alt: "Antiframe 서비스 화면",
        position: "50% 50%",
        label: "카드 이미지 (정사각형, 1200px 이상)",
      },

      hero: {
        type: "video",
        src: null,              // 예: "assets/media/antiframe/intro.mp4" 또는 유튜브 임베드 주소
        poster: null,
        aspect: "16/9",
        alt: "Antiframe 소개 영상",
        caption: "",
        label: "서비스 소개 영상 또는 실제 서비스 화면",
      },

      meta: [
        { label: "유형", value: "AI 영상 제작 서비스" },
        { label: "기간", value: PH("제작 기간") },
        { label: "역할", value: "기획·개발" },
        { label: "협업", value: PH("협업 범위") },
      ],

      sections: [
        {
          type: "text",
          heading: "누구를 위한 도구인가",
          body: [
            "정보성 영상을 만드는 창작자는 자료 준비, 음성 제작, 편집을 각각 따로 해야 합니다. Antiframe은 이 부담을 줄이기 위해 기획하고 개발했습니다.",
            "AI 모델과 편집 기능을 연결해 제작 공정을 자동화했고, 생성된 결과물은 사용자가 직접 검토하고 수정할 수 있도록 설계했습니다.",
          ],
        },
        {
          type: "flow",
          heading: "제작 흐름",
          wide: true,
          steps: [
            {
              title: "자료 입력",
              desc: "영상으로 만들 자료를 넣습니다.",
              media: { type: "image", src: null, aspect: "16/10", alt: "자료 입력 화면", label: "자료 입력 화면" },
            },
            {
              title: "영상 초안 생성",
              desc: "연결된 AI 모델과 편집 기능이 영상 초안을 만듭니다.",
              media: { type: "image", src: null, aspect: "16/10", alt: "초안 생성 화면", label: "초안 생성 화면" },
            },
            {
              title: "검토·수정",
              desc: "사용자가 생성 결과를 확인하고 직접 고칩니다.",
              media: { type: "image", src: null, aspect: "16/10", alt: "검토·수정 화면", label: "검토·수정 화면" },
            },
            {
              title: "완성 영상",
              desc: "검토를 마친 영상을 완성합니다.",
              media: { type: "image", src: null, aspect: "16/10", alt: "완성 영상 화면", label: "완성 영상 화면" },
            },
          ],
        },
        {
          type: "text",
          heading: "현재 운영 상황",
          facts: [{ label: "베타 테스터", value: "42명" }],
          body: [
            "현재 42명의 베타 테스터와 함께 사용성을 검증하고 있습니다.",
            "신규 AI 모델을 검토해 적용하고, 사용자 피드백과 결과물 평가를 업데이트에 반영하고 있습니다.",
          ],
        },
        {
          type: "cta",
          heading: "데모",
          label: "직접 제작해 보기",
          url: null,             // 실제 데모 주소가 생기면 입력. 비어 있으면 버튼이 비활성화됩니다.
          note: "새 탭에서 Antiframe 데모가 열립니다.",
        },
      ],
    },

    /* ────────────────────────── ② 점괘보는 공녀님 ────────────────────────── */
    {
      slug: "gongnyeo",
      title: "점괘보는 공녀님",
      summary: "영상·이미지 편집으로 완성한 AI 숏애니메이션",
      competency: "시각적 연출·편집·합성",
      lead: "AI로 생성한 이미지와 영상을 편집·합성해 연출 의도에 맞게 완성한 숏애니메이션입니다.",

      card: {
        type: "image",
        src: null,
        poster: null,
        alt: "점괘보는 공녀님 대표 장면",
        position: "50% 50%",
        label: "카드 이미지 (정사각형, 1200px 이상)",
      },

      hero: {
        type: "video",
        src: null,
        poster: null,
        aspect: "16/9",          // 세로 영상이면 "9/16"
        alt: "점괘보는 공녀님 완성 영상",
        caption: "",
        label: "완성 영상",
      },

      meta: [
        { label: "유형", value: "AI 숏애니메이션" },
        { label: "기간", value: PH("제작 기간") },
        { label: "역할", value: PH("본인 담당 역할") },
        { label: "협업", value: PH("협업 범위") },
      ],

      sections: [
        {
          type: "text",
          heading: "제작 목적",
          draft: true,
          body: [PH("이 작품을 만든 목적을 2~3문장으로")],
        },
        {
          type: "text",
          heading: "대표 장면의 연출 의도",
          draft: true,
          body: [PH("대표 장면에서 보여주려 한 감정·분위기·시선 흐름")],
          media: [
            { type: "image", src: null, aspect: "16/9", alt: "대표 장면", label: "대표 장면 스틸컷", caption: "" },
          ],
        },
        {
          type: "cases",
          heading: "문제와 수정",
          wide: true,
          draft: true,
          items: [
            {
              title: PH("사례 1 제목"),
              problem: PH("초기 생성 결과에서 무엇이 문제였는지"),
              change: PH("어떤 편집·합성으로 바꿨는지"),
              result: PH("결과가 어떻게 달라졌는지"),
              compare: {
                type: "image",   // 슬라이더로 비교
                aspect: "16/9",
                before: { name: "수정 전", src: null, alt: "수정 전", label: "수정 전 이미지" },
                after: { name: "수정 후", src: null, alt: "수정 후", label: "수정 후 이미지" },
              },
              stills: [
                { type: "image", src: null, aspect: "16/9", alt: "", label: "과정 스틸컷 1" },
                { type: "image", src: null, aspect: "16/9", alt: "", label: "과정 스틸컷 2" },
                { type: "image", src: null, aspect: "16/9", alt: "", label: "과정 스틸컷 3" },
              ],
            },
            {
              title: PH("사례 2 제목"),
              problem: PH("무엇이 문제였는지"),
              change: PH("어떻게 바꿨는지"),
              result: PH("결과가 어떻게 달라졌는지"),
              compare: {
                type: "video",   // 나란히 놓고 비교
                aspect: "16/9",
                before: { name: "수정 전", src: null, poster: null, label: "수정 전 영상" },
                after: { name: "수정 후", src: null, poster: null, label: "수정 후 영상" },
              },
              stills: [],
            },
          ],
        },
        {
          type: "gallery",
          heading: "최종 장면",
          wide: true,
          draft: true,
          items: [
            { type: "image", src: null, aspect: "16/9", alt: "", label: "최종 장면 1" },
            { type: "image", src: null, aspect: "16/9", alt: "", label: "최종 장면 2" },
          ],
        },
      ],
    },

    /* ─────────────────────────────── ③ 맹종 ─────────────────────────────── */
    {
      slug: "maengjong",
      title: "맹종",
      summary: "사운드 연출로 몰입을 더한 AI 숏애니메이션",
      competency: "사운드 설계·제작·편집",
      lead: "사운드 제작과 편집으로 장면의 감정과 분위기, 몰입을 완성한 숏애니메이션입니다.",

      card: {
        type: "image",
        src: null,
        poster: null,
        alt: "맹종 대표 장면",
        position: "50% 50%",
        label: "카드 이미지 (정사각형, 1200px 이상)",
      },

      hero: {
        type: "video",
        src: null,
        poster: null,
        aspect: "16/9",          // 세로 영상이면 "9/16"
        alt: "맹종 완성 영상",
        caption: "",
        label: "완성 영상",
      },

      meta: [
        { label: "유형", value: "AI 숏애니메이션" },
        { label: "원작", value: "네이버웹툰 《맹종》" },
        { label: "기간", value: PH("제작 기간") },
        { label: "역할", value: PH("본인 담당 역할") },
        { label: "협업", value: PH("협업 범위") },
      ],

      sections: [
        {
          type: "text",
          heading: "제작 목적",
          draft: true,
          body: [PH("이 작품을 만든 목적을 2~3문장으로")],
        },
        {
          type: "text",
          heading: "대표 장면의 청각적 연출",
          draft: true,
          body: [PH("대표 장면에서 소리로 만들려 한 감정·긴장·공간감")],
          media: [
            { type: "video", src: null, poster: null, aspect: "16/9", label: "대표 장면 영상", caption: "" },
          ],
        },
        {
          /* 소리의 역할별 구성.
             source: "ai"(AI 생성) | "self"(직접 제작·편집) | "mixed"(AI 생성 후 직접 편집) | null(미정)
             실제 담당 범위에 맞게 지정하세요. */
          type: "layers",
          heading: "사운드 구성",
          draft: true,
          items: [
            { role: "대사", desc: PH("대사의 역할과 처리 방식"), source: null, audio: null },
            { role: "효과음", desc: PH("효과음의 역할과 처리 방식"), source: null, audio: null },
            { role: "환경음", desc: PH("환경음의 역할과 처리 방식"), source: null, audio: null },
            { role: "음악", desc: PH("음악의 역할과 처리 방식"), source: null, audio: null },
          ],
        },
        {
          type: "cases",
          heading: "제작 과정과 해결한 문제",
          wide: true,
          draft: true,
          items: [
            {
              title: PH("사례 제목"),
              problem: PH("무엇이 문제였는지"),
              change: PH("어떻게 바꿨는지"),
              result: PH("결과가 어떻게 달라졌는지"),
              compare: null,
              stills: [],
            },
          ],
        },
        {
          /* 같은 장면의 사운드 적용 전후 비교.
             type "video": 같은 장면 영상 두 개 / type "audio": 오디오 파일 두 개
             한쪽을 재생하면 다른 쪽은 자동으로 멈춥니다. */
          type: "compare",
          heading: "사운드 적용 전후",
          wide: true,
          draft: true,
          note: "한쪽을 재생하면 다른 쪽은 멈춥니다. ‘같은 지점에서 바꿔 듣기’를 누르면 재생 위치를 유지한 채 전환됩니다.",
          compare: {
            type: "video",
            aspect: "16/9",
            before: { name: "적용 전", src: null, poster: null, label: "사운드 적용 전 영상" },
            after: { name: "적용 후", src: null, poster: null, label: "사운드 적용 후 영상" },
          },
        },
        {
          type: "gallery",
          heading: "최종 장면",
          wide: true,
          draft: true,
          items: [
            { type: "video", src: null, poster: null, aspect: "16/9", label: "최종 장면" },
          ],
        },
      ],
    },
  ],
};
