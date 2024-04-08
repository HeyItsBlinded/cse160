// vertex shader program
var VSHADER_SOURCE = 
    'void main() {\n' + 
    '   gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // coords
    '   gl_PointSize = 10.0;\n' + // set point size
    '}\n'

// fragment shader program
var FSHADER_SOURCE = 
    'void main() {\n' + 
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // set color
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('failed');
        return;
    }

    //initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('failed');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw point
    gl.drawArrays(gl.POINTS, 0, 1);
}