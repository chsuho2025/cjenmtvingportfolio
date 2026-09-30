/* Curved image planes: continuous low-frequency wave, with damped pointer response.
   No external animation dependency. HTML images and links remain the fallback. */
window.initWaveGallery = function(root, options = {}) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 721px) and (hover: hover) and (pointer: fine)');
  const toggle = document.querySelector('.motion-toggle');
  let enabled = options.enabled !== false;
  try { enabled = enabled && localStorage.getItem('portfolio-motion') !== 'off'; } catch (_) {}
  let active = false, visible = true, raf = 0, last = 0, elapsed = 0;
  const pointer = {x:0,y:0,tx:0,ty:0,energy:0};
  const vertex = `
    attribute vec2 a_uv;
    uniform float u_time, u_index, u_hover, u_energy;
    uniform vec2 u_pointer;
    varying vec2 v_uv;
    varying float v_light;
    void main() {
      v_uv = a_uv;
      float phase = (a_uv.x + u_index * 1.08) * 4.3 - u_time * .65;
      float amplitude = .045 + .035 * u_hover + .018 * u_energy;
      float curve = sin(phase + u_pointer.x * .22);
      float depth = cos(phase) * (.12 + .035 * u_hover);
      vec2 p = (a_uv - .5) * 1.77;
      p.y += curve * amplitude;
      p.x += sin(phase + .7) * .012;
      p += vec2(u_pointer.x * .013, -u_pointer.y * .009);
      float perspective = 1.0 / (1.0 - depth * .22);
      gl_Position = vec4(p * perspective, depth * .1, 1.0);
      v_light = 1.0 - .055 * (cos(phase) + 1.0) * .5;
    }`;
  const fragment = `
    precision mediump float;
    uniform sampler2D u_image;
    uniform vec2 u_crop, u_offset;
    varying vec2 v_uv;
    varying float v_light;
    void main() {
      vec2 q = abs(v_uv - .5) - vec2(.487);
      float distance = length(max(q, 0.0)) + min(max(q.x,q.y),0.0) - .013;
      float alpha = 1.0 - smoothstep(-.002,.001,distance);
      vec2 uv = v_uv * u_crop + u_offset;
      vec4 color = texture2D(u_image, uv);
      gl_FragColor = vec4(color.rgb * v_light, color.a * alpha);
    }`;
  function makePlane(card,index) {
    const img = card.querySelector('.card__img');
    if (!img || img.tagName !== 'IMG') return null;
    const frame=card.querySelector('.card__frame'), canvas=document.createElement('canvas');
    canvas.className='wave-canvas'; canvas.setAttribute('aria-hidden','true');
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power',premultipliedAlpha:false});
    if (!gl) return null;
    function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
    let program;
    try {
      program=gl.createProgram(); const vs=shader(gl.VERTEX_SHADER,vertex), fs=shader(gl.FRAGMENT_SHADER,fragment);
      gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
      gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;
    } catch(_){ return null; }
    gl.useProgram(program);
    const points=[], nx=48,ny=24;
    for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
      const a=x/nx,b=y/ny,c=(x+1)/nx,d=(y+1)/ny;
      points.push(a,b,c,b,a,d,a,d,c,b,c,d);
    }
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
    const attr=gl.getAttribLocation(program,'a_uv');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
    const uniforms=Object.fromEntries(['time','index','hover','energy','pointer','crop','offset','image'].map(k=>[k,gl.getUniformLocation(program,'u_'+k)]));
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    const plane={card,frame,canvas,gl,program,uniforms,ready:false,lost:false,hover:0,target:0,count:points.length/2,index};
    function upload(){
      if(!img.naturalWidth || plane.lost)return;
      try {
        gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
        const aspect=img.naturalWidth/img.naturalHeight;
        const crop=aspect>1?[1/aspect,1]:[1,aspect];
        const pos=(img.style.objectPosition||'50% 50%').split(' ').map(x=>parseFloat(x)/100);
        plane.crop=crop;plane.offset=[(1-crop[0])*(pos[0]||.5),(1-crop[1])*(1-(pos[1]||.5))];
        plane.ready=true;sync();
      }catch(_){plane.ready=false;}
    }
    frame.appendChild(canvas);
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();plane.lost=true;plane.ready=false;frame.classList.remove('wave-ready');sync();});
    canvas.addEventListener('webglcontextrestored',()=>{ /* HTML fallback is retained until next page load. */ });
    card.addEventListener('pointerenter',()=>{plane.target=1;kick();});
    card.addEventListener('pointerleave',()=>{plane.target=0;kick();});
    card.addEventListener('focus',()=>{plane.target=1;kick();});
    card.addEventListener('blur',()=>{plane.target=0;kick();});
    img.addEventListener('load',upload);queueMicrotask(upload);
    return plane;
  }
  const planes=[...root.querySelectorAll('.card')].map(makePlane).filter(Boolean);
  function draw(p){
    const gl=p.gl, r=p.frame.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    const size=Math.round(r.width*1.12*dpr);
    if(p.canvas.width!==size){p.canvas.width=size;p.canvas.height=size;gl.viewport(0,0,size,size);}
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(p.program);
    gl.uniform1f(p.uniforms.time,elapsed);gl.uniform1f(p.uniforms.index,p.index);
    gl.uniform1f(p.uniforms.hover,p.hover);gl.uniform1f(p.uniforms.energy,pointer.energy);
    gl.uniform2f(p.uniforms.pointer,pointer.x,pointer.y);
    gl.uniform2fv(p.uniforms.crop,p.crop);gl.uniform2fv(p.uniforms.offset,p.offset);
    gl.drawArrays(gl.TRIANGLES,0,p.count);
  }
  function tick(time){
    raf=0;if(!active||document.hidden||!visible)return;
    const dt=Math.min(last?(time-last)/1000:1/60,.05);last=time;elapsed+=dt;
    const smooth=1-Math.exp(-dt*5);
    pointer.x+=(pointer.tx-pointer.x)*smooth;pointer.y+=(pointer.ty-pointer.y)*smooth;pointer.energy*=Math.exp(-dt*2.5);
    for(const p of planes){if(!p.ready)continue;p.hover+=(p.target-p.hover)*smooth;draw(p);}
    raf=requestAnimationFrame(tick);
  }
  function kick(){if(active&&!raf&&!document.hidden&&visible){last=0;raf=requestAnimationFrame(tick);}}
  function sync(){
    const supported=planes.some(p=>p.ready);
    active=enabled&&desktop.matches&&!reduce.matches&&supported;
    root.classList.toggle('is-wave',active);
    planes.forEach(p=>p.frame.classList.toggle('wave-ready',active&&p.ready));
    if(toggle){toggle.disabled=!desktop.matches||reduce.matches||!supported;toggle.setAttribute('aria-pressed',String(active));toggle.textContent=active?'모션 켜짐':'모션 꺼짐';}
    if(active)kick();else{cancelAnimationFrame(raf);raf=0;last=0;}
  }
  root.closest('.home').addEventListener('pointermove',e=>{
    if(!active)return;const r=root.getBoundingClientRect();const x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));
    pointer.energy=Math.min(1,pointer.energy+Math.abs(x-pointer.tx)*.9);pointer.tx=x;pointer.ty=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));
  });
  root.addEventListener('pointerleave',()=>{pointer.tx=pointer.ty=0;});
  toggle?.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem('portfolio-motion',enabled?'on':'off');}catch(_){}sync();});
  [reduce,desktop].forEach(q=>q.addEventListener('change',sync));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else kick();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)kick();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'80px'});observer.observe(root);
  sync();
};
