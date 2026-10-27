// =====================================================================
// cat.js - the skateboarding cat that lives in the page background.
// main.js loads this file with: import { createCat } from './cat.js';
//
// What the cat does:
//   start     : waits on his board in the bottom-left corner
//   scroll 1  : rides to the right side, stops, hides his board, thumbs up
//   scroll 2  : gets the board back, jumps to the middle, lands, keeps riding
//   scroll 3  : rides to the bottom-right corner and stops
//   scroll 4  : yawns, curls up on his board and falls asleep (z z z)
//   scroll up : plays the last scroll backwards (you can turn around midway)
//   click     : jumps and flips the board under his feet
//   R key     : start over
// (The page itself doesn't scroll. We just listen for the mouse wheel,
//  finger swipes, and the Up/Down arrow, Page Up/Down and Space keys.)
// =====================================================================

// -----------------------------------------------------------------
// 1. SETTINGS YOU CAN CHANGE
// -----------------------------------------------------------------

// Where the cat stands, as parts of the window: [across, down].
// 0 = left/top edge, 1 = right/bottom edge. The point is under his wheels.
const SPOTS = {
  start: [0.10, 0.96], // bottom-left corner
  right: [0.86, 0.62], // right side, middle row
  mid:   [0.50, 0.96], // bottom middle
  end:   [0.90, 0.96], // bottom-right corner
};

const CAT_SIZE = 0.22;  // cat height, as a part of the window height
const WOBBLE = 2.5;     // hand-drawn line wobble (0 = perfectly still lines)
const JUMP_HEIGHT = 70; // how high a click jump goes (in drawing units)

// -----------------------------------------------------------------
// 2. THE DRAWING
// One SVG holds every pose. JavaScript shows one pose at a time and
// moves the parts around. Line and fill colors come from style.css.
// The drawing is 280 x 200 units; the point under the wheels is (100, 183).
// The drawing faces LEFT; we mirror it when the cat rides to the right.
// -----------------------------------------------------------------
const HEAD_DETAILS = `
  <use href="#cat-head"/>
  <path class="line" d="M72 36 L76 48 M128 36 L124 48 M66 64 L54 60 M66 70 L53 71 M134 64 L146 60 M134 70 L147 71"/>`;

const ART = `
<svg class="cat-art" viewBox="-40 0 280 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Shakes the lines a little, like a hand-drawn cartoon -->
    <filter id="cat-wobble" filterUnits="userSpaceOnUse" x="-300" y="-300" width="900" height="800">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="1"/>
      <feDisplacementMap in="SourceGraphic" scale="${WOBBLE}" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <path id="cat-head" d="M70 62 C68 50 67 40 66 28 L86 43 Q100 39 114 43 L134 28 C133 40 132 50 130 62 C132 78 118 86 100 86 C82 86 68 78 70 62 Z"/>
  </defs>

  <g filter="url(#cat-wobble)">
    <g data-part="rig">

      <!-- Speed lines behind him, and little shake marks by his feet (picture 2) -->
      <path data-part="speed" class="line" stroke-dasharray="22 16"
            d="M168 148 L236 148 M180 166 L244 166 M166 184 L222 184"/>
      <path data-part="wiggle" class="line"
            d="M72 142 L69 152 M77 146 L75 154 M146 146 L148 155 M151 142 L154 151"/>

      <g data-part="body">
        <!-- RIDE (picture 2): standing on the board, one leg pushing -->
        <g data-pose="ride">
          <path data-part="ride-tail" class="line" d="M110 128 Q134 128 144 104"/>
          <path data-part="ride-leg" d="M104 128 L124 161 L138 160 L116 124 Z"/>
          <path d="M88 84 C80 104 80 122 84 134 L80 161 L93 161 L96 142 Q104 140 112 134 C119 118 119 100 112 84 Z"/>
          <path class="line" d="M88 98 Q80 108 86 118"/>
          <path data-part="ride-arm" class="line" d="M112 98 L134 90 M134 90 L139 86 M134 90 L140 93"/>
          ${HEAD_DETAILS}
          <g data-blink="62" data-cx="100"><circle class="ink" cx="88" cy="62" r="2.8"/><circle class="ink" cx="112" cy="62" r="2.8"/></g>
          <path class="line" d="M92 71 q4 5 8 0 q4 5 8 0"/>
        </g>

        <!-- AIR (picture 1): happy closed eyes, one paw up -->
        <g data-pose="air">
          <path class="line" d="M118 124 Q142 124 146 100 Q148 90 141 92"/>
          <path d="M88 84 C74 96 72 116 80 128 L72 138 L86 139 L93 130 Q100 132 107 130 L114 139 L128 138 L120 128 C128 116 126 96 112 84 Z"/>
          <path class="line" d="M88 98 Q76 104 80 112 Q86 116 92 110"/>
          <path class="line" d="M114 96 L140 76 M140 76 L138 69 M140 76 L147 73"/>
          ${HEAD_DETAILS}
          <path class="line" d="M82 63 Q87 57 92 63 M108 63 Q113 57 118 63"/>
          <path class="line" d="M96 71 Q100 75 104 71"/>
        </g>

        <!-- GRAB (picture 3): big round eyes, holding the board -->
        <g data-pose="grab">
          <path class="line" d="M116 120 Q140 110 136 86"/>
          <path d="M88 84 C82 100 82 116 78 132 L68 152 L80 154 L92 136 L104 136 L114 152 L124 148 L114 128 C120 110 118 96 112 84 Z"/>
          <path class="line" d="M88 100 Q78 112 84 122"/>
          ${HEAD_DETAILS}
          <circle cx="88" cy="60" r="8"/><circle class="ink" cx="89" cy="56" r="4.4"/>
          <circle cx="112" cy="60" r="8"/><circle class="ink" cx="113" cy="56" r="4.4"/>
        </g>

        <!-- THUMBS UP (picture 4): fluffy cat with one giant hand -->
        <g data-pose="thumbs" transform="translate(-20 10)">
          <g data-part="arm">
            <path class="line" d="M86 102 L116 128 M80 116 L114 142"/>
            <path d="M88 96 Q94 118 70 120 L48 120 Q34 118 34 104 L34 78 Q34 66 46 66 L64 66 L68 40 Q70 30 78 31 Q86 33 84 46 L80 68 Q92 74 88 96 Z"/>
            <path class="line" d="M34 80 L60 80 M34 92 L62 92 M34 104 L60 104 M64 66 Q72 72 80 68"/>
          </g>
          <path class="line" d="M101 120 L94 117 M101 130 L93 131 M165 120 L172 117 M165 130 L173 131"/>
          <path d="M110 120 L106 96 L124 108 Q134 105 144 108 L160 96 L156 120 Q162 140 154 158 L152 172 L144 172 L142 160 Q134 162 126 160 L124 172 L116 172 L114 158 Q106 140 110 120 Z"/>
          <g data-blink="126" data-cx="134"><circle class="ink" cx="126" cy="126" r="2.8"/><circle class="ink" cx="142" cy="126" r="2.8"/></g>
          <path class="line" d="M126 134 q4 5 8 0 q4 5 8 0"/>
        </g>

        <!-- SLEEP: curled up on his board, eyes closed, z z z -->
        <g data-pose="sleep">
          <g data-part="sleep-body">
            <path class="line" d="M136 150 Q158 152 152 138 Q148 131 141 136"/>
            <path d="M62 157 C58 139 76 123 104 123 C128 123 144 136 142 157 Z"/>
            <path class="line" d="M118 140 Q126 146 124 156"/>
          </g>
          <g transform="translate(76 157) scale(0.72) translate(-100 -86)" style="stroke-width: 4.86">
            ${HEAD_DETAILS}
            <path class="line" d="M82 64 Q87 69 92 64 M108 64 Q113 69 118 64"/>
            <path class="line" d="M97 73 Q100 75 103 73"/>
          </g>
          <path d="M50 157 Q48 149 56 149 Q63 150 62 157 Z"/>
          <g data-part="zzz" class="line">
            <path d="M-5 -5 L5 -5 L-5 5 L5 5"/>
            <path d="M-5 -5 L5 -5 L-5 5 L5 5"/>
            <path d="M-5 -5 L5 -5 L-5 5 L5 5"/>
          </g>
        </g>

        <!-- "!" when he gets a fright, and a little heart for his friend the head -->
        <g data-part="surprise">
          <path class="line" d="M100 0 L100 13 M86 8 L80 2 M114 8 L120 2"/>
          <circle class="ink" cx="100" cy="21" r="2.6"/>
        </g>
        <path data-part="heart" class="accent" d="M100 22 C88 13 90 2 100 8 C110 2 112 13 100 22 Z"/>
      </g>

      <!-- THE SKATEBOARD (wheels use the accent color) -->
      <g data-part="board">
        <!-- Night mode: a lamp on the front of the board and its light beam -->
        <g data-part="lamp" style="display: none">
          <path class="beam" d="M42 153 L-70 112 L-70 196 Z"/>
          <circle class="lamp" cx="44" cy="153" r="4"/>
        </g>
        <rect x="38" y="157" width="124" height="7" rx="3.5"/>
        <path class="line" d="M66 164 L66 170 M134 164 L134 170"/>
        <g class="accent"><circle cx="66" cy="176" r="6"/><path data-part="spoke1" class="line" d="M66 172 L66 180"/></g>
        <g class="accent"><circle cx="134" cy="176" r="6"/><path data-part="spoke2" class="line" d="M134 172 L134 180"/></g>
      </g>

      <!-- The paw that holds the board in the GRAB pose (drawn over the board) -->
      <path data-part="paw" d="M104 108 Q116 100 128 106 Q132 112 126 118 Q114 118 104 108 Z M118 103 L120 112 M124 105 L126 113"/>

      <!-- Landing marks (picture 1) and the "poof" when the board appears/disappears -->
      <path data-part="impact" class="line"
            d="M18 156 L30 160 M16 168 L30 168 M20 180 L31 175 M182 156 L170 160 M184 168 L170 168 M180 180 L169 175"/>
      <path data-part="puff" class="line"
            d="M100 150 L100 138 M86 154 L78 146 M114 154 L122 146 M82 168 L70 168 M118 168 L130 168 M86 182 L78 190 M114 182 L122 190"/>
    </g>
  </g>
</svg>`;

// -----------------------------------------------------------------
// 3. SMALL HELPERS
// -----------------------------------------------------------------
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Easing: how a movement speeds up and slows down (p goes from 0 to 1)
const linear = (p) => p;
const easeIn = (p) => p * p;
const easeOut = (p) => 1 - (1 - p) * (1 - p);
const easeInOut = (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
const easeOutBack = (p) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2;

// -----------------------------------------------------------------
// 4. CREATE THE CAT
// -----------------------------------------------------------------
export function createCat({ accentColor = '#ff2020' } = {}) {
  // A see-through layer behind the 3D canvas holds the cat
  const stage = document.createElement('div');
  stage.id = 'cat-stage';
  stage.innerHTML = `<div class="cat">${ART}</div>`;
  document.body.appendChild(stage);
  stage.style.setProperty('--cat-accent', accentColor);

  const box = stage.querySelector('.cat');
  const svg = stage.querySelector('svg');
  const part = (name) => svg.querySelector(`[data-part="${name}"]`);
  const parts = {
    rig: part('rig'), body: part('body'), board: part('board'), paw: part('paw'),
    speed: part('speed'), wiggle: part('wiggle'), impact: part('impact'), puff: part('puff'),
    rideLeg: part('ride-leg'), rideArm: part('ride-arm'), rideTail: part('ride-tail'),
    arm: part('arm'), spoke1: part('spoke1'), spoke2: part('spoke2'),
    surprise: part('surprise'), heart: part('heart'),
    sleepBody: part('sleep-body'), zzz: part('zzz'), lamp: part('lamp'),
  };
  const poses = [...svg.querySelectorAll('[data-pose]')];
  const blinkers = [...svg.querySelectorAll('[data-blink]')];
  const noise = svg.querySelector('feTurbulence');

  // Everything the cat is doing right now. The animations below change
  // these numbers, and render() draws the cat from them every frame.
  let s;
  function freshState() {
    return {
      from: 'start', to: 'start', t: 1, curve: false, arc: 0, // travelling between spots
      flip: -1,          // 1 = drawing as-is (facing left), -1 = mirrored (facing right)
      tilt: 0, autoTilt: false,
      pose: 'ride',
      catY: 0, sqX: 1, sqY: 1,                        // hop height and squash
      board: { x: 0, y: 0, rot: 0, flipY: 1, scale: 1 },
      rolling: 0,        // 0 = standing still, 1 = riding
      cruise: 0,         // 1 = rolling back and forth in the middle
      arm: 0, thumbBounce: 0,
      surprise: 0, heart: 0, look: 0, // fright, love, looking at the head
      sleepy: 0,         // 1 = fast asleep (z z z)
      impact: 0, puff: 0, puffX: 100, puffY: 168,
      jumping: false, busyPose: false,
    };
  }
  s = freshState();

  // --- Size: the cat is CAT_SIZE of the window height ---
  const size = { w: 0, h: 0 };
  function resize() {
    size.h = clamp(window.innerHeight * CAT_SIZE, 110, 210);
    size.w = size.h * 1.4;
    box.style.width = size.w + 'px';
    box.style.height = size.h + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  // --- Where a spot is on screen, in pixels ---
  function spotPx(name) {
    const [fx, fy] = SPOTS[name];
    const margin = size.w * 0.4;
    return {
      x: clamp(fx * window.innerWidth, margin, window.innerWidth - margin),
      y: clamp(fy * window.innerHeight, size.h, window.innerHeight - 4),
    };
  }

  // A point on the way from s.from to s.to (t = 0 at the start, 1 at the end)
  function pathPoint(t) {
    const a = spotPx(s.from);
    const b = spotPx(s.to);
    if (s.curve) {
      // Ride along the ground first, then curve up (like a ramp)
      const c = { x: lerp(a.x, b.x, 0.7), y: a.y };
      return {
        x: lerp(lerp(a.x, c.x, t), lerp(c.x, b.x, t), t),
        y: lerp(lerp(a.y, c.y, t), lerp(c.y, b.y, t), t),
      };
    }
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t) - Math.sin(Math.PI * t) * s.arc * window.innerHeight,
    };
  }

  // -----------------------------------------------------------------
  // 5. HELPERS FOR MOVING
  // -----------------------------------------------------------------

  // How much the cat leans while riding along the path at point t
  function pathTilt(t) {
    const a = pathPoint(Math.max(0, t - 0.01));
    const b = pathPoint(Math.min(1, t + 0.01));
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (Math.abs(dx) + Math.abs(dy) < 0.01) return 0;
    const angle = dx >= 0 ? Math.atan2(dy, dx) : Math.atan2(-dy, -dx);
    return clamp((angle * 180) / Math.PI * 0.8, -28, 28);
  }

  // 0 before "start" ms, 1 after start + length, and in between it grows
  const phase = (ms, start, length) => clamp((ms - start) / length, 0, 1);

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

  // TWEENS (used by the click jump): change numbers smoothly over a few
  // milliseconds. "gen" lets the R key stop them all at once.
  let gen = 0;
  function tween(ms, change, ease = linear) {
    const myGen = gen;
    return new Promise((done) => {
      const start = performance.now();
      function tick(now) {
        if (myGen !== gen) return done();
        const p = Math.min(1, (now - start) / ms);
        change(ease(p));
        if (p < 1) requestAnimationFrame(tick);
        else done();
      }
      requestAnimationFrame(tick);
    });
  }

  // -----------------------------------------------------------------
  // 6. THE STORY
  // Each scroll is a list of short pieces. A piece has a length (ms) and
  // an apply(p) function that places the cat for progress p (0 = start of
  // the piece, 1 = end). Because every moment depends only on p, the same
  // pieces play forwards (scroll down) or backwards (scroll up).
  // lock: true = the piece moves his body or board, so clicks can't jump.
  // -----------------------------------------------------------------
  const STORY = [
    // Scroll 1: ride to the right side, hide the board, thumbs up
    [
      { ms: 2800, apply(p) { // ride along a ramp-shaped path
        Object.assign(s, { from: 'start', to: 'right', curve: true, arc: 0, autoTilt: true });
        s.t = easeInOut(p);
        s.rolling = clamp(p * 5.6, 0, 1); // gets going during the first half second
        s.flip = -1; // face right
      } },
      { ms: 450, apply(p) { // brake and lean back
        s.autoTilt = false;
        s.rolling = 1 - p;
        s.tilt = pathTilt(1) * (1 - easeInOut(p)) + Math.sin(Math.PI * p) * 8 * s.flip;
      } },
      { ms: 680, lock: true, apply(p) { // hop off; the board flips up and vanishes
        const ms = p * 680;
        const pastTop = hopAt(ms, 34);
        s.pose = pastTop ? 'thumbs' : 'ride';
        s.flip = pastTop ? 1 : -1;
        s.tilt = 0;
        s.rolling = 0;
        s.arm = 0;
        const q = easeIn(phase(ms, 0, 300));
        Object.assign(s.board, { x: 0, y: -40 * q, rot: -90 * q, flipY: 1, scale: 1 - q });
        puffAt(100, 128, ms, 300);
      } },
      { ms: 500, lock: true, apply(p) { s.arm = easeOutBack(p); } }, // the big hand pops out
    ],

    // Scroll 2: board comes back, big jump to the middle, then keep riding
    [
      { ms: 250, lock: true, apply(p) { s.arm = 1 - easeIn(p); } }, // hand goes away
      { ms: 380, lock: true, apply(p) { // the board comes back with a poof
        const ms = p * 380;
        Object.assign(s.board, { x: 0, y: 0, rot: 0, flipY: 1, scale: easeOutBack(phase(ms, 0, 250)) });
        puffAt(100, 168, ms, 0);
      } },
      { ms: 520, lock: true, apply(p) { // hop onto it, facing left (toward the middle)
        s.pose = hopAt(p * 520, 26) ? 'ride' : 'thumbs';
        s.flip = 1;
      } },
      { ms: 180, lock: true, apply(p) { // crouch before the jump
        s.pose = 'ride';
        s.catY = 0;
        squashAt(p, 0.22);
      } },
      { ms: 1200, lock: true, apply(p) { // the big jump, holding the board
        Object.assign(s, { from: 'right', to: 'mid', curve: false, arc: 0.22, autoTilt: false, t: p });
        s.tilt = Math.sin(Math.PI * p) * 18;
        s.pose = p > 0.78 ? 'air' : 'grab';
        const hold = p < 0.78 ? Math.min(1, p / 0.12) : 1 - (p - 0.78) / 0.22;
        Object.assign(s.board, { x: 24 * hold, y: -48 * hold, rot: -60 * hold });
        s.catY = -24 * hold;
        s.sqX = s.sqY = 1;
        s.rolling = 0;
        s.impact = 0;
      } },
      { ms: 320, lock: true, apply(p) { // land and start rolling
        s.pose = 'ride';
        s.tilt = 0;
        s.catY = 0;
        Object.assign(s.board, { x: 0, y: 0, rot: 0 });
        s.impact = p > 0 && p < 1 ? 1 - p : 0;
        squashAt(phase(p, 0, 0.8), 0.26);
        s.rolling = easeOut(p);
        s.cruise = 0;
      } },
      { ms: 600, apply(p) { // keep riding back and forth
        s.rolling = 1;
        s.cruise = easeInOut(p);
      } },
    ],

    // Scroll 3: turn around and ride to the bottom-right corner
    [
      { ms: 400, lock: true, apply(p) { // stop drifting, turn to face right
        s.rolling = 1;
        s.cruise = 1 - easeInOut(p);
        s.flip = 1 - 2 * easeInOut(phase(p, 0, 0.75));
      } },
      { ms: 1600, apply(p) { // ride to the corner
        Object.assign(s, { from: 'mid', to: 'end', curve: false, arc: 0, autoTilt: true });
        s.t = easeInOut(p);
        s.rolling = 1;
        s.cruise = 0;
        s.flip = -1;
      } },
      { ms: 450, apply(p) { // brake and lean back
        s.autoTilt = false;
        s.rolling = 1 - p;
        s.tilt = Math.sin(Math.PI * p) * 8 * s.flip;
      } },
    ],

    // Scroll 4: a big yawn, then he curls up on his board and falls asleep
    [
      { ms: 700, lock: true, apply(p) { // stretch up tall (a yawn)
        s.pose = 'ride';
        s.sqY = 1 + 0.14 * Math.sin(Math.PI * p);
        s.sqX = 1 / s.sqY;
      } },
      { ms: 520, lock: true, apply(p) { // flop down
        s.pose = hopAt(p * 520, 12) ? 'sleep' : 'ride';
        s.sleepy = 0;
      } },
      { ms: 900, apply(p) { s.sleepy = easeInOut(p); } }, // z z z
    ],
  ];

  // Click: jump, spin and flip the board, land back on it
  async function trick(height = JUMP_HEIGHT) {
    if (s.jumping) return;
    if (s.pose === 'thumbs') {
      if (!s.busyPose) tween(450, (p) => { s.thumbBounce = Math.sin(Math.PI * p); });
      return;
    }
    if (s.pose === 'sleep') {
      // a sleepy twitch, "!", then back to sleep
      if (!s.busyPose) {
        tween(700, (p) => { s.surprise = Math.sin(Math.PI * p); });
        tween(300, (p) => { s.catY = -8 * Math.sin(Math.PI * p); });
      }
      return;
    }
    if (s.pose !== 'ride' || s.busyPose) return;

    s.jumping = true;
    api.onJump?.(); // tell main.js (the head watches)
    await tween(120, (q) => squashAt(q, 0.2));
    s.pose = 'air';
    await tween(750, (p) => {
      const up = 4 * p * (1 - p); // 0 -> 1 -> 0, like a thrown ball
      s.catY = -height * up;
      s.board.y = -height * 0.5 * up;
      s.board.rot = 360 * easeInOut(p);          // spin around
      s.board.flipY = Math.cos(2 * Math.PI * p); // and flip over (kickflip)
      s.sqY = 1 + 0.08 * Math.sin(Math.PI * p);  // stretch in the air
      s.sqX = 1 / s.sqY;
    });
    Object.assign(s.board, { y: 0, rot: 0, flipY: 1 });
    s.catY = 0;
    s.pose = 'ride';
    tween(320, (q) => { s.impact = 1 - q; }, easeIn); // landing marks
    await tween(220, (q) => squashAt(q, 0.24));
    s.jumping = false;
    api.onLand?.(); // tell main.js (the head nods)
  }

  // -----------------------------------------------------------------
  // FRIENDS WITH THE HEAD
  // main.js calls these when you click the head, or when the head nods.
  // -----------------------------------------------------------------
  let watched = false; // is the head looking at him right now?
  let lookUntil = 0;   // he stares at the head until this time

  // The head was clicked: "!" pops up, he looks at the head and jumps in fright
  function startle() {
    lookUntil = performance.now() + 2500;
    tween(900, (p) => { s.surprise = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85; });
    setTimeout(() => {
      if (s.pose === 'thumbs') {
        // no board to jump with: wave the big hand twice instead
        if (!s.busyPose) tween(800, (p) => { s.thumbBounce = Math.abs(Math.sin(2 * Math.PI * p)); });
      } else {
        trick(JUMP_HEIGHT * 1.4);
      }
    }, 180);
  }

  // A little heart floats up (the head liked his trick)
  function love() {
    tween(1100, (p) => { s.heart = p; });
  }

  // -----------------------------------------------------------------
  // 7. THE PLAYER: plays a scroll forwards (dir 1) or backwards (dir -1)
  // -----------------------------------------------------------------
  let step = 0;     // how many scrolls have finished
  let play = null;  // what's playing: { k: which scroll, i: which piece, p: progress, dir }
  let queued = 0;   // one more scroll waiting: 1 = forwards, -1 = backwards

  function go(dir) {
    if (play) {
      if (play.dir !== dir) { play.dir = dir; queued = 0; } // turn around midway
      else queued = dir;
      return;
    }
    if (dir > 0 && step < STORY.length) {
      play = { k: step, i: 0, p: 0, dir };
    } else if (dir < 0 && step > 0) {
      const k = step - 1;
      play = { k, i: STORY[k].length - 1, p: 1, dir };
    }
  }

  // Called every frame by render()
  function advanceStory(dt) {
    if (!play) return;
    const pieces = STORY[play.k];
    const piece = pieces[play.i];
    if (piece.lock && s.jumping) return; // let a click jump finish first
    s.busyPose = !!piece.lock;

    play.p += (play.dir * dt * 1000) / piece.ms;
    if (play.p > 0 && play.p < 1) {
      piece.apply(play.p);
      return;
    }

    // This piece is finished: place it exactly at its end, go to the next one
    piece.apply(clamp(play.p, 0, 1));
    play.i += play.dir;
    play.p = play.dir > 0 ? 0 : 1;
    if (play.i < 0 || play.i >= pieces.length) { // the whole scroll is done
      step = play.dir > 0 ? play.k + 1 : play.k;
      const again = queued;
      play = null;
      queued = 0;
      s.busyPose = false;
      if (again) go(again);
    }
  }

  function reset() {
    gen++; // stops every running tween
    s = freshState();
    step = 0;
    play = null;
    queued = 0;
  }

  // -----------------------------------------------------------------
  // 8. SCROLL, SWIPE, KEYS AND CLICKS
  // -----------------------------------------------------------------
  const inPanel = (event) => event.target.closest?.('.lil-gui');

  // Mouse wheel / touchpad: one step per scroll gesture (down = forwards, up = backwards)
  let lastWheel = 0;
  let wheelSum = 0;
  let gestureUsed = false;
  window.addEventListener('wheel', (event) => {
    if (inPanel(event)) return;
    const now = performance.now();
    if (now - lastWheel > 300) { gestureUsed = false; wheelSum = 0; } // a new gesture
    lastWheel = now;
    if (gestureUsed) return;
    wheelSum += event.deltaY;
    if (Math.abs(wheelSum) > 30) {
      gestureUsed = true;
      go(wheelSum > 0 ? 1 : -1);
    }
  }, { passive: true });

  // Finger swipes (on phones): up = forwards, down = backwards
  let swipeStartY = null;
  let ignoreClickUntil = 0;
  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') swipeStartY = event.clientY;
  });
  window.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch' || swipeStartY === null) return;
    const moved = swipeStartY - event.clientY;
    if (Math.abs(moved) > 50) {
      ignoreClickUntil = performance.now() + 400; // a swipe is not a click
      go(moved > 0 ? 1 : -1);
    }
    swipeStartY = null;
  });

  window.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'PageDown', ' '].includes(event.key)) go(1);
    if (['ArrowUp', 'PageUp'].includes(event.key)) go(-1);
    if (event.key === 'r' || event.key === 'R') reset();
  });

  window.addEventListener('click', (event) => {
    if (inPanel(event) || performance.now() < ignoreClickUntil) return;
    trick();
  });

  // -----------------------------------------------------------------
  // 9. DRAW EVERY FRAME
  // -----------------------------------------------------------------
  let last = performance.now();
  let wheelAngle = 0;
  const facePx = { x: 0, y: 0 }; // the cat's face on screen, in pixels
  const lampPx = { x: 0, y: 0 }; // his board lamp on screen, in pixels
  let nextWobble = 0;

  function render(now) {
    const realDt = (now - last) / 1000;
    const dt = Math.min(0.05, realDt);
    last = now;
    const time = now / 1000;

    advanceStory(Math.min(0.25, realDt)); // move the scroll story along (in real time)

    // Where on screen
    const p = pathPoint(s.t);
    if (s.autoTilt) s.tilt = pathTilt(s.t); // lean along the path, like riding up a ramp
    const x = p.x + s.cruise * Math.sin(time * 0.9) * size.w * 0.35;
    const left = x - size.w * 0.5;
    const top = p.y - size.h * (183 / 200);
    box.style.transform = `translate(${left}px, ${top}px)`;

    // Remember where his face is on screen (main.js makes the head look at it).
    // Face in drawing units: (100, 60), or (114, 136) in the thumbs-up pose.
    const face = s.pose === 'thumbs' ? [100 + 14 * s.flip, 136]
      : s.pose === 'sleep' ? [100 - 24 * s.flip, 140 + s.catY]
      : [100, 60 + s.catY];
    facePx.x = left + ((face[0] + 40) / 280) * size.w;
    facePx.y = top + (face[1] / 200) * size.h;
    lampPx.x = left + ((100 - 56 * s.flip + 40) / 280) * size.w;
    lampPx.y = top + ((153 + s.board.y) / 200) * size.h;

    // Mirror and lean the whole cat around the point under his wheels
    parts.rig.setAttribute('transform',
      `translate(100 183) rotate(${s.tilt}) scale(${s.flip} 1) translate(-100 -183)`);

    // Body: hop, squash, and a little bounce while riding (or breathing)
    const bob = s.rolling > 0.01 ? Math.sin(time * 14) * 1.2 * s.rolling : Math.sin(time * 2.4) * 0.6;
    const bodyMove =
      `translate(0 ${s.catY + bob}) translate(100 162) scale(${s.sqX} ${s.sqY}) translate(-100 -162)`;
    parts.body.setAttribute('transform', bodyMove);
    parts.paw.setAttribute('transform', bodyMove);

    for (const g of poses) g.style.display = g.dataset.pose === s.pose ? '' : 'none';
    parts.paw.style.display = s.pose === 'grab' ? '' : 'none';

    // Board
    const b = s.board;
    parts.board.style.display = b.scale < 0.01 ? 'none' : '';
    parts.board.setAttribute('transform',
      `translate(${b.x} ${b.y}) translate(100 168) rotate(${b.rot}) scale(${b.scale} ${b.scale * b.flipY}) translate(-100 -168)`);
    wheelAngle += dt * s.rolling * 900;
    parts.spoke1.setAttribute('transform', `rotate(${wheelAngle} 66 176)`);
    parts.spoke2.setAttribute('transform', `rotate(${wheelAngle} 134 176)`);

    // Riding details: pushing leg, waving arm, tail, speed lines
    parts.rideLeg.setAttribute('transform', `rotate(${Math.sin(time * 7) * 12 * s.rolling} 110 130)`);
    parts.rideArm.setAttribute('transform', `rotate(${Math.sin(time * 5) * 6} 112 96)`);
    parts.rideTail.setAttribute('transform', `rotate(${Math.sin(time * 4) * 7} 110 128)`);
    parts.speed.style.opacity = s.rolling;
    parts.speed.style.strokeDashoffset = -time * 140;
    parts.wiggle.style.opacity = s.rolling * (Math.floor(time * 10) % 2 ? 1 : 0.25);

    // Thumbs up: the big hand grows out and wiggles
    parts.arm.setAttribute('transform',
      `rotate(${Math.sin(time * 3) * 3 - s.thumbBounce * 12} 114 136) translate(114 136) scale(${s.arm}) translate(-114 -136)`);

    // Eyes: look at the head when it looks at him (or after a fright),
    // grow big when startled, and blink every few seconds
    const lookWanted = watched || now < lookUntil ? 1 : 0;
    s.look += (lookWanted - s.look) * Math.min(1, dt * 6);
    let lookX = window.innerWidth / 2 - facePx.x;     // the head is in the
    let lookY = window.innerHeight * 0.45 - facePx.y; // middle of the window
    const lookLen = Math.hypot(lookX, lookY) || 1;
    lookX = (lookX / lookLen) * 2.4 * s.look * s.flip; // mirrored when he is
    lookY = (lookY / lookLen) * 2.4 * s.look;
    const eyeSize = 1 + 0.5 * s.surprise;
    const blink = time % 3.4 < 0.12 ? 0.1 : 1;
    for (const g of blinkers) {
      const { cx, blink: cy } = g.dataset;
      g.setAttribute('transform',
        `translate(${lookX} ${lookY}) translate(${cx} ${cy}) scale(${eyeSize} ${eyeSize * blink}) translate(${-cx} ${-cy})`);
    }

    // "!" above his head (higher up in the thumbs-up pose), and the heart
    const markAt = s.pose === 'thumbs' ? 'translate(13 78)' : s.pose === 'sleep' ? 'translate(-24 86)' : '';
    parts.surprise.style.opacity = Math.min(1, s.surprise * 3);
    parts.surprise.setAttribute('transform',
      `${markAt} translate(100 21) scale(${0.6 + 0.4 * Math.min(1, s.surprise * 3)}) translate(-100 -21)`);
    parts.heart.style.opacity = Math.sin(Math.PI * s.heart);
    parts.heart.setAttribute('transform', `${markAt} translate(0 ${-16 * s.heart})`);

    // Sleeping: slow breathing, and three z's floating up from his head
    parts.sleepBody.setAttribute('transform',
      `translate(100 157) scale(1 ${1 + 0.035 * Math.sin(time * 1.8)}) translate(-100 -157)`);
    [...parts.zzz.children].forEach((z, i) => {
      const k = (time * 0.45 + i / 3) % 1; // 0 -> 1, then starts again
      const zx = 70 + k * 26 + Math.sin(k * 7) * 3;
      const zy = 108 - k * 56;
      // scale(flip) keeps the letter z readable when the cat is mirrored
      z.setAttribute('transform', `translate(${zx} ${zy}) scale(${(0.5 + k * 0.7) * s.flip} ${0.5 + k * 0.7})`);
      z.style.opacity = s.sleepy * Math.sin(Math.PI * k);
    });

    // Landing marks and poof
    parts.impact.style.opacity = s.impact;
    parts.puff.style.opacity = s.puff;
    parts.puff.setAttribute('transform',
      `translate(${s.puffX} ${s.puffY}) scale(${1.5 - s.puff * 0.5}) translate(-100 -168)`);

    // New wobble pattern ~9 times a second = "boiling" hand-drawn lines
    if (now > nextWobble) {
      noise.setAttribute('seed', Math.floor(Math.random() * 1000));
      nextWobble = now + 110;
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  const api = {
    next: () => go(1),
    back: () => go(-1),
    reset,
    jump: () => trick(),
    startle,
    love,
    getFace: () => facePx, // where the cat's face is on screen, in pixels
    setWatched: (on) => { watched = on; },
    isPerforming: () => play !== null || s.jumping, // a scroll step or a jump is playing
    onJump: null, // main.js can put functions here to hear about jumps
    onLand: null,
    setAccent: (color) => stage.style.setProperty('--cat-accent', color),
    // Night mode: show the lamp on his board (main.js adds the real 3D light)
    setNight: (on) => { parts.lamp.style.display = on ? '' : 'none'; },
    // Where the lamp is on screen, in pixels (the 3D light follows this point)
    getLamp: () => lampPx,
  };
  return api;
}
