/* Official flat CJ artwork hands off to the same persistent project surfaces. */
window.initLiquidIntro=function(gallery){
  const html=document.documentElement,engine=gallery.liquidCards;
  if(!html.classList.contains('has-liquid-intro'))return;
  if(!engine){html.classList.remove('has-liquid-intro');return;}
  gallery.inert=true;engine.begin();
  const marker=document.createElement('div');marker.className='liquid-intro';marker.setAttribute('aria-hidden','true');document.body.append(marker);
  const brand=document.createElement('div');brand.className='intro-brand';brand.setAttribute('aria-hidden','true');
  brand.innerHTML="<svg width=\"57\" height=\"67\" viewBox=\"22 0 57 67\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M69.8469 22.6178C61.8232 19.455 53.7209 19.793 51.6671 23.4947C49.5916 27.2275 52.6173 36.0629 58.3184 43.3997C64.0195 50.7365 72.0812 50.4949 76.5267 42.4834C80.903 34.4992 77.8488 25.7683 69.8482 22.6178\" fill=\"#FF9700\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M28.9737 25.1752C36.092 30.0361 44.0627 31.5075 46.8915 28.3543C49.7421 25.1752 48.758 15.8919 44.8255 7.47599C40.8931 -0.939936 32.9889 -2.48874 26.8752 4.32816C20.8374 11.141 21.8786 20.3252 28.9764 25.1752\" fill=\"#006ECD\"/>\n<path d=\"M31.2926 50.8411C34.9291 42.2894 41.18 35.3504 45.449 35.3477C49.6841 35.3477 53.9192 42.2555 55.0622 50.8031C56.2011 59.3276 50.0588 66.2423 40.9519 66.3047C31.7921 66.3142 27.6629 59.3819 31.294 50.8398\" fill=\"#EF151E\"/>\n</svg>\n";document.body.append(brand);
  const paths=[...brand.querySelectorAll('path')];
  const clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10);};
  const lerp=(a,b,t)=>a+(b-a)*t;
  const scale=Math.min(4.1,(innerWidth-90)/79),center={x:innerWidth/2,y:innerHeight*.43};
  brand.style.cssText=`left:${center.x-28.5*scale}px;top:${center.y-33.5*scale}px;width:${57*scale}px;height:${67*scale}px`;
  const targets=engine.planes.map(p=>{const r=p.frame.getBoundingClientRect();p.restLight=[innerWidth*.18-r.left-r.width/2,r.top+r.height/2-innerHeight*.10,650];return {p,r};});
  let raf=0,start=performance.now(),done=false,text=false,handedOff=false;
  function frame(seconds){
    if(seconds>=.3&&!handedOff){handedOff=true;paths.forEach(p=>p.style.visibility='hidden');targets.forEach(({p})=>p.surface.style.visibility='');}
    if(!handedOff)targets.forEach(({p})=>p.surface.style.visibility='hidden');
    const material=ease((seconds-.3)/1.9);
    targets.forEach(({p,r},i)=>{
      const move=ease((seconds-.3-i*.045)/4.65);
      // Position and silhouette share one progress value: no orbit or rotating card.
      const morph=move,reveal=ease((move-.30)/.64);
      const sx=center.x+(p.shape.cx-50.5)*scale,sy=center.y+(p.shape.cy-33.5)*scale;
      const x=lerp(sx,r.left+r.width/2,move),y=lerp(sy,r.top+r.height/2,move);
      const size=lerp(p.shape.size*scale,r.width,move);
      const stretch=Math.sin(Math.PI*move)*.035;
      engine.update(p,{morph,reveal,energy:material*(1-move),material,time:seconds,wave:Math.sin(Math.PI*move)*.2,
        lightDir:[innerWidth*.18-x,y-innerHeight*.10,650],
        transform:`translate3d(${x-r.left-r.width/2}px,${y-r.top-r.height/2}px,0) scale(${size/r.width*(1+stretch)},${size/r.width*(1-stretch*.6)})`});
    });
  }
  function finish(){if(done)return;done=true;cancelAnimationFrame(raf);clearTimeout(safety);frame(7.2);engine.finish();gallery.inert=false;html.classList.remove('has-liquid-intro','intro-text-in');marker.remove();brand.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',finish);}
  function key(e){if(e.key==='Escape'||e.key==='Tab')finish();}function visibility(){if(document.hidden)finish();}
  const safety=setTimeout(finish,9000);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);window.addEventListener('resize',finish,{once:true});
  frame(0);
  function tick(now){if(done)return;const time=Math.max(0,now-start)/1000/.8;frame(time);if(time>4.5&&!text){text=true;html.classList.add('intro-text-in');}if(time>=6.65){finish();return;}raf=requestAnimationFrame(tick);}
  raf=requestAnimationFrame(tick);
};
