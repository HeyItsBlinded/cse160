// WORKS CITED: 
// 'WINDOW' based on a tutorial by Robot Bobby - 
// https://www.youtube.com/watch?v=XPhAR1YdD6o

import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js";
import { OBJLoader } from 'three/OBJLoader';
import { MTLLoader } from 'three/MTLLoader';

// ----- WINDOW -----
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// ----- CAMERA -----
const fov = 75;
const aspect = w / h;   // maintains aspect ratio
const near  = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// ----- SCENE -----
const scene = new THREE.Scene();

// ----- LIGHT -----
// const hemiLight = new THREE.HemisphereLight(0x79f14e, 0x80329c);
// scene.add(hemiLight);
const color = 0xFFFFFF;
const intensity = 2.5;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

// ----- (BLENDER) OBJS -----
// VR-Mobil by Vladimir Ilic [CC-BY] via Poly Pizza
const mtlLoader = new MTLLoader();
mtlLoader.load('materials.mtl', (mtl) => {
    mtl.preload();
    
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    
    objLoader.load('model.obj', (root) => {
        root.scale.set(0.5, 0.5, 0.5);
        root.position.set(-1, 0, -0.5);
        scene.add(root);
    });
});

// {
//     const mtlLoader = new MTLLoader();
//     mtlLoader.load('saber copy.mtl', (mtl) => {
//         mtl.preload();
//         const objLoader = new OBJLoader();
//         mtl.materials.Material.side = THREE.DoubleSide;
//         objLoader.setMaterials(mtl);
//         objLoader.load('saber copy.obj', (root) => {
//             scene.add(root);
//         });
//     });
// }

// ----- SHAPES -----
// const boxWidth = 1;
// const boxHeight = 1;
// const boxDepth = 1;
// const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
// const material = new THREE.MeshBasicMaterial( {map: texture} );
// const cube = new THREE.Mesh(geometry, material);

const cylinderRadius = 0.5;
const cylinderHeight = 1;
const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);
const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x8844aa });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
scene.add(cylinder);
cylinder.position.x = 2;
const angle = Math.PI / 4;
cylinder.rotation.x = angle;

const isoRadius = 0.45;
const isoGeometry = new THREE.IcosahedronGeometry(isoRadius);
const isoMaterial = new THREE.MeshPhongMaterial({ color: 0x0044ff });
const icosahedron = new THREE.Mesh(isoGeometry, isoMaterial);
scene.add(icosahedron);
icosahedron.position.x = -2;
const isoAngle = Math.PI / 4;
icosahedron.rotation.x = isoAngle;

const textureLoader = new THREE.TextureLoader();
const slabTexture = textureLoader.load('wall.jpg');
const slabWidth = 0.5;
const slabHeight = 1.0;
const slabDepth = 0.25;
const slabGeometry = new THREE.BoxGeometry(slabWidth, slabHeight, slabDepth);
const slabMaterial = new THREE.MeshPhongMaterial({ map: slabTexture });
const slab = new THREE.Mesh(slabGeometry, slabMaterial);
scene.add(slab);

// ----- CONTROLS -----
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor= 0.03;

function animateSlab() {
    const rotSpeed = 0.002;
    const rotAngle = rotSpeed * Date.now(); // Date.now() suggested by chatGPT
    slab.rotation.y = rotAngle;

    renderer.render(scene, camera);
    requestAnimationFrame(animateSlab);
}

// ----- FUNCTION CALLS -----
// animate();

animateSlab();
console.log('test test testing');