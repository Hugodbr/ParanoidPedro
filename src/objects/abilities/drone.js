import { fire } from "../abilities/shooting/fire.js";

const DEFAULT_DRONE_SHOOTING_SPEED = 1500;  // Velocidad de disparo del dron
const DEFAULT_DRONE_SHOOTING_RANGE = 400;   // Rango de disparo del dron
const DEFAULT_DRONE_BULLET_SPEED = 1000;    // Velocidad de las balas del dron 
const DEFAULT_DAMAGE = 1;                   // Daño de las balas del dron


export default class Drone extends Phaser.GameObjects.Sprite {
    // Dron que sigue al jugador y lo defiende disparando a los enemigos.
    // Siempre está en la escena pero inactivo en invisible hasta que sea activado 
    /**
     * Constructor de la torreta
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y
     * @param {object} player -referencia del player
     * @param {object} Enemies - grupo de enemigos
     * 
    */
    constructor(scene, x, y, player, Enemies, pool) {
        super(scene, x-50, y-10, 'Drone');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setScale(0.05);
        
        this.target = null;                                 // Objetivo a atacar del dron
        this.player = player;                               // Puntero al jugador
        this.pool = pool;                                   // Pool de las balas del dron
        this.enemies = Enemies                              // Puntero al grupo de los enemigos

        this.shootCooldown = DEFAULT_DRONE_SHOOTING_SPEED;  // Velocidad de disparo del dron
        this.shootingRange = DEFAULT_DRONE_SHOOTING_RANGE;  // Rango de disparo del dron
        this.damage = DEFAULT_DAMAGE;                       // Daño de las balas del dron
        this.cooldownCont = 0;                              // Contador del cooldown del dron
        this.bulletSpeed = DEFAULT_DRONE_BULLET_SPEED;      // Velocidad de las balas del dron 

        this.setDepth(2);                                   // Orden de renderizado del dron
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.followPlayer();

        if (this.visible) { // Solo empieza a atacar cuando esta 'activado'
            if (this.cooldownCont <= 0 && this.getClosestEnemy()) {
                this.cooldownCont = this.shootCooldown;
                fire(this, this.target, this.damage, this.bulletSpeed, 'Bala', 4, this.pool, 1, this.player.prob, 1.5);
                const sfx = this.scene.sound.add('playerAttackAudio');
                sfx.setVolume(0.35); // Cambia el volumen dinamicamente
                sfx.play();
            }
            this.cooldownCont = this.cooldownCont - dt;
        }
    }

    getDistance(targetToCheck) {    // Devuelve la distancia del objetivo respecto al dron
        var p1 = this.x - targetToCheck.x;
        var p2 = this.y - targetToCheck.y;

        return Math.sqrt(p1 * p1 + p2 * p2);
    }

    getClosestEnemy() { // Busca el enemigo mas cercano al dron
        this.currentBest = this.shootingRange;
        this.res = false;

        // Acceder al array de enemigos en el grupo
        const enemiesArray = this.enemies.getChildren();

        enemiesArray.forEach((enemyCandidate) => {
            if (this.getDistance(enemyCandidate) <= this.currentBest) {
                this.res = true;
                this.target = enemyCandidate;
            }
        });

        return this.res;
    }

    setPosition(x, y) { // Cambia la posicion del dron
        this.x = x;
        this.y = y;
    }

    setDamage(damage) { // Cambia el daño de las balas del dron
        this.damage = damage;
    }

    setBulletSpeed(speed) { // Cambia la velocidad de las balas del dron
        this.bulletSpeed = speed;
    }

    followPlayer() {    // Metodo para mover al dron hacia el jugador si esta fuera de rango
        const distanceToPlayer = this.getDistance(this.player);
        const minDistance = 100; // Distancia minima para detenerse

        if (distanceToPlayer > minDistance) {
            // Calcular direccion hacia el jugador
            const directionX = this.player.x - this.x;
            const directionY = this.player.y - this.y;

            // Normalizar el vector de direccion
            const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
            const normalizedDirectionX = directionX / magnitude;
            const normalizedDirectionY = directionY / magnitude;

            // Ajustar la velocidad del dron
            const speed = this.player.speedFactor; // Velocidad de movimiento
            this.body.setVelocity(
                normalizedDirectionX * speed,
                normalizedDirectionY * speed
            );
        } else {
            // Detener el movimiento si esta dentro de la distancia minima
            this.body.setVelocity(0);
        }
    }
}