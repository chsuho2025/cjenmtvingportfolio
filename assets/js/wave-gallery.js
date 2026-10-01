/* The same GPU surface morphs from the blossom into a dimensional liquid card. */
window.initWaveGallery = function(root) {
  const ns = 'http://www.w3.org/2000/svg';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  // Official blossom paths: https://prd-cdn.cj.net/static/svg/logo_b.svg
  const petals = [
    {color:'#006ECD',d:'M28.9737 25.1752C36.092 30.0361 44.0627 31.5075 46.8915 28.3543C49.7421 25.1752 48.758 15.8919 44.8255 7.47599C40.8931 -.939936 32.9889 -2.48874 26.8752 4.32816C20.8374 11.141 21.8786 20.3252 28.9737 25.1752Z'},
    {color:'#FF9700',d:'M69.8469 22.6178C61.8232 19.455 53.7209 19.793 51.6671 23.4947C49.5916 27.2275 52.6173 36.0629 58.3184 43.3997C64.0195 50.7365 72.0812 50.4949 76.5267 42.4834C80.903 34.4992 77.8488 25.7683 69.8469 22.6178Z'},
    {color:'#EF151E',d:'M31.2926 50.8411C34.9291 42.2894 41.18 35.3504 45.449 35.3477C49.6841 35.3477 53.9192 42.2555 55.0622 50.8031C56.2011 59.3276 50.0588 66.2423 40.9519 66.3047C31.7921 66.3142 27.6629 59.3819 31.2926 50.8411Z'}
  ];
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  let raf=0,last=0,elapsed=0,intro=false,modal=false,settle=1;

  function sample(d) {
    const svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
    path.setAttribute('d',d);svg.append(path);
    svg.style.cssText='position:absolute;width:0;height:0;visibility:hidden';document.body.append(svg);
    const b=path.getBBox(),length=path.getTotalLength(),size=Math.max(b.width,b.height);
    const cx=b.x+b.width/2,cy=b.y+b.height/2;
    const points=Array.from({length:128},(_,i)=>{
      const p=path.getPointAtLength(i/128*length);return [(p.x-cx)/size,(p.y-cy)/size];
    });
    svg.remove();return {points,size,cx,cy};
  }

  // A small, immutable radial texture preserves the official petal geometry.
  function radiusMap(points) {
    const count=1024,data=new Uint8Array(count*4);
    const polar=points.map(([x,y])=>({a:Math.atan2(y,x),r:Math.hypot(x,y)})).sort((a,b)=>a.a-b.a);
    polar.unshift({a:polar.at(-1).a-Math.PI*2,r:polar.at(-1).r});
    polar.push({a:polar[1].a+Math.PI*2,r:polar[1].r});
    let j=0;
    for(let i=0;i<count;i++) {
      const a=(i+.5)/count*Math.PI*2-Math.PI;
      while(j<polar.length-2&&polar[j+1].a<a)j++;
      const l=polar[j],r=polar[j+1],radius=l.r+(r.r-l.r)*(a-l.a)/(r.a-l.a);
      const encoded=Math.round(radius*65535);
      data[i*4]=encoded>>8;data[i*4+1]=encoded&255;data[i*4+3]=255;
    }
    return data;
  }

  const vertex=`attribute vec2 a_position;varying vec2 v_uv;
    void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
  const fragment=`precision highp float;
    varying vec2 v_uv;
    uniform sampler2D u_shape,u_image;
    uniform vec3 u_color;
    uniform float u_morph,u_reveal,u_time,u_wave,u_pixel;
    uniform vec2 u_pointer,u_velocity;
    const float PI=3.14159265359;
    float radius(vec2 p){
      float angle=atan(p.y,p.x);
      vec2 encoded=texture2D(u_shape,vec2(angle/(2.*PI)+.5,.5)).rg;
      float petal=(encoded.r*65280.+encoded.g*255.)/65535.;
      float flow=.014*sin(angle*2.+u_time)+.010*sin(angle*3.-u_time*.7);
      flow+=clamp(dot(u_velocity,vec2(cos(angle),sin(angle)))*.00065,-.012,.012);
      return mix(petal,.48+flow*u_wave,u_morph);
    }
    void main(){
      vec2 p=(v_uv-.5)*1.44;p.y=-p.y;
      float r=radius(p),distance=length(p)-r;
      float mask=1.-smoothstep(-u_pixel,u_pixel,distance);
      vec2 shadowPoint=p-vec2(0.,.035);
      float sd=length(shadowPoint)-radius(shadowPoint);
      float shadow=.16*exp(-max(0.,sd)*46.)*u_reveal;
      if(mask<.001&&shadow<.002){gl_FragColor=vec4(0.);return;}
      vec2 uv=clamp(p+vec2(.5),vec2(0.),vec2(1.));
      vec3 base=mix(u_color,texture2D(u_image,uv).rgb,u_reveal);
      vec2 curved=p/max(r,.001);
      vec3 normal=normalize(vec3(curved.x,-curved.y,sqrt(max(.035,1.-dot(curved,curved)))));
      vec3 light=normalize(vec3(-.48+u_pointer.x*.18,.65-u_pointer.y*.18,1.));
      float diffuse=max(0.,dot(normal,light));
      float rim=pow(1.-max(0.,normal.z),3.);
      float specular=pow(max(0.,dot(normal,normalize(light+vec3(0.,0.,1.)))),28.);
      vec3 shaded=base*(.76+.24*diffuse)+vec3(.17*specular+.1*rim);
      // Keep the opening blossom flat and its official colors intact.
      vec3 color=mix(base,shaded,u_reveal);
      float edge=(1.-smoothstep(0.,.009,abs(distance)))*.4*u_reveal;
      color=mix(color,vec3(1.),edge);
      float alpha=mask+shadow*(1.-mask);
      gl_FragColor=vec4(color*mask+vec3(.13,.16,.18)*shadow*(1.-mask),alpha);
    }`;

  function gpuSurface(p,img,petal) {
    const canvas=document.createElement('canvas');canvas.className='liquid-surface';canvas.setAttribute('aria-hidden','true');
    const gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:true,powerPreference:'low-power'});
    if(!gl)return null;
    function compile(type,source) {
      const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error('Liquid shader unavailable');}
      return shader;
    }
    try {
      const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;
      gl.useProgram(program);
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const attribute=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
      const uniforms=Object.fromEntries(['shape','image','color','morph','reveal','time','wave','pixel','pointer','velocity'].map(name=>[name,gl.getUniformLocation(program,'u_'+name)]));
      function texture(unit) {
        const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,unit?gl.CLAMP_TO_EDGE:gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;
      }
      texture(0);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1024,1,0,gl.RGBA,gl.UNSIGNED_BYTE,radiusMap(p.shape.points));gl.uniform1i(uniforms.shape,0);
      const imageTexture=texture(1);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([243,242,238,255]));gl.uniform1i(uniforms.image,1);
      const color=petal.color.match(/\w\w/g).map(v=>parseInt(v,16)/255);gl.uniform3f(uniforms.color,...color);
      let usable=true,ready=false,state={morph:1,reveal:1,wave:0};
      function draw() {
        if(!usable)return;
        gl.uniform1f(uniforms.morph,state.morph);gl.uniform1f(uniforms.reveal,ready?state.reveal:0);
        gl.uniform1f(uniforms.time,elapsed*.38+p.index*2.1);gl.uniform1f(uniforms.wave,state.wave);
        gl.uniform2f(uniforms.pointer,p.x,p.y);gl.uniform2f(uniforms.velocity,p.vx,p.vy);
        gl.drawArrays(gl.TRIANGLES,0,6);
      }
      function resize(width) {
        const pixels=Math.round(width*1.44*Math.min(devicePixelRatio||1,coarse.matches?1.25:1.5));
        if(canvas.width===pixels)return;
        canvas.width=canvas.height=Math.max(1,pixels);gl.viewport(0,0,canvas.width,canvas.height);
        gl.uniform1f(uniforms.pixel,1.44/canvas.width*1.1);draw();
      }
      function upload() {
        if(!usable||!img.naturalWidth)return;
        // Upload a bounded square thumbnail once, instead of decoding a full-size image per frame.
        const thumb=document.createElement('canvas');thumb.width=thumb.height=640;
        const ctx=thumb.getContext('2d');const side=Math.min(img.naturalWidth,img.naturalHeight);
        ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,640,640);
        gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,imageTexture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,thumb);ready=true;draw();
      }
      if(img.complete)upload();else img.addEventListener('load',upload,{once:true});
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();usable=false;p.fallback=true;canvas.remove();p.frame.classList.remove('liquid-ready');});
      p.frame.append(canvas);p.surface=canvas;
      return {render(morph,reveal,wave){state={morph,reveal,wave};draw();},resize};
    } catch (_) {gl.getExtension('WEBGL_lose_context')?.loseContext();return null;}
  }

  // Browsers without WebGL retain a light SVG morph and compositor-only idle movement.
  function svgSurface(p,img,petal) {
    const svg=document.createElementNS(ns,'svg'),id=`liquid-fallback-${p.index}`;
    svg.classList.add('liquid-surface');svg.setAttribute('viewBox','-.72 -.72 1.44 1.44');svg.setAttribute('aria-hidden','true');
    svg.innerHTML=`<defs><path id="${id}"/><clipPath id="${id}-clip"><use href="#${id}"/></clipPath></defs><g clip-path="url(#${id}-clip)"><rect x="-.6" y="-.6" width="1.2" height="1.2" fill="${petal.color}"/><image x="-.5" y="-.5" width="1" height="1" preserveAspectRatio="xMidYMid slice" href="${img.currentSrc||img.src}"/></g><use href="#${id}" fill="none" stroke="#fff" stroke-width=".007" stroke-opacity=".5"/>`;
    const path=svg.querySelector('path'),image=svg.querySelector('image');let previous='';
    p.frame.append(svg);p.surface=svg;
    return {resize(){},render(morph,reveal){
      const key=morph.toFixed(4)+':'+reveal.toFixed(4);if(previous===key)return;previous=key;
      const points=p.shape.points.map(([x,y])=>{const a=Math.atan2(y,x);return [x*(1-morph)+Math.cos(a)*.48*morph,y*(1-morph)+Math.sin(a)*.48*morph];});
      path.setAttribute('d','M'+points.map(q=>q.join(' ')).join('L')+'Z');image.setAttribute('opacity',reveal);
    }};
  }

  const planes=[...root.querySelectorAll('.card')].map((card,index)=>{
    const frame=card.querySelector('.card__frame'),img=card.querySelector('.card__img');
    const p={card,frame,index,shape:sample(petals[index].d),hover:0,hv:0,target:0,x:0,y:0,vx:0,vy:0,tx:0,ty:0,pressed:false,press:0,pv:0,wobble:0,wv:0,visible:true,bounds:null};
    p.renderer=gpuSurface(p,img,petals[index])||svgSurface(p,img,petals[index]);
    frame.classList.add('liquid-ready');
    const resize=new ResizeObserver(entries=>{p.renderer.resize(entries[0].contentRect.width);p.bounds=null;});resize.observe(frame);
    function enter(){p.target=1;p.bounds=card.getBoundingClientRect();if(!reduce.matches&&!coarse.matches&&!intro)p.wv=2.8;kick();}
    card.addEventListener('pointerenter',enter);
    card.addEventListener('pointerleave',()=>{p.target=0;p.tx=p.ty=0;p.pressed=false;if(!reduce.matches&&!coarse.matches)p.wv-=1.2;});
    card.addEventListener('pointermove',e=>{
      if(intro||reduce.matches||coarse.matches)return;
      const r=p.bounds||(p.bounds=card.getBoundingClientRect());
      p.tx=clamp((e.clientX-r.left)/r.width*2-1,-1,1);p.ty=clamp((e.clientY-r.top)/Math.min(r.height,r.width)*2-1,-1,1);
    });
    card.addEventListener('pointerdown',()=>{p.pressed=true;kick();});card.addEventListener('pointerup',()=>{p.pressed=false;if(!reduce.matches)p.wv=1.8;});card.addEventListener('pointercancel',()=>p.pressed=false);
    card.addEventListener('focus',enter);card.addEventListener('blur',()=>{p.target=0;p.tx=p.ty=0;});
    p.renderer.resize(frame.getBoundingClientRect().width);p.renderer.render(1,1,0);return p;
  });

  function spring(p,key,velocity,target,dt,stiffness=65,damping=14) {
    p[velocity]+=(stiffness*(target-p[key])-damping*p[velocity])*dt;p[key]+=p[velocity]*dt;
  }
  function tick(time) {
    raf=0;if(document.hidden||modal||intro)return;
    const dt=Math.min(last?(time-last)/1000:1/60,1/30);last=time;elapsed+=dt;settle=Math.min(1,settle+dt*1.2);
    for(const p of planes) {
      if(!p.visible||p.fallback)continue;
      spring(p,'x','vx',p.tx,dt);spring(p,'y','vy',p.ty,dt);spring(p,'hover','hv',p.target,dt,75,13);spring(p,'press','pv',p.pressed?1:0,dt,130,19);spring(p,'wobble','wv',0,dt,38,5.5);
      const motion=reduce.matches?0:1;
      p.renderer.render(1,1,motion*settle*(1+p.hover*.22));
      const size=1+p.hover*.045-p.press*.055,stretch=clamp(p.wobble,-.4,.4)*.1;
      p.frame.style.transform=motion?`translate3d(${p.x*11}px,${p.y*9+Math.sin(elapsed*.42+p.index*2)*4*settle}px,0) rotateX(${-p.y*7}deg) rotateY(${p.x*8}deg) rotateZ(${p.wobble*4}deg) scale(${size*(1+stretch)},${size*(1-stretch)})`:'none';
    }
    if(!reduce.matches&&planes.some(p=>p.visible&&!p.fallback))raf=requestAnimationFrame(tick);
  }
  function kick(){if(!raf&&!document.hidden&&!modal&&!intro){last=0;raf=requestAnimationFrame(tick);}}
  const visibility=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{const p=planes.find(p=>p.frame===entry.target);p.visible=entry.isIntersecting;});
    if(planes.some(p=>p.visible))kick();else {cancelAnimationFrame(raf);raf=0;}
  },{rootMargin:'60px'});
  planes.forEach(p=>visibility.observe(p.frame));
  window.addEventListener('scroll',()=>planes.forEach(p=>p.bounds=null),{passive:true});
  root.liquidCards={planes,
    begin(){intro=true;settle=0;cancelAnimationFrame(raf);raf=0;},
    update(p,state){p.renderer.render(state.morph,state.reveal,0);p.frame.style.transform=state.transform;},
    finish(){intro=false;settle=0;planes.forEach(p=>{p.frame.style.transform='none';p.renderer.render(1,1,0);});kick();}
  };
  root.classList.add('is-liquid');
  document.addEventListener('portfolio:modal',e=>{modal=!!e.detail.open;if(modal){cancelAnimationFrame(raf);raf=0;}else kick();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else kick();});
  reduce.addEventListener('change',kick);kick();
};
