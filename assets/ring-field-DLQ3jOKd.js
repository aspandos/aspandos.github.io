import{a as e,n as t,t as n}from"./jsx-runtime-Wy9s6hX0.js";import{c as r}from"./index-C3P5Zkl5.js";import{C as i,D as a,E as o,O as s,b as c,c as l,d as u,g as d,h as f,j as p,k as m,l as h,p as g,r as _,t as ee,u as v,v as te,w as y,y as ne}from"./three.module-BHP7aZW1.js";var b=e(t(),1),re=n(),ie=24,ae=3.6,x=Math.PI*2,oe=26e3,se=360,S=32,ce=4,le=.32,ue=2.6,de=3.6,C=e=>{let t=window.matchMedia(`(prefers-reduced-motion: reduce)`);return t.addEventListener(`change`,e),()=>t.removeEventListener(`change`,e)},fe=()=>typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,w=(e,t,n)=>Math.min(n,Math.max(t,Number.isFinite(e)?e:t)),T=null,E=new Map,D=(e,t,n)=>{let r=E.get(t);if(r)return r;if(T||=e.createElement(`canvas`).getContext(`2d`),!T)return n;T.fillStyle=`#010203`,T.fillStyle=t;let i=String(T.fillStyle),a=n;if(i===`#010203`&&t.trim().toLowerCase()!==`#010203`)a=n;else if(i.startsWith(`#`)){let e=i.slice(1);a=[parseInt(e.slice(0,2),16)/255,parseInt(e.slice(2,4),16)/255,parseInt(e.slice(4,6),16)/255]}else{let e=i.match(/[\d.]+/g);e&&e.length>=3&&(a=[Number(e[0])/255,Number(e[1])/255,Number(e[2])/255])}return E.size>48&&E.clear(),E.set(t,a),a},O=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,pe=([e,t,n])=>{let r=O(e),i=O(t),a=O(n),o=Math.cbrt(.4122214708*r+.5363325363*i+.0514459929*a),s=Math.cbrt(.2119034982*r+.6806995451*i+.1073969566*a),c=Math.cbrt(.0883024619*r+.2817188376*i+.6299787005*a);return[.2104542553*o+.793617785*s-.0040720468*c,1.9779984951*o-2.428592205*s+.4505937099*c,.0259040371*o+.7827717662*s-.808675766*c]},k=([e,t,n])=>{let r=(e+.3963377774*t+.2158037573*n)**3,i=(e-.1055613458*t-.0638541728*n)**3,a=(e-.0894841775*t-1.291485548*n)**3;return[4.0767416621*r-3.3077115913*i+.2309699292*a,-1.2684380046*r+2.6097574011*i-.3413193965*a,-.0041960863*r-.7034186147*i+1.707614701*a]},me=([e,t,n])=>{let r=w(e*.8,.3,.55),i=0,a=1.15;for(let e=0;e<16;e++){let e=(i+a)/2,o=k([r,t*e,n*e]);Math.min(o[0],o[1],o[2])>=-.001&&Math.max(o[0],o[1],o[2])<=1.001?i=e:a=e}return[r,t*i,n*i]},he=`
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
uniform vec4 uKickA[${S}];
uniform vec4 uKickB[${S}];
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
  for (int i = 0; i < ${S}; i++) {
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
`,j=e=>{let t=e;return()=>(t=t*16807%2147483647,t/2147483647)},be=e=>{let t=j(29),n=()=>{let e=Math.max(t(),1e-9);return Math.sqrt(-2*Math.log(e))*Math.cos(x*t())},r=new Float32Array(e*8);for(let i=0;i<e;i++){let e=t()<.3?1-.16*t()*t():1-2*t()**.85;r.set([t()*x,e,t(),t(),t(),t(),w(n(),-3,3),w(n(),-3,3)],i*8)}let i=new _,a=new v(r,8);return i.setAttribute(`aSeed`,new u(a,4,0)),i.setAttribute(`aTrait`,new u(a,4,4)),i.setAttribute(`position`,new u(a,3,0)),i},M=(e,t)=>{let n=e.ownerDocument,r=n.defaultView??window,u=n.createElement(`canvas`);u.setAttribute(`aria-hidden`,`true`),u.style.cssText=`position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none`,e.prepend(u);let v;try{v=new ee({canvas:u,alpha:!1,antialias:!1,powerPreference:`high-performance`})}catch{return u.remove(),null}if(!v.capabilities.isWebGL2)return v.dispose(),u.remove(),null;v.autoClear=!1;let b=v.extensions.has(`EXT_color_buffer_float`)||v.extensions.has(`EXT_color_buffer_half_float`)?h:o,re=v.getContext(),C=re.getParameter(re.ALIASED_POINT_SIZE_RANGE),fe=C&&C.length>1?Math.max(8,C[1]):64,T=new d(-1,1,1,-1,0,1),E=new te(2,2),k=Array.from({length:S},()=>new m(0,0,1,-1)),j=Array.from({length:S},()=>new m),M=[],N=new y({glslVersion:l,uniforms:{uResolution:{value:new a(1,1)},uCenter:{value:new a},uUnit:{value:1},uDistance:{value:ae},uIncline:{value:0},uAspect:{value:1},uRings:{value:7},uFlow:{value:0},uInner:{value:.14},uOuter:{value:1.05},uThickness:{value:.34},uFolds:{value:3},uFold:{value:.9},uDust:{value:.14},uMorph:{value:.11},uLobes:{value:3},uTurbulence:{value:.35},uShape:{value:0},uTwist:{value:.35},uRotation:{value:0},uFadeIn:{value:.2},uFadeOut:{value:.3},uPixelRatio:{value:1},uMaxPoint:{value:64},uSize:{value:1.5},uSizeVariance:{value:.5},uSparkle:{value:.05},uPrism:{value:.04},uTwinkle:{value:.3},uTime:{value:0},uGain:{value:1},uInk:{value:0},uLabA:{value:new s},uLabB:{value:new s},uInkA:{value:new s},uInkB:{value:new s},uKickA:{value:k},uKickB:{value:j},uKickTime:{value:le}},vertexShader:he,fragmentShader:ge,depthTest:!1,depthWrite:!1,transparent:!0,blending:5,blendEquation:100,blendSrc:201,blendDst:201,blendSrcAlpha:201,blendDstAlpha:201}),xe=(e,t)=>new y({glslVersion:l,uniforms:t,vertexShader:_e,fragmentShader:e,depthTest:!1,depthWrite:!1,blending:0}),P=xe(ve,{uSource:{value:null},uTexel:{value:new a}}),F=xe(ye,{uSource:{value:null},uBase:{value:null},uTexel:{value:new a},uKeep:{value:.62}}),I=xe(A,{uLines:{value:null},uBloom:{value:null},uBackground:{value:new s},uGlow:{value:.45},uExposure:{value:1},uMode:{value:0},uGrain:{value:.3},uSeed:{value:0}}),L=new ne(new _,N);L.frustumCulled=!1;let Se=new i;Se.add(L);let Ce=new f(E,I);Ce.frustumCulled=!1;let we=new i;we.add(Ce);let R=0,Te=(e,t)=>new p(Math.max(1,e),Math.max(1,t),{type:b,format:c,minFilter:g,magFilter:g,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1}),z=null,B=[],V=[],Ee=!1,H=!1,U=0,De=0,W=!0,G=1,K=1,Oe=1,ke=1,q=1,Ae=0,je=0,Me=.37,Ne=6.2,Pe=0,J=null,Y={level:0,bass:0,mid:0,high:0,beat:0},Fe=0,Ie=()=>{z?.dispose(),B.forEach(e=>e.dispose()),V.forEach(e=>e.dispose()),z=null,B=[],V=[]},Le=(e,t)=>{Ce.material=e,v.setRenderTarget(t),v.render(we,T)},Re=()=>{let e=Math.round(w(t.current.particles,2e3,2e5));e!==R&&(R=e,L.geometry.dispose(),L.geometry=be(e))},X=()=>{let e=t.current,n=Oe,r=ke;return{unit:.5*Math.min(Math.max(n,r),1.6*Math.min(n,r))*w(e.scale*(1+.07*Y.bass+.03*Y.beat),.2,4),cx:(.5+.5*w(e.centerX,-1.5,1.5))*n,cy:(.5-.5*w(e.centerY,-1.5,1.5))*r,incline:w(e.tilt,0,80)*Math.PI/180,aspect:w(e.aspect,.25,4)}},ze=()=>{let e=t.current,n=w(e.innerRadius,0,3);return{inner:n,outer:Math.max(w(e.outerRadius,.05,4),n+.05)}},Be=(t,n)=>{let r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return null;let i=(t-r.left)*(G/r.width),a=(n-r.top)*(K/r.height);return{x:Oe/G*i,y:(K-a)*(ke/K)}},Ve=()=>{let e=t.current,r=N.uniforms,i=X(),{inner:a,outer:o}=ze(),s=D(n,e.backgroundColor,[.04,.04,.04]),c=.2126*s[0]+.7152*s[1]+.0722*s[2],l=e.mode===`ink`||e.mode===`auto`&&c>.5,u=pe(D(n,e.colors[0],[.17,.78,1])),d=pe(D(n,e.colors[1],[.61,.96,.89])),f=Math.round(w(e.rings,2,ie)),p=w(e.fade,0,1);if(r.uResolution.value.set(Oe,ke),r.uCenter.value.set(i.cx,i.cy),r.uUnit.value=i.unit,r.uIncline.value=i.incline,r.uAspect.value=i.aspect,r.uRings.value=f,r.uFlow.value=Me,r.uInner.value=a,r.uOuter.value=o,r.uThickness.value=w(e.thickness,0,2),r.uFolds.value=Math.round(w(e.folds,0,12)),r.uFold.value=w(e.fold,0,1),r.uDust.value=w(e.dust,0,1),r.uMorph.value=w(e.morph,0,.6),r.uLobes.value=Math.round(w(e.lobes,0,12)),r.uTurbulence.value=w(e.turbulence+.7*Y.mid,0,2),r.uShape.value=Ne,r.uTwist.value=w(e.twist,-Math.PI,Math.PI),r.uRotation.value=Pe,r.uFadeIn.value=Math.max(.04,p),r.uFadeOut.value=Math.max(.04,p),r.uPixelRatio.value=q,r.uMaxPoint.value=fe,r.uSize.value=w(e.particleSize,.3,8),r.uSizeVariance.value=w(e.sizeVariance,0,1),r.uSparkle.value=w(e.sparkle+.45*Y.high,0,1),r.uPrism.value=w(e.prism,0,.5),r.uTwinkle.value=e.reduced?0:w(e.twinkle+.4*Y.high,0,1),r.uTime.value=je,r.uInk.value=+!!l,r.uLabA.value.set(u[0],u[1],u[2]),r.uLabB.value.set(d[0],d[1],d[2]),l){let e=me(u),t=me(d);r.uInkA.value.set(e[0],e[1],e[2]),r.uInkB.value.set(t[0],t[1],t[2])}let m=(i.unit/q/se)**2,h=w(m,.25,1)*w(e.quality,.25,1);L.geometry.setDrawRange(0,Math.round(R*h)),r.uGain.value=.6*Math.sqrt(oe/R)*w(m/h,.5,4);for(let e=0;e<S;e++){let t=M[e];t?(k[e].set(t.x,t.y,t.reach,t.age),j[e].set(t.vx,t.vy,t.kind,t.speed)):k[e].w=-1}let g=I.uniforms;g.uBackground.value.set(O(s[0]),O(s[1]),O(s[2])),g.uGlow.value=w(e.glow*(1+1.6*Y.bass+.9*Y.beat),0,3)*(l?.5:1),g.uExposure.value=(l?2.2:1)*w(e.intensity*(1+.55*Y.level+.35*Y.beat),0,4),g.uMode.value=+!!l,g.uGrain.value=w(e.grain,0,1),g.uSeed.value=Ae},He=()=>{if(!z||!B.length||H)return;Re(),Ve(),v.setRenderTarget(z),v.setClearColor(0,0),v.clear(),v.render(Se,T);let e=z;for(let t of B)P.uniforms.uSource.value=e.texture,P.uniforms.uTexel.value.set(1/e.width,1/e.height),Le(P,t),e=t;let t=B[B.length-1];for(let e=B.length-2;e>=0;e--)F.uniforms.uSource.value=t.texture,F.uniforms.uBase.value=B[e].texture,F.uniforms.uTexel.value.set(1/t.width,1/t.height),Le(F,V[e]),t=V[e];I.uniforms.uLines.value=z.texture,I.uniforms.uBloom.value=t.texture,Le(I,null)},Ue=e=>{let n=t.current;if(n.paused||n.reduced)return;let r=n.audio?.();for(let t of[`level`,`bass`,`mid`,`high`,`beat`]){let n=r?w(r[t],0,1):0;Y[t]+=(n-Y[t])*(1-Math.exp(-e*(n>Y[t]?22:5)))}if(r&&r.beat>.95&&Fe<=.95){let e=X();qe(e.cx,e.cy,w(n.pulse,0,3)*(.45+.8*Y.bass))}Fe=r?r.beat:0,je+=e;let i=n.flow===`inward`?-1:1;Me+=e*i*w(n.flowSpeed*(1+2.6*Y.level+1.2*Y.beat),0,2),Ne+=e*w(n.morphSpeed*(1+1.6*Y.mid),0,2),Pe=(Pe+e*w(n.rotation*(1+2*Y.level),-3,3))%x;for(let t=M.length-1;t>=0;t--)M[t].age+=e,M[t].age>M[t].life&&M.splice(t,1);Ae=(Ae+.618034)%1},We=e=>{if(U=0,Ee||H)return;let i=Math.min(.05,Math.max(0,(e-De)/1e3));De=e,Ue(i),He();let a=t.current;W&&!n.hidden&&!a.paused&&!a.reduced&&(U=r.requestAnimationFrame(We))};function Z(){Ee||H||U||!W||(De=r.performance.now(),U=r.requestAnimationFrame(We))}let Ge=()=>{let n=e.getBoundingClientRect();G=Math.max(1,e.clientWidth||n.width),K=Math.max(1,e.clientHeight||n.height),q=Math.min(r.devicePixelRatio||1,2)*w(t.current.quality,.25,1),v.setPixelRatio(q),v.setSize(G,K,!1);let i=Math.max(1,Math.floor(G*q)),a=Math.max(1,Math.floor(K*q));Oe=i,ke=a,Ie(),z=Te(i,a);let o=w(Math.floor(Math.log2(Math.min(i,a)/8)),3,7);for(let e=1;e<=o;e++)B.push(Te(Math.max(1,i>>e),Math.max(1,a>>e))),V.push(Te(Math.max(1,i>>e),Math.max(1,a>>e)));He(),Z()},Ke=e=>{let t=M.filter(t=>t.kind===e.kind),n=e.kind===1?ce:28;t.length>=n&&M.splice(M.indexOf(t[0]),1),M.push(e),Z()},qe=(e,n,r)=>{let i=t.current;if(i.reduced||i.paused||r<=0)return;let a=X().unit;Ke({x:e,y:n,vx:a*.11*r,vy:0,reach:a*.9,age:0,kind:1,speed:a*1.25,life:de})},Je=t.current.pointerTarget===`window`,Q=Je?r:e,Ye=e=>Je&&e.pointerType===`touch`,Xe=e=>{let n=t.current;if(!n.interactive||n.reduced||n.paused||Ye(e)){J=null;return}let i=Be(e.clientX,e.clientY);if(!i)return;let a=r.performance.now()/1e3,o=J;if(!o){J={x:i.x,y:i.y,t:a};return}let s=i.x-o.x,c=i.y-o.y,l=X().unit;if(Math.hypot(s,c)<l*.012&&a-o.t<.05)return;J={x:i.x,y:i.y,t:a};let u=w(n.push,0,3);if(u<=0)return;let d=l*.1*u,f=s*1.5*u,p=c*1.5*u,m=Math.hypot(f,p);m<.5||(m>d&&(f*=d/m,p*=d/m),Ke({x:i.x,y:i.y,vx:f,vy:p,reach:l*.2,age:0,kind:0,speed:0,life:ue}))},$=()=>{J=null},Ze=e=>{let n=t.current;if(e.button!==0||!n.interactive||Ye(e))return;let r=Be(e.clientX,e.clientY);r&&qe(r.x,r.y,w(n.pulse,0,3))};Q.addEventListener(`pointermove`,Xe,{passive:!0}),Q.addEventListener(`pointerleave`,$),Q.addEventListener(`pointercancel`,$),Q.addEventListener(`pointerdown`,Ze,{passive:!0});let Qe=new ResizeObserver(Ge);Qe.observe(e);let $e=new IntersectionObserver(e=>{W=e.some(e=>e.isIntersecting),W&&Z()},{rootMargin:`80px`});$e.observe(e);let et=()=>{n.hidden||Z()};n.addEventListener(`visibilitychange`,et);let tt=e=>{e.preventDefault(),H=!0,U&&r.cancelAnimationFrame(U),U=0},nt=()=>{H=!1,He(),Z()};return u.addEventListener(`webglcontextlost`,tt),u.addEventListener(`webglcontextrestored`,nt),Ge(),{sync:()=>{let e=Math.min(r.devicePixelRatio||1,2)*w(t.current.quality,.25,1);t.current.interactive||(J=null),Math.abs(e-q)>.001?Ge():He(),Z()},destroy:()=>{Ee=!0,U&&r.cancelAnimationFrame(U),U=0,Q.removeEventListener(`pointermove`,Xe),Q.removeEventListener(`pointerleave`,$),Q.removeEventListener(`pointercancel`,$),Q.removeEventListener(`pointerdown`,Ze),n.removeEventListener(`visibilitychange`,et),u.removeEventListener(`webglcontextlost`,tt),u.removeEventListener(`webglcontextrestored`,nt),Qe.disconnect(),$e.disconnect(),Ie(),L.geometry.dispose(),E.dispose(),[N,P,F,I].forEach(e=>e.dispose()),v.dispose(),v.forceContextLoss(),u.remove()},pulse:()=>{let e=X();qe(e.cx,e.cy,w(t.current.pulse,0,3)||1)}}},N=(0,b.forwardRef)(function({colors:e=[`#2f6fe0`,`#b8f3ff`],backgroundColor:t=`#0a0a0a`,mode:n=`auto`,rings:i=6,particles:a=46e3,thickness:o=.34,folds:s=3,fold:c=.9,dust:l=.14,innerRadius:u=.42,outerRadius:d=1.3,flow:f=`outward`,flowSpeed:p=.05,morph:m=.13,lobes:h=3,turbulence:g=.45,morphSpeed:_=.1,twist:ee=.4,rotation:v=.01,aspect:te=1,tilt:y=0,centerX:ne=0,centerY:ie=0,scale:ae=1,particleSize:x=1.3,sizeVariance:oe=.5,sparkle:se=.05,prism:S=.04,twinkle:ce=.3,fade:le=.22,glow:ue=.4,intensity:de=1,grain:w=.3,interactive:T=!0,push:E=1,pulse:D=1,paused:O=!1,quality:pe=1,audio:k,pointerTarget:me=`self`,className:he,style:ge,children:_e},ve){let ye=(0,b.useRef)(null),A=(0,b.useRef)(null),j=(0,b.useSyncExternalStore)(C,fe,()=>!1),be=(0,b.useRef)({colors:e,backgroundColor:t,mode:n,rings:i,particles:a,thickness:o,folds:s,fold:c,dust:l,innerRadius:u,outerRadius:d,flow:f,flowSpeed:p,morph:m,lobes:h,turbulence:g,morphSpeed:_,twist:ee,rotation:v,aspect:te,tilt:y,centerX:ne,centerY:ie,scale:ae,particleSize:x,sizeVariance:oe,sparkle:se,prism:S,twinkle:ce,fade:le,glow:ue,intensity:de,grain:w,interactive:T,push:E,pulse:D,paused:O,quality:pe,audio:k,pointerTarget:me,reduced:j});return(0,b.useEffect)(()=>{be.current={colors:e,backgroundColor:t,mode:n,rings:i,particles:a,thickness:o,folds:s,fold:c,dust:l,innerRadius:u,outerRadius:d,flow:f,flowSpeed:p,morph:m,lobes:h,turbulence:g,morphSpeed:_,twist:ee,rotation:v,aspect:te,tilt:y,centerX:ne,centerY:ie,scale:ae,particleSize:x,sizeVariance:oe,sparkle:se,prism:S,twinkle:ce,fade:le,glow:ue,intensity:de,grain:w,interactive:T,push:E,pulse:D,paused:O,quality:pe,audio:k,pointerTarget:me,reduced:j},A.current?.sync()}),(0,b.useEffect)(()=>{let e=ye.current;if(!e)return;let t=M(e,be);return A.current=t,()=>{t?.destroy(),A.current=null}},[]),(0,b.useImperativeHandle)(ve,()=>({pulse:()=>A.current?.pulse()}),[]),(0,re.jsx)(`div`,{ref:ye,className:r(`relative isolate h-full min-h-[240px] w-full overflow-hidden`,he),style:{backgroundColor:t,...ge},children:_e&&(0,re.jsx)(`div`,{className:`relative z-10 h-full w-full`,children:_e})})});N.displayName=`RingField`;export{N as RingField,N as default};