import { Flat3D_Entity } from "./flat3D_system/flat3D_entity.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, SoundKeys, AnimationKeys } from '../../assets/asset_keys.js';

import StandState from "./state_machine/stand_state.js";
import RunState from "./state_machine/run_state.js";
import JumpState from "./state_machine/jump_state.js";
import FallState from "./state_machine/fall_state.js";
import WallState from "./state_machine/wall_state.js";
import JumpOffWallState from "./state_machine/jumpOffWall_state.js";
import RollState from "./state_machine/roll_state.js";

/**
 * Enumeration for player facing directions.
 * Used to determine movement, animations, and camera offset logic.
 * @readonly
 * @enum {string}
 */
export const FACING = {
    LEFT: "left",
    RIGHT: "right"
};

/**
 * Player entity controlable by the user by input.
 * Uses a state machine to handle motion and actions.
 */
export class Player extends Flat3D_Entity {

	/**
	 * Normal speed of the entity when moving horizontally
	 * @type {number}
	 */
	groundSpeed = 500;

    /**
     * Vertical speed when starting a jump movement.
	 * @type {number}
     */
	jumpSpeed = 650;

        /**
     * Camera offset in X axis. Player will be further from the side it's facing.
	 * @type {number}
     */
    cameraOffsetX = 400;
    
    /**
	 * @param {Scene} scene - scene where it appears
	 * @param {number} x - coord x
	 * @param {number} y - coord y
	 * @param {number} z - coord z (Flat3D System)
	 * @param {Phaser.Textures.Texture} texture - aspect of the entity
	 */
    constructor(scene, x, y, z) {
        super(scene, x, y, z, TextureKeys.Player_Spritesheet);

        // Reference to the scene
        this.scene = scene;

        /**
         * Player starts facing right.
         */
        this.facing = FACING.RIGHT;

         // Limit Y velocity
        this.body.setMaxVelocityY(1000);

        /**
         * Camera offset in Y axis.
         * @type {number}
         */
        this.cameraOffsetY = this.body.height;
        
        /**
         * Sets initial player state and enters it.
         */
        this.createStates();

        /**
         * Sets player depth so player is in front of the map.
         */
        this.setDepth(this.scene.playerDepth);

        this.playerLifeSound = this.scene.sound.add(SoundKeys.Player_Life);
        this.life = 4;
        this.currentLife = this.life;
        this.hasKey = false;
        
        this.performingAttack = false;


        /**
         * Set up camera parameters to follow the player.
         */
        this.scene.cameras.main.startFollow(this, true, 0.08, 0.08, -this.cameraOffsetX, -this.cameraOffsetY);
        this.scene.cameras.main.setDeadzone(150, 150);

        this.scene.cameras.main.setBounds(-1000, -1000, 100000, 100000); // TODO hardcoded



		
        
        this.on('animationcomplete', this.onAnimationComplete, this);
    }

    /**
	 * Character main loop
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);

        // Updates current state player is in.
		this.currentState.update(t, dt);

        // So player body won't oscilate between very small y values creating visual artifacts.
        this.y = Math.round(this.y);
	}

    /**
     * Called by a state when changing states.
     * @param {State} newState - any state
     */
    setState(newState)
    {
        this.currentState.exit();
        this.currentState = newState;
        this.currentState.enter();
    }

    /**
     * Handles facing change logic: facing variable, animation, camera.
     * @param {FACING} facing 
     */
    changeFacing(facing)
    {
        this.facing = facing;

        facing == FACING.LEFT ? this.setFlipX(true) : this.setFlipX(false);

        this.changeCameraOffset(facing);
    }

    //* Camera 
    /**
     * Handles camera change based on player's facing direction.
     * @param {FACING} facing 
     */
    changeCameraOffset(facing)
    {
        if (facing == FACING.RIGHT) {
            this.setCameraOffset(-this.cameraOffsetX); // player closer to left
        }
        else {
            this.setCameraOffset(this.cameraOffsetX); // player closer to right
        }
    }

    /**
     * Change camera offset and triggers animation.
     * @param {number} newOffsetX 
     */
    setCameraOffset(newOffsetX) 
    {
        this.scene.tweens.add({
            targets: this.scene.cameras.main.followOffset,
            x: newOffsetX,
            duration: 800,
            ease: 'Sine.easeInOut',
        });
    }


    //* Helper functions to change body collider size.
    //
    /**
     * Shortens the body by making the collider half of the height
     */
    setShortBody()
    {
        // Change body size
        this.body.setSize(this.body.width, this.body.halfHeight);
        this.body.setOffset(0, this.height/2);
    }

    /**
     * Set body back to original size
     */
    setNormalBody()
    {
        this.body.setSize(this.body.width, this.height);
        this.body.setOffset(0, 0);
    }

    onAnimationComplete(anim, frame)
    {
        if (anim.key === AnimationKeys.Player_Rolling) {
            this.setState(this.currentState.nextState); // next state adter rolling
        }
    }

    createStates()
    {
        this.standState = new StandState(this);
        this.runState = new RunState(this);
        this.jumpState = new JumpState(this);
        this.fallState = new FallState(this);
        this.wallState = new WallState(this);
        this.jumpOffWallState = new JumpOffWallState(this);
        this.rollState = new RollState(this);

        this.currentState = this.standState;
        this.currentState.enter();
    }

    getHit() {
        this.currentLife--;

        if (this.playerLifeSound.isPlaying) {
            this.playerLifeSound.stop();
        }

        if (this.currentLife > 0) {
            let aux = this.life - (this.currentLife) / this.life;
            let s_volume = 1 * aux;
            let s_rate = 0.5 * aux;

            this.playerLifeSound.setVolume(s_volume);
            this.playerLifeSound.setRate(s_rate);
            this.playerLifeSound.setLoop(true);
            this.playerLifeSound.play();
        } else {
            this.die();
        }
    }

    useKey()
    {
        this.hasKey = false;
    }

    getKey()
    {
        this.hasKey = true;
    }

    // ! GAME OVER
    die()
    {
        this.scene.gameOver();
    }
}