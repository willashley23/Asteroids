import Utils from './utils';
import MovingObject from './moving_object';
import Bullet from './bullet';
import PowerUp from './powerup';

export default class Ship extends MovingObject {
	constructor(posOptions) {
		super(posOptions);
		this.radius = 20;
		this.vel = [0,0];
		this.isWrappable = true;
		this.type = 0;
		this.angle = 0;
		this.hasPowerup = false;
		this.hasTripleShot = false;
		this.currentNumBullets = 0;
		this.invulnerable = false;
		this.facingDir = 0;
	}

	relocate() {
		this.invulnerable = true
		this.pos = this.game.randomPosition();
		this.vel = [0,0];
		window.setTimeout(() => {
				this.invulnerable = false;
		}, 1500);
	};

	collideWith(otherObject) {
		if (otherObject instanceof PowerUp) {
			if (otherObject.powerupType === 2) {
				this.hasTripleShot = true;
				this.currentNumBullets = this.game.bullets.length;
				new Audio('sounds/tripleshot.wav').play();
			} else {
				this.hasPowerup = true;
				new Audio('sounds/powerup.wav').play();
			}
			this.game.removePowerUp(otherObject);
			this.game.powerups = 0;
		} 
	};

	fireBullet() {
		let bulletVel = [Math.sin(-this.facingDir)*-10, Math.cos(-this.facingDir)*-10]
		if (this.hasTripleShot) {
			let totalBullets = this.game.bullets.length;
			let secondBulletPos;
			let thirdBulletPos;
			if (totalBullets - this.currentNumBullets > 80) {
				this.hasTripleShot = false;
			}
			if (Math.abs(this.facingDir) > 3 || Math.round(this.facingDir) === 0) {
				secondBulletPos = [this.pos[0]-30, this.pos[1]]
				thirdBulletPos = [this.pos[0]+30, this.pos[1]]
			} else {
				secondBulletPos = [this.pos[0], this.pos[1]-30]
				thirdBulletPos = [this.pos[0], this.pos[1]+30]
			}
			let bullet1 = new Bullet( {
				pos: secondBulletPos, 
				vel: bulletVel, 
				game: this.game, 
				angle: this.facingDir
			});
			let bullet2 = new Bullet( {
				pos: thirdBulletPos, 
				vel: bulletVel, 
				game: this.game, 
				angle: this.facingDir
			});
			this.game.bullets.push(bullet1);
			this.game.bullets.push(bullet2);
		}
		let defaultBulletPos;
		if (this.facingDir === 0) {
			defaultBulletPos = [this.pos[0]-3.5, this.pos[1]-36];
		} else if (this.facingDir > 3) {
			defaultBulletPos = [this.pos[0]-3.5, this.pos[1]+36];
		}
		else {
			defaultBulletPos = [this.pos[0], this.pos[1]-6];
		}
		let bullet3 = new Bullet( {
			pos: defaultBulletPos, 
			vel: bulletVel, 
			game: this.game, 
			angle: this.facingDir
		});
		this.game.bullets.push(bullet3);
		new Audio('sounds/laser.wav').play();
	};
}


Ship.prototype.power = function (impulse) {
	this.vel[0] += impulse[0];
	this.vel[1] += impulse[1];
	let radians = Math.atan2(-this.vel[0], -this.vel[1]) * -1;
	this.facingDir = radians;
};

Ship.prototype.move = function () {
	if (this.isWrappable) {
		this.pos = this.game.wrap(this.pos);
	}
	this.pos[0] += this.vel[0];
	this.pos[1] += this.vel[1];
	//Attenuate velocity over time
	this.vel[0] *= .98;
	this.vel[1] *= .98;
};

Ship.prototype.draw = function (ctx) {
	const img = new Image();
	const forceField = new Image();
	let that = this
	img.onload = function () {
		if(!that.game.lose() && !that.game.win()) {
			ctx.drawImage(img, 0, 0)
		} 
	};
	forceField.onload = function() {
		if(!that.game.lose() && !that.game.win()) {
			ctx.drawImage(forceField, 0, 0)
		}
	};
	forceField.src = 'images/forcefield.png';
	img.src = 'images/galaga_ship.png';
	let rotatedShip = Utils.rotateAndCache(img,this.facingDir)
	// Blink sprite to indicate invulnerabiltiy 
	if (!img.width || !img.height) return;
	if (!this.invulnerable || Math.floor(Date.now() / 60) % 2) {
	 ctx.drawImage(rotatedShip, this.pos[0]-this.radius, this.pos[1]-this.radius);
	} 
	if (this.hasPowerup) { 
		ctx.drawImage(forceField, this.pos[0]-38, this.pos[1]-38);
	}
};