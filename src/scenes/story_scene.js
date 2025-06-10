import { TilemapKeys, SceneKeys, AnimationKeys, TextureKeys, SoundKeys } from '../../assets/asset_keys.js'
import InputManager from '../managers/input_manager.js';


export default class StoryScene extends Phaser.Scene {
    /**
     * Escena de Título.
     * @extends Phaser.Scene
     */
    constructor() {
        super(SceneKeys.Story);
    }

    /**
    * Creación de los elementos de la escena principal de juego
    */
    create() {

        this.inputManager = new InputManager(this);
        this.inputManager.setupGamepad();

        
        const centerX = this.game.scale.width / 2;
        const centerY = this.game.scale.height / 2;

        let background = this.add.image(centerX, centerY, TextureKeys.Introduction_Comic);
        
        background.setInteractive();
        background.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.time.delayedCall(100, () => {
                this.scene.start(SceneKeys.Level_1);
            });
        });
    }

    update(time, dt) {
        
		if (this.inputManager.nextInput()) {
			this.time.delayedCall(100, () => {
				this.scene.start(SceneKeys.Level_1);
			});
		}

    }

}