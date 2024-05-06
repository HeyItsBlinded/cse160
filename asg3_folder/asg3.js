// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        // gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`

// Fragment shader program
// var FSHADER_SOURCE = `
//     precision mediump float;
//     varying vec2 v_UV;
//     uniform vec4 u_FragColor;
//     uniform sampler2D u_Sampler0;
//     uniform sampler2D u_Sampler1;
//     uniform int u_whichTexture;
//     void main() {
//         if (u_whichTexture == -2) {
//             gl_FragColor = u_FragColor;
//         } else if (u_whichTexture == -1) {
//             gl_FragColor = vec4(v_UV, 1.0, 1.0);
//         } else if (u_whichTexture == 0) {
//             gl_FragColor = texture2D(u_Sampler0, v_UV);
//         } if  (u_whichTexture == 1) {
//             gl_FragColor = texture2D(u_Sampler1, v_UV);
//         } else {
//             gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
//         }
//     }`
    var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform int u_whichTexture;
    void main() {
  
      if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;            // Use color
      }
      else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);  // Use UV debug color
      }
      else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);  // Use texture0
      }
      else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV); // Use texture1
      }
      else {
        gl_FragColor = vec4(1, .2, .2, 1);      // Error, put red
      }
    }`

// global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// global vars for ui
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegment = 5;
let g_globalAngle = 0;
let g_yellowAngle = 0;  // ADDED IN 2.6
let g_magentaAngle = 0; // ADDED IN 2.7
let g_yellowAnimation = false;
let g_magentaAnimation = false;
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsUI();
    initTextures();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // renderAllShapes();
    requestAnimationFrame(tick);
}

function setupWebGL() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (!a_UV < 0) {
        console.log('failed to get storage location of a_UV');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
    return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('failed to get storage location of u_whichTexture');
        return false;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('failed to get storage location of u_GlobalRotateMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('failed to get storage location of u_ViewMatrix');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('failed to get storage location of u_ProjectionMatrix');
        return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('failed to get storage location of u_Sampler0');
        return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('failed to get storage location of u_Sampler1');
        return false;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// html functionality implementation
function addActionsUI() {

    // CAMERA ANGLE SLIDER
    document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

    // // YELLOW JOINT SLIDER
    // document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
    // // MAGENTA JOINT SLIDER
    // document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes(); });
    // // TOGGLE YELLOW ANIMATION BUTTON
    // document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation = false;};
    // document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation = true;};
    // // TOGGLE MAGENTA ANIMATION BUTTON
    // document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation = false;};
    // document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation = true;};    
}

function click(ev) {
    // extract event click, return it in webGL coords
    let [x, y] = convertCoordinatesEventToGL(ev);
    // create and store new point
    let point;
    if (g_selectedType == POINT) {
        point = new Point();
    } else if (g_selectedType == TRIANGLE) {
        point = new Triangle();
    } else  if (g_selectedType == CIRCLE) {
        point = new Circle();
        point.segments = g_selectedSegment;
    }
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);
    // draw all shapes in/on the canvas
    renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return ([x, y]);
}

function sendTextToHTML(text, htmlID) {
    var element = document.getElementById(htmlID);
    if (!element) {
        console.log('failed to get ' + htmlID + " from HTML");
        return;
    }
    element.innerHTML = text;
}

function tick() {
    g_seconds = performance.now() / 1000.0 - g_startTime;
    // console.log(g_seconds); // FOR DEBUG
    // update animation angles
    updateAnimationAngles();
    // draw everything
    renderAllShapes();
    // tell browser to update again when it has time
    requestAnimationFrame(tick);
}

// updates angles of everything if currently animated
function updateAnimationAngles() {
    if (g_yellowAnimation) {
        g_yellowAngle = (45 * Math.sin(g_seconds));
    }
    if (g_magentaAnimation) {
        g_magentaAngle = (45 * Math.sin(3 * g_seconds));
    }
}

// TEXTURE EDITING HERE
// function initTextures() {
//     // ----------
//     var skyTEXTURE = new Image();
//     if (!skyTEXTURE) {
//         console.log('failed to create skyTEXTURE object');
//         return false;
//     }
//     skyTEXTURE.onload = function() { sendImageToTEXTURE(skyTEXTURE, 0); };
//     skyTEXTURE.src = 'sky.png';
//     // ----------
//     var groundTEXTURE = new Image();
//     if (!groundTEXTURE) {
//         console.log('failed to create groundTEXTURE object');
//         return false;
//     }
//     groundTEXTURE.onload = function() { sendImageToTEXTURE(groundTEXTURE, 1); };
//     groundTEXTURE.src = 'ground.png';
//     // ----------

//     // MORE TEXTURE LOADING HERE
//     return true;
// }
function initTextures() {

    // Create image object
    // Dirt
    var imageDirt = new Image();
    if (!imageDirt) {
      console.log('Failed to create the image object');
      return false;
    }
    // Register the event handler to be called on loading an image
    imageDirt.onload = function() { sendImageToTEXTURE(imageDirt, 0);}
    imageDirt.src = 'ground.png';
  
    // Sky
    var imageSky = new Image();
    if (!imageSky) {
      console.log('Failed to create the image object');
      return false;
    }
  
    imageSky.onload = function() { sendImageToTEXTURE(imageSky, 1);}
    imageSky.src = 'sky.png';
    return true;
  
  
  }

// function sendImageToTEXTURE(image, num) {
//     var texture = gl.createTexture();
//     if (!texture) {
//         console.log('failed to create the texture object');
//         return false;
//     }

//     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

//     // gl.activeTexture(gl.TEXTURE0);
//     if (num == 0) {
//         gl.activeTexture(gl.TEXTURE0);
//     } else if (num == 1) {
//         gl.activeTexture(gl.TEXTURE1);
//     }

//     gl.bindTexture(gl.TEXTURE_2D, texture);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

//     gl.uniform1i(u_Sampler0, 0);
//     gl.uniform1i(u_Sampler1, 1);
//     console.log('finished loadTexture');
// }

// NEW!
function sendImageToTEXTURE(image, num) {

    // Create texture object
    var texture = gl.createTexture(); 
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }
  
    // flip image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
    // enable texture unit0
    //gl.activeTexture(gl.TEXTURE0);
  
    if (num == 0) {
      gl.activeTexture(gl.TEXTURE0);
    }
    else if (num == 1) {
      gl.activeTexture(gl.TEXTURE1);
    }
    
    // bind texture object to target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
    // set texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // set texture unit 0 to sampler
    gl.uniform1i(u_Sampler0, 0);
    gl.uniform1i(u_Sampler1, 1);
  
    console.log('finished loadTexture');
  
  }

function renderAllShapes() {

    // pass the proj matrix
    var projMat = new Matrix4();
    projMat.setPerspective(50, 1 * canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    // pass the view matrix
    var viewMat = new Matrix4();
    viewMat.setLookAt(0,0,3,   0,0,-100,   0,1,0);    // GUIDE - (eye, at, up)
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // pass matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // prevents flicker and disappearing shapes with DEPTH_TEST - solved with chatGPT
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ----- CUBES ---------------
    // SKY
    var sky = new Cube();
    sky.color = [1.0, 0.0, 0.0, 1.0];
    sky.textureNum = 1;
    sky.render();

    // GROUND
    var ground = new Cube();
    ground.color = [1.0, 0.0, 0.0, 1.0];
    ground.textureNum = 0;
    ground.matrix.translate(-0.25,-0.05,-0.25);
    ground.matrix.scale(1.5,0.1,1.5);
    ground.render();

}