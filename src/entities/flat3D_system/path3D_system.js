import { Vector3D } from "../../utils/vector3D.js";
import { Path3D_Point  } from "./path3D_point.js";

export const PATH_TRANSITIVITY = {
    X_AXIS: "X_AXIS",  // Path only in the main plane of the game, where the player moves
    XZ_AXIS: "XZ_AXIS" // Path passes throug corridors as well
};

const PATH_ORIENTATION = { // If the entity going backwards or not
    OBVERSE: "OBVERSE",
    REVERSE: "REVERSE"
};

/**
 * System that an entity will use to consult where does it need to move in orther to follow the defined path
 */
export class Path3D_System {
    /**
     * List of Path3D points that define the path that the entity will follow
     * @type {Path3D_Point[]}
     */
    pathPoints = new Array();

    /**
     * X_AXIS (by default) if the entity can only use the main plane (where the player moves and the action 
     * develops), and XZ_AXIS if it can use corridors and deep points in Z axis
     * @type {PATH_TRANSITIVITY}
     */
    transitivityType = PATH_TRANSITIVITY.X_AXIS;

    /**
     * [READ-ONLY] The actual point the entity must reach
     * @type {Path3D_Point}
     */
    target;

    /**
     * OBVERSE (by deafult) if the entity is following the normal sense of the path, REVERSE if it is going
     * backwards
     * @type {PATH_ORIENTATION}
     */
    _pathOrientation;

    /**
     * Keeps the actual position in the array of points in order to be able of knowing the next point, as 
     * the Path3D points may not be unique in the path and can get repeated in more complex paths
     * @type {number}
     */
    _pathArr_it;

    /**
     * Returns the following target's position in the array without updating the actual one (`constatnt method`)
     * @returns {number}
     */
    _getNextPathArr_It() {
        
        let pathArr_it = this._pathArr_it;

        // Getting the next points array position
        if(this._pathOrientation === PATH_ORIENTATION.OBVERSE) { // Positive direction in the points array
            if(pathArr_it + 1 < this.pathPoints.length) ++pathArr_it;
            else --pathArr_it;
        }
        else { // Negative direction in the points array
            if(pathArr_it >= 0) --pathArr_it;
            else ++pathArr_it;
        }

        // Posible out of bounds if the path was of only one point
        if(pathArr_it >= this.pathPoints.length) --pathArr_it;
        else if(pathArr_it < 0) ++pathArr_it;

        return pathArr_it;
    }

    /**
     * Returns the following target, it doesn't modify the actual one as it is just an information getter 
     * (`constant method`) 
     * @returns {Path3D_Point}
     */
    getNextTarget() {
        let nextPoint_it = this._getNextPathArr_It();

        return this.pathPoints[nextPoint_it];
    }

    /**
     * Updates the target and/or the orientation and sets them to the following Path3D_Point in the 
     * internal path list with the switched orientation if it is necessary
     */
    setNextTarget() {
        let nextPoint_it = this._getNextPathArr_It();

        // Set the new orientation if needed
        if(nextPoint_it < this._pathArr_it) this._pathOrientation = PATH_ORIENTATION.REVERSE;
        else this._pathOrientation = PATH_ORIENTATION.OBVERSE;

        this._pathArr_it = nextPoint_it; // Update the index in the array

        this.target = this.pathPoints[this._pathArr_it]; // Update the returning Path3D_Point of variable target
    }

    /**
     * Returns the point in the path list that is closest to the given point, if there is not path (path 
     * array is empty) the method will return `null`.
     * 
     * *Useful for enemies to turn back to their patrolling positions.*
     * @param {Vector3D} flat3D_position 
     * @returns {Path3D_Point}
     */
    getClosestPathPointTo(flat3D_position) {

        let closestPathPoint = null;
        let closestDistance = Infinity;

        this.pathPoints.forEach(pathPoint => {

            let dist = Vector3D.distance(pathPoint.flat3D_Position, flat3D_position);

            if (dist < closestDistance) {
                closestDistance = dist;
                closestPathPoint = pathPoint;
            }
        });

        return closestPathPoint;
    }

    /**
     * Sets the path direction towards the given position
     * 
     * *Useful for the Searching State of enemies*
     * @param {Vector3D} flat3D_position 
     */
    changeOriantationTowards(flat3D_position) {

        let pathPoint = this.getClosestPathPointTo(flat3D_position);

        let point_it = this.pathPoints.indexOf(pathPoint);

        if(this._pathArr_it < point_it && this._pathOrientation === PATH_ORIENTATION.REVERSE) {
            this._pathOrientation === PATH_ORIENTATION.OBVERSE;
            this.setNextTarget();
        }
        else if(this._pathArr_it > point_it && this._pathOrientation === PATH_ORIENTATION.OBVERSE) {
            this._pathOrientation === PATH_ORIENTATION.REVERSE;
            this.setNextTarget();
        }
    }
}