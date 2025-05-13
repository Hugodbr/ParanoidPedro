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
	position = new Vector3D(0, 0, 0);
	/**
	 * @type {Vector3D}
	 * */
	velocity = new Vector3D(0, 0, 0);
	/**
	 * @type {Vector3D}
	 * Factor that is added to the actual velocity of deplacement to act as force
	 * */
	gravityVelocity = new Vector3D(0, 0, 0);
	/**
	 * @type {number}
	 * The factor that will render the entity smaller or bigger deppending on its  position in the Z axis
	 * */
	depthScalingFactor = 0.99;

	/**
	 * Constructor de del personaje principal
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 */
	constructor(scene, x, y) {
		super(scene, x, y, TextureKeys.PlayerCharacter);

		this.setPos_(this.x, this.y, 0);

		//scene.physics.add.existing(this);
		scene.add.existing(this);

		// Key bindings 
		this.wKey = this.scene.input.keyboard.addKey('W'); // Jump
		this.aKey = this.scene.input.keyboard.addKey('A'); // Left
		this.dKey = this.scene.input.keyboard.addKey('D'); // Right
		this.jKey = this.scene.input.keyboard.addKey('J'); // Punch
		this.sKey = this.scene.input.keyboard.addKey('S'); // Roll

	}

	setPos_(x, y, z) {
		//this.position.set(x, y, z);
		this.position.z = z;
		this.position.y = y;
		this.position.x = x;
	//	this.setPosition(x, y);
	this.x = x;
	this.y = y;
		this.applyScale();
	}

	applyScale() {
		this.scale = 1;
		for(let i = 0; i < this.position.z; i++)
			this.setScale(this.scale * this.depthScalingFactor);
	}

	/**
	 * Character main loop
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);
		
		let d = new Vector3D(0,0,0);
		let speed = 1;

		// Move LEFT
		if (this.aKey.isDown) {
			d = new Vector3D(-speed, 0, 0);
		}

		// Move RIGHT
		if (this.dKey.isDown) {
			d = new Vector3D(speed, 0, 0);
		}

		// JUMP
		if (this.wKey.isDown) {
			//d = new Vector3D(0, -speed, 0);
			d = new Vector3D(0, 0, speed);
		}

		// DOWN
		if (this.sKey.isDown) {
			//d = new Vector3D(0, speed, 0);
			d = new Vector3D(0, 0, -speed);
		}

		let p = this.position.add(d);
		this.setPos_(p.x, p.y, p.z); // for the scale factor

	//	this.setPosition(this.position.x, this.position.y);
	}
}