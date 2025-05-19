import { Flat3D_Entity } from "./flat3D_system/flat3D_entity.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js';

export class Player extends Flat3D_Entity {

	/**
	 * Normal speed of the entity when moving
	 * @type {number}
	 */
	groundSpeed = 280;
	//patrollingGroundSpeed = 100;

	jumpSpeed = 700;
    
    /**
	 * @param {Scene} scene - scene where it appears
	 * @param {number} x - coord x
	 * @param {number} y - coord y
	 * @param {number} z - coord z (Flat3D System)
	 * @param {Phaser.Textures.Texture} texture - aspect of the entity
	 */
    constructor(scene, x, y, z) {
        super(scene, x, y, z, TextureKeys.PlayerCharacter);

        // Key bindings 
		this.wKey = this.scene.input.keyboard.addKey('W'); // Get deep in Z
		this.aKey = this.scene.input.keyboard.addKey('A'); // Left
		this.dKey = this.scene.input.keyboard.addKey('D'); // Right
		this.sKey = this.scene.input.keyboard.addKey('S'); // Exit Z
		this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Jump
    }

    /**
	 * Character main loop
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);

		// Move LEFT
		if (this.aKey.isDown) {
			this.body.setVelocityX(-this.groundSpeed * this.scale);
		}
		// Move RIGHT
		else if (this.dKey.isDown) {
			this.body.setVelocityX(this.groundSpeed * this.scale);
		}
		else {
			this.body.setVelocityX(0);
		}

		// JUMP
		if (this.wKey.isDown) {
			this.moveInZ(this.groundSpeed);
		}
		// DOWN
		else if (this.sKey.isDown) {
			this.moveInZ(-this.groundSpeed);
		}
		
		if(this.spaceBar.isDown && this.body.onFloor()) {
			this.body.setVelocityY(-this.jumpSpeed);
		}
		
	}
}