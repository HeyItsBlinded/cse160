let canvas; // to avoid potential scoping issues
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
    let cx = canvas.width / 2;
    let cy = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + v.elements[0] * 20, cy - v.elements[1] * 20);
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
    // call drawVector(v1, "red")
    // Call drawVector(v2, "blue")
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    // clear the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Read the values of the text boxes to create v1 and call
    // drawVector(v1, "red")
    var v1_xcoord = document.getElementById('v1_xcoord').value;
    var v1_ycoord = document.getElementById('v1_ycoord').value;
    var v1 = new Vector3([v1_xcoord, v1_ycoord, 0.0]);
    drawVector(v1, "red");

    // Read the values of the text boxes to create v1 and call 
    // drawVector(v2, "blue") 
    var v2_xcoord = document.getElementById('v2_xcoord').value;
    var v2_ycoord = document.getElementById('v2_ycoord').value;
    var v2 = new Vector3([v2_xcoord, v2_ycoord, 0.0]);
    drawVector(v2, "blue");

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
    } else if (oper == 'norm') {
        var v1_norm = v1.normalize();
        var v2_norm = v2.normalize();
        drawVector(v1_norm, "green");
        drawVector(v2_norm, "green");
    } else if (oper == 'mag') {
        console.log("v1 magnitude: ", v1.magnitude(), "   v2 magnitude: ", v2.magnitude());
    } else if (oper == 'ang_btwn') {
        console.log("angle between v1 & v2: ", angleBetween(v1, v2));
    } else if (oper == 'area') {
        console.log("area of triangle created by v1 & v2: ", areaTriangle(v1, v2));
    }
}

function angleBetween(v1, v2) {
    // uses the dot function to compute the angle between v1 and v2.
    // Hint: Use the definition of dot product 
    // dot(v1, v2) = ||v1|| * ||v2|| * cos(alpha)
    var mag_v1 = v1.magnitude();
    var mag_v2 = v2.magnitude();
    var dotprod = Vector3.dot(v1, v2);

    var rad = Math.acos(dotprod / (mag_v1 * mag_v2));
    rad *= 180 / Math.PI;
    return rad;
}

function areaTriangle(v1, v2) {
    // uses the cross function to compute the area of the triangle created 
    // with v1 and v2. Hint: Remember  ||v1 x v2]]  equals to the area of the 
    // parallelogram that the vectors span.

    var temp = Vector3.cross(v1, v2);
    let result = temp.magnitude() / 2;
    return result;
}
