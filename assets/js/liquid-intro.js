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
  let raf=0,start=performance.now(),done=false,text=false;
  function frame(seconds){
    targets.forEach(({p,r},i)=>{
      const travel=clamp((seconds-1.2-i*.12)/4.65),move=ease(travel);
      const morph=ease((seconds-1.65-i*.12)/3.7),reveal=ease((seconds-2.45-i*.12)/2.6);
      const arc=Math.sin(Math.PI*move),energy=ease(seconds/1.4)*(1-ease((seconds-4.65)/1.75));
      const bloom=1-.08*Math.exp(-seconds*3)*Math.cos(seconds*5);
      const sx=center.x+(p.shape.cx-51)*scale*bloom,sy=center.y+(p.shape.cy-33.15)*scale*bloom;
      // Each original petal follows its own depth arc; no replacement layer or opacity crossfade.
      const direction=[-1,1,.6][i],room=Math.min(1,innerWidth/900);
      const x=lerp(sx,r.left+r.width/2,move)+arc*direction*52*room;
      const y=lerp(sy,r.top+r.height/2,move)-arc*(52+i*16)*room;
      const depth=arc*[62,-45,42][i]*room;
      const roll=arc*[-12,14,10][i]+Math.sin(move*Math.PI*2)*arc*7;
      const pitch=arc*Math.sin(move*Math.PI*1.5+i*.65)*18;
      const yaw=arc*direction*26;
      const size=lerp(p.shape.size*scale*bloom,r.width,move);
      const stretch=arc*(.10+Math.sin(seconds*4.2+i*1.7)*.045);
      engine.update(p,{morph,reveal,energy,light:seconds*1.3+i*1.7,time:seconds,wave:arc*1.2,
        transform:`perspective(1000px) translate3d(${x-r.left-r.width/2}px,${y-r.top-r.height/2}px,${depth}px) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg) scale(${size/r.width*(1+stretch)},${size/r.width*(1-stretch)})`});
    });
  }
  function finish(){if(done)return;done=true;cancelAnimationFrame(raf);clearTimeout(safety);frame(7.2);engine.finish();gallery.inert=false;html.classList.remove('has-liquid-intro','intro-text-in');marker.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',finish);}
  function key(e){if(e.key==='Escape'||e.key==='Tab')finish();}function visibility(){if(document.hidden)finish();}
  const safety=setTimeout(finish,9000);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);window.addEventListener('resize',finish,{once:true});
  frame(0);
  function tick(now){if(done)return;const time=Math.max(0,now-start)/1000/.8;frame(time);if(time>4.5&&!text){text=true;html.classList.add('intro-text-in');}if(time>=6.65){finish();return;}raf=requestAnimationFrame(tick);}
  raf=requestAnimationFrame(tick);
};
