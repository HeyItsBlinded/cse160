// WHATS ALREADY DONE
// ---------------------------------
// Vertex shader program
// var VSHADER_SOURCE = `
//     attribute vec4 a_Position;
//     uniform float u_Size;
//     void main() {
//         gl_Position = a_Position;
//         gl_PointSize = u_Size;
//     }`

// Fragment shader program
// var FSHADER_SOURCE = `
//     precision mediump float;
//     uniform vec4 u_FragColor;
//     void main() {
//         gl_FragColor = u_FragColor;
//     }`

// function setupwebGL()
// canvas = document.getElementById('webgl');
// gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
// if (!gl) {
//     console.log('Failed to get the rendering context for WebGL');
// return;
// }

// function connectvarstoGLSL()
// if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
//     console.log('Failed to intialize shaders.');
//     return;
// }
// a_Position = gl.getAttribLocation(gl.program, 'a_Position');
// if (a_Position < 0) {
//     console.log('Failed to get the storage location of a_Position');
// return;
// }
// u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
// if (!u_FragColor) {
//     console.log('Failed to get the storage location of u_FragColor');
// return;
// }
// u_Size = gl.getUniformLocation(gl.program, 'u_Size');
// if (!u_Size) {
//     console.log('Failed to get the storage location of u_Size');
// return;
// }

// ---------------------------------

class Custom{
    // constructor() {
    //     this.triangle1 = new Triangle();
    //     this.triangle1.position = [-0.5, 0.5, 0.0];
    //     this.triangle1.color = [1.0, 0.0, 0.0, 1.0];
    //     this.triangle1.size = 20.0;

    //     this.triangle2 = new Triangle();
    //     this.triangle2.position = [0.5, 0.5, 0.0];
    //     this.triangle2.color = [0.0, 0.0, 1.0, 1.0];
    //     this.triangle2.size = 20.0;
    // }
    render() {
        // this.triangle1.render();
        // this.triangle2.render();
        // console.log('both drawn');

        // NEW! --------------
        // gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // gl.clear(gl.COLOR_BUFFER_BIT);

        // set colors
        gl.uniform4f(u_Color, 0.380, 0.746, 0.880, 1.0);  // t1
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.uniform4f(u_Color, 0.956, 0.643, 0.376, 1.0);  // t2
        gl.drawArrays(gl.TRIANGLES, 3, 3);
        // -------------------
    }
 }

 // NEW! ---------------------
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