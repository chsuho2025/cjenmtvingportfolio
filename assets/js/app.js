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
    return filled(v) ? esc(v).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/==([^=]+)==/g, '<mark>$1</mark>').replace(/__([^_]+)__/g, '<u>$1</u>') : "";
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
    const r = ratio(opts.landscape ? "16/9" : m.aspect);
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
      return `<figure class="audio-sample"><audio class="audio" controls preload="none" src="${esc(src(m.src))}" aria-label="${alt}"></audio>${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}</figure>`;
    } else {
      inner = `<img src="${esc(src(m.src))}" alt="${alt}" loading="${opts.hero ? "eager" : "lazy"}" decoding="async">`;
    }
    const yt = m.type === "embed" && m.src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/);
    const fallback = yt ? `<a class="media__external" href="https://www.youtube.com/watch?v=${yt[1]}" target="_blank" rel="noopener">YouTube에서 보기${NEW_TAB}</a>` : "";
    const caption = filled(m.caption) || fallback ? `<figcaption>${filled(m.caption) ? esc(m.caption) : ""}${fallback}</figcaption>` : "";
    return `<figure class="media${portrait}${yt ? " media--embed" : ""}" style="${style}"><div class="media__box">${inner}</div>${caption}</figure>`;
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
    return `<a class="portfolio-name" href="${homeHref()}">AI 콘텐츠 제작자 - 최수호</a>`;
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

  function footer() { return ""; }

  /* ───────── cards ───────── */
  function card(p, i, { mini = false } = {}) {
    const target = ` data-project="${esc(p.slug)}"`;
    const [projectType, workName] = p.title.split(" — ");
    const cardTitle = esc(projectType) + (workName ? `<span class="card__work-name">${esc(workName)}</span>` : "");
    return `
      <li class="card-item${mini ? " card-item--mini" : ""}" style="--i:${i}">
        <a class="card" href="${projectHref(p.slug)}"${target}>
          <div class="card__frame">
            <div class="card__media">${cardMedia(p.card)}</div>
          </div>
          <div class="card__caption">
            ${mini ? "" : `<span class="card__number">${String(i + 1).padStart(2, "0")}</span>`}
            <span class="card__title">${cardTitle}</span>
            ${p.tags?.length ? `<span class="card__tags" aria-label="핵심 역량">${p.tags.map(tag=>`<span>#${esc(tag)}</span>`).join('')}</span>` : ""}
            <span class="card__summary">${esc(p.summary)}</span>
            ${mini ? "" : `<span class="card__competency"><span class="sr-only">핵심 역량: </span>${esc(p.competency)}</span>`}

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
    article(sec) {
      return (sec.parts || []).map(part => {
        const heading = part.heading ? `<h3>${text(part.heading)}</h3>` : '';
        const prose = part.body ? `<div class="prose">${paragraphs(part.body)}</div>` : '';
        const steps = part.steps ? `<ol class="article-steps">${part.steps.map((step,i)=>`<li><h4><span>${String(i+1).padStart(2,'0')}</span>${text(step.title)}</h4>${paragraphs(step.body || [step.desc])}${step.output ? `<p class="article-step-output">${text(step.output)}</p>` : ''}</li>`).join('')}</ol>` : '';
        const mediaItems = part.media ? `<div class="article-media${part.media.length>1 ? ' article-media--pair' : ''}">${part.media.map(m=>media(m)).join('')}</div>` : '';
        const table = part.table ? renderers.matrix({...part.table,heading:part.heading || sec.heading}) : '';
        const comparison = part.compare ? `<div class="article-comparison">${compare(part.compare)}</div>` : '';
        const audio = part.audioItems ? renderers.layers({items:part.audioItems}) : '';
        const bullets = part.bullets ? `<ul class="article-list">${part.bullets.map(item=>`<li>${text(item)}</li>`).join('')}</ul>` : '';
        const note = part.note ? `<aside class="article-note">${part.note.label ? `<h4>${text(part.note.label)}</h4>` : ''}${paragraphs(part.note.body)}</aside>` : '';
        return `<div class="article-part">${heading}${prose}${steps}${mediaItems}${table}${comparison}${audio}${bullets}${note}</div>`;
      }).join('');
    },
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
      return `${sec.body ? `<div class="prose section-intro">${paragraphs(sec.body)}</div>` : ''}<ol class="flow" style="--steps:${steps.length}">${steps
        .map(
          (s, i) => `
          <li class="flow__step">
            <span class="flow__num">STEP ${String(i + 1).padStart(2,'0')}</span>
            <h3 class="flow__title">${text(s.title)}</h3>
            <p class="flow__desc">${text(s.desc)}</p>
            ${s.output ? `<p class="flow__output">${text(s.output)}</p>` : ''}
            ${s.media ? `<div class="flow__media">${media(s.media)}</div>` : ""}
          </li>`
        )
        .join("")}</ol>`;
    },

    cards(sec) {
      return `<div class="detail-cards">${(sec.items || []).map((item,i)=>`<article class="detail-card"><span class="detail-card__number">${String(i+1).padStart(2,'0')}</span><h3>${text(item.title)}</h3><p>${text(item.body)}</p></article>`).join('')}</div>`;
    },

    matrix(sec) {
      const columns=sec.columns||[];
      return `<div class="matrix-wrap"><table class="matrix"><caption class="sr-only">${esc(sec.heading)}</caption><thead><tr>${columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${(sec.rows||[]).map(row=>`<tr>${row.map((cell,i)=>i?`<td>${text(cell)}</td>`:`<th scope="row">${text(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>${sec.media ? `<div class="stack">${sec.media.map(m=>media(m)).join('')}</div>` : ''}`;
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
            ? `<audio class="audio" controls preload="none" src="${esc(src(l.audio.src || l.audio))}" aria-label="${esc(l.role)} 샘플"></audio>`
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
          ? `<audio class="audio" controls preload="none" src="${esc(src(m.src))}" data-ab aria-label="${name}"></audio>`
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
        <h2 class="block__title" id="${id}"><span class="block__index">${String(idx+1).padStart(2,'0')}</span>${esc(sec.heading || "")}</h2>
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
    tilt(list);
    cardVideos();
    setupProjectModal();
    exclusivePlayback();
    window.initLiquidIntro?.(list);
  }

  function projectArticle(p) {
    const outcome=p.outcome || {};
    const resume=(p.resume || []).map(item=>`<div class="resume-item"><h3>${esc(item.heading)}</h3>${paragraphs(item.body)}</div>`).join('');
    const action=outcome.action ? `<a class="btn result-action" href="${esc(outcome.action.url)}" target="_blank" rel="noopener">${esc(outcome.action.label)}${ICON_ARROW}${NEW_TAB}</a>` : '';
    const chapters=(p.sections || []).filter(visible);
    return `      <article class="project project--blog">
        <div class="project-lead-media" aria-label="프로젝트 결과물 영상">${(outcome.media || []).map(m=>media(m,{hero:true,landscape:true})).join('')}</div>
        <header class="project__head">
          <p class="project__eyebrow">${esc(p.articleLabel || 'AI 콘텐츠 제작 · 프로젝트 기록')}</p>
          <h1 class="project__title" id="project-title" tabindex="-1">${esc(p.title)}</h1>
        </header>
        <section class="project-summary" aria-labelledby="summary-title">
          <h2 class="project-section-title" id="summary-title">프로젝트 요약</h2>
          <div class="project-resume">${resume}</div>
          <div class="summary-result">
            <h3>결과물</h3>
            <p>${text(outcome.body)}</p>
            ${action}${outcome.note ? `<p class="result-note">${text(outcome.note)}</p>` : ''}
          </div>
        </section>
        <nav class="article-toc" aria-label="상세 제작기 목차">
          <h2>상세 제작기</h2>
          <ol>${chapters.map((sec,i)=>`<li><a href="#s-${(p.sections || []).indexOf(sec)}"><span>${String(i+1).padStart(2,'0')}</span>${esc(sec.heading)}</a></li>`).join('')}</ol>
        </nav>
        ${(p.sections || []).map(section).join("")}
      </article>`;
  }

  function setupProjectModal() {
    const dialog = document.createElement('dialog');
    dialog.className = 'project-modal';
    dialog.setAttribute('aria-labelledby', 'project-title');
    dialog.innerHTML = `<button class="project-modal__close" type="button" aria-label="프로젝트 닫기"><span aria-hidden="true">×</span></button><div class="project-modal__scroll" tabindex="0" aria-label="프로젝트 내용"></div><div class="project-modal__cover" aria-hidden="true"></div>`;
    document.body.append(dialog);
    const scroll = dialog.querySelector('.project-modal__scroll');
    const cover = dialog.querySelector('.project-modal__cover');
    const close = dialog.querySelector('.project-modal__close');
    let trigger = null, running = null, closing = false, opening = false;
    let expanded = false, scrollFrame = 0, expansionMotion = null;
    const duration = () => reduceMotion.matches ? 0 : 1320;
    function geometry() {
      const target = dialog.getBoundingClientRect();
      const from = trigger?.querySelector('.card__frame')?.getBoundingClientRect() || target;
      return `translate(${from.left + from.width/2 - target.left - target.width/2}px, ${from.top + from.height/2 - target.top - target.height/2}px) scale(${from.width/target.width}, ${from.height/target.height})`;
    }
    function openProject(p, anchor) {
      if (dialog.open) return;
      trigger = anchor; closing = false; opening = true; expanded = false;
      expansionMotion?.cancel(); expansionMotion = null;
      dialog.style.setProperty('--expand', '0');
      scroll.innerHTML = projectArticle(p);
      cover.style.backgroundImage = `url("${src(p.card.src)}")`;
      cover.style.backgroundPosition = p.card.position || 'center';
      dialog.classList.remove('is-revealed');
      document.body.classList.add('project-is-open');
      dialog.showModal(); scroll.scrollTop = 0;
      document.dispatchEvent(new CustomEvent('portfolio:modal', {detail: {open: true}}));
      document.title = `${p.title} | 최수호`;
      const d = duration();
      running = dialog.animate([
        { transform: geometry(), borderRadius: '50%', opacity: .9 },
        { transform: 'scale(1.025, .985)', borderRadius: '70px', opacity: 1, offset: .72 },
        { transform: 'none', borderRadius: '42px', opacity: 1 }
      ], {duration:d, easing:'cubic-bezier(.25,.6,.25,1)'});
      cover.animate([{opacity:1},{opacity:1,offset:.3},{opacity:0}], {duration:d,easing:'cubic-bezier(.25,.6,.25,1)',fill:'forwards'});
      scroll.animate([{opacity:0, transform:'translateY(36px)'},{opacity:0,offset:.36},{opacity:1,transform:'none'}], {duration:d,easing:'cubic-bezier(.22,.7,.2,1)'});
      running.finished.then(() => {
        running = null; opening = false;
        dialog.classList.add('is-revealed');
        dialog.querySelector('.project__title').focus({preventScroll:true});
      }).catch(() => {});
      sliders();
    }
    async function closeProject() {
      if (!dialog.open || closing) return;
      closing = true; opening = false; running?.cancel(); expansionMotion?.cancel();
      scroll.querySelectorAll('audio,video').forEach(el => el.pause());
      // Removing embedded players also stops playback in cross-origin frames.
      scroll.querySelectorAll('iframe').forEach(el => el.remove());
      dialog.classList.remove('is-revealed');
      cover.animate([{opacity:0},{opacity:1}], {duration:reduceMotion.matches?0:350,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
      scroll.animate([{opacity:1},{opacity:0}], {duration:reduceMotion.matches?0:300,easing:'cubic-bezier(.4,0,.8,1)',fill:'forwards'});
      running = dialog.animate([{transform:'none',opacity:1},{transform:geometry(),borderRadius:'50%',opacity:0}], {duration:reduceMotion.matches?0:820,easing:'cubic-bezier(.5,0,.25,1)'});
      await running.finished.catch(() => {});
      dialog.close(); scroll.innerHTML = ''; running = null; closing = false;
      // Drop filled opacity animations before the next project is opened.
      scroll.getAnimations().forEach(a => a.cancel());
      cover.getAnimations().forEach(a => a.cancel());
      document.body.classList.remove('project-is-open');
      document.dispatchEvent(new CustomEvent('portfolio:modal', {detail:{open:false}}));
      document.title = 'AI 콘텐츠 제작자 - 최수호';
      trigger?.focus({preventScroll:true});
    }
    document.querySelector('.gallery').addEventListener('click', e => {
      const anchor = e.target.closest('[data-project]');
      if (!anchor || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const p = DATA.projects.find(p => p.slug === anchor.dataset.project);
      if (!p) return;
      e.preventDefault(); openProject(p, anchor);
    });
    close.addEventListener('click', closeProject);
    scroll.addEventListener('click', e => {
      const link=e.target.closest('.article-toc a');
      if(!link)return;
      const heading=scroll.querySelector(link.getAttribute('href'));
      if(!heading)return;
      e.preventDefault();
      heading.scrollIntoView({behavior:reduceMotion.matches?'auto':'smooth',block:'start'});
    });
    dialog.addEventListener('cancel', e => {e.preventDefault(); closeProject();});
    dialog.addEventListener('click', e => {if (e.target === dialog) {
      const r=dialog.getBoundingClientRect();
      if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom) closeProject();
    }});
    scroll.addEventListener('scroll', () => {
      if (opening || closing || expanded || scrollFrame || scroll.scrollTop < 12) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        if (!dialog.open || opening || closing || expanded) return;
        expanded = true;
        // Lay out the article once at its final size, then animate the surface on the compositor.
        const before = dialog.getBoundingClientRect();
        dialog.style.setProperty('--expand', '1');
        const after = dialog.getBoundingClientRect();
        const x = before.left + before.width/2 - after.left - after.width/2;
        const y = before.top + before.height/2 - after.top - after.height/2;
        expansionMotion = dialog.animate([
          {transform:`translate(${x}px, ${y}px) scale(${before.width/after.width}, ${before.height/after.height})`, borderRadius:'42px'},
          {transform:'none', borderRadius:'24px'}
        ], {duration:reduceMotion.matches?0:900, easing:'cubic-bezier(.22,.65,.25,1)'});
      });
    }, {passive:true});
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

    const others = DATA.projects.filter((o) => o.slug !== slug);
    main.innerHTML = `${projectArticle(p)}
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
