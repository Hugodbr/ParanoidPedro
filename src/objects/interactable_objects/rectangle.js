/**
 * Rectangulos que ocultan algunas salas del tilemap
     * @extends Sprite
     Lo que recibe
     * @param {Scene} scene - la escena que esta
     * @param {Number} x - posicion x
     * @param {Number} y - posicion y
     * @param {Number} width - ancho del collider
     * @param {Number} height - altura del collider 
     * @param {Player} player - personaje al que esta comprobando si esta dentro
     Atributos
     * @param {Boolean} isPlayerInside  - booleano para saber si player esta o no
     * @param {Rectangle} rect- rectangulo que se pinta
     */
export default class Rectangle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, width, height, player, scale = 4) {
        super(scene, x * scale, y * scale);
        this.scene = scene;
        this.player = player;

        scene.add.existing(this);
        this.setOrigin(0, 0);
        this.setDisplaySize(width * scale, height * scale);

        this.rect = scene.add.rectangle(x * scale, y * scale, width * scale, height * scale, 0x000000);
        this.rect.setOrigin(0, 0);
        this.rect.setVisible(true);

      
        scene.physics.add.existing(this, true); 

        this.scene.physics.add.overlap(this, this.player, this.onOverlap, null, this);

        this.isPlayerInside = false;

        this.rect.setDepth(3);
    }

    onOverlap() {
        if (!this.isPlayerInside) {
            this.isPlayerInside = true;
            this.rect.setVisible(false);
        }
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if (this.isPlayerInside && !this.scene.physics.world.overlap(this, this.player)) {
            this.isPlayerInside = false;
            this.rect.setVisible(true);
        }
    }
}

