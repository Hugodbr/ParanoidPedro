import { Vector3D } from "../../utils/vector3D.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../../assets/asset_keys.js';

/**
 * Flat3D_Entity works with the real 2D position that gets form its parent (Sprite) and an abstract position
 * that is the @type {Vector3D} flat3D_Position
 */
export class Flat3D_Entity extends Phaser.GameObjects.Sprite {
	/**
	 * Abstract position that represents the "real" world position of the entity. It can only be modified 
	 * by the Flat3D_Physics_System
	 * @type {Vector3D}
	 * */
	flat3D_Position = new Vector3D(0, 0, 0);

	/**
	 * The factor that will render the entity smaller or bigger deppending on its  position in the Z axis
	 * @type {number}
	 * */
	depthScalingFactor = 0.99996;

	/**
	 * Normal speed of the entity when moving
	 * @type {number}
	 */
	groundSpeed = 280;
	//patrollingGroundSpeed = 100;

	jumpSpeed = 700;

	/**
	 * Constructor de del personaje principal
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 * @param {number} z - coordenada z (Flat3D System)
	 */
	constructor(scene, x, y, z) {
		super(scene, x, y, TextureKeys.PlayerCharacter);

		scene.physics.add.existing(this);
		scene.add.existing(this); // Seems to be necessary to display the sprite, otherwise it doesn't show it

		this.setFlat3D_Pos(this.x, this.y, z);

		//this.addToUpdateList();
		this.setOrigin(0.5, 0.2); // For scalling reasons we set the sprite origin upper than the middle

		this.body.setGravityY(1700);
		this.body.setMaxVelocityY(2000);

		// Key bindings 
		this.wKey = this.scene.input.keyboard.addKey('W'); // Jump
		this.aKey = this.scene.input.keyboard.addKey('A'); // Left
		this.dKey = this.scene.input.keyboard.addKey('D'); // Right
		this.jKey = this.scene.input.keyboard.addKey('J'); // Punch
		this.sKey = this.scene.input.keyboard.addKey('S'); // Roll
		this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	}

	setFlat3D_Pos(x, y, z) {
		this.flat3D_Position.set(x, y, z);
		this.body.position.x = x;
		this.body.position.y = y;
		this._applyScale();
	}

	/**
	 * If the entity has Z > 0
	 * @returns {boolean}
	 */
	isInDepth() {
		return this.flat3D_Position.z > 0;
	}

	_applyScale() {
		this.scale = 1;
		for(let i = 0; i < this.flat3D_Position.z; i++)
			this.setScale(this.scale * this.depthScalingFactor);
	}

	/**
	 * Character main loop
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);
		
		this.setFlat3D_Pos(this.body.position.x, this.body.position.y, this.flat3D_Position.z);

		this.body.setAllowGravity(this.flat3D_Position.z <= 0);
		if(!this.body.allowGravity) { // Gravity 0 does not set velocity to 0 by itself
			this.body.setVelocityY(0);
		}

		// Move LEFT
		if (this.aKey.isDown) {
			this.body.setVelocityX(-this.groundSpeed);
		}
		// Move RIGHT
		else if (this.dKey.isDown) {
			this.body.setVelocityX(this.groundSpeed);
		}
		else {
			this.body.setVelocityX(0);
		}

		// JUMP
		if (this.wKey.isDown) {
			this.flat3D_Position.z += this.groundSpeed;
		}
		// DOWN
		else if (this.sKey.isDown) {
			this.flat3D_Position.z -= this.groundSpeed;
		}
		
		if(this.spaceBar.isDown && this.body.onFloor()) {
			this.body.setVelocityY(-this.jumpSpeed);
		}
		
	}
}