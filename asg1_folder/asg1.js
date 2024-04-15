// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
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
let u_Size;
let g_shapesList = [];

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// global vars for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegment = 5;


function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
    return;
    }
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
    // get storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
    return;
    }
}

// html functionality implementation
function addActionsUI() {
    // buttons
    document.getElementById('erase').onclick = function() { 
        g_selectedColor = [0.0, 0.0, 0.0, 1.0]; 
        g_selectedType = CIRCLE;
        console.log('eraser clicked!');
    };
    document.getElementById('white').onclick = function() { g_selectedColor = [1.0, 1.0, 1.0, 1.0]; };
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick   = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById('blue').onclick   = function() { g_selectedColor = [0.0, 0.0, 1.0, 1.0]; };
    document.getElementById('yellow').onclick   = function() { g_selectedColor = [1.00, 0.852, 0.0100, 1.0]; };
    document.getElementById('clear').onclick   = function() { g_shapesList = []; renderAllShapes(); };

    document.getElementById('pointButton').onclick   = function() { g_selectedType = POINT };
    document.getElementById('triangleButton').onclick   = function() { g_selectedType = TRIANGLE };
    document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE };

    // sliders
    document.getElementById('redSlide').addEventListener('mouseup',   function() { g_selectedColor[0] = this.value / 100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value / 100; });
    document.getElementById('blueSlide').addEventListener('mouseup',  function() { g_selectedColor[2] = this.value / 100; });
    document.getElementById('sizeSlide').addEventListener('mouseup',  function() { g_selectedSize = this.value; });
    document.getElementById('segmentSlide').addEventListener('mouseup',  function() { g_selectedSegment = this.value; });

    // document.getElementById('custom').onclick = function() { g_selectedType = CUSTOM };
    document.getElementById('custom').onclick = function() { // NEW!
        console.log('custom clicked!');
        var custom = new Custom();
        custom.render();
        renderAllShapes();
    };

    // CUSTOM 2
    document.getElementById('custom2').onclick = function() { // NEW!
        console.log('custom clicked2!');
        var custom2 = new Custom2();
        custom2.render();
        renderAllShapes();
    };
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
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

function renderAllShapes() {
    // check time at start of function
    var startTime = performance.now();
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
    // check time at end of function. show on page
    var dur = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + " ms: " + Math.floor(dur) + " fps: " + Math.floor(10000 / dur) / 10, "numdot");
}

function sendTextToHTML(text, htmlID) {
    var element = document.getElementById(htmlID);
    if (!element) {
        console.log('failed to get ' + htmlID + " from HTML");
        return;
    }
    element.innerHTML = text;
}