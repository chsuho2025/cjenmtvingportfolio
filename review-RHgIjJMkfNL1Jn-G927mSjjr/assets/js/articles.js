(function(){
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const articles=window.PORTFOLIO_ARTICLES||[];
  const tags=a=>a.map(t=>`<span class="post-tag">${esc(t)}</span>`).join('');
  const list=document.getElementById('portfolio-post-list');
  if(list) list.innerHTML=articles.map((a,i)=>`<li><a class="post-card" href="articles/${String(i+1).padStart(2,'0')}.html"><img class="post-thumbnail" src="assets/media/articles/${String(i+1).padStart(2,'0')}.jpg" alt="" loading="lazy"><div class="post-card-body"><span class="post-number">${String(i+1).padStart(2,'0')} · 프로젝트 기록</span><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><div class="post-tags">${tags(a.tags)}</div></div></a></li>`).join('');
  const view=document.getElementById('article-view');
  if(view){const a=articles[window.ARTICLE_INDEX];if(!a){view.textContent='게시글을 찾을 수 없습니다.';return;} view.innerHTML=`<header class="post-hero"><div class="post-number">${String(window.ARTICLE_INDEX+1).padStart(2,'0')} · 프로젝트 기록</div><h1>${esc(a.title)}</h1><p>${esc(a.summary)}</p><div class="post-tags">${tags(a.tags)}</div></header><div class="post-body">${a.sections.map((s,i)=>`<section><h2>${esc(s[0])}</h2><p>${esc(s[1])}</p>${(a.figures||[]).filter(f=>f.after===i).map(f=>`<figure class="post-figure"><img src="${esc(f.src)}" alt="${esc(f.alt)}" loading="lazy"><figcaption>${esc(f.caption)}</figcaption></figure>`).join('')}</section>`).join('')}${a.links.length?`<nav class="post-related"><h2>관련 작업</h2>${a.links.map(l=>`<a href="${esc(l[1])}">${esc(l[0])} →</a>`).join('')}</nav>`:''}<a class="back-link" href="../index.html#articles">← 게시글 목록으로</a></div>`;}
})();
