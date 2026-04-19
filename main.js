import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js?module';

const loader = new THREE.TextureLoader();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(0, 0, 30);

// 🌐 TORUS
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const sandTexture = loader.load('sand.jpg');
const material = new THREE.MeshStandardMaterial({ map: sandTexture });

const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// 💡 LIGHTING
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// 🎮 CONTROLS (LEFT CLICK ONLY)
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;

// disable everything except rotate
controls.enableZoom = false;
controls.enablePan = false;

// 🔥 ONLY LEFT CLICK WORKS
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: null,
  RIGHT: null
};

// ⭐ STARS
function addStar() {
  const starGeo = new THREE.SphereGeometry(0.25, 24, 24);
  const starTexture = loader.load('lightning.png');
  const starMat = new THREE.MeshStandardMaterial({ map: starTexture });

  const star = new THREE.Mesh(starGeo, starMat);

  const [x, y, z] = Array(3).fill().map(() =>
    THREE.MathUtils.randFloatSpread(100)
  );

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// 🌄 BACKGROUND
const grassTexture = loader.load('grass.jpeg');
scene.background = grassTexture;

// 🧊 YOU CUBE
const meTexture = loader.load('me.jpg');
const me = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({ map: meTexture })
);

scene.add(me);

// 🌙 MOON
const moonTexture = loader.load('moon.png');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

// 🎬 ANIMATION
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.z += 0.01;

  me.rotation.y += 0.001;
  me.rotation.z += 0.001;

  moon.rotation.x += 0.005;
  moon.rotation.y += 0.005;
  moon.rotation.z += 0.005;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// 📱 RESIZE HANDLING
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});
