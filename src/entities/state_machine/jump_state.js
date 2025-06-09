import State from "./state.js";
import {Player, FACING} from "../player.js";

import FallState from "./fall_state.js";
import { AnimationKeys } from "../../../assets/asset_keys.js";
import JumpAttack from "../attack/jump_atack.js";
import PersistentCooldown from "../../utils/persistent_cooldown.js";

/**
 * Class for jumping state.
 * Handles movement and action in the context of jumping.
 */
export default class JumpState extends State
{
    /**
     * @param {Player} player 
     */
    constructor(player) {
        super(player);

        this.jumpATK = new JumpAttack(this.scene, player);

        this.attackCooldown = new PersistentCooldown(1200);
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

        if (!this.player.performingAttack) {
            //* Handle horizontal movement
            // Left movement
            if (this.input.leftMoveInput()) 
            {
                this.goLeft();
            }
            // Right movement
            else if (this.input.rightMoveInput()) 
            {
                this.goRight();
            }

            //* Handle action inputs while jumping
            // Attack
            if (this.input.attackActionInput()) {
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
        // Implement logic.
        this.jumpATK.attack();
        //Implement 'run' attack animation.
        this.player.play(AnimationKeys.Player_Jumping_Attacking);

        if (this.debugState)
            console.log("Attacking");
    }

}