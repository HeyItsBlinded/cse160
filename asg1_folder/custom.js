class Custom {
    constructor() {
        //
    }
    render() {
        // WINGS 1 - 16
        var w1 = new CustomTriangle();
        w1.color = [0.428, 0.0584, 0.730, 1.0];
        w1.vertices = [
            -0.45,0.45,
            -0.9,0.35,
            -0.95,0.15
        ];
        g_shapesList.push(w1);

        var w2 = new CustomTriangle();
        w2.color = [0.428, 0.0584, 0.730, 1.0]; 
        w2.vertices = [
            -0.45,0.45,
            -0.95,0.15,
            -0.85,-0.10
        ]; 
        g_shapesList.push(w2);

        var w3 = new CustomTriangle();
        w3.color = [0.428, 0.0584, 0.730, 1.0]; 
        w3.vertices = [
            -0.45,0.45,
            -0.85,-0.10,
            -0.50,-0.20
        ];
        g_shapesList.push(w3);

        var w4 = new CustomTriangle();
        w4.color = [0.428, 0.0584, 0.730, 1.0];
        w4.vertices = [
            -0.45,0.45,
            -0.50,-0.20,
             0.00,-0.20
        ];
        g_shapesList.push(w4);

        var w5 = new CustomTriangle();
        w5.color = [0.428, 0.0584, 0.730, 1.0];
        w5.vertices = [
            -0.45,0.45,
             0.00,-0.20,
             0.00, 0.15
        ];
        g_shapesList.push(w5);

        var w6 = new CustomTriangle();
        w6.color = [0.428, 0.0584, 0.730, 1.0];
        w6.vertices = [
            0.45,0.45,
            0.00,0.15,
            0.00,-0.20
        ];
        g_shapesList.push(w6);

        var w7 = new CustomTriangle();
        w7.color = [0.428, 0.0584, 0.730, 1.0];
        w7.vertices = [
            0.45,0.45,
            0.00,-0.20,
            0.50,-0.20
        ];
        g_shapesList.push(w7);

        var w8 = new CustomTriangle();
        w8.color = [0.428, 0.0584, 0.730, 1.0];
        w8.vertices = [
            0.45,0.45,
            0.50,-0.20,
            0.85,-0.10
        ];
        g_shapesList.push(w8);

        var w9 = new CustomTriangle();
        w9.color = [0.428, 0.0584, 0.730, 1.0];
        w9.vertices = [
            0.45,0.45,
            0.85,-0.10,
            0.95,0.15
        ];
        g_shapesList.push(w9);

        var w10 = new CustomTriangle();
        w10.color = [0.428, 0.0584, 0.730, 1.0];
        w10.vertices = [
            0.45,0.45,
            0.95,0.15,
            0.90,0.35
        ];
        g_shapesList.push(w10);

        var w11 = new CustomTriangle();
        w11.color = [0.428, 0.0584, 0.730, 1.0];
        w11.vertices = [
            -0.35,-0.20,
            -0.45,-0.40,
            0.00,-0.20
        ];
        g_shapesList.push(w11);

        var w12 = new CustomTriangle();
        w12.color = [0.428, 0.0584, 0.730, 1.0];
        w12.vertices = [
            0.00,-0.20,
            -0.45,-0.40,
            -0.30,-0.50
        ];
        g_shapesList.push(w12);

        var w13 = new CustomTriangle();
        w13.color = [0.428, 0.0584, 0.730, 1.0];
        w13.vertices = [
            0.00,-0.20,
            -0.30,-0.50,
            0.00,-0.40
        ];
        g_shapesList.push(w13);

        var w14 = new CustomTriangle();
        w14.color = [0.428, 0.0584, 0.730, 1.0];
        w14.vertices = [
            0.00,-0.20,
            0.00,-0.40,
            0.30,-0.50
        ];
        g_shapesList.push(w14);

        var w15 = new CustomTriangle();
        w15.color = [0.428, 0.0584, 0.730, 1.0];
        w15.vertices = [
            0.00,-0.20,
            0.30,-0.50,
            0.45,-0.40
        ];
        g_shapesList.push(w15);

        var w16 = new CustomTriangle();
        w16.color = [0.428, 0.0584, 0.730, 1.0];
        w16.vertices = [
            0.00,-0.20,
            0.45,-0.40,
            0.35,-0.20
        ];
        g_shapesList.push(w16);
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
