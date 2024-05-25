class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -2;
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // NEW!
        // gl.activeTexture(gl.TEXTURE0 + this.textureNum);
        // gl.bindTexture(gl.TEXTURE_2D, texture);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        // front cube - LGTM
        drawTriangle3DUVNormal( [0,0,0,   1,1,0,   1,0,0], [0,0,  1,1,  1,0], [0,0,-1,  0,0,-1,  0,0,-1] );
        drawTriangle3DUVNormal( [0,0,0,   0,1,0,   1,1,0], [0,0,  0,1,  1,1], [0,0,-1,  0,0,-1,  0,0,-1] );

        // back cube - LGTM
        drawTriangle3DUVNormal( [0,0,1,  1,1,1,  1,0,1], [0,0,  1,1,  1,0], [0,0,1,  0,0,1,  0,0,1] );
        drawTriangle3DUVNormal( [0,0,1,  0,1,1,  1,1,1], [0,0,  0,1,  1,1], [0,0,1,  0,0,1,  0,0,1] );

        // hard-coded shading - QUALITY OF LIFE (TEMPORARY)
        // gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);

        // bottom cube
        drawTriangle3DUVNormal( [0,0,0,   1,0,0,   1,0,1], [0,0,  1,1,  1,0], [0,-1,0,  0,-1,0,  0,-1,0] );
        drawTriangle3DUVNormal( [0,0,0,   1,0,1,   0,0,1], [0,0,  1,0,  0,1], [0,-1,0,  0,-1,0,  0,-1,0] );
        // hard-coded shading - QUALITY OF LIFE (TEMPORARY)
        // gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        // right cube - LGTM
        drawTriangle3DUVNormal( [1,0,0,   1,1,0,   1,1,1], [0,0,  0,1,  1,1], [1,0,0,  1,0,0,  1,0,0] );
        drawTriangle3DUVNormal( [1,0,0,   1,1,1,   1,0,1], [0,0,  1,1,  1,0], [1,0,0,  1,0,0,  1,0,0] );
        // hard-coded shading - QUALITY OF LIFE (TEMPORARY)
        // gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

        // left cube - LGTM
        drawTriangle3DUVNormal( [0,0,0,   0,1,0,   0,1,1], [0,0,  0,1,  1,1], [-1,0,0,  -1,0,0,  -1,0,0] );
        drawTriangle3DUVNormal( [0,0,0,   0,1,1,   0,0,1], [0,0,  1,1,  1,0], [-1,0,0,  -1,0,0,  -1,0,0] );
        // hard-coded shading - QUALITY OF LIFE (TEMPORARY)
        // gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        // top of cube
        drawTriangle3DUVNormal( [0,1,0,   0,1,1,   1,1,1], [0,1,  1,1,  1,0], [0,1,0,  0,1,0,  0,1,0] );
        drawTriangle3DUVNormal( [0,1,0,   1,1,1,   1,1,0], [0,1,  1,0,  0,0], [0,1,0,  0,1,0,  0,1,0] );
    }
}

class Trapezoid {
    constructor() {
        this.type = 'trapezoid';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // // FRONT TRAP
        // drawTriangle3D( [-0.1,0,0,   0.1,0,0,   -0.2,-0.6,0] );
        // drawTriangle3D( [0.1,0,0,   -0.2,-0.6,0,   0.2,-0.6,0] );

        // // BACK TRAP
        // drawTriangle3D( [-0.1,0,0.2,   0.1,0,0.2,   -0.2,-0.6,0.2] );
        // drawTriangle3D( [0.1,0,0.2,   -0.2,-0.6,0.2,   0.2,-0.6,0.2] );

        // // LEFT SIDE
        // gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);
        // drawTriangle3D( [0.1,0,0,   0.2,-0.6,0,   0.1,0,0.2] );
        // drawTriangle3D( [0.2,-0.6,0,   0.1,0,0.2,   0.2,-0.6,0.2] );

        // // RIGHT SIDE
        // drawTriangle3D( [-0.1,0,0,   -0.2,-0.6,0.0,   -0.2,-0.6,0.2] );
        // drawTriangle3D( [-0.1,0,0,   -0.1,0,0.2,   -0.2,-0.6,0.2] );

        // // TOP TRAP
        // gl.uniform4f(u_FragColor, rgba[0]*0.65, rgba[1]*0.65, rgba[2]*0.65, rgba[3]);
        // drawTriangle3D( [-0.1,0.0,0.0,   -0.1,0.0,0.2,   0.1,0.0,0.0] );
        // drawTriangle3D( [-0.1,0.0,0.2,   0.1,0.0,0.0,   0.1,0.0,0.2] );

        // // BOTTOM TRAP
        // drawTriangle3D( [-0.2,-0.6,0.0,   -0.2,-0.6,0.2,   0.2,-0.6,0.2] );
        // drawTriangle3D( [-0.2,-0.6,0.0,   0.2,-0.6,0.0,   0.2,-0.6,0.2] );
// -----------------------
        // FRONT TRAP
        drawTriangle3D( [0.1,0.0,0.0,   0.3,0.0,0.15,   0.3,0.0,0.25] );    // ABC
        drawTriangle3D( [0.1,0.0,0.0,   0.3,0.0,0.25,   0.1,0.0,0.40] );    // ACD

        //BACK TRAP
        drawTriangle3D( [0.1,0.2,0.0,   0.3,0.2,0.15,   0.3,0.2,0.25] );    // EFG
        drawTriangle3D( [0.1,0.2,0.0,   0.3,0.2,0.25,   0.1,0.2,0.40] );    // EGH

        // TOP TRAP
        gl.uniform4f(u_FragColor, rgba[0]*0.65, rgba[1]*0.65, rgba[2]*0.65, rgba[3]);
        drawTriangle3D([0.3,0.0,0.15,   0.3,0.2,0.15,   0.3,0.2,0.25] );    // BFG
        drawTriangle3D([0.3,0.0,0.15,   0.3,0.2,0.25,   0.3,0.0,0.25] );    // BGC

        // BOTTOM TRAP
        drawTriangle3D( [0.1,0.0,0.0,   0.1,0.2,0.0,   0.1,0.2,0.4] );    // AEH
        drawTriangle3D( [0.1,0.0,0.0,   0.1,0.2,0.4,   0.1,0.0,0.4] );    // AHD

        // SIDE 1 TRAP
        gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);
        drawTriangle3D( [0.1,0.0,0.0,   0.1,0.2,0.00,   0.3,0.2,0.15] );   // AEF
        drawTriangle3D( [0.1,0.0,0.0,   0.3,0.2,0.15,   0.3,0.0,0.15] );   // AFB

        // SIDE 2 TRAP
        drawTriangle3D( [0.3,0.0,0.25,   0.3,0.2,0.25,   0.1,0.2,0.4] );   // CGH
        drawTriangle3D( [0.3,0.0,0.25,   0.1,0.2,0.40,   0.1,0.0,0.4] );   // CHD
    }
}