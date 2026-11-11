import{a as e,n as t,t as n}from"./jsx-runtime-Wy9s6hX0.js";import{f as r}from"./index-BZmMrv19.js";import{Ct as i,E as a,F as o,Ot as s,St as c,T as l,Tt as u,W as d,at as f,ht as p,l as m,mt as h,n as g,rt as ee,tt as te,ut as ne,wt as _,x as re,y as ie}from"./three.module-DQCqqdsN.js";var v=e(t(),1),ae=n(),oe=24,se=3.6,y=Math.PI*2,ce=26e3,le=360,b=32,ue=4,de=.32,fe=2.6,pe=3.6,x=e=>{let t=window.matchMedia(`(prefers-reduced-motion: reduce)`);return t.addEventListener(`change`,e),()=>t.removeEventListener(`change`,e)},me=()=>typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,S=(e,t,n)=>Math.min(n,Math.max(t,Number.isFinite(e)?e:t)),C=null,w=new Map,T=(e,t,n)=>{let r=w.get(t);if(r)return r;if(C||=e.createElement(`canvas`).getContext(`2d`),!C)return n;C.fillStyle=`#010203`,C.fillStyle=t;let i=String(C.fillStyle),a=n;if(i===`#010203`&&t.trim().toLowerCase()!==`#010203`)a=n;else if(i.startsWith(`#`)){let e=i.slice(1);a=[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255]}else{let e=i.match(/[\d.]+/g);e&&e.length>=3&&(a=[Number(e[0])/255,Number(e[1])/255,Number(e[2])/255])}return w.size>48&&w.clear(),w.set(t,a),a},E=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,he=([e,t,n])=>{let r=E(e),i=E(t),a=E(n),o=Math.cbrt(.4122214708*r+.5363325363*i+.0514459929*a),s=Math.cbrt(.2119034982*r+.6806995451*i+.1073969566*a),c=Math.cbrt(.0883024619*r+.2817188376*i+.6299787005*a);return[.2104542553*o+.793617785*s-.0040720468*c,1.9779984951*o-2.428592205*s+.4505937099*c,.0259040371*o+.7827717662*s-.808675766*c]},D=([e,t,n])=>{let r=(e+.3963377774*t+.2158037573*n)**3,i=(e-.1055613458*t-.0638541728*n)**3,a=(e-.0894841775*t-1.291485548*n)**3;return[4.0767416621*r-3.3077115913*i+.2309699292*a,-1.2684380046*r+2.6097574011*i-.3413193965*a,-.0041960863*r-.7034186147*i+1.707614701*a]},O=([e,t,n])=>{let r=S(e*.8,.3,.55),i=0,a=1.15;for(let e=0;e<16;e++){let e=(i+a)/2,o=D([r,t*e,n*e]);Math.min(o[0],o[1],o[2])>=-.001&&Math.max(o[0],o[1],o[2])<=1.001?i=e:a=e}return[r,t*i,n*i]},ge=`
in vec4 aSeed;
in vec4 aTrait;
uniform vec2 uResolution;
uniform vec2 uCenter;
uniform float uUnit;
uniform float uDistance;
uniform float uIncline;
uniform float uAspect;
uniform int uRings;
uniform float uFlow;
uniform float uInner;
uniform float uOuter;
uniform float uThickness;
uniform float uFolds;
uniform float uFold;
uniform float uDust;
uniform float uMorph;
uniform float uLobes;
uniform float uTurbulence;
uniform float uShape;
uniform float uTwist;
uniform float uRotation;
uniform float uFadeIn;
uniform float uFadeOut;
uniform float uPixelRatio;
uniform float uMaxPoint;
uniform float uSize;
uniform float uSizeVariance;
uniform float uSparkle;
uniform float uPrism;
uniform float uTwinkle;
uniform float uTime;
uniform float uGain;
uniform float uInk;
uniform vec3 uLabA;
uniform vec3 uLabB;
uniform vec3 uInkA;
uniform vec3 uInkB;
uniform vec4 uKickA[${b}];
uniform vec4 uKickB[${b}];
uniform float uKickTime;
out vec3 vColor;
out float vGain;
out float vSigma;
out float vSpan;

vec3 lattice(vec3 cell) {
  uvec3 v = uvec3(ivec3(cell)) * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  return vec3(v >> 8u) * (2.0 / 16777215.0) - 1.0;
}

float corner(vec3 cell, vec3 f, vec3 o) {
  return dot(lattice(cell + o), f - o);
}

float noise(vec3 p) {
  vec3 cell = floor(p);
  vec3 f = p - cell;
  vec3 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float x00 = mix(corner(cell, f, vec3(0.0, 0.0, 0.0)), corner(cell, f, vec3(1.0, 0.0, 0.0)), w.x);
  float x10 = mix(corner(cell, f, vec3(0.0, 1.0, 0.0)), corner(cell, f, vec3(1.0, 1.0, 0.0)), w.x);
  float x01 = mix(corner(cell, f, vec3(0.0, 0.0, 1.0)), corner(cell, f, vec3(1.0, 0.0, 1.0)), w.x);
  float x11 = mix(corner(cell, f, vec3(0.0, 1.0, 1.0)), corner(cell, f, vec3(1.0, 1.0, 1.0)), w.x);
  return 1.8 * mix(mix(x00, x10, w.y), mix(x01, x11, w.y), w.z);
}

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

void main() {
  int slotIndex = gl_VertexID % uRings;
  float rings = float(uRings);
  float slot = float(slotIndex);
  float travel = slot + uFlow;
  float generation = floor(travel / rings);
  float u = clamp((travel - generation * rings) / rings, 0.0, 1.0);
  float id = slot - generation * rings;
  float base = mix(uInner, uOuter, u);
  float spacing = (uOuter - uInner) / rings;
  float dust = step(aSeed.z, uDust);

  float lobes = uLobes;
  float local = aSeed.x - uTwist * id / max(lobes, 1.0);
  float wander = 1.7 * noise(vec3(id * 0.27, uShape * 0.55, 4.3));
  float swell = 0.8 + 0.3 * noise(vec3(id * 0.21, uShape * 0.42, 9.1));
  float lobe = cos(lobes * local + wander) * swell * (lobes > 0.5 ? 1.0 : 0.4);
  vec2 around = vec2(cos(local), sin(local));
  float broad = noise(vec3(around * (0.6 + 0.24 * lobes), id * 0.17 + uShape));
  float fine = noise(vec3(around * (2.4 + 0.7 * lobes), id * 0.33 + uShape * 1.9 + 17.0));
  float shape = 0.62 * lobe + 0.38 * broad + uTurbulence * 0.42 * fine;
  float centre = base * (1.0 + uMorph * (0.55 + 0.9 * u) * shape);

  float wave = 0.5 + 0.5 * sin(uFolds * local + 6.2831853 * fract(id * 0.618034) + uShape * 0.8 + 1.6 * noise(vec3(around * 0.85, id * 0.29 + uShape * 0.35 + 51.0)));
  float open = smoothstep(0.66, 0.97, wave);
  float phi = 1.5707963 * (1.0 - uFold * open);
  float width = uThickness * spacing * (0.8 + 0.4 * u);
  float across = aSeed.y * width;
  float radial = mix(across * max(cos(phi), 0.07), aTrait.z * spacing * 0.7, dust);
  float lift = mix(across * sin(phi), aTrait.w * width * 0.8, dust);
  float radius = max(centre + radial, 0.0);
  float theta = aSeed.x + uRotation;
  vec3 plane = vec3(radius * cos(theta) * uAspect, radius * sin(theta), lift);

  float ci = cos(uIncline);
  float si = sin(uIncline);
  vec3 q = vec3(plane.x, plane.y * ci + plane.z * si, -plane.y * si + plane.z * ci);
  float depth = uDistance - q.z;
  float clip = smoothstep(0.4, 1.4, depth);
  depth = max(depth, 0.4);
  float near = uDistance / depth;
  vec2 screen = uCenter + uUnit * near * q.xy;

  float scatter = 0.6 + 0.8 * fract(aSeed.w * 7.31);
  float delay = 0.75 + 0.5 * fract(aSeed.w * 3.17);
  float swirl = (fract(aSeed.w * 11.7) - 0.5) * 0.9;
  float cs = cos(swirl);
  float sn = sin(swirl);
  vec2 offset = vec2(0.0);
  for (int i = 0; i < ${b}; i++) {
    vec4 a = uKickA[i];
    if (a.w < 0.0) continue;
    vec4 b = uKickB[i];
    vec2 d = screen - a.xy;
    float dist = length(d);
    vec2 away = dist > 1e-3 ? d / dist : vec2(0.0);
    float strength = length(b.xy);
    float tau = a.w;
    float fall = exp(-dist * dist / (a.z * a.z));
    vec2 push = b.xy + away * strength * 0.45;
    if (b.z > 0.5) {
      tau = a.w - dist / b.w;
      fall = exp(-dist / a.z);
      push = away * strength;
    }
    if (tau <= 0.0 || fall < 0.003) continue;
    float t = tau / (uKickTime * delay);
    float response = t * exp(1.0 - t);
    offset += vec2(cs * push.x - sn * push.y, sn * push.x + cs * push.y) * fall * response;
  }
  offset *= scatter * (1.0 + 0.8 * dust);
  offset /= 1.0 + length(offset) / (uUnit * 0.18);
  screen += offset;
  float stirred = clamp(length(offset) / (uUnit * 0.05), 0.0, 1.0);

  float fadeOut = 1.0 - smoothstep(1.0 - uFadeOut, 1.0, u);
  float fade = smoothstep(0.0, uFadeIn, u) * fadeOut * fadeOut;
  float rim = smoothstep(0.72, 0.97, aSeed.y) * (1.0 - dust);
  float prism = step(1.0 - uPrism, aTrait.x);
  float glint = step(1.0 - uPrism - uSparkle * 0.3, aTrait.x) * (1.0 - prism);
  float beat = 0.5 + 0.5 * sin(uTime * (0.45 + 1.3 * fract(aSeed.w * 5.3)) + aSeed.w * 6.2831853);
  float twinkle = 1.0 - uTwinkle * (0.45 + 0.35 * glint + 0.3 * dust) * beat;
  float character = noise(vec3(id * 0.61, 2.7, uShape * 0.15));
  float clump = 1.0 + 0.3 * noise(vec3(around * 1.4, id * 0.43 + uShape * 0.6 + 31.0));

  float tone = clamp(0.2 + 0.55 * rim + (1.0 - u) * 0.35 - 0.3 * dust + (aTrait.y - 0.5) * 0.3, 0.0, 1.0);
  vec3 lab = mix(uLabA, uLabB, tone);
  float hue = aSeed.w * 6.2831853;
  vec3 speck = vec3(0.74, 0.13 * cos(hue), 0.13 * sin(hue));
  lab = mix(lab, speck, prism);
  vec3 bright = labToLinear(mix(lab, vec3(0.97, lab.yz * 0.18), glint * 0.8 + rim * 0.08));
  vec3 inked = labToLinear(mix(mix(uInkA, uInkB, tone), vec3(0.52, speck.yz), prism)) * (1.0 - 0.4 * glint);
  vColor = mix(bright, inked, uInk);

  float sizeMix = mix(1.0, 0.5 + 1.25 * aTrait.y * aTrait.y, uSizeVariance) * (1.0 - 0.25 * dust);
  float px = uSize * uPixelRatio * sizeMix * mix(1.0, near, 0.6) * (1.0 + 0.3 * glint + 0.2 * prism);
  float wanted = px / 2.3548;
  float sigma = clamp(wanted, 0.55, max((uMaxPoint - 1.5) / 5.0, 0.55));
  float shrink = min(1.0, (wanted * wanted) / (sigma * sigma));
  float body = mix(0.85 + 0.45 * rim, 0.38, dust);
  float gain = uGain * fade * twinkle * shrink * body * (1.0 + 1.6 * glint + 0.8 * prism) * mix(1.0, near, 0.5) * clip;
  gain *= (1.0 + 0.2 * character) * clump * (1.0 + 0.5 * stirred);

  vGain = gain;
  vSigma = sigma;
  vSpan = 5.0 * sigma + 1.5;
  gl_PointSize = vSpan;
  gl_Position = gain > 1e-5 ? vec4(screen / uResolution * 2.0 - 1.0, 0.0, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
}
`,_e=`
precision highp float;
in vec3 vColor;
in float vGain;
in float vSigma;
in float vSpan;
out vec4 fragColor;

void main() {
  vec2 d = (gl_PointCoord - 0.5) * vSpan;
  float r2 = dot(d, d) / (vSigma * vSigma);
  float e = max(exp(-0.5 * r2) - 0.0439369, 0.0) * (vGain / 0.9560631);
  fragColor = vec4(vColor * e, e);
}
`,ve=`
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,ye=`
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
`,be=`
precision highp float;
uniform sampler2D uSource;
uniform sampler2D uBase;
uniform vec2 uTexel;
uniform float uKeep;
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
  fragColor = texture(uBase, vUv) + sum * (uKeep / 16.0);
}
`,k=`
precision highp float;
uniform sampler2D uLines;
uniform sampler2D uBloom;
uniform vec3 uBackground;
uniform float uGlow;
uniform float uExposure;
uniform float uMode;
uniform float uGrain;
uniform float uSeed;
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
  float speck = hash(gl_FragCoord.xy + uSeed * 311.0) - 0.5;
  vec3 color;
  float lit;
  if (uMode < 0.5) {
    vec3 light = (lines.rgb + bloom.rgb * uGlow) * uExposure;
    vec3 exposed = 1.0 - exp(-light);
    float peak = max(exposed.r, max(exposed.g, exposed.b));
    exposed = mix(exposed, vec3(peak), smoothstep(0.75, 1.0, peak) * 0.35);
    color = uBackground + (1.0 - uBackground) * exposed;
    lit = peak;
  } else {
    float energy = lines.a + bloom.a * uGlow * 0.25;
    vec3 hue = (lines.rgb + bloom.rgb * uGlow * 0.25) / max(energy, 1e-4);
    float density = 1.05 * (1.0 - exp(-energy * uExposure));
    vec3 absorb = -log(clamp(hue, 0.03, 1.0));
    color = uBackground * exp(-absorb * density);
    lit = min(density, 1.0);
  }
  float dither = hash(gl_FragCoord.xy * 1.37 + uSeed * 97.0) + hash(gl_FragCoord.xy * 0.71 + uSeed * 41.0 + 13.0) - 1.0;
  vec3 encoded = encode(color) + speck * uGrain * (2.0 / 255.0 + 0.07 * lit) + dither / 255.0;
  fragColor = vec4(encoded, 1.0);
}
`,A=e=>{let t=e;return()=>(t=t*16807%2147483647,t/2147483647)},xe=e=>{let t=A(29),n=()=>{let e=Math.max(t(),1e-9);return Math.sqrt(-2*Math.log(e))*Math.cos(y*t())},r=new Float32Array(e*8);for(let i=0;i<e;i++){let e=t()<.3?1-.16*t()*t():1-2*t()**.85;r.set([t()*y,e,t(),t(),t(),t(),S(n(),-3,3),S(n(),-3,3)],i*8)}let i=new m,o=new l(r,8);return i.setAttribute(`aSeed`,new a(o,4,0)),i.setAttribute(`aTrait`,new a(o,4,4)),i.setAttribute(`position`,new a(o,3,0)),i},j=(e,t)=>{let n=e.ownerDocument,r=n.defaultView??window,a=n.createElement(`canvas`);a.setAttribute(`aria-hidden`,`true`),a.style.cssText=`position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none`,e.prepend(a);let l;try{l=new g({canvas:a,alpha:!1,antialias:!1,powerPreference:`high-performance`})}catch{return a.remove(),null}if(!l.capabilities.isWebGL2)return l.dispose(),a.remove(),null;l.autoClear=!1;let v=l.extensions.has(`EXT_color_buffer_float`)||l.extensions.has(`EXT_color_buffer_half_float`)?re:c,ae=l.getContext(),x=ae.getParameter(ae.ALIASED_POINT_SIZE_RANGE),me=x&&x.length>1?Math.max(8,x[1]):64,C=new te(-1,1,1,-1,0,1),w=new ee(2,2),D=Array.from({length:b},()=>new u(0,0,1,-1)),A=Array.from({length:b},()=>new u),j=[],M=new p({glslVersion:ie,uniforms:{uResolution:{value:new i(1,1)},uCenter:{value:new i},uUnit:{value:1},uDistance:{value:se},uIncline:{value:0},uAspect:{value:1},uRings:{value:7},uFlow:{value:0},uInner:{value:.14},uOuter:{value:1.05},uThickness:{value:.34},uFolds:{value:3},uFold:{value:.9},uDust:{value:.14},uMorph:{value:.11},uLobes:{value:3},uTurbulence:{value:.35},uShape:{value:0},uTwist:{value:.35},uRotation:{value:0},uFadeIn:{value:.2},uFadeOut:{value:.3},uPixelRatio:{value:1},uMaxPoint:{value:64},uSize:{value:1.5},uSizeVariance:{value:.5},uSparkle:{value:.05},uPrism:{value:.04},uTwinkle:{value:.3},uTime:{value:0},uGain:{value:1},uInk:{value:0},uLabA:{value:new _},uLabB:{value:new _},uInkA:{value:new _},uInkB:{value:new _},uKickA:{value:D},uKickB:{value:A},uKickTime:{value:de}},vertexShader:ge,fragmentShader:_e,depthTest:!1,depthWrite:!1,transparent:!0,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendSrcAlpha:201,blendDstAlpha:201}),Se=(e,t)=>new p({glslVersion:ie,uniforms:t,vertexShader:ve,fragmentShader:e,depthTest:!1,depthWrite:!1,blending:0}),N=Se(ye,{uSource:{value:null},uTexel:{value:new i}}),P=Se(be,{uSource:{value:null},uBase:{value:null},uTexel:{value:new i},uKeep:{value:.62}}),F=Se(k,{uLines:{value:null},uBloom:{value:null},uBackground:{value:new _},uGlow:{value:.45},uExposure:{value:1},uMode:{value:0},uGrain:{value:.3},uSeed:{value:0}}),I=new f(new m,M);I.frustumCulled=!1;let Ce=new h;Ce.add(I);let L=new d(w,F);L.frustumCulled=!1;let R=new h;R.add(L);let we=0,Te=(e,t)=>new s(Math.max(1,e),Math.max(1,t),{type:v,format:ne,minFilter:o,magFilter:o,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1}),z=null,B=[],V=[],Ee=!1,H=!1,De=!1,U=0,Oe=0,ke=!0,W=1,G=1,Ae=1,je=1,K=1,Me=0,Ne=0,Pe=.37,Fe=6.2,Ie=0,q=null,J={level:0,bass:0,mid:0,high:0,beat:0},Le=0,Re=()=>{z?.dispose(),B.forEach(e=>e.dispose()),V.forEach(e=>e.dispose()),z=null,B=[],V=[]},ze=(e,t)=>{L.material=e,l.setRenderTarget(t),l.render(R,C)},Be=()=>{let e=Math.round(S(t.current.particles,2e3,2e5));e!==we&&(we=e,I.geometry.dispose(),I.geometry=xe(e))},Y=()=>{let e=t.current,n=Ae,r=je;return{unit:.5*Math.min(Math.max(n,r),1.6*Math.min(n,r))*S(e.scale*(1+.07*J.bass+.03*J.beat),.2,4),cx:(.5+.5*S(e.centerX,-1.5,1.5))*n,cy:(.5-.5*S(e.centerY,-1.5,1.5))*r,incline:S(e.tilt,0,80)*Math.PI/180,aspect:S(e.aspect,.25,4)}},Ve=()=>{let e=t.current,n=S(e.innerRadius,0,3);return{inner:n,outer:Math.max(S(e.outerRadius,.05,4),n+.05)}},He=(t,n)=>{let r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return null;let i=(t-r.left)*(W/r.width),a=(n-r.top)*(G/r.height);return{x:Ae/W*i,y:(G-a)*(je/G)}},Ue=()=>{let e=t.current,r=M.uniforms,i=Y(),{inner:a,outer:o}=Ve(),s=T(n,e.backgroundColor,[.04,.04,.04]),c=.2126*s[0]+.7152*s[1]+.0722*s[2],l=e.mode===`ink`||e.mode===`auto`&&c>.5,u=he(T(n,e.colors[0],[.17,.78,1])),d=he(T(n,e.colors[1],[.61,.96,.89])),f=Math.round(S(e.rings,2,oe)),p=S(e.fade,0,1);if(r.uResolution.value.set(Ae,je),r.uCenter.value.set(i.cx,i.cy),r.uUnit.value=i.unit,r.uIncline.value=i.incline,r.uAspect.value=i.aspect,r.uRings.value=f,r.uFlow.value=Pe,r.uInner.value=a,r.uOuter.value=o,r.uThickness.value=S(e.thickness,0,2),r.uFolds.value=Math.round(S(e.folds,0,12)),r.uFold.value=S(e.fold,0,1),r.uDust.value=S(e.dust,0,1),r.uMorph.value=S(e.morph,0,.6),r.uLobes.value=Math.round(S(e.lobes,0,12)),r.uTurbulence.value=S(e.turbulence+.7*J.mid,0,2),r.uShape.value=Fe,r.uTwist.value=S(e.twist,-Math.PI,Math.PI),r.uRotation.value=Ie,r.uFadeIn.value=Math.max(.04,p),r.uFadeOut.value=Math.max(.04,p),r.uPixelRatio.value=K,r.uMaxPoint.value=me,r.uSize.value=S(e.particleSize,.3,8),r.uSizeVariance.value=S(e.sizeVariance,0,1),r.uSparkle.value=S(e.sparkle+.45*J.high,0,1),r.uPrism.value=S(e.prism,0,.5),r.uTwinkle.value=e.reduced?0:S(e.twinkle+.4*J.high,0,1),r.uTime.value=Ne,r.uInk.value=+!!l,r.uLabA.value.set(u[0],u[1],u[2]),r.uLabB.value.set(d[0],d[1],d[2]),l){let e=O(u),t=O(d);r.uInkA.value.set(e[0],e[1],e[2]),r.uInkB.value.set(t[0],t[1],t[2])}let m=(i.unit/K/le)**2,h=S(m,.25,1)*S(e.quality,.25,1);I.geometry.setDrawRange(0,Math.round(we*h)),r.uGain.value=.6*Math.sqrt(ce/we)*S(m/h,.5,4);for(let e=0;e<b;e++){let t=j[e];t?(D[e].set(t.x,t.y,t.reach,t.age),A[e].set(t.vx,t.vy,t.kind,t.speed)):D[e].w=-1}let g=F.uniforms;g.uBackground.value.set(E(s[0]),E(s[1]),E(s[2])),g.uGlow.value=S(e.glow*(1+1.6*J.bass+.9*J.beat),0,3)*(l?.5:1),g.uExposure.value=(l?2.2:1)*S(e.intensity*(1+.55*J.level+.35*J.beat),0,4),g.uMode.value=+!!l,g.uGrain.value=S(e.grain,0,1),g.uSeed.value=Me},X=()=>{if(!De||!z||!B.length||H)return;Be(),Ue(),l.setRenderTarget(z),l.setClearColor(0,0),l.clear(),l.render(Ce,C);let e=z;for(let t of B)N.uniforms.uSource.value=e.texture,N.uniforms.uTexel.value.set(1/e.width,1/e.height),ze(N,t),e=t;let t=B[B.length-1];for(let e=B.length-2;e>=0;e--)P.uniforms.uSource.value=t.texture,P.uniforms.uBase.value=B[e].texture,P.uniforms.uTexel.value.set(1/t.width,1/t.height),ze(P,V[e]),t=V[e];F.uniforms.uLines.value=z.texture,F.uniforms.uBloom.value=t.texture,ze(F,null)},We=e=>{let n=t.current;if(n.paused||n.reduced)return;let r=n.audio?.();for(let t of[`level`,`bass`,`mid`,`high`,`beat`]){let n=r?S(r[t],0,1):0;J[t]+=(n-J[t])*(1-Math.exp(-e*(n>J[t]?22:5)))}if(r&&r.beat>.95&&Le<=.95){let e=Y();Je(e.cx,e.cy,S(n.pulse,0,3)*(.45+.8*J.bass))}Le=r?r.beat:0,Ne+=e;let i=n.flow===`inward`?-1:1;Pe+=e*i*S(n.flowSpeed*(1+2.6*J.level+1.2*J.beat),0,2),Fe+=e*S(n.morphSpeed*(1+1.6*J.mid),0,2),Ie=(Ie+e*S(n.rotation*(1+2*J.level),-3,3))%y;for(let t=j.length-1;t>=0;t--)j[t].age+=e,j[t].age>j[t].life&&j.splice(t,1);Me=(Me+.618034)%1},Ge=e=>{if(U=0,Ee||H)return;let i=Math.min(.05,Math.max(0,(e-Oe)/1e3));Oe=e,We(i),X();let a=t.current;ke&&!n.hidden&&!a.paused&&!a.reduced&&(U=r.requestAnimationFrame(Ge))};function Z(){Ee||H||!De||U||!ke||(Oe=r.performance.now(),U=r.requestAnimationFrame(Ge))}let Ke=()=>{let n=e.getBoundingClientRect();W=Math.max(1,e.clientWidth||n.width),G=Math.max(1,e.clientHeight||n.height),K=Math.min(r.devicePixelRatio||1,2)*S(t.current.quality,.25,1),l.setPixelRatio(K),l.setSize(W,G,!1);let i=Math.max(1,Math.floor(W*K)),a=Math.max(1,Math.floor(G*K));Ae=i,je=a,Re(),z=Te(i,a);let o=S(Math.floor(Math.log2(Math.min(i,a)/8)),3,7);for(let e=1;e<=o;e++)B.push(Te(Math.max(1,i>>e),Math.max(1,a>>e))),V.push(Te(Math.max(1,i>>e),Math.max(1,a>>e)));X(),Z()},qe=e=>{let t=j.filter(t=>t.kind===e.kind),n=e.kind===1?ue:28;t.length>=n&&j.splice(j.indexOf(t[0]),1),j.push(e),Z()},Je=(e,n,r)=>{let i=t.current;if(i.reduced||i.paused||r<=0)return;let a=Y().unit;qe({x:e,y:n,vx:a*.11*r,vy:0,reach:a*.9,age:0,kind:1,speed:a*1.25,life:pe})},Ye=t.current.pointerTarget===`window`,Q=Ye?r:e,Xe=e=>Ye&&e.pointerType===`touch`,Ze=e=>{let n=t.current;if(!n.interactive||n.reduced||n.paused||Xe(e)){q=null;return}let i=He(e.clientX,e.clientY);if(!i)return;let a=r.performance.now()/1e3,o=q;if(!o){q={x:i.x,y:i.y,t:a};return}let s=i.x-o.x,c=i.y-o.y,l=Y().unit;if(Math.hypot(s,c)<l*.012&&a-o.t<.05)return;q={x:i.x,y:i.y,t:a};let u=S(n.push,0,3);if(u<=0)return;let d=l*.1*u,f=s*1.5*u,p=c*1.5*u,m=Math.hypot(f,p);m<.5||(m>d&&(f*=d/m,p*=d/m),qe({x:i.x,y:i.y,vx:f,vy:p,reach:l*.2,age:0,kind:0,speed:0,life:fe}))},$=()=>{q=null},Qe=e=>{let n=t.current;if(e.button!==0||!n.interactive||Xe(e))return;let r=He(e.clientX,e.clientY);r&&Je(r.x,r.y,S(n.pulse,0,3))};Q.addEventListener(`pointermove`,Ze,{passive:!0}),Q.addEventListener(`pointerleave`,$),Q.addEventListener(`pointercancel`,$),Q.addEventListener(`pointerdown`,Qe,{passive:!0});let $e=new ResizeObserver(Ke);$e.observe(e);let et=new IntersectionObserver(e=>{ke=e.some(e=>e.isIntersecting),ke&&Z()},{rootMargin:`80px`});et.observe(e);let tt=()=>{n.hidden||Z()};n.addEventListener(`visibilitychange`,tt);let nt=e=>{e.preventDefault(),H=!0,U&&r.cancelAnimationFrame(U),U=0},rt=()=>{H=!1,De=!0,X(),Z()};a.addEventListener(`webglcontextlost`,nt),a.addEventListener(`webglcontextrestored`,rt),Ke(),Be();let it=Te(1,1);l.setRenderTarget(it);let at=[l.compileAsync(Ce,C)];for(let e of[N,P])L.material=e,at.push(l.compileAsync(R,C));return l.setRenderTarget(null),L.material=F,at.push(l.compileAsync(R,C)),it.dispose(),Promise.all(at).catch(()=>{}).then(()=>{Ee||(De=!0,X(),Z())}),{sync:()=>{let e=Math.min(r.devicePixelRatio||1,2)*S(t.current.quality,.25,1);t.current.interactive||(q=null),Math.abs(e-K)>.001?Ke():X(),Z()},destroy:()=>{Ee=!0,U&&r.cancelAnimationFrame(U),U=0,Q.removeEventListener(`pointermove`,Ze),Q.removeEventListener(`pointerleave`,$),Q.removeEventListener(`pointercancel`,$),Q.removeEventListener(`pointerdown`,Qe),n.removeEventListener(`visibilitychange`,tt),a.removeEventListener(`webglcontextlost`,nt),a.removeEventListener(`webglcontextrestored`,rt),$e.disconnect(),et.disconnect(),Re(),I.geometry.dispose(),w.dispose(),[M,N,P,F].forEach(e=>e.dispose()),l.dispose(),l.forceContextLoss(),a.remove()},pulse:()=>{let e=Y();Je(e.cx,e.cy,S(t.current.pulse,0,3)||1)}}},M=(0,v.forwardRef)(function({colors:e=[`#2f6fe0`,`#b8f3ff`],backgroundColor:t=`#0a0a0a`,mode:n=`auto`,rings:i=6,particles:a=46e3,thickness:o=.34,folds:s=3,fold:c=.9,dust:l=.14,innerRadius:u=.42,outerRadius:d=1.3,flow:f=`outward`,flowSpeed:p=.05,morph:m=.13,lobes:h=3,turbulence:g=.45,morphSpeed:ee=.1,twist:te=.4,rotation:ne=.01,aspect:_=1,tilt:re=0,centerX:ie=0,centerY:oe=0,scale:se=1,particleSize:y=1.3,sizeVariance:ce=.5,sparkle:le=.05,prism:b=.04,twinkle:ue=.3,fade:de=.22,glow:fe=.4,intensity:pe=1,grain:S=.3,interactive:C=!0,push:w=1,pulse:T=1,paused:E=!1,quality:he=1,audio:D,pointerTarget:O=`self`,className:ge,style:_e,children:ve},ye){let be=(0,v.useRef)(null),k=(0,v.useRef)(null),A=(0,v.useSyncExternalStore)(x,me,()=>!1),xe=(0,v.useRef)({colors:e,backgroundColor:t,mode:n,rings:i,particles:a,thickness:o,folds:s,fold:c,dust:l,innerRadius:u,outerRadius:d,flow:f,flowSpeed:p,morph:m,lobes:h,turbulence:g,morphSpeed:ee,twist:te,rotation:ne,aspect:_,tilt:re,centerX:ie,centerY:oe,scale:se,particleSize:y,sizeVariance:ce,sparkle:le,prism:b,twinkle:ue,fade:de,glow:fe,intensity:pe,grain:S,interactive:C,push:w,pulse:T,paused:E,quality:he,audio:D,pointerTarget:O,reduced:A});return(0,v.useEffect)(()=>{xe.current={colors:e,backgroundColor:t,mode:n,rings:i,particles:a,thickness:o,folds:s,fold:c,dust:l,innerRadius:u,outerRadius:d,flow:f,flowSpeed:p,morph:m,lobes:h,turbulence:g,morphSpeed:ee,twist:te,rotation:ne,aspect:_,tilt:re,centerX:ie,centerY:oe,scale:se,particleSize:y,sizeVariance:ce,sparkle:le,prism:b,twinkle:ue,fade:de,glow:fe,intensity:pe,grain:S,interactive:C,push:w,pulse:T,paused:E,quality:he,audio:D,pointerTarget:O,reduced:A},k.current?.sync()}),(0,v.useEffect)(()=>{let e=be.current;if(!e)return;let t=j(e,xe);return k.current=t,()=>{t?.destroy(),k.current=null}},[]),(0,v.useImperativeHandle)(ye,()=>({pulse:()=>k.current?.pulse()}),[]),(0,ae.jsx)(`div`,{ref:be,className:r(`relative isolate h-full min-h-[240px] w-full overflow-hidden`,ge),style:{backgroundColor:t,..._e},children:ve&&(0,ae.jsx)(`div`,{className:`relative z-10 h-full w-full`,children:ve})})});M.displayName=`RingField`;export{M as RingField,M as default};