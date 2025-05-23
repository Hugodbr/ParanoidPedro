import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

import Character from "../entities/character.js";
import { Flat3D_Entity } from "../entities/flat3D_system/flat3D_entity.js";
import Player from '../entities/player.js';
import { Enemy } from '../entities/enemy.js';

import LayerObject from '../zones/layer_object.js';
import Zone from '../zones/zone.js';
import Wall from '../zones/wall.js';

/**
 * Game main scene.
 * @extends Phaser.Scene
 */
export default class MainGame extends Phaser.Scene 
{	
    // Depth for rendering order
    playerDepth = 10;
    farBackDepth = -10; // invisible
    enemyDepth = 9;

	constructor() {
		super({ key: 'maingame' });
	}

    /**
     * Initialize variables
     */
    init() {
        this.numberOfZones; // how many
        this.zones = []; // all zone objects

        this.numberOfWalls; // how many
        this.walls = []; // all wall objects

        this.enemies = []; // all enemies
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
        //
        this.map = this.make.tilemap({
            key: TilemapKeys.MapJSON,
            tileWidth: 32,
            tileHeight: 32
        });
        // console.log(this.map);

        this.mapTileset = this.map.addTilesetImage(TilesetNames.InTiled, TilemapKeys.TilesetImage);

        //* Player creation
        //
        this.player = new Player(this, 600, 200, 0);
        this.player.setDepth(this.playerDepth);
        
        //* Zones creation
        //
        this.numberOfZones = LayerObject.countLayerObjects(this.map.objects, Zone.type);
        // console.log(this.numberOfZones);
        
        // Create all zones
        for (let i = 0; i < this.numberOfZones; ++i) {
            this.zones.push(new Zone(this, i + 1));
            this.zones[i].enemies.forEach(enemy => {
                this.enemies.push(enemy);
            });
        }
        
        // Reveal the first zone
        this.zones[0].reveal();
        
        //* Walls creation
        //
        this.numberOfWalls = LayerObject.countLayerObjects(this.map.objects, Wall.type);
        
        // Create all walls
        for (let i = 0; i < this.numberOfWalls; ++i) {
            this.walls.push(new Wall(this, i + 1));
        }

        //* Collision definitions
        //
        this.zones.forEach(zone => {
            zone.defineCollisions([this.player]);
            zone.defineCollisions(this.enemies);
        });

        this.walls.forEach(wall => {
            wall.defineCollisions([this.player]);
            wall.defineCollisions(this.enemies);
        });

        
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