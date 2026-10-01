/* The actual card surfaces start as CJ blossom petals and stay mounted throughout. */
window.initLiquidIntro=function(gallery){
  const html=document.documentElement,engine=gallery.liquidCards;
  if(!html.classList.contains('has-liquid-intro'))return;
  if(!engine){html.classList.remove('has-liquid-intro');return;}
  gallery.inert=true;engine.begin();
  const marker=document.createElement('div');marker.className='liquid-intro';marker.setAttribute('aria-hidden','true');document.body.append(marker);
  const clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10);};
  const lerp=(a,b,t)=>a+(b-a)*t;
  const scale=Math.min(4.5,(innerWidth-100)/56),center={x:innerWidth/2,y:innerHeight*.43};
  const targets=engine.planes.map(p=>({p,r:p.frame.getBoundingClientRect()}));
  let raf=0,start=0,done=false,text=false;
  function frame(seconds){
    const time=seconds/1.6;
    targets.forEach(({p,r},i)=>{
      const move=ease((time-.95-i*.045)/1.95),morph=ease((time-1.0-i*.045)/1.72),reveal=ease((time-1.06-i*.04)/1.1);
      const bloom=1-.13*Math.exp(-time*5)*Math.cos(time*8);
      const sx=center.x+(p.shape.cx-51)*scale*bloom,sy=center.y+(p.shape.cy-33.15)*scale*bloom;
      const x=lerp(sx,r.left+r.width/2,move)+Math.sin(move*Math.PI)*(i-1)*32;
      const y=lerp(sy,r.top+r.height/2,move)-Math.sin(move*Math.PI)*(45+i*15);
      const size=lerp(p.shape.size*scale*bloom,r.width,move);
      const stretch=Math.sin(move*Math.PI)*.045;
      engine.update(p,{morph,reveal,transform:`translate3d(${x-r.left-r.width/2}px,${y-r.top-r.height/2}px,0) rotate(${Math.sin(move*Math.PI)*(i-1)*6}deg) scale(${size/r.width*(1+stretch)},${size/r.width*(1-stretch)})`});
    });
  }
  function finish(){if(done)return;done=true;cancelAnimationFrame(raf);clearTimeout(safety);frame(6.4);engine.finish();gallery.inert=false;html.classList.remove('has-liquid-intro','intro-text-in');marker.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',finish);}
  function key(e){if(e.key==='Escape'||e.key==='Tab')finish();}function visibility(){if(document.hidden)finish();}
  const safety=setTimeout(finish,8500);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);window.addEventListener('resize',finish,{once:true});
  frame(0);
  function tick(now){if(done)return;if(!start)start=now;const time=(now-start)/1000;frame(time);if(time>3.44&&!text){text=true;html.classList.add('intro-text-in');}if(time>=5.36){finish();return;}raf=requestAnimationFrame(tick);}
  raf=requestAnimationFrame(tick);
};
