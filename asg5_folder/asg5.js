import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// -- SET ----------
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// -- LIGHTS ----------
const lightAMB = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(lightAMB);

// const lightDIR = new THREE.DirectionalLight(0xff0000, 0.5); // red lightframe
// lightDIR.position.set(0, 2, 0);
// const lightHelper = new THREE.DirectionalLightHelper(lightDIR, 3);
// scene.add(lightDIR, lightHelper);

const lightPOINT = new THREE.PointLight(0xffffff, 5, 8, 1); // (color, intensity, distance, decay)
lightPOINT.position.set(2, 2, 2);
const lightHelper2 = new THREE.PointLightHelper(lightPOINT, 0.5);
scene.add(lightPOINT, lightHelper2);

// -- CAMERA ----------
const camera = new THREE.PerspectiveCamera(76, window.innerWidth / window.innerHeight, 0.1, 1000);
// ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// -- SKYBOX ---------- 
// cite: Sonar Systems on YT
var skyboxGEO = new THREE.BoxGeometry(100, 100, 100);
var skyboxARRAY = [
    new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load('textures/arid_ft.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load('textures/arid_bk.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load('textures/arid_up.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load('textures/arid_dn.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load('textures/arid_rt.jpg'), side: THREE.DoubleSide} ),
    new THREE.MeshPhongMaterial( {map: new THREE.TextureLoader().load('textures/arid_lf.jpg'), side: THREE.DoubleSide} )
];
// var skyboxMAT = new THREE.MeshFaceMaterial( {skyboxARRAY} ); // !depreciated version!
var skybox = new THREE.Mesh(skyboxGEO, skyboxARRAY);
scene.add(skybox);

// -- PROPS ----------
const cubeGEO = new THREE.BoxGeometry(1, 1, 1);
const cubeMAT = new THREE.MeshPhongMaterial( {color: 0x9e42f5} );
const cube = new THREE.Mesh(cubeGEO, cubeMAT);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();