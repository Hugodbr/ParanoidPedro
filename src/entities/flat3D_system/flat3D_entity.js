import { Vector3D } from "../../utils/vector3D.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../../assets/asset_keys.js';

/**
 * Flat3D_Entity works with the real 2D position that gets form its parent (Sprite) and an abstract position
 * that is the @type {Vector3D} flat3D_Position
 */
export class Flat3D_Entity extends Phaser.GameObjects.Sprite {
	/**
	 * Abstract position that represents the "real" world position of the entity. Its Z can only be modified 
	 * using the `moveInZ` or `setPosZ` functions
	 * @type {Vector3D}
	 * */
	flat3D_Position = new Vector3D(0, 0, 0);

	/**
	 * The factor that will render the entity smaller or bigger deppending on its  position in the Z axis
	 * @type {number}
	 * */
	depthScalingFactor = 0.99996;


	/**
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 * @param {number} z - coordenada z (Flat3D System)
	 * @param {Phaser.Textures.Texture} texture - aspect of the entity
	 */
	constructor(scene, x, y, z, texture) {
		super(scene, x, y, texture);

		scene.physics.add.existing(this);
		scene.add.existing(this); // Seems to be necessary to display the sprite, otherwise it doesn't show it

		this.setPos(this.x, this.y, z);

		//this.addToUpdateList();
		this.setOrigin(0.5, 0.2); // For scalling reasons we set the sprite origin upper than the middle

		this.body.setGravityY(1700);
		this.body.setMaxVelocityY(2000);
	}

	/**
	 * Custom setPosition function that sets the real Pahser's body position and the abstract flat3D_Position
	 * @param {number} x 
	 * @param {number} y 
	 * @param {number} z 
	 */
	setPos(x, y, z) {
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

	moveInZ(displacement) {
		this.flat3D_Position.z += displacement;
		this._applyScale();
	}

	setPosZ(axis_val) {
		this.flat3D_Position.z = axis_val;
		this._applyScale();
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
		
		//this.flat3D_Position.set(this.body.position.x, this.body.position.y, this.flat3D_Position.z);
		 this.setPos(this.body.position.x + this.body.width/2, this.body.position.y + this.body.height*0.2, this.flat3D_Position.z);
		 
		this.body.setAllowGravity(this.flat3D_Position.z <= 0);
		if(!this.body.allowGravity) { // Gravity 0 does not set velocity to 0 by itself
			this.body.setVelocityY(0);
		}
	}
}