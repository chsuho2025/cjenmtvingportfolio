/* 사용자 확인 내용과 실제 작업 자료를 바탕으로 작성 */
window.PORTFOLIO = {
  "site": {
    "name": "SOOHO CHOI",
    "subtitle": "AI Content Builder Portfolio",
    "intro": "창작자의 의도를 AI 제작 워크플로로 구현합니다.",
    "showIntro": true,
    "showPlaceholders": false,
    "contact": {
      "email": null,
      "phone": null,
      "links": []
    }
  },
  "motion": {
    "enabled": true,
    "tilt": 0,
    "imageShift": 0,
    "hoverScale": 1.06,
    "lift": 0,
    "arc": 0,
    "smoothing": 0.09,
    "intro": true,
    "cardVideoAutoplay": true
  },
  "projects": [
    {
      "slug": "antiframe",
      "title": "Antiframe",
      "summary": "대본에서 완성 영상까지, AI 제작 서비스",
      "competency": "서비스 기획 · 워크플로 설계 · 개발",
      "lead": "대본을 장면 구성·내레이션·영상 편집으로 연결하는 AI 영상 제작 서비스입니다.",
      "card": {
        "type": "image",
        "src": "assets/media/antiframe/cover.svg",
        "poster": null,
        "alt": "Antiframe AI 영상 제작 서비스",
        "position": "50% 50%",
        "label": "카드 이미지 (정사각형, 1200px 이상)"
      },
      "hero": null,
      "meta": [
        {
          "label": "유형",
          "value": "개인 AI 영상 제작 서비스"
        },
        {
          "label": "역할",
          "value": "기획·개발"
        },
        {
          "label": "베타 테스트",
          "value": "42명 참여"
        }
      ],
      "sections": [
        {
          "type": "text",
          "heading": "제작 과정을 하나의 서비스로",
          "body": [
            "정보성 영상 제작자가 자료를 찾고 음성을 만든 뒤 편집 도구로 옮겨야 하는 과정을 통합했습니다. AI가 구성한 장면을 사용자가 검토·수정하고, 내레이션과 자막을 포함한 영상으로 완성하도록 설계했습니다.",
            "42명의 베타 테스터와 사용성을 검증했으며, 신규 모델의 생성 결과와 사용자 피드백을 서비스 개선에 반영해 왔습니다."
          ]
        },
        {
          "type": "text",
          "heading": "대본으로 만든 21초 영상",
          "body": [
            "대본 입력부터 장면 구성, 내레이션·자막 생성, 영상 출력까지 서비스의 실제 제작 흐름으로 완성한 예시입니다."
          ],
          "media": [
            {
              "type": "video",
              "src": "assets/media/antiframe/demo.mp4",
              "poster": "assets/media/antiframe/demo-poster.jpg",
              "aspect": "16/9",
              "alt": "안티프레임으로 제작한 공원 산책 안내 영상",
              "caption": "Pexels 영상 · ElevenLabs 내레이션 · 자동 자막"
            }
          ]
        },
        {
          "type": "live-demo",
          "wide": true,
          "heading": "직접 체험하기",
          "url": "https://antiframe.vercel.app/generate",
          "title": "Antiframe 영상 제작",
          "label": "가입 없이 영상 만들기",
          "status": "",
          "note": "가입 없이 무료 체험 한도 내에서 영상을 제작할 수 있습니다. 새 탭에서 주제와 대본을 입력해 시작해 보세요."
        }
      ]
    },
    {
      "slug": "gongnyeo",
      "title": "점괘보는 공녀님",
      "summary": "원작의 그림체를 살린 AI 애니메이션",
      "competency": "이미지 확장 · 영상 생성 · 대화 장면 합성",
      "lead": "원작의 인물과 그림체를 유지하며 세로형 애니메이션을 제작했습니다. AI 생성의 한계는 장면별 편집과 합성으로 보완했습니다.",
      "card": {
        "type": "image",
        "src": "assets/media/gongnyeo/speaker-female.png",
        "poster": null,
        "alt": "점괘보는 공녀님 대표 장면",
        "position": "50% 53%",
        "label": "카드 이미지 (정사각형, 1200px 이상)"
      },
      "hero": {
        "type": "embed",
        "src": "https://www.youtube-nocookie.com/embed/PwsN7nyzPyk",
        "aspect": "9/16",
        "alt": "점괘보는 공녀님 9화 · 에피소드형 완성본",
        "caption": "점괘보는 공녀님 9화 · 에피소드형 완성본"
      },
      "meta": [
        {
          "label": "제작",
          "value": "카카오엔터테인먼트 재직 중"
        },
        {
          "label": "기간",
          "value": "2025.10–2025.12"
        },
        {
          "label": "담당",
          "value": "영상 제작 전 과정 · 본인 100%"
        }
      ],
      "sections": [
        {
          "type": "gallery",
          "heading": "원작 컷을 세로 화면에 맞게 확장",
          "items": [
            {
              "type": "image",
              "src": "assets/media/gongnyeo/first-frame-original.png",
              "aspect": "481/587",
              "alt": "원작 컷 · 인물과 그림체의 기준",
              "caption": "원작 컷"
            },
            {
              "type": "image",
              "src": "assets/media/gongnyeo/first-frame-vertical.png",
              "aspect": "9/16",
              "alt": "세로 확장 결과 · 원작의 인물을 유지하며 화면 재구성",
              "caption": "9:16 화면으로 확장한 첫 프레임"
            }
          ],
          "body": [
            "인물의 얼굴·의상·선화는 유지하고 배경과 여백을 확장해, 영상 생성에 사용할 첫 프레임을 만들었습니다."
          ]
        },
        {
          "type": "cases",
          "heading": "화자를 분리해 대화 장면 완성",
          "items": [
            {
              "title": "",
              "problem": "한 번에 두 인물을 생성하면 입 움직임과 발화 순서가 대사에 맞지 않았습니다.",
              "change": "각 인물의 발화 영상을 따로 생성한 뒤, 말하는 인물과 상대방의 정지 프레임을 합성했습니다. 음성 길이에 맞춰 영상 속도와 정지 구간도 조정했습니다.",
              "result": "원작의 두 인물이 한 화면에서 차례로 대화하는 장면을 완성했습니다.",
              "stills": [
                {
                  "type": "image",
                  "src": "assets/media/gongnyeo/speaker-male.png",
                  "aspect": "9/16",
                  "alt": "남성 발화용 장면 · 여성의 입과 움직임은 안정된 상태 유지",
                  "caption": "남성 발화 장면"
                },
                {
                  "type": "image",
                  "src": "assets/media/gongnyeo/speaker-female.png",
                  "aspect": "9/16",
                  "alt": "여성 발화용 장면 · 남성의 비발화 상태와 조합",
                  "caption": "여성 발화 장면"
                }
              ]
            }
          ]
        },
        {
          "type": "text",
          "heading": "대화 장면 합성 결과",
          "body": [],
          "media": [
            {
              "type": "embed",
              "src": "https://www.youtube-nocookie.com/embed/ahtOHt9TQtE",
              "aspect": "9/16",
              "alt": "화자 분리 합성 결과",
              "caption": "화자 분리 합성 결과"
            }
          ]
        },
        {
          "type": "gallery",
          "heading": "프로모션 영상",
          "items": [
            {
              "type": "embed",
              "src": "https://www.youtube-nocookie.com/embed/Unnp3GSet9M",
              "aspect": "9/16",
              "alt": "1~6화 요약형 프로모션",
              "caption": "1~6화 요약형 프로모션"
            },
            {
              "type": "embed",
              "src": "https://www.youtube-nocookie.com/embed/Bt2eeOXGEI8",
              "aspect": "9/16",
              "alt": "9화 티저형 프로모션",
              "caption": "9화 티저형 프로모션"
            }
          ],
          "collapsible": true,
          "toggleLabel": "추가 영상 2편 보기"
        }
      ]
    },
    {
      "slug": "maengjong",
      "title": "맹종",
      "summary": "대사와 사운드로 완성한 무속 공포",
      "competency": "AI 음성 디렉팅 · 효과음 제작 · 믹싱",
      "lead": "네이버웹툰 《맹종》 1화와 2화 초반을 약 5분의 세로형 애니메이션으로 각색했습니다. 대사·효과음·음악을 직접 생성하고 편집해 장면의 긴장감을 조절했습니다.",
      "card": {
        "type": "image",
        "src": "assets/media/maengjong/frame-233.jpg",
        "poster": null,
        "alt": "맹종 대표 장면",
        "position": "50% 45%",
        "label": "카드 이미지 (정사각형, 1200px 이상)"
      },
      "hero": {
        "type": "embed",
        "src": "https://www.youtube-nocookie.com/embed/fxLTM8oc8qY",
        "aspect": "9/16",
        "alt": "맹종 1~2화 AI 애니메이션 · 완성본",
        "caption": "맹종 1~2화 AI 애니메이션 · 완성본"
      },
      "meta": [
        {
          "label": "유형",
          "value": "웹툰 기반 개인 제작"
        },
        {
          "label": "기간",
          "value": "2026.08.17–08.23"
        },
        {
          "label": "담당",
          "value": "각색·영상·사운드·편집"
        },
        {
          "label": "완성본",
          "value": "4분 59초 · 세로형"
        }
      ],
      "sections": [
        {
          "type": "cases",
          "heading": "문맥을 더해 발음과 감정 표현 보완",
          "items": [
            {
              "title": "",
              "problem": "짧은 대사를 생성하면 첫 음절이나 끝음이 잘리고, 감정 표현이 장면과 어긋났습니다.",
              "change": "같은 감정의 앞뒤 대사를 추가해 생성한 뒤, 발음과 연기를 비교해 후보를 골랐습니다. 파형과 타임스탬프를 참고해 실제로 사용할 대사만 분리했습니다.",
              "result": "대사의 잘림을 보완하고, 장면에 필요한 발화와 호흡을 선택해 편집했습니다."
            }
          ]
        },
        {
          "type": "layers",
          "heading": "생성 음성 샘플",
          "items": [
            {
              "role": "화림 대사",
              "source": "ai",
              "desc": "앞뒤 문맥을 포함해 생성한 음성입니다. 완성 영상에는 본대사 구간만 편집해 사용했습니다.",
              "audio": "assets/media/maengjong/DIA_HW_05_FINAL.m4a"
            }
          ]
        },
        {
          "type": "cases",
          "heading": "생성 지시를 바꿔 효과음의 타격감 보완",
          "items": [
            {
              "title": "",
              "problem": "숟가락으로 밥상을 치는 소리를 지시했지만, 장면에 필요한 강한 타격감이 나오지 않았습니다.",
              "change": "금속 쟁반을 한 번 강하게 치는 소리로 지시를 바꾼 뒤, 화면의 충돌 시점에 맞춰 편집했습니다.",
              "result": "동작의 강도를 전달하는 타격음과 금속성 잔향을 확보했습니다.",
              "compare": {
                "type": "audio",
                "before": {
                  "name": "기존 지시 · 숟가락으로 밥상 치기",
                  "src": "assets/media/maengjong/spoon-candidate-v04.m4a"
                },
                "after": {
                  "name": "개선 지시 · 금속 쟁반 강하게 치기",
                  "src": "assets/media/maengjong/spoon-candidate-v05.m4a"
                }
              }
            }
          ]
        },
        {
          "type": "layers",
          "heading": "장면 전환에 맞춘 음악 구성",
          "items": [
            {
              "role": "접근 장면",
              "source": "ai",
              "desc": "숨바람·금속 마찰·방울 소리로 사당에 접근하는 긴장감을 표현했습니다.",
              "audio": "assets/media/maengjong/BGM-06B_FINAL.m4a"
            },
            {
              "role": "긴장 고조",
              "source": "ai",
              "desc": "빙의 장면의 긴장을 높이는 음악입니다. 문이 열리는 효과음은 별도로 편집했습니다.",
              "audio": "assets/media/maengjong/BGM-06D_FINAL.m4a"
            }
          ],
          "body": [
            "피날레 음악을 한 번에 생성하면 전환 시점과 고조되는 구간이 장면에 맞지 않았습니다. 발견·접근·유혹·불안·결말로 나눠 생성하고, 각 구간을 편집 타임라인에서 연결했습니다.",
            "대사가 들리도록 음악의 진입과 중단 시점을 조절하고, 파손음·문 개방음처럼 화면과 정확히 맞아야 하는 소리는 별도 효과음으로 배치했습니다."
          ]
        }
      ]
    }
  ]
};
