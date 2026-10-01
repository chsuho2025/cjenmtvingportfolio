/* Small-area liquid glass. No page-wide capture, continuously running RAF or new UI. */
(() => {
  const ns='http://www.w3.org/2000/svg',reduce=matchMedia('(prefers-reduced-motion: reduce)'),coarse=matchMedia('(pointer: coarse)');
  // URL backdrop filters are enabled only on desktop Chromium; Safari/iOS use the CSS base.
  const supportsLens=/Chrome|Chromium|Edg\//.test(navigator.userAgent)&&!coarse.matches&&CSS.supports('backdrop-filter','url("#glass")');
  const entries=new Map();let serial=0,pending=0;
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.style.cssText='position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const defs=document.createElementNS(ns,'defs');svg.append(defs);
  const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
  function createMap(entry,w,h){
    if(!supportsLens||!w||!h||entry.size===`${w}:${h}`)return;
    entry.size=`${w}:${h}`;
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(w);canvas.height=Math.ceil(h);
    const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(canvas.width,canvas.height),r=h/2;
    for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
      const centreX=Math.max(r,Math.min(w-r,x+.5));
      const dx=x+.5-centreX,dy=y+.5-h/2,len=Math.hypot(dx,dy),edge=smooth(.4,.95,len/r);
      const index=(y*canvas.width+x)*4;
      pixels.data[index]=128-(len?dx/len:0)*edge*114;
      pixels.data[index+1]=128-(len?dy/len:0)*edge*114;
      pixels.data[index+2]=128;pixels.data[index+3]=255;
    }
    ctx.putImageData(pixels,0,0);entry.image.setAttribute('href',canvas.toDataURL());
  }
  const resize=new ResizeObserver(items=>items.forEach(item=>{
    const entry=entries.get(item.target);if(entry)createMap(entry,item.target.offsetWidth,item.target.offsetHeight);
  }));
  function flush(){pending=0;for(const [el,e] of entries){if(!e.dirty)continue;e.dirty=false;el.style.setProperty('--glass-x',`${e.x}%`);el.style.setProperty('--glass-y',`${e.y}%`);}}
  function attach(el){
    if(entries.has(el))return;
    const e={x:35,y:20,dirty:false,size:'',filter:null,image:null,map:null};entries.set(el,e);
    el.classList.add('glass-control');el.dataset.refraction='css';
    if(supportsLens){
      const id=`control-lens-${++serial}`,filter=document.createElementNS(ns,'filter');
      filter.id=id;filter.setAttribute('x','0');filter.setAttribute('y','0');filter.setAttribute('width','1');filter.setAttribute('height','1');filter.setAttribute('color-interpolation-filters','sRGB');
      const image=document.createElementNS(ns,'feImage');image.setAttribute('result','lens');image.setAttribute('width','100%');image.setAttribute('height','100%');image.setAttribute('preserveAspectRatio','none');
      const map=document.createElementNS(ns,'feDisplacementMap');map.setAttribute('in','SourceGraphic');map.setAttribute('in2','lens');map.setAttribute('scale',reduce.matches?'4':'10');map.setAttribute('xChannelSelector','R');map.setAttribute('yChannelSelector','G');
      filter.append(image,map);defs.append(filter);Object.assign(e,{filter,image,map});
      el.style.setProperty('--glass-filter',`url("#${id}")`);el.dataset.refraction='svg';resize.observe(el);
      createMap(e,el.offsetWidth,el.offsetHeight);
    }
    const reset=()=>{el.classList.remove('is-glass-pressed');e.x=35;e.y=20;e.dirty=true;if(!pending)pending=requestAnimationFrame(flush);e.map?.setAttribute('scale',reduce.matches?'4':'10');};
    el.addEventListener('pointermove',event=>{
      if(reduce.matches||coarse.matches)return;
      const box=el.getBoundingClientRect();e.x=Math.max(0,Math.min(100,(event.clientX-box.left)/box.width*100));e.y=Math.max(0,Math.min(100,(event.clientY-box.top)/box.height*100));e.dirty=true;
      if(!pending)pending=requestAnimationFrame(flush);
    });
    el.addEventListener('pointerenter',()=>{if(!reduce.matches)e.map?.setAttribute('scale','14');});
    el.addEventListener('pointerleave',reset);el.addEventListener('blur',reset);
    el.addEventListener('pointerdown',()=>{el.classList.add('is-glass-pressed');e.map?.setAttribute('scale',reduce.matches?'4':'7');});
    el.addEventListener('pointerup',()=>el.classList.remove('is-glass-pressed'));el.addEventListener('pointercancel',reset);
    el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')el.classList.add('is-glass-pressed');});
    el.addEventListener('keyup',()=>el.classList.remove('is-glass-pressed'));
  }
  window.initGlassControls=(root=document)=>{
    if(!svg.isConnected)document.body.append(svg);
    for(const [el,e] of entries)if(!el.isConnected){resize.unobserve(el);e.filter?.remove();entries.delete(el);}
    root.querySelectorAll('.portfolio-name,.result-action,.project-modal__close,.more__all').forEach(attach);
  };
  reduce.addEventListener('change',()=>{for(const e of entries.values())e.map?.setAttribute('scale',reduce.matches?'4':'10');});
})();
