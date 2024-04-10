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

    // read the xy coords of v2
    var v2_xcoord = document.getElementById('v2_xcoord').value;
    var v2_ycoord = document.getElementById('v2_ycoord').value;
    var v2 = new Vector3([v2_xcoord, v2_ycoord, 0.0]);
    
    // clear the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // call drawVector(v1, "red")
    drawVector(v1, "red");
    // Call drawVector(v2, "blue")
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    // clear the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log('test') // TEST

    // Read the values of the text boxes to create v1 and call
    // drawVector(v1, "red")
    var v1_xcoord = document.getElementById('v1_xcoord').value;
    var v1_ycoord = document.getElementById('v1_ycoord').value;
    var v1 = new Vector3([v1_xcoord, v1_ycoord, 0.0]);
    drawVector(v1, "red");
    console.log('testv1') // TEST

    // Read the values of the text boxes to create v1 and call 
    // drawVector(v2, "blue") 
    var v2_xcoord = document.getElementById('v2_xcoord').value;
    var v2_ycoord = document.getElementById('v2_ycoord').value;
    var v2 = new Vector3([v2_xcoord, v2_ycoord, 0.0]);
    drawVector(v2, "blue");
    console.log('testv2') // TEST

    // Read the value of the selector and call the respective 
    // Vector3 function. For add and sub operations, draw a green
    // vector v3 = v1 + v2  or v3 = v1 - v2. For mul and div 
    // operations, draw two green vectors v3 = v1 * s and v4 = v2 * s
    var oper = document.getElementById("operation").value;
    if (oper == "add") {
        var v3 = v1.add(v2);
        drawVector(v3, "green");
    } else if (oper == 'sub') {
        v1.sub(v2);
        drawVector(v1, "green");
    } else if (oper == 'mul') {
        var scal = document.getElementById('scalar').value;
        v1.mul(scal);
        drawVector(v1, "green");
        v2.mul(scal);
        drawVector(v2, "green");
    } else if (oper == 'div') {
        var scal = document.getElementById('scalar').value;
        v1.div(scal);
        drawVector(v1, "green");
        v2.div(scal);
        drawVector(v2, "green");
    }
}