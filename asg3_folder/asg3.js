// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        // gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform int u_whichTexture;
    void main() {
        if (u_whichTexture == -2) {
            gl_FragColor = u_FragColor;
        } else if (u_whichTexture == -1) {
            gl_FragColor = vec4(v_UV, 1.0, 1.0);
        } else if (u_whichTexture == 0) {
            gl_FragColor = texture2D(u_Sampler0, v_UV);
        } else if (u_whichTexture == 1) {
            gl_FragColor = texture2D(u_Sampler1, v_UV);
        } else if (u_whichTexture == 2) {
            gl_FragColor = texture2D(u_Sampler2, v_UV);
        } else {
            gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
        }
    }`

// global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// global vars for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegment = 5;
let g_globalAngle = 0;
let g_yellowAngle = 0;  // ADDED IN 2.6
let g_magentaAngle = 0; // ADDED IN 2.7
let g_yellowAnimation = false;
let g_magentaAnimation = false;
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsUI();
    document.onkeydown = keydown;   // ADDED 3.7
    initTextures();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // renderAllShapes();
    requestAnimationFrame(tick);
}

function setupWebGL() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (!a_UV < 0) {
        console.log('failed to get storage location of a_UV');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
    return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('failed to get storage location of u_whichTexture');
        return false;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('failed to get storage location of u_GlobalRotateMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('failed to get storage location of u_ViewMatrix');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('failed to get storage location of u_ProjectionMatrix');
        return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('failed to get storage location of u_Sampler0');
        return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('failed to get storage location of u_Sampler1');
        return false;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('failed to get storage location of u_Sampler2');
        return false;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function addActionsUI() {

    // CAMERA ANGLE SLIDERS
    document.getElementById('angleSlide1').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

    document.getElementById('printLocToConsole').addEventListener('click', function() { 
        console.log(
            'eye: ', g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2], "\n", 
            'at: ', g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2], "\n",
            'up: ', g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]
        );
     });
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

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return ([x, y]);
}

function sendTextToHTML(text, htmlID) {
    var element = document.getElementById(htmlID);
    if (!element) {
        console.log('failed to get ' + htmlID + " from HTML");
        return;
    }
    element.innerHTML = text;
}

function tick() {
    g_seconds = performance.now() / 1000.0 - g_startTime;
    // console.log(g_seconds); // FOR DEBUG
    // update animation angles
    updateAnimationAngles();
    renderAllShapes();
    requestAnimationFrame(tick);
}

// updates angles of everything if currently animated
function updateAnimationAngles() {
    if (g_yellowAnimation) {
        g_yellowAngle = (45 * Math.sin(g_seconds));
    }
    if (g_magentaAnimation) {
        g_magentaAngle = (45 * Math.sin(3 * g_seconds));
    }
}

function keydown(ev) {
    if (ev.keyCode == 68) { // D - RIGHT
        g_camera.right();
    } else if (ev.keyCode == 65) {  // A - LEFT
        g_camera.left();
    } else if (ev.keyCode == 87) {  // W - FORWARD
        g_camera.forward();
    } else if (ev.keyCode == 83) {  // S - BACKWARD
        g_camera.back();
    }
    renderAllShapes();
    console.log(ev.keyCode);
}

var g_camera = new Camera();
var g_map = [
        // LEFT
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,1],  // BACK
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,1],
        // RIGHT
];

function drawMap() {
    for (x = 0; x < 8; x++) {
        for (y = 0; y < 8; y++) {
            if (g_map[x][y] == 1) {
                var body = new Cube();
                body.color = [1, 1, 1, 1];
                body.textureNum = 2;
                body.matrix.translate(x, -0.55, y); // OG: x - 4, -0.75, y - 4
                body.render();
            }
        }
    }
}

// TEXTURE EDITING HERE
function initTextures() {
    // ----------
    var skyTEXTURE = new Image();
    if (!skyTEXTURE) {
        console.log('failed to create skyTEXTURE object');
        return false;
    }
    skyTEXTURE.onload = function() { sendImageToTEXTURE(skyTEXTURE, 0); };
    skyTEXTURE.src = 'foundation.png';
    // ----------
    var groundTEXTURE = new Image();
    if (!groundTEXTURE) {
        console.log('failed to create groundTEXTURE object');
        return false;
    }
    groundTEXTURE.onload = function() { sendImageToTEXTURE(groundTEXTURE, 1); };
    groundTEXTURE.src = 'carpet.png';
    // ----------
    var brickTEXTURE = new Image();
    if (!brickTEXTURE) {
        console.log('failed to create groundTEXTURE object');
        return false;
    }
    brickTEXTURE.onload = function() { sendImageToTEXTURE(brickTEXTURE, 2); };
    brickTEXTURE.src = 'brick.png';
    // ----------

    // MORE TEXTURE LOADING HERE
    return true;
}

function sendImageToTEXTURE(image, num) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // gl.activeTexture(gl.TEXTURE0);
    if (num == 0) {
        gl.activeTexture(gl.TEXTURE0);
    } else if (num == 1) {
        gl.activeTexture(gl.TEXTURE1);
    } else if (num == 2) {
        gl.activeTexture(gl.TEXTURE2);
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler0, 0);
    gl.uniform1i(u_Sampler1, 1);
    gl.uniform1i(u_Sampler2, 2);
    console.log('finished loadTexture');
}

function renderAllShapes() {

    // pass the proj matrix
    var projMat = new Matrix4();
    projMat.setPerspective(50, 1 * canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    // pass the view matrix
    var viewMat = new Matrix4();
    // viewMat.setLookAt(g_eye[0],g_eye[1],g_eye[2],   g_at[0],g_at[1],g_at[2],   g_up[0],g_up[1],g_up[2]);    // COMMENTED AS OF 3.8
    viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2],
        g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]
    );
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // pass matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // prevents flicker and disappearing shapes with DEPTH_TEST - solved with chatGPT
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ----- MAP ---------------
    // drawMap();

    // ----- CUBES ---------------
    // SKY
    var sky = new Cube();
    sky.color = [1.0, 0.0, 0.0, 1.0];
    sky.textureNum = 0;
    sky.matrix.translate(-0.5,-0.5,0);
    sky.matrix.scale(50, 50, 50);
    sky.render();

    // GROUND
    var ground = new Cube();
    ground.color = [1.0, 0.0, 0.0, 1.0];
    ground.textureNum = 1;
    ground.matrix.translate(-0.7, -0.5, -0.2);
    ground.matrix.scale(60,0.01,60);
    ground.render();

    // MORE SHAPES HERE
}