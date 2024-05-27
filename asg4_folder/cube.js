// LGTM
class Cube {
    constructor() {
        this.type = "cube";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();

        // SHINY CUBE IMPLEMENTATION
        this.textureNum = -2;
        this.normalMatrix = new Matrix4();
        this.buffer = null;
        this.uvBuffer = null;
        this.normalBuffer = null;
    }

    render() {
        
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // SHINY CUBE IMPLEMENTATION
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        if (this.buffer === null) {
            this.buffer = gl.createBuffer(); 
        }
        if (this.uvBuffer === null) {
            this.uvBuffer = gl.createBuffer();
        }
        if (this.normalBuffer === null) {
            this.normalBuffer = gl.createBuffer();
        }
        
        // front cube - LGTM
        drawTriangle3DUVNormal( [0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0], [0, 0, -1, 0, 0, -1, 0, 0, -1], this.buffer, this.uvBuffer, this.normalBuffer);
        drawTriangle3DUVNormal( [0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1], [0, 0, -1, 0, 0, -1, 0, 0, -1], this.buffer, this.uvBuffer, this.normalBuffer);

        // top cube - LGTM
        drawTriangle3DUVNormal( [0, 1, 0,  0, 1, 1,  1, 1, 1], [0, 1, 0, 0, 1, 0], [0, 1, 0, 0, 1, 0, 0, 1, 0], this.buffer, this.uvBuffer, this.normalBuffer);
        drawTriangle3DUVNormal( [0, 1, 0,  1, 1, 1,  1, 1, 0], [0, 1, 1, 0, 1, 1], [0, 1, 0, 0, 1, 0, 0, 1, 0], this.buffer, this.uvBuffer, this.normalBuffer);
        
        // right cube - LGTM
        drawTriangle3DUVNormal( [1, 1, 0, 1, 1, 1, 1, 0, 0], [0, 1, 1, 1, 0, 0], [1, 0, 0, 1, 0, 0, 1, 0, 0], this.buffer,this.uvBuffer, this.normalBuffer);
        drawTriangle3DUVNormal( [1, 0, 0, 1, 1, 1, 1, 0, 1], [0, 0, 1, 1, 1, 0], [1, 0, 0, 1, 0, 0, 1, 0, 0], this.buffer, this.uvBuffer, this.normalBuffer);
        
        // left cube - LGTM
        drawTriangle3DUVNormal( [0, 0, 0,  0, 0, 1,  0, 1, 1], [0, 0, 1, 0, 1, 1], [-1, 0, 0, -1, 0, 0, -1, 0, 0], this.buffer, this.uvBuffer, this.normalBuffer);
        drawTriangle3DUVNormal( [0, 0, 0,  0, 1, 0,  0, 1, 1], [0, 0, 0, 1, 1, 1], [-1, 0, 0, -1, 0, 0, -1, 0, 0], this.buffer, this.uvBuffer, this.normalBuffer);
        
        // bottom cube
        drawTriangle3DUVNormal( [1, 0, 1,  1, 0, 0,  0, 0, 0], [0, 0, 0, 1, 1, 1], [0, -1, 0, 0, -1, 0, 0, -1, 0], this.buffer, this.uvBuffer, this.normalBuffer);
        drawTriangle3DUVNormal( [1, 0, 1,  0, 0, 0,  0, 0, 1], [0, 0, 1, 1, 1, 0], [0, -1, 0, 0, -1, 0, 0, -1, 0], this.buffer, this.uvBuffer, this.normalBuffer);

        // back cube - LGTM
        drawTriangle3DUVNormal( [1, 1, 1,  0, 0, 1,  0, 1, 1 ], [1, 1, 0, 0, 0, 1], [0, 0, 1, 0, 0, 1, 0, 0, 1], this.buffer, this.uvBuffer, this.normalBuffer);
        drawTriangle3DUVNormal( [1, 1, 1,  1, 0, 1,  0, 0, 1 ], [1, 1, 1, 0, 0, 0], [0, 0, 1, 0, 0, 1, 0, 0, 1], this.buffer, this.uvBuffer, this.normalBuffer);
        
    }
}
