import { TilemapKeys, SceneKeys } from '../../assets/asset_keys.js'

import Level from './level.js';

/**
 * Game main scene.
 * @extends Phaser.Scene
 */
export default class Level1 extends Level
{
    constructor() {
        super(SceneKeys.Level_1, TilemapKeys.Level_1);

    }

    /**
     * Initialize variables
     */
    init() {
        super.init();
    }
    
    /**
     * Image, sounds, tilemaps
     */
    preload() {
        super.preload();
    }
    
    create() {
        super.create();

        this.physics.add.overlap(this.player, this.endCollider, () => {
            this.loadNextLevel(SceneKeys.Level_2);
        });
    }

    /**
     * Scene loop
     */
    update(time, dt) {
        super.update(time, dt);
    }

}