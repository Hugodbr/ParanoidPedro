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

        // Starts invisible by default
        // Walls are revealed by zones
        this.hide(); 

        /**
         * Wall object to be used to spawn a wall at x, y location
         * @type {Object}
        */
        this.wallObject = this.getThisWallObject();
        this.spawnPos = {x: this.wallObject.x, y: this.wallObject.y};

        /**
         * Number as a reference to a zone so this wall can be associated with its zone
         * @type {int}
        */
        this.zonesIDs = this.getThisZonesIDs();
    }

    /**
     * Finds in json map this wall object
     * 
     * @remarks -
     * 
     * @returns {Object}
     */
    getThisWallObject() 
    {
        const wallObjects = this.scene.map.objects.find(obj => obj.name === this.groupName + "/wall").objects; // ! string

        return wallObjects.find(obj => obj.name === "wallSpawn");
    }

    /**
     * Finds the ids of zones that share this wall
     * 
     * @remarks -
     * 
     * @returns {int}
     */
    getThisZonesIDs() 
    {
        const zoneIDs = [];
        this.wallObject.properties.forEach(obj => {
            zoneIDs.push(obj.value);
        });

        return zoneIDs;
    }

}