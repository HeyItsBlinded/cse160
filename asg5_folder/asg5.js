import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near  = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor= 0.03;

const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff, 
    flatShading: true
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);
// scene.add(wireMesh);
mesh.add(wireMesh);

const hemiLight = new THREE.HemisphereLight(0x79f14e, 0x80329c);
scene.add(hemiLight);

function animate(t = 0) {
    requestAnimationFrame(animate);
    // mesh.rotation.y = t* 0.0001;
    renderer.render(scene, camera);
    controls.update();
}
animate();

// console.log('test test testing');

// import * as THREE from 'three';

// function main() {
//     const canvas = document.querySelector('#c');
//     const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

//     const fov = 75;
//     const aspect = 2; // canvas default
//     const near = 0.1;
//     const far = 5;
//     const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

//     camera.position.z = 2;

//     const scene = new THREE.Scene();

//     const boxWidth = 1;
//     const boxHeight = 1;
//     const boxDepth = 1;
//     const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

//     const material = new THREE.MeshPhongMaterial({color: 0x44aa88});

//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     renderer.render(scene, camera);

//     function render(time) {
//         time *= 0.001;  // convert time to seconds

//         cube.rotation.x = time;
//         cube.rotation.y = time;

//         renderer.render(scene, camera);
//         requestAnimationFrame(render);
//     }
//     requestAnimationFrame(render);

//     const color = 0xFFFFFF;
//     const intensity = 3;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(-1, 2, 4);
//     scene.add(light);
// }

// main();
// console.log('test test testing');