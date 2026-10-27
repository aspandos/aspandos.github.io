// =====================================================================
// app.js - REEL MAKER
// Turns the skateboarding cat (and your own doodles) into a 9:16 video
// clip for Instagram Reels / TikTok.
//
// The big idea:
//   * The canvas is 1080 x 1920 pixels: the exact size of a Reel.
//   * About 60 times a second we wipe it and draw everything again for
//     the current moment of the clip (the "playhead", in seconds).
//   * Everything is worked out from the playhead alone, so the preview
//     and the recorded video look exactly the same.
//   * RECORD restarts the clip and lets the browser film the canvas
//     (canvas.captureStream + MediaRecorder) for exactly one clip length.
//
// The cat drawing is copied from ../dumb-head-web/cat.js (copied, not
// linked, so this folder works on its own).
// =====================================================================

// -----------------------------------------------------------------
// 1. SETTINGS YOU CAN CHANGE
// -----------------------------------------------------------------

// What the app starts with. (The panel can change all of these too.)
const START = {
  scene: 'skate',            // 'skate', 'thumbs', 'kickflip' or 'none'
  clipLength: 6,             // seconds, 3 to 15
  background: '#000000',
  lineColor: '#ffffff',
  accentColor: '#ff2020',    // the skateboard wheels
  boil: true,                // true = wobbly "boiling" hand-drawn lines
  hook: true,                // grab attention in the 1st second: start mid-action + whoosh + zoom
  seamless: true,            // the end flows perfectly into the start (viewers rewatch more)
  safeZones: false,          // show where the app's buttons cover the video (preview only)
  captionText: '',
  captionPosition: 'top',    // 'top' or 'bottom'
  captionFont: 'Gochi Hand', // 'Gochi Hand' or 'Permanent Marker' (loaded in index.html)
  captionSize: 110,          // letter size in pixels
};

// The video
const VIDEO_WIDTH = 1080;        // 1080 x 1920 = 9:16, the Reels / TikTok size
const VIDEO_HEIGHT = 1920;
const VIDEO_FPS = 30;            // frames per second in the recorded video
const VIDEO_BITRATE = 12000000;  // quality in bits per second (bigger = sharper, bigger file)

// Where Instagram / TikTok cover the video with their own buttons and text
// (in pixels of the 1080 x 1920 video). We keep the cat and captions out of these.
const SAFE_ZONE = { top: 250, bottom: 420, right: 140 };

// The hook (the first second decides if people keep watching)
const HOOK_SECONDS = 0.6;        // how long the whoosh + zoom lasts
const HOOK_ZOOM = 1.2;           // how far zoomed in the very first frame is (1 = no zoom)

// The hand-drawn "boil"
const BOIL_MS = 110;             // a new wobble every 110 ms (about 9 per second)
const WOBBLE = 2;                // how far the cat's lines wobble (drawing units, 0 = still)

// The cat (his drawing is 280 x 200 "drawing units"; see section 5)
const CAT_SCALE = 3.2;           // 1 drawing unit = 3.2 pixels, so he's about 900 px wide
const LINE_WIDTH = 3.5;          // line thickness, in drawing units
const GROUND_Y = 1160;           // where his wheels touch the ground (pixels from the top)
const SHOW_GROUND = true;        // draw a wobbly ground line under him
const JUMP_HEIGHT = 90;          // kickflip height, in drawing units

// Captions
const CAPTION_MARGIN = 40;       // gap between the caption and the safe zone edge

// Your doodles
const DOODLE_MAX_PIXELS = 900;   // big photos are shrunk to this first (faster)
const DOODLE_WOBBLE = 0.004;     // how much doodle lines wobble, as a part of the picture size
const DOODLE_START = { animation: 'bounce', size: 45, cleanup: 15 };
// Where new doodles appear: [left-right %, up-down %]. 1st doodle = 1st spot, and so on.
const DOODLE_SPOTS = [[45, 28], [24, 50], [66, 50], [45, 74], [24, 22], [66, 22]];

// The current values (the panel changes these while the app runs)
const settings = { ...START };

// The middle of the area that ISN'T covered by buttons (a bit left of the real middle)
const SAFE_MIDDLE_X = (VIDEO_WIDTH - SAFE_ZONE.right) / 2;

// -----------------------------------------------------------------
// 2. THE CANVAS AND THE PAGE
// -----------------------------------------------------------------
const canvas = document.getElementById('reel');
const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false = never see-through (a bit faster)
ctx.imageSmoothingQuality = 'high';

const el = (id) => document.getElementById(id);
const ui = {
  stage: el('stage'), screen: el('screen'),
  safeZones: el('safe-zones'), zoneTop: el('zone-top'), zoneRight: el('zone-right'), zoneBottom: el('zone-bottom'),
  recBadge: el('rec-badge'), recTime: el('rec-time'),
  playBtn: el('play-btn'), restartBtn: el('restart-btn'), timeLabel: el('time-label'), scrubber: el('scrubber'),
  scene: el('scene'),
  doodleInput: el('doodle-input'), doodleStatus: el('doodle-status'),
  doodleList: el('doodle-list'), doodleTemplate: el('doodle-template'),
  captionText: el('caption-text'), captionPosition: el('caption-position'),
  captionFont: el('caption-font'), captionSize: el('caption-size'),
  background: el('background'), lineColor: el('line-color'), accentColor: el('accent-color'),
  clipLength: el('clip-length'), clipLengthOut: el('clip-length-out'), boil: el('boil'),
  hook: el('hook'), seamless: el('seamless'), safeZonesToggle: el('safe-zones-toggle'),
  recordBtn: el('record-btn'), recordHint: el('record-hint'),
  result: el('result'), resultVideo: el('result-video'),
  shareBtn: el('share-btn'), downloadLink: el('download-link'), shareHint: el('share-hint'),
};

// -----------------------------------------------------------------
// 3. SMALL HELPERS
// -----------------------------------------------------------------
const lerp = (a, b, t) => a + (b - a) * t;               // in between a and b (t = 0..1)
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const mod = (a, n) => ((a % n) + n) % n;                 // like % but never negative
const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Easing: how a movement speeds up and slows down (p goes from 0 to 1)
const easeIn = (p) => p * p;
const easeOut = (p) => 1 - (1 - p) * (1 - p);
const easeInOut = (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
const easeOutBack = (p) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2; // overshoots a bit

// 0 before "start", 1 after start + length, and in between it grows
const phase = (now, start, length) => clamp((now - start) / length, 0, 1);

// A random number from 0 to 1 that is always the SAME for the same three
// whole numbers. (So frame 12 of the boil always wobbles the same way.)
function random3(a, b, c) {
  let h = (Math.imul(a | 0, 0x27d4eb2d) + Math.imul(b | 0, 0x165667b1) + Math.imul(c | 0, 0x9e3779b1)) | 0;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// Smooth noise: random, but it changes GENTLY from place to place, so
// nearby points wobble together. That makes lines bend instead of break.
// (This is what the SVG feTurbulence filter does in cat.js.)
function smoothNoise(x, y, seed) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx); // smooth the blend
  const sy = fy * fy * (3 - 2 * fy);
  const upper = lerp(random3(x0, y0, seed), random3(x0 + 1, y0, seed), sx);
  const lower = lerp(random3(x0, y0 + 1, seed), random3(x0 + 1, y0 + 1, seed), sx);
  return lerp(upper, lower, sy); // 0..1
}

// SEAMLESS LOOPS: a repeating movement has to fit into the clip a whole
// number of times, so the last frame flows into the first. This nudges
// a repeat time (in seconds) so it fits. With seamless off, it does nothing.
function loopPeriod(seconds) {
  if (!settings.seamless) return seconds;
  const repeats = Math.max(1, Math.round(settings.clipLength / seconds));
  return settings.clipLength / repeats;
}

// A smooth back-and-forth from -1 to 1 that repeats every "seconds"
const wave = (t, seconds, shift = 0) => Math.sin((2 * Math.PI * t) / loopPeriod(seconds) + shift);

// -----------------------------------------------------------------
// 4. PATH TOOLS
// The cat is drawn with SVG "path" text like "M10 20 L30 40 Q50 0 70 40".
// (M = move the pen, L = line, Q and C = curves, Z = close the shape.
//  A small letter means "measured from where the pen is now".)
// flattenPath() turns that text into lists of points a few units apart.
// Points are easy to wobble: we nudge each one a little, then join the dots.
// -----------------------------------------------------------------
function flattenPath(d, step) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+/g) || [];
  const pieces = [];           // each piece: { points: [[x, y], ...], closed: true/false }
  let piece = null;
  let x = 0;                   // where the pen is
  let y = 0;
  let startX = 0;              // where the current piece started (for Z)
  let startY = 0;
  let command = 'M';
  let i = 0;

  const isLetter = (token) => /[a-zA-Z]/.test(token);
  const read = () => parseFloat(tokens[i++]);
  const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);

  // Walk along a line or curve and drop a point every "step" units.
  // pointAt(t) gives the spot at t (0 = start, 1 = end).
  function addPoints(length, pointAt) {
    if (!piece) {
      piece = { points: [[x, y]], closed: false };
      pieces.push(piece);
    }
    const count = Math.max(1, Math.ceil(length / step));
    for (let k = 1; k <= count; k++) piece.points.push(pointAt(k / count));
  }

  while (i < tokens.length) {
    if (isLetter(tokens[i])) command = tokens[i++];
    const relative = command === command.toLowerCase();
    const ox = relative ? x : 0;
    const oy = relative ? y : 0;
    const before = i;

    switch (command.toUpperCase()) {
      case 'M': { // move the pen (starts a new piece)
        x = ox + read();
        y = oy + read();
        startX = x;
        startY = y;
        piece = { points: [[x, y]], closed: false };
        pieces.push(piece);
        command = relative ? 'l' : 'L'; // more numbers after M mean "line to"
        break;
      }
      case 'L': { // straight line
        const x0 = x, y0 = y;
        const x1 = ox + read(), y1 = oy + read();
        addPoints(dist(x0, y0, x1, y1), (t) => [lerp(x0, x1, t), lerp(y0, y1, t)]);
        x = x1;
        y = y1;
        break;
      }
      case 'Q': { // curve with one control point
        const x0 = x, y0 = y;
        const cx = ox + read(), cy = oy + read();
        const x1 = ox + read(), y1 = oy + read();
        addPoints(dist(x0, y0, cx, cy) + dist(cx, cy, x1, y1), (t) => [
          lerp(lerp(x0, cx, t), lerp(cx, x1, t), t),
          lerp(lerp(y0, cy, t), lerp(cy, y1, t), t),
        ]);
        x = x1;
        y = y1;
        break;
      }
      case 'C': { // curve with two control points
        const x0 = x, y0 = y;
        const ax = ox + read(), ay = oy + read();
        const bx = ox + read(), by = oy + read();
        const x1 = ox + read(), y1 = oy + read();
        const length = dist(x0, y0, ax, ay) + dist(ax, ay, bx, by) + dist(bx, by, x1, y1);
        addPoints(length, (t) => {
          const u = 1 - t;
          return [
            u * u * u * x0 + 3 * u * u * t * ax + 3 * u * t * t * bx + t * t * t * x1,
            u * u * u * y0 + 3 * u * u * t * ay + 3 * u * t * t * by + t * t * t * y1,
          ];
        });
        x = x1;
        y = y1;
        break;
      }
      case 'Z': { // close the shape: line back to where the piece started
        if (piece) {
          const x0 = x, y0 = y;
          addPoints(dist(x0, y0, startX, startY), (t) => [lerp(x0, startX, t), lerp(y0, startY, t)]);
          piece.closed = true;
        }
        x = startX;
        y = startY;
        piece = null;
        break;
      }
      default:
        break; // a command we don't use (like arcs): skipped below
    }

    // Safety: if nothing was read, skip the odd number so we never get stuck
    if (i === before && i < tokens.length && !isLetter(tokens[i])) i++;
  }
  return pieces;
}

// SVG path text for a circle (4 curves are close enough to round)
function circle(cx, cy, r) {
  const k = r * 0.5523;
  const n = (v) => +v.toFixed(2);
  return `M${n(cx + r)} ${cy} ` +
    `C${n(cx + r)} ${n(cy + k)} ${n(cx + k)} ${n(cy + r)} ${cx} ${n(cy + r)} ` +
    `C${n(cx - k)} ${n(cy + r)} ${n(cx - r)} ${n(cy + k)} ${n(cx - r)} ${cy} ` +
    `C${n(cx - r)} ${n(cy - k)} ${n(cx - k)} ${n(cy - r)} ${cx} ${n(cy - r)} ` +
    `C${n(cx + k)} ${n(cy - r)} ${n(cx + r)} ${n(cy - k)} ${n(cx + r)} ${cy} Z`;
}

// Turn points into a Path2D the canvas can draw, wobbling every point
// with smooth noise. seed = which wobble, amount = how far, size = how
// wide the wobbly bumps are.
function buildPath(pieces, seed, amount, size) {
  const path = new Path2D();
  for (const piece of pieces) {
    piece.points.forEach(([px, py], k) => {
      let dx = 0;
      let dy = 0;
      if (amount > 0) {
        dx = (smoothNoise(px * size, py * size, seed * 2) - 0.5) * 2 * amount;
        dy = (smoothNoise(px * size, py * size, seed * 2 + 1) - 0.5) * 2 * amount;
      }
      if (k === 0) path.moveTo(px + dx, py + dy);
      else path.lineTo(px + dx, py + dy);
    });
    if (piece.closed) path.closePath();
  }
  return path;
}

// -----------------------------------------------------------------
// 5. THE CAT DRAWING (copied from dumb-head-web/cat.js)
// The drawing is 280 x 200 units; the point under the wheels is (100, 183).
// It faces LEFT; we mirror it when the cat rides to the right.
//
// Kinds of shapes:
//   'shape' = filled with the background color, outlined with the line color
//   'line'  = just a line
//   'dot'   = filled with the line color (pupils)
//   'wheel' = filled with the background color, outlined with the accent color
//   'spoke' = a line in the accent color
// -----------------------------------------------------------------
const ALL_CAT_SHAPES = []; // every shape, so we can wobble them all at once

function shape(kind, d) {
  const item = { kind, pieces: flattenPath(d, 2.5), path: null };
  ALL_CAT_SHAPES.push(item);
  return item;
}

const HEAD = [
  shape('shape', 'M70 62 C68 50 67 40 66 28 L86 43 Q100 39 114 43 L134 28 C133 40 132 50 130 62 C132 78 118 86 100 86 C82 86 68 78 70 62 Z'),
  shape('line', 'M72 36 L76 48 M128 36 L124 48 M66 64 L54 60 M66 70 L53 71 M134 64 L146 60 M134 70 L147 71'), // ear lines + whiskers
];

const CAT = {
  // Speed lines behind him, and little shake marks by his feet
  speed: shape('line', 'M168 148 L236 148 M180 166 L244 166 M166 184 L222 184'),
  shakes: shape('line', 'M72 142 L69 152 M77 146 L75 154 M146 146 L148 155 M151 142 L154 151'),

  // RIDE: standing on the board, one leg pushing
  ride: {
    tail: shape('line', 'M110 128 Q134 128 144 104'),
    leg: shape('shape', 'M104 128 L124 161 L138 160 L116 124 Z'),
    body: [
      shape('shape', 'M88 84 C80 104 80 122 84 134 L80 161 L93 161 L96 142 Q104 140 112 134 C119 118 119 100 112 84 Z'),
      shape('line', 'M88 98 Q80 108 86 118'),
    ],
    arm: shape('line', 'M112 98 L134 90 M134 90 L139 86 M134 90 L140 93'),
    eyes: shape('dot', `${circle(88, 62, 2.8)} ${circle(112, 62, 2.8)}`),
    mouth: shape('line', 'M92 71 q4 5 8 0 q4 5 8 0'),
  },

  // AIR: happy closed eyes, one paw up
  air: [
    shape('line', 'M118 124 Q142 124 146 100 Q148 90 141 92'),
    shape('shape', 'M88 84 C74 96 72 116 80 128 L72 138 L86 139 L93 130 Q100 132 107 130 L114 139 L128 138 L120 128 C128 116 126 96 112 84 Z'),
    shape('line', 'M88 98 Q76 104 80 112 Q86 116 92 110'),
    shape('line', 'M114 96 L140 76 M140 76 L138 69 M140 76 L147 73'),
    ...HEAD,
    shape('line', 'M82 63 Q87 57 92 63 M108 63 Q113 57 118 63'),
    shape('line', 'M96 71 Q100 75 104 71'),
  ],

  // GRAB: big round eyes, holding the board. (No built-in scene uses this
  // pose yet - try it in your own scene: set s.pose = 'grab'.)
  grab: [
    shape('line', 'M116 120 Q140 110 136 86'),
    shape('shape', 'M88 84 C82 100 82 116 78 132 L68 152 L80 154 L92 136 L104 136 L114 152 L124 148 L114 128 C120 110 118 96 112 84 Z'),
    shape('line', 'M88 100 Q78 112 84 122'),
    ...HEAD,
    shape('shape', circle(88, 60, 8)),
    shape('dot', circle(89, 56, 4.4)),
    shape('shape', circle(112, 60, 8)),
    shape('dot', circle(113, 56, 4.4)),
  ],

  // THUMBS UP: fluffy cat with one giant hand
  thumbs: {
    arm: [
      shape('line', 'M86 102 L116 128 M80 116 L114 142'),
      shape('shape', 'M88 96 Q94 118 70 120 L48 120 Q34 118 34 104 L34 78 Q34 66 46 66 L64 66 L68 40 Q70 30 78 31 Q86 33 84 46 L80 68 Q92 74 88 96 Z'),
      shape('line', 'M34 80 L60 80 M34 92 L62 92 M34 104 L60 104 M64 66 Q72 72 80 68'),
    ],
    fluff: shape('line', 'M101 120 L94 117 M101 130 L93 131 M165 120 L172 117 M165 130 L173 131'),
    body: shape('shape', 'M110 120 L106 96 L124 108 Q134 105 144 108 L160 96 L156 120 Q162 140 154 158 L152 172 L144 172 L142 160 Q134 162 126 160 L124 172 L116 172 L114 158 Q106 140 110 120 Z'),
    eyes: shape('dot', `${circle(126, 126, 2.8)} ${circle(142, 126, 2.8)}`),
    mouth: shape('line', 'M126 134 q4 5 8 0 q4 5 8 0'),
  },

  // THE SKATEBOARD
  board: {
    deck: shape('shape', 'M41.5 157 L158.5 157 Q162 157 162 160.5 Q162 164 158.5 164 L41.5 164 Q38 164 38 160.5 Q38 157 41.5 157 Z'),
    trucks: shape('line', 'M66 164 L66 170 M134 164 L134 170'),
    wheel1: shape('wheel', circle(66, 176, 6)),
    spoke1: shape('spoke', 'M66 172 L66 180'),
    wheel2: shape('wheel', circle(134, 176, 6)),
    spoke2: shape('spoke', 'M134 172 L134 180'),
  },

  // The paw that holds the board in the GRAB pose (drawn over the board)
  paw: shape('shape', 'M104 108 Q116 100 128 106 Q132 112 126 118 Q114 118 104 108 Z M118 103 L120 112 M124 105 L126 113'),

  // Landing marks, and the "poof" when the board appears/disappears
  impact: shape('line', 'M18 156 L30 160 M16 168 L30 168 M20 180 L31 175 M182 156 L170 160 M184 168 L170 168 M180 180 L169 175'),
  puff: shape('line', 'M100 150 L100 138 M86 154 L78 146 M114 154 L122 146 M82 168 L70 168 M118 168 L130 168 M86 182 L78 190 M114 182 L122 190'),
};

// The ground line (in pixels, not drawing units). The gap makes it look hand-drawn.
const GROUND_LINE_Y = GROUND_Y + 6;
const GROUND = {
  kind: 'line',
  pieces: flattenPath(`M60 ${GROUND_LINE_Y} L600 ${GROUND_LINE_Y} M660 ${GROUND_LINE_Y} L1020 ${GROUND_LINE_Y}`, 12),
  path: null,
};

// -----------------------------------------------------------------
// 6. BOILING LINES
// Every BOIL_MS we rebuild all the cat's paths with a NEW wobble.
// That flicker between slightly different drawings is the "boil" you
// see in hand-drawn cartoons. With boil off, the lines stay still.
// -----------------------------------------------------------------
let boiledFrame = null; // which boil frame the paths were last built for

function boilCat(boilFrame) {
  if (boilFrame === boiledFrame) return; // already built for this frame
  boiledFrame = boilFrame;
  const amount = settings.boil ? WOBBLE : 0;
  for (const item of ALL_CAT_SHAPES) item.path = buildPath(item.pieces, boilFrame, amount, 0.04);
  GROUND.path = buildPath(GROUND.pieces, boilFrame, amount * CAT_SCALE, 0.04 / CAT_SCALE);
}

// -----------------------------------------------------------------
// 7. THE CAT'S MOVES
// "s" holds everything the cat is doing right now. Every frame we start
// fresh, let the scene set the numbers for this moment, then draw him.
// -----------------------------------------------------------------
let s = freshCat();

function freshCat() {
  return {
    x: SAFE_MIDDLE_X, y: GROUND_Y, // the point under his wheels, in pixels
    flip: -1,          // 1 = drawing as-is (facing left), -1 = mirrored (facing right)
    tilt: 0,           // lean, in degrees
    pose: 'ride',      // 'ride', 'air', 'grab' or 'thumbs'
    catY: 0,           // hop height (negative = up), in drawing units
    sqX: 1, sqY: 1,    // squash and stretch
    board: { x: 0, y: 0, rot: 0, flipY: 1, scale: 1 },
    rolling: 0,        // 0 = standing still, 1 = riding (speed lines, spinning wheels)
    arm: 0,            // size of the giant thumbs-up hand (0 = hidden)
    thumbBounce: 0,
    impact: 0,         // landing marks (0 = hidden, 1 = fully visible)
    puff: 0, puffX: 100, puffY: 168, // the "poof"
  };
}

// Squash like a rubber ball; q goes from 0 to 1 during the squash
function squashAt(q, amount) {
  const k = Math.sin(Math.PI * q) * amount;
  s.sqY = 1 - k;
  s.sqX = 1 + k * 0.6;
}

// A quick hop lasting 520 ms: up, down, squash. True once past the top,
// which is where the pose changes (nobody notices it there).
function hopAt(ms, height) {
  s.catY = -height * (easeOut(phase(ms, 0, 160)) - easeIn(phase(ms, 160, 160)));
  squashAt(phase(ms, 320, 200), 0.18);
  return ms >= 160;
}

// The "poof" lines: visible for 380 ms after "start"
function puffAt(x, y, ms, start) {
  s.puffX = x;
  s.puffY = y;
  s.puff = ms > start && ms < start + 380 ? 1 - phase(ms, start, 380) : 0;
}

// A STORY is a list of short pieces. Each piece has a length (ms) and an
// apply(p) function that places the cat for progress p (0 = start of the
// piece, 1 = end). playPieces() finishes every piece before "ms" and
// plays the one we're in. Because every moment depends only on the time,
// the preview and the recording always match.
function playPieces(pieces, ms) {
  let start = 0;
  for (const piece of pieces) {
    if (ms < start) break;
    piece.apply(clamp((ms - start) / piece.ms, 0, 1));
    start += piece.ms;
  }
}
const totalMs = (pieces) => pieces.reduce((sum, piece) => sum + piece.ms, 0);

// KICKFLIP: crouch, jump while the board spins and flips, land
const KICKFLIP = [
  { ms: 120, apply(p) { squashAt(p, 0.2); } }, // crouch
  { ms: 750, apply(p) { // up, spin + flip the board, down
    s.pose = 'air';
    const up = 4 * p * (1 - p); // 0 -> 1 -> 0, like a thrown ball
    s.catY = -JUMP_HEIGHT * up;
    s.board.y = -JUMP_HEIGHT * 0.5 * up;
    s.board.rot = 360 * easeInOut(p);          // spin around
    s.board.flipY = Math.cos(2 * Math.PI * p); // and flip over (kickflip)
    s.sqY = 1 + 0.08 * Math.sin(Math.PI * p);  // stretch in the air
    s.sqX = 1 / s.sqY;
  } },
  { ms: 320, apply(p) { // land: squash and landing marks
    s.pose = 'ride';
    s.catY = 0;
    Object.assign(s.board, { y: 0, rot: 0, flipY: 1 });
    s.impact = p < 1 ? 1 - easeIn(p) : 0;
    squashAt(phase(p, 0, 0.7), 0.24);
  } },
];
const KICKFLIP_TOP = 120 + 750 / 2; // ms from the start of a kickflip to its highest point

// -----------------------------------------------------------------
// 8. THE SCENES
// Each scene has a length (ms), a hookStartMs (with the hook on, the clip
// starts this far in, so the cat is already zooming into the frame), and
// an update(ms) that sets up the cat for that moment.
// -----------------------------------------------------------------
const OFF_SCREEN = 1100; // from the middle to just past either edge (he's ~900 px wide)
const LEFT_OUT = SAFE_MIDDLE_X - OFF_SCREEN;
const RIGHT_OUT = SAFE_MIDDLE_X + OFF_SCREEN;

// "Skate by": fast at the edges, slow in the middle so the kickflip is easy to see
const SKATE_MS = 3000;
const fastSlowFast = (p) => p + (0.6 * Math.sin(2 * Math.PI * p)) / (2 * Math.PI);

// "Thumbs up": a story told in pieces (based on scroll 1 and 2 of cat.js)
const BRAKE_DISTANCE = 245; // pixels he rolls while braking
const THUMBS_UP_STORY = [
  { ms: 800, apply(p) { // zoom in from the left
    s.flip = -1; // face right
    s.rolling = 1;
    s.x = lerp(LEFT_OUT, SAFE_MIDDLE_X - BRAKE_DISTANCE, p);
  } },
  { ms: 450, apply(p) { // brake and lean back
    s.x = lerp(SAFE_MIDDLE_X - BRAKE_DISTANCE, SAFE_MIDDLE_X, easeOut(p));
    s.rolling = 1 - p;
    s.tilt = Math.sin(Math.PI * p) * 8 * s.flip;
  } },
  { ms: 680, apply(p) { // hop off; the board flips up and vanishes in a poof
    const ms = p * 680;
    const pastTop = hopAt(ms, 34);
    s.pose = pastTop ? 'thumbs' : 'ride';
    s.flip = pastTop ? 1 : -1; // turns around at the top of the hop
    s.tilt = 0;
    s.rolling = 0;
    const q = easeIn(phase(ms, 0, 300));
    Object.assign(s.board, { x: 0, y: -40 * q, rot: -90 * q, flipY: 1, scale: 1 - q });
    puffAt(100, 128, ms, 300);
  } },
  { ms: 500, apply(p) { s.arm = easeOutBack(p); } },  // the giant hand pops out
  { ms: 900, apply(p) { // hold it, with a proud little bounce
    s.thumbBounce = Math.sin(Math.PI * phase(p, 0.1, 0.45));
  } },
  { ms: 250, apply(p) { s.arm = 1 - easeIn(p); } },   // hand goes away
  { ms: 380, apply(p) { // the board comes back with a poof
    const ms = p * 380;
    Object.assign(s.board, { x: 0, y: 0, rot: 0, flipY: 1, scale: easeOutBack(phase(ms, 0, 250)) });
    puffAt(100, 168, ms, 0);
  } },
  { ms: 520, apply(p) { // hop back on, turning to face right
    const pastTop = hopAt(p * 520, 26);
    s.pose = pastTop ? 'ride' : 'thumbs';
    s.flip = pastTop ? -1 : 1;
  } },
  { ms: 1000, apply(p) { // zoom off to the right
    s.x = lerp(SAFE_MIDDLE_X, RIGHT_OUT, easeIn(p));
    s.rolling = clamp(p * 4, 0, 1);
  } },
];

const SCENES = {
  // 1. Skate by: rides across the frame, kickflip in the middle
  skate: {
    ms: SKATE_MS,
    hookStartMs: 250,
    update(ms) {
      s.flip = -1; // face right
      s.rolling = 1;
      s.x = lerp(LEFT_OUT, RIGHT_OUT, fastSlowFast(ms / SKATE_MS));
      // start the kickflip so he's highest exactly in the middle
      playPieces(KICKFLIP, ms - (SKATE_MS / 2 - KICKFLIP_TOP));
    },
  },

  // 2. Thumbs up: rides in, hops off, board poofs away, giant thumbs up, rides off
  thumbs: {
    ms: totalMs(THUMBS_UP_STORY),
    hookStartMs: 250,
    update(ms) {
      playPieces(THUMBS_UP_STORY, ms);
    },
  },

  // 3. Kickflip loop: rolls in place and kickflips again and again
  kickflip: {
    ms: totalMs(KICKFLIP) + 450, // the jump + a little riding
    hookStartMs: 0,              // he jumps right away anyway
    update(ms) {
      s.flip = -1;
      s.rolling = 1;
      playPieces(KICKFLIP, ms);
    },
  },

  // 4. No cat
  none: null,
};

// Which moment of the scene to show at clip time t (seconds).
// Seamless on: the scene is sped up / slowed down a little so it fits
// into the clip a whole number of times (so the loop is invisible).
// Seamless off: it plays at normal speed and simply starts over.
function sceneTimeMs(scene, t) {
  const start = settings.hook ? scene.hookStartMs : 0;
  if (!settings.seamless) return (t * 1000 + start) % scene.ms;
  const loopLength = loopPeriod(scene.ms / 1000);
  return ((mod(t, loopLength) / loopLength) * scene.ms + start) % scene.ms;
}

// -----------------------------------------------------------------
// 9. DRAWING THE CAT
// -----------------------------------------------------------------
let wheelAngle = 0; // how far the wheels have turned (degrees)

// Draw one shape (or a list of shapes) in its colors
function paint(what) {
  if (Array.isArray(what)) {
    what.forEach((item) => paint(item));
    return;
  }
  if (what.kind === 'dot') {
    ctx.fillStyle = settings.lineColor;
    ctx.fill(what.path);
    return;
  }
  if (what.kind === 'shape' || what.kind === 'wheel') {
    ctx.fillStyle = settings.background;
    ctx.fill(what.path);
  }
  ctx.strokeStyle = what.kind === 'wheel' || what.kind === 'spoke' ? settings.accentColor : settings.lineColor;
  ctx.stroke(what.path);
}

// Draw something turned by "degrees" around the point (cx, cy)
function turned(cx, cy, degrees, draw) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(toRadians(degrees));
  ctx.translate(-cx, -cy);
  draw();
  ctx.restore();
}

// Draw eyes that blink every few seconds (squashed flat for a moment).
// The blink happens halfway through each repeat, so the first frame has open eyes.
function blinking(eyeY, time, draw) {
  const repeat = loopPeriod(3.4);
  const sinceHalfway = mod(time, repeat) - repeat / 2;
  const open = sinceHalfway >= 0 && sinceHalfway < 0.12 ? 0.1 : 1;
  ctx.save();
  ctx.translate(0, eyeY);
  ctx.scale(1, open);
  ctx.translate(0, -eyeY);
  draw();
  ctx.restore();
}

// Hop, squash and a little bounce while riding (or breathing)
function moveBody(time) {
  const bob = s.rolling > 0.01 ? wave(time, 0.45) * 1.2 * s.rolling : wave(time, 2.6) * 0.6;
  ctx.translate(0, s.catY + bob);
  ctx.translate(100, 162);
  ctx.scale(s.sqX, s.sqY);
  ctx.translate(-100, -162);
}

function drawPose(time) {
  if (s.pose === 'ride') {
    const r = CAT.ride;
    turned(110, 128, wave(time, 1.57) * 7, () => paint(r.tail));
    turned(110, 130, wave(time, 0.9) * 12 * s.rolling, () => paint(r.leg)); // pushing leg
    paint(r.body);
    turned(112, 96, wave(time, 1.26) * 6, () => paint(r.arm));
    paint(HEAD);
    blinking(62, time, () => paint(r.eyes));
    paint(r.mouth);
  } else if (s.pose === 'air') {
    paint(CAT.air);
  } else if (s.pose === 'grab') {
    paint(CAT.grab);
  } else if (s.pose === 'thumbs') {
    const th = CAT.thumbs;
    ctx.save();
    ctx.translate(-20, 10);
    if (s.arm > 0.01) { // the giant hand grows out and wiggles
      ctx.save();
      ctx.translate(114, 136);
      ctx.rotate(toRadians(wave(time, 2.1) * 3 - s.thumbBounce * 12));
      ctx.scale(s.arm, s.arm);
      ctx.translate(-114, -136);
      paint(th.arm);
      ctx.restore();
    }
    paint(th.fluff);
    paint(th.body);
    blinking(126, time, () => paint(th.eyes));
    paint(th.mouth);
    ctx.restore();
  }
}

function drawBoard() {
  const b = s.board;
  if (b.scale < 0.01) return; // vanished
  const parts = CAT.board;
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.translate(100, 168);
  ctx.rotate(toRadians(b.rot));
  ctx.scale(b.scale, b.scale * b.flipY);
  ctx.translate(-100, -168);
  paint(parts.deck);
  paint(parts.trucks);
  paint(parts.wheel1);
  turned(66, 176, wheelAngle, () => paint(parts.spoke1));
  paint(parts.wheel2);
  turned(134, 176, wheelAngle, () => paint(parts.spoke2));
  ctx.restore();
}

function drawCat(time) {
  ctx.save();
  // Put the point under his wheels at (s.x, s.y), make him big, lean and mirror him
  ctx.translate(s.x, s.y);
  ctx.scale(CAT_SCALE, CAT_SCALE);
  ctx.rotate(toRadians(s.tilt));
  ctx.scale(s.flip, 1);
  ctx.translate(-100, -183);
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Speed lines (dashes sliding away behind him) and shake marks by his feet
  if (s.rolling > 0.01) {
    ctx.globalAlpha = s.rolling;
    ctx.setLineDash([22, 16]);
    ctx.lineDashOffset = (-38 * time) / loopPeriod(38 / 140); // 140 units per second
    paint(CAT.speed);
    ctx.setLineDash([]);
    ctx.globalAlpha = s.rolling * (Math.floor(time * 10) % 2 ? 1 : 0.25); // flicker
    paint(CAT.shakes);
    ctx.globalAlpha = 1;
  }

  // His body
  ctx.save();
  moveBody(time);
  drawPose(time);
  ctx.restore();

  // The board (drawn over his feet)
  drawBoard();

  // The paw that holds the board (GRAB pose only)
  if (s.pose === 'grab') {
    ctx.save();
    moveBody(time);
    paint(CAT.paw);
    ctx.restore();
  }

  // Landing marks
  if (s.impact > 0.01) {
    ctx.globalAlpha = s.impact;
    paint(CAT.impact);
    ctx.globalAlpha = 1;
  }

  // The poof
  if (s.puff > 0.01) {
    ctx.save();
    ctx.globalAlpha = s.puff;
    ctx.translate(s.puffX, s.puffY);
    const grow = 1.5 - s.puff * 0.5;
    ctx.scale(grow, grow);
    ctx.translate(-100, -168);
    paint(CAT.puff);
    ctx.restore();
  }

  ctx.restore();
}

function drawGround() {
  ctx.save();
  ctx.lineWidth = LINE_WIDTH * CAT_SCALE;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = settings.lineColor;
  ctx.stroke(GROUND.path);
  ctx.restore();
}

// -----------------------------------------------------------------
// 10. THE HOOK: a whoosh of speed streaks + a quick zoom-out at the start
// (and, with seamless on, the same again at the end, so the end matches
// the start and the loop can't be seen)
// -----------------------------------------------------------------

// How strong the hook is at clip time t: 1 at the start, 0 after HOOK_SECONDS
function hookAmount(t) {
  if (!settings.hook) return 0;
  let amount = 1 - clamp(t / HOOK_SECONDS, 0, 1);
  if (settings.seamless) {
    const fromEnd = clamp((t - (settings.clipLength - HOOK_SECONDS)) / HOOK_SECONDS, 0, 1);
    amount = Math.max(amount, fromEnd);
  }
  return amount;
}

// Long streaks flying across the screen: [height in px, start spot 0..1, length in px]
const STREAKS = [
  [380, 0.0, 420], [540, 0.38, 300], [700, 0.72, 520], [880, 0.15, 360],
  [1040, 0.55, 460], [1260, 0.86, 300], [1400, 0.3, 420],
];

function drawWhoosh(t, amount, boilFrame) {
  if (amount <= 0.01) return;
  const span = VIDEO_WIDTH + 600; // a streak leaves on the left and comes back on the right
  // 3200 px per second, nudged so streaks are back where they started at the end of the clip
  const speed = span / loopPeriod(span / 3200);
  ctx.save();
  ctx.strokeStyle = settings.lineColor;
  ctx.lineCap = 'round';
  ctx.lineWidth = LINE_WIDTH * CAT_SCALE * 0.8;
  ctx.globalAlpha = amount;
  STREAKS.forEach(([y, startSpot, length], i) => {
    const x = mod(startSpot * span - speed * t, span) - 300;
    const jiggle = settings.boil ? (random3(boilFrame, i, 21) - 0.5) * 8 : 0;
    ctx.beginPath();
    ctx.moveTo(x, y + jiggle);
    ctx.lineTo(x + length * (0.4 + 0.6 * amount), y - jiggle);
    ctx.stroke();
  });
  ctx.restore();
}

// -----------------------------------------------------------------
// 11. YOUR DOODLES: turning a photo of a drawing into white lines
// Steps: shrink -> measure how light each pixel is -> work out how light
// the PAPER is around it -> anything darker than the paper is ink ->
// crop -> make 3 wobbly copies for the boil.
// -----------------------------------------------------------------
const doodles = []; // every uploaded drawing
let nextDoodleId = 1;

function showDoodleStatus(text) {
  ui.doodleStatus.textContent = text;
}

// Wait until the browser has shown our latest message on screen
const waitForPaint = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

function loadPicture(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const picture = new Image();
    picture.onload = () => { URL.revokeObjectURL(url); resolve(picture); };
    picture.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Could not open ${file.name}`)); };
    picture.src = url;
  });
}

async function addDoodleFiles(files) {
  for (const file of files) {
    showDoodleStatus(`Turning "${file.name}" into lines...`);
    await waitForPaint();
    try {
      const picture = await loadPicture(file);
      const doodle = makeDoodle(picture, file.name);
      doodles.push(doodle);
      addDoodleCard(doodle);
      showDoodleStatus(doodle.foundLines
        ? 'Done! Pick an animation and move it around below.'
        : `Couldn't find lines in "${file.name}". Try lowering "Paper clean-up", or a sharper photo.`);
    } catch (error) {
      console.error(error);
      showDoodleStatus(`Sorry, "${file.name}" didn't open. Use a PNG or JPG picture.`);
    }
  }
}

function makeDoodle(picture, fileName) {
  // Shrink big photos (phone photos can be 4000 px wide)
  const shrink = Math.min(1, DOODLE_MAX_PIXELS / Math.max(picture.naturalWidth, picture.naturalHeight));
  const w = Math.max(1, Math.round(picture.naturalWidth * shrink));
  const h = Math.max(1, Math.round(picture.naturalHeight * shrink));
  const work = document.createElement('canvas');
  work.width = w;
  work.height = h;
  const workCtx = work.getContext('2d', { willReadFrequently: true });
  workCtx.drawImage(picture, 0, 0, w, h);

  const spot = DOODLE_SPOTS[doodles.length % DOODLE_SPOTS.length];
  const doodle = {
    id: nextDoodleId++,
    name: fileName,
    source: workCtx.getImageData(0, 0, w, h), // the shrunk picture (kept for re-processing)
    animation: DOODLE_START.animation,
    size: DOODLE_START.size,  // width, as a % of the video width
    x: spot[0],               // middle of the doodle, as a % of the video width
    y: spot[1],               // ... and of the video height
    cleanup: DOODLE_START.cleanup,
    frames: [],               // white lines on see-through: [still, wobble 1, wobble 2, wobble 3]
    tinted: [],               // the same, in the current line color
    tintColor: null,
    foundLines: false,
  };
  processDoodle(doodle);
  return doodle;
}

function processDoodle(doodle) {
  const { width: w, height: h, data } = doodle.source;
  const count = w * h;

  // a) How light is every pixel? 0 = black ink, 255 = white paper.
  const light = new Float32Array(count);
  let total = 0;
  for (let i = 0; i < count; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const opacity = data[i * 4 + 3] / 255;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;       // how bright it looks to our eyes
    light[i] = brightness * opacity + 255 * (1 - opacity);      // see-through PNG parts count as paper
    total += light[i];
  }
  // A mostly dark picture is probably light lines on dark paper: flip it
  if (total / count < 110) {
    for (let i = 0; i < count; i++) light[i] = 255 - light[i];
  }

  // b) How light is the PAPER around every pixel? (Photos are often darker in a corner.)
  const paper = paperLightness(light, w, h);

  // c) Ink = clearly darker than the paper around it. This is the "invert +
  //    use brightness as see-through-ness" step: paper -> invisible, ink -> solid.
  const paperLimit = 1 - doodle.cleanup / 100; // lighter than this (compared with the paper) = paper
  const inkLimit = paperLimit - 0.35;          // darker than this = solid ink
  const ink = new Uint8ClampedArray(count);    // 0 = no ink ... 255 = full ink
  for (let i = 0; i < count; i++) {
    const compared = light[i] / Math.max(paper[i], 1);
    ink[i] = 255 * clamp((paperLimit - compared) / (paperLimit - inkLimit), 0, 1);
  }

  // d) Crop to the drawing, with a margin so the wobble has room
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (ink[y * w + x] > 64) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  doodle.foundLines = maxX >= 0;
  if (!doodle.foundLines) { minX = 0; minY = 0; maxX = w - 1; maxY = h - 1; }

  const wobble = Math.max(1, DOODLE_WOBBLE * Math.max(w, h));
  const margin = Math.ceil(wobble) + 4;
  const cw = maxX - minX + 1 + margin * 2;
  const ch = maxY - minY + 1 + margin * 2;
  const cropped = new Uint8ClampedArray(cw * ch);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const fromX = x + minX - margin;
      const fromY = y + minY - margin;
      if (fromX >= 0 && fromY >= 0 && fromX < w && fromY < h) cropped[y * cw + x] = ink[fromY * w + fromX];
    }
  }

  // e) Frame 0 = still; frames 1-3 = slightly wobbled copies (the boil)
  doodle.frames = [0, 1, 2, 3].map((seed) => makeDoodleFrame(cropped, cw, ch, seed, seed === 0 ? 0 : wobble));
  doodle.tintColor = null; // color them in again on the next draw
}

// Paper lightness around every pixel: split the picture into squares, take
// the lightest pixel of each square (and its neighbours), then blend
// smoothly between squares.
function paperLightness(light, w, h) {
  const CELL = 40; // square size in pixels
  const cols = Math.ceil(w / CELL);
  const rows = Math.ceil(h / CELL);

  const lightest = new Float32Array(cols * rows);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cell = Math.floor(y / CELL) * cols + Math.floor(x / CELL);
      if (light[y * w + x] > lightest[cell]) lightest[cell] = light[y * w + x];
    }
  }

  // Look at the neighbours too, so a square full of thick ink still finds paper
  const squares = new Float32Array(cols * rows);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let best = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const r = row + dy;
          const c = col + dx;
          if (r >= 0 && c >= 0 && r < rows && c < cols) best = Math.max(best, lightest[r * cols + c]);
        }
      }
      squares[row * cols + col] = best;
    }
  }

  // Every pixel blends the 4 nearest squares (no hard edges)
  const paper = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const gy = clamp(y / CELL - 0.5, 0, rows - 1);
    const r0 = Math.floor(gy);
    const r1 = Math.min(r0 + 1, rows - 1);
    const fy = gy - r0;
    for (let x = 0; x < w; x++) {
      const gx = clamp(x / CELL - 0.5, 0, cols - 1);
      const c0 = Math.floor(gx);
      const c1 = Math.min(c0 + 1, cols - 1);
      const fx = gx - c0;
      const upper = lerp(squares[r0 * cols + c0], squares[r0 * cols + c1], fx);
      const lower = lerp(squares[r1 * cols + c0], squares[r1 * cols + c1], fx);
      paper[y * w + x] = lerp(upper, lower, fy);
    }
  }
  return paper;
}

// Make one frame: white pixels whose see-through-ness comes from the ink.
// With wobble > 0, every pixel reads its ink from a spot nudged by smooth
// noise, so the lines bend a little (like the SVG displacement filter).
function makeDoodleFrame(ink, w, h, seed, wobble) {
  const frame = document.createElement('canvas');
  frame.width = w;
  frame.height = h;
  const frameCtx = frame.getContext('2d');
  const image = frameCtx.createImageData(w, h);
  const inkAt = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : ink[y * w + x]);
  const bumpSize = 1 / 40; // the wobbly bumps are about 40 pixels wide

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let fromX = x;
      let fromY = y;
      if (wobble > 0) {
        fromX += (smoothNoise(x * bumpSize, y * bumpSize, seed * 2) - 0.5) * 2 * wobble;
        fromY += (smoothNoise(x * bumpSize, y * bumpSize, seed * 2 + 1) - 0.5) * 2 * wobble;
      }
      // blend the 4 nearest pixels (smoother than picking just one)
      const x0 = Math.floor(fromX);
      const y0 = Math.floor(fromY);
      const fx = fromX - x0;
      const fy = fromY - y0;
      const amount = lerp(
        lerp(inkAt(x0, y0), inkAt(x0 + 1, y0), fx),
        lerp(inkAt(x0, y0 + 1), inkAt(x0 + 1, y0 + 1), fx),
        fy,
      );
      const i = (y * w + x) * 4;
      image.data[i] = 255;
      image.data[i + 1] = 255;
      image.data[i + 2] = 255;
      image.data[i + 3] = amount;
    }
  }
  frameCtx.putImageData(image, 0, 0);
  return frame;
}

// Color the white frames in the current line color
function tintDoodle(doodle) {
  doodle.tinted = doodle.frames.map((frame) => {
    const colored = document.createElement('canvas');
    colored.width = frame.width;
    colored.height = frame.height;
    const c = colored.getContext('2d');
    c.drawImage(frame, 0, 0);
    c.globalCompositeOperation = 'source-in'; // paint only where the lines are
    c.fillStyle = settings.lineColor;
    c.fillRect(0, 0, colored.width, colored.height);
    return colored;
  });
  doodle.tintColor = settings.lineColor;
}

// The little preview picture in the doodle's card
function drawThumb(thumb, doodle) {
  const c = thumb.getContext('2d');
  c.fillStyle = '#000';
  c.fillRect(0, 0, thumb.width, thumb.height);
  const frame = doodle.frames[0];
  const k = Math.min(thumb.width / frame.width, thumb.height / frame.height) * 0.9;
  const w = frame.width * k;
  const h = frame.height * k;
  c.drawImage(frame, (thumb.width - w) / 2, (thumb.height - h) / 2, w, h);
}

// -----------------------------------------------------------------
// 12. DOODLE ANIMATIONS
// Each animation says how far to move, turn and squash the doodle at
// time t. pivot = where it turns/squashes from: 0 = middle, 0.5 = bottom edge.
// -----------------------------------------------------------------
function doodleMotion(animation, t, h) {
  const m = { y: 0, angle: 0, sx: 1, sy: 1, pivot: 0 };
  const L = settings.clipLength;

  if (animation === 'bounce') { // hop, hop, hop, squashing on the ground
    const P = loopPeriod(0.8);
    const u = mod(t, P) / P;                                   // 0..1 during one hop
    m.y = -4 * u * (1 - u) * h * 0.35;                         // up and down like a ball
    const ground = Math.max(0, 1 - Math.min(u, 1 - u) / 0.15); // 1 = touching the ground
    m.sy = 1 - 0.2 * ground;
    m.sx = 1 + 0.12 * ground;
    m.pivot = 0.5;
  } else if (animation === 'wiggle') { // jelly wobble from the bottom
    m.angle = wave(t, 0.6) * 9;
    m.sx = 1 + wave(t, 0.3) * 0.03;
    m.sy = 1 - wave(t, 0.3) * 0.03;
    m.pivot = 0.5;
  } else if (animation === 'float') { // drift up and down, gently rocking
    m.y = wave(t, 2.4) * h * 0.07;
    m.angle = wave(t, 2.4, 1.3) * 4;
  } else if (animation === 'spin') { // spin in from nothing, then float
    const p = clamp(t / 0.9, 0, 1);
    let grow = easeOutBack(p);
    m.angle = -540 * (1 - easeOut(p));
    if (settings.seamless) { // ...and spin out at the end, so the loop matches
      const q = clamp((t - (L - 0.6)) / 0.6, 0, 1);
      grow *= 1 - easeIn(q);
      m.angle += 360 * easeIn(q);
    }
    m.sx = grow;
    m.sy = grow;
    m.y = wave(t, 2.4) * h * 0.04 * clamp((t - 0.9) / 0.6, 0, 1);
  } else if (animation === 'slide') { // little hops while sliding across (the x is set in drawDoodle)
    m.y = -Math.abs(wave(t, 1.0)) * h * 0.06;
    m.angle = wave(t, 1.0) * 3;
    m.pivot = 0.5;
  }
  return m;
}

function drawDoodle(doodle, t, boilFrame) {
  if (!doodle.frames.length) return;
  if (doodle.tintColor !== settings.lineColor) tintDoodle(doodle);
  const frame = doodle.tinted[settings.boil ? 1 + (boilFrame % 3) : 0];

  const w = (VIDEO_WIDTH * doodle.size) / 100;
  const h = (w * frame.height) / frame.width;
  let x = (VIDEO_WIDTH * doodle.x) / 100;
  const y = (VIDEO_HEIGHT * doodle.y) / 100;
  if (doodle.animation === 'slide') { // from off the left edge to off the right edge, once per clip
    x = lerp(-w / 2 - 60, VIDEO_WIDTH + w / 2 + 60, t / settings.clipLength);
  }

  const m = doodleMotion(doodle.animation, t, h);
  if (m.sx < 0.01 || m.sy < 0.01) return; // too small to see

  // The boil: a tiny random nudge, turn and resize, new every boil frame
  let jx = 0, jy = 0, jAngle = 0, jScale = 1;
  if (settings.boil) {
    jx = (random3(boilFrame, doodle.id, 1) - 0.5) * 6;
    jy = (random3(boilFrame, doodle.id, 2) - 0.5) * 6;
    jAngle = (random3(boilFrame, doodle.id, 3) - 0.5) * 1.6;
    jScale = 1 + (random3(boilFrame, doodle.id, 4) - 0.5) * 0.02;
  }

  ctx.save();
  ctx.translate(x + jx, y + m.y + jy);
  ctx.translate(0, m.pivot * h); // turn and squash around the pivot
  ctx.rotate(toRadians(m.angle + jAngle));
  ctx.scale(m.sx * jScale, m.sy * jScale);
  ctx.translate(0, -m.pivot * h);
  ctx.drawImage(frame, -w / 2, -h / 2, w, h);
  ctx.restore();
}

// -----------------------------------------------------------------
// 13. THE CAPTION
// Words pop in one after another. With seamless on they're there from
// the very first frame instead, and just do a little bounce at the loop.
// It stays inside the safe zone so the app's buttons don't cover it.
// -----------------------------------------------------------------

// Split the text into lines that fit maxWidth. Each line = a list of words.
function wrapWords(text, maxWidth) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    let line = [];
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      if (line.length && ctx.measureText([...line, word].join(' ')).width > maxWidth) {
        lines.push(line);
        line = [word];
      } else {
        line.push(word);
      }
    }
    if (line.length) lines.push(line);
  }
  return lines;
}

function drawCaption(t, boilFrame) {
  const text = settings.captionText.trim();
  if (!text) return;

  const size = settings.captionSize;
  ctx.save();
  ctx.font = `${size}px "${settings.captionFont}", cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';

  const maxWidth = VIDEO_WIDTH - SAFE_ZONE.right - CAPTION_MARGIN * 3;
  const lines = wrapWords(text, maxWidth);
  const lineHeight = size * 1.2;
  const blockHeight = lines.length * lineHeight;
  const blockTop = settings.captionPosition === 'top'
    ? SAFE_ZONE.top + CAPTION_MARGIN
    : VIDEO_HEIGHT - SAFE_ZONE.bottom - CAPTION_MARGIN - blockHeight;
  const space = ctx.measureText(' ').width;

  let wordNumber = 0;
  lines.forEach((words, row) => {
    const y = blockTop + lineHeight * (row + 0.5);
    const widths = words.map((word) => ctx.measureText(word).width);
    const lineWidth = widths.reduce((sum, width) => sum + width, 0) + space * (words.length - 1);
    let x = SAFE_MIDDLE_X - lineWidth / 2;

    words.forEach((word, k) => {
      const delay = 0.15 + wordNumber * 0.08; // each word a little later than the last
      let grow;
      if (settings.seamless) {
        const since = mod(t - delay, settings.clipLength);
        grow = 1 + 0.15 * (since < 0.4 ? Math.sin((Math.PI * since) / 0.4) : 0);
      } else {
        grow = easeOutBack(clamp((t - delay) / 0.4, 0, 1)); // pop in
      }

      if (grow > 0.01) {
        let jx = 0, jy = 0, angle = 0;
        if (settings.boil) {
          jx = (random3(boilFrame, wordNumber, 11) - 0.5) * 4;
          jy = (random3(boilFrame, wordNumber, 12) - 0.5) * 4;
          angle = (random3(boilFrame, wordNumber, 13) - 0.5) * 3;
        }
        ctx.save();
        ctx.translate(x + widths[k] / 2 + jx, y + jy);
        ctx.rotate(toRadians(angle));
        ctx.scale(grow, grow);
        ctx.lineWidth = size * 0.16;           // an outline in the background color,
        ctx.strokeStyle = settings.background; // so the words stay readable over drawings
        ctx.strokeText(word, 0, 0);
        ctx.fillStyle = settings.lineColor;
        ctx.fillText(word, 0, 0);
        ctx.restore();
      }
      x += widths[k] + space;
      wordNumber++;
    });
  });
  ctx.restore();
}

// -----------------------------------------------------------------
// 14. DRAWING ONE FRAME (t = seconds into the clip)
// -----------------------------------------------------------------
function drawFrame(t) {
  // Which boil frame are we on? (-1 = boil off, always the same lines)
  const boilFrame = settings.boil ? Math.floor((t * 1000) / BOIL_MS) : -1;
  boilCat(boilFrame);

  // Background
  ctx.fillStyle = settings.background;
  ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

  // The hook's speed streaks (behind everything)
  const hook = hookAmount(t);
  drawWhoosh(t, hook, boilFrame);

  // Work out what the cat is doing right now
  const scene = SCENES[settings.scene];
  if (scene) {
    s = freshCat();
    scene.update(sceneTimeMs(scene, t));
  }

  // The hook's zoom: starts zoomed in on the cat, quickly zooms out
  ctx.save();
  if (hook > 0) {
    const zoom = 1 + (HOOK_ZOOM - 1) * hook * hook;
    const zx = scene ? clamp(s.x, 0, VIDEO_WIDTH) : VIDEO_WIDTH / 2;
    const zy = scene ? GROUND_Y - 250 : VIDEO_HEIGHT / 2;
    ctx.translate(zx, zy);
    ctx.scale(zoom, zoom);
    ctx.translate(-zx, -zy);
  }

  for (const doodle of doodles) drawDoodle(doodle, t, boilFrame); // doodles go behind the cat
  if (scene) {
    if (SHOW_GROUND) drawGround();
    drawCat(t);
  }
  ctx.restore();

  // The caption goes on top of everything (and doesn't zoom)
  drawCaption(t, boilFrame);
}

// -----------------------------------------------------------------
// 15. PLAYING: the animation loop
// -----------------------------------------------------------------
let playhead = 0;    // where we are in the clip, in seconds
let playing = true;  // false = paused
let lastTick = performance.now();

function tick(now) {
  const dt = Math.min(0.1, (now - lastTick) / 1000); // seconds since the last frame
  lastTick = now;

  if (recording) {
    // While recording, the clock is the real time since the recorder started,
    // so the video is exactly one clip long.
    if (recording.startedAt === null) {
      playhead = 0; // waiting for the recorder to start
    } else {
      playhead = Math.max(0, (now - recording.startedAt) / 1000);
      if (playhead >= recording.length) {
        stopRecording(); // done! (this also sets the playhead back to 0)
      }
    }
  } else if (playing) {
    playhead = (playhead + dt) % settings.clipLength;
  }

  if (playing || recording) wheelAngle = (wheelAngle + dt * s.rolling * 900) % 360;

  drawFrame(playhead);
  updateTimeDisplay();
  requestAnimationFrame(tick);
}

function updateTimeDisplay() {
  ui.timeLabel.textContent = `${playhead.toFixed(1)} / ${settings.clipLength.toFixed(1)} s`;
  ui.scrubber.value = Math.round((playhead / settings.clipLength) * 1000);
  if (recording) {
    ui.recTime.textContent = recording.startedAt === null
      ? 'starting...'
      : `${Math.max(0, recording.length - playhead).toFixed(1)} s left`;
  }
}

function updatePlayButton() {
  ui.playBtn.textContent = playing ? 'Pause' : 'Play';
}

function restart() {
  playhead = 0;
  wheelAngle = 0;
  playing = true;
  updatePlayButton();
}

// Fit the 9:16 preview inside the space next to the panel
function fitCanvas() {
  const box = ui.stage.getBoundingClientRect();
  const scale = Math.min(box.width / VIDEO_WIDTH, box.height / VIDEO_HEIGHT);
  ui.screen.style.width = `${Math.floor(VIDEO_WIDTH * scale)}px`;
  ui.screen.style.height = `${Math.floor(VIDEO_HEIGHT * scale)}px`;
}

// -----------------------------------------------------------------
// 16. RECORDING
// canvas.captureStream() turns the canvas into a live video stream, and
// MediaRecorder saves that stream into a video file.
// -----------------------------------------------------------------
let recording = null; // while recording: { recorder, stream, chunks, startedAt, length, cancelled, message }
let videoUrl = null;  // the last finished video (so we can free its memory later)
let videoFile = null; // ...as a File, for the Share button

// Video types to try, best first. MP4 (H.264) is what Instagram and TikTok
// like best; newer Chrome / Edge and Safari can make it. Others make WebM.
const VIDEO_TYPES = [
  'video/mp4;codecs=avc1.640028', // MP4, H.264 "high" profile
  'video/mp4;codecs=avc1.4d0028', // MP4, H.264 "main" profile
  'video/mp4;codecs=avc1',
  'video/mp4',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
];

function makeRecorder(stream) {
  for (const type of VIDEO_TYPES) {
    if (!MediaRecorder.isTypeSupported(type)) continue;
    try {
      return new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: VIDEO_BITRATE });
    } catch (error) {
      // the browser said yes but then changed its mind: try the next type
    }
  }
  return new MediaRecorder(stream, { videoBitsPerSecond: VIDEO_BITRATE }); // let the browser choose
}

async function startRecording() {
  if (recording) return;
  if (!canvas.captureStream || !window.MediaRecorder) {
    ui.recordHint.textContent = "Sorry, this browser can't record. Try Chrome or Edge.";
    return;
  }
  ui.recordBtn.disabled = true;

  // Load the caption font first, so the first frames aren't in the wrong font
  await document.fonts.load(`${settings.captionSize}px "${settings.captionFont}"`).catch(() => {});

  let stream = null;
  let recorder = null;
  try {
    stream = canvas.captureStream(VIDEO_FPS);
    recorder = makeRecorder(stream);
  } catch (error) {
    console.error(error);
    if (stream) stream.getTracks().forEach((track) => track.stop());
    ui.recordBtn.disabled = false;
    ui.recordHint.textContent = "Sorry, recording didn't start in this browser. Try Chrome or Edge.";
    return;
  }

  const rec = {
    recorder, stream, chunks: [],
    startedAt: null,               // set when the recorder really starts
    length: settings.clipLength,   // seconds to record
    cancelled: false, message: '',
  };
  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) rec.chunks.push(event.data);
  };
  recorder.onstart = () => {
    if (rec.startedAt === null) rec.startedAt = performance.now();
  };
  recorder.onstop = () => finishRecording(rec);
  recorder.onerror = (event) => {
    console.error(event.error || event);
    if (recording === rec) stopRecording('Recording failed. Please try again (or try Chrome / Edge).');
  };

  // Start the clip from the very beginning
  recording = rec;
  playhead = 0;
  wheelAngle = 0;
  playing = true;
  showRecordingUi(true);
  try {
    recorder.start();
  } catch (error) {
    console.error(error);
    stopRecording("Sorry, recording didn't start in this browser. Try Chrome or Edge.");
    return;
  }
  // If the browser never says "started", start the clock anyway after 1 second
  setTimeout(() => {
    if (recording === rec && rec.startedAt === null) rec.startedAt = performance.now();
  }, 1000);
}

// Stop filming. With a message, the recording was cancelled or failed
// (the video is thrown away and the message is shown).
function stopRecording(message = '') {
  if (!recording) return;
  const rec = recording;
  recording = null;
  rec.cancelled = message !== '';
  rec.message = message;
  if (rec.recorder.state !== 'inactive') rec.recorder.stop(); // finishRecording() runs when it's done
  else finishRecording(rec);
  playhead = 0;
  showRecordingUi(false);
}

// The recorder has handed over all its data: turn it into a video file
function finishRecording(rec) {
  rec.stream.getTracks().forEach((track) => track.stop());
  if (rec.cancelled) {
    ui.recordHint.textContent = rec.message;
    return;
  }
  if (rec.chunks.length === 0) {
    ui.recordHint.textContent = 'The video came out empty. Please try again (and keep this tab visible).';
    return;
  }

  const type = (rec.recorder.mimeType || rec.chunks[0].type || 'video/webm').split(';')[0];
  const extension = type.includes('mp4') ? 'mp4' : 'webm';
  const fileName = `reel-${timeStamp()}.${extension}`;
  const blob = new Blob(rec.chunks, { type });

  if (videoUrl) URL.revokeObjectURL(videoUrl); // free the previous video
  videoUrl = URL.createObjectURL(blob);
  videoFile = new File([blob], fileName, { type });

  ui.resultVideo.src = videoUrl;
  ui.downloadLink.href = videoUrl;
  ui.downloadLink.download = fileName;
  ui.downloadLink.textContent = `Download (${(blob.size / 1000000).toFixed(1)} MB)`;
  ui.shareHint.textContent = canShareVideo()
    ? `${fileName} - Share opens your device's share menu (on a phone: pick Instagram or TikTok).`
    : `${fileName} - this browser can't share files, so Share downloads it instead.`;
  ui.result.hidden = false;
  ui.recordHint.textContent = extension === 'mp4'
    ? 'Done! Share it or download it.'
    : 'Done! This browser made a .webm file: Instagram may need it turned into .mp4 first (see README).';
}

// Can this browser share the video file through the device's share menu?
function canShareVideo() {
  try {
    return !!(videoFile && navigator.canShare && navigator.canShare({ files: [videoFile] }));
  } catch (error) {
    return false;
  }
}

// SHARE: use the device's share menu if possible, otherwise download
async function shareVideo() {
  if (!videoFile) return;
  if (canShareVideo()) {
    try {
      await navigator.share({ files: [videoFile], title: videoFile.name });
    } catch (error) {
      if (error.name !== 'AbortError') ui.downloadLink.click(); // AbortError = you closed the menu
    }
  } else {
    ui.downloadLink.click();
  }
}

// reel-YYYYMMDD-HHMMSS
function timeStamp() {
  const d = new Date();
  const two = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${two(d.getMonth() + 1)}${two(d.getDate())}-` +
    `${two(d.getHours())}${two(d.getMinutes())}${two(d.getSeconds())}`;
}

function showRecordingUi(on) {
  document.body.classList.toggle('is-recording', on);
  ui.recBadge.hidden = !on;
  ui.recordBtn.disabled = false;
  ui.recordBtn.textContent = on ? 'Cancel recording' : '● RECORD';
  for (const control of [ui.playBtn, ui.restartBtn, ui.scrubber, ui.clipLength, ui.doodleInput]) {
    control.disabled = on;
  }
  if (on) ui.recordHint.textContent = 'Recording... keep this tab visible.';
  updatePlayButton();
}

// -----------------------------------------------------------------
// 17. THE CONTROL PANEL
// -----------------------------------------------------------------
function addDoodleCard(doodle) {
  const card = ui.doodleTemplate.content.firstElementChild.cloneNode(true);
  const find = (selector) => card.querySelector(selector);
  find('.doodle-name').textContent = doodle.name;
  drawThumb(find('.thumb'), doodle);

  const animation = find('.d-animation');
  animation.value = doodle.animation;
  animation.addEventListener('change', () => { doodle.animation = animation.value; });

  // Size and position sliders: each one changes one number of this doodle
  for (const [selector, key] of [['.d-size', 'size'], ['.d-x', 'x'], ['.d-y', 'y']]) {
    const slider = find(selector);
    slider.value = doodle[key];
    slider.addEventListener('input', () => { doodle[key] = Number(slider.value); });
  }

  // Clean-up redoes the photo-to-lines step, so it only runs when you let go
  const cleanup = find('.d-cleanup');
  cleanup.value = doodle.cleanup;
  cleanup.addEventListener('change', () => {
    if (recording) return;
    doodle.cleanup = Number(cleanup.value);
    processDoodle(doodle);
    drawThumb(find('.thumb'), doodle);
  });

  find('.remove').addEventListener('click', () => {
    doodles.splice(doodles.indexOf(doodle), 1);
    card.remove();
  });

  ui.doodleList.appendChild(card);
}

function loadCaptionFont() {
  document.fonts.load(`${settings.captionSize}px "${settings.captionFont}"`).catch(() => {});
}

function setupPanel() {
  // Put the starting values (from section 1) into the panel
  ui.scene.value = settings.scene;
  ui.clipLength.value = settings.clipLength;
  ui.clipLengthOut.textContent = `${settings.clipLength} s`;
  ui.background.value = settings.background;
  ui.lineColor.value = settings.lineColor;
  ui.accentColor.value = settings.accentColor;
  ui.boil.checked = settings.boil;
  ui.hook.checked = settings.hook;
  ui.seamless.checked = settings.seamless;
  ui.safeZonesToggle.checked = settings.safeZones;
  ui.safeZones.hidden = !settings.safeZones;
  ui.captionText.value = settings.captionText;
  ui.captionPosition.value = settings.captionPosition;
  ui.captionFont.value = settings.captionFont;
  ui.captionSize.value = settings.captionSize;

  // Size the safe-zone overlay from SAFE_ZONE (as % of the video, so it fits any preview size)
  const percent = (part, whole) => `${(part / whole) * 100}%`;
  ui.zoneTop.style.height = percent(SAFE_ZONE.top, VIDEO_HEIGHT);
  ui.zoneBottom.style.height = percent(SAFE_ZONE.bottom, VIDEO_HEIGHT);
  ui.zoneRight.style.width = percent(SAFE_ZONE.right, VIDEO_WIDTH);
  ui.zoneRight.style.top = percent(SAFE_ZONE.top, VIDEO_HEIGHT);
  ui.zoneRight.style.bottom = percent(SAFE_ZONE.bottom, VIDEO_HEIGHT);

  // Playback
  ui.playBtn.addEventListener('click', () => { playing = !playing; updatePlayButton(); });
  ui.restartBtn.addEventListener('click', restart);
  ui.scrubber.addEventListener('input', () => { // dragging the slider pauses and jumps
    playing = false;
    playhead = (Number(ui.scrubber.value) / 1000) * settings.clipLength;
    updatePlayButton();
  });

  // Scene
  ui.scene.addEventListener('change', () => { settings.scene = ui.scene.value; restart(); });

  // Doodles
  ui.doodleInput.addEventListener('change', async () => {
    const files = [...ui.doodleInput.files];
    ui.doodleInput.value = ''; // so picking the same file again still works
    await addDoodleFiles(files);
  });

  // Caption
  ui.captionText.addEventListener('input', () => { settings.captionText = ui.captionText.value; });
  ui.captionPosition.addEventListener('change', () => { settings.captionPosition = ui.captionPosition.value; });
  ui.captionFont.addEventListener('change', () => { settings.captionFont = ui.captionFont.value; loadCaptionFont(); });
  ui.captionSize.addEventListener('input', () => { settings.captionSize = Number(ui.captionSize.value); });

  // Look
  ui.background.addEventListener('input', () => { settings.background = ui.background.value; });
  ui.lineColor.addEventListener('input', () => { settings.lineColor = ui.lineColor.value; });
  ui.accentColor.addEventListener('input', () => { settings.accentColor = ui.accentColor.value; });
  ui.clipLength.addEventListener('input', () => {
    settings.clipLength = Number(ui.clipLength.value);
    ui.clipLengthOut.textContent = `${settings.clipLength} s`;
    playhead %= settings.clipLength;
  });
  ui.boil.addEventListener('change', () => { settings.boil = ui.boil.checked; boiledFrame = null; });

  // Made for Reels
  ui.hook.addEventListener('change', () => { settings.hook = ui.hook.checked; });
  ui.seamless.addEventListener('change', () => { settings.seamless = ui.seamless.checked; });
  ui.safeZonesToggle.addEventListener('change', () => {
    settings.safeZones = ui.safeZonesToggle.checked;
    ui.safeZones.hidden = !settings.safeZones;
  });

  // Record and share
  ui.recordBtn.addEventListener('click', () => {
    if (recording) stopRecording('Recording cancelled.');
    else startRecording();
  });
  ui.shareBtn.addEventListener('click', shareVideo);

  // If you switch tabs, the browser stops drawing, so the video would freeze
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && recording) {
      stopRecording('Recording stopped because the tab was hidden. Keep this tab visible while recording.');
    }
  });
}

// -----------------------------------------------------------------
// 18. START!
// -----------------------------------------------------------------
setupPanel();
fitCanvas();
new ResizeObserver(fitCanvas).observe(ui.stage);
document.fonts.load('100px "Gochi Hand"').catch(() => {});
document.fonts.load('100px "Permanent Marker"').catch(() => {});
requestAnimationFrame(tick);
