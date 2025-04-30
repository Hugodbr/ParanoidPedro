import { assertHasProperty } from '../utils/helper_functions.js';
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

export default class Character extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor de del personaje principal
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 */
	constructor(scene, x, y) {
		super(scene, x, y, TextureKeys.PlayerCharacter);

		this.pointObjArray = [];
		this.pathArray = [];
		this.parsePathData();

        scene.physics.add.existing(this);
		this.speed = 32;
		this.dir = {x: 1, y: 0};

		// Key bindings 
		this.wKey = this.scene.input.keyboard.addKey('W'); // Jump
		this.aKey = this.scene.input.keyboard.addKey('A'); // Left
		this.dKey = this.scene.input.keyboard.addKey('D'); // Right
		this.jKey = this.scene.input.keyboard.addKey('J'); // Punch
		this.kKey = this.scene.input.keyboard.addKey('K'); // Roll

	}

	/**
	 * Character main loop
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);

		let press = false
		// Move LEFT
		if (this.aKey.isDown) {
			this.setFlip(true, false)
			// this.body.setVelocityX(-this.speed);
			this.traverseX();

			press = true;
		}

		// Move RIGHT
		if (this.dKey.isDown) {
			this.setFlip(false, false)
			this.body.setVelocityX(this.speed);
			press = true;
		}

		// JUMP
		if (this.wKey.isDown) {
			this.body.setVelocityY(-this.speed);
			press = true;
		}

		// PUNCH
		if (this.jKey.isDown) {
			this.setBodyEnable(true);
		}

		// PUNCH
		if (this.kKey.isDown) {
			this.setBodyEnable(false);
		}

		if (!press) {
			this.body.setVelocityX(0)
		}
	}

	getVel() {
		return {
			x: this.speed * this.dir.x,
			y: this.speed * this.dir.y
		  };
	}

	setBodyEnable(enable) {
		this.body.enable = enable;
		if(!enable)
			this.body.stop();
	}

	traverseX() {
		this.x += this.vel.x;
	}

	// Path data parsing
	parsePathData() {
		const thisObject = this.scene.map.findObject(LayerNames.Objects, obj => obj.name === ObjectNames.CharacterSpawn);

		// Accounts for properties that are of "type" point objects only
		thisObject.properties.forEach(obj => {
			const pointObject = this.scene.map.findObject(LayerNames.Objects, pointObj => pointObj.id === obj.value); // Finds the object in the 'LayerNames.Objects' that its 'id' is the 'value' of the object that 'thisObject' contains
			assertHasProperty(pointObject, ObjectNames.Property.Order);
			this.pointObjArray.push(pointObject);
		});

		// Sort array by the 'Order' property value in JSON from Tiled
		this.pointObjArray.sort((a, b) => {
			const aOrder = a.properties.find(p => p.name === ObjectNames.Property.Order).value;
			const bOrder = b.properties.find(p => p.name === ObjectNames.Property.Order).value;
			return aOrder - bOrder;
		  });

		this.pointObjArray.forEach(pointObject => {
			this.pathArray.push({
				x: pointObject.x,
				y: pointObject.y
			});
		});

		console.log(this.pathArray);
	}

}