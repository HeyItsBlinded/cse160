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
    uniform sampler2D u_Sampler3;

    uniform sampler2D u_Sampler26;
    uniform sampler2D u_Sampler27;
    uniform sampler2D u_Sampler28;

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
        } else if (u_whichTexture == 3) {
            gl_FragColor = texture2D(u_Sampler3, v_UV);
        } 
        
        else if (u_whichTexture == 26) {
            gl_FragColor = texture2D(u_Sampler26, v_UV);
        }
        else if (u_whichTexture == 27) {
            gl_FragColor = texture2D(u_Sampler27, v_UV);
        }
        else if (u_whichTexture == 28) {
            gl_FragColor = texture2D(u_Sampler28, v_UV);
        }
        else {
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
let u_Sampler3;

let u_Sampler26;
let u_Sampler27;
let u_Sampler28;
let u_whichTexture;

let shape1;
let shape2;
let shape3;

let LETTER1;

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// global vars for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegment = 5;

let g_globalAngle = -105;  // RESET TO 0 WHEN DONE

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

    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
        console.log('failed to get storage location of u_Sampler3');
        return false;
    }

    u_Sampler26 = gl.getUniformLocation(gl.program, 'u_Sampler26');
    if (!u_Sampler26) {
        console.log('failed to get storage location of u_Sampler26');
        return false;
    }

    u_Sampler27 = gl.getUniformLocation(gl.program, 'u_Sampler27');
    if (!u_Sampler27) {
        console.log('failed to get storage location of u_Sampler27');
        return false;
    }

    u_Sampler28 = gl.getUniformLocation(gl.program, 'u_Sampler28');
    if (!u_Sampler28) {
        console.log('failed to get storage location of u_Sampler28');
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

    document.getElementById('progressDROPDOWN').addEventListener('change', function() {
        console.log(this.value);
        if (this.value == 'stage1') {
            L1 = true;
        }
        if (this.value == 'stage2') {
            L1 = true;
            L2 = true;
        }
        if (this.value == 'stage3') {
            L1 = true;
            L2 = true;
            L3 = true;
        }
        if (this.value == 'stage4') {
            L1 = true;
            L2 = true;
            L3 = true;
            L4 = true;
        }
    });

    document.getElementById('clearCastle').addEventListener('click', function() {
        L1 = L2 = L3 = L4 = false;
        console.log(
            'L1: ', L1, '\n',
            'L2: ', L2, '\n',
            'L3: ', L3, '\n',
            'L4: ', L4
        );
    });

    document.getElementById('shape1SELECT').addEventListener('change', function() {
        shape1 = this.value;
        console.log(shape1);
    });

    document.getElementById('shape2SELECT').addEventListener('change', function() {
        shape2 = this.value;
        console.log(shape2);
    });

    document.getElementById('shape3SELECT').addEventListener('change', function() {
        shape3 = this.value;
        console.log(shape3);
    });

    // document.getElementById('dropdown').addEventListener('change', function() {
    //     selectedLEN = this.value
    //     // console.log(selectedLEN, '-letter word selected');   // DEBUG
    // });

    document.getElementById('spell1').addEventListener('change', function() {
        LETTER1 = this.value;
        console.log('letter selected: ', LETTER1);
    })

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

// WASD CONTROL
function keydown(ev) {
    if (ev.keyCode == 68) { // D - RIGHT
        g_camera.right();
    } else if (ev.keyCode == 65) {  // A - LEFT
        g_camera.left();
    } else if (ev.keyCode == 87) {  // W - FORWARD
        g_camera.forward();
    } else if (ev.keyCode == 83) {  // S - BACKWARD
        g_camera.back();
    } else if (ev.keyCode == 81) {  // Q - ROTATE LEFT
        g_globalAngle -= 1;
        // console.log('q pressed');
    } else if (ev.keyCode == 69) {  // E - ROTATE RIGHT
        g_globalAngle += 1;
        // console.log('e pressed');
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
    [1,0,0,0,0,0,0,0],  // FRONT
    [1,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
        // RIGHT
];

var g_map2 = [
        // LEFT
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0],  // FRONT
    [1,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0],
    [1,1,0,1,0,0,1,1],
        // RIGHT
];

var g_map3 = [
        // LEFT
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],  // FRONT
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
        // RIGHT
];

var g_map4 = [
        // LEFT
    [1,1,0,1,0,0,1,1],
    [0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0],  // FRONT
    [1,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,1],
    [1,1,0,1,0,1,0,1],
        // RIGHT
];

function randomColor() {
    var r = Math.random();
    var g = Math.random();
    var b = Math.random();
    return [r, g, b, 1];
}

var blockColorArray = [];
var blockColorArray2 = [];
var blockColorArray3 = [];
var blockColorArray4 = [];

let L1 = false;
let L2 = false;
let L3 = false;
let L4 = false;

function drawMap() {

    if (L1 == true) {
        for (x = 0; x < 8; x++) {   // LAYER 1
            for (y = 0; y < 8; y++) {
                if (!blockColorArray[x]) {
                    blockColorArray[x] = [];
                }
                if (g_map[x][y] == 1 && !blockColorArray[x][y]) {
                    blockColorArray[x][y] = randomColor();
                }
                if (g_map[x][y] == 1) {
                    var body = new Cube();
                    body.color = blockColorArray[x][y];
                    body.textureNum = -2;
                    body.matrix.scale(2, 2, 2);
                    body.matrix.rotate(15, 0, 1, 0);
                    body.matrix.translate(x + 1, -0.1, y + 3.5);
                    body.render();
                }
            }
        }
    }

    if (L2 == true) {
        for (x = 0; x < 8; x++) {
            for (y = 0; y < 8; y++) {
                if (!blockColorArray2[x]) {
                    blockColorArray2[x] = [];
                }
                if (g_map2[x][y] == 1 && !blockColorArray2[x][y]) {
                    blockColorArray2[x][y] = randomColor();
                }
                if (g_map2[x][y] == 1) {
                    var body = new Cube();
                    body.color = blockColorArray2[x][y];
                    body.textureNum = -2;
                    body.matrix.scale(2, 2, 2);
                    body.matrix.rotate(15, 0, 1, 0);
                    body.matrix.translate(x + 1, 0.9, y + 3.5);
                    body.render();
                }
            }
        }
    }

    if (L3 == true) {
        for (x = 0; x < 8; x++) {   // LAYER 3
            for (y = 0; y < 8; y++) {
                if (!blockColorArray3[x]) {
                    blockColorArray3[x] = [];
                }
                if (g_map3[x][y] == 1 && !blockColorArray3[x][y]) {
                    blockColorArray3[x][y] = randomColor();
                }
                if (g_map3[x][y] == 1) {
                    var body = new Cube();
                    body.color = blockColorArray3[x][y];
                    body.textureNum = -2;
                    body.matrix.scale(2, 2, 2);
                    body.matrix.rotate(15, 0, 1, 0);
                    body.matrix.translate(x + 1, 1.9, y + 3.5);
                    body.render();
                }
            }
        }
    }

    if (L4 == true) {
        for (x = 0; x < 8; x++) {   // LAYER 4
            for (y = 0; y < 8; y++) {
                if (!blockColorArray4[x]) {
                    blockColorArray4[x] = [];
                }
                if (g_map4[x][y] == 1 && !blockColorArray4[x][y]) {
                    blockColorArray4[x][y] = randomColor();
                }
                if (g_map4[x][y] == 1) {
                    var body = new Cube();
                    body.color = blockColorArray4[x][y];
                    body.textureNum = -2;
                    body.matrix.scale(2, 2, 2);
                    body.matrix.rotate(15, 0, 1, 0);
                    body.matrix.translate(x + 1, 2.9, y + 3.5);
                    body.render();
                }
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
    skyTEXTURE.src = 'textures/wall.png';
    // ----------
    var groundTEXTURE = new Image();
    if (!groundTEXTURE) {
        console.log('failed to create groundTEXTURE object');
        return false;
    }
    groundTEXTURE.onload = function() { sendImageToTEXTURE(groundTEXTURE, 1); };
    groundTEXTURE.src = 'textures/carpet.png';
    // ----------
    var brickTEXTURE = new Image();
    if (!brickTEXTURE) {
        console.log('failed to create brickTEXTURE object');
        return false;
    }
    brickTEXTURE.onload = function() { sendImageToTEXTURE(brickTEXTURE, 2); };
    brickTEXTURE.src = 'textures/brick.png';
    // ----------
    var alphaTEXTURE = new Image();
    if (!alphaTEXTURE) {
        console.log('failed to create alphaTEXTURE object');
        return false;
    }
    alphaTEXTURE.onload = function() { sendImageToTEXTURE(alphaTEXTURE, 3); };
    alphaTEXTURE.src = 'textures/alphaGrid.png';
    // ----------

    var blockTRI = new Image();
    if (!blockTRI) {
        console.log('failed to create blockTRI object');
        return false;
    }
    blockTRI.onload = function() { sendImageToTEXTURE(blockTRI, 26); };
    blockTRI.src = 'textures/blockTRIANGLE.png';
    // ----------
    var blockCIRCLE = new Image();
    if (!blockCIRCLE) {
        console.log('failed to create blockCIRCLE object');
        return false;
    }
    blockCIRCLE.onload = function() { sendImageToTEXTURE(blockCIRCLE, 27); };
    blockCIRCLE.src = 'textures/blockCIRCLE.png';
    // ----------
    var blockSTAR = new Image();
    if (!blockSTAR) {
        console.log('failed to create blockSTAR object');
        return false;
    }
    blockSTAR.onload = function() { sendImageToTEXTURE(blockSTAR, 28); };
    blockSTAR.src = 'textures/blockSTAR.png';


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
    } else if (num == 3) {
        gl.activeTexture(gl.TEXTURE3);
    }
    
    else if (num == 26) {
        gl.activeTexture(gl.TEXTURE26);
    }
    else if (num == 27) {
        gl.activeTexture(gl.TEXTURE27);
    }
    else if (num == 28) {
        gl.activeTexture(gl.TEXTURE28);
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler0, 0);
    gl.uniform1i(u_Sampler1, 1);
    gl.uniform1i(u_Sampler2, 2);
    gl.uniform1i(u_Sampler3, 3);

    gl.uniform1i(u_Sampler26, 26);
    gl.uniform1i(u_Sampler27, 27);
    gl.uniform1i(u_Sampler28, 28);
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
    // var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    var globalRotMat = new Matrix4();

    // - center - 24.5, 24.5, 25
    // move the opposite of center
    // apply rotate
    // move back
    /* 
    explanation: you cannot change the rotation origin, so the next
    best thing is translating everything so that the middle of the 
    cube lines up with the origin. then that way, it looks like
    the center of your environment is the rotation axis.
    */
    globalRotMat.translate(24.5, 24.5, 25);
    globalRotMat.rotate(g_globalAngle, 0, 1, 0);
    globalRotMat.translate(-24.5, -24.5, -25);   

    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // prevents flicker and disappearing shapes with DEPTH_TEST - solved with chatGPT
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ----- MAP ---------------
    drawMap();

    // ----- ENVIRON ---------------
    // FOUNDATION - PREV: SKY
    var sky = new Cube();
    sky.textureNum = 0;
    sky.matrix.translate(-0.5,-0.5,0);
    sky.matrix.scale(50, 50, 50);
    sky.render();

    // CARPET - PREV: GROUND
    var ground = new Cube();
    ground.textureNum = 1;
    ground.matrix.translate(-0.7, -0.5, -0.2);
    ground.matrix.scale(60,0.01,60);
    ground.render();

    // OBJECTS -------------
    var chest = new Cube();
    chest.color = [0.0490, 0.490, 0.0710, 1];
    chest.textureNum = -2;
    chest.matrix.scale(20, 12, 10);
    chest.matrix.translate(1.4, -0.05, 0.45);
    chest.render();

    var chestLid = new Cube();
    chestLid.color = [0.570, 0.358, 0.0798, 1];
    chestLid.textureNum = -2;
    chestLid.matrix.scale(21, 2, 12);
    chestLid.matrix.translate(1.3, 5.5, 0.3);
    chestLid.render();

    var door = new Cube();
    door.color = [0.580, 0.433, 0.313, 1];
    door.textureNum = -2;
    door.matrix.scale(22, 35, 2);
    door.matrix.translate(0.1, -0.02, -0.5);
    door.render();

    var doorHan = new Cube()
    doorHan.color = [0.380, 0.351, 0.327, 1];
    doorHan.textureNum = -2;
    doorHan.matrix.scale(2, 2, 2);
    doorHan.matrix.translate(10.5, 12, -0.3);
    doorHan.render();

    // MORE SHAPES HERE

    // SHAPES -------------
    /* SHAPES LEGEND
    star        28
    circle      27
    triangle    26
    */
    var block1 = new Cube();
    block1.textureNum = 28;
    if (shape1 == 's1TRIANGLE') {
        block1.textureNum = 26;
    }
    if (shape1 == 's1CIRCLE') {
        block1.textureNum = 27;
    }
    if (shape1 == 's1STAR') {
        block1.textureNum = 28;
    }
    block1.matrix.scale(5, 5, 5);
    block1.matrix.translate(8, -0.05, 8);
    block1.matrix.rotate(-15, 0, 1, 0);
    block1.render();

    var block2 = new Cube();
    block2.textureNum = 28;
    if (shape2 == 's2TRIANGLE') {
        block2.textureNum = 26;
    }
    if (shape2 == 's2CIRCLE') {
        block2.textureNum = 27;
    }
    if (shape2 == 's2STAR') {
        block2.textureNum = 28;
    }
    block2.matrix.scale(5, 5, 5);
    block2.matrix.translate(6.5, -0.05, 8.25);
    block2.matrix.rotate(10, 0, 1, 0);
    block2.render();

    var block3 = new Cube();
    block3.textureNum = 28;
    if (shape3 == 's3TRIANGLE') {
        block3.textureNum = 26;
    }
    if (shape3 == 's3CIRCLE') {
        block3.textureNum = 27;
    }
    if (shape3 == 's3STAR') {
        block3.textureNum = 28;
    }
    block3.matrix.scale(5, 5, 5);
    block3.matrix.translate(7, 0.95, 8.25);
    block3.matrix.rotate(35, 0, 1, 0);
    block3.render();

    // LETTERS -------------
    var cubeTEST = new Cube2();
    cubeTEST.textureNum = 3;
    cubeTEST.matrix.scale(5, 5, 5);
    cubeTEST.matrix.translate(0.8, -0.05, 9.2);
    cubeTEST.matrix.rotate(90, 0, 1, 0);
    cubeTEST.render();

    // MORE LETTER CUBES HERE
}

// -- FOR LETTER BLOCK USE -----
class Cube2 {
    constructor() {
        this.type = 'cube2';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // NEW!
        // gl.activeTexture(gl.TEXTURE0 + this.textureNum);
        // gl.bindTexture(gl.TEXTURE_2D, texture);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // if (LETTER1 == 'A1') {
        // // -- A -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ > 0,1,  0.5,1,  0,0.5
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.8,  0.2,0.8,  0.2,1] );   // /BOTTOM - < ^ > 0,0.8,  0.2,0.8,  0.2,1 
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.8,  0,1,  0.2,1] );
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.8,  0,1,  0.2,1] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.8,  0,1,  0.2,1] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        // }

        // if (LETTER1 == "B1") {
        // // -- B -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ > 0.2,0.8,  0.2,1,  0.4,1
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.8,  0.4,0.8,  0.4,1 ] );   // /BOTTOM - < ^ > 0.2,0.8,  0.4,0.8,  0.4,1 
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        // }

        // if (LETTER1 == "C1") {
        // // -- C -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ > 0.38,0.8,  0.38,1,  0.58,1
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.8,  0.58,0.8,  0.59,1] );   // /BOTTOM - < ^ > 0.38,0.8,  0.58,0.8,  0.58,1
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        // }

        // if (LETTER1 == "D1") {
        // // -- D -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ > 0.58,0.8,  0.58,1,  0.78,1
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.8,  0.78,0.8,  0.78,1] );   // /BOTTOM - < ^ > 0.58,0.8,  0.78,0.8,  0.78,1
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        // }

        // if (LETTER1 == "E1") {
        // // -- E -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ > 0.78,0.8,  0.78,1,  0.97,1
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.8,  0.97,0.8,  0.97,1] );   // /BOTTOM - < ^ > 0.78,0.8,  0.97,0.8,  0.97,1
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        // }

        // if (LETTER1 == "F1") {
        // // -- F -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ > 0,0.62,  0,0.8,  0.19,0.8
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.61,  0.19,0.61,  0.19,0.8] );   // /BOTTOM - < ^ > 0,0.62,  0.19,0.62,  0.19,0.8
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        //}

        // if (LETTER1 == "G1") {
        // // -- G -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ > 0.19,0.61,  0.19,0.8,  0.38,0.8
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // /BOTTOM - < ^ > 0.19,0.61,  0.38,0.61,  0.38,0.8
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        // }

        // if (LETTER1 == "H1") {
        // // -- H -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ > 0.38,0.61,  0.38,0.81,  0.59,0.81
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // /BOTTOM - < ^ > 0.38,0.61,  0.59,0.61,  0.59,0.81
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        //}

        // if (LETTER1 == "I1") {
        // // -- I -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ > 0.59,0.61,  0.59,0.81,  0.78,0.81
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // /BOTTOM - < ^ > 0.59,0.61,  0.78,0.61,  0.78,0.81
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        //}

        // if (LETTER1 == "J1") {
        // // -- J -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ > 0.78,0.61,  0.78,0.81,  0.97,0.81
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // /BOTTOM - < ^ > 0.78,0.61,  0.97,0.61,  0.97,0.81
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        //}

        // if (LETTER1 == "K1") {
        // // -- K -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ > 0,0.42,  0,0.61,  0.19,0.61
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.41,  0.19,0.41,  0.19,0.61] );   // /BOTTOM - < ^ > 0,0.42,  0.19,0.42,  0.19,0.61
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        //}

        // if (LETTER1 == "L1") {
        // // -- L -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ > 0.19,0.41,  0.19,0.61,  0.39,0.61
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // /BOTTOM - < ^ > 0.19,0.41,  0.39,0.41,  0.39,0.61
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        //}

        // if (LETTER1 == "M1") {
        // // -- M -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ > 0.39,0.41,  0.39,0.61,  0.58,0.61
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // /BOTTOM - < ^ > 0.39,0.41,  0.58,0.41,  0.58,0.61
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        //}

        // if (LETTER1 == "N1") {
        // // -- N -----
        // // back cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.41,  0.58,0.61,  0.78,0.61] ); // /TOP - < ^ > 0.58,0.41,  0.58,0.61,  0.78,0.61  
        // drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.41,  0.78,0.41,  0.78,0.61] );   // /BOTTOM - < ^ > 0.58,0.41,  0.78,0.41,  0.78,0.61 
        // // front cube - LGTM
        // drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.41,  0.58,0.61,  0.78,0.61] ); // TOP - < ^ > - 
        // drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.41,  0.78,0.41,  0.78,0.61] );   // BOTTOM
        // // right cube - LGTM
        // drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.41,  0.58,0.61,  0.78,0.61] ); // /TOP - < ^ >
        // drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.41,  0.78,0.41,  0.78,0.61] );// BOTTOM < ^ >
        // // left cube - LGTM
        // drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.41,  0.58,0.61,  0.78,0.61] );
        // drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.41,  0.78,0.41,  0.78,0.61] );
        // // top of cube
        // drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.41,  0.58,0.61,  0.78,0.61] );
        // drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.41,  0.78,0.41,  0.78,0.61] );
        //}

        // -- O -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.41,  0.58,0.61,  0.78,0.61] ); // /TOP - < ^ > 0.58,0.41,  0.58,0.61,  0.78,0.61  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.41,  0.78,0.41,  0.78,0.61] );   // /BOTTOM - < ^ > 0.58,0.41,  0.78,0.41,  0.78,0.61 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.41,  0.58,0.61,  0.78,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.41,  0.78,0.41,  0.78,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.41,  0.58,0.61,  0.78,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.41,  0.78,0.41,  0.78,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.41,  0.58,0.61,  0.78,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.41,  0.78,0.41,  0.78,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.41,  0.58,0.61,  0.78,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.41,  0.78,0.41,  0.78,0.61] );
    }
}