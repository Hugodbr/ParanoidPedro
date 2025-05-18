import { Flat3D_Entity } from "./flat3D_entity.js";

export class Path3D_Point extends Flat3D_Entity {

    /**
     * Identifies de zone of the map where the point is, used by the patrolling system and useful to patrol
     * without using corridor connection
     * @type {number}
     */
    zoneID = -1;

    /**
     * Identifies a point as a corridor connection point that can be used to access other map zones
     * @type {boolean}
     */
    isCorridorPoint = false;

    constructor(scene, x, y, z) {
        super(scene, x, y, z);

        
    }
}