import { Enemy, ENEMY_STATE } from "./enemy.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames, AnimationKeys } from '../../assets/asset_keys.js';
import { Cooldown } from "../utils/cooldown.js";
import { Vector3D } from "../utils/vector3D.js";
import { Pulse5G } from "./pulse_5G_proyectile.js";

import { BehaviorNode, NODE_STATUS } from "../AI_behavior/behavior_node.js";
import { ExecutionBehaviorNode } from "../AI_behavior/execution_behavior_node.js";

import { FACING } from "./player.js";

export class Reptilian extends Enemy {

    /**
     * @type {boolean}
     */
    attackStarted = false;

    /**
     * @type {Cooldown}
     */
    attackTimer;

    /**
     * Speed of the reptilian when running towards the player to attack it
     * @type {number}
     */
    attackRunSpeed;
    
    constructor(scene, x, y, z, playerRef, pathPoints) {
        super(scene, x, y, z, playerRef, pathPoints);

        this.setTexture(TextureKeys.PlayerCharacter);

        this.attackStateBehavior = new ExecutionBehaviorNode((() => {

            return NODE_STATUS.SUCCESS;
        }).bind(this));

        this.buildTree(); // Build the tree again with the attackBehavior defined
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
    }
}