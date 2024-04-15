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

        // BODY 1 - 5
        var b1 = new CustomTriangle();
        b1.color = [0.860, 0.576, 0.00860, 1.0];
        b1.vertices = [
            -0.05,0.30,
            0.00,0.25,
            0.05,0.30
        ];
        g_shapesList.push(b1);

        var b2 = new CustomTriangle();
        b2.color = [0.860, 0.576, 0.00860, 1.0];
        b2.vertices = [
            -0.05,0.10,
            0.00,0.30,
            0.05,0.10
        ];
        g_shapesList.push(b2);

        var b3 = new CustomTriangle();
        b3.color = [0.860, 0.576, 0.00860, 1.0];
        b3.vertices = [
            -0.05,0.10,
            -0.05,-0.10,
            0.05,0.10
        ];
        g_shapesList.push(b3);

        var b4 = new CustomTriangle();
        b4.color = [0.860, 0.576, 0.00860, 1.0];
        b4.vertices = [
            0.05,0.10,
            -0.05,-0.10,
            0.05,-0.10
        ];
        g_shapesList.push(b4);

        var b5 = new CustomTriangle();
        b5.color = [0.860, 0.576, 0.00860, 1.0];
        b5.vertices = [
            -0.05,-0.10,
            0.05,-0.10,
            0.00,-0.50
        ];
        g_shapesList.push(b5);

        console.log('all 20 printed');

    }
}

class Custom2{
    constructor() {

    }
    render() {
        var f1 = new CustomTriangle();
        f1.color = [0.700, 0.545, 0.434, 1.0];
        f1.vertices = [
            -0.45,0.20,
            -0.15,0.50,
            -0.30,-0.65
        ];
        g_shapesList.push(f1);

        var f2 = new CustomTriangle();
        f2.color = [0.700, 0.545, 0.434, 1.0];
        f2.vertices = [
            -0.15,0.50,
            0.30,0.50,
            -0.30,-0.65
        ];
        g_shapesList.push(f2);

        var f3 = new CustomTriangle();
        f3.color = [0.700, 0.545, 0.434, 1.0];
        f3.vertices = [
            0.30,0.50,
            0.70,0.20,
            -0.30,-0.65
        ];
        g_shapesList.push(f3);

        var f4 = new CustomTriangle();
        f4.color = [0.700, 0.545, 0.434, 1.0];
        f4.vertices = [
            0.70,0.20,
            0.55,-0.35,
            -0.30,-0.65
        ];
        g_shapesList.push(f4);

        var f5 = new CustomTriangle();
        f5.color = [0.700, 0.545, 0.434, 1.0];
        f5.vertices = [
            0.55,-0.35,
            0.05,-0.70,
            -0.30,-0.65
        ];
        g_shapesList.push(f5);

        // NECK
        var n1 = new CustomTriangle();
        n1.color = [0.700, 0.545, 0.434, 1.0];
        n1.vertices = [
            0.60,-0.10,
            0.25,-0.10,
            0.60,-0.85
        ];
        g_shapesList.push(n1);

        var n2 = new CustomTriangle();
        n2.color = [0.700, 0.545, 0.434, 1.0];
        n2.vertices = [
            0.25,-0.10,
            0.25,-0.85,
            0.60,-0.85
        ];
        g_shapesList.push(n2);

        // EAR
        var e1 = new CustomTriangle();
        e1.color = [0.700, 0.545, 0.434, 1.0];
        e1.vertices = [
            0.65,0.10,
            0.75,0.05,
            0.50,-0.15
        ];
        g_shapesList.push(e1);

        var e2 = new CustomTriangle();
        e2.color = [0.700, 0.545, 0.434, 1.0];
        e2.vertices = [
            0.75,0.05,
            0.80,-0.05,
            0.50,-0.15
        ];
        g_shapesList.push(e2);

        var e3 = new CustomTriangle();
        e3.color = [0.700, 0.545, 0.434, 1.0];
        e3.vertices = [
            0.80,-0.05,
            0.70,-0.20,
            0.50,-0.15
        ];
        g_shapesList.push(e3);

        var e4 = new CustomTriangle();
        e4.color = [0.700, 0.545, 0.434, 1.0];
        e4.vertices = [
            0.70,-0.20,
            0.60,-0.20,
            0.50,-0.15
        ];
        g_shapesList.push(e4);

        // GLASSES
        var g1 = new CustomTriangle();
        g1.color = [0.266, 0.0656, 0.410, 1.0];
        g1.vertices = [
            -0.05,-0.10,
            -0.30,-0.15,
            -0.30,-0.30
        ];
        g_shapesList.push(g1);

        var g2 = new CustomTriangle();
        g2.color = [0.266, 0.0656, 0.410, 1.0];
        g2.vertices = [
            -0.05,-0.10,
            -0.05,-0.25,
            -0.30,-0.30
        ];
        g_shapesList.push(g2);

        var g3 = new CustomTriangle();
        g3.color = [0.266, 0.0656, 0.410, 1.0];
        g3.vertices = [
            -0.05,-0.10,
            -0.30,-0.15,
            0.45,0.05
        ];
        g_shapesList.push(g3);

        var g4 = new CustomTriangle();
        g4.color = [0.266, 0.0656, 0.410, 1.0];
        g4.vertices = [
            0.45,0.05,
            -0.30,-0.15,
            0.45,0.00
        ];
        g_shapesList.push(g4);

        var g5 = new CustomTriangle();
        g5.color = [0.266, 0.0656, 0.410, 1.0];
        g5.vertices = [
            0.05,-0.05,
            0.05,-0.25,
            0.45,0.00
        ];
        g_shapesList.push(g5);

        var g6 = new CustomTriangle();
        g6.color = [0.266, 0.0656, 0.410, 1.0];
        g6.vertices = [
            0.45,0.00,
            0.05,-0.25,
            0.45,-0.20
        ];
        g_shapesList.push(g6);

        // MOUTH
        var m1 = new CustomTriangle();
        m1.color = [0.883, 0.909, 0.910, 1.0];
        m1.vertices = [
            0.25,-0.35,
            -0.20,-0.50,
            -0.10,-0.60
        ];
        g_shapesList.push(m1);

        var m2 = new CustomTriangle();
        m2.color = [0.470, 0.0188, 0.177, 1.0];
        m2.vertices = [
            0.25,-0.35,
            -0.10,-0.60,
            0.10,-0.55
        ];
        g_shapesList.push(m2);
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
