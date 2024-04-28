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

let g_bodyHeight = 0;
let g_bodyAnimation = false;

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

    // ANIMATION TOGGLE
    document.getElementById('ANIMoffButton').onclick = function() {
        g_bodyAnimation = false;
    };
    document.getElementById('ANIMonButton').onclick = function() {
        g_bodyAnimation = true;
    };

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
    if (g_bodyAnimation) {
        g_bodyHeight = (0.05 * Math.sin(4 * g_seconds));
    }
    // MORE ANIMS HERE
}

function renderAllShapes() {
    // pass matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // DUCK? -------------------------
    var body = new Cube();
    body.color = [0.910, 0.892, 0.907, 1];
    body.matrix.scale(0.6, 0.45, 0.5);
    body.matrix.translate(-0.4, -0.8, 0);
    body.matrix.translate(0, g_bodyHeight, 0);
    var headCoordsMat = new Matrix4(body.matrix);
    body.render();

    var head = new Cube();
    head.color = [0.0188, 0.470, 0.0414, 1];
    head.matrix = headCoordsMat;
    head.matrix.scale(0.4, 1, 0.7);
    head.matrix.translate(-0.8, 0.6, 0.2);
    head.render();
}
