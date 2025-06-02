# WebGL and Three.js Interactive Graphics Examples

This project is a collection of interactive 2D and 3D graphics examples implemented using raw WebGL and the Three.js library. Each `classXX` directory or file set demonstrates different concepts, from basic shape rendering to complex particle systems and model loading.

## Project Overview

This repository serves as a hands-on guide and demonstration of various computer graphics techniques. It starts with fundamental WebGL concepts like shaders and buffers, then progresses to leveraging the Three.js library for more advanced scenes, including 3D objects, textures, lighting, user controls, model imports, and dynamic particle simulations.

## Demonstrations

Each `classXX` set of files showcases specific features:

### Class 01: Basic WebGL Triangle (`class01.html`, `class01_completed.js`)

* **Raw WebGL Implementation**: Does not use the Three.js library.
* **Vertex and Fragment Shaders**: Custom GLSL shaders are defined for rendering.
* **Geometry**: Renders two triangles with vertices defined in a `Float32Array`.
* **Animation**:
    * Triangles animate with rotation and translation controlled by a `uTimeVert` uniform in the vertex shader.
    * Colors change dynamically in the fragment shader based on `uTimeFrag` and pixel coordinates (`gl_FragCoord`).
* **Uniforms**: Uses uniforms (`uTimeVert`, `uTimeFrag`, `screenSize`) to pass data from JavaScript to shaders.

### Class 02: Three.js Scene Basics (`class02.html`, `class02_0_completed.js`)

* **Introduction to Three.js**: Sets up a basic Three.js scene, camera (PerspectiveCamera), and WebGL renderer.
* **Geometries**:
    * Creates a `THREE.BoxGeometry` (cube).
    * Creates a `THREE.ConeGeometry` (pyramid).
* **Materials**:
    * Uses `THREE.MeshBasicMaterial` for the main objects.
    * Uses `THREE.LineBasicMaterial` with `THREE.EdgesGeometry` to display wireframe edges.
* **Object Grouping**: Demonstrates `THREE.Group` to manage multiple objects (cube, pyramid, and their edges) as a single unit.
* **Animation**: The entire group rotates, showcasing hierarchical transformations.

### Class 04: Three.js Textures, Lighting, and Controls (`class04.html`, `class04.js`)

* **Camera Controls**: Implements `OrbitControls` for interactive camera manipulation (zoom, pan, rotate).
* **Lighting**:
    * `THREE.DirectionalLight` for directional illumination.
    * `THREE.AmbientLight` for overall scene lighting.
* **Environment Mapping**:
    * Uses `THREE.CubeTextureLoader` to load a Milky Way cubemap for the scene's background and environment reflections.
* **Texturing**:
    * Loads various image textures (`.png`, `.jpg`) using `THREE.TextureLoader`.
    * Applies textures to `THREE.MeshStandardMaterial` for different objects (silver, gold, UV grid, Earth, Mars).
    * Demonstrates `bumpMap` and `bumpScale` for the Earth sphere to simulate surface displacement.
* **Geometries**: Creates and positions `BoxGeometry`, `CylinderGeometry`, `SphereGeometry`, and `PlaneGeometry`.
* **Animation**: Objects (cube, cylinder, sphere, Earth) have individual rotation animations.
* **Responsive Design**: Includes a window resize listener to adjust camera aspect ratio and renderer size.

### Class 05: Three.js Model Loading and Materials (`class05_1.html`, `class05_1.js`)

* **OBJ Model Loading**: Uses `OBJLoader` to import a 3D model (`pyramid.obj`).
* **Model Processing**:
    * Calculates the bounding box of the loaded model to center it and scale it to a unit size.
* **Advanced Materials**:
    * Demonstrates various `THREE.MeshStandardMaterial` and `THREE.MeshPhysicalMaterial` configurations:
        * Metallic material (e.g., gold).
        * Matte material.
        * Glass-like material using `transmission` and `refractionRatio`.
        * Clay material.
    * Applies a selected material (e.g., clayMaterial) to the loaded model.
* **Lighting and Environment**:
    * Includes `AmbientLight` and `DirectionalLight`.
    * Uses a `CubeTextureLoader` to load a bridge cubemap for scene background and environment reflections.
* **Camera and Controls**: Uses `PerspectiveCamera` and `OrbitControls`.
* **Rendering**: Renders the scene once after model loading and on control changes, not in a continuous loop unless controls are active.

### Class 07: Three.js Particle Systems (`class07_0.html`, `class07_0.js`)

* **Particle System Implementation**: Creates a custom `particleSystem` class to manage a large number of particles (100,000).
* **Particle Rendering**:
    * Uses `THREE.Points` with `THREE.PointsMaterial`.
    * Applies a sprite texture (`disc.png`) to particles.
    * Uses `BufferGeometry` to efficiently store particle positions and colors.
    * Implements vertex colors for individual particle coloring.
    * Uses `AdditiveBlending` for a glowing effect.
* **Dynamic Behaviors (selectable via `example` variable)**:
    * **Brownian Motion (`brownian`)**: Particles move randomly; color changes based on distance from the origin using a `blackBodyColor` function.
    * **Gravity Fall (`gravity`)**: Particles are emitted, fall under simulated gravity, and bounce off a defined plane; color changes based on velocity.
    * **Planetary Attraction (`planetary`)**: Particles are attracted towards a central sphere (simulating gravity) and orbit it; color changes based on particle speed, normalized across the speed range.
* **Interaction**:
    * `OrbitControls` for scene navigation.
    * Pause functionality: Pressing the 'p' key pauses/resumes the particle simulation.
* **Lighting**: Basic `DirectionalLight` and `AmbientLight` are present.

## How to Run

1.  **Clone the repository or download the files.**
2.  **Ensure you have a local web server.** Due to browser security restrictions (CORS policy) for loading external files like textures, models, and ES modules (`import` statements), you generally cannot run these examples by simply opening the `.html` files directly from your local file system (`file:///...`).
    * You can use simple servers like Python's `http.server` (run `python -m http.server` in the project directory), Node.js `http-server` (`npx http-server`), or an extension in your code editor (e.g., Live Server for VS Code).
3.  **Navigate to the project directory in your web server.**
4.  **Open the desired `classXX.html` file in your web browser** (e.g., `http://localhost:8000/class01.html`).

**Prerequisites:**
* A modern web browser with WebGL support (e.g., Chrome, Firefox, Edge, Safari).


## Technologies Used

* **HTML5**
* **JavaScript (ES6+)**: Including ES Modules for some examples.
* **WebGL API**: Directly used in Class 01.
* **Three.js Library (r128, 0.166.0)**: A 3D graphics library used in Classes 02, 04, 05, and 07.
* **GLSL (OpenGL Shading Language)**: Used for writing vertex and fragment shaders in Class 01.
