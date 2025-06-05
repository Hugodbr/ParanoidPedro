import { TextureKeys } from "../../../assets/asset_keys.js"
import { FACING } from "../player.js";

/**
 * Base class for attacks
 */
export default class Attack extends Phaser.GameObjects.Sprite 
{
    constructor(scene, player, texture){
        super(scene, player.x, player.y, texture)

        this.scene = scene;
        this.player = player;
        this.enemies = scene.enemiesGroup;
        this.walls = scene.wallColliders;

        this.scene.add.existing(this);
        this.setDepth(scene.playerDepth + 1);

        this.scene.physics.add.existing(this);

        this.body.allowGravity = false;

        this.direction = 1;

        // Offset distance from the character
        // To be set in derived attack class
        this.offsetX = 0;
        this.offsetY = 0;

        this.cooldown = 0;

        this.performing = false;
    }

    /**
     * @param {number} t - Total time
     * @param {number} dt - Time between frames
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);


        this.updateFacing();

        this.x = this.player.x + this.direction * this.offsetX;
        this.y = this.player.y + this.offsetY;
    }

    updateFacing()
    {
        if (this.player.facing == FACING.LEFT) {
            this.direction = -1;
            this.setFlipX(true);
        }
        else {
            this.direction = 1;
            this.setFlipX(false);
        }
    }

    defineCollisions()
    {  
    }

    hitCallback()
    {
    }

    setAttackSpriteActive(active)
    {  
        this.setVisible(active).setActive(active);
    }

    setAttackColliderActive(active)
    {
        this.body.setEnable(active);
    }
}