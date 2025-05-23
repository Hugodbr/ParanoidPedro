import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

import { Enemy } from '../entities/enemy.js';
import { Path3D_Point } from "../entities/flat3D_system/path3D_point.js";

/**
 * Class responsable for creating map zones, its enemies and position points
 */
export default class Zone
{
    /**
	 * @param {Phaser.Scene} scene - scene where it appears
	 * @param {number} userID - defined in Tiled as the zone group name number (e.g. zone1 => userID = 1)
	 */
	constructor(scene, userID) 
    {
        /**
         * The Phaser scene that owns this zone.
         * @type {Phaser.Scene}
         */
        this.scene = scene;

        /**
         * The numeric ID used to distinguish this zone (e.g., zone1 => 1).
         * @type {number}
         */
        this.userID = userID;

        /**
         * The full zone group name used to locate layer groups in the Tiled map.
         * @type {string}
         */
        this.zoneGroupName = "zone" + userID; // group name in tiled

        // ! DEBUG
        // console.log(this.scene.map);
        // !

        /**
         * Zone layers that have collision
         * @type {Phaser.Tilemaps.TilemapLayer[]}
         */
        this.collisionLayers = [];

        // Initialize the zone's layers
        this.createLayers();

        /**
         * Zone enemies
         * @type {Enemy[]}
        */
        this.enemies = [];

        // Initialize the zone's Enemies
        this.createEnemies();

        // Define collisions between objects and layers
        this.defineCollisions();

	}

    /**
     * Creates the layers from the map for this particular zone.
     * 
     * @remarks -
     * 
     * @returns {void}
     */
    createLayers()
    {
        //* Collision layers
        // Create ground layer
        this.groundLayerName = this.zoneGroupName + "/" + LayerNames.Ground;
        this.groundLayer = this.scene.map.createLayer(this.groundLayerName, this.scene.mapTileset, 0, 0);
        this.groundLayer.setCollisionByExclusion(-1); // In JSON the index appears as 0

        this.collisionLayers.push(this.groundLayer);

        //* Non collision layers
        // Create backgorund scenery layer
        this.backgroundSceneryLayerName = this.zoneGroupName + "/" + LayerNames.BackgroundScenery;
        this.backgroundSceneryLayer = this.scene.map.createLayer(this.backgroundSceneryLayerName, this.scene.mapTileset, 0, 0);
    }

    /**
     * Create all enemies for this zone
     * 
     * @remarks -
     * 
     * @returns {void}
     */
    createEnemies()
    {
        // console.log(this.scene.map.objects);

        const enemyObjects = this.scene.map.objects.filter(obj => obj.name?.startsWith(this.zoneGroupName + "/enemies/"));

        // console.log(enemyObjects);

        enemyObjects.forEach(enemyObj => {
            let pathPoints = [];

            enemyObj.objects.forEach(point => {
                pathPoints.push(new Path3D_Point(this.scene, point.x, point.y, point.properties.find(z => z.name === "Z").value * 20000));
            });

            this.enemies.push(new Enemy(this.scene, pathPoints[0].x, pathPoints[0].y, pathPoints[0].z, this.scene.player, pathPoints));
        });

    }

    /**
     * Define collisios between objects and layers
     * 
     * @remarks -
     * 
     * @returns {void}
     */
    defineCollisions() 
    {    
        this.collisionLayers.forEach(layer => {

            this.scene.physics.add.collider(this.scene.player, layer);
            
            this.enemies.forEach(enemy => {
                this.scene.physics.add.collider(enemy, layer);
            });
        });
    }

}