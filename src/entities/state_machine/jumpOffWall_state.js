import State from "./state.js";
import {Player, FACING} from "../player.js";
import { AnimationKeys } from "../../../assets/asset_keys.js";
import JumpAttack from "../attack/jump_atack.js";
import PersistentCooldown from "../../utils/persistent_cooldown.js";


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

        this.jumpATK = new JumpAttack(this.scene, player);

        this.attackCooldown = new PersistentCooldown(1000);
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
            if (this.attackCooldown.canUse(t)) { 
                this.attack(t);
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

        this.player.play(AnimationKeys.Player_Jumping);

        this.body.setVelocityY(-this.jumpSpeed);
    }

    exit() 
    {
        if (this.debugState)
            console.log("Exit jump");
    }

    /**
     * Executes an attack while the player is in the 'jumpoffwall' state.
     */
    attack(t)
    {
        // Implement logic.
        this.jumpATK.attack(t);
        //Implement 'run' attack animation.
        this.player.play(AnimationKeys.Player_Jumping_Attacking);

        if (this.debugState)
            console.log("Attacking");
    }

}