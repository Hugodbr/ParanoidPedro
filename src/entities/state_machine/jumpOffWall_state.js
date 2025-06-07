import State from "./state.js";
import {Player, FACING} from "../player.js";
import { AnimationKeys } from "../../../assets/asset_keys.js";


/**
 * Class for jumping state.
 * Handles movement and action in the context of jumping.
 */
export default class JumpOffWallState extends State
{
    /**
     * @param {Player} player 
     */
    constructor(player) {
        super(player);
    }

    /**
     * Handles player input and transitions between motion states while jumping.
     * Called every frame by the player during the 'jump' state.
     *
     * @param {number} t
     * @param {number} dt
     */
    update(t, dt) 
    {
        // Commom state update logic
        super.update();



        //* Handle action inputs while jumping
        // Attack
        if (this.input.attackActionInput()) {
            this.attack();
        }
        // Roll
        else if (this.input.rollMoveInput()) {
            // this.player.setState(RollState); // TODO: dash downward?
        }

        if (this.onWall()) {
            this.player.setState(this.player.wallState);
        }
        // Fall state after reaching highest point
        else if (this.isFalling()) {
            this.player.setState(this.player.fallState);
        }
    }

    /**
     * Called when the player enters the 'jump' state.
     * Starts vertical movement upward.
     */
    enter() 
    {
        if (this.debugState)
            console.log("Enter jump");

        // TODO: Implement play 'jump' animation.
        this.player.play(AnimationKeys.Player_Jumping);

        this.body.setVelocityY(-this.jumpSpeed);
    }

    exit() 
    {
        if (this.debugState)
            console.log("Exit jump");
    }

    /**
     * Executes an attack while the player is in the 'jump' state.
     */
    attack()
    {
        // TODO: Implement logic.
        // TODO: Implement 'jump' attack animation.

        if (this.debugState)
            console.log("Attacking");
    }

}