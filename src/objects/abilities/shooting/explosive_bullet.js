import OurPool from "../../our_pool.js";
import Bullet from "./bullet.js";

export default class ExplosiveBullet extends Bullet {   
    // Bala que provoca una explosion al impactar
    /**
     * Constructor de Bullet,las balas
     * @param {Scene} scene - escena en la que aparece
     * @param {number} damage - daño que hace la bala
     * @param {number} Speed - velocidad
     * @param {number} areaRadius - radio de la area
     * @param {OurPool} pool - pool de la area
     */
    constructor(scene, damage, speed, bala, areaRadius, pool) {
        super(scene, damage, speed, bala);
        this.areaRadius = areaRadius;
        this.pool = pool;
        this.areaDamage = 0;
        this.duration = 1;  
    }

    setDamage(d) {  // Cambia el daño
        super.setDamage(d);
        this.areaDamage = d/2;
    }

    destroyBullet(pool) {   // Se destrulle provocando una area de daño que actua como explosion
        let damageArea = this.pool.spawn(this.x, this.y);
        damageArea.reset(this.areaRadius, this.areaDamage, this.duration);
        const sfx = this.scene.sound.add('enemyAreaAudio');
        sfx.play();
        
        super.destroyBullet(pool);
    }
}