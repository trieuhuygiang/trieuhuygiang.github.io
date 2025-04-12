// Importing OrbitControls (make sure the path matches the version you are using)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.0/examples/jsm/controls/OrbitControls.js';

// Creating the scene
var scene = new THREE.Scene();

// Creating the camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// Creating the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add light.
const directionLight = new THREE.DirectionalLight(0xffffff, 3.0)
directionLight.position.set(0, 0, 10)
scene.add(directionLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // white light at 50% intensity
scene.add(ambientLight)
//****environment
// const envMaploader = new THREE.CubeTextureLoader();
// const environmentMap = envMaploader.load([
//     'textures/Milkyway/right.png', 'textures/Milkyway/left.png',
//     'textures/Milkyway/top.png', 'textures/Milkyway/bottom.png',
//     'textures/Milkyway/front.png', 'textures/Milkyway/back.png'
// ]);
// scene.environment = environmentMap;
// scene.background = environmentMap;
//***************************************** */
// load different color textures
const textureSilver = new THREE.TextureLoader().load('textures/silver.png');
const textureGold = new THREE.TextureLoader().load('textures/intricateGold.png');
const textureUV = new THREE.TextureLoader().load('textures/uv_grid_opengl.jpg');
const texture = new THREE.TextureLoader().load('textures/worldColour.5400x2700.jpg');
const dispTexture = new THREE.TextureLoader().load('textures/earth_bumpmap.jpg');

textureGold.colorSpace = THREE.SRGBColorSpace;
textureUV.colorSpace = THREE.SRGBColorSpace;

const materialSilver = new THREE.MeshStandardMaterial({ map: textureSilver });
const materialGold = new THREE.MeshStandardMaterial({ map: textureGold });
const materialUV = new THREE.MeshStandardMaterial({ map: textureUV });
const materialEarth = new THREE.MeshStandardMaterial({ map: texture, bumpMap: dispTexture, bumpScale: 100 });

// Creating a cube
const boxX = 1, boxY = 1, boxZ = 1;
const boxSegment = 100;
const boxGeometry = new THREE.BoxGeometry(boxX, boxY, boxZ, boxSegment, boxSegment, boxSegment);

// add cube to the scene
const cube = new THREE.Mesh(boxGeometry, materialEarth);
cube.position.set(0, 1, 0);
scene.add(cube);

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); // top radius, bottom radius, height, radial segments
const cylinder = new THREE.Mesh(cylinderGeometry, materialGold);
cylinder.position.set(-1.5, 1, 0);
scene.add(cylinder);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); // radius, widthSegments, heightSegments
const sphere = new THREE.Mesh(sphereGeometry, materialSilver);
sphere.position.set(1.5, 1, 0)
scene.add(sphere);

{
    //const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
    //const torus = new THREE.Mesh(geometry, materialGold);
    //scene.add(torus);
}




// Earth Sphere (planet)
const earthGeometry = new THREE.SphereGeometry(0.75, 64, 64); // more segments for smooth sphere
const earth = new THREE.Mesh(earthGeometry, materialEarth);
earth.position.set(0, -1, 0);
scene.add(earth);
//


const planeGeometry = new THREE.PlaneGeometry(3.6, 1.8, 2, 1);
const plane = new THREE.Mesh(planeGeometry, materialEarth)
plane.position.set(0, -3, 0)
scene.add(plane);




// Adding OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);

// Adjust control settings if needed
controls.minDistance = 1;
controls.maxDistance = 10;
controls.enablePan = true;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    // Rendering the scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
animate();
