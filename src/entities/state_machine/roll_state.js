import State from "./state.js";
import {Player, FACING} from "../player.js";
import { AnimationKeys, TextureKeys } from "../../../assets/asset_keys.js";


import PersistentCooldown from "../../utils/persistent_cooldown.js";

/**
 * Class for standing/idling state.
 * Handles movement and action in the context of standing still.
 */
export default class RollState extends State
{
    /**
     * @param {Player} player 
     */
    constructor(player) {
        super(player);

        this.rollSpeed = this.player.groundSpeed * 1.5;

        this.nextState = null;
    }

    /**
     *
     * @param {number} t
     * @param {number} dt
     */
    update(t, dt) 
    {
        // Commom state update logic
        super.update();


        if (this.input.leftMoveInput() && !this.input.rightMoveInput()) 
        {
            this.nextState = this.player.runState;
        }
        else if (this.input.rightMoveInput() && !this.input.leftMoveInput()) 
        {
            this.nextState = this.player.runState;
        }
        else {
            this.nextState = this.player.standState;
        }


        // Fall 
        if (this.isFalling()) 
        {
            this.nextState = this.player.fallState;
        }

    }

    /**aaaaaa
     */
    enter() 
    {
        if (this.debugState)
            console.log("Enter roll");
        
        this.player.play(AnimationKeys.Player_Rolling);

        this.player.setShortBody();

        console.log(this.facing);
        
        this.body.setVelocityX(this.body.velocity.x * 1.5);


    }

    exit() 
    {
        this.player.setNormalBody();
    }

}