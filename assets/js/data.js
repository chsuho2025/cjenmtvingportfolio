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
      "title": "AI 영상 제작 도구",
      "summary": "대본을 입력하면 장면 구성부터 내레이션·자막·편집까지 연결하는 영상 제작 서비스",
      "competency": "서비스 기획 · 워크플로 설계 · 개발",
      "lead": "대본을 장면 구성·내레이션·영상 편집으로 연결하는 AI 영상 제작 서비스입니다.",
      "card": {
        "type": "image",
        "src": "assets/media/antiframe/cover.svg",
        "poster": null,
        "alt": "AI 영상 제작 도구 대표 이미지",
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
          "value": "==42명 참여=="
        }
      ],
      "sections": [
        {
          "type": "flow",
          "wide": true,
          "heading": "대본이 완성 영상이 되기까지",
          "steps": [
            {
              "title": "대본과 제작 조건 입력",
              "desc": "영상의 주제와 대본을 입력하고, 세로·가로 화면과 내레이션 목소리를 선택합니다."
            },
            {
              "title": "내용을 장면으로 구성",
              "desc": "Gemini로 대본을 장면 단위로 구성합니다. 사용자는 장면별 대사와 구성 내용을 검토합니다."
            },
            {
              "title": "영상 자료와 음성 준비",
              "desc": "Pexels에서 장면에 맞는 영상 자료를 찾고 ElevenLabs로 내레이션을 만듭니다. 현재 체험 버전은 스톡 영상을 활용합니다."
            },
            {
              "title": "검토·수정 후 영상 출력",
              "desc": "장면을 확인하고 수정한 뒤 FFmpeg로 영상·내레이션·자막을 합칩니다. 완성본은 MP4로 내려받을 수 있습니다."
            }
          ]
        },
        {
          "type": "text",
          "heading": "자동화와 사용자 판단의 경계",
          "body": [
            "자료를 개별 도구 사이에서 옮기는 반복 작업은 자동화하되, 장면이 대본의 의미를 제대로 전달하는지는 **사용자가 확인할 수 있도록** 했습니다. 초안 생성과 최종 출력을 분리해 결과를 검토하고 수정하는 과정을 서비스 안에 포함했습니다.",
            "음성이 예정된 장면보다 길어지면 내레이션이 잘리는 문제가 있어, 실제 음성 길이를 측정해 장면과 자막의 재생 시간을 함께 늘리도록 보완했습니다. 개별 기능의 생성 성공뿐 아니라 최종 영상에서 끝까지 자연스럽게 재생되는지를 확인했습니다."
          ]
        },
        {
          "type": "text",
          "heading": "사용자와 함께 다듬는 제작 도구",
          "body": [
            "==42명의 베타 테스터==와 사용성을 검증했으며, 신규 AI 모델의 생성 결과와 사용자 평가를 검토해 서비스 개선에 반영해 왔습니다. 모델을 연결하는 것뿐 아니라 사용자가 결과를 확인하고 다음 작업을 이어갈 수 있는 제작 경험을 만드는 데 중점을 두었습니다."
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
              "alt": "AI 영상 제작 도구로 만든 공원 산책 안내 영상",
              "caption": "Pexels 영상 · ElevenLabs 내레이션 · 자동 자막"
            }
          ]
        },
        {
          "type": "live-demo",
          "wide": true,
          "heading": "직접 체험하기",
          "url": "https://antiframe.vercel.app/generate",
          "title": "AI 영상 제작 체험",
          "label": "가입 없이 영상 만들기",
          "status": "",
          "note": "가입 없이 무료 체험 한도 내에서 영상을 제작할 수 있습니다. 새 탭에서 주제와 대본을 입력해 시작해 보세요."
        }
      ],
      "overview": [
        "이 도구는 대본과 자료는 있지만 영상 제작의 여러 도구를 직접 연결해야 하는 **정보성 콘텐츠 제작자**를 위한 서비스입니다. 자료 검색, 내레이션 제작, 자막 편집과 영상 출력을 __하나의 흐름으로__ 묶어, 사용자가 설명할 내용과 장면의 적절성을 판단하는 데 집중하도록 만들었습니다.",
        "개인 프로젝트로 서비스 기획과 개발을 담당했습니다. 제작 과정을 모두 숨기는 대신, AI가 구성한 장면을 확인하고 수정한 뒤 완성할 수 있도록 검토 단계를 두었습니다."
      ]
    },
    {
      "slug": "gongnyeo",
      "title": "웹툰 기반 AI 애니메이션 — 점괘보는 공녀님",
      "summary": "원작의 그림체를 유지하고, AI 영상 생성과 편집·합성으로 구현한 세로형 애니메이션",
      "competency": "이미지 확장 · 영상 생성 · 대화 장면 합성",
      "lead": "카카오페이지 웹툰 《점괘보는 공녀님》의 인물과 그림체를 유지하며 세로형 AI 애니메이션을 제작했습니다. 생성 결과의 한계는 장면별 편집과 합성으로 보완했습니다.",
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
          "label": "원작",
          "value": "카카오페이지 《점괘보는 공녀님》"
        },
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
          "type": "flow",
          "wide": true,
          "heading": "원작의 장면을 영상으로 옮기는 과정",
          "steps": [
            {
              "title": "원작을 기준으로 장면 준비",
              "desc": "인물의 얼굴과 의상, 선화를 기준으로 삼고 장면에 필요한 구도와 여백을 정리했습니다."
            },
            {
              "title": "세로형 첫 프레임 제작",
              "desc": "원작 컷의 배경을 확장해 9:16 화면을 만들었습니다. 이미지 단계에서 인물과 구도를 먼저 맞췄습니다."
            },
            {
              "title": "발화 장면을 나눠 생성",
              "desc": "두 인물을 동시에 제어하기 어려운 장면은 화자별로 나눠 생성하고, 비발화 인물은 정지 프레임으로 유지했습니다."
            },
            {
              "title": "음성과 화면을 합성",
              "desc": "생성한 장면을 합성하고 음성 길이에 맞춰 속도와 정지 구간을 조정해 대화의 순서를 완성했습니다."
            }
          ]
        },
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
              "change": "**각 인물의 발화 영상을 따로 생성한 뒤**, 말하는 인물과 상대방의 정지 프레임을 합성했습니다. 음성 길이에 맞춰 영상 속도와 정지 구간도 조정했습니다.",
              "result": "원작의 두 인물이 ==한 화면에서 차례로 대화하는 장면==을 완성했습니다.",
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
      ],
      "overview": [
        "**카카오페이지 웹툰 《점괘보는 공녀님》**을 읽는 경험을 모바일에서 보는 짧은 애니메이션으로 확장하는 작업입니다. ==원작의 인물과 그림체를 유지==하면서 대사와 움직임을 더하고, 전문 애니메이션 제작 공정에 AI를 접목하는 방법을 검토했습니다.",
        "카카오엔터테인먼트 재직 중 영상 제작 전 과정을 담당했습니다. 에피소드형 영상과 프로모션 영상을 제작했으며, 특히 원작 컷의 화면 확장과 두 인물의 대화 장면을 구현하는 데 집중했습니다. 아래에서는 이미지 준비부터 생성 결과를 편집·합성하는 과정까지 보여드립니다."
      ],
      "platform": "카카오페이지 원작 · 이미지·영상 편집"
    },
    {
      "slug": "maengjong",
      "title": "웹툰 기반 AI 애니메이션 — 맹종",
      "summary": "AI 음성·효과음·음악을 장면에 맞게 연출해 웹툰의 긴장감을 옮긴 공포 애니메이션",
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
          "label": "원작",
          "value": "네이버웹툰 《맹종》"
        },
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
          "type": "text",
          "heading": "소리를 장면에 맞추는 제작 기준",
          "body": [
            "대사·효과음·음악은 각각 다른 기준으로 다뤘습니다. 대사는 발음과 감정이 명확한지, 효과음은 화면의 동작과 충돌 시점에 맞는지, 음악은 장면의 긴장을 높이면서 대사를 가리지 않는지를 확인했습니다.",
            "짧은 대사의 잘림, 기대보다 약한 타격음, 영상과 어긋나는 음악 전환을 각각 다른 방식으로 해결했습니다. 아래 생성 음성과 전후 비교 자료에서 수정 방법과 결과를 확인할 수 있습니다."
          ]
        },
        {
          "type": "cases",
          "heading": "문맥을 더해 발음과 감정 표현 보완",
          "items": [
            {
              "title": "",
              "problem": "짧은 대사를 생성하면 첫 음절이나 끝음이 잘리고, 감정 표현이 장면과 어긋났습니다.",
              "change": "**같은 감정의 앞뒤 대사를 추가해 생성한 뒤**, 발음과 연기를 비교해 후보를 골랐습니다. __파형과 타임스탬프__를 참고해 실제로 사용할 대사만 분리했습니다.",
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
              "result": "==동작의 강도를 전달하는 타격음==과 금속성 잔향을 확보했습니다.",
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
      ],
      "overview": [
        "**네이버웹툰 《맹종》**의 공포 장면을 모바일 세로형 애니메이션으로 감상할 수 있도록 제작한 개인 작업입니다. 원작 1화와 2화 초반을 약 5분으로 각색하고, 등장인물의 발화와 ==장면의 긴장을 소리로 전달==하는 데 중점을 두었습니다.",
        "각색부터 영상, 대사, 효과음, 음악, 최종 편집까지 담당했습니다. AI가 생성한 소리를 그대로 사용하는 데서 그치지 않고, __발음과 연기, 타격감, 장면 전환 시점__을 기준으로 결과를 선택하고 다시 편집했습니다."
      ],
      "platform": "네이버웹툰 원작 · 사운드 연출"
    }
  ]
};
