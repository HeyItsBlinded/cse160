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
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
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

    // // Get the storage location of a_Position
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

// global vars for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;

// html functionality implementation
function addActionsUI() {
    // buttons
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick   = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById('clear').onclick   = function() { g_shapesList = []; renderAllShapes(); };

    // sliders
    document.getElementById('redSlide').addEventListener('mouseup',   function() { g_selectedColor[0] = this.value / 100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value / 100; });
    document.getElementById('blueSlide').addEventListener('mouseup',  function() { g_selectedColor[2] = this.value / 100; });
    document.getElementById('sizeSlide').addEventListener('mouseup',  function() { g_selectedSize = this.value; });

}

function main() {
    setupWebGL();
    connectVariablesToGLSL();

    // set up actions for html ui elements
    addActionsUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev) } };
    // canvas.mousemove = click;

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// class Point {
//     constructor(){
//         this.type = 'point';
//         this.position = [0.0, 0.0, 0.0];
//         this.color = [1.0, 1.0, 1.0, 1.0];
//         this.size = 5.0;
//     }

//     render() {
//         var xy = this.position;
//         var rgba = this.color;
//         var size = this.size;
//         // var xy = g_shapesList[i].position;
//         // var rgba = g_shapesList[i].color;
//         // var size = g_shapesList[i].size;

//         // Pass the position of a point to a_Position variable
//         gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
//         // Pass the color of a point to u_FragColor variable
//         gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
//         // pass the size of a point to u_Size variable
//         gl.uniform1f(u_Size, size);

//         // Draw
//         gl.drawArrays(gl.POINTS, 0, 1);
//     }
// }

var g_shapesList = [];
// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {
    // extract event click, return it in webGL coords
    let [x, y] = convertCoordinatesEventToGL(ev);

    let point = new Point();
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