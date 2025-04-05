import Obstacle from "./obstacle.js";

const STATUE_SHOOT_DAMAGE = 3;
const STATUE_SHOOT_COOLDOWN = 3000;
const STATUE_LASER_DURATION = 1000;
/**
* @extends Obstacle
*/
//estatua tiradora
export default class Statue extends Obstacle {
    // Estatua estatica que dispara balas en una direccion en concreto periodicamente
    constructor(scene, x, y, dir) {
        super(scene, x, y, "Statue");
        this.scene.physics.add.existing(this);
        this.setDirection(dir);
        this.init(STATUE_SHOOT_DAMAGE);

        this.cooldown = STATUE_SHOOT_COOLDOWN;      // Tiempo entre disparos
        this.laserDuration = STATUE_LASER_DURATION; // Duracion del laser de la estatua
        this.spawnLaser = false;                    // Bool que indica si el laser esta siendo disparado
        this.pool = null;                           // Pool de las balas (se asigna externamente)

        this.scene.time.addEvent({
            delay: this.cooldown, // Tiempo entre cada ciclo
            callback: this.toggleLaser,
            callbackScope: this,
            loop: true
        });
    }

    init(damage) {  // Inicializa el daño
        super.init(damage);
    }

    setDirection(dir) { // Inicializa la direcion de disparo
        switch (dir) {
            case 'a': {
                this.direction = 3;
            }
                break;
            case 'w': {
                this.direction = 2;
            }
                break;
            case 'd': {
                this.direction = 1;
            }
                break;
            case 's': {
                this.direction = 0;
            }
                break;
        }
    }

    toogleLaser() {
            // Calcular la direccion de la bala a partir del angulo ajustado
            let dx;
            let dy;
            let angle;

            switch(this.direction) {
                case 0: // Sur
                    dx = 0;
                    dy = 1;
                    angle = 1.5;
                    break;
                case 1: // Este
                    dx = 1;
                    dy = 0;
                    angle = 0;
                    break;
                case 2: // Norte
                    dx = 0;
                    dy = -1;
                    angle = -1.5;
                    break;
                case 3: // Oeste
                    dx = -1;
                    dy = 0;
                    angle = 3;
                    break;
            }

            // Extrae la bala de la pool
            let laser = this.pool.spawn(this.x, this.y);
            laser.rotation = angle+90;

            // Configurar la bala
            laser.setScale(4);
            laser.setDamage(this.damage);
    
    }

    preUpdate(t, dt) {
        super.preUpdate(t,dt);
    }

    setPool(pool) { // Cambia la pool de las balas
        this.pool = pool;

    }
}