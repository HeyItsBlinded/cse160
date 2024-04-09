function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
  
    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
  
    // Set clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // function call
    drawVector(v1, "red");
  }
  
function drawVector(v, color) {
    gl.strokeStyle = color;
    gl.beginPath();
    gl.moveTo(canvas.width/2, canvas.height/2);
    gl.lineTo(v[0]*20, v[1]*20);
    gl.stroke();
}

var v1 = new Vector3([0.0, 0.0, 0]);

// In asg0.js, instantiate a vector v1 using the Vector3 class from 
// cuon-matrix.js library (set the z coordinate to zero). DONE

// In asg0.js, create a function drawVector(v, color) that takes a 
// Vector3 v and a string color (e.g. "red").  Inside this function, use 
// the builtin javascript function lineTo() to draw the vector v1. The 
// resolution of the canvas is 400x400, so scale your v1 coordinates by 
// 20 when drawing it. This will make it easier to visualize vectors with 
// length 1.

// Call drawVector(v1, "red") in the main() function. DONE