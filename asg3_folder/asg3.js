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
    uniform sampler2D u_Sampler4;

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
        } else if (u_whichTexture == 4) {
            gl_FragColor = texture2D(u_Sampler4, v_UV);
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
let u_Sampler4;

let u_Sampler26;
let u_Sampler27;
let u_Sampler28;
let u_whichTexture;

let shape1;
let shape2;
let shape3;

let LETTER1;
let LETTER2;
let LETTER3;
let LETTER4;
let LETTER5;

let toggleValue = false;

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// global vars for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegment = 5;

let g_globalAngle = -10;  // RESET TO 0 WHEN DONE

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

    u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
    if (!u_Sampler4) {
        console.log('failed to get storage location of u_Sampler4');
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
    document.getElementById('angleSlide1').addEventListener('input', function() { g_globalAngle = this.value; renderAllShapes(); });

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

    document.getElementById('spell1').addEventListener('change', function() {
        LETTER1 = this.value;
        console.log('LETTER1: ', LETTER1);
    });

    document.getElementById('spell2').addEventListener('change', function() {
        LETTER2 = this.value;
        console.log('current LETTER1: ', LETTER1);
        console.log('LETTER2: ', LETTER2);
    });

    document.getElementById('spell3').addEventListener('change', function() {
        LETTER3 = this.value;
        console.log('current LETTER1: ', LETTER1);
        console.log('current LETTER2: ', LETTER2);
        console.log('LETTER3: ', LETTER3);
    });

    document.getElementById('spell4').addEventListener('change', function() {
        LETTER4 = this.value;
        console.log('current LETTER1: ', LETTER1);
        console.log('current LETTER2: ', LETTER2);
        console.log('current LETTER3: ', LETTER3);
        console.log('LETTER4: ', LETTER4);
    });

    document.getElementById('spell5').addEventListener('change', function() {
        LETTER5 = this.value;
        console.log('current LETTER1: ', LETTER1);
        console.log('current LETTER2: ', LETTER2);
        console.log('current LETTER3: ', LETTER3);
        console.log('current LETTER4: ', LETTER4);
        console.log('LETTER5: ', LETTER5);
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
                    body.matrix.translate(x + 2, -0.1, y + 5.5);
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
                    body.matrix.translate(x + 2, 0.9, y + 5.5);
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
                    body.matrix.translate(x + 2, 1.9, y + 5.5);
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
                    body.matrix.translate(x + 2, 2.9, y + 5.5);
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

    // ----------
    var alphaTEXTURE = new Image();
    if (!alphaTEXTURE) {
        console.log('failed to create alphaTEXTURE object');
        return false;
    }
    alphaTEXTURE.onload = function() { sendImageToTEXTURE(alphaTEXTURE, 3); };
    alphaTEXTURE.src = 'textures/alphagrid.png';
    // ----------
    var zTEXTURE = new Image();
    if (!zTEXTURE) {
        console.log('failed to create zTEXTURE object');
        return false;
    }
    zTEXTURE.onload = function() {sendImageToTEXTURE(zTEXTURE, 4); };
    zTEXTURE.src = 'textures/blockZ.png';
    // ----------

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
    } else if (num == 3) {
        gl.activeTexture(gl.TEXTURE3);
    } else if (num == 4) {
        gl.activeTexture(gl.TEXTURE4);
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
    gl.uniform1i(u_Sampler4, 4);

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
    chestLid.matrix.rotate(0, 1, 0, 0);
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

    // -- CHILD SAFETY LOCK ----------
    if (isToggleValue == true) {
        if (LETTER1 == 'P1' && LETTER2 == 'U2' && LETTER3 == 'S3' && LETTER4 == 'S4' && LETTER5 == 'Y5') {
            console.log('pussy spelled :(');
            return;
        }
        if (LETTER1 == 'B1' && LETTER2 == 'I2' && LETTER3 == 'T3' && LETTER4 == 'C4' && LETTER5 == 'H5') {
            console.log('bitch spelled :(');
            return;
        }
        if (LETTER1 == 'P1' && LETTER2 == 'E2' && LETTER3 == 'N3' && LETTER4 == 'I4' && LETTER5 == 'S5') {
            console.log('penis spelled :(');
            return;
        }
        if (LETTER1 == 'B1' && LETTER2 == 'I2' && LETTER3 == 'T3' && LETTER4 == 'C4' && LETTER5 == 'H5') {
            console.log('bitch spelled :(');
            return;
        }
        if (LETTER1 == 'P1' && LETTER2 == 'U2' && LETTER3 == 'T3' && LETTER4 == 'H4' && LETTER5 == 'Y5') {
            console.log('puthy spelled :(');
            return;
        }
        if (LETTER1 == 'H1' && LETTER2 == 'O2' && LETTER3 == 'R3' && LETTER4 == 'N4' && LETTER5 == 'Y5') {
            console.log('horny spelled :(');
            return;
        }
        if (LETTER1 == 'F1' && LETTER2 == 'U2' && LETTER3 == 'G3' && LETTER4 == 'L4' && LETTER5 == 'Y5') {
            console.log('fugly spelled :(');
            return;
        }
        if (LETTER1 == 'A1' && LETTER2 == 'R2' && LETTER3 == 'S3' && LETTER4 == 'O4' && LETTER5 == 'N5') {
            console.log('arson spelled :(');
            return;
        }
        if (LETTER1 == 'W1' && LETTER2 == 'H2' && LETTER3 == 'O3' && LETTER4 == 'R4' && LETTER5 == 'E5') {
            console.log('whore spelled :(');
            return;
        }
        if (LETTER1 == 'T1' && LETTER2 == 'U2' && LETTER3 == 'R3' && LETTER4 == 'D4' && LETTER5 == 'S5') {
            console.log('turds spelled :(');
            return;
        }
        if (LETTER1 == 'F1' && LETTER2 == 'U2' && LETTER3 == 'C3' && LETTER4 == 'K4') {
            console.log('fuck spelled :(');
            return;
        }
        if (LETTER1 == 'D1' && LETTER2 == 'Y2' && LETTER3 == 'K3' && LETTER4 == 'E4') {
            console.log('dyke spelled :(');
            return;
        }
        if (LETTER1 == 'S1' && LETTER2 == 'H2' && LETTER3 == 'I3' && LETTER4 == 'T4') {
            console.log('shit spelled :(');
            return;
        }
        if (LETTER1 == 'P1' && LETTER2 == 'E2' && LETTER3 == 'E3' && LETTER4 == 'N4') {
            console.log('peen spelled :(');
            return;
        }
        if (LETTER1 == 'D1' && LETTER2 == 'I2' && LETTER3 == 'C3' && LETTER4 == 'K4') {
            console.log('dick spelled :(');
            return;
        }
        if (LETTER1 == 'A1' && LETTER2 == 'R2' && LETTER3 == 'S3' && LETTER4 == 'E4') {
            console.log('arse spelled :(');
            return;
        }
        if (LETTER1 == 'C1' && LETTER2 == 'U2' && LETTER3 == 'N3' && LETTER4 == 'T4') {
            console.log('cunt spelled :(');
            return;
        }
        if (LETTER1 == 'P1' && LETTER2 == 'I2' && LETTER3 == 'S3' && LETTER4 == 'S4') {
            console.log('piss spelled :(');
            return;
        }
        if (LETTER1 == 'C1' && LETTER2 == 'O2' && LETTER3 == 'C3' && LETTER4 == 'K4') {
            console.log('cock spelled :(');
            return;
        }
        if (LETTER1 == 'S1' && LETTER2 == 'L2' && LETTER3 == 'U3' && LETTER4 == 'T4') {
            console.log('slut spelled :(');
            return;
        }
        if (LETTER1 == 'D1' && LETTER2 == 'A2' && LETTER3 == 'M3' && LETTER4 == 'N4') {
            console.log('damn spelled :(');
            return;
        }
        if (LETTER1 == 'T1' && LETTER2 == 'U2' && LETTER3 == 'R3' && LETTER4 == 'D4') {
            console.log('turd spelled :(');
            return;
        }
    }

    // LETTERS -------------
    // LETTER1
    if (LETTER1 !== "Z1" ) {    // A1 to Y1
        var cube1 = new Cube2();
        cube1.textureNum = 3;
        cube1.matrix.scale(5, 5, 5);
        cube1.matrix.translate(0.8, -0.05, 9.2);
        cube1.matrix.rotate(100, 0, 1, 0);
        cube1.render();
    }
    if (LETTER1 == "Z1") {
        var cube1 = new Cube()
        cube1.textureNum = 4;
        cube1.matrix.scale(5, 5, 5);
        cube1.matrix.translate(0.8, -0.05, 9.2);
        cube1.matrix.rotate(100, 0, 1, 0);
        cube1.render();
    }

    // LETTER2
    if (LETTER2 !== "Z2") {
        var cube = new Cube3();
        cube.textureNum = 3;
        cube.matrix.scale(5, 5, 5);
        cube.matrix.translate(0.8, -0.05, 8.2);
        cube.matrix.rotate(110, 0, 1, 0);
        cube.render();
    }
    if (LETTER2 == "Z2") {
        var cube = new Cube()
        cube.textureNum = 4;
        cube.matrix.scale(5, 5, 5);
        cube.matrix.translate(0.8, -0.05, 8.2);
        cube.matrix.rotate(110, 0, 1, 0);
        cube.render();
    }

    // LETTER3
    if (LETTER3 !== "Z3") {
        var SOUP = new Cube4();
        SOUP.textureNum = 3;
        SOUP.matrix.scale(5, 5, 5);
        SOUP.matrix.translate(0.7, -0.05, 6.9);
        SOUP.matrix.rotate(100, 0, 1, 0);
        SOUP.render();
    }
    if (LETTER3 == "Z3") {
        var SOUP = new Cube()
        SOUP.textureNum = 4;
        SOUP.matrix.scale(5, 5, 5);
        SOUP.matrix.translate(0.7, -0.05, 6.9);
        SOUP.matrix.rotate(100, 0, 1, 0);
        SOUP.render();
    }

    // LETTER4 = "E4";
    if (LETTER4 !== "Z4") {
        var SOUP2 = new Cube5();
        SOUP2.textureNum = 3;
        SOUP2.matrix.scale(5, 5, 5);
        SOUP2.matrix.translate(0.7, -0.05, 5.5);
        SOUP2.matrix.rotate(80, 0, 1, 0);
        SOUP2.render();
    }
    if (LETTER4 == "Z4") {
        var SOUP2 = new Cube();
        SOUP2.textureNum = 4;
        SOUP2.matrix.scale(5, 5, 5);
        SOUP2.matrix.translate(0.7, -0.05, 5.5);
        SOUP2.matrix.rotate(80, 0, 1, 0);
        SOUP2.render();
    }

    // LETTER5 = "T5";
    if (LETTER5 !== "Z5") {
        var SOUP3 = new Cube6();
        SOUP3.textureNum = 3;
        SOUP3.matrix.scale(5, 5, 5);
        SOUP3.matrix.translate(0.7, -0.05, 4.45);
        SOUP3.matrix.rotate(90, 0, 1, 0);
        SOUP3.render();
    }
    if (LETTER5 == "Z5") {
        var SOUP3 = new Cube();
        SOUP3.textureNum = 4;
        SOUP3.matrix.scale(5, 5, 5);
        SOUP3.matrix.translate(0.7, -0.05, 4.45);
        SOUP3.matrix.rotate(90, 0, 1, 0);
        SOUP3.render();
    }
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

        if (LETTER1 == 'A1') {
        // -- A -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ > 0,1,  0.5,1,  0,0.5
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.8,  0.2,0.8,  0.2,1] );   // /BOTTOM - < ^ > 0,0.8,  0.2,0.8,  0.2,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        }

        if (LETTER1 == "B1") {
        // -- B -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ > 0.2,0.8,  0.2,1,  0.4,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.8,  0.4,0.8,  0.4,1 ] );   // /BOTTOM - < ^ > 0.2,0.8,  0.4,0.8,  0.4,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        }

        if (LETTER1 == "C1") {
        // -- C -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ > 0.38,0.8,  0.38,1,  0.58,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.8,  0.58,0.8,  0.59,1] );   // /BOTTOM - < ^ > 0.38,0.8,  0.58,0.8,  0.58,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        }

        if (LETTER1 == "D1") {
        // -- D -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ > 0.58,0.8,  0.58,1,  0.78,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.8,  0.78,0.8,  0.78,1] );   // /BOTTOM - < ^ > 0.58,0.8,  0.78,0.8,  0.78,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        }

        if (LETTER1 == "E1") {
        // -- E -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ > 0.78,0.8,  0.78,1,  0.97,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.8,  0.97,0.8,  0.97,1] );   // /BOTTOM - < ^ > 0.78,0.8,  0.97,0.8,  0.97,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        }

        if (LETTER1 == "F1") {
        // -- F -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ > 0,0.62,  0,0.8,  0.19,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.61,  0.19,0.61,  0.19,0.8] );   // /BOTTOM - < ^ > 0,0.62,  0.19,0.62,  0.19,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        }

        if (LETTER1 == "G1") {
        // -- G -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ > 0.19,0.61,  0.19,0.8,  0.38,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // /BOTTOM - < ^ > 0.19,0.61,  0.38,0.61,  0.38,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        }

        if (LETTER1 == "H1") {
        // -- H -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ > 0.38,0.61,  0.38,0.81,  0.59,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // /BOTTOM - < ^ > 0.38,0.61,  0.59,0.61,  0.59,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        }

        if (LETTER1 == "I1") {
        // -- I -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ > 0.59,0.61,  0.59,0.81,  0.78,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // /BOTTOM - < ^ > 0.59,0.61,  0.78,0.61,  0.78,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        }

        if (LETTER1 == "J1") {
        // -- J -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ > 0.78,0.61,  0.78,0.81,  0.97,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // /BOTTOM - < ^ > 0.78,0.61,  0.97,0.61,  0.97,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        }

        if (LETTER1 == "K1") {
        // -- K -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ > 0,0.42,  0,0.61,  0.19,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.41,  0.19,0.41,  0.19,0.61] );   // /BOTTOM - < ^ > 0,0.42,  0.19,0.42,  0.19,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        }

        if (LETTER1 == "L1") {
        // -- L -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ > 0.19,0.41,  0.19,0.61,  0.39,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // /BOTTOM - < ^ > 0.19,0.41,  0.39,0.41,  0.39,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        }

        if (LETTER1 == "M1") {
        // -- M -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ > 0.39,0.41,  0.39,0.61,  0.58,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // /BOTTOM - < ^ > 0.39,0.41,  0.58,0.41,  0.58,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        }

        if (LETTER1 == "N1") {
        // -- N -----
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

        if (LETTER1 == "O1") {
        // -- O -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ > 0.78,0.42,  0.78,0.61,  0.97,0.61  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // /BOTTOM - < ^ > 0.78,0.42,  0.97,0.42,  0.97,0.61  
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        }

        if (LETTER1 == "P1") {
        // -- P -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ > 0,0.22,  0,0.42,  0.19,0.42  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.22,  0.19,0.22,  0.19,0.42] );   // /BOTTOM - < ^ > 0,0.22,  0.19,0.22,  0.19,0.42   
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        }

        if (LETTER1 == "Q1") {
        // -- Q -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ > 0.19,0.22,  0.19,0.41,  0.38,0.41 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // /BOTTOM - < ^ > 0.19,0.22,  0.38,0.22,  0.38,0.41 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        }

        if (LETTER1 == "R1"){
        // -- R -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ > 0.38,0.22,  0.38,0.42,  0.58,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // /BOTTOM - < ^ > 0.38,0.22,  0.58,0.22,  0.58,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        }

        if (LETTER1 == "S1") {
        // -- S -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ > 0.58,0.22,  0.58,0.42,  0.78,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // /BOTTOM - < ^ > 0.58,0.22,  0.78,0.22,  0.78,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        }

        if (LETTER1 == "T1") {
        // -- T -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ > 0.78,0.22,  0.78,0.42,  0.97,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // /BOTTOM - < ^ > 0.78,0.22,  0.97,0.22,  0.97,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        }

        if (LETTER1 == "U1") {
        // -- U -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ > 0,0.03,  0,0.22,  0.2,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.03,  0.2,0.03,  0.2,0.22] );   // /BOTTOM - < ^ > 0,0.03,  0.2,0.03,  0.2,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        }

        if (LETTER1 == "V1") {
        // -- V -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ > 0.2,0.03,  0.2,0.22,  0.39,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // /BOTTOM - < ^ > 0.2,0.03,  0.39,0.03,  0.39,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        }

        if (LETTER1 == "W1") {
        // -- W -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ > 0.39,0.03,  0.39,0.22,  0.58,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // /BOTTOM - < ^ > 0.39,0.03,  0.58,0.03,  0.58,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        }

        if (LETTER1 == "X1") {
        // -- X -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ > 0.58,0.03,  0.58,0.22,  0.78,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // /BOTTOM - < ^ > 0.58,0.03,  0.78,0.03,  0.78,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        }

        if (LETTER1 == "Y1") {
        // -- Y -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ > 0.78,0.03,  0.78,0.22,  0.97,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // /BOTTOM - < ^ > 0.78,0.03,  0.97,0.03,  0.97,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        }
    }
}

// LETTER BLOCK 2
class Cube3 {
    constructor() {
        this.type = 'cube3';
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

        if (LETTER2 == 'A2') {
        // -- A -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ > 0,1,  0.5,1,  0,0.5
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.8,  0.2,0.8,  0.2,1] );   // /BOTTOM - < ^ > 0,0.8,  0.2,0.8,  0.2,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        }

        if (LETTER2 == "B2") {
        // -- B -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ > 0.2,0.8,  0.2,1,  0.4,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.8,  0.4,0.8,  0.4,1 ] );   // /BOTTOM - < ^ > 0.2,0.8,  0.4,0.8,  0.4,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        }

        if (LETTER2 == "C2") {
        // -- C -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ > 0.38,0.8,  0.38,1,  0.58,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.8,  0.58,0.8,  0.59,1] );   // /BOTTOM - < ^ > 0.38,0.8,  0.58,0.8,  0.58,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        }

        if (LETTER2 == "D2") {
        // -- D -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ > 0.58,0.8,  0.58,1,  0.78,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.8,  0.78,0.8,  0.78,1] );   // /BOTTOM - < ^ > 0.58,0.8,  0.78,0.8,  0.78,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        }

        if (LETTER2 == "E2") {
        // -- E -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ > 0.78,0.8,  0.78,1,  0.97,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.8,  0.97,0.8,  0.97,1] );   // /BOTTOM - < ^ > 0.78,0.8,  0.97,0.8,  0.97,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        }

        if (LETTER2 == "F2") {
        // -- F -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ > 0,0.62,  0,0.8,  0.19,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.61,  0.19,0.61,  0.19,0.8] );   // /BOTTOM - < ^ > 0,0.62,  0.19,0.62,  0.19,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        }

        if (LETTER2 == "G2") {
        // -- G -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ > 0.19,0.61,  0.19,0.8,  0.38,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // /BOTTOM - < ^ > 0.19,0.61,  0.38,0.61,  0.38,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        }

        if (LETTER2 == "H2") {
        // -- H -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ > 0.38,0.61,  0.38,0.81,  0.59,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // /BOTTOM - < ^ > 0.38,0.61,  0.59,0.61,  0.59,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        }

        if (LETTER2 == "I2") {
        // -- I -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ > 0.59,0.61,  0.59,0.81,  0.78,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // /BOTTOM - < ^ > 0.59,0.61,  0.78,0.61,  0.78,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        }

        if (LETTER2 == "J2") {
        // -- J -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ > 0.78,0.61,  0.78,0.81,  0.97,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // /BOTTOM - < ^ > 0.78,0.61,  0.97,0.61,  0.97,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        }

        if (LETTER2 == "K2") {
        // -- K -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ > 0,0.42,  0,0.61,  0.19,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.41,  0.19,0.41,  0.19,0.61] );   // /BOTTOM - < ^ > 0,0.42,  0.19,0.42,  0.19,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        }

        if (LETTER2 == "L2") {
        // -- L -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ > 0.19,0.41,  0.19,0.61,  0.39,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // /BOTTOM - < ^ > 0.19,0.41,  0.39,0.41,  0.39,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        }

        if (LETTER2 == "M2") {
        // -- M -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ > 0.39,0.41,  0.39,0.61,  0.58,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // /BOTTOM - < ^ > 0.39,0.41,  0.58,0.41,  0.58,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        }

        if (LETTER2 == "N2") {
        // -- N -----
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

        if (LETTER2 == "O2") {
        // -- O -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ > 0.78,0.42,  0.78,0.61,  0.97,0.61  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // /BOTTOM - < ^ > 0.78,0.42,  0.97,0.42,  0.97,0.61  
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        }

        if (LETTER2 == "P2") {
        // -- P -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ > 0,0.22,  0,0.42,  0.19,0.42  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.22,  0.19,0.22,  0.19,0.42] );   // /BOTTOM - < ^ > 0,0.22,  0.19,0.22,  0.19,0.42   
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        }

        if (LETTER2 == "Q2") {
        // -- Q -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ > 0.19,0.22,  0.19,0.41,  0.38,0.41 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // /BOTTOM - < ^ > 0.19,0.22,  0.38,0.22,  0.38,0.41 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        }

        if (LETTER2 == "R2"){
        // -- R -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ > 0.38,0.22,  0.38,0.42,  0.58,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // /BOTTOM - < ^ > 0.38,0.22,  0.58,0.22,  0.58,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        }

        if (LETTER2 == "S2") {
        // -- S -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ > 0.58,0.22,  0.58,0.42,  0.78,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // /BOTTOM - < ^ > 0.58,0.22,  0.78,0.22,  0.78,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        }

        if (LETTER2 == "T2") {
        // -- T -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ > 0.78,0.22,  0.78,0.42,  0.97,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // /BOTTOM - < ^ > 0.78,0.22,  0.97,0.22,  0.97,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        }

        if (LETTER2 == "U2") {
        // -- U -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ > 0,0.03,  0,0.22,  0.2,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.03,  0.2,0.03,  0.2,0.22] );   // /BOTTOM - < ^ > 0,0.03,  0.2,0.03,  0.2,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        }

        if (LETTER2 == "V2") {
        // -- V -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ > 0.2,0.03,  0.2,0.22,  0.39,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // /BOTTOM - < ^ > 0.2,0.03,  0.39,0.03,  0.39,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        }

        if (LETTER2 == "W2") {
        // -- W -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ > 0.39,0.03,  0.39,0.22,  0.58,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // /BOTTOM - < ^ > 0.39,0.03,  0.58,0.03,  0.58,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        }

        if (LETTER2 == "X2") {
        // -- X -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ > 0.58,0.03,  0.58,0.22,  0.78,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // /BOTTOM - < ^ > 0.58,0.03,  0.78,0.03,  0.78,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        }

        if (LETTER2 == "Y2") {
        // -- Y -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ > 0.78,0.03,  0.78,0.22,  0.97,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // /BOTTOM - < ^ > 0.78,0.03,  0.97,0.03,  0.97,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        }
    }
}

// LETTER BLOCK 3
class Cube4 {
    constructor() {
        this.type = 'cube4';
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

        if (LETTER3 == 'A3') {
        // -- A -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ > 0,1,  0.5,1,  0,0.5
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.8,  0.2,0.8,  0.2,1] );   // /BOTTOM - < ^ > 0,0.8,  0.2,0.8,  0.2,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        }

        if (LETTER3 == "B3") {
        // -- B -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ > 0.2,0.8,  0.2,1,  0.4,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.8,  0.4,0.8,  0.4,1 ] );   // /BOTTOM - < ^ > 0.2,0.8,  0.4,0.8,  0.4,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        }

        if (LETTER3 == "C3") {
        // -- C -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ > 0.38,0.8,  0.38,1,  0.58,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.8,  0.58,0.8,  0.59,1] );   // /BOTTOM - < ^ > 0.38,0.8,  0.58,0.8,  0.58,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        }

        if (LETTER3 == "D3") {
        // -- D -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ > 0.58,0.8,  0.58,1,  0.78,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.8,  0.78,0.8,  0.78,1] );   // /BOTTOM - < ^ > 0.58,0.8,  0.78,0.8,  0.78,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        }

        if (LETTER3 == "E3") {
        // -- E -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ > 0.78,0.8,  0.78,1,  0.97,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.8,  0.97,0.8,  0.97,1] );   // /BOTTOM - < ^ > 0.78,0.8,  0.97,0.8,  0.97,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        }

        if (LETTER3 == "F3") {
        // -- F -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ > 0,0.62,  0,0.8,  0.19,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.61,  0.19,0.61,  0.19,0.8] );   // /BOTTOM - < ^ > 0,0.62,  0.19,0.62,  0.19,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        }

        if (LETTER3 == "G3") {
        // -- G -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ > 0.19,0.61,  0.19,0.8,  0.38,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // /BOTTOM - < ^ > 0.19,0.61,  0.38,0.61,  0.38,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        }

        if (LETTER3 == "H3") {
        // -- H -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ > 0.38,0.61,  0.38,0.81,  0.59,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // /BOTTOM - < ^ > 0.38,0.61,  0.59,0.61,  0.59,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        }

        if (LETTER3 == "I3") {
        // -- I -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ > 0.59,0.61,  0.59,0.81,  0.78,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // /BOTTOM - < ^ > 0.59,0.61,  0.78,0.61,  0.78,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        }

        if (LETTER3 == "J3") {
        // -- J -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ > 0.78,0.61,  0.78,0.81,  0.97,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // /BOTTOM - < ^ > 0.78,0.61,  0.97,0.61,  0.97,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        }

        if (LETTER3 == "K3") {
        // -- K -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ > 0,0.42,  0,0.61,  0.19,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.41,  0.19,0.41,  0.19,0.61] );   // /BOTTOM - < ^ > 0,0.42,  0.19,0.42,  0.19,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        }

        if (LETTER3 == "L3") {
        // -- L -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ > 0.19,0.41,  0.19,0.61,  0.39,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // /BOTTOM - < ^ > 0.19,0.41,  0.39,0.41,  0.39,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        }

        if (LETTER3 == "M3") {
        // -- M -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ > 0.39,0.41,  0.39,0.61,  0.58,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // /BOTTOM - < ^ > 0.39,0.41,  0.58,0.41,  0.58,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        }

        if (LETTER3 == "N3") {
        // -- N -----
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

        if (LETTER3 == "O3") {
        // -- O -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ > 0.78,0.42,  0.78,0.61,  0.97,0.61  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // /BOTTOM - < ^ > 0.78,0.42,  0.97,0.42,  0.97,0.61  
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        }

        if (LETTER3 == "P3") {
        // -- P -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ > 0,0.22,  0,0.42,  0.19,0.42  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.22,  0.19,0.22,  0.19,0.42] );   // /BOTTOM - < ^ > 0,0.22,  0.19,0.22,  0.19,0.42   
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        }

        if (LETTER3 == "Q3") {
        // -- Q -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ > 0.19,0.22,  0.19,0.41,  0.38,0.41 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // /BOTTOM - < ^ > 0.19,0.22,  0.38,0.22,  0.38,0.41 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        }

        if (LETTER3 == "R3"){
        // -- R -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ > 0.38,0.22,  0.38,0.42,  0.58,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // /BOTTOM - < ^ > 0.38,0.22,  0.58,0.22,  0.58,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        }

        if (LETTER3 == "S3") {
        // -- S -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ > 0.58,0.22,  0.58,0.42,  0.78,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // /BOTTOM - < ^ > 0.58,0.22,  0.78,0.22,  0.78,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        }

        if (LETTER3 == "T3") {
        // -- T -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ > 0.78,0.22,  0.78,0.42,  0.97,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // /BOTTOM - < ^ > 0.78,0.22,  0.97,0.22,  0.97,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        }

        if (LETTER3 == "U3") {
        // -- U -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ > 0,0.03,  0,0.22,  0.2,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.03,  0.2,0.03,  0.2,0.22] );   // /BOTTOM - < ^ > 0,0.03,  0.2,0.03,  0.2,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        }

        if (LETTER3 == "V3") {
        // -- V -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ > 0.2,0.03,  0.2,0.22,  0.39,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // /BOTTOM - < ^ > 0.2,0.03,  0.39,0.03,  0.39,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        }

        if (LETTER3 == "W3") {
        // -- W -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ > 0.39,0.03,  0.39,0.22,  0.58,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // /BOTTOM - < ^ > 0.39,0.03,  0.58,0.03,  0.58,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        }

        if (LETTER3 == "X3") {
        // -- X -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ > 0.58,0.03,  0.58,0.22,  0.78,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // /BOTTOM - < ^ > 0.58,0.03,  0.78,0.03,  0.78,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        }

        if (LETTER3 == "Y3") {
        // -- Y -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ > 0.78,0.03,  0.78,0.22,  0.97,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // /BOTTOM - < ^ > 0.78,0.03,  0.97,0.03,  0.97,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        }
    }
}

// LETTER BLOCK 4
class Cube5 {
    constructor() {
        this.type = 'cube5';
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

        if (LETTER4 == 'A4') {
        // -- A -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ > 0,1,  0.5,1,  0,0.5
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.8,  0.2,0.8,  0.2,1] );   // /BOTTOM - < ^ > 0,0.8,  0.2,0.8,  0.2,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        }

        if (LETTER4 == "B4") {
        // -- B -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ > 0.2,0.8,  0.2,1,  0.4,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.8,  0.4,0.8,  0.4,1 ] );   // /BOTTOM - < ^ > 0.2,0.8,  0.4,0.8,  0.4,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        }

        if (LETTER4 == "C4") {
        // -- C -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ > 0.38,0.8,  0.38,1,  0.58,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.8,  0.58,0.8,  0.59,1] );   // /BOTTOM - < ^ > 0.38,0.8,  0.58,0.8,  0.58,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        }

        if (LETTER4 == "D4") {
        // -- D -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ > 0.58,0.8,  0.58,1,  0.78,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.8,  0.78,0.8,  0.78,1] );   // /BOTTOM - < ^ > 0.58,0.8,  0.78,0.8,  0.78,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        }

        if (LETTER4 == "E4") {
        // -- E -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ > 0.78,0.8,  0.78,1,  0.97,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.8,  0.97,0.8,  0.97,1] );   // /BOTTOM - < ^ > 0.78,0.8,  0.97,0.8,  0.97,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        }

        if (LETTER4 == "F4") {
        // -- F -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ > 0,0.62,  0,0.8,  0.19,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.61,  0.19,0.61,  0.19,0.8] );   // /BOTTOM - < ^ > 0,0.62,  0.19,0.62,  0.19,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        }

        if (LETTER4 == "G4") {
        // -- G -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ > 0.19,0.61,  0.19,0.8,  0.38,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // /BOTTOM - < ^ > 0.19,0.61,  0.38,0.61,  0.38,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        }

        if (LETTER4 == "H4") {
        // -- H -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ > 0.38,0.61,  0.38,0.81,  0.59,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // /BOTTOM - < ^ > 0.38,0.61,  0.59,0.61,  0.59,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        }

        if (LETTER4 == "I4") {
        // -- I -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ > 0.59,0.61,  0.59,0.81,  0.78,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // /BOTTOM - < ^ > 0.59,0.61,  0.78,0.61,  0.78,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        }

        if (LETTER4 == "J4") {
        // -- J -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ > 0.78,0.61,  0.78,0.81,  0.97,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // /BOTTOM - < ^ > 0.78,0.61,  0.97,0.61,  0.97,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        }

        if (LETTER4 == "K4") {
        // -- K -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ > 0,0.42,  0,0.61,  0.19,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.41,  0.19,0.41,  0.19,0.61] );   // /BOTTOM - < ^ > 0,0.42,  0.19,0.42,  0.19,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        }

        if (LETTER4 == "L4") {
        // -- L -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ > 0.19,0.41,  0.19,0.61,  0.39,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // /BOTTOM - < ^ > 0.19,0.41,  0.39,0.41,  0.39,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        }

        if (LETTER4 == "M4") {
        // -- M -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ > 0.39,0.41,  0.39,0.61,  0.58,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // /BOTTOM - < ^ > 0.39,0.41,  0.58,0.41,  0.58,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        }

        if (LETTER4 == "N4") {
        // -- N -----
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

        if (LETTER4 == "O4") {
        // -- O -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ > 0.78,0.42,  0.78,0.61,  0.97,0.61  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // /BOTTOM - < ^ > 0.78,0.42,  0.97,0.42,  0.97,0.61  
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        }

        if (LETTER4 == "P4") {
        // -- P -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ > 0,0.22,  0,0.42,  0.19,0.42  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.22,  0.19,0.22,  0.19,0.42] );   // /BOTTOM - < ^ > 0,0.22,  0.19,0.22,  0.19,0.42   
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        }

        if (LETTER4 == "Q4") {
        // -- Q -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ > 0.19,0.22,  0.19,0.41,  0.38,0.41 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // /BOTTOM - < ^ > 0.19,0.22,  0.38,0.22,  0.38,0.41 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        }

        if (LETTER4 == "R4"){
        // -- R -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ > 0.38,0.22,  0.38,0.42,  0.58,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // /BOTTOM - < ^ > 0.38,0.22,  0.58,0.22,  0.58,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        }

        if (LETTER4 == "S4") {
        // -- S -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ > 0.58,0.22,  0.58,0.42,  0.78,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // /BOTTOM - < ^ > 0.58,0.22,  0.78,0.22,  0.78,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        }

        if (LETTER4 == "T4") {
        // -- T -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ > 0.78,0.22,  0.78,0.42,  0.97,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // /BOTTOM - < ^ > 0.78,0.22,  0.97,0.22,  0.97,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        }

        if (LETTER4 == "U4") {
        // -- U -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ > 0,0.03,  0,0.22,  0.2,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.03,  0.2,0.03,  0.2,0.22] );   // /BOTTOM - < ^ > 0,0.03,  0.2,0.03,  0.2,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        }

        if (LETTER4 == "V4") {
        // -- V -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ > 0.2,0.03,  0.2,0.22,  0.39,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // /BOTTOM - < ^ > 0.2,0.03,  0.39,0.03,  0.39,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        }

        if (LETTER4 == "W4") {
        // -- W -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ > 0.39,0.03,  0.39,0.22,  0.58,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // /BOTTOM - < ^ > 0.39,0.03,  0.58,0.03,  0.58,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        }

        if (LETTER4 == "X4") {
        // -- X -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ > 0.58,0.03,  0.58,0.22,  0.78,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // /BOTTOM - < ^ > 0.58,0.03,  0.78,0.03,  0.78,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        }

        if (LETTER4 == "Y4") {
        // -- Y -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ > 0.78,0.03,  0.78,0.22,  0.97,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // /BOTTOM - < ^ > 0.78,0.03,  0.97,0.03,  0.97,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        }
    }
}

// LETTER BLOCK 5
class Cube6 {
    constructor() {
        this.type = 'cube6';
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

        if (LETTER5 == 'A5') {
        // -- A -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ > 0,1,  0.5,1,  0,0.5
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.8,  0.2,0.8,  0.2,1] );   // /BOTTOM - < ^ > 0,0.8,  0.2,0.8,  0.2,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.8,  0,1,  0.2,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
        }

        if (LETTER5 == "B5") {
        // -- B -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ > 0.2,0.8,  0.2,1,  0.4,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.8,  0.4,0.8,  0.4,1 ] );   // /BOTTOM - < ^ > 0.2,0.8,  0.4,0.8,  0.4,1 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.8,  0.2,1,  0.4,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.8,  0.4,0.8,  0.4,1] );
        }

        if (LETTER5 == "C5") {
        // -- C -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ > 0.38,0.8,  0.38,1,  0.58,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.8,  0.58,0.8,  0.59,1] );   // /BOTTOM - < ^ > 0.38,0.8,  0.58,0.8,  0.58,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.8,  0.38,1,  0.59,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.8,  0.58,0.8,  0.59,1] );
        }

        if (LETTER5 == "D5") {
        // -- D -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ > 0.58,0.8,  0.58,1,  0.78,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.8,  0.78,0.8,  0.78,1] );   // /BOTTOM - < ^ > 0.58,0.8,  0.78,0.8,  0.78,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.8,  0.58,1,  0.78,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.8,  0.78,0.8,  0.78,1] );
        }

        if (LETTER5 == "E5") {
        // -- E -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ > 0.78,0.8,  0.78,1,  0.97,1
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.8,  0.97,0.8,  0.97,1] );   // /BOTTOM - < ^ > 0.78,0.8,  0.97,0.8,  0.97,1
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.8,  0.78,1,  0.97,1] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.8,  0.97,0.8,  0.97,1] );
        }

        if (LETTER5 == "F5") {
        // -- F -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ > 0,0.62,  0,0.8,  0.19,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.61,  0.19,0.61,  0.19,0.8] );   // /BOTTOM - < ^ > 0,0.62,  0.19,0.62,  0.19,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.61,  0,0.8,  0.19,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.61,  0.19,0.61,  0.19,0.8] );
        }

        if (LETTER5 == "G5") {
        // -- G -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ > 0.19,0.61,  0.19,0.8,  0.38,0.8
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // /BOTTOM - < ^ > 0.19,0.61,  0.38,0.61,  0.38,0.8
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.61,  0.19,0.8,  0.38,0.8] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.61,  0.38,0.61,  0.38,0.8] );
        }

        if (LETTER5 == "H5") {
        // -- H -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ > 0.38,0.61,  0.38,0.81,  0.59,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // /BOTTOM - < ^ > 0.38,0.61,  0.59,0.61,  0.59,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.61,  0.38,0.81,  0.59,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.61,  0.59,0.61,  0.59,0.81] );
        }

        if (LETTER5 == "I5") {
        // -- I -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ > 0.59,0.61,  0.59,0.81,  0.78,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // /BOTTOM - < ^ > 0.59,0.61,  0.78,0.61,  0.78,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.59,0.61,  0.59,0.81,  0.78,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.59,0.61,  0.78,0.61,  0.78,0.81] );
        }

        if (LETTER5 == "J5") {
        // -- J -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ > 0.78,0.61,  0.78,0.81,  0.97,0.81
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // /BOTTOM - < ^ > 0.78,0.61,  0.97,0.61,  0.97,0.81
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.61,  0.78,0.81,  0.97,0.81] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.61,  0.97,0.61,  0.97,0.81] );
        }

        if (LETTER5 == "K5") {
        // -- K -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ > 0,0.42,  0,0.61,  0.19,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.41,  0.19,0.41,  0.19,0.61] );   // /BOTTOM - < ^ > 0,0.42,  0.19,0.42,  0.19,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.41,  0,0.61,  0.19,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.41,  0.19,0.41,  0.19,0.61] );
        }

        if (LETTER5 == "L5") {
        // -- L -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ > 0.19,0.41,  0.19,0.61,  0.39,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // /BOTTOM - < ^ > 0.19,0.41,  0.39,0.41,  0.39,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.41,  0.19,0.61,  0.39,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.41,  0.39,0.41,  0.39,0.61] );
        }

        if (LETTER5 == "M5") {
        // -- M -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ > 0.39,0.41,  0.39,0.61,  0.58,0.61
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // /BOTTOM - < ^ > 0.39,0.41,  0.58,0.41,  0.58,0.61
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.41,  0.39,0.61,  0.58,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.41,  0.58,0.41,  0.58,0.61] );
        }

        if (LETTER5 == "N5") {
        // -- N -----
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

        if (LETTER5 == "O5") {
        // -- O -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ > 0.78,0.42,  0.78,0.61,  0.97,0.61  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // /BOTTOM - < ^ > 0.78,0.42,  0.97,0.42,  0.97,0.61  
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.42,  0.78,0.61,  0.97,0.61] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.42,  0.97,0.42,  0.97,0.61] );
        }

        if (LETTER5 == "P5") {
        // -- P -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ > 0,0.22,  0,0.42,  0.19,0.42  
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.22,  0.19,0.22,  0.19,0.42] );   // /BOTTOM - < ^ > 0,0.22,  0.19,0.22,  0.19,0.42   
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.22,  0,0.42,  0.19,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.22,  0.19,0.22,  0.19,0.42] );
        }

        if (LETTER5 == "Q5") {
        // -- Q -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ > 0.19,0.22,  0.19,0.41,  0.38,0.41 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // /BOTTOM - < ^ > 0.19,0.22,  0.38,0.22,  0.38,0.41 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.19,0.22,  0.19,0.41,  0.38,0.41] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.19,0.22,  0.38,0.22,  0.38,0.41] );
        }

        if (LETTER5 == "R5"){
        // -- R -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ > 0.38,0.22,  0.38,0.42,  0.58,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // /BOTTOM - < ^ > 0.38,0.22,  0.58,0.22,  0.58,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.38,0.22,  0.38,0.42,  0.58,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.38,0.22,  0.58,0.22,  0.58,0.42] );
        }

        if (LETTER5 == "S5") {
        // -- S -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ > 0.58,0.22,  0.58,0.42,  0.78,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // /BOTTOM - < ^ > 0.58,0.22,  0.78,0.22,  0.78,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.22,  0.58,0.42,  0.78,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.22,  0.78,0.22,  0.78,0.42] );
        }

        if (LETTER5 == "T5") {
        // -- T -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ > 0.78,0.22,  0.78,0.42,  0.97,0.42 
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // /BOTTOM - < ^ > 0.78,0.22,  0.97,0.22,  0.97,0.42 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.22,  0.78,0.42,  0.97,0.42] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.22,  0.97,0.22,  0.97,0.42] );
        }

        if (LETTER5 == "U5") {
        // -- U -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ > 0,0.03,  0,0.22,  0.2,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.03,  0.2,0.03,  0.2,0.22] );   // /BOTTOM - < ^ > 0,0.03,  0.2,0.03,  0.2,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.03,  0,0.22,  0.2,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.03,  0.2,0.03,  0.2,0.22] );
        }

        if (LETTER5 == "V5") {
        // -- V -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ > 0.2,0.03,  0.2,0.22,  0.39,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // /BOTTOM - < ^ > 0.2,0.03,  0.39,0.03,  0.39,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.2,0.03,  0.2,0.22,  0.39,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.2,0.03,  0.39,0.03,  0.39,0.22] );
        }

        if (LETTER5 == "W5") {
        // -- W -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ > 0.39,0.03,  0.39,0.22,  0.58,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // /BOTTOM - < ^ > 0.39,0.03,  0.58,0.03,  0.58,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.39,0.03,  0.39,0.22,  0.58,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.39,0.03,  0.58,0.03,  0.58,0.22] );
        }

        if (LETTER5 == "X5") {
        // -- X -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ > 0.58,0.03,  0.58,0.22,  0.78,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // /BOTTOM - < ^ > 0.58,0.03,  0.78,0.03,  0.78,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.58,0.03,  0.58,0.22,  0.78,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.58,0.03,  0.78,0.03,  0.78,0.22] );
        }

        if (LETTER5 == "Y5") {
        // -- Y -----
        // back cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ > 0.78,0.03,  0.78,0.22,  0.97,0.22
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // /BOTTOM - < ^ > 0.78,0.03,  0.97,0.03,  0.97,0.22 
        // front cube - LGTM
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // TOP - < ^ > - 
        drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );   // BOTTOM
        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] ); // /TOP - < ^ >
        drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );// BOTTOM < ^ >
        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0.78,0.03,  0.78,0.22,  0.97,0.22] );
        drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0.78,0.03,  0.97,0.03,  0.97,0.22] );
        }
    }
}
