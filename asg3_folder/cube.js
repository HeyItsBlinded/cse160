class Cube {
    constructor() {
        this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = -1;
    }

    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // front cube
        drawTriangle3DUV( [0,0,0,   1,1,0,   1,0,0], [0,0,  1,1,  1,0] );
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0,  0,1,  1,1] );
        // drawTriangle3D( [0.0,0.0,0.0,   1.0,1.0,0.0,   1.0,0.0,0.0] );
        // drawTriangle3D( [0.0,0.0,0.0,   0.0,1.0,0.0,   1.0,1.0,0.0] );

        // back cube
        drawTriangle3DUV( [0,0,1,  1,1,1,  1,0,1], [0,0,  1,1,  1,0] );
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0,  0,1,  1,1] );
        // drawTriangle3D([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);
        // drawTriangle3D([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);

        // bottom cube
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,0,1], [0,0,  1,1,  1,0] );
        drawTriangle3DUV( [0,0,0,   1,0,1,   0,0,1], [0,0,  1,0,  0,1] );
        // drawTriangle3D([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0]);
        // drawTriangle3D([0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0]);

        // right cube
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,1,  1,1,  1,0] );
        drawTriangle3DUV( [1,0,0,   1,1,1,   1,0,1], [0,1,  1,0,  0,0] );
        // drawTriangle3D([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
        // drawTriangle3D([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);

        // left cube
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,1,  1,1,  1,0] );
        drawTriangle3DUV( [0,0,0,   0,1,1,   0,0,1], [0,1,  1,0,  0,0] );
        // drawTriangle3D([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]);
        // drawTriangle3D([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0]);

        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,1,  1,1,  1,0] );
        drawTriangle3DUV( [0,1,0,   1,1,1,   1,1,0], [0,1,  1,0,  0,0] );
        // drawTriangle3D( [0,1,0,   0,1,1,   1,1,1] );
        // drawTriangle3D( [0,1,0,   1,1,1,   1,1,0] );
        // add other sides of cube here
    }
}