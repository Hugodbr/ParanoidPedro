import { SceneKeys, TextureKeys, SoundKeys } from '../../assets/asset_keys.js'
import InputManager from '../managers/input_manager.js';


export default class GameOver extends Phaser.Scene {
    /**
     * Escena de Título.
     * @extends Phaser.Scene
     */
    constructor() {
        super(SceneKeys.Game_Over);
    }

    create() {

		this.inputManager = new InputManager(this);
		this.inputManager.setupGamepad();

		const centerX = this.game.scale.width / 2;
		const centerY = this.game.scale.height / 2;

		this.add.image(centerX, centerY, TextureKeys.Title_Background);
		this.add.image(centerX, 140, TextureKeys.GameOver_Title);

		let playButton = this.add.image(centerX, centerY + 100, TextureKeys.BackToMenu_Button);
		playButton.setInteractive();
		playButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
			this.time.delayedCall(100, () => {
				this.scene.start(SceneKeys.Title);
			});
		});
	}

	update(time, dt) {
	
		if (this.inputManager.nextInput()) {
			this.time.delayedCall(100, () => {
				this.scene.start(SceneKeys.Title);
			});
		}

    }
}