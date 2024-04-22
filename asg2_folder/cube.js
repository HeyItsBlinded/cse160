class Cube {
    constructor() {
        this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.segments = 10;
        this.matrix = new Matrix4(); // COMMENTED OUT as of 2.1
    }

    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // front of cube
        drawTriangle3D( [0.0,0.0,0.0,   1.0,1.0,0.0,   1.0,0.0,0.0] );
        drawTriangle3D( [0.0,0.0,0.0,   0.0,1.0,0.0,   1.0,1.0,0.0] );
        // add other sides of cube here
    }
}