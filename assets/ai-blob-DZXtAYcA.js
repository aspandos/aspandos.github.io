import{a as e,n as t,t as n}from"./jsx-runtime-Wy9s6hX0.js";import{c as r}from"./index-W8FtIVmm.js";import{C as i,D as a,O as o,g as s,h as c,o as l,t as u,v as d,w as ee}from"./three.module-BHP7aZW1.js";var f=e(t(),1),p=n(),m={idle:{speed:1,color:1,react:.4,listen:0,think:0},listening:{speed:1.2,color:1.3,react:.8,listen:1,think:0},thinking:{speed:2.2,color:4,react:.3,listen:.2,think:1},speaking:{speed:1.5,color:1.8,react:1,listen:.3,think:0}},h=[`#ff006e`,`#8338ec`,`#3a86ff`,`#06ffa5`],g=(e,t,n)=>Math.min(n,Math.max(t,e)),_=(e,t)=>Number.isFinite(e)?e:t,te=(e,t,n)=>{let r=g((n-e)/(t-e),0,1);return r*r*(3-2*r)},v=new l,y=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,b=(e,t)=>{try{v.setStyle((e??t).trim()||t,``)}catch{v.setStyle(t,``)}let n=y(v.r),r=y(v.g),i=y(v.b),a=Math.cbrt(.4122214708*n+.5363325363*r+.0514459929*i),s=Math.cbrt(.2119034982*n+.6806995451*r+.1073969566*i),c=Math.cbrt(.0883024619*n+.2817188376*r+.6299787005*i),l=.2104542553*a+.793617785*s-.0040720468*c,u=1.9779984951*a-2.428592205*s+.4505937099*c,d=.0259040371*a+.7827717662*s-.808675766*c;return new o(l,Math.hypot(u,d),Math.atan2(d,u))},x=e=>{let t=window.matchMedia(`(prefers-reduced-motion: reduce)`);return t.addEventListener(`change`,e),()=>t.removeEventListener(`change`,e)},S=()=>window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,ne=`
void main() {
  gl_Position = vec4(position, 1.0);
}
`,re=`
precision highp float;

uniform float uTime;
uniform float uColorTime;
uniform vec2 uResolution;
uniform float uGlowIntensity;
uniform float uNoiseScale;
uniform float uInnerScale;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uRimWidth;
uniform float uRimIntensity;
uniform float uCoreIntensity;
uniform float uGlints;
uniform float uHalo;
uniform float uWobble;
uniform float uLevel;
uniform float uReact;
uniform float uListen;
uniform float uThink;
uniform vec2 uLook;
uniform float uJiggle;
uniform float uTapAngle;
uniform float uTapAge;
uniform float uInk;
uniform float uFade;
uniform float uGrow;

#define PI_TWO 6.28318530718

float rng(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float perlin(vec2 p) {
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);
  float res = mix(
    mix(rng(ip), rng(ip + vec2(1.0, 0.0)), u.x),
    mix(rng(ip + vec2(0.0, 1.0)), rng(ip + vec2(1.0, 1.0)), u.x),
    u.y
  );
  return res * res;
}

float fractal(vec2 p) {
  return (perlin(p) * 0.5 + perlin(p * 2.0) * 0.25) / 0.75;
}

float brightness(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

mat3 rotateX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

mat3 rotateY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

mat3 rotateZ(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

vec3 blendHue(vec3 a, vec3 b, float k) {
  float turn = b.z - a.z;
  turn -= PI_TWO * floor((turn + 3.14159265) / PI_TWO);
  float lightness = mix(a.x, b.x, k);
  float chroma = mix(a.y, b.y, k);
  float hue = a.z + turn * k;
  vec3 lms = mat3(1.0, 1.0, 1.0, 0.3963377774, -0.1055613458, -0.0894841775, 0.2158037573, -0.0638541728, -1.291485548) * vec3(lightness, chroma * cos(hue), chroma * sin(hue));
  lms = lms * lms * lms;
  vec3 linear = mat3(4.0767416621, -1.2684380046, -0.0041960863, -3.3077115913, 2.6097574011, -0.7034186147, 0.2309699292, -0.3413193965, 1.707614701) * lms;
  return pow(clamp(linear, 0.0, 1.0), vec3(1.0 / 2.2));
}

vec3 ramp(float t) {
  float g = fract(t) * 4.0;
  if (g < 1.0) return blendHue(uColor1, uColor2, smoothstep(0.0, 1.0, g));
  if (g < 2.0) return blendHue(uColor2, uColor3, smoothstep(0.0, 1.0, g - 1.0));
  if (g < 3.0) return blendHue(uColor3, uColor4, smoothstep(0.0, 1.0, g - 2.0));
  return blendHue(uColor4, uColor1, smoothstep(0.0, 1.0, g - 3.0));
}

void main() {
  float minRes = min(uResolution.x, uResolution.y);
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / minRes * 1.5;
  float t = uTime;

  float bearing = atan(uv.y, uv.x);
  float squish = uJiggle * exp(-uTapAge * 3.0) * sin(uTapAge * 13.0) * 0.07 * cos(2.0 * (bearing - uTapAngle));
  float sway = uWobble * 0.035 * (sin(3.0 * bearing + t * 0.9) * sin(t * 0.6) + 0.6 * sin(2.0 * bearing - t * 0.7 + 1.3));
  uv /= max(uGrow * (1.0 + uLevel * uReact * 0.06 + squish + sway), 0.05);

  float l = dot(uv, uv);
  if (l > 2.5) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float sm = smoothstep(1.04, 0.96, l);
  float z = sqrt(max(0.0, 1.0 - min(l, 1.0)));
  vec3 noisePos = normalize(vec3(uv.x, uv.y, z));

  float angleX = sin(t * 0.23) * 1.5 + cos(t * 0.37) * 0.6 + uLook.y * 0.6;
  float angleY = sin(t * 0.19) * 1.3 + cos(t * 0.41) * 0.7 - uLook.x * 0.6;
  float angleZ = sin(t * 0.31) * 1.1 + cos(t * 0.29) * 0.5;
  noisePos = rotateX(angleX) * noisePos;
  noisePos = rotateY(angleY) * noisePos;
  noisePos = rotateZ(angleZ) * noisePos;

  float d = sm * l * l * l * 2.0;
  vec3 norm = normalize(vec3(uv.x, uv.y, 0.7 - d));

  float nx = fractal(noisePos.xy * 2.0 * uNoiseScale / 3.0 + t * 0.4 + 25.69);
  float ny = fractal(noisePos.xy * 2.0 * uNoiseScale / 3.0 + t * 0.4 + 86.31);
  float n = fractal(noisePos.xy * uNoiseScale + 2.0 * vec2(nx, ny));
  vec3 col = vec3(n * 0.5 + 0.25);
  vec3 gradientColor = ramp(atan(noisePos.y, noisePos.x) / PI_TWO + uColorTime * 0.1);

  col *= gradientColor;
  col *= 2.0 * uGlowIntensity * 1.25 * (1.0 + uListen * 0.35 + uLevel * uReact * 0.6);
  vec3 cd = abs(col);
  vec3 c = col * d * uRimIntensity;

  vec3 lightDir = normalize(vec3(uLook.x * 0.35, uLook.y * 0.35, -1.0));
  float lightDot = max(0.0, dot(norm, lightDir));
  float glint = lightDot * lightDot * lightDot * lightDot * lightDot * 3.0 * uGlints;
  c += (c * 0.5 + vec3(1.0) - brightness(c)) * glint;

  float inner = 1.0 - 0.02 * max(uRimWidth, 0.05);
  float outline = max((1.0 - smoothstep(1.0, inner, l) - pow(max(0.0, length(uv) - 1.0), 0.2)) * 2.0, 0.0);
  col = c + col * outline * outline * outline * outline * uRimIntensity;

  float f = fractal(noisePos.xy * 2.0 + t) + 0.1;
  vec2 innerUV = uv * (f + 0.1) * 0.5 / max(uInnerScale, 0.05);
  float innerL = dot(innerUV, innerUV);
  vec3 ins = normalize(cd + 0.0001) + 0.1;
  float ind = 0.2 + pow(smoothstep(0.0, 1.5, sqrt(innerL)) * 48.0, 0.25);
  ind *= ind * ind * ind;
  ind = 1.0 / ind;
  ins *= ind;
  float pulse = uCoreIntensity * (1.0 + uLevel * uReact * 0.9 + uThink * 0.3 * sin(t * 3.5) + uJiggle * exp(-uTapAge * 2.0) * 0.9);
  vec3 coreGlow = ins * ins * smoothstep(0.05, 1.0, ind);
  vec3 core = (1.0 - exp(-coreGlow * 3.0)) * sm * uGlowIntensity * 1.15 * pulse;
  vec3 shade = abs(norm) * (1.0 - d) * sm * 0.25;

  float edgeDist = length(uv);
  float edgeFalloff = smoothstep(1.0, 0.95, edgeDist);
  float spread = max(uHalo, 0.05);
  float halo = exp(-max(edgeDist - 1.0, 0.0) * (14.0 / spread)) * smoothstep(0.96, 1.0, edgeDist) * uGlowIntensity * min(spread, 1.5) * (1.0 + uLevel * uReact + uListen * 0.4);
  vec3 vivid = gradientColor / max(max(gradientColor.r, max(gradientColor.g, gradientColor.b)), 0.0001);

  if (uInk > 0.5) {
    float inside = smoothstep(1.012, 0.988, edgeDist);
    float line = clamp(outline * outline * outline * outline * uRimIntensity * 0.9, 0.0, 1.0);
    float band = clamp(pow(d * (n * 0.9 + 0.2) * 0.55, 1.7) * uRimIntensity * 1.3, 0.0, 1.0);
    float rimA = clamp(line + band, 0.0, 1.0) * inside;
    float coreA = clamp(pow(brightness(core), 2.2) * 1.8, 0.0, 0.85);
    float haloA = clamp(halo * 0.28, 0.0, 1.0) * (1.0 - inside * 0.6);
    vec3 coreInk = mix(vivid, vec3(1.0), 0.18) * 0.9;
    float weight = max(rimA + coreA + haloA, 0.0001);
    vec3 paint = (vivid * 0.82 * rimA + coreInk * coreA + vivid * haloA) / weight;
    float cover = 1.0 - (1.0 - rimA) * (1.0 - coreA) * (1.0 - haloA);
    gl_FragColor = vec4(paint, clamp(cover, 0.0, 1.0) * uFade);
    return;
  }

  col += core + shade;
  float alpha = clamp(sm * pow(brightness(col), 2.5) * 2.0, 0.0, 1.0) * edgeFalloff;
  col = pow(max(col, 0.0), vec3(0.95));
  float glowA = clamp(halo * 0.35, 0.0, 1.0) * (1.0 - alpha);
  float total = alpha + glowA;
  vec3 mixed = (col * alpha + vivid * 1.1 * glowA) / max(total, 0.0001);
  gl_FragColor = vec4(mixed, clamp(total, 0.0, 1.0) * uFade);
}
`;function C(e,t,n){let r=e.ownerDocument,l=r.defaultView??window,f;try{f=new u({antialias:!0,alpha:!0,powerPreference:`high-performance`,premultipliedAlpha:!1,stencil:!1,depth:!1})}catch{return null}f.setClearColor(0,0);let p=f.domElement;p.setAttribute(`aria-hidden`,`true`),p.style.cssText=`position:absolute;inset:0;width:100%;height:100%;display:block;background:transparent`,t.appendChild(p);let v=()=>n.current,y={uTime:{value:0},uColorTime:{value:0},uResolution:{value:new a(1,1)},uGlowIntensity:{value:.8},uNoiseScale:{value:3},uInnerScale:{value:1},uColor1:{value:new o},uColor2:{value:new o},uColor3:{value:new o},uColor4:{value:new o},uRimWidth:{value:1},uRimIntensity:{value:1},uCoreIntensity:{value:1},uGlints:{value:1},uHalo:{value:1},uWobble:{value:0},uLevel:{value:0},uReact:{value:.4},uListen:{value:0},uThink:{value:0},uLook:{value:new a},uJiggle:{value:0},uTapAngle:{value:0},uTapAge:{value:10},uInk:{value:0},uFade:{value:1},uGrow:{value:1}},x=new ee({uniforms:y,vertexShader:ne,fragmentShader:re,transparent:!1,blending:0,depthTest:!1,depthWrite:!1}),S=new d(2,2),C=new c(S,x);C.frustumCulled=!1;let w=new i;w.add(C);let ie=new s(-1,1,1,-1,0,1),T=0,E=0,D=1,O=!1,k=``,A=-10,j=0,M=0,N=0,P=0,F=0,I=0,L=0,R=0,ae=0,z=10,B=-1,V=1,H=0,U=1,W=0,G=0,K=!1,q=!1,J=!1,Y=null,X={...m.idle},oe=()=>{let t=e.parentElement;for(;t;){let e=l.getComputedStyle(t).backgroundColor.match(/rgba?\(([^)]+)\)/);if(e){let t=e[1].split(`,`).map(e=>Number.parseFloat(e));if(t.length<4||t[3]>.05)return .2126*t[0]+.7152*t[1]+.0722*t[2]>140}t=t.parentElement}return!l.matchMedia(`(prefers-color-scheme: dark)`).matches},se=()=>{let e=v(),t=e.colors.length?e.colors:h,n=t.join(`|`);if(n===k)return;k=n;let r=e=>b(t[e]??t[e%t.length],h[e]);y.uColor1.value.copy(r(0)),y.uColor2.value.copy(r(1)),y.uColor3.value.copy(r(2)),y.uColor4.value.copy(r(3))},ce=()=>{let e=v();y.uInk.value=e.blend===`ink`?1:e.blend===`glow`?0:+!!oe()},Z=()=>{let t=v(),n=Math.round(e.clientWidth),r=Math.round(e.clientHeight);if(n<2||r<2)return O=!1,!1;let i=Math.min(l.devicePixelRatio||1,2)*g(_(t.resolution,1),.25,2);return O&&n===T&&r===E&&i===D?!1:(O=!0,T=n,E=r,D=i,f.setPixelRatio(D),f.setSize(T,E,!1),y.uResolution.value.set(T*D,E*D),!0)},le=(e,t)=>(.5+.5*Math.sin(e*9+2*Math.sin(e*2.3)))**3*te(.2,.65,.5+.35*Math.sin(e*.9)+.25*Math.sin(e*2.1+1))*(.7+.3*Math.sin(e*13.7))*(t===`speaking`?1:.6),ue=(e,t)=>{if(e.getVolume)try{return g(_(e.getVolume(),0),0,1)}catch{return 0}return e.volume===void 0?e.autoVolume&&(e.state===`listening`||e.state===`speaking`)?le(t/1e3,e.state):0:g(_(e.volume,0),0,1)},Q=()=>{if(!O)return;let e=v();performance.now()-A>1e3&&(A=performance.now(),ce()),se(),y.uTime.value=j,y.uColorTime.value=M,y.uGlowIntensity.value=g(_(e.glowIntensity,.8),0,3),y.uNoiseScale.value=g(_(e.noiseScale,3),.1,20),y.uInnerScale.value=g(_(e.innerScale,1),.05,5),y.uRimWidth.value=g(_(e.rimWidth,1),.05,6),y.uRimIntensity.value=g(_(e.rimIntensity,1),0,3),y.uCoreIntensity.value=g(_(e.coreIntensity,1),0,3),y.uGlints.value=g(_(e.glints,1),0,3),y.uHalo.value=g(_(e.halo,1),0,3),y.uWobble.value=e.reduced?0:g(_(e.wobble,0),0,3),y.uLevel.value=N,y.uReact.value=g(_(e.reactivity,1),0,3)*X.react,y.uListen.value=X.listen,y.uThink.value=X.think,y.uLook.value.set(P,F),y.uJiggle.value=R,y.uTapAngle.value=ae,y.uTapAge.value=z,y.uFade.value=U,y.uGrow.value=V,f.render(w,ie)},$=()=>{q||J||!K||W||(W=requestAnimationFrame(de))},de=e=>{if(W=0,q||J)return;let t=v(),n=G&&e-G<100?Math.min(Math.max((e-G)/1e3,0),.05):1/60;G=e;let i=!t.reduced&&!t.paused,a=m[t.state]??m.idle,o=t.reduced?1:1-Math.exp(-n/.35);if(X.speed+=(a.speed-X.speed)*o,X.color+=(a.color-X.color)*o,X.react+=(a.react-X.react)*o,X.listen+=(a.listen-X.listen)*o,X.think+=(a.think-X.think)*o,i){let e=g(_(t.animationSpeed,1),0,5);j+=n*e*X.speed,M+=n*e*g(_(t.colorSpeed,1),0,5)*X.color,z+=n,z>6&&(R=0)}let s=i?ue(t,e):0;N+=(s-N)*(1-Math.exp(-n/(s>N?.05:.22)));let c=t.reduced?1:1-Math.exp(-n/.35);P+=(I-P)*c,F+=(L-F)*c,t.intro&&!t.reduced?(B<0&&(B=e),U=g((e-B)/450,0,1),H+=(-70*(V-1)-9*H)*n,V+=H*n):(U=1,V=1,H=0),Q();let l=Math.abs(I-P)+Math.abs(L-F)>5e-4||N>5e-4||Math.abs(V-1)+Math.abs(H)>5e-4||U<1;(i||l)&&!r.hidden?W=requestAnimationFrame(de):G=0},fe=(e,t)=>{R=Math.min(R*Math.exp(-z*3)+t,2.2),z=0,ae=e},pe=e=>{e.isPrimary&&(e.pointerType!==`mouse`||e.button===0)&&(Y={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now()})},me=t=>{let n=Y;if(Y=null,!n||n.id!==t.pointerId||Math.hypot(t.clientX-n.x,t.clientY-n.y)>10||performance.now()-n.time>600)return;let r=v();if(!r.interactive||r.reduced||r.paused)return;let i=e.getBoundingClientRect();i.width<=0||i.height<=0||(fe(Math.atan2(i.top+i.height/2-t.clientY,t.clientX-i.left-i.width/2),1),$())},he=t=>{if(t.pointerType===`touch`)return;let n=v(),r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return;let i=g(_(n.hoverTilt,1),0,3);I=g(((t.clientX-r.left)/r.width-.5)*2,-1,1)*i,L=g((.5-(t.clientY-r.top)/r.height)*2,-1,1)*i,$()},ge=e=>{e.pointerType!==`touch`&&(I=0,L=0,$())},_e=()=>{Y=null},ve=()=>{G=0,$()},ye=e=>{e.preventDefault(),J=!0,cancelAnimationFrame(W),W=0},be=()=>{J=!1,k=``,$()},xe=new ResizeObserver(()=>{Z()&&(Q(),$())}),Se=new IntersectionObserver(([e])=>{K=e.isIntersecting,G=0,$()},{rootMargin:`120px`});return e.addEventListener(`pointerdown`,pe),e.addEventListener(`pointerup`,me),e.addEventListener(`pointermove`,he),e.addEventListener(`pointerleave`,ge),e.addEventListener(`pointercancel`,_e),r.addEventListener(`visibilitychange`,ve),p.addEventListener(`webglcontextlost`,ye),p.addEventListener(`webglcontextrestored`,be),xe.observe(e),Se.observe(e),v().intro&&!v().reduced&&(V=.7,U=0),j=v().reduced?2:0,Z(),{sync:()=>{A=-10,Z(),G=0,!W&&K&&(Q(),$())},tap:(e,t)=>{v().reduced||(fe(e===void 0?Math.random()*Math.PI*2:_(e,0)*Math.PI/180,g(_(t??1,1),0,2)),$())},destroy:()=>{q=!0,cancelAnimationFrame(W),xe.disconnect(),Se.disconnect(),e.removeEventListener(`pointerdown`,pe),e.removeEventListener(`pointerup`,me),e.removeEventListener(`pointermove`,he),e.removeEventListener(`pointerleave`,ge),e.removeEventListener(`pointercancel`,_e),r.removeEventListener(`visibilitychange`,ve),p.removeEventListener(`webglcontextlost`,ye),p.removeEventListener(`webglcontextrestored`,be),w.remove(C),S.dispose(),x.dispose(),f.dispose(),p.remove()}}}var w=(0,f.forwardRef)(function({size:e=400,animationSpeed:t=1,glowIntensity:n=.8,noiseScale:i=3,innerScale:a=1,resolution:o=1,colors:s=h,state:c=`idle`,volume:l,getVolume:u,autoVolume:d=!0,reactivity:ee=1,rimWidth:m=1,rimIntensity:g=1,coreIntensity:_=1,glints:te=1,halo:v=1,colorSpeed:y=1,wobble:b=0,hoverTilt:ne=1,interactive:re=!0,blend:w=`auto`,intro:ie=!0,paused:T=!1,className:E,style:D},O){let k=(0,f.useRef)(null),A=(0,f.useRef)(null),j=(0,f.useRef)(null),M={size:e,animationSpeed:t,glowIntensity:n,noiseScale:i,innerScale:a,resolution:o,colors:s,state:c,volume:l,getVolume:u,autoVolume:d,reactivity:ee,rimWidth:m,rimIntensity:g,coreIntensity:_,glints:te,halo:v,colorSpeed:y,wobble:b,hoverTilt:ne,interactive:re,blend:w,intro:ie,paused:T,reduced:(0,f.useSyncExternalStore)(x,S,()=>!1)},N=(0,f.useRef)(M);return(0,f.useEffect)(()=>{N.current=M,j.current?.sync()}),(0,f.useEffect)(()=>{let e=k.current,t=A.current;if(!e||!t)return;let n=C(e,t,N);return j.current=n,()=>{n?.destroy(),j.current=null}},[]),(0,f.useImperativeHandle)(O,()=>({tap:(e,t)=>j.current?.tap(e,t)}),[]),(0,p.jsx)(`div`,{ref:k,className:r(`relative`,E),style:{width:e,height:e,touchAction:`manipulation`,...D},children:(0,p.jsx)(`div`,{ref:A,"aria-hidden":`true`,className:`pointer-events-none absolute inset-0 select-none`})})});w.displayName=`AIBlob`;export{w as AIBlob,w as default};