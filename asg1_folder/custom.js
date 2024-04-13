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
    constructor() {
        this.triangle1 = new Triangle();
        this.triangle1.position = [-0.5, 0.5, 0.0];
        this.triangle1.color = [1.0, 0.0, 0.0, 1.0];
        this.triangle1.size = 20.0;

        this.triangle2 = new Triangle();
        this.triangle2.position = [0.5, 0.5, 0.0];
        this.triangle2.color = [0.0, 0.0, 1.0, 1.0];
        this.triangle2.size = 20.0;
    }
    render() {
        this.triangle1.render();
        this.triangle2.render();
        console.log('both drawn');
    }
 }
