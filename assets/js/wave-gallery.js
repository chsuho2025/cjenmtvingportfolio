/* One persistent liquid surface for the logo, card, and pointer interaction. */
window.initWaveGallery = function(root) {
  const ns='http://www.w3.org/2000/svg', reduce=matchMedia('(prefers-reduced-motion: reduce)');
  // Blossom geometry and colors: https://prd-cdn.cj.net/static/svg/logo_b.svg
  const paths=[
    {color:'#006ECD',d:'M28.9737 25.1752C36.092 30.0361 44.0627 31.5075 46.8915 28.3543C49.7421 25.1752 48.758 15.8919 44.8255 7.47599C40.8931 -.939936 32.9889 -2.48874 26.8752 4.32816C20.8374 11.141 21.8786 20.3252 28.9737 25.1752Z'},
    {color:'#FF9700',d:'M69.8469 22.6178C61.8232 19.455 53.7209 19.793 51.6671 23.4947C49.5916 27.2275 52.6173 36.0629 58.3184 43.3997C64.0195 50.7365 72.0812 50.4949 76.5267 42.4834C80.903 34.4992 77.8488 25.7683 69.8469 22.6178Z'},
    {color:'#EF151E',d:'M31.2926 50.8411C34.9291 42.2894 41.18 35.3504 45.449 35.3477C49.6841 35.3477 53.9192 42.2555 55.0622 50.8031C56.2011 59.3276 50.0588 66.2423 40.9519 66.3047C31.7921 66.3142 27.6629 59.3819 31.2926 50.8411Z'}
  ];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function sample(d){
    const svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');path.setAttribute('d',d);svg.append(path);svg.style.cssText='position:absolute;width:0;height:0;visibility:hidden';document.body.append(svg);
    const b=path.getBBox(),length=path.getTotalLength(),size=Math.max(b.width,b.height),cx=b.x+b.width/2,cy=b.y+b.height/2;
    const points=Array.from({length:64},(_,i)=>{const p=path.getPointAtLength(i/64*length);return [(p.x-cx)/size,(p.y-cy)/size];});svg.remove();
    const area=points.reduce((n,p,i)=>{const q=points[(i+1)%64];return n+p[0]*q[1]-q[0]*p[1];},0);
    return {points,b,size,cx,cy,angle:Math.atan2(points[0][1],points[0][0]),direction:Math.sign(area)};
  }
  function closed(points){
    let d=`M${points[0].join(' ')}`;
    for(let i=0;i<points.length;i++){const a=points[(i+63)%64],b=points[i],c=points[(i+1)%64],e=points[(i+2)%64];d+=`C${b[0]+(c[0]-a[0])/6} ${b[1]+(c[1]-a[1])/6} ${c[0]-(e[0]-b[0])/6} ${c[1]-(e[1]-b[1])/6} ${c.join(' ')}`;}
    return d+'Z';
  }
  const planes=[...root.querySelectorAll('.card')].map((card,i)=>{
    const frame=card.querySelector('.card__frame'),img=card.querySelector('.card__img'),shape=sample(paths[i].d),id=`liquid-${i}`;
    const svg=document.createElementNS(ns,'svg');svg.classList.add('liquid-surface');svg.setAttribute('viewBox','-.72 -.72 1.44 1.44');svg.setAttribute('aria-hidden','true');
    svg.innerHTML=`<defs>
      <path id="${id}-shape"/><clipPath id="${id}-clip" clipPathUnits="userSpaceOnUse"><use href="#${id}-shape"/></clipPath>
      <radialGradient id="${id}-depth" cx="36%" cy="25%" r="78%"><stop offset="0" stop-color="#fff" stop-opacity=".13"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#132231" stop-opacity=".32"/></radialGradient>
      <radialGradient id="${id}-shine" cx="28%" cy="18%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".2" stop-color="#fff" stop-opacity=".24"/><stop offset=".58" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <filter id="${id}-shadow" x="-60%" y="-60%" width="220%" height="240%"><feDropShadow dx="0" dy=".035" stdDeviation=".027" flood-color="#17222e" flood-opacity=".18"/></filter>
    </defs>
    <use href="#${id}-shape" class="liquid-shadow" filter="url(#${id}-shadow)" fill="#fff"/>
    <g clip-path="url(#${id}-clip)"><use href="#${id}-shape" class="liquid-color" fill="${paths[i].color}"/>
    <image class="liquid-image" x="-.5" y="-.5" width="1" height="1" preserveAspectRatio="xMidYMid slice" href="${img.currentSrc||img.src}"/>
    <use href="#${id}-shape" class="liquid-depth" fill="url(#${id}-depth)"/><use href="#${id}-shape" class="liquid-shine" fill="url(#${id}-shine)"/>
    <ellipse class="liquid-reflection" cx="-.17" cy="-.32" rx=".19" ry=".026" fill="#fff" opacity=".34" transform="rotate(-28)"/>
    </g><use href="#${id}-shape" class="liquid-rim" fill="none" stroke="#fff" stroke-width=".007" stroke-opacity=".52"/>`;
    frame.append(svg);frame.classList.add('liquid-ready');
    const p={card,frame,svg,shape,index:i,hover:0,hv:0,target:0,x:0,y:0,vx:0,vy:0,tx:0,ty:0,pressed:false,press:0,pv:0};
    p.geometry=[svg.querySelector(`#${id}-shape`)];p.color=svg.querySelector('.liquid-color');p.depth=svg.querySelector('.liquid-depth');p.image=svg.querySelector('image');p.shine=svg.querySelector('.liquid-shine');p.reflection=svg.querySelector('.liquid-reflection');
    card.addEventListener('pointerenter',()=>p.target=1);card.addEventListener('pointerleave',()=>{p.target=0;p.tx=p.ty=0;p.pressed=false;});
    card.addEventListener('pointermove',e=>{if(intro)return;const r=card.getBoundingClientRect();p.tx=clamp((e.clientX-r.left)/r.width*2-1,-1,1);p.ty=clamp((e.clientY-r.top)/Math.min(r.height,r.width)*2-1,-1,1);});
    card.addEventListener('pointerdown',()=>p.pressed=true);card.addEventListener('pointerup',()=>p.pressed=false);card.addEventListener('pointercancel',()=>p.pressed=false);
    card.addEventListener('focus',()=>p.target=1);card.addEventListener('blur',()=>{p.target=0;p.tx=p.ty=0;});
    return p;
  });
  let raf=0,last=0,elapsed=0,intro=false,modal=false,settle=1;
  function geometry(p,morph,wave=0){
    const points=p.shape.points.map((point,j)=>{
      const a=p.shape.angle+p.shape.direction*j/64*Math.PI*2;
      const phase=elapsed*.85+p.index*2.1;
      const directional=(p.vx*Math.cos(a)+p.vy*Math.sin(a))*.00065;
      const radius=.48+wave*(.018*Math.sin(a*2+phase)+.012*Math.sin(a*3-phase*.7)+clamp(directional,-.018,.018));
      return [point[0]*(1-morph)+Math.cos(a)*radius*morph,point[1]*(1-morph)+Math.sin(a)*radius*morph];
    });
    const d=closed(points);p.geometry.forEach(el=>el.setAttribute('d',d));
  }
  function surface(p,reveal){p.image.setAttribute('opacity',reveal);p.color.setAttribute('opacity',1-reveal);p.depth.setAttribute('opacity',reveal*.8);p.shine.setAttribute('opacity',reveal*.75);p.reflection.setAttribute('opacity',reveal*.25);}
  function spring(p,key,velocity,target,dt,stiffness=170,damping=17){p[velocity]+=(stiffness*(target-p[key])-damping*p[velocity])*dt;p[key]+=p[velocity]*dt;}
  function tick(time){
    raf=0;if(document.hidden||modal)return;const dt=Math.min(last?(time-last)/1000:1/60,1/30);last=time;
    if(!intro){elapsed+=dt;settle=Math.min(1,settle+dt*2.4);for(const p of planes){spring(p,'x','vx',p.tx,dt);spring(p,'y','vy',p.ty,dt);spring(p,'hover','hv',p.target,dt,190,19);spring(p,'press','pv',p.pressed?1:0,dt,230,18);
      const motion=reduce.matches?0:1;geometry(p,1,motion*settle*(1+p.hover*.22));surface(p,1);
      p.frame.style.transform=motion?`translate3d(${p.x*8}px,${p.y*7+Math.sin(elapsed*.9+p.index*2)*4*settle}px,0) rotateX(${-p.y*8}deg) rotateY(${p.x*9}deg) scale(${1+p.hover*.035-p.press*.06})`:'none';
      p.shine.setAttribute('transform',`translate(${p.x*.06} ${p.y*.045})`);p.reflection.setAttribute('transform',`translate(${p.x*.08} ${p.y*.04}) rotate(${-28+p.x*12})`);
    }}
    if(!reduce.matches||intro)raf=requestAnimationFrame(tick);
  }
  function kick(){if(!raf&&!document.hidden&&!modal){last=0;raf=requestAnimationFrame(tick);}}
  root.liquidCards={planes,begin(){intro=true;settle=0;},update(p,state){geometry(p,state.morph,0);surface(p,state.reveal);p.frame.style.transform=state.transform;},finish(){intro=false;settle=0;planes.forEach(p=>{p.frame.style.transform='none';geometry(p,1,0);surface(p,1);});kick();}};
  planes.forEach(p=>{geometry(p,1,0);surface(p,1);});root.classList.add('is-liquid');
  document.addEventListener('portfolio:modal',e=>{modal=!!e.detail.open;if(modal){cancelAnimationFrame(raf);raf=0;}else kick();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else kick();});reduce.addEventListener('change',kick);kick();
};
