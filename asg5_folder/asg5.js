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

// VR-Mobil by Vladimir Ilic [CC-BY] via Poly Pizza
// const mtlLoader = new MTLLoader();
// mtlLoader.load('customModels/vespaMAT.mtl', (mtl) => {
//     mtl.preload();
    
//     const objLoader = new OBJLoader();
//     objLoader.setMaterials(mtl);
    
//     objLoader.load('customModels/vespa.obj', (root) => {
//         root.scale.set(0.5, 0.5, 0.5);
//         root.position.set(-1, 0, -0.5);
//         scene.add(root);
//     });
// });

// -- FUNCTIONS ----------
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();