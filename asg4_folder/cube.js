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
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // front cube - LGTM
        drawTriangle3DUVNormal( [0,0,0,   1,1,0,   1,0,0], [0,0,  1,1,  1,0], [0,0,-1,  0,0,-1,  0,0,-1] );
        drawTriangle3DUVNormal( [0,0,0,   0,1,0,   1,1,0], [0,0,  0,1,  1,1], [0,0,-1,  0,0,-1,  0,0,-1] );

        // top of cube
        drawTriangle3DUVNormal( [0,1,0,   0,1,1,   1,1,1], [0,1,  1,1,  1,0], [0,1,0,  0,1,0,  0,1,0] );
        drawTriangle3DUVNormal( [0,1,0,   1,1,1,   1,1,0], [0,1,  1,0,  0,0], [0,1,0,  0,1,0,  0,1,0] );

        // right cube - LGTM
        drawTriangle3DUVNormal( [1,0,0,   1,1,0,   1,1,1], [0,0,  0,1,  1,1], [1,0,0,  1,0,0,  1,0,0] );
        drawTriangle3DUVNormal( [1,0,0,   1,1,1,   1,0,1], [0,0,  1,1,  1,0], [1,0,0,  1,0,0,  1,0,0] );

        // left cube - LGTM
        drawTriangle3DUVNormal( [0,0,0,   0,1,0,   0,1,1], [0,0,  0,1,  1,1], [-1,0,0,  -1,0,0,  -1,0,0] );
        drawTriangle3DUVNormal( [0,0,0,   0,1,1,   0,0,1], [0,0,  1,1,  1,0], [-1,0,0,  -1,0,0,  -1,0,0] );

        // bottom cube
        drawTriangle3DUVNormal( [0,0,0,   1,0,0,   1,0,1], [0,0,  1,1,  1,0], [0,-1,0,  0,-1,0,  0,-1,0] );
        drawTriangle3DUVNormal( [0,0,0,   1,0,1,   0,0,1], [0,0,  1,0,  0,1], [0,-1,0,  0,-1,0,  0,-1,0] );

        // back cube - LGTM
        drawTriangle3DUVNormal( [0,0,1,  1,1,1,  1,0,1], [0,0,  1,1,  1,0], [0,0,1,  0,0,1,  0,0,1] );
        drawTriangle3DUVNormal( [0,0,1,  0,1,1,  1,1,1], [0,0,  0,1,  1,1], [0,0,1,  0,0,1,  0,0,1] );
    }
}