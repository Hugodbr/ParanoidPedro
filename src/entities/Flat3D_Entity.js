//import { Vector3D } from "../utils/vector3D";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js';

export class Vector3D {
	x = 0;
	y = 0;
	z = 0;

	constructor(x = 0, y = 0, z = 0) {

		this.set(x, y, z);
	}

	set(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	setX(val) {
		this.x = val;
	}

	setY(val) {
		this.y = val;
	}

	setZ(val) {
		this.z = val;
	}

	add(vec3d) {
		return new Vector3D(this.x + vec3d.x, this.y + vec3d.y, this.z + vec3d.z);
	}

	sub(vec3d) {
		return new Vector3D(this.x - vec3d.x, this.y - vec3d.y, this.z - vec3d.z);
	}
}

export class Flat3D_Entity extends Phaser.GameObjects.Sprite{
	/**
	 * @type {Vector3D}
	 * It can only be modified by the Flat3D_Physics_System
	 * */
	flat3D_Position = new Vector3D(0, 0, 0);

	/**
	 * @type {number}
	 * The factor that will render the entity smaller or bigger deppending on its  position in the Z axis
	 * */
	depthScalingFactor = 0.9999;

	/**
	 * @type {number}
	 * Normal speed of the entity when moving
	 */
	groundSpeed = 160;

	/**
	 * Constructor de del personaje principal
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 */
	constructor(scene, x, y) {
		super(scene, x, y, TextureKeys.PlayerCharacter);

		this.setFlat3D_Pos(this.x, this.y, 0);

		scene.physics.add.existing(this);
		scene.add.existing(this);
		//this.body.enable = false;

		// Key bindings 
		this.wKey = this.scene.input.keyboard.addKey('W'); // Jump
		this.aKey = this.scene.input.keyboard.addKey('A'); // Left
		this.dKey = this.scene.input.keyboard.addKey('D'); // Right
		this.jKey = this.scene.input.keyboard.addKey('J'); // Punch
		this.sKey = this.scene.input.keyboard.addKey('S'); // Roll

	}

	setFlat3D_Pos(x, y, z) {
		this.flat3D_Position.set(x, y, z);
		this.applyScale();
	}

	applyScale() {
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
		
		this.setFlat3D_Pos(this.flat3D_Position.x, this.flat3D_Position.y, this.flat3D_Position.z);

		// Move LEFT
		if (this.aKey.isDown) {
			this.body.setVelocityX(-this.groundSpeed);
			console.log("left");
		}
		// Move RIGHT
		else if (this.dKey.isDown) {
			this.body.setVelocityX(this.groundSpeed);
			console.log("right");
		}
		else {
			this.body.setVelocityX(0);
		}

		// JUMP
		if (this.wKey.isDown) {
			this.flat3D_Position.z += this.groundSpeed;
			console.log("deep");
		}

		// DOWN
		if (this.sKey.isDown) {
			this.flat3D_Position.z -= this.groundSpeed;
			console.log("out");
		}

		this.body.setAllowGravity(this.flat3D_Position.z <= 0);
	}
}