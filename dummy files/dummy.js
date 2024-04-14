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

function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
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

function main() {
  setupWebGL();
  connectVariablesToGLSL();

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
  gl.uniform4f(u_Color, 0.380, 0.746, 0.880, 1.0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.uniform4f(u_Color, 0.956, 0.643, 0.376, 1.0);
  gl.drawArrays(gl.TRIANGLES, 3, 3);

  gl.uniform4f(u_Color, 1.0, 0.0, 0.0, 1.0);  //t1 color
  gl.drawArrays(gl.TRIANGLES, 6, 6);
}

// SET TRIANGLES HERE
function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0.25, 0.4, 0.25, -0.4, -0.25, -0.4, // v0 to v3
    -0.25, -0.4, -0.25, 0.4, 0.25, 0.4, // v3 to v6
    1.0,0.0,   1.0,-0.5,   0.5,0.-0.5, // t1
    1.0,1.0,   0.5,0.5,   1.0,0.5, // t2
  ]);
  var n = 12; // The number of vertices

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
document.getElementById('switchButton').addEventListener('change', function () {
  if (this.checked) {
    main();
  } else {
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  
});
