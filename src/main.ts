const canvas = document.querySelector("#canvas");
canvas.width = 500;
canvas.height = 500;

const context = canvas.getContext("2d");
context.fillStyle = "white";

const State = {

	numberOfParticles: 10000,
	particleRadius: 1.5,
	distanceFromMouse: 90,
	movementSpeed: 1,

}

class Vector2 {
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

let mouse = {
	pos: new Vector2(),
}; 

window.addEventListener('mousemove', (e) => {
	mouse.pos.x = e.clientX;
	mouse.pos.y = e.clientY;
});

class Particle {

	/**
	*
	* Running affect, 
	* when close enough to mouse
	* 	set destination position - rand
	* 	while not at destination position
	* 		update curr pos by speed
	* */

	public destination: Vector2;
	public orgPos: Vector2;

	constructor(pos: Vector2) {
		this.pos = pos;
		this.orgPos = pos;
	}

	public particleRadius(): number {
		// if (this.isCloseEnough()) {
			 // return 2.5;
		// }
		return State.particleRadius;
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
				// I think i need to calc something here
				// I need to calculate what direction to move the
				// particle

				if (this.destination.x > this.pos.x) {
					this.pos.x -= State.movementSpeed;
				} else if (this.destination.x < this.pos.x) {
					this.pos.x += State.movementSpeed;
				}
				if (this.destination.y > this.pos.y) {
					this.pos.y -= State.movementSpeed;
				} else if (this.destination.y < this.pos.y) {
					this.pos.y += State.movementSpeed;
				}

			}

		} else {
			if (this.orgPos.x > this.pos.x) {
				this.pos.x -= State.movementSpeed;
			} else if (this.orgPos.x < this.pos.x) {
				this.pos.x += State.movementSpeed;
			}
			if (this.orgPos.y > this.pos.y) {
				this.pos.y -= State.movementSpeed;
			} else if (this.orgPos.y < this.pos.y) {
				this.pos.y += State.movementSpeed;
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


let arrParts = [];
function createParticles(): void {

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

		context.beginPath();

		context.arc(
			part.pos.x,
			part.pos.y,
			part.particleRadius(),
			0,
			2 * Math.PI
		);
		context.closePath();
		context.fill();

	}
}

function loop(): void {
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawParticles();
	requestAnimationFrame(loop);
}

loop();

