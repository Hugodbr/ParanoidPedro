import { Flat3D_Entity } from "./flat3D_system/flat3D_entity.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames, AnimationKeys } from '../../assets/asset_keys.js';
import { Vector3D } from "../utils/vector3D.js";
import { Cooldown } from "../utils/cooldown.js";

import { BehaviorNode, NODE_STATUS } from "../AI_behavior/behavior_node.js";
import { FallbackBehaviorNode } from "../AI_behavior/fallback_behavior_node.js";
import { SequenceBehaviorNode } from "../AI_behavior/sequence_behavior_node.js";
import { ExecutionBehaviorNode } from "../AI_behavior/execution_behavior_node.js";
import { InversionBehaviorNode } from "../AI_behavior/inversion_behavior_node.js";
import { ForceFailureBehaviorNode } from "../AI_behavior/force_failure_behavior_node.js";

import { Path3D_System, PATH_TRANSITIVITY } from "./flat3D_system/path3D_system.js";
import { Path3D_Point } from "./flat3D_system/path3D_point.js";
import { FACING } from "./player.js";

export const ENEMY_STATE = {
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
     * Behavior tree fragment that fits in the attack state part of the main tree
     * @type {BehaviorNode}
     */
    attackStateBehavior = new BehaviorNode();

    /**
     * @type {Path3D_System}
     */
    pathSystem;

    /**
	 * Actual speed of the entity when moving (*Changes through action states*)
	 * @type {number}
	 */
	groundSpeed = 280;

    /**
	 * @type {number}
	 */
	patrolStateSpeed = 250;

    /**
	 * @type {number}
	 */
	serachStateSpeed = 280;

    /**
	 * @type {number}
	 */
	chaseStateSpeed = 300;

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
    maxAttackDistance = 300;

    /**
     * The position were the enemy will start to investigate when the state is setted to `SEARCHING`
     * @type {Vector3D}
     */
    searchInitTargetPos;
    
    /**
     * Zone that detects the player in orther to set the `canSeePlayer` to true
     * @type {Phaser.GameObjects.Zone}
     */
    visionArea;

    /**
     * Lenght that defines de width of the vision area
     * @type {number}
     */
    visionScope = 400;
    
    /**
     * ´time´ variable value from the `preUpdate` function in orther to control cooldowns
     * @type {number}
     */
    gameTime;

    /**
     * @type {Cooldown}
     */
    searchStateCooldown;

    /**
     * @type {FACING}
     */
    facing;

    /**
     * Idle state animation key
     * @type {String}
     */
    idleAnimation = "";
    
    /**
     * Patrolling state animation key
     * @type {String}
     */
    patrolAnimation = "";
    
    /**
     * Searching state animation key
     * @type {String}
     */
    searchAnimation = "";

    /**
     * Chasing state animation key
     * @type {String}
     */
    chaseAnimation = "";
    
    /**
     * Attacking state animation key
     * @type {String}
     */
    attackAnimation = "";
    
    /**
     * @param {Scene} scene 
     * @param {number} x 
     * @param {number} y 
     * @param {Phaser.Textures.Texture} z 
     */
    constructor(scene, x, y, z, playerRef, pathPoints) {
        super(scene, x, y, z, TextureKeys.Agent5G);

        this.playerRef = playerRef;

        this.pathSystem = new Path3D_System(pathPoints);

        this.pathSystem.transitivityType = PATH_TRANSITIVITY.XZ_AXIS;

        this.buildTree();

        this.visionArea = scene.add.zone(x, y, this.width + this.visionScope, 240);

        this.facing = FACING.RIGHT;

        let visionAreaOriginX = (this.width*0.5 / this.visionArea.width)
        this.visionArea.setOrigin(visionAreaOriginX, 0.5);
        scene.physics.add.existing(this.visionArea);
        this.visionArea.body.setAllowGravity(false);

        this.pKey = this.scene.input.keyboard.addKey('P'); // Can see player switch
        this.tKey = this.scene.input.keyboard.addKey('T'); // Transitivity switch

        // !!!
        this.life = 3;
        this.hasKey = false;
        this.blinkTween = null;
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

    facePlayer() {

        let diffWithPlayer = Vector3D.sub_vecs(this.playerRef.flat3D_Position, this.flat3D_Position);

        if(diffWithPlayer.x > 0) this.facing = FACING.RIGHT;
        else if(diffWithPlayer.x < 0) this.facing = FACING.LEFT;
    }

    buildTree() {

        // Creating the leafs of the behavior tree

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
           
            return new ExecutionBehaviorNode((() => {
                this.setActionState(action_state);
                return NODE_STATUS.SUCCESS;
            }).bind(this));
        };

        const START_SEARCH_TIMER_ = (time) => {
            console.assert(typeof time === "number", "time must be a number");

            return new ExecutionBehaviorNode((() => {
                this.searchStateCooldown = new Cooldown(time, this.gameTime);
                return NODE_STATUS.SUCCESS;
            }).bind(this));
        };

        const DEBUG_FALLBACK_POINT = (message) => {
            return new ExecutionBehaviorNode(() => {
                console.log(message)
                return NODE_STATUS.FAILURE;
            });
        };

        const DEBUG_SEQUENCE_POINT = (message) => {
            return new ExecutionBehaviorNode(() => {
                console.log(message)
                return NODE_STATUS.SUCCESS;
            });
        };

        const SET_GROUND_SPEED_TO_ = (speed) => {

            return new ExecutionBehaviorNode((() => {
                this.groundSpeed = speed;
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
        .bind(this));

        const IS_IN_DEPTH = ExecutionBehaviorNode.buildConditionNode((() => {
            return this.isInDepth();
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

            this.body.setVelocityX(Math.sign(dir.x) * this.groundSpeed);

            return NODE_STATUS.SUCCESS;
        }).bind(this));

        const ESTABLISH_SEARCH_DIRECTION_IN_PATH = new ExecutionBehaviorNode((() => {
            let pathTarget = this.pathSystem.getClosestPathPointTo(this.searchInitTargetPos);
            this.pathSystem.changeOriantationTowards(pathTarget.flat3D_Position);

            return NODE_STATUS.SUCCESS;
        })
        .bind(this));

        const CAN_SEE_PLAYER = ExecutionBehaviorNode.buildConditionNode((() => {
            return this.canSeePlayer;
        }).bind(this));
        
        const SEARCH_TIME_FINISHED = ExecutionBehaviorNode.buildConditionNode((() => {
            return this.searchStateCooldown.canUse(this.gameTime);
        }).bind(this));

        const PLAY_IDLE_ANIMATION = new ExecutionBehaviorNode((() => {
            this.play(this.idleAnimation, true);

            return NODE_STATUS.SUCCESS;
        }).bind(this));
        
        const PLAY_PATROL_ANIMATION = new ExecutionBehaviorNode((() => {
            this.play(this.patrolAnimation, true);
            
            return NODE_STATUS.SUCCESS;
        }).bind(this));
        
        const PLAY_SEARCH_ANIMATION = new ExecutionBehaviorNode((() => {
            this.play(this.searchAnimation, true);

            return NODE_STATUS.SUCCESS;
        }).bind(this));
        
        const PLAY_CHASE_ANIMATION = new ExecutionBehaviorNode((() => {
            this.play(this.chaseAnimation, true);
            
            return NODE_STATUS.SUCCESS;
        }).bind(this));
    
        // Creating the tree

        this.behaviorTree = ( new FallbackBehaviorNode()

            .addNode( new ForceFailureBehaviorNode()

                .setNode( new FallbackBehaviorNode()

                    .addNode( new SequenceBehaviorNode()
                        .addNode(CAN_SEE_PLAYER)
                        .addNode( new InversionBehaviorNode()
                            .setNode(STATE_IS_(ENEMY_STATE.ATTACKING))
                        )
                        .addNode(SET_STATE_TO_(ENEMY_STATE.CHASING))
                    )
                    .addNode( new SequenceBehaviorNode()
                        .addNode( new InversionBehaviorNode()
                            .setNode(CAN_SEE_PLAYER)
                        )
                        .addNode(STATE_IS_(ENEMY_STATE.CHASING))
                        .addNode(SET_STATE_TO_(ENEMY_STATE.SEARCHING))
                    )
                )
            )

            .addNode( new SequenceBehaviorNode()

                .addNode(STATE_IS_(ENEMY_STATE.PATROLLING))

                .addNode(PLAY_PATROL_ANIMATION)
                
                .addNode( new FallbackBehaviorNode()
                        
                    .addNode( new SequenceBehaviorNode()
    
                        .addNode(SET_TRANSITIVITY_IN_XZ)
                        .addNode( new InversionBehaviorNode()
                            .setNode( new FallbackBehaviorNode()
                                .addNode(LAST_FRAME_STATE_IS_(ENEMY_STATE.PATROLLING))
                                .addNode(LAST_FRAME_STATE_IS_(ENEMY_STATE.SEARCHING))
                            )
                        )
                        .addNode(CHANGE_ORIENTATION_TO_CLOSEST_POINT)
                    )

                    .addNode(PATH_FOLLOWING_BEHAVIOR)
                )
            )

            .addNode( new SequenceBehaviorNode()

                .addNode(STATE_IS_(ENEMY_STATE.SEARCHING))

                .addNode(PLAY_SEARCH_ANIMATION)

                .addNode( new FallbackBehaviorNode()

                    .addNode( new ForceFailureBehaviorNode()

                        .setNode( new SequenceBehaviorNode() // Setting the speed and the search direction
                            .addNode(new InversionBehaviorNode()
                                .setNode(LAST_FRAME_STATE_IS_(ENEMY_STATE.SEARCHING))
                            )
                            .addNode(SET_GROUND_SPEED_TO_(this.serachStateSpeed))
                            .addNode(CHANGE_ORIENTATION_TO_CLOSEST_POINT) // TODO: SET THE SEARCH DIRECTION
                            .addNode(START_SEARCH_TIMER_(15000))
                        )
                    )
                    .addNode( new SequenceBehaviorNode()
                        .addNode(SEARCH_TIME_FINISHED) // TIMEOUT
                        .addNode(DEBUG_SEQUENCE_POINT("It was nothing, lets keep patrolling"))
                        .addNode(SET_STATE_TO_(ENEMY_STATE.PATROLLING))
                    )
                    .addNode( new ForceFailureBehaviorNode()
                        
                        .setNode( new SequenceBehaviorNode()
                            .addNode(IS_ABOUT_TO_EXIT_Z_AXIS)
                            .addNode(SET_TRANSITIVITY_IN_X)
                        )
                    )

                    .addNode(PATH_FOLLOWING_BEHAVIOR)
                )
            )

            .addNode( new SequenceBehaviorNode()

                .addNode(STATE_IS_(ENEMY_STATE.CHASING))

                .addNode(PLAY_CHASE_ANIMATION)

                .addNode( new FallbackBehaviorNode()
                    .addNode( new SequenceBehaviorNode()
                        .addNode(IS_IN_DEPTH)
                        .addNode(MOVE_TOWARDS_NEGATIVE_Z)
                    )
                    .addNode( new SequenceBehaviorNode()
                        .addNode(TOO_LONG_DISTANCE_TO_PLAYER)
                        .addNode(MOVE_TOWARDS_PLAYER)
                    )
                    .addNode(SET_STATE_TO_(ENEMY_STATE.ATTACKING))
                )
            )

            .addNode( new SequenceBehaviorNode()

                .addNode(STATE_IS_(ENEMY_STATE.ATTACKING))

                .addNode(this.attackStateBehavior)
            )
        );
    }

     /**
	 * Character main loop
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);

        this.gameTime = t;

        this.body.setVelocityX(0);
        
        this.visionArea.x = this.body.position.x;
        this.visionArea.y = this.body.position.y;

        if (this.scene.physics.overlap(this.playerRef, this.visionArea) && this.flat3D_Position.z <= 0) 
        {
            this.canSeePlayer = true;
        }
        else {
            this.canSeePlayer = false;
        }

        this.behaviorTree.exec();

        /*if(this.lastFrameActionState !== this.actionState)
            console.log(this.actionState);*/

        this.setActionState(this.actionState); // To update de lastFrameActionState variable

        let diffWithPlayer = Vector3D.sub_vecs(this.playerRef.flat3D_Position, this.flat3D_Position);

        if (this.body.velocity.x < 0 || this.actionState === ENEMY_STATE.CHASING && diffWithPlayer.x < 0) {
            this.facing = FACING.LEFT;
        }
        else if (this.body.velocity.x > 0 || this.actionState === ENEMY_STATE.CHASING && diffWithPlayer.x > 0) {
            this.facing = FACING.RIGHT;
        }

        if (this.facing === FACING.RIGHT) {
            let visionAreaOriginX = (this.width*0.5 / this.visionArea.width);
            this.visionArea.setOrigin(visionAreaOriginX, 0.5);
        }
        else {
            let visionAreaOriginX = (1 - this.width*0.5 / this.visionArea.width);
            this.visionArea.setOrigin(visionAreaOriginX, 0.5);
        }

        this.flipX = (this.facing === FACING.LEFT);
    }

    blinkRedDamaged(duration)
    {
        if (this.blinkTween) {
            this.blinkTween.stop();
            this.blinkTween.remove();
            this.clearTint();
            this.setAlpha(1);
            console.log("tween remove");
        }

        this.setTint(0xff0000);

        this.blinkTween = this.scene.tweens.add({
            targets: this,
            alpha: {from:1, to:0.5},
            duration: duration,
            yoyo: true,
            repeat: -1,
        });
    }

    slowDown()
    {
        this.groundSpeed = this.groundSpeed * 0;
        this.patrolStateSpeed = this.patrolStateSpeed * 0;
        this.serachStateSpeed = this.serachStateSpeed * 0;
        this.chaseStateSpeed = this.chaseStateSpeed * 0;
    }

    getHit(points)
    {
        console.log(points);
        
        this.life -= points;

        this.slowDown(); // TODO OPTIONAL DOESNT WORK

        if (this.life > 0) {
            let duration = 50 * (this.life * 2);
            this.blinkRedDamaged(duration);
        }
        else {
            // TODO DEATH ANIMATION. ON COMPLETE DIE()
            this.die();
        }
    }

    die()
    {
        this.destroy();
    }
}