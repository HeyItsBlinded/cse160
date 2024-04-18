// WORKS CITED: based on a tutorial by Robot Bobby - 
// https://www.youtube.com/watch?v=XPhAR1YdD6o

import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js";

// ----- WINDOW -----
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// ----- CAMERA -----
const fov = 75;
const aspect = w / h;
const near  = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// ----- SCENE -----
const scene = new THREE.Scene();

// ----- SHAPES -----
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const material = new THREE.MeshBasicMaterial( {color: 0x44aabb} );
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// const geo = new THREE.IcosahedronGeometry(1.0, 2);
// const mat = new THREE.MeshStandardMaterial({
//     color: 0xffffff, 
//     flatShading: true
// });

// const mesh = new THREE.Mesh(geo, mat);
// scene.add(mesh);

// const wireMat = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     wireframe: true
// });

// const wireMesh = new THREE.Mesh(geo, wireMat);
// wireMesh.scale.setScalar(1.001);
// mesh.add(wireMesh);

// ----- LIGHT -----
// const hemiLight = new THREE.HemisphereLight(0x79f14e, 0x80329c);
// scene.add(hemiLight);

// ----- CONTROLS -----
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor= 0.03;

// function animate(t = 0) {
//     requestAnimationFrame(animate);
//     mesh.rotation.y = t* 0.0001;
//     renderer.render(scene, camera);
//     controls.update();
// }

// ----- FUNCTION CALLS -----
// animate();

renderer.render(scene, camera);
console.log('test test testing');