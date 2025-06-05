import State from "./state.js";
import {Player, FACING} from "../player.js";


/**
 * Class for jumping state.
 * Handles movement and action in the context of jumping.
 */
export default class WallState extends State
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

        // this.body.setVelocityY(0);

        
        //* Handle horizontal movement
        // if (this.onRightWall()) {
        //     this.body.setVelocityX(3);
        // }
        // else if (this.onLeftWall()) {
        //     this.body.setVelocityX(-3);
        // }

        // // Left movement or Right movement leave the wall and fall
        // if (this.input.leftMoveInput() && this.onRightWall() || this.input.rightMoveInput() && this.onLeftWall()) 
        // {
        //     this.player.setState(this.player.fallState);
        // }

        //* Handle action inputs while jumping
        // Jump
        if (this.input.jumpMoveInput()) {
            if (this.onLeftWall()) {
                this.goRight();
            }
            else if (this.onRightWall()) {
                this.goLeft();
            }

            this.player.setState(this.player.jumpOffWallState);
        }

        // When reaching the ground sets a 'stand' state
        if (this.isGrounded()) {
            this.player.setState(this.player.standState);
        }
        else if (!this.onWall())
        {
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
            console.log("Enter wall");

    }

    exit() 
    {
        if (this.debugState)
            console.log("Exit wall");

    }
}