class Camera{   // ADAPTED FROM 3.8
    constructor() {
        // SET CAMERA STARTING LOCATION
        this.eye = new Vector3([25.75, 26, 50]);
        this.at = new Vector3([25.75, 0, -62]);
        this.up = new Vector3([0, 2, 0]);

    /* FOR DRAFTING
    eye:  32.75 26 56 
 at:  32.75 0 -56 
 up:  0 2 0

    // RESET TO WHEN DONE
    eye:  23.25 5 50.5 
    at:  23.25 5 -52.5 
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