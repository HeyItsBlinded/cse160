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
// let u_Size;
// let g_shapesList = [];
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// constants
// const POINT = 0;
// const TRIANGLE = 1;
// const CIRCLE = 2;

// global vars for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
// let g_selectedType = POINT;
let g_selectedSegment = 5;
let g_globalAngle = 0;
let g_headAngle = 0;  // ADDED IN 2.6
let g_magentaAngle = 0; // ADDED IN 2.7
let g_headAnimation = false;
let g_magentaAnimation = false;


function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
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

    // get storage location of u_Size
    // u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    // if (!u_Size) {
    //     console.log('Failed to get the storage location of u_Size');
    // return;
    // }
}

// html functionality implementation
function addActionsUI() {

    // CAMERA ANGLE SLIDER
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
    // HEAD JOINT SLIDER
    document.getElementById('headSlide').addEventListener('mousemove', function() { g_headAngle = this.value; renderAllShapes(); });
    // // MAGENTA JOINT SLIDER
    // document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });
    // // TOGGLE HEAD ANIMATION BUTTON
    // document.getElementById('animationHeadOffButton').onclick = function() {g_headAnimation = false;};
    // document.getElementById('animationHeadOnButton').onclick = function() {g_headAnimation = true;};
    // // TOGGLE MAGENTA ANIMATION BUTTON
    // document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation = false;};
    // document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation = true;};    
}

function click(ev) {
    // extract event click, return it in webGL coords
    let [x, y] = convertCoordinatesEventToGL(ev);
    // create and store new point
    let point;
    if (g_selectedType == POINT) {
        point = new Point();
    } else if (g_selectedType == TRIANGLE) {
        point = new Triangle();
    } else  if (g_selectedType == CIRCLE) {
        point = new Circle();
        point.segments = g_selectedSegment;
    }
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);
    // draw all shapes in/on the canvas
    renderAllShapes();
}

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

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    // set up actions for html ui elements
    addActionsUI();
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev) } };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.542, 0.563, 0.570, 1.0);
    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // renderAllShapes();
    requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick() {
    g_seconds = performance.now() / 1000.0 - g_startTime;
    // console.log(g_seconds); // FOR DEBUG
    // update animation angles
    updateAnimationAngles();
    // draw everything
    renderAllShapes();
    // tell browser to update again when it has time
    requestAnimationFrame(tick);
}

// updates angles of everything if currently animated
function updateAnimationAngles() {
    if (g_headAnimation) {
        g_headAngle = (45 * Math.sin(g_seconds));
    }
    if (g_magentaAnimation) {
        g_magentaAngle = (45 * Math.sin(3 * g_seconds));
    }
}

function renderAllShapes() {
    // check time at start of function - COMMENTED OUT as of 2.3
    // var startTime = performance.now();

    // pass matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // prevents flicker and disappearing shapes with DEPTH_TEST - solved with chatGPT
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // CAPYBARA ---------------------
    // BODY
    var body = new Cube();
    body.color = [0.620, 0.345, 0.0310, 1.0];
    body.matrix.translate(-0.50, -0.50, 0.0);
    body.matrix.scale(1.0, 0.5, 0.5);
    body.render();

    // HEAD
    var head = new Cube();
    head.color = [0.620, 0.345, 0.0310, 1.0];
    head.matrix.setTranslate(-0.2, -0.1, 0.45);
    head.matrix.scale(0.6, 0.35, 0.4);
    head.matrix.rotate(-180, 0, 1, 0);
    head.matrix.rotate(-g_headAngle, 0, 0, 1);
    var headCoordsMat = new Matrix4(head.matrix);
    // head.matrix.translate(0.0,0,0);
    head.render();

    // NOSE
    var nose = new slicePyramid();
    nose.color = [0.550, 0.301, 0.0165, 1];
    nose.matrix = headCoordsMat;
    nose.matrix.translate(0.95, 0.98, 0.5); // INVERTED DUE TO REFERENCE?
    nose.matrix.rotate(180, 0, 0, 1);
    nose.matrix.rotate(90, 0, 1, 0);
    nose.render();
    
    // EAR 1
    var ear1 = new Cube()
    ear1.color = [0.360, 0.199, 0.0144, 1.0];
    var ear1CoordsMat = new Matrix4(headCoordsMat);
    ear1.matrix = ear1CoordsMat;
    ear1.matrix.scale(0.3, 0.7, 0.15); // SCALED IN RELATION TO HEAD SIZE DUE TO REFERENCE?
    ear1.matrix.translate(-1.7, -0.65, 5.4);  // LOCK 1.7, -0.65, 5.4
    ear1.render();

    // EAR 2
    var ear2 = new Cube();
    ear2.color = [0.360, 0.199, 0.0144, 1.0];
    ear2.matrix.scale(0.1, 0.2, 0.1);
    ear2.matrix.translate(-2.99, 1, 3.6);
    ear2.render();

    // BACKQUAD 1
    var backquad1 = new Cube();
    backquad1.color = [0.660, 0.367, 0.0330, 1.0];
    backquad1.matrix.scale(0.4, 0.3, 0.15);
    backquad1.matrix.translate(0.35, -2, -0.5);
    backquad1.render();
    
    // BACKQUAD 2
    var backquad2 = new Cube();
    backquad2.color = [0.660, 0.367, 0.0330, 1.0];
    backquad2.matrix.scale(0.4, 0.3, 0.15);
    backquad2.matrix.translate(0.35, -2, 2.7);
    backquad2.render();

    // BACKFOOT 1
    var backfoot1 = new Cube();
    backfoot1.color = [0.550, 0.301, 0.0165, 1];
    backfoot1.matrix.scale(0.4, 0.12, 0.2);
    backfoot1.matrix.translate(0.2, -5.5, -0.5);
    backfoot1.render();

    // BACKFOOT 2
    var backfoot2 = new Cube();
    backfoot2.color = [0.550, 0.301, 0.0165, 1];
    backfoot2.matrix.scale(0.4, 0.12, 0.2);
    backfoot2.matrix.translate(0.2, -5.5, 1.9);
    backfoot2.render();

    // FRONTQUAD 1
    var frontquad1 = new Cube();
    frontquad1.color = [0.660, 0.367, 0.0330, 1];
    frontquad1.matrix.scale(0.15, 0.2, 0.15);
    frontquad1.matrix.translate(-3., -2.9, -0.2);
    frontquad1.render();

    // FRONTQUAD 2
    var frontquad2 = new Cube();
    frontquad2.color = [0.660, 0.367, 0.0330, 1];
    frontquad2.matrix.scale(0.15, 0.2, 0.15);
    frontquad2.matrix.translate(-3., -2.9, 2.5);
    frontquad2.render();

    // FRONTFOOT 1
    var frontfoot1 = new Cube();
    frontfoot1.color = [0.550, 0.301, 0.0165, 1];
    frontfoot1.matrix.scale(0.2, 0.1, 0.2);
    frontfoot1.matrix.translate(-2.4, -6.5, -0.2);
    frontfoot1.render();

    // FRONTFOOT 2
    var frontfoot2 = new Cube();
    frontfoot2.color = [0.550, 0.301, 0.0165, 1];
    frontfoot2.matrix.scale(0.2, 0.1, 0.2);
    frontfoot2.matrix.translate(-2.4, -6.5, 1.7);
    frontfoot2.render();   
    // ------------------------------ 

    // CUSTOM TEST ------------------
    // var testObj = new slicePyramid();
    // testObj.color = [1, 0, 1, 1];
    // // testObj.matrix.rotate = (-5, 1, 0, 0);
    // // testObj.matrix.translate(0, 0.7, 0);
    // testObj.render();
    // ------------------------------

    // check time at end of function. show on page - COMMENTED OUT as of 2.1
    // var dur = performance.now() - startTime;
    // sendTextToHTML("numdot: " + len + " ms: " + Math.floor(dur) + " fps: " + Math.floor(10000 / dur) / 10, "numdot");
}
