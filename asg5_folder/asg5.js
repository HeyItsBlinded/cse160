// WORKS CITED: 
// 'WINDOW' based on a tutorial by Robot Bobby - 
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
const fov = 115;
const aspect = w / h;   // maintains aspect ratio
const near  = 0.1;
const far = 5;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// ----- SCENE -----
const scene = new THREE.Scene();

// ----- LIGHT -----
// const hemiLight = new THREE.HemisphereLight(0x79f14e, 0x80329c);
// scene.add(hemiLight);
const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

// ----- SHAPES -----
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const material = new THREE.MeshPhongMaterial( {color: 0x44aa88} );
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;
    return cube;
}

const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
]

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

function render(time) {
    time *= 0.001
    cubes.forEach((cube, ndx) => {
        const speed= 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

// ----- FUNCTION CALLS -----
// animate();

// renderer.render(scene, camera);
// requestAnimationFrame(render);
console.log('test test testing');