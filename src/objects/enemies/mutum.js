import Enemy from "./enemy.js";
import DamageArea from '../abilities/area_damage/damage_area.js'

/**
 * @extends Enemy
 * Enemigo Mutum que se suicida al colisionar con player
 * @param {Scene} scene - escena en la que aparece
 * @param {Number} damage - daño que hace la bala
 * @param {Number} x - ejeX inicial
 * @param {Number} y- ejeY inical
 * @param {Number} damageRange - radio del area
 * @param {Number} duration - duracion del area
 * @param {Boolean} isMutum - controla cuando se llama al onDeath
 */
export default class Mutum extends Enemy {
    constructor(scene, x, y, player, exp, pool, life, damage, texture) {
        super(scene, x, y, player, texture , exp);
        this.AreaDamageRange = 100;
        this.AreaDamage = 0.3;  
        this.duration = 3;      
        this.scene.add.existing(this);
        this.damageArea = null;
        this.pool = pool;

        this.isMutum = true;
        this.init(50, 0, life, damage, 0);
    }
    init(speedFactor, shootSpeed, life, damage, prob) {
        super.init(speedFactor, shootSpeed, life, damage, prob);
        this.play('MutumIdle');
    }
    onDeath() {
        this.createDamageArea();
    }
    createDamageArea() {
        if (!this.damageArea) {
            this.damageArea = this.pool.spawn(this.x, this.y);
            this.damageArea.reset(this.AreaDamageRange, this.AreaDamage, this.duration);
            const sfx = this.scene.sound.add('enemyAreaAudio');
            sfx.play();
        }

        super.onDeath();
    }

}