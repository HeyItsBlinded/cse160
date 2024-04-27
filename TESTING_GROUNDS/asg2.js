// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`

// global variables
let canvas;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// global vars for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedSegment = 5;
let g_globalAngle = 0;
// let g_yellowAngle = 0;  // ADDED IN 2.6
// let g_magentaAngle = 0; // ADDED IN 2.7
// let g_yellowAnimation = false;
// let g_magentaAnimation = false;

let g_testObjHeight = 0;
let g_testOBJanimation = false;
let g_headLRangle = 0;
let g_leg1Angle = 0;
let g_leg1Animation = false;



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
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
    return;
    }
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
    return;
    }
    // get storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('failed to get the storage location of u_ModelMatrix');
        return;
    }
    // get storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('failed to get storage location of u_GlobalRotateMatrix');
        return;
    }

    // set initial value for this matrix to identity
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// html functionality implementation
function addActionsUI() {

    // CAMERA ANGLE SLIDER
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

    // TESTOBJ TOGGLE
    document.getElementById('animationTESTOBJoffButton').onclick = function() {
        g_testOBJanimation = false;
        g_leg1Animation = false;
    };
    document.getElementById('animationTESTOBJonButton').onclick = function() {
        g_testOBJanimation = true;
        g_leg1Animation = true;
    };

    // HEAD LR SLIDE
    document.getElementById('headLRslide').addEventListener('mousemove', function() { g_headLRangle = this.value; renderAllShapes(); });

    // LEG1 SLIDE
    document.getElementById('leg1slide').addEventListener('mousemove', function() { g_leg1Angle = this.value; renderAllShapes(); });

    // LEG1 TOGGLE
    // document.getElementById('animationleg1offButton').onclick = function() {
    //     g_leg1Animation = false;
    // };
    // document.getElementById('animationleg1onButton').onclick = function() {
    //     g_leg1Animation = true;
    // };
}

// function click(ev) {
//     // extract event click, return it in webGL coords
//     let [x, y] = convertCoordinatesEventToGL(ev);
//     // create and store new point
//     let point;
//     if (g_selectedType == POINT) {
//         point = new Point();
//     } else if (g_selectedType == TRIANGLE) {
//         point = new Triangle();
//     } else  if (g_selectedType == CIRCLE) {
//         point = new Circle();
//         point.segments = g_selectedSegment;
//     }
//     point.position = [x,y];
//     point.color = g_selectedColor.slice();
//     point.size = g_selectedSize;
//     g_shapesList.push(point);
//     // draw all shapes in/on the canvas
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

// function sendTextToHTML(text, htmlID) {
//     var element = document.getElementById(htmlID);
//     if (!element) {
//         console.log('failed to get ' + htmlID + " from HTML");
//         return;
//     }
//     element.innerHTML = text;
// }

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsUI();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // renderAllShapes();
    requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick() {
    g_seconds = performance.now() / 1000.0 - g_startTime;
    // console.log(g_seconds); // FOR DEBUG
    updateAnimationAngles();
    renderAllShapes();
    requestAnimationFrame(tick);
}

// updates angles of everything if currently animated
function updateAnimationAngles() {
    if (g_testOBJanimation) {
        g_testObjHeight = (0.05 * Math.sin(4 * g_seconds));
        g_leg1Angle += (0.5 * Math.sin(4 * g_seconds));
    }
    // if (g_leg1Animation) {
    //     g_leg1Angle += (0.5 * Math.sin(4 * g_seconds));
    // //     g_leg1Angle = (10 * Math.PI) * Math.sin(4 * g_seconds);
    // }
    // MORE ANIMS HERE
}

function renderAllShapes() {
    // pass matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // TOP BODY -------------------------
    var testObj = new Trapezoid();
    testObj.color = [0.863, 0.611, 0.940, 1];
    testObj.matrix.rotate(180, 1, 0, 0);
    testObj.matrix.scale(1, 1, 1);
    testObj.matrix.translate(0, 0.3, 0);
    testObj.matrix.translate(0, g_testObjHeight, 0);
    var testObjCoordsMat = new Matrix4(testObj.matrix);
    var neckCoordsMat = new Matrix4(testObj.matrix);
    var leg1CoordsMat = new Matrix4(testObj.matrix);
    // testObj.matrix.rotate(0, 1, 0, 0);  // FOR TROUBLESHOOTING
    testObj.render();

    var neck = new Cube();
    neck.color = [0.386, 0.840, 0.787, 1];
    neck.matrix = neckCoordsMat;
    neck.matrix.scale(0.1, 0.2, 0.1);
    neck.matrix.translate(-0.5, -4, 0);
    neck.render()

    // HEAD -----------------------
    var head = new Cube();
    head.color = [0, 0, 1, 1];
    head.matrix = testObjCoordsMat;
    
    // Issue: not swiveling on desired axis
    // Resolved: chatGPT
    // Translate the cube so that the line y = 0.1 becomes the y-axis
    head.matrix.translate(0, -0.1, 0);

    head.matrix.rotate(g_headLRangle, 0, 1, 0);
    head.matrix.translate(0, 0.1, 0);
    head.matrix.scale(0.3, 0.3, 0.3);
    head.matrix.translate(-0.5, -3.2, -0.2);
    head.render();
    
    // LEG 1 -------------------
    var leg1 = new Cube();
    leg1.color = [0.386, 0.840, 0.787, 1];
    leg1.matrix = leg1CoordsMat;
    leg1.matrix.translate(-0.08, -0.05, 0.05);
    leg1.matrix.rotate(g_leg1Angle, 1, 0, 0);
    leg1.matrix.scale(0.05, 0.5, 0.05);
    leg1.render();

}
