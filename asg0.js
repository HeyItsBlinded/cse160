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

function handleDrawEvent() {
    //
}