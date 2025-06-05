import { TextureKeys } from "../../../assets/asset_keys.js"

export default class NormalAttack extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y){
        super(scene, x, y, TextureKeys.NormalAttack)

        scene.add.existing(this);
        this.setDepth(scene.playerDepth + 1);

        scene.physics.add.existing(this);

        // this.body.enable = false;
        // this.setActive(false).setVisible(false);

        this.body.allowGravity = false;

        // Offset distance from the character
        this.offsetX = 20;
        
    }

    /**
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);


    }

    attack()
    {

    }
}