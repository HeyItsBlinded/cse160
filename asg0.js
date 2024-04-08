// vertex shader program
var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' + 
    'void main() {\n' + 
    '   gl_Position = a_Position;\n' + // coords
    '   gl_PointSize = 10.0;\n' + // set point size
    '}\n'

// fragment shader program
var FSHADER_SOURCE = 
    'precision mediump float;\n' + 
    'uniform vec4 u_FragColor;\n' + // uniform var
    'void main() {\n' + 
    '   gl_FragColor = u_FragColor;\n' + // set color
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

    // get storage loc of u_FragColor variable
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    // (event handler) called on mouse click
    canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position, u_FragColor); };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var g_points = [];  // array for mouse click
    var g_colors = [];  // array to store color of a point
    function click(ev, gl, canvas, a_Position, u_FragColor) {
        var x = ev.clientX; // x coord
        var y = ev.clientY; // y coord
        var rect = ev.target.getBoundingClientRect();

        x = ((x - rect.left)- canvas.height/2) / (canvas.height/2);
        y = (canvas.width/2 - (y - rect.top)) / (canvas.width/2);
        // store coords to array 'g_points'
        g_points.push([x,y]);
        // store color to array 'g_colors'
        if (x >= 0.0 && y >= 0.0) { // 1st quadrant
            g_colors.push([1.0, 0.0, 0.0, 1.0]); // red
        } else if (x < 0.0 && y < 0.0) { // 3rd quadrant
            g_colors.push([0.0, 1.0, 0.0, 1.0]); // green
        } else {
            g_colors.push([1.0, 1.0, 1.0, 1.0]); // white
        }

        // clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        var len = g_points.length;
        for (var i = 0; i < len; i ++) {
            // pass pos of a point to the var 'a_Position'
            var xy = g_points[i];
            var rgba = g_colors[i];
            gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}