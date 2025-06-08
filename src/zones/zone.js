import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

import { Enemy } from '../entities/enemy.js';
import { Agent5G } from '../entities/agent_5G.js';

import { Path3D_Point } from "../entities/flat3D_system/path3D_point.js";
import LayerObject from './layer_object.js';
import { Reptilian } from '../entities/reptilian.js';

const enemyMap = {
    Agent5G,
    Reptilian
}


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

        this.refID = this.parseThisRefID();
        // console.log(this.refID);

        /**
         * Zone enemies
         * @type {Enemy[]}
        */
        this.enemies = [];


        this.walls = [];

        // Initialize the zone's Enemies
        this.createEnemies();

        // Starts invisible by default
        this.hide();
	}

    parseThisRefID()
    {
        const zoneRef = this.scene.map.objects.find(obj => obj.name === this.groupName + "/refs").objects; // ! string
        const ref = zoneRef.find(obj => obj.name === "zoneRef"); // ! string

        return ref.id;
    }

    registerWall(wall) 
    {
        this.walls.push(wall);

        wall.visibleObjects.forEach(obj => {
            this.visibleObjects.push(obj);
        });

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

        // No enemies to create in this zone
        if (enemyObjects.length === 0) {
            return;
        }

        // console.log(enemyObjects);

        for (let i = 0; i < enemyObjects.length; ++i) {
            let pathPoints = [];

            enemyObjects[i].objects.forEach(point => {
                pathPoints.push(new Path3D_Point(this.scene, point.x, point.y, point.properties.find(z => z.name === "Z").value * 20000));
            });

            const enemyType = enemyObjects[i].properties.find(prop => prop.name === "type").value;
            const hasKey = enemyObjects[i].properties.find(prop => prop.name === "hasKey").value;

            let newEnemy = new enemyMap[enemyType](this.scene, pathPoints[0].x, pathPoints[0].y, pathPoints[0].z, this.scene.player, pathPoints);

            newEnemy.hasKey = hasKey;

            this.enemies.push(newEnemy);

            this.visibleObjects.push(this.enemies[i]);
        }
    }



}