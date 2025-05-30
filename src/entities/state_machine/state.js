import {Player, FACING} from "../player.js";


/**
 * Abstract base class for all player states.
 * Defines shared interface and helper methods for movement and action handling.
 * 
 * Extend this class to implement specific player states.
 */
export default class State 
{
    /**
     * Initializes common state references and input keys.
     * @param {Player} player - The player entity this state controls.
     */
    constructor(player) 
    {
        // ! DEBUG
        this.debugState = false; // Set to false to stop state debugging logs
        this.debugState = this.debugState && player.scene.isDebug;

        // Definition of variables for easy use purposes
        this.player = player;
        this.body = player.body;
        this.facing = player.facing;
        this.groundSpeed = player.groundSpeed;
        this.jumpSpeed = player.jumpSpeed;

        this.scene = this.player.scene;

        // Key bindings 
		this.jumpKey = this.scene.input.keyboard.addKey('W');
		this.leftKey = this.scene.input.keyboard.addKey('A');
		this.rightKey = this.scene.input.keyboard.addKey('D');
		this.spinKey = this.scene.input.keyboard.addKey('S');
		this.atkKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    /**
     * Called every player's preUpdate.
     * Overridden by derived states, but called at each one if any common funcitonality would be added.
     * @param {number} t 
     * @param {number} dt 
     */
    update(t, dt) {}

    /**
     * Called when entering state.
     */
    enter() {}

    /**
     * Called when exiting state.
     */
    exit() {}

    /**
     * Attack depending on the state context.
     */
    attack() {}


    //* Helper functions
    //
    goLeft()
    {
        this.body.setVelocityX(-this.groundSpeed);
    }

    goRight()
    {
        this.body.setVelocityX(this.groundSpeed);
    }

    /**
     * Stops body in X axis
     */
    stop()
    {
        this.body.setVelocityX(0);
    }

    /**
     * Check if player is falling.
     * @returns {boolean} true if vel.y > 0 is falling
     */
    isFalling()
    {
        return this.body.velocity.y > 0;
    }

    /**
     * Check if player is grounded.
     * @returns {boolean} true if vel.y = 0 is grounded
     */
    isGrounded()
    {
        return this.body.velocity.y === 0;
    }
}
