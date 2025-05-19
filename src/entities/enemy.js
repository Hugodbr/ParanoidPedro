import { Flat3D_Entity } from "./flat3D_system/flat3D_entity.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js';
import { Vector3D } from "../utils/vector3D.js";

import { BehaviorNode, NODE_STATUS } from "../AI_behavior/behavior_node.js";
import { FallbackBehaviorNode } from "../AI_behavior/fallback_behavior_node.js";
import { SequenceBehaviorNode } from "../AI_behavior/sequence_behavior_node.js";
import { ExecutionBehaviorNode } from "../AI_behavior/execution_behavior_node.js";

import { Path3D_System } from "./flat3D_system/Path3D_System.js";
import { Path3D_Point } from "./flat3D_system/path3D_point.js";

export class Enemy extends Flat3D_Entity {

    /**
     * The behavior tree that the enemy will execute each frame
     * @type {BehaviorNode}
     */
    behaviorTree;

    /**
     * @type {Path3D_System}
     */
    pathSystem;

    /**
	 * Normal speed of the entity when moving
	 * @type {number}
	 */
	groundSpeed = 100;

    /**
     * @param {Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {Phaser.Textures.Texture} z 
     */
    constructor(scene, x, y, z) {
        super(scene, x, y, z, TextureKeys.PlayerCharacter);

        this.pathSystem = new Path3D_System([
            new Path3D_Point(scene, 200, 200, 0),
            new Path3D_Point(scene, 400, 200, 0),
            new Path3D_Point(scene, 400, 200, 20000)
        ]);

        this.buildTree();
    }

    buildTree() {
        let ritchPath3D_Point = new ExecutionBehaviorNode((()=>{
            let diff = Vector3D.sub_vecs(this.flat3D_Position, this.pathSystem.target.flat3D_Position);
            if(Math.abs(diff.x) <= 10 && Math.abs(diff.z) <= 1){
console.log("REACHED TARGET " + this.pathSystem.target.flat3D_Position.toStr());
                return NODE_STATUS.SUCCESS;
            }
            else {
                return NODE_STATUS.FAILURE;
            }   
        }).bind(this));

        let setNextTargetContext = new  ExecutionBehaviorNode((()=>{
            this.pathSystem.setNextTarget();
console.log("CHANGE TARGET to " + this.pathSystem.target.flat3D_Position.toStr());
            return NODE_STATUS.SUCCESS;
        }).bind(this));

        let pathSeq = new SequenceBehaviorNode();
        pathSeq.addNode(ritchPath3D_Point);
        pathSeq.addNode(setNextTargetContext);

        let move = new ExecutionBehaviorNode((()=>{
            let dir = Vector3D.sub_vecs(this.pathSystem.target.flat3D_Position, this.flat3D_Position).normalize();
console.log("MOVING towards " + dir.toStr());
            this.body.setVelocityX(dir.x * this.groundSpeed);
         //   this.body.setVelocityY(dir.y * this.groundSpeed);
            this.flat3D_Position.z += dir.z * this.groundSpeed;

            return NODE_STATUS.SUCCESS;
        }).bind(this));

        let pathFall = new FallbackBehaviorNode();
        pathFall.addNode(pathSeq);
        pathFall.addNode(move);

        this.behaviorTree = pathFall;
    }

     /**
	 * Character main loop
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);
        this.body.setVelocityX(0);

        this.behaviorTree.exec();
console.log("POS " + this.flat3D_Position.toStr());
console.log("TARGET " + this.pathSystem.target.flat3D_Position.toStr());
    }
}