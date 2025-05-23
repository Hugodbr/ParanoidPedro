import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

import { Enemy } from '../entities/enemy.js';
import { Path3D_Point } from "../entities/flat3D_system/path3D_point.js";
import LayerObject from './layer_object.js';

/**
 * TODO
 */
export default class Wall extends LayerObject
{
    // Used for json queries
    static type = "wall";

    /**
	 * @param {Phaser.Scene} scene - scene where it appears
	 * @param {number} userID - defined in Tiled as the wall group name number (e.g. wall1 => userID = 1)
	 */
	constructor(scene, userID)
    {
        super(scene, userID, Wall.type);

    }
}