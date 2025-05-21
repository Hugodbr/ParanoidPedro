import { Flat3D_Entity } from "./flat3D_system/flat3D_entity.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js';
import { Vector3D } from "../utils/vector3D.js";

import { BehaviorNode, NODE_STATUS } from "../AI_behavior/behavior_node.js";
import { FallbackBehaviorNode } from "../AI_behavior/fallback_behavior_node.js";
import { SequenceBehaviorNode } from "../AI_behavior/sequence_behavior_node.js";
import { ExecutionBehaviorNode } from "../AI_behavior/execution_behavior_node.js";

import { Path3D_System, PATH_TRANSITIVITY } from "./flat3D_system/path3D_system.js";
import { Path3D_Point } from "./flat3D_system/path3D_point.js";

const ENEMY_STATE = {
    PATROLLING: "PATROLLING",
    CHASING: "CHASING"
};

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
	groundSpeed = 280;

    /**
     * The reference to the player in the scene that the enemy will follow
     * @type {Player}
     */
    playerRef;

    /**
     * The current action state
     * @type {ENEMY_STATE}
     */
    actionState = ENEMY_STATE.PATROLLING;

    /**
     * The action state in the last frame
     * @type {ENEMY_STATE}
     */
    lastActionState = ENEMY_STATE.PATROLLING;

    /**
     * If player is visible to the enemy
     * @type {boolean}
     */
    canSeePlayer = false;

    /**
     * @param {Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {Phaser.Textures.Texture} z 
     */
    constructor(scene, x, y, z, playerRef) {
        super(scene, x, y, z, TextureKeys.PlayerCharacter);

        this.playerRef = playerRef;

        this.pathSystem = new Path3D_System([
            new Path3D_Point(scene, 200, 200, 0),
            new Path3D_Point(scene, 400, 200, 0),
            new Path3D_Point(scene, 400, 200, 20000),
            new Path3D_Point(scene, 550, 200, 20000),
            new Path3D_Point(scene, 550, 200, 0),
            new Path3D_Point(scene, 700, 200, 0)
        ]);

        this.buildTree();

        this.pKey = this.scene.input.keyboard.addKey('P'); // Can see player switch
        this.tKey = this.scene.input.keyboard.addKey('T'); // Transitivity switch
    }

    buildTree() {

        let ritchPath3D_Point = new ExecutionBehaviorNode((()=>{
            
            let diff = Vector3D.sub_vecs(this.flat3D_Position, this.pathSystem.target.flat3D_Position);

            if(Math.abs(diff.x) <= 1 && Math.abs(diff.z) <= 200){

                return NODE_STATUS.SUCCESS;
            }
            else {
                return NODE_STATUS.FAILURE;
            }   
        }).bind(this));

        let setNextTargetContext = new  ExecutionBehaviorNode((()=>{
            this.pathSystem.setNextTarget();
            
            return NODE_STATUS.SUCCESS;
        }).bind(this));

        let move = new ExecutionBehaviorNode((()=>{
            let dir = Vector3D.sub_vecs(this.pathSystem.target.flat3D_Position, this.flat3D_Position).normalize();

            this.body.setVelocityX(dir.x * this.groundSpeed);
            this.moveInZ(dir.z * this.groundSpeed);

            return NODE_STATUS.SUCCESS;
        }).bind(this));

        this.behaviorTree = (  new FallbackBehaviorNode()
                
            .addNode( new SequenceBehaviorNode()
            
                .addNode(ritchPath3D_Point)
                .addNode(setNextTargetContext)
            )
            .addNode(move)
            
        );

        let moveToPlayer = new ExecutionBehaviorNode((()=>{

            let dir = Vector3D.sub_vecs(this.playerRef.flat3D_Position, this.flat3D_Position).normalize();

            this.body.setVelocityX(dir.x * this.groundSpeed);
            this.moveInZ(dir.z * this.groundSpeed);

            return NODE_STATUS.SUCCESS;
        }).bind(this));
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

        console.log();

        if (this.pKey.isDown) this.canSeePlayer = !this.canSeePlayer;

        if (this.tKey.isDown){
            if(this.pathSystem.transitivityType === PATH_TRANSITIVITY.XZ_AXIS)
                this.pathSystem.transitivityType = PATH_TRANSITIVITY.X_AXIS;
            else
                this.pathSystem.transitivityType = PATH_TRANSITIVITY.XZ_AXIS;
        }
    }
}