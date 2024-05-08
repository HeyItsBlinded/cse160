class Camera{   // ADAPTED FROM 3.8
    constructor() {
        // SET CAMERA STARTING LOCATION
        this.eye = new Vector3([23.25, 5, 54]);
        this.at = new Vector3([23.25, 5, -49]);
        this.up = new Vector3([0, 2, 0]);

    // eye:  14.25 1 31 
    // at:  14.25 1 -72 
    // up:  0 2 0

    /* FOR DRAFTING
    eye:  23.25 5 54 
    at:  23.25 5 -49 
    up:  0 2 0
    */
    }

    forward() {
        this.eye.elements[2] -= 0.5;
        this.at.elements[2] -= 0.5;
    }

    back() {
        this.eye.elements[2] += 0.5;
        this.at.elements[2] += 0.5;
    }

    left() {
        this.eye.elements[0] -= 0.5;
        this.at.elements[0] -= 0.5;
    }

    right() {
        this.eye.elements[0] += 0.5;
        this.at.elements[0] += 0.5;
    }
}