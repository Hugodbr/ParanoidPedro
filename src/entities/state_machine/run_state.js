import State from "./state.js";
import {Player, FACING} from "../player.js";
import RunningAttack from "../attack/running_attack.js";
import PersistentCooldown from "../../utils/persistent_cooldown.js";
import { AnimationKeys } from "../../../assets/asset_keys.js";

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

        this.runATK = new RunningAttack(this.scene, player);

        this.attackCooldown = new PersistentCooldown(1000);
        this.rollCooldown = new PersistentCooldown(1000);
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

            //* Handle action inputs while moving
            // Jump
            if (this.input.jumpMoveInput()) 
            {
                this.player.setState(this.player.jumpState);
            } 
            // Attack
            else if (this.input.attackActionInput()) 
            {
                if (this.attackCooldown.canUse(t)) { 
                    this.attack(t);
                }
            } 
            // Roll
            else if (this.input.rollMoveInput()) 
            {
                if (this.rollCooldown.canUse(t)) { 
                    this.player.setState(this.player.rollState);
                }
            } 
            // Stop
            else if (this.input.leftMoveInput() === this.input.rightMoveInput()) // Stop if no direction is held OR if both directions are being held
            {
                this.player.setState(this.player.standState); 
            }
        }

        // Check if the player is airborne and sets 'fall' state if it is
        if (!this.isGrounded()) {
            this.player.setState(this.player.fallState);
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

        this.player.play(AnimationKeys.Player_Running);

    }

    exit() 
    {
        if (this.debugState) 
            console.log("Exit run");
    }

    /**
     * Executes an attack while the player is in the 'run' state.
     */
    attack(t)
    {
        // Implement logic.
        this.runATK.attack(t);
        //Implement 'run' attack animation.
        this.player.play(AnimationKeys.Player_Running_Attacking);

        if (this.debugState)
            console.log("Attacking");
    }


}