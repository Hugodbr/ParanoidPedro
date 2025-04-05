import Enemy from './enemy.js';
import { fire } from '../abilities/shooting/fire.js';

/** 
 * Enemigo que dispara proyectiles
 * @extends Enemy
 * 
 */

const SHOOTING_RANGE = 700;
const SHOOTING_COOLDOWN = 2000;
export default class Crac extends Enemy {
	constructor(scene, x, y, player, exp, life, damage, texture) {
		super(scene, x, y, player, texture , exp);
		this.cooldownCont = 0;
		this.init(85, 500, life, damage, 0);

		//console.log(this);
	}
	init(speedFactor, shootSpeed, life, damage, prob) {
		super.init(speedFactor, shootSpeed, life, damage, prob);
		this.play('CracIdle');
	}
	preUpdate(t, dt) {
		super.preUpdate(t, dt);

		//console.log(this);
		if (this.follow) {
			if (this.cooldownCont <= 0 && this.getDistance() < SHOOTING_RANGE) {
				this.cooldownCont = SHOOTING_COOLDOWN;
				fire(this, this.player, this.damage, this.shootSpeed, 'Bala', 4, this.pool, 1);
				const sfx = this.scene.sound.add('enemyShootAudio');
				sfx.setVolume(0.5); // Cambiar el volumen dinámicamente
				sfx.play();
			}
			this.cooldownCont = this.cooldownCont - dt;
		}
        
	}

	getDistance(){
		var p1 = this.x - this.player.x;
		var p2 = this.y - this.player.y;

		return Math.sqrt(p1*p1 + p2*p2);
	}
}