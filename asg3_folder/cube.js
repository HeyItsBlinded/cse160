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
        drawTriangle3DUV( [0,0,0,   1,1,0,   1,0,0], [0,0,  1,1,  1,0] );
        drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0,  0,1,  1,1] );

        // back cube - LGTM
        drawTriangle3DUV( [0,0,1,  1,1,1,  1,0,1], [0,0,  1,1,  1,0] );
        drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0,  0,1,  1,1] );

        // hard-coded shading - QUALITY OF LIFE (TEMPORARY)
        gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);

        // bottom cube
        drawTriangle3DUV( [0,0,0,   1,0,0,   1,0,1], [0,0,  1,1,  1,0] );
        drawTriangle3DUV( [0,0,0,   1,0,1,   0,0,1], [0,0,  1,0,  0,1] );

        // right cube - LGTM
        drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0,  0,1,  1,1] );
        drawTriangle3DUV( [1,0,0,   1,1,1,   1,0,1], [0,0,  1,1,  1,0] );

        // left cube - LGTM
        drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0,  0,1,  1,1] );
        drawTriangle3DUV( [0,0,0,   0,1,1,   0,0,1], [0,0,  1,1,  1,0] );

        // top of cube
        drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,1,  1,1,  1,0] );
        drawTriangle3DUV( [0,1,0,   1,1,1,   1,1,0], [0,1,  1,0,  0,0] );
    }
}