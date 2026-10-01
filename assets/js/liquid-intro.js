/* Three blossom-inspired droplets become the actual project cards. */
window.initLiquidIntro = function(gallery) {
  const html = document.documentElement;
  if (!html.classList.contains('has-liquid-intro')) return;
  const cards = [...gallery.querySelectorAll('.card')];
  gallery.inert = true;
  const ns = 'http://www.w3.org/2000/svg';
  const layer = document.createElement('div');
  layer.className = 'liquid-intro'; layer.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
  const defs = document.createElementNS(ns, 'defs'); svg.append(defs); layer.append(svg); document.body.append(layer);
  let raf = 0, done = false, started = 0, revealing = false, handoff = false;
  const animations = [];
  const lerp = (a,b,t) => a+(b-a)*t;
  const smooth = t => {t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  const colors = ['#ef8b13', '#e5243b', '#0877be'];
  const angles = [-80, 42, 148];
  const size = Math.min(168, innerWidth*.37);
  const center = {x:innerWidth/2, y:innerHeight*.43};
  // Matching cubic segments let the pointed petal smoothly become a circle.
  const petal = [50,96, 40,85,2,62,4,34, 6,5,40,-5,63,4, 90,10,106,38,93,62, 80,83,61,88,50,96];
  const circle = [50,100, 22.386,100,0,77.614,0,50, 0,22.386,22.386,0,50,0, 77.614,0,100,22.386,100,50, 100,77.614,77.614,100,50,100];
  const planes = cards.map((card,i)=>{
    const frame=card.querySelector('.card__frame'), img=card.querySelector('.card__img');
    const target=frame.getBoundingClientRect();
    const clip=document.createElementNS(ns,'clipPath');clip.id=`intro-clip-${i}`;
    const clipPath=document.createElementNS(ns,'path');clip.append(clipPath);defs.append(clip);
    const group=document.createElementNS(ns,'g');
    const color=document.createElementNS(ns,'path');color.setAttribute('fill',colors[i]);group.append(color);
    const image=document.createElementNS(ns,'image'); image.setAttribute('href',img.currentSrc||img.src);
    image.setAttribute('width','100');image.setAttribute('height','100');image.setAttribute('preserveAspectRatio','xMidYMid slice');
    image.setAttribute('clip-path',`url(#${clip.id})`);image.setAttribute('opacity','0');group.append(image);svg.append(group);
    const rad=angles[i]*Math.PI/180;
    return {frame,target,group,color,image,clipPath,angle:angles[i],x:center.x+Math.sin(rad)*size*.48,y:center.y-Math.cos(rad)*size*.48,i};
  });
  function path(t){const p=petal.map((v,i)=>lerp(v,circle[i],t));return `M${p[0]} ${p[1]} C${p.slice(2,8).join(' ')} C${p.slice(8,14).join(' ')} C${p.slice(14,20).join(' ')} C${p.slice(20).join(' ')}Z`;}
  function finish(){
    if(done)return;done=true;cancelAnimationFrame(raf);clearTimeout(safety);
    html.classList.remove('has-liquid-intro','intro-text-in');gallery.inert=false;layer.remove();animations.forEach(a=>a.cancel());
    document.removeEventListener('keydown',onKey);document.removeEventListener('visibilitychange',onVisibility);window.removeEventListener('resize',finish);
    document.dispatchEvent(new CustomEvent('portfolio:intro',{detail:{playing:false}}));
  }
  function onKey(e){if(e.key==='Escape'||e.key==='Tab')finish();}
  function onVisibility(){if(document.hidden)finish();}
  const safety=setTimeout(finish,6000);
  document.addEventListener('keydown',onKey);document.addEventListener('visibilitychange',onVisibility);window.addEventListener('resize',finish,{once:true});
  document.dispatchEvent(new CustomEvent('portfolio:intro',{detail:{playing:true}}));
  function tick(now){
    if(done)return;if(!started)started=now;const time=(now-started)/1000;
    const appear=smooth(time/.55);
    planes.forEach(p=>{
      const move=smooth((time-1.02-p.i*.07)/1.72);
      const morph=smooth((time-.87-p.i*.06)/1.5);
      const texture=smooth((time-1.03-p.i*.08)/.85);
      const tx=p.target.left+p.target.width/2,ty=p.target.top+p.target.height/2;
      const travel=Math.sin(move*Math.PI);
      const x=lerp(p.x,tx,move)+travel*(p.i-1)*50;
      const y=lerp(p.y,ty,move)-travel*(60+p.i*22);
      const width=lerp(size,p.target.width,move)*lerp(.7,1,appear);
      const rotation=lerp(p.angle,0,morph)+Math.sin(time*2.8+p.i)*3*(1-move);
      const scale=width/100;
      p.group.setAttribute('transform',`translate(${x} ${y}) rotate(${rotation}) scale(${scale}) translate(-50 -50)`);
      p.group.setAttribute('opacity',appear);
      const d=path(morph);p.color.setAttribute('d',d);p.clipPath.setAttribute('d',d);
      p.image.setAttribute('opacity',texture);p.color.setAttribute('opacity',1-texture*.96);
    });
    layer.style.backgroundColor=`rgba(255,255,255,${1-smooth((time-1.68)/.62)})`;
    if(time>1.9&&!revealing){revealing=true;html.classList.add('intro-text-in');}
    if(time>2.7&&!handoff){handoff=true;document.dispatchEvent(new CustomEvent('portfolio:intro',{detail:{playing:false}}));planes.forEach(p=>animations.push(p.frame.animate([{opacity:0},{opacity:1}],{duration:400,fill:'forwards'})));}
    layer.style.opacity=String(1-smooth((time-2.72)/.42));
    if(time>=3.18){finish();return;}raf=requestAnimationFrame(tick);
  }
  raf=requestAnimationFrame(tick);
};
