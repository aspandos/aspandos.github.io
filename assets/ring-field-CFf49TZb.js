import{i as e,n as t,t as n}from"./jsx-runtime-DyZJNswf.js";import{f as r}from"./index-CIZJrXM0.js";import{C as i,Ct as a,M as o,Q as s,V as c,_ as l,bt as u,c as d,dt as f,et as p,n as m,nt as h,st as g,ut as ee,vt as te,w as _,xt as ne,y as re,yt as v}from"./three.module-HQIOEGto.js";var y=e(t(),1),ie=n(),ae=24,oe=3.6,b=Math.PI*2,se=26e3,ce=360,x=32,le=4,ue=.32,de=2.6,fe=3.6,S=e=>{let t=window.matchMedia(`(prefers-reduced-motion: reduce)`);return t.addEventListener(`change`,e),()=>t.removeEventListener(`change`,e)},pe=()=>typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,C=(e,t,n)=>Math.min(n,Math.max(t,Number.isFinite(e)?e:t)),w=null,T=new Map,E=(e,t,n)=>{let r=T.get(t);if(r)return r;if(w||=e.createElement(`canvas`).getContext(`2d`),!w)return n;w.fillStyle=`#010203`,w.fillStyle=t;let i=String(w.fillStyle),a=n;if(i===`#010203`&&t.trim().toLowerCase()!==`#010203`)a=n;else if(i.startsWith(`#`)){let e=i.slice(1);a=[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255]}else{let e=i.match(/[\d.]+/g);e&&e.length>=3&&(a=[Number(e[0])/255,Number(e[1])/255,Number(e[2])/255])}return T.size>48&&T.clear(),T.set(t,a),a},D=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,me=([e,t,n])=>{let r=D(e),i=D(t),a=D(n),o=Math.cbrt(.4122214708*r+.5363325363*i+.0514459929*a),s=Math.cbrt(.2119034982*r+.6806995451*i+.1073969566*a),c=Math.cbrt(.0883024619*r+.2817188376*i+.6299787005*a);return[.2104542553*o+.793617785*s-.0040720468*c,1.9779984951*o-2.428592205*s+.4505937099*c,.0259040371*o+.7827717662*s-.808675766*c]},O=([e,t,n])=>{let r=(e+.3963377774*t+.2158037573*n)**3,i=(e-.1055613458*t-.0638541728*n)**3,a=(e-.0894841775*t-1.291485548*n)**3;return[4.0767416621*r-3.3077115913*i+.2309699292*a,-1.2684380046*r+2.6097574011*i-.3413193965*a,-.0041960863*r-.7034186147*i+1.707614701*a]},k=([e,t,n])=>{let r=C(e*.8,.3,.55),i=0,a=1.15;for(let e=0;e<16;e++){let e=(i+a)/2,o=O([r,t*e,n*e]);Math.min(o[0],o[1],o[2])>=-.001&&Math.max(o[0],o[1],o[2])<=1.001?i=e:a=e}return[r,t*i,n*i]},he=`
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
uniform vec4 uKickA[${x}];
uniform vec4 uKickB[${x}];
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
  for (int i = 0; i < ${x}; i++) {
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
`,ge=`
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
`,_e=`
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,ve=`
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
`,ye=`
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
`,A=`
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
`,j=e=>{let t=e;return()=>(t=t*16807%2147483647,t/2147483647)},be=e=>{let t=j(29),n=()=>{let e=Math.max(t(),1e-9);return Math.sqrt(-2*Math.log(e))*Math.cos(b*t())},r=new Float32Array(e*8);for(let i=0;i<e;i++){let e=t()<.3?1-.16*t()*t():1-2*t()**.85;r.set([t()*b,e,t(),t(),t(),t(),C(n(),-3,3),C(n(),-3,3)],i*8)}let a=new d,o=new i(r,8);return a.setAttribute(`aSeed`,new _(o,4,0)),a.setAttribute(`aTrait`,new _(o,4,4)),a.setAttribute(`position`,new _(o,3,0)),a},M=(e,t)=>{let n=e.ownerDocument,r=n.defaultView??window,i=n.createElement(`canvas`);i.setAttribute(`aria-hidden`,`true`),i.style.cssText=`position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none`,e.prepend(i);let _;try{_=new m({canvas:i,alpha:!1,antialias:!1,powerPreference:`high-performance`})}catch{return i.remove(),null}if(!_.capabilities.isWebGL2)return _.dispose(),i.remove(),null;_.autoClear=!1;let y=_.extensions.has(`EXT_color_buffer_float`)||_.extensions.has(`EXT_color_buffer_half_float`)?re:te,ie=_.getContext(),S=ie.getParameter(ie.ALIASED_POINT_SIZE_RANGE),pe=S&&S.length>1?Math.max(8,S[1]):64,w=new s(-1,1,1,-1,0,1),T=new p(2,2),O=Array.from({length:x},()=>new ne(0,0,1,-1)),j=Array.from({length:x},()=>new ne),M=[],N=new f({glslVersion:l,uniforms:{uResolution:{value:new v(1,1)},uCenter:{value:new v},uUnit:{value:1},uDistance:{value:oe},uIncline:{value:0},uAspect:{value:1},uRings:{value:7},uFlow:{value:0},uInner:{value:.14},uOuter:{value:1.05},uThickness:{value:.34},uFolds:{value:3},uFold:{value:.9},uDust:{value:.14},uMorph:{value:.11},uLobes:{value:3},uTurbulence:{value:.35},uShape:{value:0},uTwist:{value:.35},uRotation:{value:0},uFadeIn:{value:.2},uFadeOut:{value:.3},uPixelRatio:{value:1},uMaxPoint:{value:64},uSize:{value:1.5},uSizeVariance:{value:.5},uSparkle:{value:.05},uPrism:{value:.04},uTwinkle:{value:.3},uTime:{value:0},uGain:{value:1},uInk:{value:0},uLabA:{value:new u},uLabB:{value:new u},uInkA:{value:new u},uInkB:{value:new u},uKickA:{value:O},uKickB:{value:j},uKickTime:{value:ue}},vertexShader:he,fragmentShader:ge,depthTest:!1,depthWrite:!1,transparent:!0,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendSrcAlpha:201,blendDstAlpha:201}),xe=(e,t)=>new f({glslVersion:l,uniforms:t,vertexShader:_e,fragmentShader:e,depthTest:!1,depthWrite:!1,blending:0}),P=xe(ve,{uSource:{value:null},uTexel:{value:new v}}),F=xe(ye,{uSource:{value:null},uBase:{value:null},uTexel:{value:new v},uKeep:{value:.62}}),I=xe(A,{uLines:{value:null},uBloom:{value:null},uBackground:{value:new u},uGlow:{value:.45},uExposure:{value:1},uMode:{value:0},uGrain:{value:.3},uSeed:{value:0}}),L=new h(new d,N);L.frustumCulled=!1;let Se=new ee;Se.add(L);let R=new c(T,I);R.frustumCulled=!1;let Ce=new ee;Ce.add(R);let we=0,Te=(e,t)=>new a(Math.max(1,e),Math.max(1,t),{type:y,format:g,minFilter:o,magFilter:o,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1}),z=null,B=[],V=[],Ee=!1,H=!1,De=!1,U=0,Oe=0,ke=!0,W=1,G=1,Ae=1,je=1,K=1,Me=0,Ne=0,Pe=.37,Fe=6.2,Ie=0,q=null,J={level:0,bass:0,mid:0,high:0,beat:0},Le=0,Re=()=>{z?.dispose(),B.forEach(e=>e.dispose()),V.forEach(e=>e.dispose()),z=null,B=[],V=[]},ze=(e,t)=>{R.material=e,_.setRenderTarget(t),_.render(Ce,w)},Be=()=>{let e=Math.round(C(t.current.particles,2e3,2e5));e!==we&&(we=e,L.geometry.dispose(),L.geometry=be(e))},Y=()=>{let e=t.current,n=Ae,r=je;return{unit:.5*Math.min(Math.max(n,r),1.6*Math.min(n,r))*C(e.scale*(1+.07*J.bass+.03*J.beat),.2,4),cx:(.5+.5*C(e.centerX,-1.5,1.5))*n,cy:(.5-.5*C(e.centerY,-1.5,1.5))*r,incline:C(e.tilt,0,80)*Math.PI/180,aspect:C(e.aspect,.25,4)}},Ve=()=>{let e=t.current,n=C(e.innerRadius,0,3);return{inner:n,outer:Math.max(C(e.outerRadius,.05,4),n+.05)}},He=(t,n)=>{let r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return null;let i=(t-r.left)*(W/r.width),a=(n-r.top)*(G/r.height);return{x:Ae/W*i,y:(G-a)*(je/G)}},Ue=()=>{let e=t.current,r=N.uniforms,i=Y(),{inner:a,outer:o}=Ve(),s=E(n,e.backgroundColor,[.04,.04,.04]),c=.2126*s[0]+.7152*s[1]+.0722*s[2],l=e.mode===`ink`||e.mode===`auto`&&c>.5,u=me(E(n,e.colors[0],[.17,.78,1])),d=me(E(n,e.colors[1],[.61,.96,.89])),f=Math.round(C(e.rings,2,ae)),p=C(e.fade,0,1);if(r.uResolution.value.set(Ae,je),r.uCenter.value.set(i.cx,i.cy),r.uUnit.value=i.unit,r.uIncline.value=i.incline,r.uAspect.value=i.aspect,r.uRings.value=f,r.uFlow.value=Pe,r.uInner.value=a,r.uOuter.value=o,r.uThickness.value=C(e.thickness,0,2),r.uFolds.value=Math.round(C(e.folds,0,12)),r.uFold.value=C(e.fold,0,1),r.uDust.value=C(e.dust,0,1),r.uMorph.value=C(e.morph,0,.6),r.uLobes.value=Math.round(C(e.lobes,0,12)),r.uTurbulence.value=C(e.turbulence+.7*J.mid,0,2),r.uShape.value=Fe,r.uTwist.value=C(e.twist,-Math.PI,Math.PI),r.uRotation.value=Ie,r.uFadeIn.value=Math.max(.04,p),r.uFadeOut.value=Math.max(.04,p),r.uPixelRatio.value=K,r.uMaxPoint.value=pe,r.uSize.value=C(e.particleSize,.3,8),r.uSizeVariance.value=C(e.sizeVariance,0,1),r.uSparkle.value=C(e.sparkle+.45*J.high,0,1),r.uPrism.value=C(e.prism,0,.5),r.uTwinkle.value=e.reduced?0:C(e.twinkle+.4*J.high,0,1),r.uTime.value=Ne,r.uInk.value=+!!l,r.uLabA.value.set(u[0],u[1],u[2]),r.uLabB.value.set(d[0],d[1],d[2]),l){let e=k(u),t=k(d);r.uInkA.value.set(e[0],e[1],e[2]),r.uInkB.value.set(t[0],t[1],t[2])}let m=(i.unit/K/ce)**2,h=C(m,.25,1)*C(e.quality,.25,1);L.geometry.setDrawRange(0,Math.round(we*h)),r.uGain.value=.6*Math.sqrt(se/we)*C(m/h,.5,4);for(let e=0;e<x;e++){let t=M[e];t?(O[e].set(t.x,t.y,t.reach,t.age),j[e].set(t.vx,t.vy,t.kind,t.speed)):O[e].w=-1}let g=I.uniforms;g.uBackground.value.set(D(s[0]),D(s[1]),D(s[2])),g.uGlow.value=C(e.glow*(1+1.6*J.bass+.9*J.beat),0,3)*(l?.5:1),g.uExposure.value=(l?2.2:1)*C(e.intensity*(1+.55*J.level+.35*J.beat),0,4),g.uMode.value=+!!l,g.uGrain.value=C(e.grain,0,1),g.uSeed.value=Me},X=()=>{if(!De||!z||!B.length||H)return;Be(),Ue(),_.setRenderTarget(z),_.setClearColor(0,0),_.clear(),_.render(Se,w);let e=z;for(let t of B)P.uniforms.uSource.value=e.texture,P.uniforms.uTexel.value.set(1/e.width,1/e.height),ze(P,t),e=t;let t=B[B.length-1];for(let e=B.length-2;e>=0;e--)F.uniforms.uSource.value=t.texture,F.uniforms.uBase.value=B[e].texture,F.uniforms.uTexel.value.set(1/t.width,1/t.height),ze(F,V[e]),t=V[e];I.uniforms.uLines.value=z.texture,I.uniforms.uBloom.value=t.texture,ze(I,null)},We=e=>{let n=t.current;if(n.paused||n.reduced)return;let r=n.audio?.();for(let t of[`level`,`bass`,`mid`,`high`,`beat`]){let n=r?C(r[t],0,1):0;J[t]+=(n-J[t])*(1-Math.exp(-e*(n>J[t]?22:5)))}if(r&&r.beat>.95&&Le<=.95){let e=Y();Je(e.cx,e.cy,C(n.pulse,0,3)*(.45+.8*J.bass))}Le=r?r.beat:0,Ne+=e;let i=n.flow===`inward`?-1:1;Pe+=e*i*C(n.flowSpeed*(1+2.6*J.level+1.2*J.beat),0,2),Fe+=e*C(n.morphSpeed*(1+1.6*J.mid),0,2),Ie=(Ie+e*C(n.rotation*(1+2*J.level),-3,3))%b;for(let t=M.length-1;t>=0;t--)M[t].age+=e,M[t].age>M[t].life&&M.splice(t,1);Me=(Me+.618034)%1},Ge=e=>{if(U=0,Ee||H)return;let i=Math.min(.05,Math.max(0,(e-Oe)/1e3));Oe=e,We(i),X();let a=t.current;ke&&!n.hidden&&!a.paused&&!a.reduced&&(U=r.requestAnimationFrame(Ge))};function Z(){Ee||H||!De||U||!ke||(Oe=r.performance.now(),U=r.requestAnimationFrame(Ge))}let Ke=()=>{let n=e.getBoundingClientRect();W=Math.max(1,e.clientWidth||n.width),G=Math.max(1,e.clientHeight||n.height),K=Math.min(r.devicePixelRatio||1,2)*C(t.current.quality,.25,1),_.setPixelRatio(K),_.setSize(W,G,!1);let i=Math.max(1,Math.floor(W*K)),a=Math.max(1,Math.floor(G*K));Ae=i,je=a,Re(),z=Te(i,a);let o=C(Math.floor(Math.log2(Math.min(i,a)/8)),3,7);for(let e=1;e<=o;e++)B.push(Te(Math.max(1,i>>e),Math.max(1,a>>e))),V.push(Te(Math.max(1,i>>e),Math.max(1,a>>e)));X(),Z()},qe=e=>{let t=M.filter(t=>t.kind===e.kind),n=e.kind===1?le:28;t.length>=n&&M.splice(M.indexOf(t[0]),1),M.push(e),Z()},Je=(e,n,r)=>{let i=t.current;if(i.reduced||i.paused||r<=0)return;let a=Y().unit;qe({x:e,y:n,vx:a*.11*r,vy:0,reach:a*.9,age:0,kind:1,speed:a*1.25,life:fe})},Ye=t.current.pointerTarget===`window`,Q=Ye?r:e,Xe=e=>Ye&&e.pointerType===`touch`,Ze=e=>{let n=t.current;if(!n.interactive||n.reduced||n.paused||Xe(e)){q=null;return}let i=He(e.clientX,e.clientY);if(!i)return;let a=r.performance.now()/1e3,o=q;if(!o){q={x:i.x,y:i.y,t:a};return}let s=i.x-o.x,c=i.y-o.y,l=Y().unit;if(Math.hypot(s,c)<l*.012&&a-o.t<.05)return;q={x:i.x,y:i.y,t:a};let u=C(n.push,0,3);if(u<=0)return;let d=l*.1*u,f=s*1.5*u,p=c*1.5*u,m=Math.hypot(f,p);m<.5||(m>d&&(f*=d/m,p*=d/m),qe({x:i.x,y:i.y,vx:f,vy:p,reach:l*.2,age:0,kind:0,speed:0,life:de}))},$=()=>{q=null},Qe=e=>{let n=t.current;if(e.button!==0||!n.interactive||Xe(e))return;let r=He(e.clientX,e.clientY);r&&Je(r.x,r.y,C(n.pulse,0,3))};Q.addEventListener(`pointermove`,Ze,{passive:!0}),Q.addEventListener(`pointerleave`,$),Q.addEventListener(`pointercancel`,$),Q.addEventListener(`pointerdown`,Qe,{passive:!0});let $e=new ResizeObserver(Ke);$e.observe(e);let et=new IntersectionObserver(e=>{ke=e.some(e=>e.isIntersecting),ke&&Z()},{rootMargin:`80px`});et.observe(e);let tt=()=>{n.hidden||Z()};n.addEventListener(`visibilitychange`,tt);let nt=e=>{e.preventDefault(),H=!0,U&&r.cancelAnimationFrame(U),U=0},rt=()=>{H=!1,De=!0,X(),Z()};i.addEventListener(`webglcontextlost`,nt),i.addEventListener(`webglcontextrestored`,rt),Ke(),Be();let it=Te(1,1);_.setRenderTarget(it);let at=[_.compileAsync(Se,w)];for(let e of[P,F])R.material=e,at.push(_.compileAsync(Ce,w));return _.setRenderTarget(null),R.material=I,at.push(_.compileAsync(Ce,w)),it.dispose(),Promise.all(at).catch(()=>{}).then(()=>{Ee||(De=!0,X(),Z())}),{sync:()=>{let e=Math.min(r.devicePixelRatio||1,2)*C(t.current.quality,.25,1);t.current.interactive||(q=null),Math.abs(e-K)>.001?Ke():X(),Z()},destroy:()=>{Ee=!0,U&&r.cancelAnimationFrame(U),U=0,Q.removeEventListener(`pointermove`,Ze),Q.removeEventListener(`pointerleave`,$),Q.removeEventListener(`pointercancel`,$),Q.removeEventListener(`pointerdown`,Qe),n.removeEventListener(`visibilitychange`,tt),i.removeEventListener(`webglcontextlost`,nt),i.removeEventListener(`webglcontextrestored`,rt),$e.disconnect(),et.disconnect(),Re(),L.geometry.dispose(),T.dispose(),[N,P,F,I].forEach(e=>e.dispose()),_.dispose(),_.forceContextLoss(),i.remove()},pulse:()=>{let e=Y();Je(e.cx,e.cy,C(t.current.pulse,0,3)||1)}}},N=(0,y.forwardRef)(function({colors:e=[`#2f6fe0`,`#b8f3ff`],backgroundColor:t=`#0a0a0a`,mode:n=`auto`,rings:i=6,particles:a=46e3,thickness:o=.34,folds:s=3,fold:c=.9,dust:l=.14,innerRadius:u=.42,outerRadius:d=1.3,flow:f=`outward`,flowSpeed:p=.05,morph:m=.13,lobes:h=3,turbulence:g=.45,morphSpeed:ee=.1,twist:te=.4,rotation:_=.01,aspect:ne=1,tilt:re=0,centerX:v=0,centerY:ae=0,scale:oe=1,particleSize:b=1.3,sizeVariance:se=.5,sparkle:ce=.05,prism:x=.04,twinkle:le=.3,fade:ue=.22,glow:de=.4,intensity:fe=1,grain:C=.3,interactive:w=!0,push:T=1,pulse:E=1,paused:D=!1,quality:me=1,audio:O,pointerTarget:k=`self`,className:he,style:ge,children:_e},ve){let ye=(0,y.useRef)(null),A=(0,y.useRef)(null),j=(0,y.useSyncExternalStore)(S,pe,()=>!1),be=(0,y.useRef)({colors:e,backgroundColor:t,mode:n,rings:i,particles:a,thickness:o,folds:s,fold:c,dust:l,innerRadius:u,outerRadius:d,flow:f,flowSpeed:p,morph:m,lobes:h,turbulence:g,morphSpeed:ee,twist:te,rotation:_,aspect:ne,tilt:re,centerX:v,centerY:ae,scale:oe,particleSize:b,sizeVariance:se,sparkle:ce,prism:x,twinkle:le,fade:ue,glow:de,intensity:fe,grain:C,interactive:w,push:T,pulse:E,paused:D,quality:me,audio:O,pointerTarget:k,reduced:j});return(0,y.useEffect)(()=>{be.current={colors:e,backgroundColor:t,mode:n,rings:i,particles:a,thickness:o,folds:s,fold:c,dust:l,innerRadius:u,outerRadius:d,flow:f,flowSpeed:p,morph:m,lobes:h,turbulence:g,morphSpeed:ee,twist:te,rotation:_,aspect:ne,tilt:re,centerX:v,centerY:ae,scale:oe,particleSize:b,sizeVariance:se,sparkle:ce,prism:x,twinkle:le,fade:ue,glow:de,intensity:fe,grain:C,interactive:w,push:T,pulse:E,paused:D,quality:me,audio:O,pointerTarget:k,reduced:j},A.current?.sync()}),(0,y.useEffect)(()=>{let e=ye.current;if(!e)return;let t=M(e,be);return A.current=t,()=>{t?.destroy(),A.current=null}},[]),(0,y.useImperativeHandle)(ve,()=>({pulse:()=>A.current?.pulse()}),[]),(0,ie.jsx)(`div`,{ref:ye,className:r(`relative isolate h-full min-h-[240px] w-full overflow-hidden`,he),style:{backgroundColor:t,...ge},children:_e&&(0,ie.jsx)(`div`,{className:`relative z-10 h-full w-full`,children:_e})})});N.displayName=`RingField`;export{N as RingField,N as default};