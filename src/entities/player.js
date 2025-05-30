import { Flat3D_Entity } from "./flat3D_system/flat3D_entity.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js';

import StandState from "./state_machine/stand_state.js";

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
	jumpSpeed = 850;

    /**
     * Camera offset in X axis. Player will be further from the side it's facing.
	 * @type {number}
     */
    cameraOffsetX = 400;

    /**
     * Reference to the gamepad controller
     * @type {Phaser.Input.Gamepad}
     */
    gamepad = null;

    /**
     * Whether a left movement input is being pressed or not
     * @type {bool}
     */
    leftMoveInput;

    /**
     * Whether a right movement input is being pressed or not
     * @type {bool}
     */
    rightMoveInput;

    /**
     * Whether a jump movement input is being pressed or not
     * @type {bool}
     */
    jumpMoveInput;

    /**
     * Whether a roll movement input is being pressed or not
     * @type {bool}
     */
    rollMoveInput;
    
    /**
     * Whether an attack action input is being pressed or not
     * @type {bool}
     */
    attackActionInput;
    
    /**
	 * @param {Scene} scene - scene where it appears
	 * @param {number} x - coord x
	 * @param {number} y - coord y
	 * @param {number} z - coord z (Flat3D System)
	 * @param {Phaser.Textures.Texture} texture - aspect of the entity
	 */
    constructor(scene, x, y, z) {
        super(scene, x, y, z, TextureKeys.PlayerCharacter);

        /**
         * Player starts facing right.
         */
        this.facing = FACING.RIGHT;

        /**
         * Sets initial player state and enters it.
         */
        this.currentState = new StandState(this);
        this.currentState.enter();

        /**
         * Sets player depth so player is in front of the map.
         */
        this.setDepth(this.scene.playerDepth);


        /**
         * Set up camera parameters to follow the player.
         */
        this.scene.cameras.main.startFollow(this, true, 0.08, 0, -this.cameraOffsetX, 0);
        this.scene.cameras.main.setDeadzone(300, 300);

        //this.scene.input.gamepad.once("connected", pad => { this.gamepad = pad; }); // TODO: FROM TELMO

        this.scene.cameras.main.setBounds(0, 0, 100000, 100000); // TODO hardcoded


        /**
         * TODO: Create animations
         */

        // !!!!!!!!!! EXAMPLE FOR LATER
        // // Creamos las animaciones de nuestro caballero
		// // Acordaros, las animaciones son comunes a todo el juego. Por ello lo correcto es crear las animaciones en la escena principal o en una de boot
		// this.scene.anims.create({
		// 	key: 'idle',
		// 	frames: scene.anims.generateFrameNumbers('knight', {start:0, end:3}),
		// 	frameRate: 5,
		// 	repeat: -1
		// });
		// this.scene.anims.create({
		// 	key: 'attack',
		// 	frames: scene.anims.generateFrameNumbers('knight', {start:4, end:7}),
		// 	frameRate: 18,
		// 	repeat: 0
		// });
		// this.scene.anims.create({
		// 	key: 'run',
		// 	frames: scene.anims.generateFrameNumbers('knight', {start:8, end:14}),
		// 	frameRate: 5,
		// 	repeat: -1
		// });

		// // Si la animación de ataque se completa pasamos a ejecutar la animación 'idle'
		// this.on('animationcomplete', end => {
		// 	if (this.anims.currentAnim.key === 'attack'){
		// 		this.stopAttack()
		// 	}
		// })

		// // La animación a ejecutar según se genere el personaje será 'idle'
		// this.play('idle');
        // !!!!!!!!!!!


    }

    /**
	 * Character main loop
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);

/* TODO: FROM TELMO
        // Updating the state of the input
        this.leftMoveInput = (
            this.aKey.isDown 
            || this.gamepad !== null && this.gamepad.left
            || this.gamepad !== null && this.gamepad.leftStick.x < -0.5
        );
        this.rightMoveInput = (
            this.dKey.isDown 
            || this.gamepad !== null && this.gamepad.right
            || this.gamepad !== null && this.gamepad.leftStick.x > 0.5
        );
        this.jumpMoveInput = this.spaceBar.isDown || this.gamepad !== null && this.gamepad.A;

		// Move LEFT
		if (this.leftMoveInput) {
			this.body.setVelocityX(-this.groundSpeed * this.scale);

            if (this.facing != FACING.LEFT){
                this.changeFacing(FACING.LEFT)
            }
		}
		// Move RIGHT
		else if (this.rightMoveInput) {
			this.body.setVelocityX(this.groundSpeed * this.scale);

            if (this.facing != FACING.RIGHT){
                this.changeFacing(FACING.RIGHT)
            }
		}
		else {
			this.body.setVelocityX(0);
		}

		// JUMP
		if (this.wKey.isDown || this.gamepad !== null && this.gamepad.up) {
			this.moveInZ(this.groundSpeed);
		}
		// DOWN
		else if (this.sKey.isDown || this.gamepad !== null && this.gamepad.down) {
			this.moveInZ(-this.groundSpeed);
		}
        
		if(this.jumpMoveInput && this.body.onFloor()) {
			this.body.setVelocityY(-this.jumpSpeed);
		}
		*/

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
        this.currentState = new newState(this);
        this.currentState.enter();
    }

    /**
     * Handles facing change logic: facing variable, animation, camera.
     * @param {FACING} facing 
     */
    changeFacing(facing)
    {
        this.facing = facing;

        // TODO: flip sprite

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
        this.body.setSize(this.body.width, this.body.height/2);
        this.body.setOffset(0, this.height/2);
    }

    /**
     * Set body back to original size
     */
    setNormalBody()
    {
        this.body.setSize(this.body.width, this.body.height);
        this.body.setOffset(0, 0);
    }    

}