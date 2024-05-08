class Camera{   // ADAPTED FROM 3.8
    constructor() {
        // SET CAMERA STARTING LOCATION
        this.eye = new Vector3([14.25, 1, 31]);
        this.at = new Vector3([14.25, 1, -72]);
        this.up = new Vector3([0, 2, 0]);

    // eye:  14.25 1 31 
    // at:  14.25 1 -72 
    // up:  0 2 0
    }

    forward() {
        this.eye.elements[2] -= 0.25;
        this.at.elements[2] -= 0.25;
    }

    back() {
        this.eye.elements[2] += 0.25;
        this.at.elements[2] += 0.25;
    }

    left() {
        this.eye.elements[0] -= 0.25;
        this.at.elements[0] -= 0.25;
    }

    right() {
        this.eye.elements[0] += 0.25;
        this.at.elements[0] += 0.25;
    }
}