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
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
    ctx.fillRect(120, 10, 150, 150);
}