import State from "./state.js";
import {Player, FACING} from "../player.js";

import StandState from "./stand_state.js";

/**
 * Class for falling state.
 * Handles movement and action in the context of falling.
 * Falling is the state entered when player has a downward velocity.
 */
export default class FallState extends State
{
    /**
     * @param {Player} player 
     */
    constructor(player) {
        super(player);
    }

    /**
     * Handles player input and transitions between motion states while falling.
     * Called every frame by the player during the 'fall' state.
     *
     * @param {number} t
     * @param {number} dt
     */
    update(t, dt)
    {
        // Commom state update logic
        super.update();


        //* Handle starting horizontal movement
        // Left movement
        if (this.input.leftMoveInput()) 
        {
            if (this.facing != FACING.LEFT) {
                this.player.changeFacing(FACING.LEFT)
            }
            this.goLeft();
        }
        // Right movement
        else if (this.input.rightMoveInput()) 
        {
            if (this.facing != FACING.RIGHT) {
                this.player.changeFacing(FACING.RIGHT)
            }
            this.goRight();
        }

        //* Handle action inputs while jumping
        // Jump
        if (this.input.jumpMoveInput()) {
            // this.player.setState(JumpState); // ! if double jump later
        }
        // Attack
        else if (this.input.attackActionInput()) {
            this.attack();
        }
        // Roll
        else if (this.input.rollMoveInput()) {
            // this.player.setState(RollState); // TODO: dash downward?
        }
        // Stop
        else if (this.input.leftMoveInput() === this.input.rightMoveInput()) {
            this.stop();
        }
  
        // When reaching the ground sets a 'stand' state
        if (this.isGrounded()) {
            this.player.setState(StandState);
        }
    }

    /**
     * Called when the player enters the 'stand' state.
     * Stops any horizontal movement
     */
    enter() 
    {
        if (this.debugState)
            console.log("Enter fall");

        // TODO: Implememnt play 'fall' animation.
    }

    exit() 
    {
        if (this.debugState)
            console.log("Exit fall");
    }

    /**
     * Executes an attack while the player is in the 'fall' state.
     */
    attack()
    {
        // TODO: Implement logic.
        // TODO: Implememnt 'fall' attack animation.

        if (this.debugState)
            console.log("Attaking");
    }
}