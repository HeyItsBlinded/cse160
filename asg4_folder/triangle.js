// LGTM
function drawTriangle3D(vertices) {
var n = 3
// Create a buffer object
var vertexBuffer = gl.createBuffer();
if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
}
// Bind the buffer object to target
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// Write date into the buffer object
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); // STATIC_DRAW vs DYNAMIC_DRAW

// Assign the buffer object to a_Position variable
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
// Enable the assignment to a_Position variable
gl.enableVertexAttribArray(a_Position);

gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv) {
var n = 3;

var vertexBuffer = gl.createBuffer();
if (!vertexBuffer) {
    console.log('failed to create the buffer object');
    return -1;
}

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_Position);

var uvBuffer = gl.createBuffer();
if (!uvBuffer) {
    console.log('failed to create the buffer object');
    return -1;
}

gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_UV);

gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUVNormal(vertices, uv, normals) {
var n = vertices.length / 3;

// VERTEX BUFFER
var vertexBuffer = gl.createBuffer();
if (!vertexBuffer) {
    console.log('failed to create the buffer object');
    return -1;
}
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_Position);

// UV BUFFER
var uvBuffer = gl.createBuffer();
if (!uvBuffer) {
    console.log('failed to create the buffer object');
    return -1;
}
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_UV);

// NORMAL BUFFER
var normalBuffer = gl.createBuffer();
if (!normalBuffer) {
    console.log('failed to create the buffer object');
    return -1;
}
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(a_Normal);

gl.drawArrays(gl.TRIANGLES, 0, n);
g_vertexBuffer = null;
}
  