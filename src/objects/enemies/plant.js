export default class Plant extends Phaser.GameObjects.Sprite {
    /**
     * @extends Phaser.Sprite
     * Plant, recupera vida del jugador, es dropeado por el enemigo
     * @param {Scene} scene - escena en la que aparece
     * @param {Number} lifeRec - el numero de vida que recupera la planta
     */
    constructor(scene, x, y, lifeRec) {
        super(scene, x, y, 'plant', 0);
        this.setScale(2);
        this.scene = scene;
        this.lifeRec = lifeRec;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);
        this.setDepth(1);
        
    }

    getLifeRec() {
        return this.lifeRec;
    }

    setLifeRec(value) {
        this.lifeRec = value;
    }

    setPosition(x, y) {
        this.play('plantIdle');
        this.x = x;
        this.y = y;
    }

    destroyPlant(pool) {
        const sfx = this.scene.sound.add('cureAudio');
        sfx.play();
        pool.release(this);
    }
}