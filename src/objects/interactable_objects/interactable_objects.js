/**
     * @extends Phaser.GameObjects.Sprite
     Lo que recibe
     * @param {Phaser.Scene} scene La escena del juego
     * @param {Number} x - Posicion X
     * @param {Number} y - Posicion Y
     * @param {String} texture - sprite que va tener
     Atributos
     * @param {Boolean} canInteract  - booleano para saber si se puede interactar
     * @param {Text} text - texto que se va hacer visible cuando esta dentro de una area
     * @param {Boolean} playerInRange - si player esta en una area
     * @param {Boolean} isWaitingInput - booleano para controlar el input que recibe
     * @param {Phaser.Geom.Circle} interactionArea - area para comprobar si el jugador esta cerca o no
     */
export default class InteractableObjects extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, range = 80, textDistance=100) {
        super(scene, x, y, [texture],0);

        this.scene = scene;
        this.canInteract = false;
        this.playerInRange = false;

        // Texto de interaccion inicialmente invisible
        this.text = this.scene.add.text(this.x - 10, this.y - textDistance, 'Presiona E', {
            fontFamily: 'PixelArt',
            fontSize: 18,
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: 4,
        });
        this.text.setVisible(false);
        this.isWaitingInput = true;

        this.interactionArea = new Phaser.Geom.Circle(this.x + this.width / 2, this.y + this.height / 2, range);
        this.init();

    }
    init() {
        this.text.setDepth(5);
        this.scene.events.on('Interact', () => {
            if (this.isWaitingInput) this.onInteract()
        });
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.playerInRange = Phaser.Geom.Circle.Contains(this.interactionArea, this.scene.player.x, this.scene.player.y);

        if (this.playerInRange) {
            this.onOverlap();
        }
        else if (!this.playerInRange) {
            this.onExitOverlap();
        }
    }
    onOverlap() { //entra 
        this.canInteract = true;
        if (this.text) {
            this.text.setVisible(true);
        }
    }
    onExitOverlap() { //sale
        this.canInteract = false;
        if (this.text) {
            this.text.setVisible(false);
        }
    }
}

