import State from "./state.js";
import {Player, FACING} from "../player.js";


import NormalAttack from "../attack/normal_attack.js";
import { Cooldown } from "../../utils/cooldown.js";

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

        this.normalATK = new NormalAttack(this.player.scene, this.player.x, this.player.y);
        this.normalATK.active = false;

        this.attackCooldown = new Cooldown(500);
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
        if (this.input.leftMoveInput() && !this.input.rightMoveInput()) 
        {
            this.player.changeFacing(FACING.LEFT);
            this.player.setState(this.player.runState);
        }
        // Start right movement
        else if (this.input.rightMoveInput() && !this.input.leftMoveInput()) 
        {
            this.player.changeFacing(FACING.RIGHT);
            this.player.setState(this.player.runState);
        }
        //* Handle action inputs while moving
        // Jump
        else if (this.input.jumpMoveInput()) 
        {
            this.player.setState(this.player.jumpState);
        }
        // Attack
        else if (this.input.attackActionInput()) 
        {
            if (this.attackCooldown.canUse()) 
                this.attack();
        }
        // Roll
        else if (this.input.rollMoveInput()) 
        {
            // this.player.setState(RollState); // TODO: implement
        }      


        // Fall while standing still 
        // Not clear about how this could happen
        if (!this.isGrounded) 
        {
            this.player.setState(this.player.fallState);
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