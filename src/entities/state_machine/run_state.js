import State from "./state.js";
import {Player, FACING} from "../player.js";

import StandState from "./stand_state.js";
import JumpState from "./jump_state.js";
import SpinState from "./spin_state.js";
import FallState from "./fall_state.js";

/**
 * Class for running state.
 * Handles movement and action in the context of running.
 */
export default class RunState extends State
{
    /**
     * @param {Player} player 
     */
    constructor(player) {
        super(player);
    }

    /**
     * Handles player input and transitions between motion states while running.
     * Called every frame by the player during the 'run' state.
     *
     * @param {number} t
     * @param {number} dt
     */
    update(t, dt) 
    {
        // Commom state update logic
        super.update();

        //* Handle horizontal movement
        // Left movement
        if (this.leftKey.isDown) 
        {
            if (this.facing !== FACING.LEFT) {
                this.goLeft();
                this.player.changeFacing(FACING.LEFT);
            }
        } 
        // Right movement
        else if (this.rightKey.isDown) 
        {
            if (this.facing !== FACING.RIGHT) {
                this.goRight();
                this.player.changeFacing(FACING.RIGHT);
            }
        }

        //* Handle action inputs while moving
        // Jump
        if (this.jumpKey.isDown) 
        {
            this.player.setState(JumpState);
        } 
        // Attack
        else if (this.atkKey.isDown) 
        {
            this.attack();
        } 
        // Spin
        else if (this.spinKey.isDown) 
        {
            this.player.setState(SpinState);
        } 
        // Stop
        else if (this.leftKey.isDown === this.rightKey.isDown) // Stop if no direction is held OR if both directions are being held
        {
            this.player.setState(StandState); 
        }

        // Check if the player is airborne and sets 'fall' state if it is
        if (!this.isGrounded()) {
            this.player.setState(FallState);
        }
    }

    /**
     * Called when the player enters the 'run' state.
     * Starts movement in the direction the player is currently facing.
     */
    enter() 
    {
        if (this.debugState) 
            console.log("Enter run");

        // TODO: Implememnt play 'run' animation.

        if (this.facing == FACING.RIGHT) {
            this.goRight();
        }
        else {
            this.goLeft();
        }
    }

    exit() 
    {
        if (this.debugState) 
            console.log("Exit run");
    }

    /**
     * Executes an attack while the player is in the 'run' state.
     */
    attack()
    {
        // TODO: Implement logic.
        // TODO: Implement 'run' attack animation.

        if (this.debugState)
            console.log("Attacking");
    }


}