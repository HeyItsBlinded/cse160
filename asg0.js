// vertex shader program
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' + 
    'void main() {\n' + 
    '   gl_Position = a_Position;\n' + // coords
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

    // get storage loc of attribute variable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('failed');
        return;
    }

    // (event handler) called on mouse click
    canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position); };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var g_points = [];  // array for mouse click
    function click(ev, gl, canvas, a_Position) {
        var x = ev.clientX; // x coord
        var y = ev.clientY; // y coord
        var rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left)- canvas.height/2) / (canvas.height/2);
        y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2);
        g_points.push(x); g_points.push(y); // store coords to array 'g_points'

        // clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        var len = g_points.length;
        for (var i = 0; i < len; i += 2) {
            // pass pos of a point to the var 'a_Position'
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}