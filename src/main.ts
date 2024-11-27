const canvas = document.querySelector("#canvas");
canvas.width = 300;
canvas.height = 300;

const context = canvas.getContext("2d");
context.fillStyle = "white";

const numberOfParticles: number = 6000;
const distanceFromMouse: number = 40;
const movementSpeedFromCursor: number = 5;
const movementSpeedReposition: number = 0.2;

const cheeseAudio:  HTMLAudioElement = new Audio("src/audio/CheeseSmack.mp3")
const cheeseImages: string[] =  ["blue.png", "cheddar.png", "cheese-stick.png", "cheese-wheel.png", "gouda.png"]

const State = {
    numberOfParticles,
    distanceFromMouse,
    movementSpeedFromCursor,
    movementSpeedReposition,
    particleRadius: 1,
    isCheeseMode: false
};

const particleNumberInput = document.querySelector("#particleNumber");
particleNumberInput.addEventListener("keyup", (e) => {
    State.numberOfParticles = e.srcElement.value;
    createParticles();
});

const radiusInput = document.querySelector("#radius");
radiusInput.addEventListener("keyup", (e) => {
    State.distanceFromMouse = e.srcElement.value;
});

const fromCursor = document.querySelector("#fromCursor");
fromCursor.addEventListener("change", (e) => {
    State.movementSpeedFromCursor = parseInt(e.srcElement.value);
});

const repositionSpeed = document.querySelector("#reposition");
repositionSpeed.addEventListener("keyup", (e) => {
    State.movementSpeedReposition = parseFloat(e.srcElement.value);
});

const cheeseMode = document.querySelector("#cheeseMode");
cheeseMode.addEventListener("change", (e) => {
    if(e.srcElement.checked){
        cheeseAudio.play()
    }
    State.isCheeseMode = e.srcElement.checked;
});

const resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", (e) => {
    createParticles();
    State.numberOfParticles = numberOfParticles;
    particleNumberInput.value = numberOfParticles;

    State.distanceFromMouse = distanceFromMouse;
    radiusInput.value = distanceFromMouse;

    State.movementSpeedFromCursor = movementSpeedFromCursor;
    fromCursor.value = movementSpeedFromCursor;

    State.movementSpeedReposition = movementSpeedReposition;
    repositionSpeed.value = movementSpeedReposition;
});

class Vector2 {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

let mouse = {
    pos: Vector2,
};

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.pos.x = e.clientX - rect.left;
    mouse.pos.y = e.clientY - rect.top;
});

class Particle {
    public destination!: Vector2;
    public orgPos: Vector2;
    public pos: Vector2;
    public imagePath: string = "";

    constructor(pos: Vector2) {
        this.pos = pos;
        this.orgPos = structuredClone(pos);
        this.imagePath = selectCheeseImage();
    }

    public isCloseEnough(): boolean {
        return this.distanceFromMouse(mouse.pos) < State.distanceFromMouse;
    }

    public calcPos(): void {
        if (this.isCloseEnough()) {
            const destPoint: Vector2 = this.generatePointOnMouseRadius();
            this.destination = destPoint;
        }
    }

    public updatePos(): void {
        if (this.isCloseEnough()) {
            if (this.destination) {
                if (this.destination.x > this.pos.x) {
                    this.pos.x -= State.movementSpeedFromCursor;
                } else if (this.destination.x < this.pos.x) {
                    this.pos.x += State.movementSpeedFromCursor;
                }
                if (this.destination.y > this.pos.y) {
                    this.pos.y -= State.movementSpeedFromCursor;
                } else if (this.destination.y < this.pos.y) {
                    this.pos.y += State.movementSpeedFromCursor;
                }
            }
        } else {
            if (this.orgPos.x > this.pos.x) {
                this.pos.x += State.movementSpeedReposition;
            } else if (this.orgPos.x < this.pos.x) {
                this.pos.x -= State.movementSpeedReposition;
            }
            if (this.orgPos.y > this.pos.y) {
                this.pos.y += State.movementSpeedReposition;
            } else if (this.orgPos.y < this.pos.y) {
                this.pos.y -= State.movementSpeedReposition;
            }
        }
    }

    public distanceFromMouse(m: Vector2): number {
        // d = sqrt((x1 - x2)^2 + (y1 - y2)^2 + (z1 - z2)^2)
        if (!m) {
            return 9999999;
        }
        const d = Math.hypot(m.x - this.pos.x, m.y - this.pos.y);

        return d;
    }

    public generatePointOnMouseRadius(): Vector2 {
        const theda: number = Math.random() * 2 * Math.PI;
        const r: number = State.distanceFromMouse;
        const x: number = r * Math.cos(theda) + mouse.pos.x;
        const y: number = r * Math.sin(theda) + mouse.pos.y;

        return new Vector2(x, y);
    }
}

function selectCheeseImage(): string{
    return 'src/images/' + cheeseImages[Math.floor((Math.random()*100)%cheeseImages.length)]
}


let arrParts: Particle[] = [];
let imagePositons: {[xPos: number]: Vector2} = {}
function createParticles(): void {
    arrParts = [];

    for (let i = 0; i < State.numberOfParticles; i++) {
        const ranX: number = Math.floor(Math.random() * canvas.width);
        const ranY: number = Math.floor(Math.random() * canvas.height);
        const pos: Vector2 = new Vector2(ranX, ranY);
        const part: Particle = new Particle(pos);
        arrParts.push(part);
    }
}
createParticles();

function drawParticles(): void {
    for (let i = 0; i < arrParts.length; i++) {
        const part: Particle = arrParts[i];

        part.calcPos();
        part.updatePos();

        let lastPos: Vector2 = new Vector2(-8,-8);
        if(State.isCheeseMode){
            const img: HTMLImageElement  = new Image()

            const xPos = lastPos.x < part.pos.x && part.pos.x < lastPos.x + 8 ?  lastPos.x + 8: part.pos.x;
            const yPos = lastPos.y < part.pos.y && part.pos.y < lastPos.y + 8 ?  lastPos.y + 8: part.pos.y;

            img.src = part.imagePath;
            context.drawImage(img,  xPos, yPos, 8, 8);

            lastPos = new Vector2(xPos, yPos)
        }else{
            context.beginPath();

            context.arc(
                part.pos.x,
                part.pos.y,
                State.particleRadius,
                0,
                2 * Math.PI,
            
            );
            context.closePath();
            context.fill();
        }
    }
}

function loop(): void {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawParticles();
    requestAnimationFrame(loop);
}

loop();
