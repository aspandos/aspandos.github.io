import{a as e,n as t,t as n}from"./jsx-runtime-Wy9s6hX0.js";import{f as r}from"./index-CsSxqeFi.js";import{Ct as i,F as a,H as o,I as s,St as c,Tt as l,U as u,W as d,X as f,bt as p,ct as m,h,ht as g,mt as _,n as v,nt as ee,p as y,pt as te,rt as ne,u as re,ut as ie,wt as b}from"./three.module-DQCqqdsN.js";var x=e(t(),1),S=n(),C=48,w=16,T=2048,E=512,ae=0,D=1,O=2,k=[{src:`https://pro.reactbits.dev/demo-media/abstract-fuchsia-wave.webp`,alt:`Broad fuchsia S-shaped band with a coral gradient across deep plum`,title:`Fuchsia wave`},{src:`https://pro.reactbits.dev/demo-media/abstract-coral-fold.webp`,alt:`Broad vermilion and orange folded plane over deep plum with fine grain`,title:`Coral fold`},{src:`https://pro.reactbits.dev/demo-media/abstract-rose-balance.webp`,alt:`Tilted raspberry rounded rectangle and tangerine disc on a rose-pink field`,title:`Rose balance`},{src:`https://pro.reactbits.dev/demo-media/abstract-violet-steps.webp`,alt:`Three interlocking violet and pink stepped planes with an amber edge`,title:`Violet steps`},{src:`https://pro.reactbits.dev/demo-media/abstract-plum-ribbon.webp`,alt:`Intersecting pink and plum diagonal ribbons on a coral-magenta field`,title:`Plum ribbon`},{src:`https://pro.reactbits.dev/demo-media/abstract-orchid-orbit.webp`,alt:`Fuchsia ring and peach crescent on a grainy orchid-purple field`,title:`Orchid orbit`},{src:`https://pro.reactbits.dev/demo-media/abstract-amber-loop.webp`,alt:`Tilted golden-amber loop on a grainy raspberry-purple field`,title:`Amber loop`},{src:`https://pro.reactbits.dev/demo-media/abstract-pink-eclipse.webp`,alt:`Coral-pink disc crossing a violet diagonal plane on a grainy purple field`,title:`Pink eclipse`}],A=(e,t,n)=>Math.min(n,Math.max(t,e)),j=e=>{let t=window.matchMedia(`(prefers-reduced-motion: reduce)`);return t.addEventListener(`change`,e),()=>t.removeEventListener(`change`,e)},oe=()=>typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,M=e=>{let t=e.replace(`#`,``);if(!/^[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(t))return!1;let n=t.length===3?t.replace(/./g,e=>e+e):t,r=Number.parseInt(n.slice(0,2),16),i=Number.parseInt(n.slice(2,4),16),a=Number.parseInt(n.slice(4,6),16);return(.2126*r+.7152*i+.0722*a)/255>.6},se={position:`absolute`,width:1,height:1,padding:0,margin:-1,overflow:`hidden`,clip:`rect(0, 0, 0, 0)`,whiteSpace:`nowrap`,border:0},N={position:`absolute`,inset:0,touchAction:`pan-y`,userSelect:`none`,WebkitUserSelect:`none`,WebkitTouchCallout:`none`,outline:`none`},ce={position:`absolute`,inset:0,display:`flex`,alignItems:`center`,justifyContent:`center`,pointerEvents:`none`},le=`
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,ue=`
precision highp float;

uniform vec2 uResolution;
uniform mat4 uCameraMatrix;
uniform mat4 uProjectionInverse;
uniform vec2 uHalf;
uniform float uTravel;
uniform float uShutter;
uniform float uSamples;
uniform float uGap;
uniform float uRadius;
uniform float uLineOpacity;
uniform vec3 uLineColor;
uniform float uFogLength;
uniform vec4 uBackground;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform sampler2D uAtlas;
uniform sampler2D uCells;
uniform vec2 uGrid;
uniform float uInset;
uniform float uLoaded[${C}];
uniform vec4 uHover;
uniform vec4 uHoverOut;
uniform vec4 uFocus;
uniform float uDim;
uniform float uDpr;

const float PERIOD = ${T}.0;

vec3 toOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  );
}

vec3 fromOklab(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

bool sameCell(vec4 slot, float wall, float lane, float row) {
  return abs(slot.x - wall) < 0.5 && abs(slot.y - lane) < 0.5 && abs(slot.z - row) < 0.5;
}

vec4 surface(float wall, vec2 cont, vec2 fw, vec2 gx, vec2 gy) {
  float lane = floor(cont.x);
  float row = mod(floor(cont.y), PERIOD);
  vec2 cell = fract(cont);
  vec2 edge = min(cell, 1.0 - cell) / max(fw, vec2(1e-5));
  float cellPx = 1.0 / max(max(fw.x, fw.y), 1e-5);
  float width = 0.5 * uDpr;
  float line = 1.0 - smoothstep(width - 0.5, width + 0.5, min(edge.x, edge.y));
  line *= smoothstep(4.0, 16.0, cellPx / uDpr) * uLineOpacity;
  vec4 result = vec4(uLineColor * line, line);
  int index = (int(row) * 4 + int(wall)) * ${w} + int(clamp(lane, 0.0, 15.0));
  vec4 info = texelFetch(uCells, ivec2(index % ${E}, index / ${E}), 0);
  float kind = floor(info.r * 255.0 + 0.5);
  if (kind < 0.5) return result;
  float hover = 0.0;
  if (sameCell(uHover, wall, lane, row)) hover = uHover.w;
  if (sameCell(uHoverOut, wall, lane, row)) hover = max(hover, uHoverOut.w);
  float vacant = sameCell(uFocus, wall, lane, row) ? uFocus.w : 0.0;
  float halfSize = 0.5 - uGap * 0.5;
  float grow = hover * min(uGap * 0.35, 0.03);
  vec2 local = cell - 0.5;
  float d = roundBox(local, vec2(halfSize + grow), min(uRadius * 0.5, halfSize));
  float aa = max(fw.x, fw.y) * 0.75;
  float cover = (1.0 - smoothstep(-aa, aa, d)) * (1.0 - vacant);
  vec3 color;
  if (kind < 1.5) {
    float which = floor(info.g * 255.0 + 0.5);
    float span = 2.0 * (halfSize + grow);
    vec2 uv = local / span + 0.5;
    vec2 dx = gx / span;
    vec2 dy = gy / span;
    if (wall > 0.5 && wall < 1.5) {
      uv.y = 1.0 - uv.y;
    } else if (wall > 1.5 && wall < 2.5) {
      uv = uv.yx;
      dx = dx.yx;
      dy = dy.yx;
    } else if (wall > 2.5) {
      uv = vec2(1.0 - uv.y, uv.x);
      dx = dx.yx;
      dy = dy.yx;
    }
    uv = clamp(uv, 0.0, 1.0);
    vec2 slot = vec2(mod(which, uGrid.x), floor(which / uGrid.x));
    float inner = 1.0 - 2.0 * uInset;
    vec2 atlasUv = vec2(
      (slot.x + uInset + uv.x * inner) / uGrid.x,
      1.0 - (slot.y + uInset + (1.0 - uv.y) * inner) / uGrid.y
    );
    vec2 scale = vec2(inner) / uGrid;
    vec3 image = textureGrad(uAtlas, atlasUv, dx * scale, dy * scale).rgb;
    float loaded = uLoaded[int(which)];
    vec3 placeholder = mix(uBackground.rgb, uLineColor, 0.06);
    color = mix(placeholder, image, loaded) * (0.88 + 0.22 * hover);
  } else {
    vec2 uv = local / (2.0 * halfSize) + 0.5;
    float t = clamp(info.b * 0.55 + (uv.x * 0.6 + uv.y * 0.4) * 0.45, 0.0, 1.0);
    color = toSrgb(max(fromOklab(mix(toOklab(uColorA), toOklab(uColorB), t)), 0.0));
    color *= 0.86 + 0.18 * hover;
  }
  return vec4(color * cover, cover) + result * (1.0 - cover);
}

void main() {
  vec2 ndc = gl_FragCoord.xy / uResolution * 2.0 - 1.0;
  vec4 view = uProjectionInverse * vec4(ndc, 1.0, 1.0);
  vec3 dir = normalize((uCameraMatrix * vec4(view.xyz / view.w, 0.0)).xyz);
  vec3 origin = uCameraMatrix[3].xyz;
  vec2 reach = max(abs(dir.xy), vec2(1e-6));
  float tx = (uHalf.x - sign(dir.x) * origin.x) / reach.x;
  float ty = (uHalf.y - sign(dir.y) * origin.y) / reach.y;
  float t = min(tx, ty);
  vec3 hit = origin + dir * t;
  float wall;
  vec2 cont;
  if (tx < ty) {
    wall = dir.x > 0.0 ? 3.0 : 2.0;
    cont = vec2(hit.y + uHalf.y, uTravel - hit.z);
  } else {
    wall = dir.y > 0.0 ? 1.0 : 0.0;
    cont = vec2(hit.x + uHalf.x, uTravel - hit.z);
  }
  vec2 gx = dFdx(cont);
  vec2 gy = dFdy(cont);
  vec2 fw = sqrt(gx * gx + gy * gy);
  float count = max(uSamples, 1.0);
  float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  vec4 content = vec4(0.0);
  for (int i = 0; i < 12; i++) {
    if (float(i) >= count) break;
    float offset = count > 1.0 ? ((float(i) + jitter) / count - 0.5) * uShutter : 0.0;
    content += surface(wall, cont + vec2(0.0, offset), fw, gx, gy);
  }
  content /= count;
  float haze = 1.0 - exp(-pow(t / uFogLength, 1.5));
  content *= (1.0 - haze) * (1.0 - uDim);
  float alpha = content.a + uBackground.a * (1.0 - content.a);
  vec3 color = content.rgb + uBackground.rgb * uBackground.a * (1.0 - content.a);
  gl_FragColor = vec4(color, alpha);
}
`,de=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,fe=`
precision highp float;

uniform sampler2D uImage;
uniform float uImageAspect;
uniform float uPlaneAspect;
uniform float uRadius;
uniform float uOpacity;
uniform float uShade;
varying vec2 vUv;

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uPlaneAspect, 1.0);
  float d = roundBox(p, vec2(uPlaneAspect, 1.0) * 0.5, uRadius);
  float aa = fwidth(d);
  float cover = 1.0 - smoothstep(-aa, aa, d);
  vec2 uv = vUv - 0.5;
  if (uPlaneAspect < uImageAspect) {
    uv.x *= uPlaneAspect / uImageAspect;
  } else {
    uv.y *= uImageAspect / uPlaneAspect;
  }
  vec3 color = texture2D(uImage, uv + 0.5).rgb * uShade;
  float alpha = cover * uOpacity;
  gl_FragColor = vec4(color * alpha, alpha);
}
`,P=e=>{let t=Math.imul(Math.floor(e)+7,2654435761)>>>0||1;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,t>>>=0,t/4294967296)},F=(e,t,n,r)=>{let i=2*Math.PI/Math.max(r,.02),a=Math.max(1,Math.ceil(n/(1/120))),o=n/a;for(let n=0;n<a;n++){let n=i*i*(t-e.value)-2*i*e.velocity;e.velocity+=n*o,e.value+=e.velocity*o}return Math.abs(t-e.value)>1e-4||Math.abs(e.velocity)>1e-4},pe=(e,t,n,r,x)=>{let S=e.ownerDocument,k=S.createElement(`canvas`);k.style.cssText=`position:absolute;inset:0;width:100%;height:100%;display:block`;let j;try{j=new v({canvas:k,alpha:!0,antialias:!1,premultipliedAlpha:!0,powerPreference:`high-performance`})}catch{return null}t.appendChild(k),j.setClearColor(0,0);let oe=Array(C).fill(0),M={uResolution:{value:new i(1,1)},uCameraMatrix:{value:new u},uProjectionInverse:{value:new u},uHalf:{value:new i(2.5,1.5)},uTravel:{value:0},uShutter:{value:0},uSamples:{value:1},uGap:{value:.1},uRadius:{value:.06},uLineOpacity:{value:.12},uLineColor:{value:new y(1,1,1)},uFogLength:{value:12},uBackground:{value:new l(0,0,0,1)},uColorA:{value:new y},uColorB:{value:new y},uAtlas:{value:null},uCells:{value:null},uGrid:{value:new i(1,1)},uInset:{value:.004},uLoaded:{value:oe},uHover:{value:new l(-9,-9,-9,0)},uHoverOut:{value:new l(-9,-9,-9,0)},uFocus:{value:new l(-9,-9,-9,0)},uDim:{value:0},uDpr:{value:1}},se=new g({uniforms:M,vertexShader:le,fragmentShader:ue,depthTest:!1,depthWrite:!1,blending:0}),N={uImage:{value:null},uImageAspect:{value:1},uPlaneAspect:{value:1},uRadius:{value:.05},uOpacity:{value:1},uShade:{value:1}},ce=new g({uniforms:N,vertexShader:de,fragmentShader:fe,transparent:!0,premultipliedAlpha:!0,depthTest:!1,depthWrite:!1}),pe=new _,I=new ee(72,1,.05,400);I.rotation.order=`YXZ`;let me=new ne(2,2),he=new d(me,se);he.frustumCulled=!1,he.renderOrder=0;let ge=new ne(1,1),L=new d(ge,ce);L.frustumCulled=!1,L.renderOrder=1,L.visible=!1,pe.add(he,L);let R=new Uint8Array(E*(T*4*w/E)*4),_e=new h(R,E,T*4*w/E,ie,c);_e.minFilter=f,_e.magFilter=f,_e.generateMipmaps=!1,M.uCells.value=_e;let z=null,B=null,ve=[],ye=new Map,be=``,xe=``,V=512,Se=1,H=1,Ce=1,U=2.5,W=1.5,we=5,Te=3,G=0,K=0,Ee=!1,De=!1,Oe=!1,q=0,ke=0,Ae=``,je={value:0,velocity:0},Me={value:0,velocity:0},Ne={value:0,velocity:0},Pe={value:0,velocity:0},Fe={value:0,velocity:0},J={value:0,velocity:0},Ie={value:0,velocity:0},Le={value:0,velocity:0},Re={value:0,velocity:0},Y={x:0,y:0,inside:!1},X=null,ze=!1,Be=0,Ve=0,He=-1e9,Z=null,Q=null,Ue=Array(C).fill(0),We=(e,t,n)=>{try{n.set(e)}catch{n.set(t)}return n},Ge=()=>{let e=n.current,t=`${e.colors[0]}|${e.colors[1]}|${e.backgroundColor}`;if(t===Ae)return!1;Ae=t,We(e.colors[0],`#5227FF`,M.uColorA.value),We(e.colors[1],`#FF9FFC`,M.uColorB.value);let r=e.backgroundColor.trim().toLowerCase(),i=r===`transparent`||r===``,a=new y(657930);i||We(e.backgroundColor,`#0a0a0a`,a);let o={r:0,g:0,b:0};a.getRGB(o,te),M.uBackground.value.set(o.r,o.g,o.b,+!i);let s=.2126*a.r+.7152*a.g+.0722*a.b,c=!i&&s>.35;return M.uLineColor.value.setRGB(+!c,+!c,+!c),!0},Ke=()=>{let e=n.current,t=Math.min(r.current.length,C),i=[e.photoFill,e.accentFill,e.seed,t].join(`|`);if(i===xe)return!1;xe=i;let a=P(e.seed*131+17),o=A(e.photoFill,0,1),s=A(e.accentFill,0,1-o),c=[],l=e=>{if(!c.length){c=Array.from({length:t},(e,t)=>t);for(let e=c.length-1;e>0;e--){let t=Math.floor(a()*(e+1));[c[e],c[t]]=[c[t],c[e]]}}for(let n=c.length-1;n>=0;n--)if(!e.has(c[n])||t<=e.size)return c.splice(n,1)[0];return c.pop()??0},u=[];for(let e=0;e<T;e++)for(let n=0;n<4;n++)for(let r=0;r<w;r++){let i=((e*4+n)*w+r)*4|0,c=a(),d=a();if(t>0&&c<o){let e=l(new Set(u));u.push(e),u.length>Math.min(6,Math.max(0,t-2))&&u.shift(),R[i]=D,R[i+1]=e,R[i+2]=0}else c<o+s?(R[i]=O,R[i+1]=0,R[i+2]=Math.round(d*255)):(R[i]=ae,R[i+1]=0,R[i+2]=0);R[i+3]=255}return _e.needsUpdate=!0,!0},qe=(e,t,n)=>{let r=(n%T+T)%T,i=((r*4+e)*w+A(t,0,15))*4;return{kind:R[i],which:R[i+1],row:r}},Je=()=>{ye.forEach(e=>e.dispose()),ye.clear(),B?.dispose(),B=null,z=null,ve=[]},Ye=()=>{let e=r.current.slice(0,C),t=e.map(e=>e.src).join(`\0`);if(t===be)return;be=t,Je(),oe.fill(0),Ue.fill(0);let n=Math.max(e.length,1);V=n<=12?640:n<=24?512:384;let i=Math.ceil(Math.sqrt(n)),o=Math.ceil(n/i);z=S.createElement(`canvas`),z.width=i*V,z.height=o*V;let c=z.getContext(`2d`);c&&(c.fillStyle=`#000`,c.fillRect(0,0,z.width,z.height)),B=new re(z),B.colorSpace=``,B.minFilter=s,B.magFilter=a,B.generateMipmaps=!0,B.anisotropy=j.capabilities.getMaxAnisotropy(),M.uAtlas.value=B,M.uGrid.value.set(i,o),M.uInset.value=1.5/V;let l=z;ve=e.map((e,t)=>{let n=new Image;return n.crossOrigin=`anonymous`,n.decoding=`async`,n.onload=()=>{if(De||z!==l||!c)return;let e=Math.min(n.naturalWidth,n.naturalHeight),r=(n.naturalWidth-e)/2,a=(n.naturalHeight-e)/2,o=t%i,s=Math.floor(t/i);c.drawImage(n,r,a,e,e,o*V,s*V,V,V),B&&(B.needsUpdate=!0),Ue[t]=1,$()},n.src=e.src,n})},Xe=()=>{let t=n.current,r=e.getBoundingClientRect(),i=Math.min(window.devicePixelRatio||1,Math.max(t.dpr,.5)),a=Math.max(1,Math.round(r.width)),o=Math.max(1,Math.round(r.height));return a===Se&&o===H&&i===Ce?!1:(Se=a,H=o,Ce=i,j.setPixelRatio(Ce),j.setSize(Se,H,!1),M.uResolution.value.set(Se*Ce,H*Ce),M.uDpr.value=Ce,!0)},Ze=()=>12/A(n.current.fog,.05,4)*Math.max(1,Math.hypot(U,W)/2.9),Qe=()=>{let e=n.current;we=A(Math.round(e.lanes),2,w),Te=A(Math.round(we/Math.max(Se/H,.2)),2,w),U=we/2,W=Te/2,M.uHalf.value.set(U,W)},$e=(e,t,n)=>{let r=n+.5,i=G-r,a=new b,o=new b,s=new b,c=new b,l=.002;return e===0?(a.set(t+.5-U,-W+l,i),o.set(1,0,0),s.set(0,0,-1),c.set(0,1,0)):e===1?(a.set(t+.5-U,W-l,i),o.set(1,0,0),s.set(0,0,1),c.set(0,-1,0)):e===2?(a.set(-U+l,t+.5-W,i),o.set(0,0,-1),s.set(0,1,0),c.set(1,0,0)):(a.set(U-l,t+.5-W,i),o.set(0,0,1),s.set(0,1,0),c.set(-1,0,0)),{position:a,quaternion:new m().setFromRotationMatrix(new u().makeBasis(o,s,c))}},et=(e,t)=>{let r=k.getBoundingClientRect(),i=new b((e-r.left)/r.width*2-1,-((t-r.top)/r.height*2-1),.5);i.unproject(I);let a=I.position,o=i.sub(a).normalize(),s=Math.max(Math.abs(o.x),1e-6),c=Math.max(Math.abs(o.y),1e-6),l=(U-Math.sign(o.x)*a.x)/s,u=(W-Math.sign(o.y)*a.y)/c,d=Math.min(l,u),f=a.clone().addScaledVector(o,d),p,m;l<u?(p=o.x>0?3:2,m=f.y+W):(p=+(o.y>0),m=f.x+U);let h=G-f.z,g=Math.floor(m),_=Math.floor(h),v=n.current,ee=m-g-.5,y=h-_-.5,te=.5-A(v.gap,0,.6)*.5,ne=Math.abs(ee)<=te&&Math.abs(y)<=te,re=qe(p,g,_),ie=Math.exp(-((d/Ze())**1.5));return{wall:p,lane:g,row:_,wrapped:re.row,kind:ne?re.kind:ae,which:re.which,clear:ie,t:d}},tt=e=>{let t=ve[e];if(!t||!t.complete||!t.naturalWidth||ye.has(e))return;let n=new p(t);n.colorSpace=``,n.minFilter=s,n.magFilter=a,n.generateMipmaps=!0,n.anisotropy=j.capabilities.getMaxAnisotropy(),n.needsUpdate=!0,ye.set(e,n),j.initTexture(n)},nt=e=>{let t=ve[e.which];if(!t||!t.complete||!t.naturalWidth)return;tt(e.which);let n=ye.get(e.which);n&&(N.uImage.value=n,N.uImageAspect.value=t.naturalWidth/t.naturalHeight,Z={wall:e.wall,lane:e.lane,row:e.row,which:e.which,target:1,aspect:{value:1,velocity:0}},M.uFocus.value.set(e.wall,e.lane,e.wrapped,0),x(e.which),$())},rt=()=>{Z&&Z.target!==0&&(Z.target=0,x(-1),$())},it=()=>{Q&&(M.uHoverOut.value.copy(M.uHover.value),Ie.value=J.value,Ie.velocity=0,Q=null,J.value=0,J.velocity=0,M.uHover.value.set(-9,-9,-9,0)),e.style.cursor=``},at=(t,r)=>{let i=n.current;if(!i.interactive||Z||X){it();return}let a=et(t,r),o=a.kind===D||a.kind===O&&i.hover>0?a:null;o&&Q&&Q.wall===o.wall&&Q.lane===o.lane&&Q.row===o.wrapped||(Q&&(M.uHoverOut.value.copy(M.uHover.value),Ie.value=J.value,Ie.velocity=0),Q=o?{wall:o.wall,lane:o.lane,row:o.wrapped}:null,o&&o.kind===D&&tt(o.which),J.value=0,J.velocity=0,o?M.uHover.value.set(o.wall,o.lane,o.wrapped,0):M.uHover.value.set(-9,-9,-9,0)),e.style.cursor=o&&o.kind===D&&i.focusOnClick&&o.clear>.25?`pointer`:``},$=()=>{De||Oe||!Ee||q||(q=requestAnimationFrame(ot))};function ot(e){if(q=0,De||Oe)return;let t=n.current,r=ke?Math.min(Math.max((e-ke)/1e3,0),.1):1/60;ke=e;let i=t.reduced,a=!1;Ge()&&(a=!0),Qe();let s=i?0:A(t.look,0,3)*(Z?.3:1),c=Y.inside?Y.x:0,l=Y.inside?Y.y:0;a=F(je,-c*.12*s,r,1.1)||a,a=F(Me,l*.08*s,r,1.1)||a,a=F(Ne,c*.16*U*Math.min(s,1),r,1.3)||a,a=F(Pe,l*.16*W*Math.min(s,1),r,1.3)||a,a=F(Fe,ze&&!i?1:0,r,ze?.9:.7)||a;let u=e-He<1200,d=i||Z?0:t.speed,f=t.paused||u?0:d,p=f+(Math.max(t.boost,1)*Math.max(Math.abs(d),.3)*Math.sign(d||1)-f)*Fe.value*(i||Z?0:1);if(!X||!X.moved){let e=Z?.12:.45;K+=(p-K)*(1-Math.exp(-r/e))}if(!X||!X.moved){let e=Ve*(1-Math.exp(-r/(i?.02:.16)));Ve-=e,Math.abs(Ve)<1e-4&&(Ve=0),G+=K*r+e}(Math.abs(K)>1e-4||Math.abs(p)>1e-4)&&(a=!0),(Ve!==0||u)&&(a=!0),G=(G%T+T)%T,I.fov=A(t.fov,30,110),I.aspect=Se/H,I.updateProjectionMatrix(),I.position.set(Ne.value,Pe.value,0),I.rotation.set(Me.value,je.value,0,`YXZ`),I.updateMatrixWorld(),M.uCameraMatrix.value.copy(I.matrixWorld),M.uProjectionInverse.value.copy(I.projectionMatrixInverse),M.uTravel.value=G;let m=i?0:A(t.blur,0,3),h=Math.min(Math.abs(K)*.03*m,.9);M.uShutter.value=h*Math.sign(K||1),M.uSamples.value=h>.03?Math.min(12,Math.ceil(h/.05)+2):1,M.uGap.value=A(t.gap,0,.6),M.uRadius.value=A(t.radius,0,1),M.uLineOpacity.value=A(t.lineOpacity,0,1),M.uFogLength.value=Ze();for(let e=0;e<C;e++)Ue[e]&&oe[e]<1&&(oe[e]=i?1:Math.min(1,oe[e]+r/.6),a=!0);if(a=F(J,Q?A(t.hover,0,2):0,r,.35)||a,a=F(Ie,0,r,.35)||a,M.uHover.value.w=Math.max(J.value,0),M.uHoverOut.value.w=Math.max(Ie.value,0),Z){let e=Z.target;a=F(Le,e,r,i?.12:.7)||a,a=F(Re,e*.72,r,.7)||a;let n=A(Le.value,0,1.05),s=A(n,0,1),c=$e(Z.wall,Z.lane,Z.row),l=2.2,u=new b(0,0,-1).applyQuaternion(I.quaternion),d=I.position.clone().addScaledVector(u,l),f=2*l*Math.tan(o.degToRad(I.fov/2)),p=f*I.aspect,m=N.uImageAspect.value;a=F(Z.aspect,e?m:1,r,.9)||a;let h=f*.66,g=h*m;g>p*.82&&(g=p*.82,h=g/m);let _=1-A(t.gap,0,.6),v=A(Z.aspect.value,Math.min(1,m),Math.max(1,m)),ee=(_+(Math.sqrt(g*h)-_)*s)/Math.sqrt(v),y=ee*v;L.position.lerpVectors(c.position,d,s);let te=Math.sin(Math.PI*s)*.35;L.position.addScaledVector(new b(0,0,1).applyQuaternion(c.quaternion),te),L.quaternion.slerpQuaternions(c.quaternion,I.quaternion,s),L.scale.set(y,ee,1),L.visible=n>5e-4||e>0,N.uPlaneAspect.value=v;let ne=Math.min(A(t.radius,0,1)*.5,_*.5)/_;N.uRadius.value=ne+(.018-ne)*s;let re=$e(Z.wall,Z.lane,Z.row).position.distanceTo(I.position),ie=Math.exp(-((re/Ze())**1.5));N.uShade.value=(.88+.12*s)*(ie+(1-ie)*s)*(1-Re.value*(1-s)),N.uOpacity.value=1,M.uFocus.value.w=+(e>0||n>.002),M.uDim.value=Re.value,e===0&&n<=.002&&Math.abs(Le.velocity)<.02&&(Z=null,Le.value=0,Le.velocity=0,L.visible=!1,M.uFocus.value.set(-9,-9,-9,0))}else a=F(Re,0,r,.7)||a,M.uDim.value=Math.max(Re.value,0);j.render(pe,I),a&&$()}let st=t=>{let n=e.getBoundingClientRect();Y.x=A((t.clientX-n.left)/n.width*2-1,-1,1),Y.y=A(-((t.clientY-n.top)/n.height*2-1),-1,1)},ct=e=>{if(n.current.interactive){if(e.pointerType!==`touch`&&(Y.inside=!0,st(e)),X&&X.id===e.pointerId){let t=e.clientX-X.x,n=e.clientY-X.y;if(!X.moved&&Math.hypot(t,n)>6&&(X.moved=!0,window.clearTimeout(Be),ze=!1),X.moved&&!Z){let t=(X.touch?e.clientX-X.lastX:e.clientY-X.lastY)/Math.max(H,1)*6*(X.touch?-1:1);G+=t;let n=performance.now();for(X.samples.push({t:n,v:t});X.samples.length&&n-X.samples[0].t>90;)X.samples.shift()}X.lastX=e.clientX,X.lastY=e.clientY}else e.pointerType!==`touch`&&at(e.clientX,e.clientY);$()}},lt=e=>{if(!(!n.current.interactive||!e.isPrimary||e.button>0)){if(X={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,at:performance.now(),moved:!1,touch:e.pointerType===`touch`,samples:[]},e.pointerType!==`touch`)try{t.setPointerCapture(e.pointerId)}catch{}window.clearTimeout(Be),Z||(Be=window.setTimeout(()=>{X&&!X.moved&&!Z&&(ze=!0,it(),$())},220)),$()}},ut=(e,r)=>{if(!X||X.id!==e.pointerId)return;let i=n.current,a=X;X=null,window.clearTimeout(Be);let o=ze;ze=!1;try{t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId)}catch{}if(a.moved&&!Z){let e=performance.now(),t=a.samples.filter(t=>e-t.t<90);if(t.length>1){let e=Math.max((t[t.length-1].t-t[0].t)/1e3,1/60);K=A(t.reduce((e,t)=>e+t.v,0)/e,-40,40)}}else if(!r&&!a.moved&&!o){if(Z)rt();else if(i.focusOnClick){let t=et(e.clientX,e.clientY);t.kind===D&&t.clear>.25&&nt(t)}}e.pointerType!==`touch`&&at(e.clientX,e.clientY),$()},dt=e=>ut(e,!1),ft=e=>ut(e,!0),pt=e=>{X&&X.id===e.pointerId||(Y.inside=!1,it(),$())},mt=e=>{let t=n.current;if(!t.wheel||!t.interactive)return;e.preventDefault();let r=e.deltaMode===1?16:e.deltaMode===2?H:1,i=A((e.deltaY+e.deltaX)*r,-240,240);Z&&Z.target===1&&rt(),Ve+=i*.012,He=performance.now(),$()},ht=e=>{n.current.interactive&&(e.key===`Escape`?rt():e.key===`ArrowUp`||e.key===`ArrowRight`?(e.preventDefault(),K+=3,$()):(e.key===`ArrowDown`||e.key===`ArrowLeft`)&&(e.preventDefault(),K-=3,$()))};t.addEventListener(`pointerdown`,lt),t.addEventListener(`pointermove`,ct),t.addEventListener(`pointerup`,dt),t.addEventListener(`pointercancel`,ft),t.addEventListener(`pointerleave`,pt),t.addEventListener(`wheel`,mt,{passive:!1}),e.addEventListener(`keydown`,ht);let gt=new ResizeObserver(()=>{Xe()&&$()});gt.observe(e);let _t=typeof IntersectionObserver>`u`?null:new IntersectionObserver(([e])=>{Ee=e.isIntersecting,Ee?(ke=0,$()):q&&=(cancelAnimationFrame(q),0)},{rootMargin:`80px`});_t?_t.observe(e):Ee=!0;let vt=e=>{e.preventDefault(),Oe=!0,q&&cancelAnimationFrame(q),q=0},yt=()=>{Oe=!1,Ae=``,xe=``,be=``,Ke(),Ye(),$()};return k.addEventListener(`webglcontextlost`,vt),k.addEventListener(`webglcontextrestored`,yt),Xe(),Qe(),Ge(),Ke(),Ye(),L.visible=!0,j.compile(pe,I),L.visible=!1,$(),{sync:()=>{Xe(),Ke(),Ye(),Z&&Z.which>=r.current.length&&rt(),ke=0,$()},close:rt,travel:e=>{K+=e*2,$()},destroy:()=>{De=!0,q&&cancelAnimationFrame(q),window.clearTimeout(Be),_t?.disconnect(),gt.disconnect(),t.removeEventListener(`pointerdown`,lt),t.removeEventListener(`pointermove`,ct),t.removeEventListener(`pointerup`,dt),t.removeEventListener(`pointercancel`,ft),t.removeEventListener(`pointerleave`,pt),t.removeEventListener(`wheel`,mt),e.removeEventListener(`keydown`,ht),e.style.cursor=``,k.removeEventListener(`webglcontextlost`,vt),k.removeEventListener(`webglcontextrestored`,yt),ve.forEach(e=>{e&&(e.onload=null)}),Je(),_e.dispose(),me.dispose(),ge.dispose(),se.dispose(),ce.dispose(),j.dispose(),j.getContext().isContextLost()||j.forceContextLoss(),k.remove()}}},I=(0,x.forwardRef)(function({items:e=k,colors:t=[`#5227FF`,`#FF9FFC`],backgroundColor:n=`#0a0a0a`,lanes:i=5,gap:a=.1,radius:o=.06,photoFill:s=.3,accentFill:c=.06,lineOpacity:l=.12,fog:u=1,speed:d=.6,boost:f=10,blur:p=1,look:m=1,fov:h=72,hover:g=1,focusOnClick:_=!0,captions:v=!0,wheel:ee=!0,interactive:y=!0,seed:te=0,paused:ne=!1,dpr:re=2,ariaLabel:ie=`Photo tunnel. Scroll or drag to travel, hold to speed up, click a photo to view it.`,onFocusChange:b,className:C,style:w,children:T},E){let ae=(0,x.useRef)(null),D=(0,x.useRef)(null),O=(0,x.useRef)(null),A=(0,x.useSyncExternalStore)(j,oe,()=>!1),[le,ue]=(0,x.useState)(-1),[de,fe]=(0,x.useState)(!1),P=e.length?e:k,F=(0,x.useRef)(P),I={items:P,colors:t,backgroundColor:n,lanes:i,gap:a,radius:o,photoFill:s,accentFill:c,lineOpacity:l,fog:u,speed:d,boost:f,blur:p,look:m,fov:h,hover:g,focusOnClick:_,captions:v,wheel:ee,interactive:y,seed:te,paused:ne,dpr:re,onFocusChange:b,reduced:A},me=(0,x.useRef)(I);(0,x.useEffect)(()=>{me.current=I,F.current=P,O.current?.sync()}),(0,x.useEffect)(()=>{let e=ae.current,t=D.current;if(!e||!t)return;let n=pe(e,t,me,F,e=>{ue(e);let t=e>=0?F.current[e]??null:null;me.current.onFocusChange?.(t,e)});if(!n){let e=requestAnimationFrame(()=>fe(!0));return()=>cancelAnimationFrame(e)}return O.current=n,()=>{n.destroy(),O.current=null}},[]),(0,x.useImperativeHandle)(E,()=>({close:()=>O.current?.close(),travel:e=>O.current?.travel(e)}),[]);let he=n.trim().toLowerCase(),ge=he===`transparent`||he===``,L=le>=0?P[le]:null,R=!ge&&M(he);return(0,S.jsxs)(`div`,{ref:ae,className:r(`relative h-full min-h-[420px] w-full overflow-hidden`,C),style:{backgroundColor:ge?void 0:n,...w},role:`region`,"aria-roledescription":`gallery`,"aria-label":ie,tabIndex:0,children:[(0,S.jsx)(`div`,{ref:D,style:N}),de?(0,S.jsx)(`div`,{style:{...ce,gap:12,flexWrap:`wrap`,padding:24,alignContent:`center`},children:P.slice(0,6).map(e=>(0,S.jsx)(`img`,{src:e.src,alt:e.alt,style:{width:120,height:120,objectFit:`cover`,borderRadius:8}},e.src))}):null,(0,S.jsx)(`ul`,{style:se,children:P.map(e=>(0,S.jsx)(`li`,{children:e.alt},e.src))}),v?(0,S.jsx)(`div`,{"aria-live":`polite`,style:{position:`absolute`,left:0,right:0,bottom:`5%`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:4,pointerEvents:`none`,opacity:+!!L,transform:L?`translateY(0)`:`translateY(6px)`,transition:L?`opacity 420ms ease 380ms, transform 520ms cubic-bezier(0.22, 1, 0.36, 1) 380ms`:`opacity 160ms ease, transform 160ms ease`,color:R?`rgba(10, 10, 10, 0.92)`:`rgba(255, 255, 255, 0.92)`,fontSize:14,lineHeight:1.4,textAlign:`center`},children:L?(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(`span`,{style:{fontWeight:500},children:L.title??L.alt}),(0,S.jsxs)(`span`,{style:{opacity:.55,fontVariantNumeric:`tabular-nums`,fontSize:12},children:[String(le+1).padStart(2,`0`),` / `,String(P.length).padStart(2,`0`)]})]}):null}):null,T?(0,S.jsx)(`div`,{style:ce,children:(0,S.jsx)(`div`,{style:{pointerEvents:`auto`},children:T})}):null]})});I.displayName=`PassageGallery`;export{I as PassageGallery,I as default};