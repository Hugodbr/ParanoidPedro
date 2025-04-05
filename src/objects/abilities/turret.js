import { fire } from "../abilities/shooting/fire.js";

const DEFAULT_TURRET_SHOOTING_SPEED = 1500;
const DEFAULT_TURRET_SHOOTING_RANGE = 650;
const DEFAULT_TURRET_BULLET_SPEED = 300;
const DEFAULT_DAMAGE = 1;
const DEFAULT_TURRET_LIFETIME = 10000; // Duración de vida en milisegundos

export default class Turret extends Phaser.GameObjects.Sprite{
    // Torreta estatica que ataca a su objectivo lanzando balas normales
    /**
     * Constructor de la torreta
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y
     * @param {object} Enemies - grupo de enemigos
     * 
    */

    constructor(scene, x, y, Enemies) {
        super(scene, x, y, 'Turret');
        this.scene = scene;
        this.scale = 4; 
        this.target = null;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.pool = null;                                   // Pool de las balas (se añade externamente)
        this.enemies = Enemies;                             // Puntero al grupo de enemigos

        this.cooldownCont = 0;                              // Contador para el cooldown de disparo
        this.damage = DEFAULT_DAMAGE;                       // Daño de las balas de la torreta
        this.shootCooldown = DEFAULT_TURRET_SHOOTING_SPEED; // Cooldown entre disparos de la torreta
        this.shootingRange = DEFAULT_TURRET_SHOOTING_RANGE; // Rango de la torreta
        this.bulletSpeed = DEFAULT_TURRET_BULLET_SPEED;     // Velocidad de las balas de la torreta
        this.lifetime = DEFAULT_TURRET_LIFETIME;            // Tiempo de vida de la torreta
        
        this.setDepth(2);                                   // Orden de renderizado
    }
    setPool(pool) {
        this.pool = pool;
    }
    preUpdate(t, dt) {
		super.preUpdate(t, dt);

        if(this.cooldownCont <= 0 && this.getClosestEnemy()){
            this.cooldownCont = this.shootCooldown;
            fire(this, this.target, this.damage, this.bulletSpeed, 'Bala', 4, this.pool, 1, 0.05, 1.5);
            const sfx = this.scene.sound.add('playerAttackAudio');
            sfx.setVolume(0.35); // Cambiar el volumen dinámicamente
            sfx.play();
            //console.log('pium');
        }
        this.cooldownCont = this.cooldownCont - dt;

        // Reducir tiempo que le queda de vida
        this.lifetime -= dt;
        if (this.lifetime <= 0) {
            this.lifetime = DEFAULT_TURRET_LIFETIME;
            this.scene.events.emit('TurretTimeOVer', this);
        }
	}

    getDistance(targetToCheck) {    // Devuelve la distancia del objetivo respecto a la torreta
		var p1 = this.x - targetToCheck.x;
		var p2 = this.y - targetToCheck.y;

		return Math.sqrt(p1*p1 + p2*p2);
	}

    getClosestEnemy() {
        this.currentBest = this.shootingRange;
        this.res = false;

        // Acceder al array de enemigos en el grupo
        const enemiesArray = this.enemies.getChildren();

        enemiesArray.forEach((enemyCandidate) => {
            if(this.getDistance(enemyCandidate) <= this.currentBest) {
                this.res = true;
                this.target = enemyCandidate;
            }
        });

        return this.res;
    }

    setDamage(damage) { // Cambia el daño de las balas de la torreta
        this.damage = damage;
    }

    setBulletSpeed(speed) { // Cambia la velocidad de las balas de la torreta
        this.bulletSpeed = speed - DEFAULT_TURRET_BULLET_SPEED;
    }
}