/**
     * @extends Phaser.GameObjects.Sprite
     Lo que recibe
     * @param {Phaser.Scene} scene La escena del juego
     * @param {number} x Posicion X
     * @param {number} y Posicion Y
     atributos
     * @param {string} type tipo de obstaculo
     * @param {number} damage da�o que produce este obstaculo
     */

const DEFAULT_DAMAGE = 1;
export default class Obstacle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, [type], 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // Inicializar las propiedades por defecto
        this.type = type;
        this.damage = DEFAULT_DAMAGE;
        this.body.setImmovable(true);
        this.setOrigin(0, 0);
        this.setDepth(0);
    }

    init(damage) {
        this.damage = damage;
    }

    getDamage(){
        return this.damage;
    }
}