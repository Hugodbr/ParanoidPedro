import { Enemy, ENEMY_STATE } from "./enemy.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames, AnimationKeys } from '../../assets/asset_keys.js';
import { Cooldown } from "../utils/cooldown.js";
import { Vector3D } from "../utils/vector3D.js";
import { Pulse5G } from "./pulse_5G_proyectile.js";

import { BehaviorNode, NODE_STATUS } from "../AI_behavior/behavior_node.js";
import { FallbackBehaviorNode } from "../AI_behavior/fallback_behavior_node.js";
import { SequenceBehaviorNode } from "../AI_behavior/sequence_behavior_node.js";
import { ExecutionBehaviorNode } from "../AI_behavior/execution_behavior_node.js";
import { InversionBehaviorNode } from "../AI_behavior/inversion_behavior_node.js";
import { ForceFailureBehaviorNode } from "../AI_behavior/force_failure_behavior_node.js";

import { FACING } from "./player.js";

export class Reptilian extends Enemy {

    /**
     * @type {boolean}
     */
    attackStarted = false;

    /**
     * @type {Cooldown}
     */
    attackTimer = new Cooldown(0);

    /**
     * Speed of the reptilian when running towards the player to attack it
     * @type {number}
     */
    attackRunSpeed = 290;

    /**
     * Zone that detects if the reptilian is facing a wall during the attack
     * @type {Phaser.GameObjects.Zone}
     */
    wallDetectionArea;

    /**
     * Relative position of the wallDetectionArea
     * @type {Vector3D}
     */
    wallDetectionPos = new Vector3D(80, 60, 0);;

    /**
     * Zone that detects if the reptilian is about to fall during the attack
     * @type {Phaser.GameObjects.Zone}
     */
    fallDetectionArea;

    /**
     * Relative position of the fallDetectionArea
     * @type {Vector3D}
     */
    fallDetectionPos = new Vector3D(80, 180, 0);
    
    constructor(scene, x, y, z, playerRef, pathPoints) {
        super(scene, x, y, z, playerRef, pathPoints);

        this.setTexture(TextureKeys.PlayerCharacter);

        // Wall detection
        this.wallDetectionArea = scene.add.zone(x + this.wallDetectionPos.x, y + this.wallDetectionPos.y, 20, 20);
        scene.physics.add.existing(this.wallDetectionArea);
        this.wallDetectionArea.body.setAllowGravity(false);

        // Fall detection
        this.fallDetectionArea = scene.add.zone(x + this.fallDetectionPos.x, y + this.fallDetectionPos.y, 20, 20);
        scene.physics.add.existing(this.fallDetectionArea);
        this.fallDetectionArea.body.setAllowGravity(false);

        this.buildAttackBahevior();

        this.buildTree(); // Build the tree again with the attackBehavior defined
    }

    buildAttackBahevior() {

        const ATTACK_STARTED = ExecutionBehaviorNode.buildConditionNode((() => {
            return this.attackStarted;
        }).bind(this));

        const INIT_ATTACK = new ExecutionBehaviorNode((() => {
            this.attackTimer = new Cooldown(1500, this.gameTime);
            this.attackStarted = true;
            this.play(AnimationKeys.Reptilian_Attack, true);
            
            return NODE_STATUS.SUCCESS;
        }).bind(this));

        const ATTACK_DASH_MOVE = new ExecutionBehaviorNode((() => {
            let dir = 1;
            if(this.facing === FACING.LEFT) dir = -1;

            this.body.setVelocityX(dir * this.attackRunSpeed);

            return NODE_STATUS.SUCCESS;
        }).bind(this));
        
        const ATTACK_TIMEUP = ExecutionBehaviorNode.buildConditionNode((() => {
            return this.attackStarted && this.attackTimer.canUse(this.gameTime);
        }).bind(this));

        const END_ATTACK = new ExecutionBehaviorNode((() => {
            this.setActionState(ENEMY_STATE.CHASING);
            this.attackStarted = false;

            return NODE_STATUS.SUCCESS;
        }).bind(this));

        const IS_GOING_TO_COLLIDE_WITH_WALL = ExecutionBehaviorNode.buildConditionNode((() => {
            let wallCollision = false;

            this.scene.zones.forEach(zone => {
                                
                if(this.scene.physics.overlap(zone.groundLayer, this.wallDetectionArea))
                    wallCollision = true;
            });

            return wallCollision;
        }).bind(this));

        const IS_GOING_TO_FALL = ExecutionBehaviorNode.buildConditionNode((() => {
            let wallCollision = false;

            this.scene.zones.forEach(zone => {
                if(this.scene.physics.overlap(zone.groundLayer, this.fallDetectionArea))
                    wallCollision = true;
            });

            return !wallCollision;
        }).bind(this));

        const SWITCH_FACING = new ExecutionBehaviorNode((() => {
            if(this.facing === FACING.LEFT) this.facing = FACING.RIGHT;
            else this.facing = FACING.LEFT;

            return NODE_STATUS.SUCCESS;
        }).bind(this));

        this.attackStateBehavior = ( new FallbackBehaviorNode()

            .addNode( new ForceFailureBehaviorNode()
                .setNode( new SequenceBehaviorNode()
                    .addNode( new InversionBehaviorNode()
                        .setNode(ATTACK_STARTED)
                    )
                    .addNode(INIT_ATTACK)
                )
            )

            .addNode( new SequenceBehaviorNode()
                .addNode(ATTACK_TIMEUP)
                .addNode(END_ATTACK)
            )

            .addNode( new ForceFailureBehaviorNode()
                .setNode( new SequenceBehaviorNode()

                    .addNode( new FallbackBehaviorNode()
                        .addNode(IS_GOING_TO_COLLIDE_WITH_WALL)
                    //    .addNode(IS_GOING_TO_FALL)
                    )
                    .addNode(SWITCH_FACING)
                )
            )

            .addNode(ATTACK_DASH_MOVE)
        );
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        let dir = 1;
        if(this.facing === FACING.LEFT) dir = -1;

        this.wallDetectionArea.x = this.body.position.x + this.wallDetectionPos.x * dir;
        this.wallDetectionArea.y = this.body.position.y + this.wallDetectionPos.y;

        this.fallDetectionArea.x = this.body.position.x + this.fallDetectionPos.x * dir;
        this.fallDetectionArea.y = this.body.position.y + this.fallDetectionPos.y;
    }
}