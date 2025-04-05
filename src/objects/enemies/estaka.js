import Enemy from "./enemy.js";
import DamageArea from '../abilities/area_damage/damage_area.js'

/**
 * @extends Enemy
 * Enemigo de ataque en area
 * @param {Scene} scene - escena en la que aparece
 * @param {number} damage - daño que hace la bala
 * @param {number} x - ejeX inicial
 * @param {number} y- ejeY inical
 * @param {number} damageRange - radio del area
 * @param {number} duration - duracion del area
 */
export default class Estaka extends Enemy {
    constructor(scene, x, y, player, exp, pool, life, damage, texture) {
        super(scene, x, y, player, texture, exp);
        this.AreaDamageRange = 100;
        this.AreaDamage = 0.1;
        this.duration = 1;
        this.scene.add.existing(this);
        this.damageArea = null;
        this.pool = pool;

        this.init(25, 0, life, damage, 0);
        this.timer = this.scene.time.addEvent({
            delay: 3000,
            callback: this.createDamageArea,
            callbackScope: this,
            loop: true
        });
    }

    init(speedFactor, shootSpeed, life, damage, prob) {
        super.init(speedFactor, shootSpeed, life, damage, prob);
        this.play('EstakaAttack');
    }

    onDeath() {
        this.timer.remove(); 
        this.timer = null;
        super.onDeath();
    }

    createDamageArea() {
        if (this.follow) {
            const velocity = this.body.velocity;
            velocity.normalize();

            this.damageArea = this.pool.spawn(this.x + velocity.x * 150, this.y + velocity.y * 150);
            this.damageArea.reset(this.AreaDamageRange, this.AreaDamage, this.duration);

            const sfx = this.scene.sound.add('enemyAreaAudio');
            sfx.play();
        }
       
    }

}
