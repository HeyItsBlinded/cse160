// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' + 
  'attribute float a_PointSize; \n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' + 
  '  gl_PointSize = a_PointSize;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the point color
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // get storage location of attribute var
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('failed to get storage location of a_Position');
  }
  var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

  // pass vertex position to attribute var
  gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
  // set vertex pos to attribute var
  gl.vertexAttrib1f(a_PointSize, 5.0);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.POINTS, 0, 1);
}
