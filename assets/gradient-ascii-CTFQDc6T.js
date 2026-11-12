import{i as e,n as t,t as n}from"./jsx-runtime-DyZJNswf.js";var r=e(t(),1),i=n(),a=8,o=4,s=24,c=1.2,l=.7,ee=.015,te=2.4,u=60,d=100,f=16,p=.78,m=[`#1e3fd8`,`#f6f8ff`,`#a5d8ff`,`#38bdf8`],h=` =+xX0S8#@`,g=`"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,_={horizon:0,pinch:1,rise:2,eclipse:3},v={none:0,wave:1,burst:2},y=`#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,b=`
float hash12(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
`,ne=`#version 300 es
precision highp float;
precision highp int;
uniform float uAspect;
uniform float uTime;
uniform int uShape;
uniform vec3 uRamp[8];
uniform int uCount;
uniform float uScale;
uniform float uSoftness;
uniform float uFlow;
uniform vec2 uSeed;
uniform vec4 uTrail[24];
uniform float uRadius;
uniform vec4 uClicks[4];
uniform int uClickEffect;
uniform float uIntro;
uniform float uFrame;
in vec2 vUv;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outAux;
${b}
vec2 hash22(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy) * 2.0 - 1.0;
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash22(i), f);
  float b = dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return 0.5 + 0.5 * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

vec3 labToRgb(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

vec3 horizon(vec2 p, float time, out float order) {
  float span = 0.5 * max(uAspect, 1.0);
  float x = p.x / span;
  float arch = -0.17 - 0.2 * x * x + 0.02 * sin(time * 0.6);
  float soft = mix(0.05, 0.22, uSoftness);
  float edge = p.y - arch;
  float rim = 0.38 * smoothstep(-soft, 0.42, edge);
  vec2 sun = vec2(0.08 * sin(time * 0.31) * span, 0.58);
  float spread = length((p - sun) / vec2(0.95 * span, 0.75));
  float sky = mix(0.55, 1.0, smoothstep(0.2, 0.95, spread));
  order = clamp(edge * 1.3, 0.0, 1.0);
  return vec3(rim, sky, smoothstep(0.18, 0.62, edge));
}

vec3 pinch(vec2 p, float time, out float order) {
  float span = 0.5 * max(uAspect, 0.75);
  float x = p.x / span;
  float sway = 0.02 * sin(x * 1.7 + time * 0.55);
  float breathe = 1.0 + 0.06 * sin(time * 0.8);
  float width = (0.13 + 0.22 * x * x) * breathe * mix(0.85, 1.2, uSoftness);
  float y = abs(p.y - sway) / width;
  float t = exp(-pow(y, 2.2)) * (0.42 + 0.58 * exp(-x * x * 1.8));
  order = clamp(abs(p.y - sway) * 2.4 + abs(x) * 0.3, 0.0, 1.0);
  return vec3(t, t, 0.0);
}

vec3 rise(vec2 p, float time, out float order) {
  float wide = max(uAspect, 0.9);
  vec2 center = vec2(0.05 * sin(time * 0.45) * wide, -0.7);
  vec2 radius = vec2(0.82 * wide, 0.64 * (1.0 + 0.04 * sin(time * 0.8)));
  float d = length((p - center) / radius);
  float soft = mix(0.6, 1.15, uSoftness);
  float t = clamp(pow(clamp(1.0 - d, 0.0, 1.0), soft) * 1.35, 0.0, 1.0);
  order = clamp((d - 0.2) * 1.3, 0.0, 1.0);
  return vec3(t, t, 0.0);
}

vec3 eclipse(vec2 p, float time, out float order) {
  float fit = min(1.0, uAspect * 1.25);
  float r = 0.23 * fit * (1.0 + 0.015 * sin(time * 0.9));
  float angle = atan(p.y, p.x);
  float rays = noise(vec2(cos(angle), sin(angle)) * 2.2 + time * 0.08) * 0.8 + 0.6;
  float d = length(p) - r;
  float reach = mix(0.07, 0.15, uSoftness) * rays * fit;
  float t = smoothstep(-0.006, 0.006 + 0.02 * uSoftness, d) * exp(-max(d, 0.0) / reach);
  order = clamp(d * 2.0, 0.0, 1.0);
  return vec3(t, t, 0.0);
}

vec4 tone(float t) {
  float x = smoothstep(0.3, 1.0, t) * float(uCount - 1);
  int index = int(floor(x));
  return vec4(mix(uRamp[index], uRamp[min(index + 1, uCount - 1)], fract(x)), smoothstep(0.0, 0.38, t));
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float time = uTime;
  vec2 q = p / uScale;
  vec2 warp = vec2(
    noise(q * 1.6 + uSeed + vec2(0.0, time * 0.3)),
    noise(q * 1.6 + uSeed.yx + vec2(4.3, -time * 0.24))
  ) - 0.5;
  q += warp * uFlow * (uShape == 3 ? 0.04 : 0.18);
  float order = 0.0;
  vec3 shape;
  if (uShape == 0) shape = horizon(q, time, order);
  else if (uShape == 1) shape = pinch(q, time, order);
  else if (uShape == 2) shape = rise(q, time, order);
  else shape = eclipse(q, time, order);

  float reveal = clamp((uIntro * 1.45 - order) / 0.45, 0.0, 1.0);
  reveal = reveal * reveal * (3.0 - 2.0 * reveal);

  float scramble = 0.0;
  for (int i = 0; i < 24; i++) {
    vec4 point = uTrail[i];
    if (point.z <= 0.0) continue;
    vec2 d = p - point.xy;
    scramble = max(scramble, point.z * exp(-dot(d, d) / (uRadius * uRadius)));
  }
  for (int i = 0; i < 4; i++) {
    vec4 c = uClicks[i];
    if (c.w <= 0.0) continue;
    float d = length(p - c.xy);
    if (uClickEffect == 1) {
      scramble = max(scramble, exp(-pow((d - c.z * 0.75) / 0.06, 2.0)) * c.w);
    } else if (uClickEffect == 2) {
      float size = 0.08 + 0.22 * (1.0 - exp(-c.z * 5.0));
      scramble = max(scramble, (1.0 - smoothstep(size * 0.6, size, d)) * c.w);
    }
  }
  vec2 t = clamp(shape.xy * mix(0.7, 1.0, reveal), 0.0, 1.0);
  vec4 mixed = mix(tone(t.x), tone(t.y), shape.z);
  vec3 color = encode(labToRgb(mixed.rgb));
  float alpha = mixed.a * reveal;
  float dither = (hash12(gl_FragCoord.xy + uFrame * 13.7) - 0.5) / 255.0;
  outColor = clamp(vec4(color * alpha + dither, alpha + dither), 0.0, 1.0);
  outAux = vec4(reveal, scramble, 0.0, 1.0);
}`,x=`
uniform sampler2D uField;
uniform sampler2D uAux;
uniform sampler2D uAtlas;
uniform vec2 uResolution;
uniform vec2 uCell;
uniform vec2 uOffset;
uniform vec2 uAtlasGrid;
uniform float uCount;
uniform float uDensity;
uniform float uOpacity;
uniform float uFlicker;
uniform float uDepth;
uniform float uGlyphTime;
uniform float uSeedValue;
uniform float uLight;
${b}
float sampleGlyph(float index, vec2 local, vec2 coord, float soft) {
  float column = mod(index, uAtlasGrid.x);
  float row = floor(index / uAtlasGrid.x);
  vec2 atlasUv = vec2((column + local.x) / uAtlasGrid.x, (row + 1.0 - local.y) / uAtlasGrid.y);
  vec2 continuous = coord / uAtlasGrid;
  float scale = exp2(soft);
  return textureGrad(uAtlas, atlasUv, dFdx(continuous) * scale, dFdy(continuous) * scale).a;
}

vec4 glyphAt(vec2 px) {
  vec2 coord = (px - uOffset) / uCell;
  vec2 cell = floor(coord);
  vec2 local = coord - cell;
  vec2 uv = clamp(((cell + 0.5) * uCell + uOffset) / uResolution, vec2(0.0), vec2(1.0));
  vec4 field = texture(uField, uv);
  vec4 aux = texture(uAux, uv);
  vec3 visible = uLight > 0.5 ? field.rgb + (1.0 - field.a) : field.rgb;
  float luma = dot(visible, vec3(0.2126, 0.7152, 0.0722));
  float value = uLight > 0.5 ? clamp((1.0 - luma) * 1.5, 0.0, 1.0) : luma;
  float pick = hash12(cell + uSeedValue * 7.31);
  float level = hash12(cell * 1.73 + 4.1 + uSeedValue);
  float tick = floor(uGlyphTime * 9.0 + level * 9.0);
  float wobble = (hash12(cell * 2.31 + tick * 17.7) - 0.5) * uFlicker * 0.4 + (level - 0.5) * 0.1;
  float tone = clamp(pow(value, 0.75) + wobble, 0.0, 1.0);
  float index = floor(tone * (uCount - 1.0) + 0.5);
  float decode = max(aux.g, 1.0 - aux.r);
  if (decode > 0.02) {
    float frame = floor(uGlyphTime * 20.0);
    if (hash12(cell * 3.7 + frame * 5.3) < decode * 1.25) index = 1.0 + floor(hash12(cell + frame * 1.37) * (uCount - 1.0));
  }
  float present = step(pick, uDensity * mix(1.0, 0.3 + tone * 1.1, 0.55));
  float cutoff = smoothstep(0.03, 0.1, value);
  float focus = step(hash12(cell * 0.71 + 9.2 + uSeedValue), uDepth);
  float coverage = sampleGlyph(index, local, coord, focus * 1.2);
  float alpha = uOpacity * present * cutoff * coverage * mix(1.0, 0.35 + 0.65 * level, 0.55) * (1.0 - focus * 0.5);
  if (uLight < 0.5) {
    vec3 light = field.rgb * 0.55 + vec3(0.03) * field.a;
    return vec4(light * alpha, 0.6 * field.a * alpha);
  }
  vec3 ink = visible * 0.8;
  return vec4(ink * alpha, alpha);
}
`,re=`#version 300 es
precision highp float;
uniform float uDownscale;
in vec2 vUv;
out vec4 outColor;
${x}
void main() {
  outColor = glyphAt(gl_FragCoord.xy * uDownscale);
}`,ie=`#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uStep;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec4 sum = texture(uSource, vUv) * 0.2270270270;
  sum += texture(uSource, vUv + uStep * 1.3846153846) * 0.3162162162;
  sum += texture(uSource, vUv - uStep * 1.3846153846) * 0.3162162162;
  sum += texture(uSource, vUv + uStep * 3.2307692308) * 0.0702702703;
  sum += texture(uSource, vUv - uStep * 3.2307692308) * 0.0702702703;
  outColor = sum;
}`,ae=`#version 300 es
precision highp float;
uniform sampler2D uHalo;
uniform float uGlow;
uniform float uGradient;
uniform float uGrain;
uniform float uFrame;
in vec2 vUv;
out vec4 outColor;
${x}
void main() {
  vec4 base = texture(uField, vUv) * uGradient;
  vec4 glyph = glyphAt(gl_FragCoord.xy);
  vec4 halo = texture(uHalo, vUv) * uGlow;
  vec4 color;
  if (uLight < 0.5) {
    color = base + glyph + halo;
  } else {
    color = glyph + base * (1.0 - glyph.a);
    color += halo * 0.6 * (1.0 - color.a);
  }
  float grain = (hash12(gl_FragCoord.xy + uFrame * vec2(17.0, 59.0)) + hash12(gl_FragCoord.xy * 1.31 + uFrame * 7.0) - 1.0) * uGrain;
  float body = clamp(color.a, 0.0, 1.0);
  color.rgb += grain * (0.25 + body) * 0.5;
  color.a = clamp(color.a, 0.0, 1.0);
  color.rgb = clamp(color.rgb, 0.0, color.a);
  outColor = color;
}`,S=(e,t,n)=>Math.min(n,Math.max(t,e)),C=e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4,oe=([e,t,n])=>{let r=C(e),i=C(t),a=C(n),o=Math.cbrt(.4122214708*r+.5363325363*i+.0514459929*a),s=Math.cbrt(.2119034982*r+.6806995451*i+.1073969566*a),c=Math.cbrt(.0883024619*r+.2817188376*i+.6299787005*a);return[.2104542553*o+.793617785*s-.0040720468*c,1.9779984951*o-2.428592205*s+.4505937099*c,.0259040371*o+.7827717662*s-.808675766*c]},w=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),r):null},T=(e,t)=>{let n=w(e,e.VERTEX_SHADER,y),r=w(e,e.FRAGMENT_SHADER,t),i=e.createProgram();return!n||!r||!i?null:(e.attachShader(i,n),e.attachShader(i,r),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),{program:i,uniforms:{}})},E=(e,t)=>{if(!e.getProgramParameter(t.program,e.LINK_STATUS))return!1;let n=e.getProgramParameter(t.program,e.ACTIVE_UNIFORMS);for(let r=0;r<n;r++){let n=e.getActiveUniform(t.program,r);if(!n)continue;let i=n.name.replace(/\[0\]$/,``);t.uniforms[i]=e.getUniformLocation(t.program,i)}return!0},D=(e,t)=>({textures:Array.from({length:t},()=>{let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),t}),framebuffer:e.createFramebuffer(),width:0,height:0}),O=(e,t,n,r)=>{(t.width!==n||t.height!==r)&&(t.width=n,t.height=r,e.bindFramebuffer(e.FRAMEBUFFER,t.framebuffer),t.textures.forEach((t,i)=>{e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,n,r,0,e.RGBA,e.UNSIGNED_BYTE,null),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+i,e.TEXTURE_2D,t,0)}),e.bindFramebuffer(e.FRAMEBUFFER,null))},se=(e,t,n)=>{let r=[...new Set([...t].filter(e=>e!==`
`&&e!==`\r`))];r.length||r.push(` `);let i=`300 ${Math.round(d*p)}px ${n}`,a=Math.min(f,r.length),o=Math.ceil(r.length/a),s=document.createElement(`canvas`);s.width=u*a,s.height=d*o;let c=s.getContext(`2d`);c&&(c.font=i,c.textAlign=`center`,c.textBaseline=`middle`,c.fillStyle=`#fff`,r.forEach((e,t)=>{let n=t%a,r=Math.floor(t/a);c.fillText(e,n*u+u/2,r*d+d/2+3)}));let l=e.createTexture();return e.bindTexture(e.TEXTURE_2D,l),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,e.RGBA,e.UNSIGNED_BYTE,s),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),{texture:l,count:r.length,grid:[a,o]}},k=({colors:e=m,shape:t=`horizon`,characters:n=h,cellSize:f=18,density:p=.8,glyphOpacity:y=.85,glow:b=.2,depthOfField:x=0,flicker:C=.2,softness:w=.5,scale:k=1,flow:A=.5,speed:j=1,gradientOpacity:M=.9,grain:N=.08,variation:P=0,mouseInteraction:F=!0,scrambleRadius:I=.1,clickEffect:L=`wave`,intro:R=!0,lightMode:z=!1,fontFamily:B=g,dpr:V,className:H=``,style:U,...W})=>{let G=(0,r.useRef)(null),ce=(0,r.useRef)(null),K=(0,r.useRef)(null),q=(Array.isArray(e)&&e.length?e:m).slice(0,a),J={colors:q.length>1?q:[q[0],q[0]],shape:_[t]??0,characters:n||h,cellSize:S(f,6,64),density:S(p,0,1),glyphOpacity:S(y,0,1),glow:S(b,0,2),depthOfField:S(x,0,1),flicker:S(C,0,1),softness:S(w,0,1),scale:S(k,.4,2.5),flow:S(A,0,2),speed:Math.max(0,j),gradientOpacity:S(M,0,1),grain:S(N,0,.4),variation:Math.max(0,P),mouseInteraction:F,scrambleRadius:S(I,.02,.4),clickEffect:v[L]??1,intro:R,lightMode:z,fontFamily:B||g,dpr:V},Y=(0,r.useRef)(J);return Y.current=J,(0,r.useEffect)(()=>{let e=G.current,t=ce.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=n.getExtension(`KHR_parallel_shader_compile`),i=T(n,ne),a=T(n,re),f=T(n,ie),p=T(n,ae);if(!i||!a||!f||!p)return;let m=[i,a,f,p];if(!r&&!m.every(e=>E(n,e))){m.forEach(e=>n.deleteProgram(e.program));return}let h=n.createVertexArray(),g=D(n,2),_=D(n,1),v=D(n,1),y=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),b=new Map,x=e=>{let t=String(e),n=b.get(t);if(n)return n;let r=[0,0,0];if(y){y.clearRect(0,0,1,1),y.fillStyle=`#000000`,y.fillStyle=t,y.fillRect(0,0,1,1);let[e,n,i]=y.getImageData(0,0,1,1).data;r=[e/255,n/255,i/255]}return b.set(t,r),r},C=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,w={width:1,height:1,ratio:1},k=new Float32Array(24),A=new Float32Array(16),j=[],M=new Float32Array(96),N=[],P={x:0,y:0,inside:!1},F=null,I=``,L=``,R=0,z=0,B=Y.current.intro&&!C?0:1,V=0,H=0,U=0,W=0,q=!0,J=!1,X=!r,le=()=>!r||m.every(e=>n.getProgramParameter(e.program,r.COMPLETION_STATUS_KHR)),ue=()=>{n.isContextLost()||(!X&&!le()?requestAnimationFrame(ue):m.forEach(e=>n.deleteProgram(e.program)))},de=()=>{let e=Y.current,t=`${e.fontFamily}|${e.characters}`;t===I&&F||(I=t,F&&n.deleteTexture(F.texture),F=se(n,e.characters,e.fontFamily),document.fonts?.load?.(`300 64px ${e.fontFamily}`,e.characters).then(()=>{J||I!==t||(F&&n.deleteTexture(F.texture),F=se(n,e.characters,e.fontFamily),Z())},()=>{}))},fe=()=>{let e=Y.current,t=e.colors.join(`,`);t!==L&&(L=t,e.colors.forEach((e,t)=>k.set(oe(x(e)),t*3)))},pe=(e,t,r)=>{if(!F)return;let i=Y.current,a=e.uniforms,o=i.cellSize*w.ratio,s=u/d*o;n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,g.textures[0]),n.uniform1i(a.uField,0),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,g.textures[1]),n.uniform1i(a.uAux,1),n.activeTexture(n.TEXTURE2),n.bindTexture(n.TEXTURE_2D,F.texture),n.uniform1i(a.uAtlas,2),n.uniform2f(a.uResolution,t,r),n.uniform2f(a.uCell,s,o),n.uniform2f(a.uOffset,(t-Math.ceil(t/s)*s)/2,(r-Math.ceil(r/o)*o)/2),n.uniform2f(a.uAtlasGrid,F.grid[0],F.grid[1]),n.uniform1f(a.uCount,F.count),n.uniform1f(a.uDensity,i.density),n.uniform1f(a.uOpacity,i.glyphOpacity),n.uniform1f(a.uFlicker,C?0:i.flicker),n.uniform1f(a.uDepth,i.depthOfField),n.uniform1f(a.uGlyphTime,z),n.uniform1f(a.uSeedValue,i.variation),n.uniform1f(a.uLight,+!!i.lightMode)},Z=()=>{if(!X)return;let e=Y.current,r=w.width/w.height;de(),fe(),n.bindVertexArray(h),n.disable(n.BLEND),n.bindFramebuffer(n.FRAMEBUFFER,g.framebuffer),n.drawBuffers([n.COLOR_ATTACHMENT0,n.COLOR_ATTACHMENT1]),n.viewport(0,0,g.width,g.height),n.useProgram(i.program);let o=i.uniforms;n.uniform1f(o.uAspect,r),n.uniform1f(o.uTime,R),n.uniform1i(o.uShape,e.shape),n.uniform3fv(o.uRamp,k),n.uniform1i(o.uCount,e.colors.length),n.uniform1f(o.uScale,e.scale),n.uniform1f(o.uSoftness,e.softness),n.uniform1f(o.uFlow,e.flow),n.uniform2f(o.uSeed,e.variation*3.17,e.variation*1.91),n.uniform4fv(o.uTrail,M),n.uniform1f(o.uRadius,e.scrambleRadius),n.uniform4fv(o.uClicks,A),n.uniform1i(o.uClickEffect,e.clickEffect),n.uniform1f(o.uIntro,B),n.uniform1f(o.uFrame,V),n.drawArrays(n.TRIANGLES,0,3);let s=e.glow>.001;s&&(n.bindFramebuffer(n.FRAMEBUFFER,_.framebuffer),n.drawBuffers([n.COLOR_ATTACHMENT0]),n.viewport(0,0,_.width,_.height),n.useProgram(a.program),pe(a,t.width,t.height),n.uniform1f(a.uniforms.uDownscale,t.width/_.width),n.drawArrays(n.TRIANGLES,0,3),n.useProgram(f.program),n.activeTexture(n.TEXTURE0),n.uniform1i(f.uniforms.uSource,0),n.bindFramebuffer(n.FRAMEBUFFER,v.framebuffer),n.bindTexture(n.TEXTURE_2D,_.textures[0]),n.uniform2f(f.uniforms.uStep,1/_.width,0),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,_.framebuffer),n.bindTexture(n.TEXTURE_2D,v.textures[0]),n.uniform2f(f.uniforms.uStep,0,1/_.height),n.drawArrays(n.TRIANGLES,0,3)),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,t.width,t.height),n.useProgram(p.program),pe(p,t.width,t.height);let c=p.uniforms;n.activeTexture(n.TEXTURE3),n.bindTexture(n.TEXTURE_2D,_.textures[0]),n.uniform1i(c.uHalo,3),n.uniform1f(c.uGlow,s?e.glow:0),n.uniform1f(c.uGradient,e.gradientOpacity),n.uniform1f(c.uGrain,e.grain),n.uniform1f(c.uFrame,V),n.drawArrays(n.TRIANGLES,0,3)},me=()=>{let r=Y.current;w.width=Math.max(1,e.clientWidth),w.height=Math.max(1,e.clientHeight),w.ratio=Math.min(r.dpr||window.devicePixelRatio||1,2),t.width=Math.max(1,Math.round(w.width*w.ratio)),t.height=Math.max(1,Math.round(w.height*w.ratio)),O(n,g,Math.max(1,Math.round(t.width/2)),Math.max(1,Math.round(t.height/2)));let i=Math.max(1,Math.round(t.width/4)),a=Math.max(1,Math.round(t.height/4));O(n,_,i,a),O(n,v,i,a),Z(),$()},he=e=>{for(N.forEach(t=>{t.age+=e});N.length&&N[N.length-1].age>l;)N.pop();for(let e=0;e<s;e++){let t=N[e];if(!t){M[e*4+2]=0;continue}let n=1-t.age/l;M.set([t.x,t.y,n*n,0],e*4)}for(j.forEach(t=>{t.age+=e});j.length&&j[j.length-1].age>c;)j.pop();for(let e=0;e<o;e++){let t=j[e];if(!t){A[e*4+3]=0;continue}let n=t.age/c,r=Math.min(1,t.age/.08)*(1-n)*(1-n);A.set([t.x,t.y,t.age,r],e*4)}},Q=e=>{if(U=0,J||!q||document.hidden)return;if(!X){if(!n.isContextLost()&&!le()){U=requestAnimationFrame(Q);return}if(!m.every(e=>E(n,e))){Se();return}X=!0}let t=Y.current,r=W?S((e-W)/1e3,.001,.05):1/60;W=e,C||(R+=r*t.speed*.5,z+=r*Math.max(t.speed,.15)),B<1&&(B=Math.min(1,B+r/te)),H+=r,!C&&H>1/24&&(H=0,V=(V+1)%97),he(r),Z(),!C||B<1||j.length>0||N.length>0?U=requestAnimationFrame(Q):W=0};function $(){!U&&!J&&q&&!document.hidden&&(U=requestAnimationFrame(Q))}let ge=t=>{let n=e.getBoundingClientRect(),r=(t.clientX-n.left)/Math.max(1,n.width),i=1-(t.clientY-n.top)/Math.max(1,n.height),a=n.width/Math.max(1,n.height);P.inside=r>=0&&r<=1&&i>=0&&i<=1,P.x=(r-.5)*a,P.y=i-.5},_e=e=>{ge(e);let t=Y.current;if(!P.inside||!t.mouseInteraction||C)return;let n=N[0],r=n?Math.hypot(P.x-n.x,P.y-n.y):1/0;if(!(r<ee)){if(n&&n.age<.1){let e=Math.min(6,Math.floor(r/(ee*2)));for(let t=1;t<=e;t++){let r=t/(e+1);N.unshift({x:n.x+(P.x-n.x)*r,y:n.y+(P.y-n.y)*r,age:0})}}N.unshift({x:P.x,y:P.y,age:0}),N.length=Math.min(N.length,s),$()}},ve=e=>{ge(e);let t=Y.current;P.inside&&t.clickEffect&&!C&&(j.unshift({x:P.x,y:P.y,age:0}),j.length>o&&j.pop(),$())},ye=()=>{W=0,$()},be=new ResizeObserver(me);be.observe(e);let xe=new IntersectionObserver(e=>{q=e.some(e=>e.isIntersecting),q&&(W=0,$())});xe.observe(e),window.addEventListener(`pointermove`,_e,{passive:!0}),window.addEventListener(`pointerdown`,ve,{passive:!0}),document.addEventListener(`visibilitychange`,ye),me(),K.current=$;let Se=()=>{J||(J=!0,cancelAnimationFrame(U),K.current=null,be.disconnect(),xe.disconnect(),window.removeEventListener(`pointermove`,_e),window.removeEventListener(`pointerdown`,ve),document.removeEventListener(`visibilitychange`,ye),[g,_,v].forEach(e=>{e.textures.forEach(e=>n.deleteTexture(e)),n.deleteFramebuffer(e.framebuffer)}),F&&n.deleteTexture(F.texture),n.deleteVertexArray(h),t.isConnected?ue():(m.forEach(e=>n.deleteProgram(e.program)),n.getExtension(`WEBGL_lose_context`)?.loseContext()))};return Se},[]),(0,r.useEffect)(()=>{K.current?.()}),(0,i.jsx)(`div`,{ref:G,className:[`relative h-full w-full overflow-hidden`,H].filter(Boolean).join(` `),style:U,...W,children:(0,i.jsx)(`canvas`,{ref:ce,className:`absolute inset-0 block h-full w-full`,"aria-hidden":`true`})})};export{k as default};