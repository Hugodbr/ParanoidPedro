export default class Bullet extends Phaser.GameObjects.Sprite {
    // Bala basica que viaja en linea recta y hace daño al impactar
    /**
     * Constructor de Bullet,las balas
     * @param {Scene} scene - escena en la que aparece
     * @param {number} damage - daño que hace la bala
     * @param {number} startX - ejeX inicial
     * @param {number} startY - ejeY inical
     */
    constructor(scene, damage, speed, bala) {
        super(scene, 0, 0, bala);
        this.scene = scene;
        this.scene.add.existing(this);
        this.damage = damage;
        this.speed = speed;
        
        this.scene.physics.add.existing(this);
        this.setDepth(1);
        this.particles = null;
    }

    move(xStart, yStart, xObj, yObj) {
        // Direccion de disparo 
        var pointSpeed = new Phaser.Math.Vector2(xObj - xStart, yObj - yStart);
        pointSpeed.normalize();
        this.body.setVelocity(this.speed * pointSpeed.x, this.speed * pointSpeed.y);

        // Particulas de las balas
        this.particles=this.scene.add.particles(0, 0, 'Particle', {
            x: () => {
                return this.x;
            },
            y: () => {
                return this.y;
            },
            speed: 100,
            lifespan: 100,
            scale: 2
        }); 
    }

    setSpeed(s) {   // Cambia la velocidad de la Bala
        this.speed = s;
    }

    setDamage(d) {  // Cambia el daño de la bala
        this.damage = d;
    }

    getDamage() {   // Devuelve el daño de la bala
        return this.damage;
    }

    destroyBullet(pool) {   // Destructor
        pool.release(this);
        this.particles.destroy();
    }
}