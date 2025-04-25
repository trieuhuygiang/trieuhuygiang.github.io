import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.166.0/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, controls;

let target;
let postScene, postCamera, postMaterial;

init();
animate();

function init() {

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
	camera.position.x = 5;
	camera.position.y = 5;
	camera.position.z = 5;

	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	camera.lookAt(controls.target);

	// Create a render target with depth texture
	setupRenderTarget();
	// Our scene
	setupScene();
	// Setup post-processing step
	setupPost();
	onWindowResize();
	window.addEventListener('resize', onWindowResize);
}

// this is the render target, which is a 2D image that we want to render to
// instead of render 3D geometries directly to the screen, we render the result into
// this target, which is saved as a texture in the memory. This is also usually refered
// as framebuffer in many other context.
function setupRenderTarget() {

	if (target) target.dispose();

	target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
	target.texture.minFilter = THREE.NearestFilter;
	target.texture.magFilter = THREE.NearestFilter;
	target.stencilBuffer = false;
	// Three js support specifying the target as a depth texture, in this case, only
	// the depth information is retained in this texutre, all color information is discarded.
	target.depthTexture = new THREE.DepthTexture();
	target.depthTexture.format = THREE.DepthFormat;
	target.depthTexture.type = THREE.UnsignedIntType;
}

function setupPost() {
	postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

	postMaterial = new THREE.ShaderMaterial({
		vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
		fragmentShader: `
            #include <packing>
            varying vec2 vUv;
            uniform sampler2D tDepth;
            uniform float cameraNear;
            uniform float cameraFar;
            uniform float windowX;
            uniform float windowY;
            uniform float time;

            float readDepth(sampler2D depthSampler, vec2 coord) {
                float fragCoordZ = texture2D(depthSampler, coord).x;
                float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
                return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
            }

            void main() {
                float depth = readDepth(tDepth, vUv); // [0, 1]

                // 1. Basic depth-based brightness
                float brightness = 1.0 - depth; // near = bright, far = dark

                // 2. Add soft pulsing over time
                float pulse = 0.5 + 0.5 * sin(time * 2.0); // slow pulse
                brightness *= (0.8 + 0.2 * pulse); // small breathing effect

                // 3. Apply color only if object is present
                if (depth < 1.0) {
                    vec3 glowColor = vec3(1.0, 0.5, 0.2); // orange glow
                    gl_FragColor = vec4(glowColor * brightness, 1.0);
                } else {
                    // Background remains pure black
                    gl_FragColor = vec4(0.0);
                }
            }
        `,
		uniforms: {
			cameraNear: { value: camera.near },
			cameraFar: { value: camera.far },
			tDepth: { value: null },
			windowX: { value: window.innerWidth },
			windowY: { value: window.innerHeight },
			time: { value: null }
		}
	});

	const postPlane = new THREE.PlaneGeometry(2, 2);
	const postQuad = new THREE.Mesh(postPlane, postMaterial);
	postScene = new THREE.Scene();
	postScene.add(postQuad);
}



function setupScene() {
	scene = new THREE.Scene();
	const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
	const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
	// add a bunch of cubes. // [-3, 3] // [0, 3]
	for (let x = -3; x <= 3; x++)
		for (let y = -3; y <= 3; y++)
			for (let z = -3; z <= 3; z++) {
				const cube = new THREE.Mesh(boxGeometry, material);
				cube.position.set(x, y, z);
				scene.add(cube);
			}
}

function onWindowResize() {

	const aspect = window.innerWidth / window.innerHeight;
	camera.aspect = aspect;
	camera.updateProjectionMatrix();

	const dpr = renderer.getPixelRatio();
	target.setSize(window.innerWidth * dpr, window.innerHeight * dpr);
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

	requestAnimationFrame(animate);

	// render scene into target texture instead of screen.
	renderer.setRenderTarget(target);
	renderer.render(scene, camera);

	// render the texture to the quad
	postMaterial.uniforms.tDepth.value = target.depthTexture;
	postMaterial.uniforms.time.value = performance.now() * 0.001; // in seconds

	// disable the rendering target, since now we are rendering to the screen
	renderer.setRenderTarget(null);
	renderer.render(postScene, postCamera);

	controls.update(); // required because damping is enabled
}