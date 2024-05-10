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
    uniform sampler2D u_Sampler5;
    uniform sampler2D u_Sampler6;
    uniform sampler2D u_Sampler7;
    uniform sampler2D u_Sampler8;
    uniform sampler2D u_Sampler9;
    uniform sampler2D u_Sampler10;
    uniform sampler2D u_Sampler11;
    uniform sampler2D u_Sampler12;
    uniform sampler2D u_Sampler13;
    uniform sampler2D u_Sampler14;
    uniform sampler2D u_Sampler15;

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
        } else if (u_whichTexture == 5) {
            gl_FragColor = texture2D(u_Sampler5, v_UV);
        } else if (u_whichTexture == 6) {
            gl_FragColor = texture2D(u_Sampler6, v_UV);
        } else if (u_whichTexture == 7) {
            gl_FragColor = texture2D(u_Sampler7, v_UV);
        } else if (u_whichTexture == 8) {
            gl_FragColor = texture2D(u_Sampler8, v_UV);
        } else if (u_whichTexture == 9) {
            gl_FragColor = texture2D(u_Sampler9, v_UV);
        } else if (u_whichTexture == 10) {
            gl_FragColor = texture2D(u_Sampler10, v_UV);
        } else if (u_whichTexture == 11) {
            gl_FragColor = texture2D(u_Sampler11, v_UV);
        } else if (u_whichTexture == 12) {
            gl_FragColor = texture2D(u_Sampler12, v_UV);
        } else if (u_whichTexture == 13) {
            gl_FragColor = texture2D(u_Sampler13, v_UV);
        } else if (u_whichTexture == 14) {
            gl_FragColor = texture2D(u_Sampler14, v_UV);
        } //else if (u_whichTexture == 15) {
            //gl_FragColor = texture2D(u_Sampler15, v_UV);
        //}

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
let u_Sampler5;
let u_Sampler6;
let u_Sampler7;
let u_Sampler8;
let u_Sampler9;
let u_Sampler10;
let u_Sampler11;
let u_Sampler12;
let u_Sampler13;
let u_Sampler14;
// let u_Sampler15;
let u_Sampler28;
let u_whichTexture;

let selectedLEN;
let selectedLETTER1;

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

    u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
    if (!u_Sampler5) {
        console.log('failed to get storage location of u_Sampler5');
        return false;
    }

    u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
    if (!u_Sampler6) {
        console.log('failed to get storage location of u_Sampler6');
        return false;
    }

    u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
    if (!u_Sampler7) {
        console.log('failed to get storage location of u_Sampler7');
        return false;
    }

    u_Sampler8 = gl.getUniformLocation(gl.program, 'u_Sampler8');
    if (!u_Sampler8) {
        console.log('failed to get storage location of u_Sampler8');
        return false;
    }

    u_Sampler9 = gl.getUniformLocation(gl.program, 'u_Sampler9');
    if (!u_Sampler9) {
        console.log('failed to get storage location of u_Sampler9');
        return false;
    }

    u_Sampler10 = gl.getUniformLocation(gl.program, 'u_Sampler10');
    if (!u_Sampler10) {
        console.log('failed to get storage location of u_Sampler10');
        return false;
    }

    u_Sampler11 = gl.getUniformLocation(gl.program, 'u_Sampler11');
    if (!u_Sampler11) {
        console.log('failed to get storage location of u_Sampler11');
        return false;
    }

    u_Sampler12 = gl.getUniformLocation(gl.program, 'u_Sampler12');
    if (!u_Sampler12) {
        console.log('failed to get storage location of u_Sampler12');
        return false;
    }

    u_Sampler13 = gl.getUniformLocation(gl.program, 'u_Sampler13');
    if (!u_Sampler13) {
        console.log('failed to get storage location of u_Sampler13');
        return false;
    }

    u_Sampler14 = gl.getUniformLocation(gl.program, 'u_Sampler14');
    if (!u_Sampler14) {
        console.log('failed to get storage location of u_Sampler14');
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

    document.getElementById('dropdown').addEventListener('change', function() {
        selectedLEN = this.value
        // console.log(selectedLEN, '-letter word selected');   // DEBUG
    });

    document.getElementById('spelling1').addEventListener('change', function() {
        selectedLETTER1 = this.value;
        console.log('letter selected: ', selectedLETTER1);
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
        g_globalAngle -= 0.5;
        // console.log('q pressed');
    } else if (ev.keyCode == 69) {  // E - ROTATE RIGHT
        g_globalAngle += 0.5;
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
    [1,0,0,0,0,0,0,1],  // BACK
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1],
        // RIGHT
];

function drawMap() {
    // for (i = 0; i < 2; i++) {
    for (x = 0; x < 8; x++) {
        for (y = 0; y < 8; y++) {
            if (g_map[x][y] == 1) {
                var body = new Cube();
                body.color = [1, 1, 1, 1];
                body.textureNum = -1;
                body.matrix.translate(x + 18, -0.55, y + 20); // OG: x - 4, -0.75, y - 4
                body.render();
            }
        }
    }
// }
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
    // ----- RED BLOCKS -----
    var blockA = new Image();
    if (!blockA) {
        console.log('failed to create blockA object');
        return false;
    }
    blockA.onload = function() { sendImageToTEXTURE(blockA, 2); };
    blockA.src = 'textures/blockA.png';
    // ----------
    var blockB = new Image();
    if (!blockB) {
        console.log('failed to create blockB object');
        return false;
    }
    blockB.onload = function() { sendImageToTEXTURE(blockB, 3); };
    blockB.src = 'textures/blockB.png';
    // ----------
    var blockC = new Image();
    if (!blockC) {
        console.log('failed to create blockC object');
        return false;
    }
    blockC.onload = function() { sendImageToTEXTURE(blockC, 4); };
    blockC.src = 'textures/blockC.png';
    // ----------
    var blockD = new Image();
    if (!blockD) {
        console.log('failed to create blockD object');
        return false;
    }
    blockD.onload = function() { sendImageToTEXTURE(blockD, 5); };
    blockD.src = 'textures/blockD.png';
    // ----------
    var blockE = new Image();
    if (!blockE) {
        console.log('failed to create blockE object');
        return false;
    }
    blockE.onload = function() { sendImageToTEXTURE(blockE, 6); };
    blockE.src = 'textures/blockE.png';
    // ----------
    var blockF = new Image();
    if (!blockF) {
        console.log('failed to create blockF object');
        return false;
    }
    blockF.onload = function() { sendImageToTEXTURE(blockF, 7); };
    blockF.src = 'textures/blockF.png';
    // ----------
    var blockG = new Image();
    if (!blockG) {
        console.log('failed to create blockG object');
        return false;
    }
    blockG.onload = function() { sendImageToTEXTURE(blockG, 8); };
    blockG.src = 'textures/blockG.png';
    // ----- GREEN BLOCKS -----
    var blockH = new Image();
    if (!blockH) {
        console.log('failed to create blockH object');
        return false;
    }
    blockH.onload = function() { sendImageToTEXTURE(blockH, 9); };
    blockH.src = 'textures/blockH.png';
    // ----------
    var blockI = new Image();
    if (!blockI) {
        console.log('failed to create blockI object');
        return false;
    }
    blockI.onload = function() { sendImageToTEXTURE(blockI, 10); };
    blockI.src = 'textures/blockI.png';
    // ----------
    var blockJ = new Image();
    if (!blockJ) {
        console.log('failed to create blockJ object');
        return false;
    }
    blockJ.onload = function() { sendImageToTEXTURE(blockJ, 11); };
    blockJ.src = 'textures/blockJ.png';
    // ----------
    var blockK = new Image();
    if (!blockK) {
        console.log('failed to create blockK object');
        return false;
    }
    blockK.onload = function() { sendImageToTEXTURE(blockK, 12); };
    blockK.src = 'textures/blockK.png';
    // ----------
    var blockL = new Image();
    if (!blockL) {
        console.log('failed to create blockL object');
        return false;
    }
    blockL.onload = function() { sendImageToTEXTURE(blockL, 13); };
    blockL.src = 'textures/blockL.png';
    // ----------
    var blockM = new Image();
    if (!blockM) {
        console.log('failed to create blockM object');
        return false;
    }
    blockM.onload = function() { sendImageToTEXTURE(blockM, 14); };
    blockM.src = 'textures/blockM.png';
    // ----------
    // var blockN = new Image();
    // if (!blockN) {
    //     console.log('failed to create blockN object');
    //     return false;
    // }
    // blockN.onload = function() { sendImageToTEXTURE(blockN, 15); };
    // blockN.src = 'textures/blockN.png';

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
    } else if (num == 4) {
        gl.activeTexture(gl.TEXTURE4);
    } else if (num == 5) {
        gl.activeTexture(gl.TEXTURE5);
    } else if (num == 6) {
        gl.activeTexture(gl.TEXTURE6);
    } else if (num == 7) {
        gl.activeTexture(gl.TEXTURE7);
    } else if (num == 8) {
        gl.activeTexture(gl.TEXTURE8);
    } else if (num == 9) {
        gl.activeTexture(gl.TEXTURE9);
    } else if (num == 10) {
        gl.activeTexture(gl.TEXTURE10);
    } else if (num == 11) {
        gl.activeTexture(gl.TEXTURE11);
    } else if (num == 12) {
        gl.activeTexture(gl.TEXTURE12);
    } else if (num == 13) {
        gl.activeTexture(gl.TEXTURE13);
    } else if (num == 14) {
        gl.activeTexture(gl.TEXTURE14);
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
    gl.uniform1i(u_Sampler5, 5);
    gl.uniform1i(u_Sampler6, 6);
    gl.uniform1i(u_Sampler7, 7);
    gl.uniform1i(u_Sampler8, 8);
    gl.uniform1i(u_Sampler9, 9);
    gl.uniform1i(u_Sampler10, 10);
    gl.uniform1i(u_Sampler11, 11);
    gl.uniform1i(u_Sampler12, 12);
    gl.uniform1i(u_Sampler13, 13);
    gl.uniform1i(u_Sampler14, 14);

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
    // drawMap();

    // ----- CUBES ---------------
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

    // LETTERS -------------
    /* TEXTURENUM LEGEND
    a 2     f 7      k 12     p 17     u 22     z 27
    b 3     g 8      l 13     q 18     v 23     star/default 28
    c 4     h 9      m 14     r 19     w 24
    d 5     i 10     n 15     s 20     x 25
    e 6     j 11     o 16     t 21     y 26
    */

    var cube1 = new Cube();
    cube1.textureNum = 28;
    // if (selectedLETTER1 == 'A1') {
    //     cube1.textureNum = 2;
    // } else if (selectedLETTER1 == 'B1') {
    //     cube1.textureNum = 3;
    // } else if (selectedLETTER1 == 'C1') {
    //     cube1.textureNum = 4;
    // } else if (selectedLETTER1 == 'D1') {
    //     cube1.textureNum = 5;
    // } else if (selectedLETTER1 == 'E1') {
    //     cube1.textureNum = 6;
    // } else if (selectedLETTER1 == 'F1') {
    //     cube1.textureNum = 7;
    // } else if (selectedLETTER1 == 'G1') {
    //     cube1.textureNum = 8;
    // } else if (selectedLETTER1 == 'H1') {
    //     cube1.textureNum = 9;
    // } else if (selectedLETTER1 == "I1") {
    //     cube1.textureNum = 10;
    // } else if (selectedLETTER1 == "J1") {
    //     cube1.textureNum = 11;
    // } else if (selectedLETTER1 == "K1") {
    //     cube1.textureNum = 12;
    // } else if (selectedLETTER1 == "L1") {
    //     cube1.textureNum = 13;
    // } else if (selectedLETTER1 == "M1") {
    //     cube1.textureNum = 14;
    // }
    // cube1.textureNum = letterTEXTURES[selectedLETTER1];
    cube1.matrix.scale(5, 5, 5);
    cube1.matrix.translate(1, -0.05, 1);
    cube1.render();

    var cube2 = new Cube();
    cube2.textureNum = 28;
    cube2.matrix.scale(5, 5, 5);
    cube2.matrix.translate(2.1, -0.05, 1);
    if (selectedLEN == 'two' || selectedLEN == 'three' || selectedLEN == 'four' || selectedLEN == 'five') {
        cube2.render();
    }

    var cube3 = new Cube();
    cube3.textureNum = 28;
    cube3.matrix.scale(5, 5, 5);
    cube3.matrix.translate(3.2, -0.05, 1);
    if (selectedLEN == 'three' || selectedLEN == 'four' || selectedLEN == 'five') {
        cube3.render();
    }

    var cube4 = new Cube();
    cube4.textureNum = 28;
    cube4.matrix.scale(5, 5, 5);
    cube4.matrix.translate(4.3, -0.05, 1);
    if (selectedLEN == 'four' || selectedLEN == 'five') {
        cube4.render();
    }

    var cube5 = new Cube();
    cube5.textureNum = 28;
    cube5.matrix.scale(5, 5, 5);
    cube5.matrix.translate(5.4, -0.05, 1);
    if (selectedLEN == 'five') {
        cube5.render();
    }

    /*
    if (selectedLETTER1 == 'A1') {
        cube1.textureNum = 2;
    } else if (selectedLETTER1 == 'B1') {
        cube.textureNum = 3;
    } else if (selectedLETTER1 == 'C1') {
        cube.textureNum = 4;
    } else if (selectedLETTER1 == 'D1') {
        cube.textureNUM = 5;
    } ... MORE LETTERS HERE ...
    */

    // MORE SHAPES HERE
}