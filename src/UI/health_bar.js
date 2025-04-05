
/**
 * @extends Phaser.GameObjects.Sprite
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - coordenada x
     * @param {number} y - coordenada y
     * @param {number} depth - la capa que va a estar
     * @param {Object} character - el personaje que va tener la barra de vida
     * @param {Object} texture - textura del fondo de la barra
     * @param {Object} barTexture - textura del relleno la barra
     * atributos
     * @param {container} container - un contenedor que tiene el bar y text
     * @param {text} lifeText - el porcentaje de vida restante
     * @param {text} lifeRecoverTexts - vida recuperada
     * 
 */
export default class HealthBar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, character, texture = 'healthBarBackground', barTexture ='healthBar',depth = 5) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.maxWidth = 300;
        this.height = 30; 
        this.character = character;

        //cear un container en la escena
        this.container = scene.add.container(this.x, this.y);

        this.setOrigin(0, 0);
        this.setDisplaySize(this.maxWidth, this.height);

        this.bar = scene.add.sprite(this.x, this.y, barTexture).setOrigin(0, 0);
        this.bar.setDisplaySize(this.maxWidth, this.height); 

        //crear textos
        this.lifeText = this.scene.add.text(this.x + 10, this.y + 5, ' ', {
            fontSize: 20,
            fontFamily: "PixelArt",
            fill: '#FFFFFF',
            align: 'left'
        }).setOrigin(0, 0);

        this.lifeRecoverTexts = this.scene.add.text(this.x + this.maxWidth + 10, this.y + 5, ' ', {
            fontSize: 24,
            fontFamily: "PixelArt",
            fill: '#99FF99',
            align: 'left'
        }).setOrigin(0, 0).setVisible(false);


        this.scene.events.on('playerRecuperaVida', (value) => {
            this.lifeRecoverTexts.setText(`+${Phaser.Math.RoundTo(value)}`);
            this.lifeRecoverTexts.setVisible(true);
            this.scene.time.delayedCall(700, () => {
                this.lifeRecoverTexts.setVisible(false);
            });
        });

        //agragar los elementos al container
        this.container.add([this.bar, this, this.lifeText, this.lifeRecoverTexts]);
        this.container.setScrollFactor(0);
        this.container.setDepth(depth);
    }
    preUpdate(t,dt) {
        super.preUpdate(t, dt);

        const healthPer = Phaser.Math.Clamp(this.character.getLife() / this.character.getMaxLife(), 0, 1);

        this.lifeText.setText(`${Phaser.Math.RoundTo(healthPer * 100, 0)}%`);
        //cambiar el tam
        this.bar.setDisplaySize(this.maxWidth * healthPer, this.height);

    }
}
