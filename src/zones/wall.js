import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

import { Enemy } from '../entities/enemy.js';
import { Path3D_Point } from "../entities/flat3D_system/path3D_point.js";
import LayerObject from './layer_object.js';

/**
 * Wall class defines an object that has:
 * - tilemaps: ground, background
 * - a sensor collider to trigger a break
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
         * Wall object to be used to spawn a wall sensor at x, y location
         * @type {Object}
        */
        this.wallObject = this.getThisWallObject();
        this.spawnPos = {x: this.wallObject.x, y: this.wallObject.y};
        this.size = {w: this.wallObject.width, h: this.wallObject.height};


        /**
         * Layer to be deactivated when a wall is broken
         * @type {Phaser.Tilemaps.TilemapLayer}
        */
        this.wallLayer = this.createWallLayer();


        /**
         * Sensor rectangle to trigger wall breaking
         * @type {Phaser.GameObjects.Rectangle}
        */
        this.wallSensor = this.createWallSensor();


        /**
         * Number as a reference to a zone so this wall can be associated with its zone.
         * For initial setup
         * @type {int}
        */
        this.zonesIDs = this.getThisZonesIDs();


        /**
         * Array of zones (2) that have this wall
         * @type {Array<Zone>}
        */
        this.zones = [];

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

    /**
     * Creates the wall layer (visual) and the wall sensor collider (interaction)
     * 
     * @remarks -
     * 
     * @returns {Phaser.Tilemaps.TilemapLayer}
     */
    createWallLayer()
    {
        // Create wall layer
        const wallLayerName = this.groupName + "/" + LayerNames.Wall;
        const wallLayer = this.scene.map.createLayer(wallLayerName, this.scene.mapTileset, 0, 0);
        wallLayer.setCollisionByExclusion(-1); // In JSON the index appears as 0

        this.collisionLayers.push(wallLayer);
        this.visibleObjects.push(wallLayer);

        return wallLayer;
    }

    createWallSensor()
    {
        const wallSensor = this.scene.add.rectangle(this.spawnPos.x, this.spawnPos.y, this.size.w, this.size.h, 0x0000ff, this.scene.isDebug ? 0.2 : 0).setOrigin(0);
        this.scene.physics.add.existing(wallSensor, true);

        return wallSensor;
    }

    registerZone(zone)
    {
        this.zones.push(zone);
    }

    /**
     * When a wall is broken, its zones are revealed and the zones reveal its bounderies walls
     * 
     * @remarks -
     * 
     * @returns {void}
     */
    break()
    {
        // Reveal zones
        this.zones.forEach(zone => {
            zone.reveal();
        });

        // Deactivate wall sensor
        this.wallSensor.setVisible(false);
        this.wallSensor.body.enable = false;
        this.wallSensor.active = false;

        // Deactivate wall layer
        this.wallLayer.setVisible(false);
        this.wallLayer.setCollisionByExclusion([]);
    }
}