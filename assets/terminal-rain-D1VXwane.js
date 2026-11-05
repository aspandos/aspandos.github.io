import{a as e,n as t,t as n}from"./jsx-runtime-Wy9s6hX0.js";import{f as r}from"./index-85ufQN3L.js";import{Ct as i,F as a,I as o,Ot as s,St as c,Tt as l,W as u,X as d,h as f,ht as p,mt as m,n as h,rt as g,tt as _,u as v,ut as ee,v as te,wt as y,x as b,y as x}from"./three.module-DQCqqdsN.js";var S=e(t(),1),C=n(),w=3,T=2,E=16,ne=`ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF`,re=`ui-monospace, "SF Mono", Menlo, Consolas, "Hiragino Sans", "Noto Sans JP", "Yu Gothic", monospace`,D=e=>{let t=window.matchMedia(`(prefers-reduced-motion: reduce)`);return t.addEventListener(`change`,e),()=>t.removeEventListener(`change`,e)},O=()=>typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,k=(e,t,n)=>Math.min(n,Math.max(t,e)),A=null,j=(e,t)=>{if(A||=document.createElement(`canvas`).getContext(`2d`),!A)return t;A.fillStyle=`#010203`,A.fillStyle=e;let n=String(A.fillStyle);if(n===`#010203`&&e.trim().toLowerCase()!==`#010203`)return t;if(n.startsWith(`#`)){let e=n.slice(1);return[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255]}let r=n.match(/[\d.]+/g);return!r||r.length<3?t:[Number(r[0])/255,Number(r[1])/255,Number(r[2])/255]},M=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,N=([e,t,n])=>{let r=M(e),i=M(t),a=M(n),o=Math.cbrt(.4122214708*r+.5363325363*i+.0514459929*a),s=Math.cbrt(.2119034982*r+.6806995451*i+.1073969566*a),c=Math.cbrt(.0883024619*r+.2817188376*i+.6299787005*a);return[.2104542553*o+.793617785*s-.0040720468*c,1.9779984951*o-2.428592205*s+.4505937099*c,.0259040371*o+.7827717662*s-.808675766*c]},P=`
uniform vec4 uHover;
uniform float uSlow;

float rateAt(vec2 s) {
  vec2 gap = s - uHover.xy;
  float slow = uSlow * uHover.z * exp(-dot(gap, gap) / (uHover.w * uHover.w));
  return max(1.0 - slow, 0.02);
}
`,F=`
uniform vec2 uCenter;
uniform float uAngle;

vec2 toGrid(vec2 s, vec2 origin, vec2 cell) {
  vec2 d = s - uCenter;
  float c = cos(uAngle);
  float n = sin(uAngle);
  vec2 r = vec2(c * d.x + n * d.y, -n * d.x + c * d.y) + uCenter;
  return (r - origin) / cell;
}

vec2 toScreen(vec2 g, vec2 origin, vec2 cell) {
  vec2 r = origin + g * cell - uCenter;
  float c = cos(uAngle);
  float n = sin(uAngle);
  return vec2(c * r.x - n * r.y, n * r.x + c * r.y) + uCenter;
}
`,ie=`
precision highp float;
uniform sampler2D uPrevious;
uniform sampler2D uHeads;
uniform vec2 uOrigin;
uniform vec2 uCell;
uniform float uDt;
uniform float uTrail;
uniform float uShuffle;
uniform float uGlyphCount;
uniform float uSeed;
${F}
${P}
out vec4 fragColor;

float hash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

void main() {
  ivec2 cell = ivec2(gl_FragCoord.xy);
  vec4 previous = texelFetch(uPrevious, cell, 0);
  float speed = texelFetch(uHeads, ivec2(0, cell.x), 0).x;
  vec2 screen = toScreen(vec2(cell) + 0.5, uOrigin, uCell);
  float rate = rateAt(screen);
  float tau = uTrail / max(speed, 0.5) / 2.2;
  float light = previous.x * exp(-uDt * rate / tau);
  float glyph = previous.y;
  float row = float(cell.y) + 0.5;
  for (int k = 1; k <= ${w}; k++) {
    vec4 head = texelFetch(uHeads, ivec2(k, cell.x), 0);
    if (head.z > 0.5 && head.x < row && row <= head.y) {
      light = max(light, clamp(head.z - 0.5, 0.0, 1.0));
      glyph = floor(hash(vec3(vec2(cell), head.w * 97.0 + row)) * uGlyphCount);
    }
  }
  float churn = uShuffle * 2.5 * rate * uDt;
  if (hash(vec3(vec2(cell), uSeed)) < churn) glyph = floor(hash(vec3(vec2(cell) + 17.0, uSeed * 1.7)) * uGlyphCount);
  fragColor = vec4(light, glyph, 0.0, 1.0);
}
`,ae=`
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,oe=`
precision highp float;
uniform sampler2D uAtlas;
uniform vec2 uAtlasGrid;
uniform vec2 uResolution;
uniform float uMirror;
uniform float uGlyphScale;
uniform vec3 uLabTrail;
uniform vec3 uLabHead;
uniform float uInk;
uniform sampler2D uState0;
uniform sampler2D uHeads0;
uniform vec2 uOrigin0;
uniform vec4 uGrid0;
uniform sampler2D uState1;
uniform sampler2D uHeads1;
uniform vec2 uOrigin1;
uniform vec4 uGrid1;
uniform float uFar;
${F}
in vec2 vUv;
out vec4 fragColor;

vec3 labToLinear(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return max(vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  ), 0.0);
}

float hash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

vec4 layer(sampler2D state, sampler2D heads, vec2 origin, vec4 grid, float bias) {
  vec2 screen = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 g = toGrid(screen, origin, grid.xy);
  ivec2 cell = ivec2(floor(g));
  if (cell.x < 0 || cell.y < 0 || float(cell.x) >= grid.z || float(cell.y) >= grid.w) return vec4(0.0);
  vec4 data = texelFetch(state, cell, 0);
  float light = data.x;
  float glyph = data.y;
  float head = 0.0;
  for (int k = 1; k <= ${w}; k++) {
    vec4 h = texelFetch(heads, ivec2(k, cell.x), 0);
    if (h.z > 0.5 && floor(h.y) == float(cell.y)) {
      head = clamp(h.z - 0.5, 0.0, 1.0);
      glyph = floor(hash(vec3(vec2(cell), h.w * 31.0 + floor(h.y * 3.0))) * max(uAtlasGrid.x * uAtlasGrid.y, 1.0));
    }
  }
  if (light < 0.004 && head < 0.5) return vec4(0.0);
  vec2 f = fract(g);
  vec2 local = vec2(f.x - 0.5, f.y - 0.5);
  if (uMirror > 0.5) local.x = -local.x;
  vec2 span = vec2(grid.x / grid.y, 1.0) * 0.84 * uGlyphScale;
  vec2 texel = 0.5 + local * span;
  float inside = step(0.02, texel.x) * step(texel.x, 0.98) * step(0.02, texel.y) * step(texel.y, 0.98);
  float index = mod(glyph, uAtlasGrid.x * uAtlasGrid.y);
  vec2 slot = vec2(mod(index, uAtlasGrid.x), floor(index / uAtlasGrid.x));
  vec2 uv = (slot + texel) / uAtlasGrid;
  vec2 scale = span / uAtlasGrid;
  float coverage = textureGrad(uAtlas, uv, dFdx(g) * scale * exp2(bias), dFdy(g) * scale * exp2(bias)).r * inside;
  float flicker = 0.82 + 0.18 * hash(vec3(vec2(cell), glyph));
  float fresh = smoothstep(0.55, 1.0, light);
  vec3 trailTone = labToLinear(mix(vec3(uLabTrail.x * 0.55, uLabTrail.yz * 0.9), uLabTrail, smoothstep(0.0, 0.6, light)));
  vec3 tone = mix(trailTone, labToLinear(uLabHead), fresh * 0.35);
  vec3 headTone = labToLinear(uLabHead);
  vec3 inkHead = labToLinear(vec3(uLabTrail.x * 0.55, uLabTrail.yz * 1.1));
  headTone = mix(headTone, inkHead, uInk);
  float fade = light * (0.35 + 0.65 * light);
  float energy = coverage * (fade * flicker * 0.8 + head * 0.9);
  vec3 color = mix(tone, headTone, head) * energy;
  return vec4(color, energy);
}

void main() {
  vec4 near = layer(uState0, uHeads0, uOrigin0, uGrid0, 0.0);
  vec4 far = uFar > 0.0 ? layer(uState1, uHeads1, uOrigin1, uGrid1, 1.2) * uFar : vec4(0.0);
  fragColor = near + far;
}
`,se=`
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 a = texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  vec4 b = texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  vec4 c = texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  vec4 d = texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = (a + b + c + d) * 0.125 + texture(uSource, vUv) * 0.5;
}
`,ce=`
precision highp float;
uniform sampler2D uSource;
uniform sampler2D uBase;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 sum = texture(uSource, vUv) * 4.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, -1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, 1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = texture(uBase, vUv) + sum / 16.0;
}
`,le=`
precision highp float;
uniform sampler2D uLines;
uniform sampler2D uBloom;
uniform vec3 uBackground;
uniform float uGlow;
uniform float uExposure;
uniform float uMode;
uniform float uGrain;
in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

void main() {
  vec4 lines = texture(uLines, vUv);
  vec4 bloom = texture(uBloom, vUv);
  vec3 color;
  if (uMode < 0.5) {
    vec3 light = (lines.rgb + bloom.rgb * uGlow) * uExposure;
    vec3 exposed = 1.0 - exp(-light);
    float peak = max(exposed.r, max(exposed.g, exposed.b));
    exposed = mix(exposed, vec3(peak), smoothstep(0.75, 1.0, peak) * 0.35);
    color = uBackground + (1.0 - uBackground) * exposed;
  } else {
    float energy = lines.a + bloom.a * uGlow * 0.2;
    vec3 hue = (lines.rgb + bloom.rgb * uGlow * 0.2) / max(energy, 1e-4);
    float cover = clamp(1.0 - exp(-energy * uExposure * 1.4), 0.0, 0.95);
    color = mix(uBackground, clamp(hue * 0.85, 0.0, 1.0), cover);
  }
  float grain = hash(gl_FragCoord.xy + uGrain * 311.0) - 0.5;
  fragColor = vec4(encode(color) + grain * (1.2 / 255.0), 1.0);
}
`,ue=(e,t,n)=>{let r=Array.from(new Set(Array.from(e.replace(/\s/g,``)))).slice(0,512);r.length||r.push(`0`,`1`);let i=Math.ceil(r.length/E),s=document.createElement(`canvas`);s.width=E*n,s.height=i*n;let c=s.getContext(`2d`);c&&(c.fillStyle=`#000000`,c.fillRect(0,0,s.width,s.height),c.fillStyle=`#ffffff`,c.textAlign=`center`,c.textBaseline=`middle`,c.font=`500 ${Math.round(n*.78)}px ${t}`,r.forEach((e,t)=>{let r=t%E*n+n/2,i=Math.floor(t/E)*n+n/2+n*.04;c.fillText(e,r,i)}));let l=new v(s);return l.minFilter=o,l.magFilter=a,l.generateMipmaps=!0,l.colorSpace=``,l.flipY=!1,l.anisotropy=4,l.needsUpdate=!0,{texture:l,count:r.length,rows:i}},I=(e,t)=>{let n=document.createElement(`canvas`);n.setAttribute(`aria-hidden`,`true`),n.style.position=`absolute`,n.style.inset=`0`,n.style.width=`100%`,n.style.height=`100%`,n.style.display=`block`,n.style.pointerEvents=`none`,e.prepend(n);let r;try{r=new h({canvas:n,alpha:!1,antialias:!1,powerPreference:`high-performance`})}catch{return n.remove(),null}if(!r.capabilities.isWebGL2)return r.dispose(),n.remove(),null;r.autoClear=!1;let o=r.extensions.has(`EXT_color_buffer_float`),v=o||r.extensions.has(`EXT_color_buffer_half_float`)?b:c,S=o?te:b,C=new _(-1,1,1,-1,0,1),D=new g(2,2),O={x:0,y:0,vx:0,vy:0,goalX:0,goalY:0,amount:0,inside:!1,placed:!1},A={uHover:{value:new l(0,0,0,100)},uSlow:{value:.9}},P={uCenter:{value:new i},uAngle:{value:0}},F=(e,t)=>new p({glslVersion:x,uniforms:t,vertexShader:ae,fragmentShader:e,depthTest:!1,depthWrite:!1,blending:0}),I=F(ie,{...A,...P,uPrevious:{value:null},uHeads:{value:null},uOrigin:{value:new i},uCell:{value:new i(1,1)},uDt:{value:0},uTrail:{value:16},uShuffle:{value:.4},uGlyphCount:{value:1},uSeed:{value:0}}),L=F(oe,{...P,uAtlas:{value:null},uAtlasGrid:{value:new i(E,1)},uResolution:{value:new i(1,1)},uMirror:{value:0},uGlyphScale:{value:1},uLabTrail:{value:new y},uLabHead:{value:new y},uInk:{value:0},uState0:{value:null},uHeads0:{value:null},uOrigin0:{value:new i},uGrid0:{value:new l(1,1,1,1)},uState1:{value:null},uHeads1:{value:null},uOrigin1:{value:new i},uGrid1:{value:new l(1,1,1,1)},uFar:{value:0}}),R=F(se,{uSource:{value:null},uTexel:{value:new i}}),z=F(ce,{uSource:{value:null},uBase:{value:null},uTexel:{value:new i}}),B=F(le,{uLines:{value:null},uBloom:{value:null},uBackground:{value:new y},uGlow:{value:.5},uExposure:{value:1.4},uMode:{value:0},uGrain:{value:0}}),de=new u(D,B);de.frustumCulled=!1;let fe=new m;fe.add(de);let V=(e,t,n,r)=>new s(Math.max(1,e),Math.max(1,t),{type:n,format:ee,minFilter:r,magFilter:r,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1}),H=null,U=[],W=[],G=[],pe=``,K=null,me=``,he=!1,q=0,ge=0,_e=!0,J=1,Y=1,X=1,ve=0,ye=97,Z=()=>(ye=ye*16807%2147483647,ye/2147483647),be=()=>{H?.dispose(),U.forEach(e=>e.dispose()),W.forEach(e=>e.dispose()),H=null,U=[],W=[]},xe=()=>{G.forEach(e=>{e.targets.forEach(e=>e.dispose()),e.headTexture.dispose()}),G=[]},Q=(e,t)=>{de.material=e,r.setRenderTarget(t),r.render(fe,C)},Se=()=>{let e=t.current,n=String(e.glyphs??``)||ne,r=String(e.fontFamily??``)||re,i=Math.round(k(k(e.glyphSize,6,64)*X*1.25,16,128)),a=`${n}|${r}|${i}`;a===me&&K||(me=a,K?.texture.dispose(),K=ue(n,r,i),L.uniforms.uAtlas.value=K.texture,L.uniforms.uAtlasGrid.value.set(E,K.rows),I.uniforms.uGlyphCount.value=K.count)},Ce=(e,n)=>{let r=e-O.x,i=n-O.y,a=A.uHover.value.w,o=k(t.current.slowStrength,0,1)*O.amount*Math.exp(-(r*r+i*i)/(a*a));return Math.max(1-o,.02)},we=(e,n)=>e*(1/(k(t.current.density,.02,1)*(n===0?1:.3))-1)*(.4+1.2*Z()),Te=(e,n,i,a)=>{let o=t.current,s=J*X,c=Y*X,l=k(o.glyphSize,6,64)*X*e,u=l*.68*k(o.spacing,.6,3),p=l*1.05,m=k(o.angle,-80,80)*Math.PI/180,h=s*Math.abs(Math.cos(m))+c*Math.abs(Math.sin(m)),g=s*Math.abs(Math.sin(m))+c*Math.abs(Math.cos(m)),_=Math.ceil(h/u)+2,v=Math.ceil(g/p)+2,y=s/2-_*u/2,b=c/2-v*p/2,x=new Float32Array(_),C=new Float32Array(_*4*4),E=new Float32Array(_*w),ne=k(o.variance,0,1),re=Math.max(9*k(o.speed,0,5)*n,.5);for(let e=0;e<_;e++){x[e]=Math.max(.3,1+(Z()*2-1)*ne*.75);let t=re*x[e],n=(v+3)/t;for(let r=0;r<w;r++){let i=(e*4+r+1)*4;if(r===T){C.set([0,0,0,Z()],i),E[e*w+r]=1/0;continue}let a=we(n,r),o=Z()*(n+a);if(o<n){let e=-2+o*t;C.set([e,e,1.5,Z()],i)}else C.set([0,0,0,Z()],i),E[e*w+r]=o-n}}let D=new f(C,4,_,ee,te);D.minFilter=d,D.magFilter=d,D.needsUpdate=!0;let O=[0,1].map(()=>V(_,v,S,d));for(let e of O)r.setRenderTarget(e),r.setClearColor(0,0),r.clear();return{cellW:u,cellH:p,cols:_,rows:v,originX:y,originY:b,speedScale:n,gain:i,bias:a,columnSpeed:x,heads:C,respawn:E,headTexture:D,targets:O,index:0}},Ee=(e,t,n)=>{let r=P.uAngle.value,i=J*X/2,a=Y*X/2,o=e.originX+t*e.cellW-i,s=e.originY+n*e.cellH-a,c=Math.cos(r),l=Math.sin(r);return[c*o-l*s+i,l*o+c*s+a]},De=(e,n)=>{let r=t.current,i=9*k(r.speed,0,5)*e.speedScale;for(let t=0;t<e.cols;t++){let r=i*e.columnSpeed[t];e.heads[t*4*4]=r;for(let i=0;i<w;i++){let a=(t*4+i+1)*4,o=t*w+i;if(e.heads[a+2]>.5){e.heads[a+2]<1.5&&(e.heads[a+2]=Math.min(1.5,e.heads[a+2]+n/.3));let s=e.heads[a+1],[c,l]=Ee(e,t+.5,s);e.heads[a]=s,e.heads[a+1]=s+r*Ce(c,l)*n,e.heads[a+1]>e.rows+1&&(e.heads[a+2]=0,e.respawn[o]=i===T?1/0:we((e.rows+3)/Math.max(r,.5),i))}else if(e.respawn[o]!==1/0&&(e.respawn[o]-=n,e.respawn[o]<=0)){let t=i===T?e.heads[a+1]:-2-Z()*2;e.heads.set([t,t,i===T?.52:1.5,Z()],a)}}}e.headTexture.needsUpdate=!0},Oe=(e,n)=>{let r=t.current,i=I.uniforms;i.uPrevious.value=e.targets[e.index].texture,i.uHeads.value=e.headTexture,i.uOrigin.value.set(e.originX,e.originY),i.uCell.value.set(e.cellW,e.cellH),i.uDt.value=n,i.uTrail.value=k(r.trail,2,80),i.uShuffle.value=k(r.shuffle,0,1),i.uSeed.value=Z()*1e3,Q(I,e.targets[1-e.index]),e.index=1-e.index},ke=()=>{let e=t.current,n=k(e.depth,0,1),r=[J,Y,X,e.glyphSize,e.spacing,e.angle,n>0,e.variance].join(`|`);if(r===pe&&G.length)return;pe=r,xe(),P.uAngle.value=k(e.angle,-80,80)*Math.PI/180,P.uCenter.value.set(J*X/2,Y*X/2),G=[Te(1,1,1,0)],n>0&&G.push(Te(.62,.58,1,1.2));let i=1/30;for(let e=0;e<3;e+=i)for(let e of G)De(e,i),Oe(e,i)},Ae=()=>{let e=t.current,n=J*X,r=Y*X,i=j(e.backgroundColor,[.04,.04,.04]),a=.2126*i[0]+.7152*i[1]+.0722*i[2],o=e.mode===`ink`||e.mode===`auto`&&a>.5,s=N(j(e.colors[0],[.6,.48,1])),c=N(j(e.colors[1],[1,.84,.96])),l=L.uniforms;l.uResolution.value.set(n,r),l.uMirror.value=+!!e.mirror,l.uLabTrail.value.set(s[0],s[1],s[2]),l.uLabHead.value.set(c[0],c[1],c[2]),l.uInk.value=+!!o;let u=G[0];u&&(l.uState0.value=u.targets[u.index].texture,l.uHeads0.value=u.headTexture,l.uOrigin0.value.set(u.originX,u.originY),l.uGrid0.value.set(u.cellW,u.cellH,u.cols,u.rows));let d=G[1];l.uFar.value=d?.32*k(e.depth,0,1):0,d&&(l.uState1.value=d.targets[d.index].texture,l.uHeads1.value=d.headTexture,l.uOrigin1.value.set(d.originX,d.originY),l.uGrid1.value.set(d.cellW,d.cellH,d.cols,d.rows)),A.uSlow.value=k(e.slowStrength,0,1),A.uHover.value.set(O.x,O.y,O.amount,k(e.slowRadius,20,800)*X);let f=B.uniforms;f.uBackground.value.set(M(i[0]),M(i[1]),M(i[2])),f.uGlow.value=k(e.glow,0,3),f.uExposure.value=(o?5:1.25)*k(e.intensity,0,4),f.uMode.value=+!!o,f.uGrain.value=ve},je=()=>{if(!H||!U.length)return;Se(),ke(),Ae(),Q(L,H);let e=H;for(let t of U)R.uniforms.uSource.value=e.texture,R.uniforms.uTexel.value.set(1/e.width,1/e.height),Q(R,t),e=t;let t=U[U.length-1];for(let e=U.length-2;e>=0;e--)z.uniforms.uSource.value=t.texture,z.uniforms.uBase.value=U[e].texture,z.uniforms.uTexel.value.set(1/t.width,1/t.height),Q(z,W[e]),t=W[e];B.uniforms.uLines.value=H.texture,B.uniforms.uBloom.value=t.texture,Q(B,null)},Me=e=>{let n=t.current,r=O.inside&&n.interactive&&n.bulletTime&&!n.reduced?1:0;if(O.amount+=(r-O.amount)*(1-Math.exp(-e/.35)),O.vx+=(81*(O.goalX-O.x)-18*O.vx)*e,O.vy+=(81*(O.goalY-O.y)-18*O.vy)*e,O.x+=O.vx*e,O.y+=O.vy*e,!(n.paused||n.reduced)){Se(),ke(),Ae();for(let t of G)De(t,e),Oe(t,e);ve=(ve+.618034)%1}},Ne=e=>{if(q=0,he)return;let n=Math.min(.05,Math.max(0,(e-ge)/1e3));ge=e,Me(n),je();let r=t.current,i=!r.paused&&!r.reduced,a=Math.abs(O.amount-(O.inside&&r.bulletTime?1:0))>.002;_e&&!document.hidden&&(i||a)&&(q=requestAnimationFrame(Ne))};function $(){he||q||!_e||(ge=performance.now(),q=requestAnimationFrame(Ne))}let Pe=()=>{let n=e.getBoundingClientRect();J=Math.max(1,n.width),Y=Math.max(1,n.height),X=Math.min(window.devicePixelRatio||1,2)*k(t.current.quality,.25,1),r.setPixelRatio(X),r.setSize(J,Y,!1);let i=Math.round(J*X),o=Math.round(Y*X);be(),H=V(i,o,v,a);let s=k(Math.floor(Math.log2(Math.min(i,o)/8)),3,7);for(let e=1;e<=s;e++)U.push(V(i>>e,o>>e,v,a)),W.push(V(i>>e,o>>e,v,a));je(),$()},Fe=t=>{let n=e.getBoundingClientRect();return[(t.clientX-n.left)*X,(t.clientY-n.top)*X]},Ie=e=>{if(e.pointerType===`touch`||!t.current.interactive)return;let[n,r]=Fe(e);O.goalX=n,O.goalY=r,O.placed||=(O.x=n,O.y=r,!0),O.inside||(O.inside=!0,$())},Le=()=>{O.inside=!1,O.placed=O.amount>.01,$()},Re=(e,t,n)=>{let r=P.uAngle.value,i=J*X/2,a=Y*X/2,o=t-i,s=n-a,c=Math.cos(r),l=Math.sin(r);return[(c*o+l*s+i-e.originX)/e.cellW,(-l*o+c*s+a-e.originY)/e.cellH]},ze=(e,n)=>{let r=t.current;if(r.reduced||r.paused)return;let i=k(r.burstSize,0,3);i<=0||(G.forEach((t,r)=>{let[a,o]=Re(t,e,n),s=Math.max(1,Math.round((r===0?6:8)*i)),c=Math.floor(a);for(let e=c-s;e<=c+s;e++){if(e<0||e>=t.cols)continue;let n=Math.abs(e-c)/s;if(Z()>Math.exp(-n*n*2.2)*(r===0?.95:.6))continue;let i=(e*4+T+1)*4,a=e*w+T;if(t.heads[i+2]>.5)continue;let l=o-.5-Z()*1.5;t.heads.set([l,l,0,Z()],i),t.respawn[a]=n*s*.045+Z()*.06}}),$())},Be=e=>{let n=t.current;if(e.button!==0||!n.interactive||!n.clickBurst)return;let[r,i]=Fe(e);ze(r,i)};e.addEventListener(`pointermove`,Ie),e.addEventListener(`pointerleave`,Le),e.addEventListener(`pointercancel`,Le),e.addEventListener(`pointerdown`,Be);let Ve=new ResizeObserver(Pe);Ve.observe(e);let He=new IntersectionObserver(e=>{_e=e.some(e=>e.isIntersecting),_e&&$()},{rootMargin:`80px`});He.observe(e);let Ue=()=>{document.hidden||$()};document.addEventListener(`visibilitychange`,Ue);let We=e=>e.preventDefault();return n.addEventListener(`webglcontextlost`,We),Pe(),{sync:()=>{let e=Math.min(window.devicePixelRatio||1,2)*k(t.current.quality,.25,1);Math.abs(e-X)>.001?Pe():je(),$()},destroy:()=>{he=!0,cancelAnimationFrame(q),e.removeEventListener(`pointermove`,Ie),e.removeEventListener(`pointerleave`,Le),e.removeEventListener(`pointercancel`,Le),e.removeEventListener(`pointerdown`,Be),document.removeEventListener(`visibilitychange`,Ue),n.removeEventListener(`webglcontextlost`,We),Ve.disconnect(),He.disconnect(),be(),xe(),K?.texture.dispose(),D.dispose(),[I,L,R,z,B].forEach(e=>e.dispose()),r.dispose(),r.forceContextLoss(),n.remove()},burst:(e,t)=>ze(k(e,0,1)*J*X,k(t,0,1)*Y*X)}},L=(0,S.forwardRef)(function({colors:e=[`#9D7BFF`,`#FFD6F5`],backgroundColor:t=`#0A0A0A`,mode:n=`auto`,glyphs:i=ne,fontFamily:a=re,glyphSize:o=18,spacing:s=1,density:c=.45,trail:l=16,speed:u=1,variance:d=.5,angle:f=0,shuffle:p=.35,mirror:m=!1,depth:h=.6,glow:g=.22,intensity:_=1,interactive:v=!0,bulletTime:ee=!0,slowRadius:te=170,slowStrength:y=.6,clickBurst:b=!0,burstSize:x=1,paused:w=!1,quality:T=1,className:E,style:k,children:A},j){let M=(0,S.useRef)(null),N=(0,S.useRef)(null),P=(0,S.useSyncExternalStore)(D,O,()=>!1),F=(0,S.useRef)({colors:e,backgroundColor:t,mode:n,glyphs:i,fontFamily:a,glyphSize:o,spacing:s,density:c,trail:l,speed:u,variance:d,angle:f,shuffle:p,mirror:m,depth:h,glow:g,intensity:_,interactive:v,bulletTime:ee,slowRadius:te,slowStrength:y,clickBurst:b,burstSize:x,paused:w,quality:T,reduced:P});return(0,S.useEffect)(()=>{F.current={colors:e,backgroundColor:t,mode:n,glyphs:i,fontFamily:a,glyphSize:o,spacing:s,density:c,trail:l,speed:u,variance:d,angle:f,shuffle:p,mirror:m,depth:h,glow:g,intensity:_,interactive:v,bulletTime:ee,slowRadius:te,slowStrength:y,clickBurst:b,burstSize:x,paused:w,quality:T,reduced:P},N.current?.sync()}),(0,S.useEffect)(()=>{let e=M.current;if(!e)return;let t=I(e,F);return N.current=t,()=>{t?.destroy(),N.current=null}},[]),(0,S.useImperativeHandle)(j,()=>({burst:(e=.5,t=.3)=>N.current?.burst(e,t)}),[]),(0,C.jsx)(`div`,{ref:M,className:r(`relative isolate h-full min-h-[240px] w-full overflow-hidden`,E),style:{backgroundColor:t,...k},children:A&&(0,C.jsx)(`div`,{className:`relative z-10 h-full w-full`,children:A})})});L.displayName=`TerminalRain`;export{L as TerminalRain,L as default};