class Camera{
    constructor() {
        // SET CAMERA STARTING LOCATION
        this.eye = new Vector3([25, 20, 50]);
        this.at = new Vector3([25, 10, -64]);
        this.up = new Vector3([0, 2, 0]);

    /* FOR DRAFTING
    
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