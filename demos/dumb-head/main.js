// =====================================================================
// main.js - all the 3D code for the page.
// index.html loads this file. Edit, save, and Live Server refreshes
// the browser for you.
// =====================================================================

import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
// NEW in Lesson 5: lil-gui makes a small control panel with sliders.
// It's the same tool the official Three.js examples use.
import GUI from 'three/addons/libs/lil-gui.module.min.js';
// The animated title (React Bits "TechText", converted to plain JavaScript).
// './' means "a file in this same folder".
import { createTechText } from './techText.js';
// The skateboarding cat in the background (scroll and click to play).
import { createCat } from './cat.js';

// -----------------------------------------------------------------
// 1. SCENE, CAMERA, RENDERER
// -----------------------------------------------------------------
const scene = new THREE.Scene();
// No scene background: the 3D canvas is see-through, so the black page
// and the cat behind it show through. (The page is black in style.css.)

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 4);

// alpha: true = a see-through canvas
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// -----------------------------------------------------------------
// 2. LIGHTS
// The white lights are kept low, so the mouse light can stand out.
// -----------------------------------------------------------------

// Soft studio light from every direction (35% strength)
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.35;

// The white "sun" light
const sunLight = new THREE.DirectionalLight('#ffffff', 0.8);
sunLight.position.set(3, 4, 5);
scene.add(sunLight);

// NEW in Lesson 5: all the mouse light's settings live together in one
// object. The control panel changes these values, and the rest of the
// code reads them, so everything updates the moment you move a slider.
const settings = {
  brightness: 0,    // how strong the light is (0 = off; try 20 to turn it back on)
  color: '#ff2020', // the light's color
  distance: 1.2,    // how far in front of the head the light floats
};

// The light that follows your mouse.
// A PointLight shines in all directions from one spot, like a light bulb.
const mouseLight = new THREE.PointLight(settings.color, settings.brightness);
mouseLight.position.set(0, 0, settings.distance);
scene.add(mouseLight);

// A tiny glowing ball, so you can see where the light is.
// MeshBasicMaterial ignores lighting, so it always looks bright.
const lightBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.03, 16, 8),
  new THREE.MeshBasicMaterial({ color: settings.color })
);
mouseLight.add(lightBall); // the ball rides along with the light
lightBall.visible = false; // hidden while the light is off (checkbox in the panel)

// -----------------------------------------------------------------
// 3. TEXTURES
// The images now live as normal files in the "textures" folder.
// -----------------------------------------------------------------
const textureLoader = new THREE.TextureLoader();

function loadTexture(imageData, isColorImage) {
  const texture = textureLoader.load(imageData);
  if (isColorImage) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  return texture;
}

// -----------------------------------------------------------------
// 4. THE MATERIAL (the model's "skin")
//   map          = the color painting            (Material_BaseColor)
//   normalMap    = tiny dents and wrinkles       (Material_Normal)
//   roughnessMap = matte vs. shiny               (Material_Roughness)
//   emissiveMap  = parts that glow               (Material_Emission)
// -----------------------------------------------------------------
const NORMAL_GLOW = 1; // how bright the letters glow normally (0 = no glow)

const material = new THREE.MeshStandardMaterial({
  map: loadTexture('textures/basecolor.jpg', true),
  normalMap: loadTexture('textures/normal.jpg', false),
  roughnessMap: loadTexture('textures/roughness.jpg', false),
  emissive: '#ffffff',
  emissiveMap: loadTexture('textures/emission.png', true),
  emissiveIntensity: NORMAL_GLOW,
  metalness: 0,
});

// -----------------------------------------------------------------
// 5. LOAD YOUR MODEL from the "models" folder
// Loading a file takes a moment, so we give the loader a function to
// run once the model has arrived. Until then, the holder is empty.
// -----------------------------------------------------------------
const holder = new THREE.Group(); // empty "holder" we turn instead of the model
scene.add(holder);

const fbxLoader = new FBXLoader();
fbxLoader.load('models/dumb_face.fbx', (model) => {
  // This part runs when the model has finished loading.

  model.traverse((piece) => {
    if (piece.isMesh) {
      piece.material = material;
    }
  });

  model.rotation.y = Math.PI; // turn the face toward the camera

  // ---------------------------------------------------------------
  // 6. RESIZE AND CENTER THE MODEL
  // ---------------------------------------------------------------
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const middle = box.getCenter(new THREE.Vector3());

  model.position.sub(middle);
  holder.scale.setScalar(2 / Math.max(size.x, size.y, size.z));
  holder.add(model);
});

// -----------------------------------------------------------------
// 7. TRACK THE MOUSE
// -----------------------------------------------------------------

// Mouse position as numbers from -1 to 1 (0, 0 = middle of the screen)
const mouse = new THREE.Vector2(0, 0);

// Helper: turn a mouse/finger event into -1..1 numbers and store them in "target"
function readPointer(event, target) {
  target.x = (event.clientX / window.innerWidth) * 2 - 1;
  target.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// The RAYCASTER (from Lesson 4).
// It shoots an invisible laser from the camera through the mouse
// position into the 3D world, and tells us what the laser hits.
// We use it to (a) place the red light and (b) know if you clicked the head.
const raycaster = new THREE.Raycaster();

const canvas = renderer.domElement;

// We listen on the whole window (not just the 3D canvas), so the head keeps
// following the mouse even when it's over the title at the top.
let lastMouseMove = 0; // when the mouse last moved (in seconds)

window.addEventListener('pointermove', (event) => {
  readPointer(event, mouse);
  lastMouseMove = performance.now() / 1000;

  // Is the mouse over the head? Then show a "hand" cursor.
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(holder); // list of things the laser hit
  canvas.style.cursor = hits.length > 0 ? 'pointer' : 'default';
});

// When the mouse leaves the window (or a finger lifts), look straight ahead again.
// "relatedTarget" is where the pointer went; empty means "outside the page".
window.addEventListener('pointerout', (event) => {
  if (!event.relatedTarget) {
    mouse.set(0, 0);
  }
});

// Head-turning settings (from Lesson 3)
const lookTarget = new THREE.Vector3(0, 0, 3);
const mousePoint = new THREE.Vector3();
const HOW_FAR = 3;
const SMOOTHNESS = 0.08;
const IDLE_TIME = 4; // seconds without moving the mouse before the head looks at the cat

// The light moves on an invisible glass wall standing in front of the
// head. settings.distance says how far in front the wall is.
const lightWall = new THREE.Plane(new THREE.Vector3(0, 0, 1), -settings.distance);
const lightTarget = new THREE.Vector3();
const LIGHT_SMOOTHNESS = 0.15;

// -----------------------------------------------------------------
// 8. CLICK REACTIONS (from Lesson 4)
// Each click on the head plays the next reaction in this list.
// -----------------------------------------------------------------
const REACTIONS = ['shake', 'nod', 'flash'];
const REACTION_TIME = 0.8; // how long a reaction lasts, in seconds

let nextReaction = 0;        // which reaction to play on the next click (0 = first in the list)
let currentReaction = null;  // the reaction playing right now (null = none)
let reactionStart = 0;       // the time it started

canvas.addEventListener('click', (event) => {
  const clickPoint = new THREE.Vector2();
  readPointer(event, clickPoint);

  raycaster.setFromCamera(clickPoint, camera);
  const hits = raycaster.intersectObject(holder);

  if (hits.length > 0) { // the laser hit the head!
    // The cat gets a fright (and this click doesn't also count as a normal cat jump)
    event.stopPropagation();
    cat.startle();

    currentReaction = REACTIONS[nextReaction];
    reactionStart = performance.now() / 1000; // seconds since the page opened
    // Move on to the next reaction; after the last one, go back to the first.
    nextReaction = (nextReaction + 1) % REACTIONS.length;
    // Want a random reaction instead? Use this line instead of the one above:
    // nextReaction = Math.floor(Math.random() * REACTIONS.length);
  }
});

// -----------------------------------------------------------------
// 9. THE TITLE (React Bits TechText)
// It draws into the empty <div id="title"> from index.html.
// When the mouse is away, a highlight sweeps across the letters by itself.
// Hover a letter to outline it, or drag a letter and let go: it springs back.
// More options are listed at the top of techText.js.
// -----------------------------------------------------------------
const title = createTechText(document.getElementById('title'), {
  text: 'DUMB HEAD',
  fontFamily: '"Arial Black", Arial, sans-serif',
  fontWeight: 900,
  color: '#ffffff',             // letter color
  accentColor: settings.color,  // selection box color = the light's color
});

// The cat (all its code is in cat.js). Its wheels use the light's color.
const cat = createCat({ accentColor: settings.color });

// The head and the cat are friends:
// when the cat jumps, the head watches; when he lands, the head nods
// and the cat gets a little heart.
let watchCatUntil = 0; // the head watches the cat until this time (seconds)
cat.onJump = () => {
  watchCatUntil = performance.now() / 1000 + 1.6;
};
cat.onLand = () => {
  currentReaction = 'nod';
  reactionStart = performance.now() / 1000;
  cat.love();
};

// -----------------------------------------------------------------
// 10. THE CONTROL PANEL (from Lesson 5)
// gui.add(object, 'name', min, max, step) makes a slider that changes
// object.name. The panel appears in the top-right corner of the page.
// -----------------------------------------------------------------
const gui = new GUI({ title: 'Mouse light' });

gui.add(settings, 'brightness', 0, 100, 1).name('Brightness');

// addColor makes a color picker. onChange runs every time you pick a
// new color, so we can paint the light and the little ball with it.
gui.addColor(settings, 'color').name('Color').onChange((newColor) => {
  mouseLight.color.set(newColor);
  lightBall.material.color.set(newColor);
  title.update({ accentColor: newColor }); // the title's selection box matches the light
  cat.setAccent(newColor);                 // and so do the cat's wheels
});

gui.add(settings, 'distance', 0.9, 4, 0.05).name('Distance from head');

// lightBall.visible is true or false, so lil-gui makes a checkbox for it
gui.add(lightBall, 'visible').name('Show light ball');

// -----------------------------------------------------------------
// NIGHT MODE: the room lights go down and the lamp on the cat's board
// lights up the head as he rides around. Press N to switch it on/off.
// -----------------------------------------------------------------
const night = {
  on: false,       // start with night mode off
  lamp: 30,        // how strong the cat's lamp is
};
const catLight = new THREE.PointLight('#ffd27a', 0); // warm lamp light
scene.add(catLight);
// Like the mouse light, the lamp light moves on an invisible glass wall
// in front of the head, right where the cat's lamp is on screen.
const lampWall = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.4);
const lampTarget = new THREE.Vector3();
const lampPoint = new THREE.Vector2();

function setNight(on) {
  night.on = on;
  sunLight.intensity = on ? 0.12 : 0.8;            // dim the "sun"
  scene.environmentIntensity = on ? 0.05 : 0.35;   // and the room light
  cat.setNight(on);                                // show the lamp on his board
}

const nightPanel = gui.addFolder('Night mode');
const nightSwitch = nightPanel.add(night, 'on').name('Night (N key)').onChange(setNight);
nightPanel.add(night, 'lamp', 0, 100, 1).name('Cat lamp');

window.addEventListener('keydown', (event) => {
  if (event.key === 'n' || event.key === 'N') nightSwitch.setValue(!night.on);
});

// A button: lil-gui turns a function into a button you can click
gui.add({ reset: () => gui.reset() }, 'reset').name('Reset to start');

// -----------------------------------------------------------------
// 11. THE ANIMATION LOOP (runs about 60 times per second)
// -----------------------------------------------------------------
function animate() {
  const now = performance.now() / 1000; // seconds since the page opened

  // --- The head looks at the mouse (Lesson 3) ---
  // ...unless it's watching its friend the cat: during a jump or a scroll
  // animation, or when the mouse has been still for a few seconds.
  const watchingCat = now < watchCatUntil || cat.isPerforming() || now - lastMouseMove > IDLE_TIME;
  cat.setWatched(watchingCat); // the cat looks back at the head
  if (watchingCat) {
    const face = cat.getFace(); // the cat's face on screen, in pixels
    mousePoint.set(((face.x / window.innerWidth) * 2 - 1) * HOW_FAR,
                   (-(face.y / window.innerHeight) * 2 + 1) * HOW_FAR, 3);
  } else {
    mousePoint.set(mouse.x * HOW_FAR, mouse.y * HOW_FAR, 3);
  }
  lookTarget.lerp(mousePoint, SMOOTHNESS);
  holder.lookAt(lookTarget);

  // --- The light follows the mouse ---
  // Move the glass wall to the distance chosen in the control panel.
  // (The minus sign is just how Three.js describes a wall's position.)
  lightWall.constant = -settings.distance;
  // Shoot the laser through the mouse and see where it hits the glass wall,
  // then glide the light toward that spot.
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(lightWall, lightTarget);
  mouseLight.position.lerp(lightTarget, LIGHT_SMOOTHNESS);

  // --- Night mode: the lamp light follows the cat's board lamp ---
  if (night.on) {
    const lamp = cat.getLamp(); // pixels -> -1..1 numbers, like the mouse
    lampPoint.set((lamp.x / window.innerWidth) * 2 - 1, -(lamp.y / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(lampPoint, camera);
    raycaster.ray.intersectPlane(lampWall, lampTarget);
    catLight.position.lerp(lampTarget, 0.2);
    catLight.intensity = night.lamp * (0.95 + Math.random() * 0.1); // a tiny flicker
  } else {
    catLight.intensity = 0;
  }

  // --- Click reactions ---
  // Start with "no reaction" values...
  let shake = 0;              // extra left/right turn
  let nod = 0;                // extra up/down tilt
  let flash = 0;              // 0 = no flash, 1 = full flash

  // ...then change them if a reaction is playing.
  if (currentReaction !== null) {
    const t = now - reactionStart;     // seconds since the click
    const fade = 1 - t / REACTION_TIME; // 1 right after the click, 0 when finished

    if (fade <= 0) {
      currentReaction = null; // finished
    } else if (currentReaction === 'shake') {
      // Math.sin makes a smooth back-and-forth wave. Fast wave = quick shake.
      shake = Math.sin(t * 35) * 0.25 * fade;
    } else if (currentReaction === 'nod') {
      nod = Math.sin(t * 20) * 0.3 * fade;
    } else if (currentReaction === 'flash') {
      flash = fade;
    }
  }

  holder.rotateY(shake); // add the shake on top of the look-at turn
  holder.rotateX(nod);   // add the nod on top too

  // The flash: letters turn red and brighter, and the mouse light bursts.
  // setRGB(red, green, blue), each from 0 to 1. Taking away green and blue
  // turns white into red; as the flash fades they come back to white.
  material.emissive.setRGB(1, 1 - flash, 1 - flash);
  material.emissiveIntensity = NORMAL_GLOW + flash * 3;
  // Brightness comes from the control panel (times 4 during a flash)
  mouseLight.intensity = settings.brightness * (1 + flash * 3);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// -----------------------------------------------------------------
// 12. HANDLE WINDOW RESIZING
// -----------------------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Note: red "404 (Not Found)" messages for Material_*.png in the browser
// console (F12) are harmless. The .fbx file still remembers its textures'
// old names from Blender; we add the textures ourselves above.

// =================================================================
// TRY THIS!
//   a) Change the starting values in "settings" (for example color: '#20a0ff')
//   b) Allow a brighter light: change the 100 in the Brightness slider to 300
//   c) Add your own slider for the room light:
//        gui.add(scene, 'environmentIntensity', 0, 1, 0.05).name('Room light');
//   d) Longer reactions: REACTION_TIME = 2
//   e) Wilder shake: change 0.25 to 0.6 in the shake line
//   f) Invent your own reaction: add 'spin' to REACTIONS, then add
//        } else if (currentReaction === 'spin') {
//          shake = (1 - fade) * Math.PI * 2;   // one full turn
// =================================================================
