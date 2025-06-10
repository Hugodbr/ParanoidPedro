import { Flat3D_Entity } from "./flat3D_system/flat3D_entity.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames, AnimationKeys } from '../../assets/asset_keys.js';
import { Vector3D } from "../utils/vector3D.js";
import { Cooldown } from "../utils/cooldown.js";

export class Pulse5G extends Flat3D_Entity {

    /**
     * Velocity of the proyectile
     * @type {Vector3D}
     */
    flat3D_velocity;

    /**
     * Reference to the player to damage it
     * @type {Player}
     */
    playerRef;

    /**
     * Life time of the proyectile
     * @type {Cooldown}
     */
    lifeCountDown = null;

    lifeTime = 3000;

    /**
     * @type {number}
     */
    gameTime;

    /**
     * @param {scene} scene 
     * @param {Vector3D} flat3D_pos 
     * @param {Vector3D} flat3D_vel 
     */
    constructor(scene, playerRef, flat3D_pos, flat3D_vel) {
        super(scene, flat3D_pos.x, flat3D_pos.y, flat3D_pos.z, TextureKeys.Wave5G);

        this.flat3D_velocity = flat3D_vel;
        this.playerRef = playerRef;
    }

    preUpdate(t, dt) {
		super.preUpdate(t, dt);

        this.body.setAllowGravity(false);
        
        this.body.setVelocityX(this.flat3D_velocity.x);
        this.body.setVelocityY(this.flat3D_velocity.y);
        this.moveInZ(this.flat3D_velocity.z);

        if(this.scene.physics.overlap(this, this.playerRef)) {
            this.playerRef.getHit();
            this.destroy();
        } 

        if(this.lifeCountDown === null) {
            this.lifeCountDown = new Cooldown(this.lifeTime, t);
        }

        if(this.lifeCountDown.canUse(t)) {
            this.destroy();
            return;
        }
    }
}