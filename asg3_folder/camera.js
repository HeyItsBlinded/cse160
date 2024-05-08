class Camera{   // ADAPTED FROM 3.8
    constructor() {
        // SET CAMERA STARTING LOCATION
        this.eye = new Vector3([0, 0, 3]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 2, 0]);

        // this.eye = new Vector3([4.5, 0, 10.75]);
        // this.at = new Vector3([4.5, 0, -92.25]);
        // this.up = new Vector3([0, 2, 0]);
    }

    forward() {
        this.eye.elements[2] -= 0.25;
        this.at.elements[2] -= 0.25;
        // var f = this.at.subtract(this.eye);
        // f = f.divide(f.length());
        // this.at = this.at.add(f);
        // this.eye = this.eye.add(f);
    }

    back() {
        this.eye.elements[2] += 0.25;
        this.at.elements[2] += 0.25;
        // var f = this.eye.subtract(this.at);
        // f = f.divide(f.length());
        // this.at = this.at.add(f);
        // this.eye = this.eye.add(f);
    }

    left() {
        this.eye.elements[0] -= 0.25;
        this.at.elements[0] -= 0.25;
        // var f = this.eye.subtract(this.at);
        // f = f.divide(f.length());
        // var s = f.cross(this.up);
        // s = s.divide(s.length());
        // this.at = this.at.add(s);
        // this.eye = this.eye.add(s);
    }

    right() {
        this.eye.elements[0] += 0.25;
        this.at.elements[0] += 0.25;
    }
}