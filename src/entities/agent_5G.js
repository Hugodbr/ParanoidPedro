import { Enemy, ENEMY_STATE } from "./enemy.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames, AnimationKeys } from '../../assets/asset_keys.js';
import { Cooldown } from "../utils/cooldown.js";
import { Vector3D } from "../utils/vector3D.js";
import { Pulse5G } from "./pulse_5G_proyectile.js";

import { BehaviorNode, NODE_STATUS } from "../AI_behavior/behavior_node.js";
import { ExecutionBehaviorNode } from "../AI_behavior/execution_behavior_node.js";

import { FACING } from "./player.js";

export class Agent5G extends Enemy {

    /**
     * The time that the enemy takes before repeting the attack or changing the state
     * @type {Cooldown}
     */
    attackCooldown;

    /**
     * Whether the shoot attack has been performed or not in the current attack iteration
     * @type {boolean}
     */
    shootAttackDone = false;

    /**
     * The relative position where the proyectiles are instanciated
     * @type {Vector3D}
     */
    gunRelativePosition = new Vector3D(40, 60, 0);

    constructor(scene, x, y, z, playerRef, pathPoints) {
        super(scene, x, y, z, playerRef, pathPoints);

        this.setTexture(TextureKeys.Agent5G);

        this.anims.create({
            key: AnimationKeys.Agent5G_Idle,
            frames: this.anims.generateFrameNumbers(TextureKeys.Agent5G, { start: 0, end: 3 }),
            frameRate: 5, // Velocidad de la animación
            repeat: -1    // Animación en bucle
        });

        this.anims.create({
            key: AnimationKeys.Agent5G_Run,
            frames: this.anims.generateFrameNumbers(TextureKeys.Agent5G, { start: 4, end: 10 }),
            frameRate: 5, // Velocidad de la animación
            repeat: -1    // Animación en bucle
        });

        this.anims.create({
            key: AnimationKeys.Agent5G_Shoot,
            frames: this.anims.generateFrameNumbers(TextureKeys.Agent5G, { start: 11, end: 13 }),
            frameRate: 5, // Velocidad de la animación
        //    repeat: 2    // Animación en bucle
        });

        this.anims.create({
            key: AnimationKeys.Agent5G_Walk,
            frames: this.anims.generateFrameNumbers(TextureKeys.Agent5G, { start: 14, end: 21 }),
            frameRate: 5, // Velocidad de la animación
            repeat: -1    // Animación en bucle
        });

        //this.play(AnimationKeys.Agent5G_Idle, true);
        this.patrolAnimation = AnimationKeys.Agent5G_Walk;
        this.searchAnimation = AnimationKeys.Agent5G_Walk;
        this.chaseAnimation = AnimationKeys.Agent5G_Run;
        this.attackAnimation = AnimationKeys.Agent5G_Shoot;

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + AnimationKeys.Agent5G_Shoot, (() => {
            //this.actionState = ENEMY_STATE.CHASING;
            this.attackCooldown = new Cooldown(2000, this.gameTime);
            this.shootAttackDone = true;

            this.facePlayer();
        }).bind(this));

        const SHOOT_FRAME = "12";

        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, (() => {

            if(this.anims.currentAnim.key === AnimationKeys.Agent5G_Shoot && this.frame.name == SHOOT_FRAME) {
                
                let sign = 1;
                if(this.flipX) sign = -1;

                let gunPos = this.gunRelativePosition.copy();
                gunPos.x *= sign;

                let pos = Vector3D.add_vecs(this.flat3D_Position, gunPos);

                new Pulse5G(this.scene, pos, new Vector3D(100 * sign, 0, 0));
            }
                
        }).bind(this));

        this.attackStateBehavior = new ExecutionBehaviorNode((() => {
            if(this.shootAttackDone === false)
                this.play(AnimationKeys.Agent5G_Shoot, true);

            return NODE_STATUS.SUCCESS;
        }).bind(this));

        this.buildTree(); // Build the tree again with the attackBehavior defined
    }
    
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if(this.actionState === ENEMY_STATE.ATTACKING && this.shootAttackDone === true && this.attackCooldown.canUse(t)) {
            
            if(Vector3D.distance(this.flat3D_Position, this.playerRef.flat3D_Position) > this.maxAttackDistance)
                this.setActionState(ENEMY_STATE.CHASING);//this.actionState = ENEMY_STATE.CHASING;

            this.shootAttackDone = false;
        }
    }
}