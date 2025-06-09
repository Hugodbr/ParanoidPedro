import { TilemapKeys, SceneKeys } from '../../assets/asset_keys.js'

import Level from './level.js';

/**
 * Game main scene.
 * @extends Phaser.Scene
 */
export default class Level2 extends Level
{
    constructor() {
        super(SceneKeys.Level_2, TilemapKeys.Level_2);

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
            this.loadNextLevel(SceneKeys.Game_Win);
        });
    }

    /**
     * Scene loop
     */
    update(time, dt) {
        super.update(time, dt);
    }

}