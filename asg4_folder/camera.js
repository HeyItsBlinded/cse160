// LGTM
class Camera{
    constructor() {
        // SET CAMERA STARTING LOCATION
        this.eye = new Vector3([0, 1, 3]);
        this.at = new Vector3([0, -5, -100]);
        this.up = new Vector3([0, 2, 0]);

    /* FOR DRAFTING
    eye:  25 20 81.5 
    at:  25 10 -32.5 
    up:  0 2 0
    */
    }

    forward() {
        this.eye.elements[2] -= 0.005;
        this.at.elements[2] -= 0.005;
    }

    back() {
        this.eye.elements[2] += 0.005;
        this.at.elements[2] += 0.005;
    }

    left() {
        this.eye.elements[0] -= 0.005;
        this.at.elements[0] -= 0.005;
    }

    right() {
        this.eye.elements[0] += 0.005;
        this.at.elements[0] += 0.005;
    }
}