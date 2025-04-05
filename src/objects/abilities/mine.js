const DEFAULT_MINE_COOLDOWN = 5000;
const DEFAULT_STUNT_TIME = 5000;

export default class Mine extends Phaser.GameObjects.Sprite {
    // Mina que deja al enemigo con el que impacta stuneado una cantidad de tiempo determinada 
    /**
     * Constructor de la mina
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y
     * @param {object} player -referencia del player
     * @param {object} Enemies - grupo de enemigos
     * 
    */
    constructor(scene, x, y, damage, time) {
        super(scene, x, y, 'Mine');
        this.scene = scene;               
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.damage = damage;                   // Daño que hace la mina al contacto
        this.stuntTime = time;                  // Tiempo que dura el stunt
    }

    getStuntTime() {    // Retorna el tiempo de stuneado
        return this.stuntTime;
    }
    onDeath() {
        this.destroy(); // Elimina el objeto de la escena
    }
}