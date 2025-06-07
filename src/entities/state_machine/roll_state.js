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

        this.rollSpeed = this.player.groundSpeed * 2;
        // this.normalATK = new NormalAttack(this.scene, player);

        this.attackCooldown = new PersistentCooldown(700);

        this.nextState = null;

        this.scene.anims.create({
            key: AnimationKeys.Roll_State,
            frames: scene.anims.generateFrameNumbers(TextureKeys.Player_RollState, {start:0, end:3}),
            frameRate: 5,
            repeat: 1
        });

        this.on('animationcomplete', this.onAnimationComplete, this);
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

        // Can't move if is attacking standing
        if (!this.player.performingAttack) {
            //* Handle starting horizontal movement
            // Start left movement
            if (this.input.leftMoveInput() && !this.input.rightMoveInput()) 
            {
                this.player.changeFacing(FACING.LEFT);
                this.nextState = this.player.runState;
            }
            // Start right movement
            else if (this.input.rightMoveInput() && !this.input.leftMoveInput()) 
            {
                this.player.changeFacing(FACING.RIGHT);
                this.nextState = this.player.runState;
            }
            //* Handle action inputs while moving
            // Jump
            // Attack
            else if (this.input.attackActionInput()) // TODO
            {
                // if (this.attackCooldown.canUse(t)) { 
                //     this.attack(t);
                // }
            }


            // Fall while standing still 
            // Not clear about how this could happen
            if (!this.isGrounded) 
            {
                this.player.setState(this.player.fallState);
            }
        }

    }

    /**
     * Called when the player enters the 'stand' state.
     * Stops any horizontal movement
     */
    enter() 
    {
        if (this.debugState)
            console.log("Enter roll");
        
        // TODO: Implememnt play 'roll' animation.
        // TODO ON ANIMATION END change state

        this.player.setShortBody();
        
        if (this.facing === FACING.LEFT) {
            this.body.setVelocityX(-this.rollSpeed);
        }
        else {
            this.body.setVelocityX(this.rollSpeed);
        }

    }

    exit() 
    {
        if (this.debugState)
            console.log("Exit roll");
    }

    /**
     * Executes an attack while the player is in the 'stand' state.
     */
    attack(t)
    {
        // TODO: Implement logic.
        // this.normalATK.attack(t);
        console.log("Attaking");

        // TODO: Implememnt 'stand' attack animation.

        if (this.debugState)
            console.log("Attaking");
    }

    onAnimationComplete(anim, frame)
    {
        if (anim.key === AnimationKeys.Roll_State) {

        }
    }
}