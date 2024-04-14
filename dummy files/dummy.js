// Vertex shader program - INCLUDED
// vars not included:
// u_Size
// gl_PointSize
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

// Fragment shader program - INCLUDED
var FSHADER_SOURCE =
  'precision mediump float;\n' + 
  'uniform vec4 u_Color;\n' + 
  'void main() {\n' + 
  ' gl_FragColor = u_Color;\n' + 
  '}\n'

var u_Color;

// SAME
function setupWebGL() { 
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
  return;
  }
}

// DIFF -
// not included:
// a_Position
// u_Size
// u_Color SAME AS u_FragColor
function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
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
}

// SET TRIANGLES HERE
function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0.25,0.4,   0.25,-0.4,   -0.25,-0.4, // v0 to v3
    -0.25,-0.4,   -0.25,0.4,   0.25,0.4  // v3 to v6
  ]);
  var n = 6; // The number of vertices

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