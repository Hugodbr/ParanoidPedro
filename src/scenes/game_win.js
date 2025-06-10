import { SceneKeys, TextureKeys, SoundKeys } from '../../assets/asset_keys.js'


export default class GameWin extends Phaser.Scene {
    /**
     * Escena de Título.
     * @extends Phaser.Scene
     */
    constructor() {
        super(SceneKeys.Game_Win);
    }
    
    create() {

		const centerX = this.game.scale.width / 2;
		const centerY = this.game.scale.height / 2;

		this.add.image(centerX, centerY, TextureKeys.Title_Background);
		this.add.image(centerX, 140, TextureKeys.GameWin_Title);

		let playButton = this.add.image(centerX, centerY + 100, TextureKeys.BackToMenu_Button);
		playButton.setInteractive();
		playButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
			this.time.delayedCall(100, () => {
				this.scene.start(SceneKeys.Title);
			});
		});
	}
}