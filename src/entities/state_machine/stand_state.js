import State from "./state.js";
import {Player, FACING} from "../player.js";

import RunState from "./run_state.js";
import JumpState from "./jump_state.js";
import SpinState from "./spin_state.js";
import FallState from "./fall_state.js";

/**
 * Class for standing/idling state.
 * Handles movement and action in the context of standing still.
 */
export default class StandState extends State
{
    /**
     * @param {Player} player 
     */
    constructor(player) {
        super(player);
    }

    /**
     * Handles player input and transitions between motion states while standing still.
     * Called every frame by the player during the 'stand' state.
     *
     * @param {number} t
     * @param {number} dt
     */
    update(t, dt) 
    {
        // Commom state update logic
        super.update();


        //* Handle starting horizontal movement
        // Start left movement
        if (this.leftKey.isDown && this.rightKey.isUp) 
        {
            if (this.facing != FACING.LEFT) {
                this.player.changeFacing(FACING.LEFT)
            }
            this.player.setState(RunState);
        }
        // Start right movement
        else if (this.rightKey.isDown && this.leftKey.isUp) 
        {
            if (this.facing != FACING.RIGHT) {
                this.player.changeFacing(FACING.RIGHT)
            }
            this.player.setState(RunState);
        }
        //* Handle action inputs while moving
        // Jump
        else if (this.jumpKey.isDown) {
            this.player.setState(JumpState);
        }
        // Attack
        else if (this.atkKey.isDown) {
            this.attack();
        }
        // Spin
        else if (this.spinKey.isDown) {
            // this.player.setState(SpinState); // TODO: implement
        }      


        // Fall while standing still 
        // Not clear about how this could happen
        if (!this.isGrounded) {
            this.player.setState(FallState);
        }
    }

    /**
     * Called when the player enters the 'stand' state.
     * Stops any horizontal movement
     */
    enter() 
    {
        if (this.debugState)
            console.log("Enter stand");
        
        // TODO: Implememnt play 'stand' animation.

        this.stop(); // Horizontal movement
    }

    exit() 
    {
        if (this.debugState)
            console.log("Exit stand");
    }

    /**
     * Executes an attack while the player is in the 'stand' state.
     */
    attack()
    {
        // TODO: Implement logic.
        // TODO: Implememnt 'stand' attack animation.

        if (this.debugState)
            console.log("Attaking");
    }
}