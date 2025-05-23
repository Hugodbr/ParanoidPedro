import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

import Character from "../entities/character.js";
import { Flat3D_Entity } from "../entities/flat3D_system/flat3D_entity.js";
import Player from '../entities/player.js';
import { Enemy } from '../entities/enemy.js';

import Zone from '../zones/zone.js';

/**
 * Game main scene.
 * @extends Phaser.Scene
 */
export default class MainGame extends Phaser.Scene 
{	
	constructor() {
		super({ key: 'maingame' });

        this.zones = []; // Ids of all zones
        this.revealedZones = []; // Ids of revealed/active zones

	}

    /**
     * Initialize variables
     */
    init() {
	}
	
    /**
     * Image, sounds, tilemaps
     */
	preload() {

        //* Preload tilemap assets
        this.load.tilemapTiledJSON(TilemapKeys.MapJSON, 'assets/map/tiled/map_structured.json');        
        this.load.image(TilemapKeys.TilesetImage, 'assets/map/Graphic Design Test.png');

        //* Preload player character
        this.load.image(TextureKeys.PlayerCharacter, 'assets/character/characterTeste.png');
	}
	
	create() {

        //* Map creation
        this.map = this.make.tilemap({
            key: TilemapKeys.MapJSON,
            tileWidth: 32,
            tileHeight: 32
        });

        this.mapTileset = this.map.addTilesetImage(TilesetNames.InTiled, TilemapKeys.TilesetImage);

        //* Entity creation
        /* const player = this.map.createFromObjects(LayerNames.Objects, {
                name: ObjectNames.CharacterSpawn,
                classType: Character,
                key: TextureKeys.PlayerCharacter
            });*/

        // const enemy = new Enemy(this, 200, 200, 0);
        this.player = new Player(this, 600, 200, 0);

        //* Collision definitions
        // ! at zones

        //* Zone creation
        this.zones.push(new Zone(this, 1));
        this.zones.push(new Zone(this, 2));


        // ! DEBUG
		// Enable arrow key input
		this.cursors = this.input.keyboard.createCursorKeys();
	}

    /**
     * Scene loop
     */
	update(time, dt) {
        this.scrollAround(dt);
	}

    revealLayer(layer) {
        // Fade-in effect
        this.tweens.add({
        targets: layer,
        alpha: 1,
        duration: 1000,
        ease: 'Linear'
        });
    }

    // ! DEBUG
    scrollAround(delta)
    {
        const cam = this.cameras.main;
		const speed = 300; // pixels per second

		if (this.cursors.left.isDown) {
			cam.scrollX -= speed * delta / 1000;
		}
		else if (this.cursors.right.isDown) {
			cam.scrollX += speed * delta / 1000;
		}

		if (this.cursors.up.isDown) {
			cam.scrollY -= speed * delta / 1000;
		}
		else if (this.cursors.down.isDown) {
			cam.scrollY += speed * delta / 1000;
		}
    }

}