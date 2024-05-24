// class Cube2 {
//     constructor() {
//         this.type = 'cube2';
//         this.color = [1.0, 1.0, 1.0, 1.0];
//         this.matrix = new Matrix4();
//         this.textureNum = -2;
//     }

//     render() {
//         var rgba = this.color;

//         gl.uniform1i(u_whichTexture, this.textureNum);
//         gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

//         // NEW!
//         // gl.activeTexture(gl.TEXTURE0 + this.textureNum);
//         // gl.bindTexture(gl.TEXTURE_2D, texture);
//         // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

//         // pass the matrix to u_ModelMatrix attribute
//         gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

//         // -- A -----
//         // back cube - LGTM
//         drawTriangle3DUV( [0,0,0,   0,1,0,   1,1,0], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ > 0,1,  0.5,1,  0,0.5
//         drawTriangle3DUV( [0,0,0,   1,0,0,   1,1,0], [0,0.8,  0.2,0.8,  0.2,1] );   // /BOTTOM - < ^ > 0,0.8,  0.2,0.8,  0.2,1 
//         // front cube - LGTM
//         drawTriangle3DUV( [0,0,1,  0,1,1,  1,1,1], [0,0.8,  0,1,  0.2,1] );
//         drawTriangle3DUV( [0,0,1,  1,0,1,  1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );   // BOTTOM
//         // right cube - LGTM
//         drawTriangle3DUV( [1,0,0,   1,1,0,   1,1,1], [0,0.8,  0,1,  0.2,1] ); // /TOP - < ^ >
//         drawTriangle3DUV( [1,0,0,   1,0,1,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );// BOTTOM < ^ >
//         // left cube - LGTM
//         drawTriangle3DUV( [0,0,0,   0,1,0,   0,1,1], [0,0.8,  0,1,  0.2,1] );
//         drawTriangle3DUV( [0,0,0,   0,0,1,   0,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
//         // top of cube
//         drawTriangle3DUV( [0,1,0,   0,1,1,   1,1,1], [0,0.8,  0,1,  0.2,1] );
//         drawTriangle3DUV( [0,1,0,   1,1,0,   1,1,1], [0,0.8,  0.2,0.8,  0.2,1] );
//     }
// }