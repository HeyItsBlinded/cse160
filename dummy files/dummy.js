var u_Color;
var gl;

// Vertex shader program
var VSHADER_SOURCE_CUSTOM = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }`

var FSHADER_SOURCE_CUSTOM = `
    precision mediump float;
    uniform vec4 u_Color;
    void main() {
        gl_FragColor = u_Color;
    }`

function setupWebGL_2() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL_2() {
  if (!initShaders(gl, VSHADER_SOURCE_CUSTOM, FSHADER_SOURCE_CUSTOM)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  u_Color = gl.getUniformLocation(gl.program, 'u_Color');
  if (!u_Color) {
    console.log('failed to get loc of u_Color');
    return;
  }
}

function main_2() {
  setupWebGL_2();
  connectVariablesToGLSL_2();

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // SET COLORS HERE
  gl.uniform4f(u_Color, 0.5, 0.0, 1.0, 1.0); // LWING_COLOR
  gl.drawArrays(gl.TRIANGLES, 0, 15);   

  gl.uniform4f(u_Color, 0.956, 0.643, 0.376, 1.0);  // BODY_COLOR
  gl.drawArrays(gl.TRIANGLES, 16, 15);

  // gl.uniform4f(u_Color, 0.956, 0.643, 0.376, 1.0);
  // gl.drawArrays(gl.TRIANGLES, 3, 3);

  // gl.uniform4f(u_Color, 1.0, 0.0, 0.0, 1.0);  //t1 color
  // gl.drawArrays(gl.TRIANGLES, 6, 6);
}

// SET TRIANGLES HERE
function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    // LWING
    -0.45,0.45,   -0.90,0.35,  -0.90,0.15, // w1
    -0.45,0.45,   -0.90,0.15, -0.85,-0.10, // w2
    -0.45,0.45,   -0.85,-0.10,-0.50,-0.20, // w3
    -0.45,0.45,   -0.50,-0.20, 0.00,-0.20, // w4
    -0.45,0.45,    0.00,-0.20, 0.00,0.15,  // w5        

    // BODY
    -0.05,0.30,   0.00,0.25,   0.05,0.30, // t1
    -0.05,0.10,   0.00,0.30,   0.05,0.10, // t2
    -0.05,0.10,   -0.05,-0.10, 0.05,0.10, // t3
    -0.05,-0.10,  0.05,-0.10,  0.05,0.10, // t4
    -0.05,-0.10,  0.05,-0.10,  0.00,-0.50,// t5
  ]);
  var n = 30; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}

// Event listener for button click
// document.getElementById('switchButton').addEventListener('change', function () {
//   if (this.checked) {
//     main_2();
//   } else {
//     gl.clear(gl.COLOR_BUFFER_BIT);
//   }
  
// });
