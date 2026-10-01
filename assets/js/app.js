/* =====================================================================
   렌더링 · 모션 · 미디어 제어
   콘텐츠는 data.js 에서 고치고, 이 파일은 구조를 바꿀 때만 수정하세요.
   ===================================================================== */
(() => {
  "use strict";

  const DATA = window.PORTFOLIO;
  const ROOT = window.SITE_ROOT || "./";
  const SITE = DATA.site;
  const MOTION = DATA.motion || {};
  const SHOW_PH = !!SITE.showPlaceholders;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ───────── helpers ───────── */
  const isPH = (v) => v && typeof v === "object" && "placeholder" in v;
  const filled = (v) => v != null && v !== "" && !isPH(v);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const src = (p) => (/^([a-z]+:)?\/\//i.test(p) || /^(data|blob):/.test(p) ? p : ROOT + String(p).replace(/^\.?\//, ""));
  const projectHref = (slug) => `${ROOT}projects/${slug}.html`;
  const homeHref = () => `${ROOT}index.html`;

  const ratio = (aspect) => {
    const [w, h] = String(aspect || "16/9").split("/").map(Number);
    return w > 0 && h > 0 ? { css: `${w} / ${h}`, num: w / h } : { css: "16 / 9", num: 16 / 9 };
  };

  // 문구: 채워진 값은 그대로, 자리표시자는 작업 모드에서만 표시
  const text = (v) => {
    if (isPH(v)) return SHOW_PH ? `<span class="ph-text"><span class="sr-only">자리표시자: </span>${esc(v.placeholder)}</span>` : "";
    return filled(v) ? esc(v) : "";
  };

  const ICON_ARROW =
    '<svg class="icon-arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  const NEW_TAB = '<span class="sr-only">(새 탭에서 열림)</span>';

  /* ───────── media ───────── */
  const placeholderBox = (label, aspect, extraClass = "") =>
    SHOW_PH
      ? `<div class="ph ${extraClass}" style="aspect-ratio:${ratio(aspect).css}"><span class="ph__label">${esc(label || "자료 필요")}</span></div>`
      : "";

  // 상세 페이지용: 원본 비율 유지, 잘림·늘림 없음
  function media(m, opts = {}) {
    if (!m || !filled(m.src)) return placeholderBox(m && m.label, m && m.aspect);
    const r = ratio(m.aspect);
    const portrait = r.num < 1 ? " media--portrait" : "";
    const style = `--ar:${r.css};--arn:${r.num}`;
    const alt = esc(m.alt || "");
    let inner = "";
    if (m.type === "video") {
      const poster = filled(m.poster) ? ` poster="${esc(src(m.poster))}"` : "";
      const preload = opts.hero && !filled(m.poster) ? "metadata" : "none";
      inner = `<video controls playsinline preload="${preload}"${poster} aria-label="${alt}"><source src="${esc(src(m.src))}"></video>`;
    } else if (m.type === "embed") {
      inner = `<iframe src="${esc(m.src)}" title="${alt || "영상"}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>`;
    } else if (m.type === "audio") {
      return `<audio class="audio" controls preload="metadata" src="${esc(src(m.src))}"></audio>`;
    } else {
      inner = `<img src="${esc(src(m.src))}" alt="${alt}" loading="${opts.hero ? "eager" : "lazy"}" decoding="async">`;
    }
    const yt = m.type === "embed" && m.src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/);
    const fallback = yt ? `<a class="media__external" href="https://www.youtube.com/watch?v=${yt[1]}" target="_blank" rel="noopener">YouTube에서 보기${NEW_TAB}</a>` : "";
    const caption = filled(m.caption) || fallback ? `<figcaption>${filled(m.caption) ? esc(m.caption) : ""}${fallback}</figcaption>` : "";
    return `<figure class="media${portrait}" style="${style}"><div class="media__box">${inner}</div>${caption}</figure>`;
  }

  // 카드용: 항상 정사각형, cover
  function cardMedia(c) {
    if (!c || (!filled(c.src) && !filled(c.poster))) {
      return SHOW_PH ? `<div class="ph ph--fill"><span class="ph__label">${esc((c && c.label) || "카드 이미지")}</span></div>` : '<div class="card__empty"></div>';
    }
    const pos = esc(c.position || "50% 50%");
    if (c.type === "video" && filled(c.src)) {
      const poster = filled(c.poster) ? ` poster="${esc(src(c.poster))}"` : "";
      return `<video class="card__img" muted loop playsinline preload="none"${poster} data-src="${esc(src(c.src))}" style="object-position:${pos}" aria-hidden="true"></video>`;
    }
    const img = filled(c.src) && c.type !== "video" ? c.src : c.poster;
    return `<img class="card__img" src="${esc(src(img))}" alt="${esc(c.alt || "")}" loading="lazy" decoding="async" style="object-position:${pos}">`;
  }

  /* ───────── shared chrome ───────── */
  function header(page) {
    const intro =
      page === "home" && SITE.showIntro && filled(SITE.intro) ? `<p class="site-header__intro">${esc(SITE.intro)}</p>` : "";
    const nav =
      page === "home"
        ? `<button class="motion-toggle" type="button" aria-pressed="true">모션 켜짐</button>`
        : `<a href="${homeHref()}">전체 작업</a>`;
    return `
      <a class="brand" href="${homeHref()}">
        <span class="brand__name">${esc(SITE.name)}</span>
        <span class="brand__sub">${esc(SITE.subtitle)}</span>
      </a>
      ${intro}
      <nav class="site-nav" aria-label="사이트">${nav}</nav>`;
  }

  function contactList() {
    const c = SITE.contact || {};
    const items = [];
    if (filled(c.email)) items.push(`<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>`);
    if (filled(c.phone)) items.push(`<li><a href="tel:${esc(String(c.phone).replace(/[^+\d]/g, ""))}">${esc(c.phone)}</a></li>`);
    (c.links || []).forEach((l) => {
      if (filled(l.url)) items.push(`<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}${NEW_TAB}</a></li>`);
    });
    if (items.length) return `<ul class="contact">${items.join("")}</ul>`;
    return SHOW_PH ? `<p class="ph-text">연락처 자리표시자: data.js 의 site.contact 에 이메일·링크를 입력하세요</p>` : "";
  }

  function footer(page) {
    return `
      <div class="site-footer__name">${esc(SITE.name)}</div>
      <div class="site-footer__contact">${contactList()}</div>
      ${page !== "home" ? `<a class="site-footer__home" href="${homeHref()}">메인으로</a>` : ""}`;
  }

  /* ───────── cards ───────── */
  function card(p, i, { mini = false } = {}) {
    const target = mini ? "" : ` target="_blank" rel="noopener"`;
    return `
      <li class="card-item${mini ? " card-item--mini" : ""}" style="--i:${i}">
        <a class="card" href="${projectHref(p.slug)}"${target}>
          <div class="card__frame">
            <div class="card__media">${cardMedia(p.card)}</div>
          </div>
          <div class="card__caption">
            <span class="card__title">${esc(p.title)}${ICON_ARROW}</span>
            <span class="card__summary">${esc(p.summary)}</span>
            ${mini ? "" : `<span class="card__competency"><span class="sr-only">핵심 역량: </span>${esc(p.competency)}</span>`}
            ${mini ? "" : NEW_TAB}
          </div>
        </a>
      </li>`;
  }

  /* ───────── detail sections ───────── */
  const visible = (sec) => !sec.hidden && (SHOW_PH || !sec.draft);

  const paragraphs = (body) =>
    (body || [])
      .map((b) => text(b))
      .filter(Boolean)
      .map((b) => `<p>${b}</p>`)
      .join("");

  const renderers = {
    "live-demo"(s) {
      if (!filled(s.url)) return "";
      return `<div class="live-demo">
        ${s.status ? `<p class="live-demo__status">${esc(s.status)}</p>` : ""}
        <div class="live-demo__toolbar"><a class="btn" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}${ICON_ARROW}${NEW_TAB}</a></div>
        <p class="live-demo__note">${esc(s.note || "")}</p>
      </div>`;
    },
    text(sec) {
      const facts = (sec.facts || []).length
        ? `<dl class="facts">${sec.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${text(f.value)}</dd></div>`).join("")}</dl>`
        : "";
      const extra = (sec.media || []).map((m) => media(m)).join("");
      return facts + `<div class="prose">${paragraphs(sec.body)}</div>` + (extra ? `<div class="stack">${extra}</div>` : "");
    },

    flow(sec) {
      const steps = sec.steps || [];
      return `<ol class="flow" style="--steps:${steps.length}">${steps
        .map(
          (s, i) => `
          <li class="flow__step">
            <span class="flow__num">${i + 1}</span>
            <h3 class="flow__title">${text(s.title)}</h3>
            <p class="flow__desc">${text(s.desc)}</p>
            ${s.media ? `<div class="flow__media">${media(s.media)}</div>` : ""}
          </li>`
        )
        .join("")}</ol>`;
    },

    cta(sec) {
      if (filled(sec.url)) {
        return `<a class="btn" href="${esc(sec.url)}" target="_blank" rel="noopener">${esc(sec.label)}${ICON_ARROW}${NEW_TAB}</a>
          ${filled(sec.note) ? `<p class="note">${esc(sec.note)}</p>` : ""}`;
      }
      if (!SHOW_PH) return "";
      return `<span class="btn is-disabled" aria-disabled="true">${esc(sec.label)}</span>
        <p class="note"><span class="ph-text">자리표시자: 실제 데모 주소가 없어 버튼이 비활성화되어 있습니다. data.js 의 url 에 입력하면 켜집니다.</span></p>`;
    },

    gallery(sec) {
      const items = (sec.items || []).map((m) => media(m)).filter(Boolean);
      return items.length ? `${sec.body ? `<div class="prose section-intro">${paragraphs(sec.body)}</div>` : ""}<div class="gallery-grid">${items.join("")}</div>` : "";
    },

    cases(sec) {
      return (sec.items || [])
        .map((c) => {
          const notes = [
            ["문제", c.problem],
            ["해결", c.change],
            ["결과", c.result],
          ]
            .filter(([, v]) => text(v))
            .map(([k, v]) => `<div><dt>${k}</dt><dd>${text(v)}</dd></div>`)
            .join("");
          const cmp = compare(c.compare);
          const stills = (c.stills || []).map((m) => media(m)).filter(Boolean);
          return `
            <article class="case">
              ${text(c.title) ? `<h3 class="case__title">${text(c.title)}</h3>` : ""}
              <div class="case__grid${cmp ? "" : " case__grid--text"}">
                ${cmp ? `<div class="case__compare">${cmp}</div>` : ""}
                ${notes ? `<dl class="case__notes">${notes}</dl>` : ""}
              </div>
              ${stills.length ? `<div class="stills">${stills.join("")}</div>` : ""}
            </article>`;
        })
        .join("");
    },

    compare(sec) {
      return compare(sec.compare) + (filled(sec.note) ? `<p class="note">${esc(sec.note)}</p>` : "");
    },

    layers(sec) {
      const TAGS = { ai: "AI 생성", self: "직접 제작·편집", mixed: "AI 생성 후 직접 편집" };
      const rows = (sec.items || [])
        .map((l) => {
          const tag = TAGS[l.source]
            ? `<span class="tag tag--${l.source}">${TAGS[l.source]}</span>`
            : SHOW_PH
            ? `<span class="ph-text">담당 범위 미정</span>`
            : "";
          const audio = l.audio && filled(l.audio.src || l.audio)
            ? `<audio class="audio" controls preload="metadata" src="${esc(src(l.audio.src || l.audio))}" aria-label="${esc(l.role)} 샘플"></audio>`
            : SHOW_PH
            ? `<span class="ph-text">${esc(l.role)} 샘플 오디오</span>`
            : "";
          return `
            <li class="layer">
              <span class="layer__role">${esc(l.role)}</span>
              <div class="layer__body"><p>${text(l.desc)}</p>${audio}</div>
              <span class="layer__tag">${tag}</span>
            </li>`;
        })
        .join("");
      return (sec.body ? `<div class="prose section-intro">${paragraphs(sec.body)}</div>` : "") + `<ul class="layers">${rows}</ul>`;
    },
  };

  // 전후 비교: image → 슬라이더, video/audio → 나란히 + 같은 지점 전환
  function compare(cmp) {
    if (!cmp) return "";
    const { before = {}, after = {} } = cmp;
    const nameA = esc(before.name || "수정 전");
    const nameB = esc(after.name || "수정 후");
    const r = ratio(cmp.aspect);

    if (cmp.type === "image") {
      if (!filled(before.src) || !filled(after.src)) {
        if (!SHOW_PH) return "";
        return `<div class="pair">
          <div><p class="pair__label">${nameA}</p>${placeholderBox(before.label, cmp.aspect)}</div>
          <div><p class="pair__label">${nameB}</p>${placeholderBox(after.label, cmp.aspect)}</div></div>`;
      }
      return `
        <div class="slider" style="aspect-ratio:${r.css};--pos:50%">
          <img class="slider__after" src="${esc(src(after.src))}" alt="${esc(after.alt || nameB)}" loading="lazy">
          <div class="slider__before"><img src="${esc(src(before.src))}" alt="${esc(before.alt || nameA)}" loading="lazy"></div>
          <span class="slider__line" aria-hidden="true"></span>
          <span class="slider__tag slider__tag--a" aria-hidden="true">${nameA}</span>
          <span class="slider__tag slider__tag--b" aria-hidden="true">${nameB}</span>
          <input class="slider__range" type="range" min="0" max="100" value="50" aria-label="${nameA}·${nameB} 비교 위치 (왼쪽: ${nameA})">
        </div>`;
    }

    const el = (m, name) => {
      if (!filled(m.src)) return `<div><p class="pair__label">${name}</p>${placeholderBox(m.label, cmp.aspect)}</div>`;
      const poster = filled(m.poster) ? ` poster="${esc(src(m.poster))}"` : "";
      const tag =
        cmp.type === "audio"
          ? `<audio class="audio" controls preload="metadata" src="${esc(src(m.src))}" data-ab aria-label="${name}"></audio>`
          : `<div class="media" style="--ar:${r.css};--arn:${r.num}"><div class="media__box"><video controls playsinline preload="none"${poster} data-ab aria-label="${name}"><source src="${esc(src(m.src))}"></video></div></div>`;
      return `<div><p class="pair__label">${name}</p>${tag}</div>`;
    };

    const both = filled(before.src) && filled(after.src);
    if (!both && !SHOW_PH) return "";
    return `
      <div class="ab" data-ab-group>
        <div class="pair${cmp.type === "audio" ? " pair--audio" : ""}">${el(before, nameA)}${el(after, nameB)}</div>
        ${both ? `<button class="btn btn--quiet ab__switch" type="button">같은 지점에서 바꿔 듣기</button>` : ""}
      </div>`;
  }

  function section(sec, idx) {
    if (!visible(sec)) return "";
    const fn = renderers[sec.type];
    if (!fn) return "";
    const body = fn(sec);
    if (!body || !body.replace(/<[^>]*>/g, "").trim() && !/<(img|video|iframe|audio|div class="ph)/.test(body)) return "";
    const id = `s-${idx}`;
    return `
      <section class="block${sec.wide ? " block--wide" : ""}" aria-labelledby="${id}">
        <h2 class="block__title" id="${id}">${esc(sec.heading || "")}</h2>
        <div class="block__body">${sec.collapsible ? `<details class="additional-work"><summary>${esc(sec.toggleLabel || "추가 작업 보기")}</summary><div class="additional-work__body">${body}</div></details>` : body}</div>
      </section>`;
  }

  /* ───────── behaviour ───────── */

  // 한 번에 하나의 소리만: 소리가 있는 미디어가 재생되면 나머지는 멈춤
  function exclusivePlayback() {
    document.addEventListener(
      "play",
      (e) => {
        const t = e.target;
        if (!(t instanceof HTMLMediaElement) || t.muted) return;
        document.querySelectorAll("audio, video").forEach((m) => {
          if (m !== t && !m.muted && !m.paused) m.pause();
        });
        const group = t.closest("[data-ab-group]");
        if (group) group.dataset.last = [...group.querySelectorAll("[data-ab]")].indexOf(t);
      },
      true
    );

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".ab__switch");
      if (!btn) return;
      const group = btn.closest("[data-ab-group]");
      const els = [...group.querySelectorAll("[data-ab]")];
      if (els.length < 2) return;
      const cur = Number(group.dataset.last ?? -1);
      const from = els[cur] || null;
      const to = els[cur === 0 ? 1 : 0];
      const t = from ? from.currentTime : 0;
      if (from) from.pause();
      const go = () => {
        try { to.currentTime = Math.min(t, to.duration || t); } catch (_) {}
        to.play();
      };
      if (to.readyState >= 1) go();
      else { to.preload = "metadata"; to.addEventListener("loadedmetadata", go, { once: true }); to.load(); }
    });
  }

  function sliders() {
    document.querySelectorAll(".slider").forEach((s) => {
      const r = s.querySelector(".slider__range");
      const set = () => s.style.setProperty("--pos", `${r.value}%`);
      r.addEventListener("input", set);
      set();
    });
  }

  // 카드 영상: 보일 때만 불러와서 무음 재생
  function cardVideos() {
    const vids = document.querySelectorAll("video.card__img[data-src]");
    if (!vids.length) return;
    const allow = MOTION.cardVideoAutoplay && !reduceMotion.matches;
    if (!allow || !("IntersectionObserver" in window)) return; // 포스터만 표시
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target: v, isIntersecting }) => {
          if (isIntersecting) {
            if (!v.src) v.src = v.dataset.src;
            v.play().catch(() => {});
          } else v.pause();
        });
      },
      { rootMargin: "100px" }
    );
    vids.forEach((v) => io.observe(v));
  }

  // 공간형 갤러리: 전체 시점 이동 + 카드별 깊이·빛·이미지 패럴랙스.
  function tilt(root) { window.initWaveGallery?.(root, MOTION); }

  /* ───────── pages ───────── */
  function mountChrome(page) {
    const h = document.getElementById("site-header");
    const f = document.getElementById("site-footer");
    if (h) h.innerHTML = header(page);
    if (f) f.innerHTML = footer(page);
  }

  function home() {
    mountChrome("home");
    const list = document.getElementById("gallery");
    list.innerHTML = DATA.projects.map((p, i) => card(p, i)).join("");
    if (MOTION.enabled && MOTION.intro && !reduceMotion.matches) {
      list.classList.add("is-intro");
      list.addEventListener("animationend", (e) => {
        if (e.target.matches(".card-item:last-child")) list.classList.remove("is-intro");
      });
    }
    tilt(list);
    cardVideos();
  }

  function project(slug) {
    mountChrome("project");
    const main = document.getElementById("content");
    const idx = DATA.projects.findIndex((p) => p.slug === slug);
    const p = DATA.projects[idx];
    if (!p) {
      main.innerHTML = `<div class="project"><p class="project__missing">이 작업을 찾을 수 없습니다. <a href="${homeHref()}">전체 작업 보기</a></p></div>`;
      return;
    }
    document.title = `${p.title} | ${SITE.name}`;

    const meta = (p.meta || [])
      .map((m) => ({ ...m, html: text(m.value) }))
      .filter((m) => m.html)
      .map((m) => `<div><dt>${esc(m.label)}</dt><dd>${m.html}</dd></div>`)
      .join("");

    const others = DATA.projects.filter((o) => o.slug !== slug);

    main.innerHTML = `
      <article class="project">
        <header class="project__head">
          <h1 class="project__title">${esc(p.title)}</h1>
          <p class="project__lead">${text(p.lead) || esc(p.summary)}</p>
        </header>
        ${meta ? `<dl class="project__meta">${meta}</dl>` : ""}
        ${p.hero ? `<div class="project__hero">${media(p.hero, { hero: true })}</div>` : ""}
        ${(p.sections || []).map(section).join("")}
      </article>
      <nav class="more" aria-labelledby="more-title">
        <div class="more__head">
          <h2 class="more__title" id="more-title">다른 작업</h2>
          <a class="more__all" href="${homeHref()}">전체 작업 보기</a>
        </div>
        <ul class="more__list">${others.map((o, i) => card(o, i, { mini: true })).join("")}</ul>
      </nav>`;

    sliders();
    exclusivePlayback();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const b = document.body;
    if (b.dataset.page === "home") home();
    else if (b.dataset.page === "project") project(b.dataset.project);
  });
})();
