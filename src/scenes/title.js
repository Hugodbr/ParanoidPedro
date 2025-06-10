import { TilemapKeys, SceneKeys, AnimationKeys, TextureKeys, SoundKeys } from '../../assets/asset_keys.js'


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

		const centerX = this.game.scale.width / 2;
		const centerY = this.game.scale.height / 2;

		this.add.image(centerX, centerY, TextureKeys.Title_Background);

		let playButton = this.add.image(centerX, centerY + 50, TextureKeys.Play_Button);
		playButton.setInteractive();
		playButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
			this.time.delayedCall(500, () => {
				this.scene.start(SceneKeys.Level_1);
			});
		});
	}

}