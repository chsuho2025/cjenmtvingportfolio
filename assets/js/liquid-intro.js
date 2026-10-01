/* Official flat CJ artwork hands off to the same persistent project surfaces. */
window.initLiquidIntro=function(gallery){
  const html=document.documentElement,engine=gallery.liquidCards;
  if(!html.classList.contains('has-liquid-intro'))return;
  if(!engine){html.classList.remove('has-liquid-intro');return;}
  gallery.inert=true;engine.begin();
  const marker=document.createElement('div');marker.className='liquid-intro';marker.setAttribute('aria-hidden','true');document.body.append(marker);
  const brand=document.createElement('div');brand.className='intro-brand';brand.setAttribute('aria-hidden','true');
  brand.innerHTML="<svg width=\"79\" height=\"67\" viewBox=\"0 0 79 67\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M69.8469 22.6178C61.8232 19.455 53.7209 19.793 51.6671 23.4947C49.5916 27.2275 52.6173 36.0629 58.3184 43.3997C64.0195 50.7365 72.0812 50.4949 76.5267 42.4834C80.903 34.4992 77.8488 25.7683 69.8482 22.6178\" fill=\"#FF9700\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M28.9737 25.1752C36.092 30.0361 44.0627 31.5075 46.8915 28.3543C49.7421 25.1752 48.758 15.8919 44.8255 7.47599C40.8931 -0.939936 32.9889 -2.48874 26.8752 4.32816C20.8374 11.141 21.8786 20.3252 28.9764 25.1752\" fill=\"#006ECD\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M21.8103 28.5443C21.5008 28.5135 21.1883 28.5484 20.8932 28.6467C20.598 28.745 20.327 28.9045 20.0978 29.1148C19.8686 29.3251 19.6863 29.5813 19.563 29.8669C19.4396 30.1524 19.3779 30.4608 19.3819 30.7718V32.1129H22.8284C22.8284 32.1129 22.9451 43.4907 22.8148 44.6825C22.8089 45.5428 22.5664 46.3849 22.1139 47.1165C21.6614 47.8482 21.0163 48.4412 20.2493 48.8308C18.4087 49.709 18.3734 50.5398 18.2553 51.2741C18.1019 52.2324 18.2824 52.36 18.9788 52.1836C21.7194 51.5117 24.6351 50.4108 26.1092 47.7041C26.9601 46.008 27.3474 44.117 27.2318 42.2229V32.1102C27.5447 32.1369 27.8597 32.0998 28.1578 32.001C28.4558 31.9023 28.7307 31.744 28.9658 31.5359C29.2009 31.3277 29.3912 31.074 29.5253 30.79C29.6594 30.5061 29.7344 30.1979 29.7457 29.8841V28.5443H21.8103ZM17.9756 43.883C17.0089 45.1179 15.7741 46.1169 14.3646 46.8045C12.955 47.4921 11.4076 47.8503 9.83933 47.8521C7.23874 47.7994 4.76241 46.7294 2.94184 44.8716C1.12127 43.0138 0.101562 40.5163 0.101562 37.9152C0.101562 35.3141 1.12127 32.8166 2.94184 30.9588C4.76241 29.101 7.23874 28.0309 9.83933 27.9783C11.3946 27.9915 12.9268 28.3548 14.3225 29.0412C15.7181 29.7276 16.9412 30.7195 17.901 31.9433C17.1403 32.7792 16.1213 33.336 15.007 33.5246C14.3517 33.4764 13.725 33.2372 13.2043 32.8364C12.2214 32.14 11.044 31.771 9.83933 31.7817C8.26042 31.8488 6.77245 32.5389 5.70132 33.7008C4.6302 34.8628 4.06324 36.4019 4.12465 37.981C4.09716 39.0687 4.36972 40.143 4.91245 41.0861C5.45518 42.0292 6.24711 42.8046 7.2014 43.3273C8.1557 43.85 9.23551 44.0998 10.3224 44.0494C11.4093 43.999 12.4614 43.6503 13.3632 43.0414C13.8933 42.646 14.5296 42.4182 15.1902 42.3872C15.7306 42.4394 16.2552 42.5982 16.7338 42.8545C17.2124 43.1108 17.6354 43.4595 17.9784 43.8803\" fill=\"black\"/>\n<path d=\"M31.2926 50.8411C34.9291 42.2894 41.18 35.3504 45.449 35.3477C49.6841 35.3477 53.9192 42.2555 55.0622 50.8031C56.2011 59.3276 50.0588 66.2423 40.9519 66.3047C31.7921 66.3142 27.6629 59.3819 31.294 50.8398\" fill=\"#EF151E\"/>\n</svg>\n";document.body.append(brand);
  const paths=[...brand.querySelectorAll('path')],word=paths.find(p=>p.getAttribute('fill')==='black');
  const clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10);};
  const lerp=(a,b,t)=>a+(b-a)*t;
  const scale=Math.min(4.1,(innerWidth-90)/79),center={x:innerWidth/2,y:innerHeight*.43};
  brand.style.cssText=`left:${center.x-39.5*scale}px;top:${center.y-33.5*scale}px;width:${79*scale}px;height:${67*scale}px`;
  const targets=engine.planes.map(p=>{const r=p.frame.getBoundingClientRect();p.restLight=[innerWidth*.18-r.left-r.width/2,r.top+r.height/2-innerHeight*.10,650];return {p,r};});
  // Fixed screen-space light, transformed into each rotating surface's coordinates.
  function localLight(x,y,z,rx,ry,rz){
    let v=[innerWidth*.18-x,y-innerHeight*.10,650-z];
    const rot=(a,b,t)=>{const c=Math.cos(t),s=Math.sin(t),u=v[a],w=v[b];v[a]=c*u-s*w;v[b]=s*u+c*w;};
    rot(0,2,-ry);rot(1,2,rx);rot(0,1,rz);
    const n=Math.hypot(...v);return v.map(q=>q/n);
  }
  let raf=0,start=performance.now(),done=false,text=false,handedOff=false;
  function frame(seconds){
    if(seconds>=.85&&!handedOff){handedOff=true;paths.filter(p=>p!==word).forEach(p=>p.style.visibility='hidden');targets.forEach(({p})=>p.surface.style.visibility='');}
    if(!handedOff)targets.forEach(({p})=>p.surface.style.visibility='hidden');
    word.style.opacity=1-ease((seconds-.85)/.65);
    const turn=ease((seconds-.85)/4.6),spin=turn*Math.PI*2;
    const material=ease((seconds-.85)/1.25);
    targets.forEach(({p,r},i)=>{
      const move=ease((seconds-2.05-i*.10)/4.1);
      const morph=ease((seconds-2.65-i*.10)/3.15),reveal=ease((seconds-3.35-i*.10)/2.35);
      const arc=Math.sin(Math.PI*turn),room=Math.min(1,innerWidth/900);
      const dx=(p.shape.cx-39.5)*scale,dy=(p.shape.cy-33.5)*scale;
      const sx=center.x+dx*Math.cos(spin)-dy*Math.sin(spin),sy=center.y+dx*Math.sin(spin)+dy*Math.cos(spin);
      const x=lerp(sx,r.left+r.width/2,move),y=lerp(sy,r.top+r.height/2,move)-Math.sin(Math.PI*move)*30*room;
      const depth=arc*[48,-32,36][i]*room;
      const rx=arc*Math.sin(spin+i*.6)*.42,ry=arc*Math.cos(spin+i*.8)*.48,rz=spin;
      const size=lerp(p.shape.size*scale,r.width,move),deg=180/Math.PI;
      // Rotation changes the highlights. The light position itself never circles the logo.
      engine.update(p,{morph,reveal,energy:material*(1-move),material,time:seconds,wave:move*.12,
        lightDir:localLight(x,y,depth,rx,ry,rz),
        transform:`perspective(1000px) translate3d(${x-r.left-r.width/2}px,${y-r.top-r.height/2}px,${depth}px) rotateY(${ry*deg}deg) rotateX(${rx*deg}deg) rotateZ(${rz*deg}deg) scale(${size/r.width})`});
    });
  }
  function finish(){if(done)return;done=true;cancelAnimationFrame(raf);clearTimeout(safety);frame(7.2);engine.finish();gallery.inert=false;html.classList.remove('has-liquid-intro','intro-text-in');marker.remove();brand.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('resize',finish);}
  function key(e){if(e.key==='Escape'||e.key==='Tab')finish();}function visibility(){if(document.hidden)finish();}
  const safety=setTimeout(finish,9000);document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);window.addEventListener('resize',finish,{once:true});
  frame(0);
  function tick(now){if(done)return;const time=Math.max(0,now-start)/1000/.8;frame(time);if(time>4.5&&!text){text=true;html.classList.add('intro-text-in');}if(time>=6.65){finish();return;}raf=requestAnimationFrame(tick);}
  raf=requestAnimationFrame(tick);
};
