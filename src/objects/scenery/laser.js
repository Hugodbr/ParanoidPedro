export default class Laser extends Phaser.GameObjects.Sprite {
    // Laser que hace daño a lo que entre en contacto con el
    /**
     * Constructor de Laser
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - position
     * @param {number} y - position
     * @param {number} sprite - ejeY inical
     */
    constructor(scene, x, y, sprite, damage =0) {
        super(scene, x, y, sprite);
        this.scene = scene;
        this.scene.add.existing(this);

        this.damage = damage;                   // Daño del laser

        this.scene.physics.add.existing(this);
        this.setDepth(1);
    }

    setPosition(x, y) { // Cambia la posicion del laser
        this.x = x;
        this.y = y;
    }

    setDamage(d) {  // Cambia el daño del laser
        this.damage = d;
    }

    getDamage() {   // Devuelve el daño del laser
        return this.damage;
    }

    destroyLaser(pool) {    // Destructor
        pool.release(this);
    }
}