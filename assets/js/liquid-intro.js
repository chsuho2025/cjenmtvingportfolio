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
  function petalRadius(points,angle){
    const dx=Math.cos(angle),dy=Math.sin(angle);
    for(let i=0;i<points.length;i++){
      const a=points[i],b=points[(i+1)%points.length],ex=b[0]-a[0],ey=b[1]-a[1],cross=dx*ey-dy*ex;
      if(Math.abs(cross)<.00001)continue;
      const t=(a[0]*ey-a[1]*ex)/cross,u=(a[0]*dy-a[1]*dx)/cross;
      if(t>0&&u>=0&&u<=1)return t;
    }
    return .48;
  }
  const targets=engine.planes.map((p,i)=>({p,r:p.frame.getBoundingClientRect(),beads:new Float32Array(9),radii:[-2.4,-.65,1.4].map(a=>petalRadius(p.shape.points,a+i*.65))}));
  let raf=0,start=performance.now(),done=false,text=false;
  function frame(seconds){

    targets.forEach(({p,r,beads,radii},i)=>{
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
      const roll=arc*[-7,8,5][i]+Math.sin(move*Math.PI*2)*arc*4;
      const pitch=arc*Math.sin(move*Math.PI*1.5+i*.65)*10;
      const yaw=arc*direction*14;
      const size=lerp(p.shape.size*scale*bloom,r.width,move);
      // Each bead starts inside the lobe, travels outward, then returns through the neck.
      const slosh=ease((seconds-.7)/.6)*(1-ease((seconds-4.55)/1.1));
      for(let j=0;j<3;j++){
        const q=clamp((seconds-1.05-i*.07-j*.20)/3.9);
        const angle=[-2.4,-.65,1.4][j]+i*.65;
        const gate=ease(q/.15)*(1-ease((q-.85)/.15));
        const reach=Math.pow(Math.sin(Math.PI*q),1.2);
        const radius=[.062,.045,.032][j]*gate;
        const body=lerp(radii[j],.48,morph)+slosh*(.047*Math.sin(angle*2.-seconds*6.4)+.023*Math.sin(angle*3.+seconds*8.2));
        const distance=body-radius*.9+reach*[.24,.28,.30][j];
        const bend=.065*Math.sin(Math.PI*q*2.+j)*reach;
        beads[j*3]=Math.cos(angle)*distance-Math.sin(angle)*bend;
        beads[j*3+1]=Math.sin(angle)*distance+Math.cos(angle)*bend+reach*q*.025;
        beads[j*3+2]=radius;
      }
      const stretch=arc*.055+slosh*Math.sin(seconds*8.2+i*1.7)*.085;
      engine.update(p,{morph,reveal,energy,light:seconds*1.3+i*1.7,time:seconds,wave:arc*.85,slosh,drops:beads,
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
