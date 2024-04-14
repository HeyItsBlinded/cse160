class Custom {
    constructor() {
        //
    }
    render() {
        //
        var w1 = new CustomTriangle();
        w1.color = [1.0, 0.0, 0.0, 1.0]; // Red
        w1.vertices = [
            -0.45,0.45,
            -0.9,0.35,
            -0.95,0.15
        ];
        g_shapesList.push(w1);

        var w2 = new CustomTriangle();
        w2.color = [1.0, 0.0, 0.0, 1.0]; // Red
        w2.vertices = [
            -0.45,0.45,
            -0.95,0.15,
            -0.85,-0.10
        ]; 
        g_shapesList.push(w2);

        var w3 = new CustomTriangle();
        w3.color = [1.0, 0.0, 0.0, 1.0]; // Red
        w3.vertices = [
            -0.45,0.45,
            -0.85,-0.10,
            -0.50,-0.20
        ];
        g_shapesList.push(w3);

        var w4 = new CustomTriangle();
        w4.color = [1.0, 0.0, 0.0, 1.0]; // Red
        w4.vertices = [
            -0.45,0.45,
            -0.50,-0.20,
             0.00,-0.20
        ];
        g_shapesList.push(w4);

        var w5 = new CustomTriangle();
        w5.color = [1.0, 0.0, 0.0, 1.0]; // Red
        w5.vertices = [
            -0.45,0.45,
             0.00,-0.20,
             0.00, 0.15
        ];
        g_shapesList.push(w5);
        console.log('all 20 printed');
    }
}

// make a class called triangle2, works the same as Triangle, but takes in vertices instead of position?
class CustomTriangle {
    constructor(vertices, color) { // NEW! - got rid of size input
        this.type = 'triangle';
        this.vertices = vertices; // Custom vertices
        this.color = color || [1.0, 1.0, 1.0, 1.0];
        // this.size = size || 5.0;
    }

    render() {
        var rgba = this.color;
        // var size = this.size;
        var vertices = this.vertices;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // gl.uniform1f(u_Size, size); // NEW! - commented out

        var n = vertices.length / 2;
        drawCustomTriangle(vertices);
    }
}

function drawCustomTriangle(vertices) {
    var n = vertices.length / 2;
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}
