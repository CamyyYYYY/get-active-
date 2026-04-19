import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const loader = new THREE.TextureLoader();
const base = import.meta.env.BASE_URL;

// scene, camera, renderer
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
camera.position.setZ(30);

// torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const sandTexture = loader.load(`${base}sand.jpg`);
const material = new THREE.MeshStandardMaterial({ map: sandTexture });

const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 60;
controls.minDistance = 10;

// stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starTexture = loader.load(`${base}lightning.png`);
  const material = new THREE.MeshStandardMaterial({ map: starTexture });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// background
const grassTexture = loader.load(`${base}grass.jpeg`);
scene.background = grassTexture;

// cube (you)
const meTexture = loader.load(`${base}me.jpg`);
const me = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({ map: meTexture })
);
scene.add(me);

// moon
const moonTexture = loader.load(`${base}moon.png`);
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);
scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

// scroll movement
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.x = t * 0.01;
  camera.position.y = t * 0.002;
  camera.position.z = t * 0.002;
}

document.body.onscroll = moveCamera;

// animation loop
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

// resize handling (IMPORTANT)
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});
