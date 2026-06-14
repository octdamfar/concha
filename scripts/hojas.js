const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '10';

const backgroundCanvas = document.createElement('canvas');
const bgCtx = backgroundCanvas.getContext('2d');
document.body.appendChild(backgroundCanvas);

backgroundCanvas.style.position = 'fixed';
backgroundCanvas.style.top = '0';
backgroundCanvas.style.left = '0';
backgroundCanvas.style.width = '100%';
backgroundCanvas.style.height = '100%';
backgroundCanvas.style.pointerEvents = 'none';
backgroundCanvas.style.zIndex = '2';

let width = canvas.width = backgroundCanvas.width = window.innerWidth;
let height = canvas.height = backgroundCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = backgroundCanvas.width = window.innerWidth;
    height = canvas.height = backgroundCanvas.height = window.innerHeight;
});

const leafColors = ['#5c8332', '#7fa944', '#a3c662', '#c1a13e', '#8fa870', '#b6743e'];

class Leaf {
    constructor() {
        this.initialSetup();
        this.reset(true);
    }

    initialSetup() {
        this.isBackground = Math.random() < 0.5;
        
        if (this.isBackground) {
            this.size = Math.random() * 5 + 3;
            this.speedX = Math.random() * 1.0 + 0.8;
            this.speedY = Math.random() * 0.3 + 0.05;
            this.opacity = Math.random() * 0.3 + 0.4;
        } else {
            this.size = Math.random() * 7 + 5;
            this.speedX = Math.random() * 1.5 + 1.2;
            this.speedY = Math.random() * 0.4 + 0.1;
            this.opacity = 1;
        }
        
        this.swingSpeed = Math.random() * 0.015 + 0.005;
        this.swingRange = Math.random() * 30 + 20;
        this.angle = Math.random() * Math.PI * 2;
        
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.5;
        
        this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
    }

    reset(isFirstSpawn = false) {
        if (isFirstSpawn) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
        } else {
            this.x = -(Math.random() * width * 0.4) - 50;
            this.y = Math.random() * height - 100;
        }
    }

    update() {
        this.angle += this.swingSpeed;
        
        this.x += this.speedX + Math.cos(this.angle) * 0.5;
        this.y += this.speedY + Math.sin(this.angle) * 0.8;
        
        this.rotation += this.rotationSpeed;

        if (this.x > width + 50 || this.y > height + 50) {
            this.reset(false);
        }
    }

    draw(currentCtx) {
        currentCtx.save();
        currentCtx.globalAlpha = this.opacity;
        
        const currentX = this.x + Math.sin(this.angle) * this.swingRange * 0.2;
        
        currentCtx.translate(currentX, this.y);
        currentCtx.rotate((this.rotation * Math.PI) / 180);
        
        currentCtx.beginPath();
        currentCtx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        currentCtx.fillStyle = this.color;
        currentCtx.fill();
        
        currentCtx.beginPath();
        currentCtx.moveTo(-this.size, 0);
        currentCtx.lineTo(this.size + 1, 0);
        currentCtx.strokeStyle = 'rgba(0,0,0,0.1)';
        currentCtx.lineWidth = 0.8;
        currentCtx.stroke();
        
        currentCtx.restore();
    }
}

const leafCount = 80;
const leaves = [];

for (let i = 0; i < leafCount; i++) {
    leaves.push(new Leaf());
}

function preSimulateScene(seconds) {
    const framesToSimulate = seconds * 60;
    for (let i = 0; i < framesToSimulate; i++) {
        for (let j = 0; j < leaves.length; j++) {
            leaves[j].update();
        }
    }
}

preSimulateScene(10);

function animate() {
    ctx.clearRect(0, 0, width, height);
    bgCtx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < leaves.length; i++) {
        leaves[i].update();
        if (leaves[i].isBackground) {
            leaves[i].draw(bgCtx);
        } else {
            leaves[i].draw(ctx);
        }
    }
    
    requestAnimationFrame(animate);
}

animate();

const cartaPrincipal = document.querySelector('.ct1');
let clickCount = 0;
let resetTimeout;

function handleTripleClick() {
    clickCount++;
    console.log(clickCount);
        
    clearTimeout(resetTimeout);

    if (clickCount === 3) {
        console.log("CAIDA");

        cartaPrincipal.classList.add('caida-natural');
        clickCount = 0;
    } else {
        resetTimeout = setTimeout(() => {
            clickCount = 0;
        }, 1000);
    }
}

if (cartaPrincipal) {
    cartaPrincipal.addEventListener('click', handleTripleClick);
    cartaPrincipal.addEventListener('touchstart', handleTripleClick, { passive: true });
}