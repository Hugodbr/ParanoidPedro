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
    CHASING: "CHASING",
    SEARCHING: "SEARCHING",
    ATTACKING: "ATTACKING",
    IDLE: "IDLE"
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
    lastFrameActionState = ENEMY_STATE.PATROLLING;

    /**
     * If player is visible to the enemy
     * @type {boolean}
     */
    canSeePlayer = false;

    /**
     * The maximum distance the enemy can have with the player to be able attack it
     * @type {number}
     */
    maxAttackDistance = 100;

    /**
     * The position were the enemy will start to investigate when the state is setted to `SEARCHING`
     * @type {Vector3D}
     */
    searchInitTargetPos;

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

    /**
     * Sets the current action state and keeps the old value in a `lastFrameActionState` variable
     * @param {ENEMY_STATE} action_state 
     */
    setActionState(action_state) {

        console.assert(action_state in ENEMY_STATE, "action_state must be a ENEMY_STATE");

        this.lastFrameActionState = this.actionState;
        this.actionState = action_state;
    }

    buildTree() {

        /**
         * Returns a Conditional Node that checks if the value of `this.lastFrameActionState` is the specified
         * @param {ENEMY_STATE} action_state 
         * @returns {ExecutionBehaviorNode}
         */
        const LAST_FRAME_STATE_IS_ = (action_state) => {
            console.assert(action_state in ENEMY_STATE, "action_state must be an ENEMY_STATE");

            return ExecutionBehaviorNode.buildConditionNode((() => {
                return this.lastFrameActionState === action_state;
            }).bind(this));
        };

        /**
         * Returns a Conditional Node that checks if the value of `this.actionState` is the specified
         * @param {ENEMY_STATE} action_state 
         * @returns {ExecutionBehaviorNode}
         */
        const STATE_IS_ = (action_state) => {
            console.assert(action_state in ENEMY_STATE, "action_state must be an ENEMY_STATE");

            return ExecutionBehaviorNode.buildConditionNode((() => {
                return this.actionState === action_state;
            }).bind(this));
        };

        /**
         * Returns an Action Node that sets `this.actionState` to the specified ENEMY_STATE
         * @param {ENEMY_STATE} action_state 
         * @returns {ExecutionBehaviorNode}
         */
        const SET_STATE_TO_ = (action_state) => {
            console.assert(action_state in ENEMY_STATE, "action_state must be an ENEMY_STATE");
           
            return ExecutionBehaviorNode((() => {
                this.setActionState(action_state);
                return NODE_STATUS.SUCCESS;
            }).bind(this));
        };

        const RITCH_PATH3D_POINT = ExecutionBehaviorNode.buildConditionNode((() => {
            let diff = Vector3D.sub_vecs(this.flat3D_Position, this.pathSystem.target.flat3D_Position);
            return Math.abs(diff.x) <= 1 && Math.abs(diff.z) <= 200
        })
        .bind(this));

        const SET_NEXT_TARGET_CONTEXT = new ExecutionBehaviorNode((() => {

            this.pathSystem.setNextTarget();
            return NODE_STATUS.SUCCESS;
        
        }).bind(this));

        const MOVE_TOWARDS_TARGET_PATH_POINT = new ExecutionBehaviorNode((()=>{
            
            let dir = Vector3D.sub_vecs(this.pathSystem.target.flat3D_Position, this.flat3D_Position).normalize();

            this.body.setVelocityX(dir.x * this.groundSpeed);
            this.moveInZ(dir.z * this.groundSpeed);

            return NODE_STATUS.SUCCESS;

        }).bind(this));

        const PATH_FOLLOWING_BEHAVIOR = ( new FallbackBehaviorNode()
                
            .addNode( new SequenceBehaviorNode()
            
                .addNode(RITCH_PATH3D_POINT)
                .addNode(SET_NEXT_TARGET_CONTEXT)
            )
            .addNode(MOVE_TOWARDS_TARGET_PATH_POINT)
            
        );

        const SET_TRANSITIVITY_IN_X = new ExecutionBehaviorNode((() => {
            this.pathSystem.transitivityType = PATH_TRANSITIVITY.X_AXIS;
            return NODE_STATUS.SUCCESS;
        })
        .bind(this));

        const SET_TRANSITIVITY_IN_XZ = new ExecutionBehaviorNode((() => {
            this.pathSystem.transitivityType = PATH_TRANSITIVITY.XZ_AXIS;
            return NODE_STATUS.SUCCESS;
        })
        .bind(this));


        const CHANGE_ORIENTATION_TO_CLOSEST_POINT = new ExecutionBehaviorNode((() => {
            let pathTarget = this.pathSystem.getClosestPathPointTo(this.flat3D_Position);
            this.pathSystem.changeOriantationTowards(pathTarget.flat3D_Position);
            return NODE_STATUS.SUCCESS;
        })
        .bind(true));

        const IS_IN_DEPTH = ExecutionBehaviorNode.buildConditionNode((() => {
            return this.flat3D_Position.isInDepth();
        })
        .bind(this));

        const IS_ABOUT_TO_EXIT_Z_AXIS = ExecutionBehaviorNode.buildConditionNode((() => {
            return this.pathSystem.target.flat3D_Position.z === 0;
        })
        .bind(this));

        const MOVE_TOWARDS_NEGATIVE_Z = new ExecutionBehaviorNode((() => {
            this.moveInZ(-this.groundSpeed);
            return NODE_STATUS.SUCCESS;
        })
        .bind(this));

        const TOO_LONG_DISTANCE_TO_PLAYER = ExecutionBehaviorNode.buildConditionNode((() => {
            return Vector3D.distance(this.flat3D_Position, this.playerRef.flat3D_Position) > this.maxAttackDistance;
        })
        .bind(this));
        
        const MOVE_TOWARDS_PLAYER = new ExecutionBehaviorNode((()=>{

            let dir = Vector3D.sub_vecs(this.playerRef.flat3D_Position, this.flat3D_Position).normalize();

            this.body.setVelocityX(dir.x * this.groundSpeed);
            this.moveInZ(dir.z * this.groundSpeed);

            return NODE_STATUS.SUCCESS;
        }).bind(this));

        const ESTABLISH_SEARCH_DIRECTION_IN_PATH = new ExecutionBehaviorNode((() => {
            let pathTarget = this.pathSystem.getClosestPathPointTo(this.searchInitTargetPos);
            this.pathSystem.changeOriantationTowards(pathTarget.flat3D_Position);

            return NODE_STATUS.SUCCESS;
        })
        .bind(this));

        const CONDITION_X_BIGGER_THAN_Y = ExecutionBehaviorNode.buildConditionNode((() => {
            return Vector3D.distance(this.flat3D_Position, this.playerRef.flat3D_Position) > this.maxAttackDistance;
        }).bind(this));
        
        this.behaviorTree = PATH_FOLLOWING_BEHAVIOR;
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