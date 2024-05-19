import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { OBJLoader } from 'three/examples/jsm/Addons.js';
import { MTLLoader } from 'three/examples/jsm/Addons.js';

// -- SET ----------
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// -- LIGHTS ----------
const lightAMB = new THREE.AmbientLight(0xffffff, 0.5); // default
scene.add(lightAMB);

const lightDIR = new THREE.DirectionalLight(0xffffff, 0.5); // overhead
lightDIR.position.set(0, 12, 0);
const lightHelper = new THREE.DirectionalLightHelper(lightDIR, 6, 0xff0000); 
scene.add(lightDIR, lightHelper);

const lightPOINT = new THREE.PointLight(0xffffff, 5, 8, 1);
lightPOINT.position.set(0, 8, 0);
const lightHelper2 = new THREE.PointLightHelper(lightPOINT, 0.5);
scene.add(lightPOINT, lightHelper2);

// -- CAMERA ----------
const camera = new THREE.PerspectiveCamera(76, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 10;
camera.position.z = 15;
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

// -- GROUND ----------
const cubeGEO = new THREE.BoxGeometry(20, 0.25, 20);
const cubeMAT = new THREE.MeshPhongMaterial( {color: 0xa3a3a3} );
const cube = new THREE.Mesh(cubeGEO, cubeMAT);
scene.add(cube);

// -- 20 PRIMITIVES ----------
const dice1GEO = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const dice1MAT = new THREE.MeshPhongMaterial( {color: 0xff1122} );
const dice1 = new THREE.Mesh(dice1GEO, dice1MAT);
scene.add(dice1);
dice1.position.set(1.4, 4.08, 1);

const dice2GEO = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const dice2MAT = new THREE.MeshPhongMaterial( {color: 0x25BEA6} );
const dice2 = new THREE.Mesh(dice2GEO, dice2MAT);
scene.add(dice2);
dice2.position.set(1.4, 4.08, 0);

const dice3GEO = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const dice3MAT = new THREE.MeshPhongMaterial( {color: 0x79A450} );
const dice3 = new THREE.Mesh(dice3GEO, dice3MAT);
scene.add(dice3);
dice3.position.set(0, 4.08, 0);

const dice4GEO = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const dice4MAT = new THREE.MeshPhongMaterial( {color: 0xE1A4F3} );
const dice4 = new THREE.Mesh(dice4GEO, dice4MAT);
scene.add(dice4);
dice4.position.set(-0.5, 4.08, 1);

const dice5GEO = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const dice5MAT = new THREE.MeshPhongMaterial( {color: 0xECA617} );
const dice5 = new THREE.Mesh(dice5GEO, dice5MAT);
scene.add(dice5);
dice5.position.set(-2, 4.08, 1);

// D12s -----
const dice6GEO = new THREE.DodecahedronGeometry(0.2);
const dice6MAT = new THREE.MeshPhongMaterial( {color: 0xff1122} );
const dice6 = new THREE.Mesh(dice6GEO, dice6MAT);
scene.add(dice6);
dice6.position.set(-4, 4.08, 2);

const dice7GEO = new THREE.DodecahedronGeometry(0.2);
const dice7MAT = new THREE.MeshPhongMaterial( {color: 0x25BEA6} );
const dice7 = new THREE.Mesh(dice7GEO, dice7MAT);
scene.add(dice7);
dice7.position.set(-3, 4.08, 4);

const dice8GEO = new THREE.DodecahedronGeometry(0.2);
const dice8MAT = new THREE.MeshPhongMaterial( {color: 0x79A450} );
const dice8 = new THREE.Mesh(dice8GEO, dice8MAT);
scene.add(dice8);
dice8.position.set(0, 4.08, -2);

const dice9GEO = new THREE.DodecahedronGeometry(0.2);
const dice9MAT = new THREE.MeshPhongMaterial( {color: 0xE1A4F3} );
const dice9 = new THREE.Mesh(dice9GEO, dice9MAT);
scene.add(dice9);
dice9.position.set(1, 4.08, -2);

const dice10GEO = new THREE.DodecahedronGeometry(0.2);
const dice10MAT = new THREE.MeshPhongMaterial( {color: 0xECA617} );
const dice10 = new THREE.Mesh(dice10GEO, dice10MAT);
scene.add(dice10);
dice10.position.set(3, 4.08, -4);

// ----- (BLENDER) OBJS -----
const objLoader = new OBJLoader();
objLoader.load('customModels/table.obj', (root) => {
    root.scale.set(0.75,0.5,0.5);
    root.rotation.set(THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(45));
    root.position.set(0, 0.1, 0);

    const material = new THREE.MeshPhongMaterial({ color: 0x5e3a0a }); // Custom color material
    root.traverse((child) => {
        if (child.isMesh) {
            child.material = material;
        }
    });
    scene.add(root);
});

// -- FUNCTIONS ----------
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();