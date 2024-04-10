// to avoid potential scoping issues
let canvas;
let ctx;

function main() {
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('failed to retrieve canvas');
        return;
    }

    ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVector(v, color) {
    ctx.strokeStyle = color;
    let cx = canvas.width/2;
    let cy = canvas.height/2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx+v.elements[0]*20, cy-v.elements[1]*20);
    ctx.stroke();
}

function handleDrawEvent() {
    // read the xy coords of v1
    var v1_xcoord = document.getElementById('v1_xcoord').value;
    var v1_ycoord = document.getElementById('v1_ycoord').value;
    var v1 = new Vector3([v1_xcoord, v1_ycoord, 0.0]);
    
    // clear the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // call drawVector(v1, "red")
    drawVector(v1, "red");
}