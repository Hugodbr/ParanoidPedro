import { TextureKeys } from "../../assets/asset_keys.js";


/**
 *  
 */
export class Health extends Phaser.GameObjects.Sprite 
{
    constructor(scene, x, y) {
        super(scene, x, y, TextureKeys.Health);

        scene.physics.add.existing(this, true);
		scene.add.existing(this);

        scene.physics.add.overlap(scene.player, this, () => {
            scene.player.resetLife();
            this.destroy();
        });
    }
}