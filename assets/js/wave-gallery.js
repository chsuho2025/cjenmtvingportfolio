/* Liquid portrait cards: soft circular silhouettes with independent surface tension.
   No external animation dependency. HTML images and links remain the fallback. */
window.initWaveGallery = function(root, options = {}) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = document.querySelector('.motion-toggle');
  let enabled = options.enabled !== false;
  // Motion follows system accessibility preferences; no extra UI controls.
  let active = false, visible = true, modalOpen = false, raf = 0, last = 0, elapsed = 0;
  const pointer = {x:0,y:0,tx:0,ty:0,energy:0};
  const vertex = `
    precision mediump float;
    attribute vec2 a_uv;
    uniform float u_time, u_index, u_hover, u_energy;
    uniform vec2 u_pointer;
    varying vec2 v_uv;
    void main() {
      v_uv = a_uv;
      float phase = u_time * .83 + u_index * 2.1;
      vec2 p = (a_uv - .5) * 1.88;
      p *= 1.0 + .055 * u_hover;
      p.y += sin(phase) * .035;
      p.x += cos(phase * .73) * .022;
      p += vec2(u_pointer.x, -u_pointer.y) * .026 * u_hover;
      gl_Position = vec4(p, 0.0, 1.0);
    }`;
  const fragment = `
    precision mediump float;
    uniform sampler2D u_image;
    uniform vec2 u_crop, u_offset;
    uniform float u_time, u_index, u_hover, u_energy;
    varying vec2 v_uv;
    void main() {
      vec2 center = v_uv - .5;
      float angle = atan(center.y, center.x);
      float phase = u_time * .83 + u_index * 2.1;
      float strength = 1.0 + .32 * u_hover + .18 * u_energy;
      // Low-order waves preserve a rounded droplet rather than a wavy rectangle.
      float contour = (.022 * sin(2.0 * angle + phase)
                     + .014 * sin(3.0 * angle - phase * .81)
                     + .005 * cos(5.0 * angle + phase * .57)) * strength;
      float radius = .44 + contour;
      float r = length(center);
      float distance = r - radius;
      float alpha = 1.0 - smoothstep(-.002, .001, distance);
      // A restrained lens at the rim; the work itself stays readable.
      float radial = clamp(r / radius, 0.0, 1.0);
      vec2 lens = .5 + center * (.976 + .024 * radial * radial);
      vec2 uv = lens * u_crop + u_offset;
      vec4 color = texture2D(u_image, uv);
      float rim = smoothstep(.92, 1.0, radial);
      float light = .5 + .5 * dot(normalize(center + vec2(.0001)), normalize(vec2(-.65, .8)));
      vec3 rgb = color.rgb * (1.0 - rim * .045 * (1.0 - light));
      rgb = mix(rgb, vec3(1.0), rim * .12 * light);
      gl_FragColor = vec4(rgb, color.a * alpha);
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
    const gl=p.gl, r=p.frame.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,desktop.matches?2:1.5);
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
    raf=0;if(!active||document.hidden||!visible||modalOpen)return;
    const dt=Math.min(last?(time-last)/1000:1/60,.05);last=time;elapsed+=dt;
    const smooth=1-Math.exp(-dt*5);
    pointer.x+=(pointer.tx-pointer.x)*smooth;pointer.y+=(pointer.ty-pointer.y)*smooth;pointer.energy*=Math.exp(-dt*2.5);
    for(const p of planes){if(!p.ready)continue;p.hover+=(p.target-p.hover)*smooth;draw(p);}
    raf=requestAnimationFrame(tick);
  }
  function kick(){if(active&&!raf&&!document.hidden&&visible&&!modalOpen){last=0;raf=requestAnimationFrame(tick);}}
  function sync(){
    const supported=planes.some(p=>p.ready);
    active=enabled&&!reduce.matches&&supported;
    root.classList.toggle('is-wave',active);
    planes.forEach(p=>p.frame.classList.toggle('wave-ready',active&&p.ready));
    if(toggle){toggle.disabled=reduce.matches||!supported;toggle.setAttribute('aria-pressed',String(active));toggle.textContent=active?'모션 켜짐':'모션 꺼짐';}
    if(active)kick();else{cancelAnimationFrame(raf);raf=0;last=0;}
  }
  root.closest('.home').addEventListener('pointermove',e=>{
    if(!active)return;const r=root.getBoundingClientRect();const x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));
    pointer.energy=Math.min(1,pointer.energy+Math.abs(x-pointer.tx)*.9);pointer.tx=x;pointer.ty=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));
  });
  root.addEventListener('pointerleave',()=>{pointer.tx=pointer.ty=0;});
  toggle?.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem('portfolio-motion',enabled?'on':'off');}catch(_){}sync();});
  [reduce,desktop].forEach(q=>q.addEventListener('change',sync));
  document.addEventListener('portfolio:modal',e=>{modalOpen=!!e.detail.open;if(modalOpen){cancelAnimationFrame(raf);raf=0;}else kick();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else kick();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)kick();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'80px'});observer.observe(root);
  sync();
};
