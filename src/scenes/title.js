import { TilemapKeys, SceneKeys, AnimationKeys, TextureKeys, SoundKeys } from '../../assets/asset_keys.js'
import InputManager from '../managers/input_manager.js';


export default class Title extends Phaser.Scene {
	/**
	 * Escena de Título.
	 * @extends Phaser.Scene
	 */
	constructor() {
		super(SceneKeys.Title);
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {

		this.inputManager = new InputManager(this);
		this.inputManager.setupGamepad();

		const centerX = this.game.scale.width / 2;
		const centerY = this.game.scale.height / 2;

		this.add.image(centerX, centerY, TextureKeys.Title_Background);
		this.add.image(centerX, 140, TextureKeys.Game_Title);

		let playButton = this.add.image(centerX, centerY + 100, TextureKeys.Play_Button);
		playButton.setInteractive();
		playButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
			this.time.delayedCall(100, () => {
				this.scene.start(SceneKeys.Story);
			});
		});

	}

	update(time, dt) {
        
		if (this.inputManager.nextInput()) {
			this.time.delayedCall(100, () => {
				this.scene.start(SceneKeys.Story);
			});
		}
    }

}