import { TilemapKeys, TilesetNames, LayerNames, SoundKeys, SceneKeys } from '../../assets/asset_keys.js'

import InputManager from '../managers/input_manager.js';

import { Player } from '../entities/player.js';

import LayerObject from '../zones/layer_object.js';
import Zone from '../zones/zone.js';
import Wall from '../zones/wall.js';
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
    }

    /**
     * Scene loop
     */
    update(time, dt) {
        super.update(time, dt);
    }

}