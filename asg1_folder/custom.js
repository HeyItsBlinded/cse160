// Global variable to hold the vertex buffer
let customVertexBuffer = null; // NEW! - nesting solution from ChatGPT

class Custom {
    render() {
        if (!customVertexBuffer) {
            console.log('Vertex buffer is not initialized');
            return;
        }

        // Bind the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, customVertexBuffer);

        // Set up the attributes
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        // Set colors
        // gl.uniform4f(u_FragColor, 0.380, 0.746, 0.880, 1.0);  // t1
        // gl.drawArrays(gl.TRIANGLES, 0, 3);
        // gl.uniform4f(u_FragColor, 0.956, 0.643, 0.376, 1.0);  // t2
        // gl.drawArrays(gl.TRIANGLES, 3, 3);
        gl.uniform4f(u_FragColor, 0.956, 0.643, 0.376, 1.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);  // BODY_COLOR
    }
}

// Function to initialize the vertex buffer for Custom shapes
function initVertexBuffer(gl) {
    var vertices = new Float32Array([
        // 0.25, 0.4, 0.25, -0.4, -0.25, -0.4, // v0 to v3
        // -0.25, -0.4, -0.25, 0.4, 0.25, 0.4 // v3 to v6

        // BODY
        -0.05,0.30,   0.00,0.25,   0.05,0.30, // t1
        -0.05,0.10,   0.00,0.30,   0.05,0.10 // t2
        // -0.05,0.10,  -0.05,-0.10,  0.05,0.10 // t3
    ]);

    // Create a buffer object
    customVertexBuffer = gl.createBuffer();
    if (!customVertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, customVertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

}