import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

import { Enemy } from '../entities/enemy.js';
import { Path3D_Point } from "../entities/flat3D_system/path3D_point.js";
import LayerObject from './layer_object.js';


/**
 * Class responsable for creating map zones, its enemies and position points
 */
export default class Zone extends LayerObject
{
    // Used for json queries
    static type = "zone";

    /**
	 * @param {Phaser.Scene} scene - scene where it appears
	 * @param {number} userID - defined in Tiled as the zone group name number (e.g. zone1 => userID = 1)
	 */
	constructor(scene, userID)
    {
        super(scene, userID, Zone.type);

        /**
         * Zone enemies
         * @type {Enemy[]}
        */
        this.enemies = [];

        // Initialize the zone's Enemies
        this.createEnemies();

        this.regiterWallsReferences();
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

        const enemyObjects = this.scene.map.objects.filter(obj => obj.name?.startsWith(this.groupName + "/enemies/")); // ! string

        // console.log(enemyObjects);

        for (let i = 0; i < enemyObjects.length; ++i) {
            let pathPoints = [];

            enemyObjects[i].objects.forEach(point => {
                pathPoints.push(new Path3D_Point(this.scene, point.x, point.y, point.properties.find(z => z.name === "Z").value * 20000));
            });

            this.enemies.push(new Enemy(this.scene, pathPoints[0].x, pathPoints[0].y, pathPoints[0].z, this.scene.player, pathPoints));

            this.visibleObjects.push(this.enemies[i]);
        }
    }

    regiterWallsReferences()
    {
        const wallObjects = this.scene.map.objects.filter(obj => obj.name?.startsWith(this.zoneGroupName + "/wallRefs")); // ! string

        // console.log(wallObjects);

        // enemyObjects.forEach(enemyObj => {
        //     let pathPoints = [];

        //     enemyObj.objects.forEach(point => {
        //         pathPoints.push(new Path3D_Point(this.scene, point.x, point.y, point.properties.find(z => z.name === "Z").value * 20000));
        //     });

        //     this.enemies.push(new Enemy(this.scene, pathPoints[0].x, pathPoints[0].y, pathPoints[0].z, this.scene.player, pathPoints));
        // });
    }

}