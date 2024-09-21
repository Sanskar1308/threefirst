import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// // Helper for ambient light (note: AmbientLight doesn't have a helper)
// // We can create a custom helper to visualize its presence
// // const ambientLightHelper = new THREE.PointLightHelper(
// //   new THREE.PointLight(ambientLight.color, ambientLight.intensity),
// //   0.5
// // );
// // ambientLightHelper.position.set(0, 0, 0);
// // scene.add(ambientLightHelper);

// // Add a high-intensity directional light
// const highIntensityLight = new THREE.DirectionalLight(0xffffff, 2);
// highIntensityLight.position.set(10, 10, 10);
// scene.add(highIntensityLight);

// // Add studio lighting

// // Key light
// const keyLight = new THREE.DirectionalLight(0xffffff, 1);
// keyLight.position.set(5, 5, 5);
// scene.add(keyLight);

// // Fill light
// const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
// fillLight.position.set(-5, 5, 5);
// scene.add(fillLight);

// // Back light
// const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
// backLight.position.set(0, 5, -5);
// scene.add(backLight);

// // Ambient light for overall illumination
// // const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
// // scene.add(ambientLight);

// // Create light helpers for all lights

// // Helper for high-intensity directional light
// const highIntensityLightHelper = new THREE.DirectionalLightHelper(
//   highIntensityLight,
//   1
// );
// scene.add(highIntensityLightHelper);

// // Helper for key light
// const keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 1);
// scene.add(keyLightHelper);

// // Helper for fill light
// const fillLightHelper = new THREE.DirectionalLightHelper(fillLight, 1);
// scene.add(fillLightHelper);

// // Helper for back light
// const backLightHelper = new THREE.DirectionalLightHelper(backLight, 1);
// scene.add(backLightHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight
);
scene.add(directionalLightHelper);

let pointLight = new THREE.PointLight(0xffffff, 1, 10, 2);
pointLight.position.set(0.3, -1.5, 1);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const loader = new THREE.TextureLoader();

const colour = loader.load("text/colour.jpg");
const normal = loader.load("text/normal.png");
const height = loader.load("text/height.png");
const roughness = loader.load("text/roughness.jpg");

const geometry = new THREE.BoxGeometry(3, 1, 2);

const material = new THREE.MeshStandardMaterial({
  map: colour,
  //   wireframe: true,
  //   roughness: 0.8,
  //   metalness: 0.3,
  //   reflectivity: 0.5,
  normalMap: normal,
  roughnessMap: roughness,
  heightMap: height,
});
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 5;

const canvas = document.querySelector("#draw");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Import GUI if not already imported

// Create GUI
const gui = new GUI();

// Lights folder
const lightsFolder = gui.addFolder("Lights");

// Directional Light controls
const directionalLightFolder = lightsFolder.addFolder("Directional Light");
directionalLightFolder.add(directionalLight, "intensity", 0, 2, 0.01);
directionalLightFolder.add(directionalLight.position, "x", -5, 5, 0.1);
directionalLightFolder.add(directionalLight.position, "y", -5, 5, 0.1);
directionalLightFolder.add(directionalLight.position, "z", -5, 5, 0.1);

// Point Light controls
const pointLightFolder = lightsFolder.addFolder("Point Light");
pointLightFolder.add(pointLight, "intensity", 0, 2, 0.01);
pointLightFolder.add(pointLight.position, "x", -5, 5, 0.1);
pointLightFolder.add(pointLight.position, "y", -5, 5, 0.1);
pointLightFolder.add(pointLight.position, "z", -5, 5, 0.1);
pointLightFolder.add(pointLight, "distance", 0, 20, 0.1);
pointLightFolder.add(pointLight, "decay", 0, 2, 0.1);

// Helper visibility toggles
lightsFolder
  .add(directionalLightHelper, "visible")
  .name("Directional Light Helper");
lightsFolder.add(pointLightHelper, "visible").name("Point Light Helper");

// Material folder
const materialFolder = gui.addFolder("Material");

materialFolder.add(material, "wireframe");
materialFolder.add(material, "roughness", 0, 1, 0.01);
materialFolder.add(material, "metalness", 0, 1, 0.01);
materialFolder.add(material, "reflectivity", 0, 1, 0.01);

// Enable/disable maps
const mapFolder = gui.addFolder("Maps");

mapFolder
  .add(material, "map", {
    None: null,
    Colour: colour,
  })
  .onChange((value) => (material.map = value));

mapFolder
  .add(material, "normalMap", {
    None: null,
    Normal: normal,
  })
  .onChange((value) => (material.normalMap = value));

mapFolder
  .add(material, "roughnessMap", {
    None: null,
    Roughness: roughness,
  })
  .onChange((value) => (material.roughnessMap = value));

// Note: Three.js uses 'displacementMap' instead of 'heightMap'
mapFolder
  .add(material, "displacementMap", {
    None: null,
    Height: height,
  })
  .onChange((value) => (material.displacementMap = value));

// Add displacement scale control if using displacement map
materialFolder.add(material, "displacementScale", 0, 1, 0.01);

// Mesh settings
const meshFolder = gui.addFolder("Mesh");

meshFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
meshFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
meshFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);

meshFolder.add(cube.position, "x", -5, 5, 0.1);
meshFolder.add(cube.position, "y", -5, 5, 0.1);
meshFolder.add(cube.position, "z", -5, 5, 0.1);

meshFolder.add(cube.scale, "x", 0.1, 2, 0.1);
meshFolder.add(cube.scale, "y", 0.1, 2, 0.1);
meshFolder.add(cube.scale, "z", 0.1, 2, 0.1);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.autoRotate = true;
// controls.enableZoom = true;
controls.dampingFactor = 0.01;

function animate() {
  window.requestAnimationFrame(animate);
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}
animate();
