import State from "./state.js";
import {Player, FACING} from "../player.js";
import { AnimationKeys } from "../../../assets/asset_keys.js";
import FallAttack from "../attack/fall_attack.js";
import PersistentCooldown from "../../utils/persistent_cooldown.js";


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

        this.fallATK = new FallAttack(this.scene, player);

        this.attackCooldown = new PersistentCooldown(1000);
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

        if (!this.player.performingAttack) {
            //* Handle starting horizontal movement
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
            if (this.input.attackActionInput()) {
                if (this.attackCooldown.canUse(t)) { 
                    this.attack(t);
                }
            }
            // Stop
            else if (this.input.leftMoveInput() && this.input.rightMoveInput()) {
                this.stop();
            }
        }
  
        // When reaching the ground sets a 'stand' state
        if (this.isGrounded()) {
            this.player.setState(this.player.standState);
        }
        else if (this.onWall()) {
            this.player.setState(this.player.wallState);
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
        this.player.play(AnimationKeys.Player_Falling);
    }

    exit() 
    {
        if (this.debugState)
            console.log("Exit fall");
    }

    /**
     * Executes an attack while the player is in the 'fall' state.
     */
    attack(t)
    {
        // Implement logic.
        this.fallATK.attack(t);
        //Implement 'run' attack animation.
        this.player.play(AnimationKeys.Player_Falling_Attacking);

        if (this.debugState)
            console.log("Attaking");
    }
}