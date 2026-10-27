// =====================================================================
// playground.js - Doodle Playground
//
// Draw something on the black paper. When you stop for a moment, the
// lines you just drew become one "doodle". Then bring it to life:
//   1 wiggle   2 bounce   3 float   4 walk   5 freeze
//
// How the "boiling" lines work:
//   Every line is saved as a list of points. About 9 times a second we
//   nudge every point a tiny bit and draw it again, like a cartoonist
//   tracing the same drawing over and over. Points that are close
//   together get nudged the same way, so the lines stay smooth.
//
// index.html loads this file. There is no build step: just save and
// Live Server reloads the page.
// =====================================================================

// -----------------------------------------------------------------
// 1. SETTINGS YOU CAN CHANGE
// -----------------------------------------------------------------

// Colors
const BACKGROUND = '#000000';
const COLORS = ['#ffffff', '#ff2020', '#ffe14d', '#2ee6ff']; // pen colors (the first one is picked at the start)
const CAT_LINE = '#ffffff';   // the stamped cat's lines
const CAT_ACCENT = '#ff2020'; // the cat's wheels

// Pen
const BRUSH_SIZES = [2.5, 4, 7, 12]; // line thickness in pixels (the size button goes through these)
const START_BRUSH = 1;               // which size to start with (0 = the first one)
const STEADY_HAND = 0.3;             // smooths shaky lines: 0 = off, 0.6 = very smooth (but lags behind)

// The "boil" (hand-drawn wobble)
const BOIL_EVERY_MS = 110; // a new wobble every 110 ms = about 9 times a second
const BOIL_AMOUNT = 3;     // how far lines wobble, in pixels (0 = perfectly still)
const BOIL_SIZE = 30;      // how wide each "bump" of the wobble is, in pixels (bigger = smoother)

// Lines drawn less than this many milliseconds apart become one doodle
const GROUP_TIME_MS = 700;

// Bringing doodles to life
const GRAVITY = 2400;      // how fast things fall (pixels per second, every second)
const BOUNCINESS = 0.62;   // 0 = lands like a rock, 1 = bounces forever
const WIGGLE_ANGLE = 0.16; // how far a dancing doodle leans (0.16 radians = about 9 degrees)
const WIGGLE_SPEED = 5;    // how fast it dances
const FLOAT_RISE = 28;     // how fast floating doodles rise (pixels per second)
const HOP_POWER = 520;     // how hard walkers jump
const WALK_SPEED = 160;    // how fast walkers move sideways (pixels per second)
const CRAWL_SPEED = 70;    // how fast wide doodles crawl like a worm
const MAX_THROW = 2600;    // fastest throw (pixels per second)

// Recording clips
const CLIP_SECONDS = 6;                 // how long a recorded clip is
const CLIP_LABEL = 'doodle playground'; // small text in the corner of clips ('' = none)

// Other
const CAT_SIZE = 0.28;     // stamped cat height, as a part of the window height
const MAX_PIXEL_RATIO = 2; // sharper lines on high-res screens; lower it if things get slow
const UNDO_STEPS = 200;    // how many steps Ctrl+Z remembers

// -----------------------------------------------------------------
// 2. THINGS ON THE PAGE, AND WHAT IS GOING ON RIGHT NOW
// -----------------------------------------------------------------
const canvas = document.getElementById('paper');
const ctx = canvas.getContext('2d');
const toolbar = document.getElementById('toolbar');
const hint = document.getElementById('hint');
const toast = document.getElementById('toast');
const measurePath = document.getElementById('measure');
const sizeButton = toolbar.querySelector('[data-action="size"]');

let doodles = [];          // every doodle on the paper, from back to front
let poofs = [];            // "poof" clouds that are playing right now
let undoList = [];         // what Ctrl+Z can take back
let tool = 'pen';          // 'pen', 'move' or 'eraser'
let color = COLORS[0];
let brushIndex = START_BRUSH;
let currentMode = 'still'; // what doodles do: 'still', 'wiggle', 'bounce', 'float' or 'walk'
let selected = null;       // the doodle picked with the move tool (or null)
let openDoodle = null;     // the newest doodle: it takes new lines for a moment
let lastStrokeEnd = 0;     // when the last line was finished (ms)
let liveStroke = null;     // the line being drawn right now
let pointer = null;        // the mouse / finger / pen that is pressed right now
let boilFrame = 0;         // goes up by 1 at every boil; picks the wobble pattern
let frame916 = false;      // true = show the 9:16 frame (for Reels / TikTok)

// -----------------------------------------------------------------
// 3. SMALL HELPERS
// -----------------------------------------------------------------
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const randomSeed = () => Math.floor(Math.random() * 1000000);
const easeOut = (p) => 1 - (1 - p) * (1 - p);
const even = (n) => 2 * Math.round(n / 2); // videos like even sizes

// Shortest distance from the point (px, py) to the line from a to b
function distToSegment(px, py, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq > 0 ? clamp(((px - a.x) * dx + (py - a.y) * dy) / lengthSq, 0, 1) : 0;
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
}

// Points around a circle (for the poof clouds). w = line width.
function circlePoints(cx, cy, r, count, w) {
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const a = (i / count) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, w });
  }
  return pts;
}

// Points around a rectangle (for the selection box and the 9:16 frame)
function boxPoints(x0, y0, x1, y1, step, w) {
  const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]];
  const pts = [];
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = corners[i];
    const [bx, by] = corners[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / step));
    for (let k = 0; k < n; k++) pts.push({ x: lerp(ax, bx, k / n), y: lerp(ay, by, k / n), w });
  }
  pts.push({ x: x0, y: y0, w });
  return pts;
}

// A date-and-time name for saved files, like 2026-10-02-14-30-05
function timeStamp() {
  const d = new Date();
  const two = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}-${two(d.getHours())}-${two(d.getMinutes())}-${two(d.getSeconds())}`;
}

// Make the browser download a file
function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// A short message at the top of the screen
let toastTimer = 0;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// -----------------------------------------------------------------
// 4. THE WOBBLE (smooth random noise)
// -----------------------------------------------------------------

// Gives a "random" number from 0 to 1 for one corner of an invisible grid.
// The same inputs always give the same answer.
function hash(ix, iy, seed) {
  let h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

// Smooth noise: blends the 4 grid corners around (x, y). Result: -1 to 1.
// Nearby points get nearly the same answer, so wobbly lines stay smooth.
function smoothNoise(x, y, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx); // ease the blend so there are no sharp corners
  const sy = fy * fy * (3 - 2 * fy);
  const top = lerp(hash(ix, iy, seed), hash(ix + 1, iy, seed), sx);
  const bottom = lerp(hash(ix, iy + 1, seed), hash(ix + 1, iy + 1, seed), sx);
  return lerp(top, bottom, sy) * 2 - 1;
}

// Returns a wobbly copy of a list of points. A new seed = a new wobble.
function wobble(points, seed) {
  return points.map((p) => {
    const nx = p.x / BOIL_SIZE;
    const ny = p.y / BOIL_SIZE;
    // a big gentle wobble plus a smaller, quicker one
    const dx = smoothNoise(nx, ny, seed) * 0.7 + smoothNoise(nx * 2.3, ny * 2.3, seed + 7) * 0.3;
    const dy = smoothNoise(nx, ny, seed + 13) * 0.7 + smoothNoise(nx * 2.3, ny * 2.3, seed + 19) * 0.3;
    return { x: p.x + dx * BOIL_AMOUNT, y: p.y + dy * BOIL_AMOUNT, w: p.w };
  });
}

// The seed for "this doodle, this boil": changes ~9 times a second
const boilSeed = (seed) => seed + boilFrame * 31;

// -----------------------------------------------------------------
// 5. THE CANVAS SIZE, THE FLOOR AND THE WALLS
// The canvas has more real pixels than CSS pixels on sharp screens
// (devicePixelRatio). We do all our maths in CSS pixels and let
// the canvas scale up when drawing.
// -----------------------------------------------------------------
let W = 0;        // window width (CSS pixels)
let H = 0;        // window height
let dpr = 1;      // real pixels per CSS pixel
let floorY = 0;   // where things land (just above the toolbar)
let frameBox = { x: 0, y: 0, w: 1, h: 1 };  // the 9:16 frame
const room = { left: 0, right: 0, top: 0 }; // walls and ceiling for bouncing things

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  floorY = clamp(toolbar.getBoundingClientRect().top - 6, H * 0.4, H);

  // Pull doodles that ended up off the screen back on
  for (const d of doodles) {
    d.x = clamp(d.x, 0, W);
    d.y = clamp(d.y, 0, floorY);
  }
  updateRoom();
}

// The biggest 9:16 box that fits above the toolbar, and the walls of the room
function updateRoom() {
  const bottom = Math.min(H, floorY + 8);
  const h = Math.max(50, Math.min(bottom - 12, ((W - 24) * 16) / 9));
  const w = (h * 9) / 16;
  frameBox = { x: (W - w) / 2, y: bottom - h, w, h };

  // With the 9:16 frame on, the frame is the room, so bouncing doodles stay in the shot
  room.left = frame916 ? frameBox.x : 0;
  room.right = frame916 ? frameBox.x + frameBox.w : W;
  room.top = frame916 ? frameBox.y : 0;
}

// -----------------------------------------------------------------
// 6. DOODLES
// A doodle is a group of lines that move together. Its points are
// saved around its own center, so moving, turning or squashing the
// doodle never changes the saved points.
// -----------------------------------------------------------------
function newDoodle(x, y) {
  return {
    strokes: [],          // its lines: { color, fill, points: [{ x, y, w }] }
    x, y,                 // where its center is on the screen
    w: 1, h: 1,           // its width and height
    vx: 0, vy: 0,         // speed (pixels per second)
    rot: 0,               // how much it is turned (radians)
    face: 1,              // 1 = as drawn, -1 = mirrored (walkers turn around)
    dir: 1,               // walking direction: 1 = right, -1 = left
    looksLeft: false,     // true if the drawing faces left (the cat does)
    sq: 0, sqV: 0, sqTarget: 0, // squash & stretch: 0 = normal, + = flat, - = tall
    lift: 0,              // a small up/down bob that is only for show
    mode: 'still',
    phase: rand(0, Math.PI * 2), // so doodles don't all move in perfect sync
    seed: randomSeed(),   // its own wobble pattern
    hopTimer: 0, crawl: 0, onFloor: false, held: false,
  };
}

// Turns a point on the screen into the doodle's own (local) points
function screenToDoodle(d, sx, sy) {
  const dx = sx - d.x;
  const dy = sy - (d.y + d.lift);
  const cos = Math.cos(d.rot);
  const sin = Math.sin(d.rot);
  const x = dx * cos + dy * sin; // turn back the other way
  const y = -dx * sin + dy * cos;
  return { x: d.face < 0 ? -x : x, y };
}

// Adds a finished line (in screen points) to a doodle
function addStrokeToDoodle(d, stroke) {
  stroke.points = stroke.points.map((p) => {
    const local = screenToDoodle(d, p.x, p.y);
    return { x: local.x, y: local.y, w: p.w };
  });
  d.strokes.push(stroke);
  recenter(d);
}

// Measures the doodle and moves its center to the middle of its lines.
// The doodle is moved the other way, so nothing jumps on the screen.
function recenter(d) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const s of d.strokes) {
    for (const p of s.points) {
      const r = p.w / 2;
      minX = Math.min(minX, p.x - r);
      minY = Math.min(minY, p.y - r);
      maxX = Math.max(maxX, p.x + r);
      maxY = Math.max(maxY, p.y + r);
    }
  }
  if (minX === Infinity) return; // no lines
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  for (const s of d.strokes) {
    for (const p of s.points) {
      p.x -= cx;
      p.y -= cy;
    }
    s.wobFrame = -1; // the points moved: make a new wobble
  }
  d.w = Math.max(2, maxX - minX);
  d.h = Math.max(2, maxY - minY);
  const fx = d.face < 0 ? -cx : cx;
  d.x += fx * Math.cos(d.rot) - cy * Math.sin(d.rot);
  d.y += fx * Math.sin(d.rot) + cy * Math.cos(d.rot);
}

// Is the local point p within "reach" pixels of one of the doodle's lines?
function touchesLine(d, p, reach) {
  for (const s of d.strokes) {
    const pts = s.points;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[i + 1] || a;
      if (distToSegment(p.x, p.y, a, b) <= reach + a.w / 2) return true;
    }
  }
  return false;
}

// Which doodle is at this spot on the screen? The one on top wins.
// loose = also count clicks inside the doodle's box (not only on its lines).
function doodleAt(x, y, reach, loose) {
  for (let i = doodles.length - 1; i >= 0; i--) {
    const d = doodles[i];
    const p = screenToDoodle(d, x, y);
    const nearBox = Math.abs(p.x) <= d.w / 2 + reach && Math.abs(p.y) <= d.h / 2 + reach;
    if (nearBox && touchesLine(d, p, reach)) return d;
  }
  if (!loose) return null;
  for (let i = doodles.length - 1; i >= 0; i--) {
    const d = doodles[i];
    const p = screenToDoodle(d, x, y);
    if (Math.abs(p.x) <= d.w / 2 + reach / 2 && Math.abs(p.y) <= d.h / 2 + reach / 2) return d;
  }
  return null;
}

// Takes a doodle off the paper. Returns where it was in the list (-1 = it wasn't there).
function removeDoodle(d) {
  const index = doodles.indexOf(d);
  if (index === -1) return -1;
  doodles.splice(index, 1);
  if (openDoodle === d) openDoodle = null;
  if (selected === d) {
    selected = null;
    updateToolbar();
  }
  return index;
}

// The newest doodle stops taking new lines and comes alive
function closeOpenDoodle() {
  const d = openDoodle;
  openDoodle = null;
  if (!d || !doodles.includes(d)) return;
  startMode(d, currentMode);
  d.sqV = 1.5; // a tiny jiggle that says "I'm one thing now!"
}

// -----------------------------------------------------------------
// 7. DRAWING ON A CANVAS
// Every drawing function gets "c", the canvas to draw on. Usually it is
// the paper, but the same functions also draw saved pictures and clips.
// -----------------------------------------------------------------

// A smooth curve through the points: each point bends the line on its
// way to the middle of the next gap (a "quadratic curve").
function traceSmooth(c, pts) {
  c.beginPath();
  c.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const next = pts[i + 1];
    c.quadraticCurveTo(p.x, p.y, (p.x + next.x) / 2, (p.y + next.y) / 2);
  }
  const last = pts[pts.length - 1];
  c.lineTo(last.x, last.y);
}

// Draws one line. pts are its (wobbly) points; each point knows its width.
function drawStroke(c, stroke, pts) {
  if (pts.length === 0) return;
  c.lineCap = 'round';
  c.lineJoin = 'round';

  // Just one point (a quick tap): a dot
  if (pts.length === 1) {
    c.fillStyle = stroke.color;
    c.beginPath();
    c.arc(pts[0].x, pts[0].y, Math.max(pts[0].w / 2, 1), 0, Math.PI * 2);
    c.fill();
    return;
  }

  // Filled shapes (like the cat's body) are filled first, then outlined
  if (stroke.fill) {
    traceSmooth(c, pts);
    c.closePath();
    c.fillStyle = stroke.fill;
    c.fill();
  }
  if (pts[0].w <= 0) return; // no outline (the cat's eyes)

  // The outline. A canvas line has one width, so when the pen pressure
  // changes the width, we finish this piece and start a new one.
  c.strokeStyle = stroke.color;
  let width = pts[1].w;
  let penX = pts[0].x;
  let penY = pts[0].y;
  c.beginPath();
  c.moveTo(penX, penY);
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    const next = pts[i + 1];
    if (Math.abs(p.w - width) > 0.6) {
      c.lineWidth = width;
      c.stroke();
      c.beginPath();
      c.moveTo(penX, penY);
      width = p.w;
    }
    if (next) {
      penX = (p.x + next.x) / 2;
      penY = (p.y + next.y) / 2;
      c.quadraticCurveTo(p.x, p.y, penX, penY);
    } else {
      penX = p.x;
      penY = p.y;
      c.lineTo(penX, penY);
    }
  }
  c.lineWidth = width;
  c.stroke();
}

// The wobbly points of a doodle's line. They only change at each boil,
// so we keep them until the next one (that saves a lot of work).
function wobbledPoints(d, s) {
  if (s.wobFrame !== boilFrame) {
    s.wob = wobble(s.points, boilSeed(d.seed));
    s.wobFrame = boilFrame;
  }
  return s.wob;
}

// Draws a doodle where it is, turned, squashed and mirrored.
// grow = extra size (used when it shrinks away in a poof).
function drawDoodle(c, d, grow, showBox) {
  const half = d.h / 2;
  c.save();
  c.translate(d.x, d.y + d.lift);
  c.rotate(d.rot);
  if (grow !== 1) c.scale(grow, grow);
  // squash from the bottom, so a squashed doodle still touches the floor
  c.translate(0, half);
  c.scale((1 + d.sq * 0.7) * d.face, 1 - d.sq);
  c.translate(0, -half);
  for (const s of d.strokes) drawStroke(c, s, wobbledPoints(d, s));
  if (showBox) drawSelectionBox(c, d);
  c.restore();
}

// A dashed, wobbly box around the picked doodle
function drawSelectionBox(c, d) {
  const pad = 10;
  const pts = boxPoints(-d.w / 2 - pad, -d.h / 2 - pad, d.w / 2 + pad, d.h / 2 + pad, 16, 1.5);
  c.globalAlpha = 0.6;
  c.setLineDash([6, 8]);
  c.lineDashOffset = -boilFrame * 3; // "marching ants"
  drawStroke(c, { color: '#ffffff' }, wobble(pts, boilSeed(d.seed + 5)));
  c.setLineDash([]);
  c.globalAlpha = 1;
}

// A faint wobbly floor line, shown when things fall
function drawFloor(c, view) {
  const pts = [];
  for (let x = view.x - 25; x <= view.x + view.w + 25; x += 25) pts.push({ x, y: floorY + 3, w: 2 });
  c.globalAlpha = 0.22;
  drawStroke(c, { color: '#ffffff' }, wobble(pts, boilSeed(4242)));
  c.globalAlpha = 1;
}

// Draws everything.
// view = which part of the paper to draw, and how big:
//        { x, y, w, h } in screen pixels, scale = canvas pixels per screen pixel.
// clean = true for pictures and clips (no selection box).
function drawScene(c, view, clean) {
  // Paint the whole canvas with the background color
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.fillStyle = BACKGROUND;
  c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  // From now on, draw in screen pixels: the canvas does the moving and scaling
  c.setTransform(view.scale, 0, 0, view.scale, -view.x * view.scale, -view.y * view.scale);
  if (doodles.some((d) => d.mode === 'bounce' || d.mode === 'walk')) drawFloor(c, view);
  for (const d of doodles) drawDoodle(c, d, 1, !clean && d === selected);
  for (const p of poofs) drawPoof(c, p);
  if (liveStroke) drawStroke(c, liveStroke, wobble(liveStroke.points, boilSeed(liveStroke.seed)));
}

// The 9:16 frame on the paper: darkens everything outside it
function drawFrameGuide(c) {
  const f = frameBox;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = 'rgba(0, 0, 0, 0.6)';
  c.fillRect(0, 0, W, f.y);
  c.fillRect(0, f.y + f.h, W, H - f.y - f.h);
  c.fillRect(0, f.y, f.x, f.h);
  c.fillRect(f.x + f.w, f.y, W - f.x - f.w, f.h);

  c.globalAlpha = 0.75;
  c.setLineDash([10, 10]);
  const edgeColor = recorder ? '#ff2020' : '#ffffff'; // red while recording
  drawStroke(c, { color: edgeColor }, wobble(boxPoints(f.x, f.y, f.x + f.w, f.y + f.h, 30, 2), boilSeed(999)));
  c.setLineDash([]);
  c.globalAlpha = 0.6;
  c.fillStyle = '#ffffff';
  c.font = '18px "Patrick Hand", "Comic Sans MS", cursive';
  c.textAlign = 'left';
  c.fillText('9:16', f.x + 10, f.y + 24);
  c.globalAlpha = 1;
}

// -----------------------------------------------------------------
// 8. BRINGING DOODLES TO LIFE
// -----------------------------------------------------------------
const MODE_KEYS = { 1: 'wiggle', 2: 'bounce', 3: 'float', 4: 'walk', 5: 'still' };

// Switch one doodle to a mode
function startMode(d, mode) {
  d.mode = mode;
  if (mode === 'still' || mode === 'wiggle') {
    d.vx = 0;
    d.vy = 0;
  }
  if (mode === 'bounce') d.vy = Math.min(d.vy, -280); // a little hop to show it's alive
  if (mode === 'walk') {
    // walk the way the drawing is looking
    const looksLeftNow = (d.face < 0) !== d.looksLeft;
    d.dir = looksLeftNow ? -1 : 1;
    d.hopTimer = rand(0.05, 0.4);
  }
}

// Mode buttons / number keys: change the picked doodle, or all of them
function setMode(mode) {
  hideHint(true);
  if (selected) {
    startMode(selected, mode);
  } else {
    currentMode = mode; // new doodles will do this too
    closeOpenDoodle();
    for (const d of doodles) startMode(d, mode);
  }
  updateToolbar();
}

// Keeps a doodle inside the room (walls, ceiling, floor).
// Returns how hard it hit the floor and the walls.
function keepInRoom(d, bounciness) {
  const hit = { floor: 0, wall: 0 };
  const halfW = d.w / 2;
  const halfH = d.h / 2;

  if (d.w >= room.right - room.left) {
    d.x = (room.left + room.right) / 2; // too wide to fit: stay in the middle
  } else if (d.x - halfW < room.left) {
    d.x = room.left + halfW;
    if (d.vx < 0) {
      hit.wall = -d.vx;
      d.vx = -d.vx * bounciness;
    }
  } else if (d.x + halfW > room.right) {
    d.x = room.right - halfW;
    if (d.vx > 0) {
      hit.wall = d.vx;
      d.vx = -d.vx * bounciness;
    }
  }

  if (d.y - halfH < room.top && d.h < floorY - room.top) {
    d.y = room.top + halfH;
    if (d.vy < 0) d.vy = -d.vy * bounciness;
  }
  if (d.y + halfH > floorY) {
    d.y = floorY - halfH;
    if (d.vy > 0) {
      hit.floor = d.vy;
      d.vy = -d.vy * bounciness;
      d.vx *= 0.92;
      if (Math.abs(d.vy) < 90) d.vy = 0; // too slow to bounce again: rest
    }
  }
  d.onFloor = d.y + halfH >= floorY - 0.5 && d.vy === 0;
  return hit;
}

// 2. BOUNCE: gravity, bouncing, squash & stretch. Returns how much to lean.
function moveBounce(d, dt) {
  d.vy += GRAVITY * dt;
  d.x += d.vx * dt;
  d.y += d.vy * dt;
  const hit = keepInRoom(d, BOUNCINESS);
  if (hit.floor > 150) { d.sq = Math.min(0.42, hit.floor / 2200); d.sqV = 0; }  // SQUASH!
  if (hit.wall > 150) { d.sq = -Math.min(0.3, hit.wall / 3000); d.sqV = 0; }   // squished sideways
  if (d.onFloor) {
    d.vx *= Math.exp(-2.5 * dt); // slide to a stop
    return 0;
  }
  d.sqTarget = -Math.min(0.14, Math.abs(d.vy) / 6000); // stretch when falling fast
  return clamp(d.vx / 3000, -0.3, 0.3);
}

// 3. FLOAT: drift around slowly and rise, like a balloon
function moveFloat(d, dt, time) {
  const wantVx = Math.sin(time * 0.4 + d.phase) * 30;
  const wantVy = -FLOAT_RISE + Math.sin(time * 0.7 + d.phase * 1.7) * 14;
  const ease = Math.min(1, dt * 0.9); // balloons change speed slowly
  d.vx += (wantVx - d.vx) * ease;
  d.vy += (wantVy - d.vy) * ease;
  d.x += d.vx * dt;
  d.y += d.vy * dt;
  keepInRoom(d, 0.4);
}

// 4. WALK: tall doodles hop along the floor, wide ones crawl like a worm.
// Both turn around at the walls. Returns how much to lean.
function moveWalk(d, dt) {
  const tall = d.h > d.w * 0.8; // "roughly taller than wide"
  d.vy += GRAVITY * dt;
  d.x += d.vx * dt;
  d.y += d.vy * dt;
  if (!tall && d.onFloor) {
    // Inchworm: get longer while moving forward, then bunch up again
    d.vx *= Math.exp(-8 * dt); // a throw slows down quickly on the ground
    d.crawl += dt * 5;
    d.x += d.dir * CRAWL_SPEED * 3 * Math.max(0, Math.cos(d.crawl)) * dt;
  }
  const hit = keepInRoom(d, 0);
  if (d.w < room.right - room.left) {
    if (d.x - d.w / 2 <= room.left + 1 && d.dir < 0) d.dir = 1;
    if (d.x + d.w / 2 >= room.right - 1 && d.dir > 0) d.dir = -1;
  }
  if (hit.floor > 150) { d.sq = Math.min(0.35, hit.floor / 2000); d.sqV = 0; } // landing squash
  if (!d.onFloor) return d.dir * 0.12; // lean forward in the air

  if (tall) {
    d.vx = 0;
    d.hopTimer -= dt;
    d.sqTarget = 0.14; // crouch, getting ready to jump
    if (d.hopTimer <= 0) {
      d.vy = -HOP_POWER;
      d.vx = d.dir * WALK_SPEED;
      d.sq = -0.15; // stretch up as it jumps
      d.sqV = 0;
      d.hopTimer = 0.22;
      d.onFloor = false;
    }
  } else {
    d.sqTarget = 0.18 * (0.5 + 0.5 * Math.sin(d.crawl)); // flat and long, then bunched up
  }
  return 0;
}

// Moves one doodle for one frame (dt = seconds since the last frame)
function updateDoodle(d, dt, time) {
  let leanGoal = 0; // how much we'd like it to be turned
  let liftGoal = 0; // how much we'd like it to bob up
  d.sqTarget = 0;

  if (d.held) {
    // Being dragged: lean the way it's being pulled
    const v = pointer && pointer.drag && pointer.drag.doodle === d ? dragSpeed(pointer.drag) : { x: 0 };
    leanGoal = clamp(v.x / 2500, -0.4, 0.4);
  } else if (d.mode === 'wiggle') {
    // 1. WIGGLE: sway side to side, bob up in the middle, squash at the sides
    const beat = time * WIGGLE_SPEED + d.phase * 0.3;
    leanGoal = Math.sin(beat) * WIGGLE_ANGLE;
    liftGoal = -Math.abs(Math.cos(beat)) * 6;
    d.sqTarget = (Math.abs(Math.sin(beat)) - 0.5) * 0.12;
  } else if (d.mode === 'bounce') {
    leanGoal = moveBounce(d, dt);
  } else if (d.mode === 'float') {
    moveFloat(d, dt, time);
    leanGoal = Math.sin(time * 1.3 + d.phase) * 0.08 + d.vx * 0.002;
    liftGoal = Math.sin(time * 2.1 + d.phase) * 6;
  } else if (d.mode === 'walk') {
    leanGoal = moveWalk(d, dt);
  }
  // 5. FREEZE ('still'): nothing to do; everything below settles back to normal

  // Ease toward the goals, so every change looks smooth
  d.rot += (leanGoal - d.rot) * Math.min(1, dt * 8);
  d.lift += (liftGoal - d.lift) * Math.min(1, dt * 10);
  const faceGoal = d.mode === 'walk' ? d.dir * (d.looksLeft ? -1 : 1) : 1;
  d.face += (faceGoal - d.face) * Math.min(1, dt * 12); // turning around goes "paper thin" for a moment

  // Squash & stretch is a spring: it gets pulled toward sqTarget and
  // overshoots a little, which makes doodles jiggle like jelly
  d.sqV += ((d.sqTarget - d.sq) * 260 - d.sqV * 9) * dt;
  d.sq = clamp(d.sq + d.sqV * dt, -0.45, 0.5);
}

// -----------------------------------------------------------------
// 9. POOFS (when a doodle is erased)
// -----------------------------------------------------------------
const POOF_TIME = 0.5; // seconds

function poof(x, y, size, doodle) {
  poofs.push({
    x, y,
    r: clamp(size, 26, 170),
    age: 0,
    doodle: doodle || null, // the doodle shrinks away inside the poof
    seed: randomSeed(),
    spin: rand(0, Math.PI * 2),
    color: doodle && doodle.strokes[0] ? doodle.strokes[0].color : '#ffffff',
  });
}

function drawPoof(c, p) {
  const t = p.age / POOF_TIME; // 0 at the start, 1 at the end
  if (p.doodle && t < 0.35) drawDoodle(c, p.doodle, 1 - t / 0.35, false);
  c.save();
  c.globalAlpha = Math.max(0, 1 - t);
  // lines flying outward
  for (let i = 0; i < 10; i++) {
    const a = p.spin + (i / 10) * Math.PI * 2;
    const r0 = p.r * (0.5 + 0.6 * easeOut(t));
    const r1 = r0 + p.r * 0.3 * (1 - t) + 2;
    const line = [
      { x: p.x + Math.cos(a) * r0, y: p.y + Math.sin(a) * r0, w: 3 },
      { x: p.x + Math.cos(a) * r1, y: p.y + Math.sin(a) * r1, w: 3 },
    ];
    drawStroke(c, { color: p.color }, wobble(line, boilSeed(p.seed)));
  }
  // little cloud puffs
  for (let i = 0; i < 5; i++) {
    const a = p.spin * 1.7 + (i / 5) * Math.PI * 2;
    const dist = p.r * (0.2 + 0.35 * easeOut(t));
    const puff = circlePoints(p.x + Math.cos(a) * dist, p.y + Math.sin(a) * dist, p.r * 0.16 * (1 - t * 0.5) + 2, 10, 2.5);
    drawStroke(c, { color: p.color }, wobble(puff, boilSeed(p.seed + 3)));
  }
  c.restore();
}

// -----------------------------------------------------------------
// 10. THE CAT STAMP
// The skateboarding cat from dumb-head-web/cat.js (the "ride" pose).
// We ask the browser to measure each SVG path and give us points along
// it, so the cat becomes a normal doodle that boils, bounces and walks.
// fill = the inside color, noLine = no outline, color = the line color.
// -----------------------------------------------------------------
function circlePath(cx, cy, r) {
  return `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
}

const CAT_PARTS = [
  { d: 'M110 128 Q134 128 144 104' },                                                  // tail
  { d: 'M104 128 L124 161 L138 160 L116 124 Z', fill: BACKGROUND },                    // pushing leg
  { d: 'M88 84 C80 104 80 122 84 134 L80 161 L93 161 L96 142 Q104 140 112 134 C119 118 119 100 112 84 Z', fill: BACKGROUND }, // body
  { d: 'M88 98 Q80 108 86 118' },                                                      // front arm
  { d: 'M112 98 L134 90 M134 90 L139 86 M134 90 L140 93' },                            // waving arm
  { d: 'M70 62 C68 50 67 40 66 28 L86 43 Q100 39 114 43 L134 28 C133 40 132 50 130 62 C132 78 118 86 100 86 C82 86 68 78 70 62 Z', fill: BACKGROUND }, // head
  { d: 'M72 36 L76 48 M128 36 L124 48 M66 64 L54 60 M66 70 L53 71 M134 64 L146 60 M134 70 L147 71' }, // ears + whiskers
  { d: circlePath(88, 62, 2.8), fill: CAT_LINE, noLine: true },                       // eyes
  { d: circlePath(112, 62, 2.8), fill: CAT_LINE, noLine: true },
  { d: 'M92 71 q4 5 8 0 q4 5 8 0' },                                                   // mouth
  { d: 'M41.5 157 H158.5 A3.5 3.5 0 0 1 158.5 164 H41.5 A3.5 3.5 0 0 1 41.5 157 Z', fill: BACKGROUND }, // board
  { d: 'M66 164 L66 170 M134 164 L134 170' },                                          // wheel holders
  { d: circlePath(66, 176, 6), fill: BACKGROUND, color: CAT_ACCENT },                  // wheels
  { d: 'M66 172 L66 180', color: CAT_ACCENT },
  { d: circlePath(134, 176, 6), fill: BACKGROUND, color: CAT_ACCENT },
  { d: 'M134 172 L134 180', color: CAT_ACCENT },
];

// Turns an SVG path into lists of points (one list per "M" in the path)
function samplePath(pathData) {
  const lines = [];
  for (const piece of pathData.match(/M[^M]*/g) || []) {
    measurePath.setAttribute('d', piece);
    let length = 0;
    try {
      length = measurePath.getTotalLength();
    } catch (err) {
      continue; // this browser can't measure it: skip this piece
    }
    const count = Math.max(4, Math.ceil(length / 3)); // a point every 3 units
    const pts = [];
    for (let i = 0; i <= count; i++) {
      const p = measurePath.getPointAtLength((length * i) / count);
      pts.push({ x: p.x, y: p.y });
    }
    lines.push(pts);
  }
  return lines;
}

function stampCat() {
  closeOpenDoodle();
  const scale = clamp((H * CAT_SIZE) / 155, 0.5, 1.5); // the cat is about 155 units tall
  const cat = newDoodle(0, 0);
  cat.looksLeft = true; // the drawing faces left (walk mode needs to know)
  for (const part of CAT_PARTS) {
    const width = part.noLine ? 0 : 3.5 * scale;
    for (const line of samplePath(part.d)) {
      cat.strokes.push({
        color: part.color || CAT_LINE,
        fill: part.fill || null,
        points: line.map((p) => ({ x: p.x * scale, y: p.y * scale, w: width })),
      });
    }
  }
  if (cat.strokes.length === 0) return;
  recenter(cat);
  cat.x = rand(room.left + cat.w / 2, room.right - cat.w / 2);
  cat.y = clamp(H * 0.35, room.top + cat.h / 2 + 10, floorY - cat.h / 2);
  startMode(cat, currentMode);
  cat.sq = -0.3; // boing!
  doodles.push(cat);
  remember({ type: 'add', doodle: cat });
  poof(cat.x, cat.y, Math.max(cat.w, cat.h) * 0.6);
}

// -----------------------------------------------------------------
// 11. UNDO, ERASE AND CLEAR
// Every change goes into undoList. Ctrl+Z takes the newest one back.
// -----------------------------------------------------------------
function remember(step) {
  undoList.push(step);
  if (undoList.length > UNDO_STEPS) undoList.shift();
}

function putBack(d, index) {
  if (doodles.includes(d)) return;
  doodles.splice(clamp(index, 0, doodles.length), 0, d);
  poofs = poofs.filter((p) => p.doodle !== d); // stop its poof if it's still playing
}

function undo() {
  if (pointer) return; // finish what you're doing first
  const step = undoList.pop();
  if (!step) return;
  if (step.type === 'stroke') {
    // take the line back off its doodle (and the doodle too, if it was its only line)
    const d = step.doodle;
    d.strokes = d.strokes.filter((s) => s !== step.stroke);
    if (d.strokes.length === 0) removeDoodle(d);
    else recenter(d);
  } else if (step.type === 'add') {
    const d = step.doodle;
    if (removeDoodle(d) !== -1) poof(d.x, d.y + d.lift, Math.max(d.w, d.h) * 0.5, d);
  } else if (step.type === 'erase') {
    putBack(step.doodle, step.index);
  } else if (step.type === 'clear') {
    step.doodles.forEach((d, i) => putBack(d, i));
  }
  updateToolbar();
}

function eraseDoodle(d) {
  const index = removeDoodle(d);
  if (index === -1) return;
  remember({ type: 'erase', doodle: d, index });
  poof(d.x, d.y + d.lift, Math.max(d.w, d.h) * 0.55, d);
}

function clearAll() {
  if (doodles.length === 0) return;
  for (const d of doodles) poof(d.x, d.y + d.lift, Math.max(d.w, d.h) * 0.55, d);
  remember({ type: 'clear', doodles: doodles.slice() });
  doodles = [];
  openDoodle = null;
  selected = null;
  updateToolbar();
}

// -----------------------------------------------------------------
// 12. THE TOOLBAR
// -----------------------------------------------------------------

// Make one button per color in COLORS (before the size button)
function buildSwatches() {
  const box = document.getElementById('swatches');
  for (const c of COLORS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'swatch';
    button.dataset.color = c;
    button.style.setProperty('--c', c);
    button.title = 'Color ' + c;
    button.setAttribute('aria-label', 'Color ' + c);
    box.insertBefore(button, sizeButton);
  }
}

// Show which buttons are switched on
function updateToolbar() {
  const shownMode = selected ? selected.mode : currentMode;
  for (const button of toolbar.querySelectorAll('button')) {
    const data = button.dataset;
    let on = null; // null = this button is never "on"
    if (data.tool) on = data.tool === tool;
    else if (data.color) on = data.color === color;
    else if (data.mode) on = data.mode === shownMode;
    else if (data.action === 'frame') on = frame916;
    else if (data.action === 'record') on = !!recorder;
    if (on === null) continue;
    button.classList.toggle('on', on);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  sizeButton.style.setProperty('--dot', Math.max(4, BRUSH_SIZES[brushIndex] * 1.6) + 'px');
}

function setTool(name) {
  if (name !== tool && name !== 'pen') closeOpenDoodle();
  tool = name;
  if (tool !== 'move') selected = null;
  canvas.style.cursor = tool === 'pen' ? 'crosshair' : 'default';
  updateToolbar();
}

// Picking a color or size means you want to draw. It also keeps the
// newest doodle open a bit longer, so you can add a red nose to it.
function keepDoodleOpen() {
  if (openDoodle) lastStrokeEnd = performance.now();
}

function setColor(c) {
  color = c;
  keepDoodleOpen();
  setTool('pen');
}

function changeSize(step, wrapAround) {
  const n = BRUSH_SIZES.length;
  brushIndex = wrapAround ? (brushIndex + step + n) % n : clamp(brushIndex + step, 0, n - 1);
  keepDoodleOpen();
  setTool('pen');
}

function toggleFrame() {
  if (recorder) {
    showToast('wait for the clip to finish');
    return;
  }
  frame916 = !frame916;
  updateRoom();
  updateToolbar();
}

toolbar.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const data = button.dataset;
  if (data.tool) setTool(data.tool);
  else if (data.color) setColor(data.color);
  else if (data.mode) setMode(data.mode);
  else if (data.action === 'size') changeSize(1, true);
  else if (data.action === 'cat') stampCat();
  else if (data.action === 'undo') undo();
  else if (data.action === 'clear') clearAll();
  else if (data.action === 'save') savePicture();
  else if (data.action === 'frame') toggleFrame();
  else if (data.action === 'record') toggleRecording();
});

// The toolbar's lines boil too: we swap between 3 SVG filters
// (cartoonists often loop just 3 drawings of the same thing).
let toolbarFilter = 0;
function boilToolbar() {
  toolbarFilter = (toolbarFilter + 1 + Math.floor(Math.random() * 2)) % 3; // never the same twice
  toolbar.style.filter = `url(#boil-${toolbarFilter})`;
}

// The hint fades out after your first line (or right away when you press a mode)
function hideHint(rightAway) {
  if (rightAway) hint.classList.add('now');
  hint.classList.add('gone');
}

// -----------------------------------------------------------------
// 13. MOUSE, FINGER AND PEN ("pointer events" handle all three)
// -----------------------------------------------------------------

// How close (in pixels) you must click to a line. Fingers are less exact.
const reachFor = (pointerType) => (pointerType === 'touch' ? 22 : 12);

// Line width: pens press harder = thicker. Mouse and fingers = the brush size.
function widthFor(event) {
  const size = BRUSH_SIZES[brushIndex];
  if (event.pointerType === 'pen' && event.pressure > 0) return size * (0.3 + event.pressure * 1.4);
  return size;
}

// --- Drawing ---
function startStroke(event) {
  liveStroke = {
    color,
    points: [],
    seed: randomSeed(),
    joinTarget: openDoodle, // if a doodle is still open, this line joins it
  };
  addPoint(liveStroke, event.clientX, event.clientY, widthFor(event), true);
}

// Adds a point to a line. exact = use the point as it is (no smoothing).
function addPoint(stroke, x, y, w, exact) {
  const pts = stroke.points;
  const last = pts[pts.length - 1];
  if (last) {
    if (!exact) {
      x = lerp(last.x, x, 1 - STEADY_HAND);
      y = lerp(last.y, y, 1 - STEADY_HAND);
    }
    w = lerp(last.w, w, 0.3); // pressure changes smoothly
    if (Math.hypot(x - last.x, y - last.y) < 1.5) return; // too close to the last point
  }
  pts.push({ x, y, w });
}

function finishStroke(event) {
  const s = liveStroke;
  liveStroke = null;
  if (!s || s.points.length === 0) return;
  // Smoothing lags a little behind, so finish exactly where the pointer let go
  if (event.type === 'pointerup') {
    const last = s.points[s.points.length - 1];
    addPoint(s, event.clientX, event.clientY, last.w, true);
  }

  const stroke = { color: s.color, fill: null, points: s.points };
  let d = s.joinTarget;
  if (!d || d !== openDoodle || !doodles.includes(d)) {
    d = newDoodle(s.points[0].x, s.points[0].y); // start a new doodle
    doodles.push(d);
  }
  addStrokeToDoodle(d, stroke);
  openDoodle = d;
  lastStrokeEnd = performance.now();
  remember({ type: 'stroke', doodle: d, stroke });
  hideHint(false);
}

// --- Dragging and throwing ---
function startDrag(x, y, pointerType) {
  const d = doodleAt(x, y, reachFor(pointerType), true);
  selected = d;
  updateToolbar();
  if (!d) return null;
  if (d === openDoodle) closeOpenDoodle();
  doodles.splice(doodles.indexOf(d), 1); // bring it to the front
  doodles.push(d);
  d.held = true;
  d.vx = 0;
  d.vy = 0;
  canvas.style.cursor = 'grabbing';
  return { doodle: d, offX: d.x - x, offY: d.y - y, trail: [{ x, y, t: performance.now() }] };
}

function moveDrag(drag, x, y) {
  if (!drag) return;
  drag.doodle.x = x + drag.offX;
  drag.doodle.y = y + drag.offY;
  const now = performance.now();
  drag.trail.push({ x, y, t: now });
  while (drag.trail.length > 2 && now - drag.trail[0].t > 100) drag.trail.shift(); // keep the last 0.1 s
}

// How fast the pointer was moving just now (pixels per second)
function dragSpeed(drag) {
  const trail = drag.trail;
  const first = trail[0];
  const last = trail[trail.length - 1];
  if (trail.length < 2 || performance.now() - last.t > 60) return { x: 0, y: 0 }; // it stopped
  const seconds = (last.t - first.t) / 1000;
  if (seconds < 0.01) return { x: 0, y: 0 };
  return { x: (last.x - first.x) / seconds, y: (last.y - first.y) / seconds };
}

function endDrag(drag) {
  if (!drag) return;
  const d = drag.doodle;
  d.held = false;
  // Let go while moving = throw it (in the modes that move by themselves)
  if (d.mode === 'bounce' || d.mode === 'walk' || d.mode === 'float') {
    const v = dragSpeed(drag);
    d.vx = clamp(v.x, -MAX_THROW, MAX_THROW);
    d.vy = clamp(v.y, -MAX_THROW, MAX_THROW);
  }
}

// --- Erasing ---
function eraseAt(x, y, pointerType, loose) {
  const d = doodleAt(x, y, reachFor(pointerType), loose);
  if (d) eraseDoodle(d);
}

// --- Mouse cursor: a hand over doodles you can grab ---
function updateHoverCursor(event) {
  if (event.pointerType !== 'mouse' || tool === 'pen') return;
  const over = doodleAt(event.clientX, event.clientY, 12, true);
  canvas.style.cursor = over ? (tool === 'move' ? 'grab' : 'pointer') : 'default';
}

// --- The pointer events themselves ---
canvas.addEventListener('pointerdown', (event) => {
  if (pointer) return; // already busy with another finger
  if (event.pointerType === 'mouse' && event.button !== 0) return; // left button only
  event.preventDefault();
  if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  try {
    canvas.setPointerCapture(event.pointerId); // keep getting moves even outside the canvas
  } catch (err) {
    // not a big deal
  }
  const job = event.button === 5 ? 'eraser' : tool; // the eraser end of a pen always erases
  pointer = { id: event.pointerId, job, drag: null };
  if (job === 'pen') startStroke(event);
  else if (job === 'move') pointer.drag = startDrag(event.clientX, event.clientY, event.pointerType);
  else eraseAt(event.clientX, event.clientY, event.pointerType, true);
});

canvas.addEventListener('pointermove', (event) => {
  if (!pointer) {
    updateHoverCursor(event);
    return;
  }
  if (event.pointerId !== pointer.id) return;
  if (pointer.job === 'pen') {
    // Fast pens send many points between frames; getCoalescedEvents gives us all of them
    const list = event.getCoalescedEvents ? event.getCoalescedEvents() : [];
    for (const e of list.length ? list : [event]) addPoint(liveStroke, e.clientX, e.clientY, widthFor(e), false);
  } else if (pointer.job === 'move') {
    moveDrag(pointer.drag, event.clientX, event.clientY);
  } else {
    eraseAt(event.clientX, event.clientY, event.pointerType, false); // scrub to erase more
  }
});

function endPointer(event) {
  if (!pointer || event.pointerId !== pointer.id) return;
  const p = pointer;
  pointer = null;
  if (p.job === 'pen') finishStroke(event);
  else if (p.job === 'move') endDrag(p.drag);
  updateHoverCursor(event);
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('lostpointercapture', endPointer);
canvas.addEventListener('contextmenu', (event) => event.preventDefault()); // no menu on long press

// -----------------------------------------------------------------
// 14. KEYBOARD
// -----------------------------------------------------------------
window.addEventListener('keydown', (event) => {
  const key = (event.key || '').toLowerCase();
  if (event.ctrlKey || event.metaKey) {
    if (key === 'z') { event.preventDefault(); undo(); }
    if (key === 's') { event.preventDefault(); savePicture(); }
    return;
  }
  if (event.altKey) return;
  if (key === '[') return changeSize(-1, false);
  if (key === ']') return changeSize(1, false);
  if (event.repeat) return; // holding a key down doesn't repeat the rest
  if (MODE_KEYS[key]) setMode(MODE_KEYS[key]);
  else if (key === 'p' || key === 'b') setTool('pen');
  else if (key === 'm' || key === 'v') setTool('move');
  else if (key === 'e') setTool('eraser');
  else if (key === 'c') stampCat();
  else if (key === 'r') toggleRecording();
  else if (key === '9') toggleFrame();
  else if (key === 'escape') { selected = null; updateToolbar(); }
  else if ((key === 'delete' || key === 'backspace') && selected) eraseDoodle(selected);
});

// -----------------------------------------------------------------
// 15. SAVE A PICTURE (PNG)
// We draw a fresh copy (without the selection box) on a separate canvas.
// With the 9:16 frame on, only the frame is saved, at 1080 x 1920.
// -----------------------------------------------------------------

// Which part of the paper a picture or clip shows, sized for the target canvas
function shotView(target) {
  const area = frame916 ? frameBox : { x: 0, y: 0, w: W, h: H };
  return { x: area.x, y: area.y, w: area.w, h: area.h, scale: target.width / area.w };
}

function savePicture() {
  const shot = document.createElement('canvas');
  shot.width = frame916 ? 1080 : canvas.width;
  shot.height = frame916 ? 1920 : canvas.height;
  drawScene(shot.getContext('2d'), shotView(shot), true);
  shot.toBlob((blob) => {
    if (blob) downloadBlob(blob, `doodle-${timeStamp()}.png`);
  }, 'image/png');
}

// -----------------------------------------------------------------
// 16. RECORD A CLIP
// While recording, every frame is also drawn on a hidden canvas
// (1080 x 1920 with the 9:16 frame on). captureStream turns that canvas
// into a video stream, and MediaRecorder saves the stream as a file.
// -----------------------------------------------------------------
const recCanvas = document.getElementById('rec-canvas');
const recCtx = recCanvas.getContext('2d');
const recBadge = document.getElementById('rec');
const recTime = document.getElementById('rec-time');
const clipPanel = document.getElementById('clip');

// The video formats we'd like, best first. MP4 plays almost everywhere
// (phones, Instagram, TikTok). Firefox can only make WebM.
const VIDEO_TYPES = [
  'video/mp4;codecs=avc1.640028',
  'video/mp4;codecs=avc1',
  'video/mp4',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
];

let recorder = null;  // the MediaRecorder, while recording
let recEndsAt = 0;    // when the clip ends (ms)
let recTimer = 0;
let readyClip = null; // a finished clip waiting for "share" or "save"

function pickVideoType() {
  if (!MediaRecorder.isTypeSupported) return '';
  return VIDEO_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

function toggleRecording() {
  if (recorder) {
    stopRecording(); // pressing it again stops early
    return;
  }
  if (!window.MediaRecorder || !recCanvas.captureStream) {
    showToast("sorry, this browser can't record clips");
    return;
  }
  hideHint(true);
  clipPanel.hidden = true;

  // The video size: 1080 x 1920 for 9:16, otherwise the window (at most 1920 wide or tall)
  if (frame916) {
    recCanvas.width = 1080;
    recCanvas.height = 1920;
  } else {
    const s = Math.min(dpr, 1920 / Math.max(W, H));
    recCanvas.width = even(W * s);
    recCanvas.height = even(H * s);
  }
  drawClipFrame(); // the first picture, so the video doesn't start blank

  const stream = recCanvas.captureStream(30); // 30 pictures per second
  const type = pickVideoType();
  const chunks = [];
  let rec;
  try {
    const options = { videoBitsPerSecond: 8000000 };
    if (type) options.mimeType = type;
    rec = new MediaRecorder(stream, options);
  } catch (err) {
    stream.getTracks().forEach((track) => track.stop());
    showToast("sorry, this browser can't record clips");
    return;
  }
  rec.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) chunks.push(event.data);
  };
  rec.onerror = () => {
    showToast('recording stopped, something went wrong');
    if (recorder === rec) stopRecording();
  };
  rec.onstop = () => {
    stream.getTracks().forEach((track) => track.stop());
    const blobType = (rec.mimeType || type || 'video/webm').split(';')[0];
    clipFinished(new Blob(chunks, { type: blobType }));
  };
  rec.start(500); // hand us the video in half-second pieces
  recorder = rec;
  recEndsAt = performance.now() + CLIP_SECONDS * 1000;
  recTimer = setTimeout(stopRecording, CLIP_SECONDS * 1000);
  recTime.textContent = CLIP_SECONDS;
  recBadge.hidden = false;
  updateToolbar();
}

function stopRecording() {
  clearTimeout(recTimer);
  const rec = recorder;
  recorder = null;
  recBadge.hidden = true;
  updateToolbar();
  if (rec && rec.state !== 'inactive') rec.stop(); // onstop (above) runs when the file is ready
}

// Draws one picture of the clip (called every frame while recording)
function drawClipFrame() {
  drawScene(recCtx, shotView(recCanvas), true);
  if (CLIP_LABEL) {
    const size = Math.round(recCanvas.height * 0.022);
    recCtx.setTransform(1, 0, 0, 1, 0, 0);
    recCtx.globalAlpha = 0.45;
    recCtx.fillStyle = '#ffffff';
    recCtx.font = `${size}px "Patrick Hand", "Comic Sans MS", cursive`;
    recCtx.textAlign = 'left';
    recCtx.fillText(CLIP_LABEL, size, size * 1.8);
    recCtx.globalAlpha = 1;
  }
}

// The clip is done. Phones (and some computers) can share files straight
// to other apps; sharing needs a fresh tap, so we show a "share" button.
// Everywhere else the clip just downloads.
function clipFinished(blob) {
  if (!blob.size) {
    showToast('the clip came out empty, try again');
    return;
  }
  const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
  const file = new File([blob], `doodle-${timeStamp()}.${ext}`, { type: blob.type });
  let canShare = false;
  try {
    canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
  } catch (err) {
    canShare = false;
  }
  if (canShare) {
    readyClip = file;
    clipPanel.hidden = false;
  } else {
    downloadBlob(file, file.name);
    showToast('clip saved!');
  }
}

clipPanel.addEventListener('click', async (event) => {
  const button = event.target.closest('button');
  if (!button || !readyClip) return;
  const job = button.dataset.clip;
  if (job === 'share') {
    try {
      await navigator.share({ files: [readyClip] });
      clipPanel.hidden = true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        // sharing didn't work: save it instead
        downloadBlob(readyClip, readyClip.name);
        clipPanel.hidden = true;
      }
    }
  } else if (job === 'save') {
    downloadBlob(readyClip, readyClip.name);
    clipPanel.hidden = true;
  } else {
    clipPanel.hidden = true;
  }
});

// -----------------------------------------------------------------
// 17. THE MAIN LOOP: move everything, then draw everything, every frame
// -----------------------------------------------------------------
let lastTime = performance.now();
let lastBoil = 0;

function animate(now) {
  const dt = Math.min(1 / 30, Math.max(0, (now - lastTime) / 1000)); // seconds since last frame
  lastTime = now;
  const time = now / 1000;

  // Boil: a new wobble pattern ~9 times a second
  if (now - lastBoil >= BOIL_EVERY_MS) {
    boilFrame++;
    lastBoil = now;
    boilToolbar();
  }

  // Moved the window to a screen with a different pixel ratio? Resize.
  if (Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO) !== dpr) resize();

  // The newest doodle comes alive once you stop drawing for a moment
  if (openDoodle && !liveStroke && now - lastStrokeEnd > GROUP_TIME_MS) closeOpenDoodle();

  for (const d of doodles) updateDoodle(d, dt, time);
  for (const p of poofs) p.age += dt;
  poofs = poofs.filter((p) => p.age < POOF_TIME);

  drawScene(ctx, { x: 0, y: 0, w: W, h: H, scale: dpr }, false);
  if (recorder) {
    drawClipFrame();
    recTime.textContent = Math.max(1, Math.ceil((recEndsAt - now) / 1000));
  }
  if (frame916) drawFrameGuide(ctx); // drawn after the clip, so it isn't in the video

  requestAnimationFrame(animate);
}

// -----------------------------------------------------------------
// 18. START
// -----------------------------------------------------------------
buildSwatches();
updateToolbar();
resize();
window.addEventListener('resize', resize);
if (window.ResizeObserver) new ResizeObserver(resize).observe(toolbar); // toolbar wraps = floor moves
requestAnimationFrame(animate);
