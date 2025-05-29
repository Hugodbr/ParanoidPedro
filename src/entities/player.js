import { Flat3D_Entity } from "./flat3D_system/flat3D_entity.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js';


const FACING = {
    LEFT: "left",
    RIGHT: "right"
}

export default class Player extends Flat3D_Entity {

	/**
	 * Normal speed of the entity when moving
	 * @type {number}
	 */
	groundSpeed = 500;
	//patrollingGroundSpeed = 100;

	jumpSpeed = 850;

    cameraOffsetX = 400;
    
    /**
	 * @param {Scene} scene - scene where it appears
	 * @param {number} x - coord x
	 * @param {number} y - coord y
	 * @param {number} z - coord z (Flat3D System)
	 * @param {Phaser.Textures.Texture} texture - aspect of the entity
	 */
    constructor(scene, x, y, z) {
        super(scene, x, y, z, TextureKeys.PlayerCharacter);


        this.facing = FACING.RIGHT; // starts facing right

        this.setDepth(this.scene.playerDepth);
        this.scene.cameras.main.startFollow(this, true, 0.08, 0, -this.cameraOffsetX, 0);
        this.scene.cameras.main.setDeadzone(300, 300);
        this.scene.cameras.main.setBounds(0, 0, 100000, 100000);

        // Key bindings 
		this.wKey = this.scene.input.keyboard.addKey('W'); // Get deep in Z
		this.aKey = this.scene.input.keyboard.addKey('A'); // Left
		this.dKey = this.scene.input.keyboard.addKey('D'); // Right
		this.sKey = this.scene.input.keyboard.addKey('S'); // Exit Z
		this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Jump

        // idle
        // standing golpe
        // correr
        // correr golpe
        // saltar
        // saltar golpe
        // rodar
        // rodar golpe
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

            if (this.facing != FACING.LEFT){
                this.changeFacing(FACING.LEFT)
            }
		}
		// Move RIGHT
		else if (this.dKey.isDown) {
			this.body.setVelocityX(this.groundSpeed * this.scale);

            if (this.facing != FACING.RIGHT){
                this.changeFacing(FACING.RIGHT)
            }
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

    changeFacing(facing)
    {
        this.facing = facing;

        // TODO: flip sprite


        this.changeCameraOffset(facing);
    }

    changeCameraOffset(facing)
    {
        if (facing == FACING.RIGHT) {
            this.setCameraOffset(-this.cameraOffsetX); // player closer to left
        }
        else {
            this.setCameraOffset(this.cameraOffsetX); // player closer to right
        }
    }

    setCameraOffset(newOffsetX) 
    {
        this.scene.tweens.add({
            targets: this.scene.cameras.main.followOffset,
            x: newOffsetX,
            duration: 800,
            ease: 'Sine.easeInOut',
        });
    }

}