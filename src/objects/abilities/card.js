const DEFAULT_DAMAGE = 1;
const DEFAULT_LIFE = 1;

/** 
* Constructor del Card
* @param {Scene} scene scene Escena en la que aparece
* @param {number} x Coordenada X del 
* @param {number} y Coordenada Y del 
* @param {string} texture Textura del sprite
* @param {number} life Vida inicial del 
*/
export default class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, life) {
        super(scene, x, y, texture);

        this.scene = scene;   
        this.life = life;
        this.isDestroyed = false;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.setScale(2); 
        this.setDepth(1);
    }

    onGotHit(damage) {
        if (this.isDestroyed) return;

        this.life -= damage;
        //console.log(`Card golpeado. Vida restante: ${this.life}`);

        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => this.clearTint());

        if (this.life <= 0) {
            this.destroyCard();
        }
    }

    destroyCard() {
        if (this.scene && this.scene.events) {
            this.isDestroyed = true;
            //console.log('Scene:', this.scene);
            //console.log('Scene events:', this.scene?.events);
            this.scene.events.emit('cardDestroyed' ); // Notifica a la escena
        } else {
            console.error("Error: 'scene' o 'scene.events' no está definido.");
        }
        this.destroy();

    }

}
