/* 
CITATIONS
SPOTLIGHT SOLUTIONS - Michelle Wan
*/

// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;

  uniform int u_whichTexture;
  uniform vec4 u_lightColor;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  uniform bool u_lightSpotOn;
  uniform vec3 u_lightDirection;
  uniform float u_limit;
  void main() {


    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    } else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;         
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0); 
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);  
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); 
    } else {
      gl_FragColor = vec4(1, .2, .2, 1);
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r=length(lightVector);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N, L), 0.0);

    vec3 R = reflect(-L, N);

    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    float specular = pow(max(dot(E,R), 0.0), 20.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    if (u_lightOn) {
        gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
        gl_FragColor *= u_lightColor;

        if (u_lightSpotOn){
          vec3 spotDirection = normalize(u_lightDirection);
          float spot = dot(L, spotDirection);

          if (spot > u_limit) {
            float spotF = smoothstep(u_limit, 1.0, spot);
            gl_FragColor *= spotF;
          }
          else{
            gl_FragColor *= 0.9;
          }
        }
    }
  }`


// GLOBAL VARS
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_NormalMatrix;
let u_GlobalRotateMatrix;

let u_Sampler0;
let u_Sampler1;

let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_lightColor;
let u_lightSpotOn;
let u_lightDirection;
let u_limit;

// CONSTS
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle = 0;
let g_normalOn = false;
let g_lightPos = [0, 1, 1];
let g_lightOn = true;
let g_lightSpotOn  = true;
let g_lightDirection = [0.0, 1.0, 0.0];
let g_limit = Math.cos(Math.PI/6);

let g_transition = 0;

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsUI();
  document.onkeydown = keydown;
  // initTextures();
  
  canvas.onmousedown = function(ev) {
  canvas.onmousemove = function(ev) {click(ev)};
  }

  gl.clearColor(0.6, 0.8, 1, 1);
  //renderAllShapes();
  requestAnimationFrame(tick);
}

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }


  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log('Failed to intialize shaders.');
  return;
}

a_Position = gl.getAttribLocation(gl.program, 'a_Position');
if (a_Position < 0) {
  console.log('Failed to get the storage location of a_Position');
  return;
}

a_UV = gl.getAttribLocation(gl.program, 'a_UV');
if (a_UV < 0){
  console.log('Failed to get the storage location of a_UV');
  return;
}

a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
if (a_Normal < 0){
  console.log('Failed to get the storage location of a_Normal');
  return;
}

u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
if (!u_FragColor) {
  console.log('Failed to get the storage location of u_FragColor');
  return;
}

u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
if (!u_lightPos) {
  console.log('Failed to get the storage location of u_lightPos');
  return;
}

u_lightSpotOn = gl.getUniformLocation(gl.program, 'u_lightSpotOn');
if (!u_lightSpotOn) {
  console.log('Failed to get the storage location of u_lightSpotOn');
  return;
}

u_lightDirection = gl.getUniformLocation(gl.program, 'u_lightDirection');
if (!u_lightDirection) {
  console.log('Failed to get the storage location of u_lightDirection');
  return;
}

u_limit = gl.getUniformLocation(gl.program, 'u_limit');
if (!u_limit) {
  console.log('Failed to get the storage location of u_lightPos');
  return;
}

u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
if (!u_lightColor) {
  console.log('Failed to get the storage location of u_lightColor');
  return;
}

u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
if (!u_cameraPos) {
  console.log('Failed to get the storage location of u_cameraPos');
  return;
}

u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
if (!u_lightOn) {
  console.log('Failed to get the storage location of u_lightOn');
  return;
}

u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
if (!u_ModelMatrix) {
  console.log('Failed to get the storage location of u_ModelMatrix');
  return;
}

u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
if (!u_NormalMatrix) {
  console.log('Failed to get the storage location of u_NormalMatrix');
  return;
}

u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
if (!u_GlobalRotateMatrix) {
  console.log('Failed to get the storage location of u_GlobalRotateMatrix');
  return;
}

u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
if (!u_Sampler0) {
  console.log('Failed to get the storage location of u_Sampler0');
  return;
}

u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
if (!u_Sampler1) {
  console.log('Failed to get the storage location of u_Sampler1');
  return;
}

u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
if (!u_whichTexture) {
  console.log('Failed to get the storage location of u_whichTexture');
  return;
}

u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
if (!u_ViewMatrix){
  console.log('Failed to get the storage location of u_ViewMatrix');
  return;
}

u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
if (!u_ProjectionMatrix) {
  console.log('Failed to get the storage location of u_ProjectionMatrix');
  return;
}

// set initial value for this matrix to identity
var identityM = new Matrix4();
gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function addActionsUI(){
  // NORMAL ON OFF BUTTONS
  document.getElementById('normalOn').onclick = function() {g_normalOn = true;};
  document.getElementById('normalOff').onclick = function() {g_normalOn = false;};

  // LIGHT ON OFF BUTTONS
  document.getElementById('lightOn').onclick = function() {g_lightOn = true;};
  document.getElementById('lightOff').onclick = function() {g_lightOn = false;};

  // SPOTLIGHT ON OFF BUTTONS
  document.getElementById('spotLightOn').onclick = function() {g_lightSpotOn = true;};
  document.getElementById('spotLightOff').onclick = function() {g_lightSpotOn = false;};

  // LIGHT POSITION SLIDERS
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) {if (ev.buttons==1) {g_lightPos[0] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) {if (ev.buttons==1) {g_lightPos[1] = this.value/100; renderAllShapes();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) {if (ev.buttons==1) {g_lightPos[2] = this.value/100; renderAllShapes();}});

  // LIGHT COLOR SLIDERS
  document.getElementById('redSlide').addEventListener('mousemove', function() {g_selectedColor[0] = this.value/100; renderAllShapes();});
  document.getElementById('greenSlide').addEventListener('mousemove', function() {g_selectedColor[1] = this.value/100; renderAllShapes();});
  document.getElementById('blueSlide').addEventListener('mousemove', function() {g_selectedColor[2] = this.value/100; renderAllShapes();});

  
  document.getElementById('angleSlideX').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

}

// function click(ev) {
//     let [x, y] = convertCoordinatesEventToGL(ev);
    // create and store new point
    // let point;
    // if (g_selectedType == POINT) {
    //     point = new Point();
    // } else if (g_selectedType == TRIANGLE) {
    //     point = new Triangle();
    // } else  if (g_selectedType == CIRCLE) {
    //     point = new Circle();
    //     point.segments = g_selectedSegment;
    // }
    // point.position = [x,y];
    // point.color = g_selectedColor.slice();
    // point.size = g_selectedSize;
    // g_shapesList.push(point);
    // draw all shapes in/on the canvas
//     renderAllShapes();
// }

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  //var x = ev.movementX;
  //var y = ev.movementY;
  var rect = ev.target.getBoundingClientRect();
 

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick() {
  g_seconds = performance.now()/1000-g_startTime;
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {

  g_lightPos[0] = 2 * Math.cos(g_seconds);
  document.getElementById('lightSlideX').value = g_lightPos[0] * 100;


  g_transition = Math.sin(0.05 * g_seconds);  
}

// LGTM
function keydown(ev) {
  if (ev.keyCode == 68) {
    g_camera.right();
  }
  else if (ev.keyCode == 65) { 
    g_camera.left();
  }
  else if (ev.keyCode == 87) {
    g_camera.forward();
  }
  else if (ev.keyCode == 83) {
    g_camera.back();
  }
  else if (ev.keyCode == 81) {
    g_globalAngle -= 1;
  }
  else if (ev.keyCode == 69) {
    g_globalAngle += 1;
  }

  renderAllShapes();
  console.log(ev.keyCode);
}

var g_camera = new Camera();

function renderAllShapes(){

  // pass the proj matrix
  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // pass matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // prevents flicker and disappearing shapes with DEPTH_TEST - solved with chatGPT
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // SPOTLIGHT SOLUTIONS - Michelle Wan
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
  gl.uniform1i(u_lightOn, g_lightOn);
  gl.uniform4f(u_lightColor, g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], 1.0);

  gl.uniform1i(u_lightSpotOn, g_lightSpotOn);
  gl.uniform3fv(u_lightDirection, g_lightDirection);
  gl.uniform1f(u_limit, g_limit);

  // ----- LIGHT ---------------
  var light = new Cube();
  light.color = g_selectedColor;
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.1, -0.1, -0.1);
  light.matrix.translate(-0.5, -0.5, -0.5);
  light.render();

  // ----- SPOTLIGHT ---------------
  // var spotlight = new Cube();
  // spotlight.color = [1, 1, 0, 1];
  // spotlight.matrix.scale(0.1, 0.1, 0.1);
  // spotlight.matrix.translate(-3, 15, -0.5);
  // spotlight.render();

  // ----- ENVIRON ---------------
  // SKY
  var sky = new Cube();
  sky.color = [0, 0, 0.5, 1];
  sky.textureNum = -2;
  if (g_normalOn) sky.textureNum = -3;
  sky.matrix.scale(-5, -5, -5);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  // GROUND
  var floor = new Cube();
  floor.color = [1, 1, 1, 1];
  floor.textureNum = -2;
  floor.matrix.translate(0, -0.75, 0);
  floor.matrix.scale(5, 0.01, 5);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  // BALL
  var ball = new Sphere();
  ball.color = [0, 0.5, 0.5, 1];
  if (g_normalOn) ball.textureNum = -3;
  ball.matrix.translate(1, -0.2, 0);
  ball.matrix.scale(0.5, 0.5, 0.5);
  ball.matrix.rotate(45, 0, 1, 0);
  ball.render();

  // CUBES
  var cube1 = new Cube();
  cube1.color = [0.5, 0, 0.5, 1];
  if (g_normalOn) cube1.textureNum = -3;
  cube1.matrix.scale(0.5, 0.5, 0.5);
  cube1.matrix.translate(-2, -1, -2);
  cube1.render();

  var cube2 = new Cube();
  cube2.color = [0.5, 0, 0, 1];
  if (g_normalOn) cube2.textureNum = -3;
  cube2.matrix.scale(0.5, 0.5, 0.5);
  cube2.matrix.translate(-2.25, -0, -2);
  cube2.matrix.rotate(45, 0, 1, 0);
  cube2.render();
}