import DialogueManager from '../UI/dialog_manager.js';
import DialogText from '../UI/dialog_plugin.js';
/**
 * Escena de dialogos
 * @extends Phaser.Scene
 */
export default class DialogScene extends Phaser.Scene {
	constructor() {
		super({ key: 'Dialog' });
	}
    create(data) {
        const { sceneKey, backgroundType = 'transparent', dialogos, image} = data;

        this.previousSceneKey = sceneKey;
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        // Crear fondo transparente u oscuro
        const bgColor = 0x000000;
        const bgAlpha = backgroundType === 'dark' ? 1 : 0.3;

        this.background = this.add.graphics();
        this.background.fillStyle(bgColor, bgAlpha);
        this.background.fillRect(0, 0, gameWidth, gameHeight);

        if (image) {
           const img= this.add.sprite(this.sys.game.canvas.width * 0.5, this.sys.game.canvas.height * 0.5, image).setOrigin(0.5, 0.5);
           img.play('JokerIni');
        }
        // Crear nueva instancia de DialogText y DialogueManager
        this.dialogPlugin = new DialogText(this, {
            borderThickness: 2,
            borderColor: 0xcb3234,
            borderAlpha: 1,
            windowAlpha: 0.8,
            windowColor: 0x000000,
            windowHeight: 180,
            padding: 32,
            closeBtnColor: 'white',
            dialogSpeed: 4,
            fontSize: 25,
            fontFamily: "PixelArt"
        });
        this.dialogManager = new DialogueManager(this);

        // Inicializar el administrador de di¨¢logo
        this.dialogManager.initialize(this.dialogPlugin, dialogos);
        this.dialogManager.showDialogue();

        // Manejar el cierre de la ventana
        this.dialogManager.dialogPlugin.closeBtn.on('pointerdown', () => {
            this.scene.resume(sceneKey);
            this.scene.stop();
        });

        this.events.on('dialogueComplete', () => {
            this.scene.resume(sceneKey);
            this.scene.stop();
        });
    }
    update(t,dt) {
        if (!this.dialogManager.isDialogueActive) {
            this.events.emit('dialogueComplete');
        }
    }
}