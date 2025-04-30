import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../utils/asset_keys.js'

export default class Character extends Phaser.GameObjects.Sprite {
	/**
	 * Constructor de del personaje principal
	 * @param {Scene} scene - escena en la que aparece
	 * @param {number} x - coordenada x
	 * @param {number} y - coordenada y
	 */
	constructor(scene, x, y) {
		super(scene, x, y, TextureKeys.PlayerCharacter);
        scene.physics.add.existing(this);


	}

	/**
	 * Bucle principal del personaje, actualizamos su posición y ejecutamos acciones según el Input
	 * @param {number} t - Tiempo total
	 * @param {number} dt - Tiempo entre frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);
	}

}