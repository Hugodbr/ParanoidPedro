import { SceneKeys, TextureKeys, SoundKeys } from '../../assets/asset_keys.js'


export default class GameOver extends Phaser.Scene {
    /**
     * Escena de Título.
     * @extends Phaser.Scene
     */
    constructor() {
        super(SceneKeys.Game_Over);
    }
}