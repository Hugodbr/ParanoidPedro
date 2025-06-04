import { Enemy, ENEMY_STATE } from "./enemy.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames, AnimationKeys } from '../../assets/asset_keys.js';
import { Cooldown } from "../utils/cooldown.js";
import { Vector3D } from "../utils/vector3D.js";
import { Pulse5G } from "./pulse_5G_proyectile.js";

import { BehaviorNode, NODE_STATUS } from "../AI_behavior/behavior_node.js";
import { ExecutionBehaviorNode } from "../AI_behavior/execution_behavior_node.js";

export class Agent5G extends Enemy {

    /**
     * The time that the enemy takes before repeting the attack or changing the state
     * @type {Cooldown}
     */
    attackCooldown;

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
            repeat: 0    // Animación en bucle
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
            this.actionState = ENEMY_STATE.CHASING;
            //attackCooldown = new Cooldown(1000);
        }).bind(this))

        //this.setFlipX(true);
        this.attackStateBehavior = new ExecutionBehaviorNode((() => {
            new Pulse5G(this.scene, this.flat3D_Position, new Vector3D(100, 0, 0));
            return NODE_STATUS.SUCCESS;
        }).bind(this));

        this.buildTree(); // Build the tree again with the attackBehavior defined
    }
    
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

    }
}