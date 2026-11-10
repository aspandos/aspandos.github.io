import{a as e,n as t,t as n}from"./jsx-runtime-Wy9s6hX0.js";import{f as r}from"./index-fLAkp0-T.js";import{Ct as i,F as a,I as o,Ot as s,St as c,Tt as l,W as u,X as d,at as f,c as p,ht as m,l as h,mt as g,n as ee,rt as te,tt as ne,u as _,ut as re,wt as v,x as y,y as b}from"./three.module-DQCqqdsN.js";var x=e(t(),1),S=n(),C=4,w=72,T=42,E=16,D=1/60,O=`·+*`,ie=` .'\`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$`,ae=`ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`,k=e=>{let t=window.matchMedia(`(prefers-reduced-motion: reduce)`);return t.addEventListener(`change`,e),()=>t.removeEventListener(`change`,e)},A=()=>typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,j=(e,t,n)=>Math.min(n,Math.max(t,e)),M=null,N=(e,t)=>{if(M||=document.createElement(`canvas`).getContext(`2d`),!M)return t;M.fillStyle=`#010203`,M.fillStyle=e;let n=String(M.fillStyle);if(n===`#010203`&&e.trim().toLowerCase()!==`#010203`)return t;if(n.startsWith(`#`)){let e=n.slice(1);return[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255]}let r=n.match(/[\d.]+/g);return!r||r.length<3?t:[Number(r[0])/255,Number(r[1])/255,Number(r[2])/255]},P=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,oe=([e,t,n])=>{let r=P(e),i=P(t),a=P(n),o=Math.cbrt(.4122214708*r+.5363325363*i+.0514459929*a),s=Math.cbrt(.2119034982*r+.6806995451*i+.1073969566*a),c=Math.cbrt(.0883024619*r+.2817188376*i+.6299787005*a);return[.2104542553*o+.793617785*s-.0040720468*c,1.9779984951*o-2.428592205*s+.4505937099*c,.0259040371*o+.7827717662*s-.808675766*c]},F=`
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  return 0.66 * noise(p) + 0.34 * noise(p * 2.07 + 13.1);
}
`,se=`
precision highp float;
uniform sampler2D uState;
uniform vec2 uGrid;
uniform float uTime;
uniform float uDt;
uniform float uRise;
uniform float uWind;
uniform float uTurb;
uniform float uCool;
uniform float uFuel;
uniform float uSmokeRate;
uniform vec4 uSnuff;
uniform vec4 uStokes[${C}];
${F}
out vec4 fragColor;

vec2 curl(vec2 p, float t) {
  float e = 0.5;
  vec2 drift = vec2(0.0, -t * 0.55);
  float n = fbm(p + drift + vec2(0.0, e));
  float s = fbm(p + drift - vec2(0.0, e));
  float r = fbm(p + drift + vec2(e, 0.0));
  float l = fbm(p + drift - vec2(e, 0.0));
  return vec2(n - s, l - r) / (2.0 * e);
}

float stokeAt(float x) {
  float total = 0.0;
  for (int k = 0; k < ${C}; k++) {
    vec4 s = uStokes[k];
    if (s.z <= 0.0) continue;
    float age = uTime - s.y;
    if (age < 0.0 || age > 4.0) continue;
    float g = (x - s.x) / s.w;
    total += s.z * exp(-g * g) * smoothstep(0.0, 0.12, age) * exp(-age / 0.9);
  }
  return total;
}

void main() {
  vec2 p = gl_FragCoord.xy;
  vec4 here = texture(uState, p / uGrid);
  float stoke = stokeAt(p.x);
  float warm = clamp(here.r, 0.0, 1.2);
  float lift = min(stoke, 1.5);
  vec2 swirl = curl(p * 0.075, uTime) * uTurb * (0.35 + 0.65 * warm) * (1.0 + 0.7 * lift);
  float gust = 0.75 + 0.5 * noise(vec2(uTime * 0.18, p.y * 0.015));
  vec2 velocity = vec2(uWind * gust, uRise * (0.55 + 0.6 * warm) * (1.0 + 1.1 * lift)) + swirl;
  vec4 previous = texture(uState, (p - velocity * uDt) / uGrid);
  float heat = previous.r;
  float smoke = previous.g;
  float patches = fbm(vec2(p.x * 0.075, p.y * 0.075 - uTime * uRise * 0.075));
  float cool = uCool * mix(0.4, 2.3, smoothstep(0.32, 0.78, patches)) / (1.0 + 0.45 * lift);
  float cooled = heat * (1.0 - exp(-cool * uDt));
  heat -= cooled;
  smoke += cooled * uSmokeRate;
  float d = length(p - uSnuff.xy) / max(uSnuff.z, 1.0);
  float douse = uSnuff.w * exp(-d * d);
  float doused = heat * (1.0 - exp(-douse * 9.0 * uDt));
  heat -= doused;
  smoke += doused * 0.85;
  smoke = min(smoke * exp(-uDt * 0.55), 1.0);
  if (p.y < 2.0) {
    float bed = 0.52 + 0.62 * fbm(vec2(p.x * 0.05 + uTime * 0.22, uTime * 0.4));
    float grain = hash(vec2(p.x, floor(uTime * 30.0)));
    heat = min(uFuel * bed * (0.82 + 0.36 * grain) * (1.0 + 0.25 * stoke), 1.0);
    smoke = 0.0;
  }
  fragColor = vec4(heat, smoke, 0.0, 1.0);
}
`,ce=`
in vec4 aSpark;
uniform vec2 uGrid;
uniform float uTime;
uniform float uRise;
uniform float uWind;
uniform float uAmount;
uniform vec4 uStokes[${C}];
${F}
out float vBright;

void main() {
  float kind = aSpark.x;
  float lag = aSpark.y * 0.07;
  float s1 = aSpark.z;
  float s2 = aSpark.w;
  vec2 position = vec2(-10.0);
  float bright = 0.0;
  if (kind < 0.5) {
    float period = 1.8 + 1.8 * s1;
    float phase = (uTime + s2 * 17.0 * period) / period;
    float cycle = floor(phase);
    float age = fract(phase) * period - lag;
    float alive = step(hash(vec2(s1 * 91.0, cycle)), uAmount * 0.8);
    float x0 = hash(vec2(cycle * 1.7, s2 * 53.0)) * uGrid.x;
    float lift = uRise * (1.1 + 0.9 * s2) * 1.5;
    float y = 1.5 + lift * (1.0 - exp(-max(age, 0.0) / 1.5));
    float x = x0 + uWind * age * 1.1 + sin(age * (2.0 + 3.0 * s2) + s1 * 6.2831853) * (0.6 + age);
    bright = alive * step(0.0, age) * (1.0 - age / period) * smoothstep(0.0, 0.08, age);
    position = vec2(x, y);
  } else {
    vec4 stoke = uStokes[int(kind) - 1];
    float age = uTime - stoke.y - lag;
    if (stoke.z > 0.0 && age > 0.0 && age < 2.6) {
      float angle = (s1 - 0.5) * 1.4;
      float lift = uRise * (1.4 + 1.9 * s2) * (0.7 + 0.3 * stoke.z) * 1.2;
      float travel = lift * (1.0 - exp(-age / 1.2));
      position = vec2(stoke.x + (s2 - 0.5) * stoke.w * 0.9 + sin(angle) * travel + uWind * age, 1.5 + cos(angle) * travel);
      bright = (1.0 - age / 2.6) * smoothstep(0.0, 0.05, age) * min(stoke.z, 1.5);
    }
  }
  vBright = bright * (1.0 - aSpark.y * 0.45);
  gl_PointSize = 1.0;
  gl_Position = vec4((floor(position) + 0.5) / uGrid * 2.0 - 1.0, 0.0, 1.0);
}
`,le=`
precision highp float;
in float vBright;
out vec4 fragColor;

void main() {
  fragColor = vec4(vBright, 0.0, 0.0, 1.0);
}
`,ue=`
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,de=`
precision highp float;
uniform sampler2D uState;
uniform sampler2D uSparks;
uniform sampler2D uAtlas;
uniform vec2 uAtlasGrid;
uniform vec2 uCell;
uniform float uCount;
uniform float uSparkGlyph;
uniform float uTime;
uniform float uFlicker;
uniform float uInk;
uniform vec3 uLabBody;
uniform vec3 uLabCore;
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

vec3 flame(float t) {
  vec3 deep = vec3(uLabBody.x * 0.38, uLabBody.yz * 0.8);
  vec3 white = mix(vec3(0.97, uLabCore.yz * 0.22), vec3(uLabCore.x * 0.75, uLabCore.yz * 1.1), uInk);
  vec3 lab = t < 0.45 ? mix(deep, uLabBody, smoothstep(0.0, 0.45, t))
    : t < 0.86 ? mix(uLabBody, uLabCore, smoothstep(0.45, 0.86, t))
    : mix(uLabCore, white, smoothstep(0.86, 1.0, t));
  return labToLinear(lab);
}

float glyphCoverage(float index, vec2 g) {
  vec2 f = fract(g) - 0.5;
  vec2 span = vec2(uCell.x / uCell.y, 1.0) * 0.86;
  vec2 texel = vec2(0.5 + f.x * span.x, 0.5 - f.y * span.y);
  float inside = step(0.01, texel.x) * step(texel.x, 0.99) * step(0.01, texel.y) * step(texel.y, 0.99);
  vec2 slot = vec2(mod(index, uAtlasGrid.x), floor(index / uAtlasGrid.x));
  vec2 uv = (slot + texel) / uAtlasGrid;
  vec2 scale = span / uAtlasGrid;
  return textureGrad(uAtlas, uv, dFdx(g) * scale, dFdy(g) * scale).r * inside;
}

void main() {
  vec2 g = gl_FragCoord.xy / uCell;
  ivec2 cell = ivec2(floor(g));
  vec4 state = texelFetch(uState, cell, 0);
  float spark = texelFetch(uSparks, cell, 0).r;
  float heat = max(state.r, 0.0);
  float smoke = max(state.g, 0.0) * (1.0 - smoothstep(0.04, 0.2, heat));
  float beat = floor(uTime * (3.0 + 21.0 * uFlicker));
  float jitter = (hash(vec3(vec2(cell), beat)) - 0.5) * (0.06 + 0.3 * uFlicker);
  float level = clamp(heat + jitter * step(0.04, heat), 0.0, 1.0);
  float haze = clamp(smoke * 0.6, 0.0, 0.42);
  vec3 color = vec3(0.0);
  float energy = 0.0;
  if (spark > 0.12) {
    float sparkIndex = uSparkGlyph + clamp(floor(spark * 3.0), 0.0, 2.0);
    float cover = glyphCoverage(sparkIndex, g);
    color = mix(labToLinear(vec3(min(uLabCore.x + 0.12, 0.98), uLabCore.yz * 0.6)), flame(0.7), uInk);
    energy = cover * min(spark, 1.4) * 1.25;
  } else if (level > 0.05) {
    float index = floor(pow(level, 0.85) * (uCount - 1.0) + 0.5);
    float cover = glyphCoverage(max(index, 1.0), g);
    color = flame(level);
    energy = cover * smoothstep(0.05, 0.12, level) * (0.1 + 1.1 * pow(level, 1.8));
  } else if (haze > 0.05) {
    float index = floor(haze * (uCount - 1.0) + 0.5);
    float cover = glyphCoverage(max(index, 1.0), g);
    color = labToLinear(vec3(mix(0.62, 0.45, uInk), uLabBody.yz * 0.16));
    energy = cover * haze * 0.6;
  }
  fragColor = vec4(color * energy, energy);
}
`,fe=`
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
`,pe=`
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
`,me=`
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
`,he=(e,t,n)=>{let r=Array.from(new Set(Array.from(e))).slice(0,180);r.length<2&&r.push(`.`,`#`);let i=document.createElement(`canvas`);i.width=n,i.height=n;let s=i.getContext(`2d`,{willReadFrequently:!0}),c=`500 ${Math.round(n*.8)}px ${t}`,l=e=>{if(!s)return 0;s.fillStyle=`#000000`,s.fillRect(0,0,n,n),s.fillStyle=`#ffffff`,s.textAlign=`center`,s.textBaseline=`middle`,s.font=c,s.fillText(e,n/2,n/2);let t=s.getImageData(0,0,n,n).data,r=0;for(let e=0;e<t.length;e+=4)r+=t[e];return r},u=r.map(e=>({character:e,ink:l(e)})).sort((e,t)=>e.ink-t.ink),d=[...u.map(e=>e.character),...Array.from(O)],f=Math.ceil(d.length/E),p=document.createElement(`canvas`);p.width=E*n,p.height=f*n;let m=p.getContext(`2d`);m&&(m.fillStyle=`#000000`,m.fillRect(0,0,p.width,p.height),m.fillStyle=`#ffffff`,m.textAlign=`center`,m.textBaseline=`middle`,m.font=c,d.forEach((e,t)=>{let r=t%E*n+n/2,i=Math.floor(t/E)*n+n/2+n*.04;m.fillText(e,r,i)}));let h=new _(p);return h.minFilter=o,h.magFilter=a,h.generateMipmaps=!0,h.colorSpace=``,h.flipY=!1,h.anisotropy=4,h.needsUpdate=!0,{texture:h,count:u.length,rows:f}},ge=()=>{let e=(()=>{let e=131;return()=>(e=e*16807%2147483647,e/2147483647)})(),t=[],n=(n,r)=>{for(let i=0;i<r;i++){let r=e(),i=e();t.push(n,0,r,i,n,1,r,i)}};n(0,w);for(let e=1;e<=C;e++)n(e,T);let r=new Float32Array(t),i=new h;return i.setAttribute(`aSpark`,new p(r,4)),i.setAttribute(`position`,new p(new Float32Array(r.length/4*3),3)),i},_e=(e,t)=>{let n=document.createElement(`canvas`);n.setAttribute(`aria-hidden`,`true`),n.style.position=`absolute`,n.style.inset=`0`,n.style.width=`100%`,n.style.height=`100%`,n.style.display=`block`,n.style.pointerEvents=`none`,e.prepend(n);let r;try{r=new ee({canvas:n,alpha:!1,antialias:!1,powerPreference:`high-performance`})}catch{return n.remove(),null}if(!r.capabilities.isWebGL2)return r.dispose(),n.remove(),null;r.autoClear=!1;let o=r.extensions.has(`EXT_color_buffer_float`)||r.extensions.has(`EXT_color_buffer_half_float`)?y:c,p=new ne(-1,1,1,-1,0,1),h=new te(2,2),_=Array.from({length:C},()=>new l(0,-100,0,1)),x={x:0,y:0,vx:0,vy:0,goalX:0,goalY:0,amount:0,inside:!1,placed:!1},S=(e,t)=>new m({glslVersion:b,uniforms:t,vertexShader:ue,fragmentShader:e,depthTest:!1,depthWrite:!1,blending:0}),w=S(se,{uState:{value:null},uGrid:{value:new i(1,1)},uTime:{value:0},uDt:{value:D},uRise:{value:20},uWind:{value:0},uTurb:{value:10},uCool:{value:1},uFuel:{value:1},uSmokeRate:{value:.3},uSnuff:{value:new l(-100,-100,10,0)},uStokes:{value:_}}),T=new m({glslVersion:b,uniforms:{uGrid:{value:new i(1,1)},uTime:{value:0},uRise:{value:20},uWind:{value:0},uAmount:{value:.5},uStokes:{value:_}},vertexShader:ce,fragmentShader:le,depthTest:!1,depthWrite:!1,transparent:!0,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendSrcAlpha:201,blendDstAlpha:201}),O=S(de,{uState:{value:null},uSparks:{value:null},uAtlas:{value:null},uAtlasGrid:{value:new i(E,1)},uCell:{value:new i(8,12)},uCount:{value:2},uSparkGlyph:{value:2},uTime:{value:0},uFlicker:{value:.5},uInk:{value:0},uLabBody:{value:new v},uLabCore:{value:new v}}),k=S(fe,{uSource:{value:null},uTexel:{value:new i}}),A=S(pe,{uSource:{value:null},uBase:{value:null},uTexel:{value:new i}}),M=S(me,{uLines:{value:null},uBloom:{value:null},uBackground:{value:new v},uGlow:{value:.35},uExposure:{value:1.3},uMode:{value:0},uGrain:{value:0}}),F=new u(h,M);F.frustumCulled=!1;let _e=new g;_e.add(F);let I=new f(ge(),T);I.frustumCulled=!1;let ve=new g;ve.add(I);let L=(e,t,n)=>new s(Math.max(1,e),Math.max(1,t),{type:o,format:re,minFilter:n,magFilter:n,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1}),R=null,z=[],B=[],V=null,ye=``,H=null,be=``,xe=!1,U=0,Se=0,W=!0,G=30,K=0,q=1,J=1,Y=1,Ce=0,we=0,Te=()=>{R?.dispose(),z.forEach(e=>e.dispose()),B.forEach(e=>e.dispose()),R=null,z=[],B=[]},Ee=()=>{V?.targets.forEach(e=>e.dispose()),V?.sparks.dispose(),V=null},X=(e,t)=>{F.material=e,r.setRenderTarget(t),r.render(_e,p)},De=()=>{let e=t.current,n=String(e.charset??``)||ie,r=String(e.fontFamily??``)||ae,i=Math.round(j(j(e.glyphSize,5,48)*Y*1.25,12,96)),a=`${n}|${r}|${i}`;a===be&&H||(be=a,H?.texture.dispose(),H=he(n,r,i),O.uniforms.uAtlas.value=H.texture,O.uniforms.uAtlasGrid.value.set(E,H.rows),O.uniforms.uCount.value=H.count,O.uniforms.uSparkGlyph.value=H.count)},Oe=()=>{let e=t.current,n=V?V.rows:1,r=j(e.height,.1,1.2)*n,i=r/1.15*j(e.speed,0,4);return{rise:i,cool:2.6*i/Math.max(r,1),wind:j(e.wind,-1,1)*i*.55,turbulence:j(e.turbulence,0,2)*i*.9}},ke=e=>{if(!V)return;let n=t.current,r=Oe(),i=w.uniforms,a=1+j(n.pulse,0,1)*.35*Math.sin(G*.9)*Math.sin(G*.37+1.3);i.uGrid.value.set(V.cols,V.rows),i.uTime.value=G,i.uDt.value=e,i.uRise.value=r.rise,i.uWind.value=r.wind,i.uTurb.value=r.turbulence,i.uCool.value=r.cool,i.uFuel.value=j(n.fuel,0,2)*a,i.uSmokeRate.value=j(n.smoke,0,1)*.22,i.uSnuff.value.set(x.x,x.y,j(n.snuffRadius,10,400)/V.cellH,x.amount*j(n.snuffStrength,0,1)),i.uState.value=V.targets[V.index].texture,X(w,V.targets[1-V.index]),V.index=1-V.index},Ae=()=>{let e=t.current,n=j(e.glyphSize,5,48)*Y,i=n*1.02,o=n*.62*j(e.spacing,.6,3),s=q*Y,c=J*Y,l=Math.ceil(s/o),u=Math.ceil(c/i),f=[l,u,o.toFixed(3),i.toFixed(3)].join(`|`);if(f===ye&&V)return;ye=f,Ee();let p=[0,1].map(()=>L(l,u,a));for(let e of p)r.setRenderTarget(e),r.setClearColor(0,0),r.clear();V={cols:l,rows:u,cellW:o,cellH:i,targets:p,sparks:L(l,u,d),index:0};for(let e=0;e<3;e+=D)G+=D,ke(D)},je=()=>{if(!V)return;let e=t.current,n=Oe(),i=T.uniforms;i.uGrid.value.set(V.cols,V.rows),i.uTime.value=G,i.uRise.value=n.rise,i.uWind.value=n.wind,i.uAmount.value=e.reduced?0:j(e.sparks,0,1),r.setRenderTarget(V.sparks),r.setClearColor(0,0),r.clear(),r.render(ve,p)},Me=()=>{let e=t.current;if(!V)return;let n=N(e.backgroundColor,[.04,.04,.04]),r=.2126*n[0]+.7152*n[1]+.0722*n[2],i=e.mode===`ink`||e.mode===`auto`&&r>.5,a=oe(N(e.colors[0],[.48,.24,1])),o=oe(N(e.colors[1],[1,.5,.85])),s=O.uniforms;s.uState.value=V.targets[V.index].texture,s.uSparks.value=V.sparks.texture,s.uCell.value.set(V.cellW,V.cellH),s.uTime.value=G,s.uFlicker.value=e.reduced?0:j(e.flicker,0,1),s.uInk.value=+!!i,s.uLabBody.value.set(a[0],a[1],a[2]),s.uLabCore.value.set(o[0],o[1],o[2]);let c=M.uniforms;c.uBackground.value.set(P(n[0]),P(n[1]),P(n[2])),c.uGlow.value=j(e.glow,0,3),c.uExposure.value=(i?5:1.05)*j(e.intensity,0,4),c.uMode.value=+!!i,c.uGrain.value=Ce},Ne=()=>{if(!R||!z.length)return;De(),Ae(),je(),Me(),X(O,R);let e=R;for(let t of z)k.uniforms.uSource.value=e.texture,k.uniforms.uTexel.value.set(1/e.width,1/e.height),X(k,t),e=t;let t=z[z.length-1];for(let e=z.length-2;e>=0;e--)A.uniforms.uSource.value=t.texture,A.uniforms.uBase.value=z[e].texture,A.uniforms.uTexel.value.set(1/t.width,1/t.height),X(A,B[e]),t=B[e];M.uniforms.uLines.value=R.texture,M.uniforms.uBloom.value=t.texture,X(M,null)},Pe=e=>{let n=t.current,r=x.inside&&n.interactive&&n.snuff&&!n.reduced?1:0;if(x.amount+=(r-x.amount)*(1-Math.exp(-e/.3)),x.vx+=(100*(x.goalX-x.x)-20*x.vx)*e,x.vy+=(100*(x.goalY-x.y)-20*x.vy)*e,x.x+=x.vx*e,x.y+=x.vy*e,!(n.paused||n.reduced)){for(De(),Ae(),K=Math.min(K+e,D*4);K>=D;)K-=D,G+=D,ke(D);Ce=(Ce+.618034)%1}},Fe=e=>{if(U=0,xe)return;let n=Math.min(.05,Math.max(0,(e-Se)/1e3));Se=e,Pe(n),Ne();let r=t.current,i=!r.paused&&!r.reduced;W&&!document.hidden&&i&&(U=requestAnimationFrame(Fe))};function Z(){xe||U||!W||(Se=performance.now(),U=requestAnimationFrame(Fe))}let Q=()=>{let n=e.getBoundingClientRect();q=Math.max(1,n.width),J=Math.max(1,n.height),Y=Math.min(window.devicePixelRatio||1,2)*j(t.current.quality,.25,1),r.setPixelRatio(Y),r.setSize(q,J,!1);let i=Math.round(q*Y),o=Math.round(J*Y);Te(),R=L(i,o,a);let s=j(Math.floor(Math.log2(Math.min(i,o)/8)),3,7);for(let e=1;e<=s;e++)z.push(L(i>>e,o>>e,a)),B.push(L(i>>e,o>>e,a));Ne(),Z()},Ie=t=>{let n=e.getBoundingClientRect(),r=V?V.cellW:1,i=V?V.cellH:1;return[(t.clientX-n.left)*Y/r,(n.height-(t.clientY-n.top))*Y/i]},Le=e=>{if(e.pointerType===`touch`||!t.current.interactive)return;let[n,r]=Ie(e);x.goalX=n,x.goalY=r,x.placed||=(x.x=n,x.y=r,!0),x.inside||(x.inside=!0,Z())},$=()=>{x.inside=!1,x.placed=!1,Z()},Re=e=>{let n=t.current;n.reduced||n.paused||!V||(we=(we+1)%C,_[we].set(e,G,j(n.stokeStrength,0,3),V.cols*.085),Z())},ze=e=>{let n=t.current;if(e.button!==0||!n.interactive||!n.clickStoke)return;let[r]=Ie(e);Re(r)};e.addEventListener(`pointermove`,Le),e.addEventListener(`pointerleave`,$),e.addEventListener(`pointercancel`,$),e.addEventListener(`pointerdown`,ze);let Be=new ResizeObserver(Q);Be.observe(e);let Ve=new IntersectionObserver(e=>{W=e.some(e=>e.isIntersecting),W&&Z()},{rootMargin:`80px`});Ve.observe(e);let He=()=>{document.hidden||Z()};document.addEventListener(`visibilitychange`,He);let Ue=e=>e.preventDefault();return n.addEventListener(`webglcontextlost`,Ue),Q(),{sync:()=>{let e=Math.min(window.devicePixelRatio||1,2)*j(t.current.quality,.25,1);Math.abs(e-Y)>.001?Q():Ne(),Z()},destroy:()=>{xe=!0,cancelAnimationFrame(U),e.removeEventListener(`pointermove`,Le),e.removeEventListener(`pointerleave`,$),e.removeEventListener(`pointercancel`,$),e.removeEventListener(`pointerdown`,ze),document.removeEventListener(`visibilitychange`,He),n.removeEventListener(`webglcontextlost`,Ue),Be.disconnect(),Ve.disconnect(),Te(),Ee(),H?.texture.dispose(),I.geometry.dispose(),h.dispose(),[w,T,O,k,A,M].forEach(e=>e.dispose()),r.dispose(),r.forceContextLoss(),n.remove()},stoke:e=>Re(j(e,0,1)*(V?V.cols:0))}},I=(0,x.forwardRef)(function({colors:e=[`#7B3DFF`,`#FF7AD9`],backgroundColor:t=`#0A0A0A`,mode:n=`auto`,charset:i=ie,fontFamily:a=ae,glyphSize:o=11,spacing:s=1,height:c=.45,fuel:l=1,turbulence:u=.6,wind:d=.15,flicker:f=.5,sparks:p=.5,smoke:m=.35,pulse:h=0,speed:g=1,glow:ee=.35,intensity:te=1,interactive:ne=!0,snuff:_=!0,snuffRadius:re=70,snuffStrength:v=.8,clickStoke:y=!0,stokeStrength:b=1,paused:C=!1,quality:w=1,className:T,style:E,children:D},O){let j=(0,x.useRef)(null),M=(0,x.useRef)(null),N=(0,x.useSyncExternalStore)(k,A,()=>!1),P=(0,x.useRef)({colors:e,backgroundColor:t,mode:n,charset:i,fontFamily:a,glyphSize:o,spacing:s,height:c,fuel:l,turbulence:u,wind:d,flicker:f,sparks:p,smoke:m,pulse:h,speed:g,glow:ee,intensity:te,interactive:ne,snuff:_,snuffRadius:re,snuffStrength:v,clickStoke:y,stokeStrength:b,paused:C,quality:w,reduced:N});return(0,x.useEffect)(()=>{P.current={colors:e,backgroundColor:t,mode:n,charset:i,fontFamily:a,glyphSize:o,spacing:s,height:c,fuel:l,turbulence:u,wind:d,flicker:f,sparks:p,smoke:m,pulse:h,speed:g,glow:ee,intensity:te,interactive:ne,snuff:_,snuffRadius:re,snuffStrength:v,clickStoke:y,stokeStrength:b,paused:C,quality:w,reduced:N},M.current?.sync()}),(0,x.useEffect)(()=>{let e=j.current;if(!e)return;let t=_e(e,P);return M.current=t,()=>{t?.destroy(),M.current=null}},[]),(0,x.useImperativeHandle)(O,()=>({stoke:(e=.5)=>M.current?.stoke(e)}),[]),(0,S.jsx)(`div`,{ref:j,className:r(`relative isolate h-full min-h-[240px] w-full overflow-hidden`,T),style:{backgroundColor:t,...E},children:D&&(0,S.jsx)(`div`,{className:`relative z-10 h-full w-full`,children:D})})});I.displayName=`GlyphEmber`;export{I as GlyphEmber,I as default};