import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames, SoundKeys } from '../../assets/asset_keys.js'

import InputManager from '../managers/input_manager.js';

// import Character from "../entities/character.js";
import { Flat3D_Entity } from "../entities/flat3D_system/flat3D_entity.js";
import { Player } from '../entities/player.js';
import { Enemy } from '../entities/enemy.js';
import { Agent5G } from '../entities/agent_5G.js';

import LayerObject from '../zones/layer_object.js';
import Zone from '../zones/zone.js';
import Wall from '../zones/wall.js';
import { Path3D_Point } from '../entities/flat3D_system/path3D_point.js';
import PersistentCooldown from '../utils/persistent_cooldown.js';

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
        this.wallColliders = this.physics.add.staticGroup(); 

        this.enemiesArray = []; // all enemies in array
        this.enemiesGroup = this.physics.add.group(); // all enemies in group
	}
	
    /**
     * Image, sounds, tilemaps
     */
	preload() {

        //* Music
        this.load.audio(SoundKeys.Ambiance, 'assets/music/scify-theme.mp3')

        //* Preload tilemap assets
        this.load.tilemapTiledJSON(TilemapKeys.MapJSON, 'assets/map/tiled/map_structured.json');        
        this.load.image(TilemapKeys.TilesetImage, 'assets/map/Map Tileset.png');

        //* Preload player character
        this.load.image(TextureKeys.PlayerCharacter, 'assets/character/characterTeste.png');
        this.load.spritesheet(TextureKeys.Agent5G, 'assets/enemies/5G_shooter_spritesheet.png', { frameWidth: 123, frameHeight: 153 });
        // Audio
        this.load.audio(SoundKeys.Player_Life, 'assets/sfx/player/life-beat.mp3');
        
        //* Enemy
        this.load.image(TextureKeys.Wave5G, 'assets/enemies/5G_Wave.png');

        //* Attacks
        // this.load.image(TextureKeys.NormalAttack, 'assets/character/attacks/punch.png');
        this.load.spritesheet(TextureKeys.Punch_Attack, 'assets/character/attacks/stand_attack.png', { frameWidth: 64, frameHeight: 96});
        this.load.audio(SoundKeys.Normal_Attack, 'assets/sfx/attack/punches-single.mp3');
        this.load.audio(SoundKeys.Running_Attack, 'assets/sfx/attack/punches-4x.mp3');


	}
	
	create() {

        /**
         * Variable that hold the debug configuration value of phaser
         * Use to show rects if in debug mode, for example
         * @type {bool}
        */
        this.isDebug = this.physics.config.debug;

        //* Input manager singleton
        this.inputManager = new InputManager(this);

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
        
        //* Zones creation
        //
        this.numberOfZones = LayerObject.countLayerObjects(this.map.objects, Zone.type);
        // console.log(this.numberOfZones);
        
        // Create all zones
        for (let i = 0; i < this.numberOfZones; ++i) {
            this.zones.push(new Zone(this, i + 1));
            this.zones[i].enemies.forEach(enemy => {
                this.enemiesGroup.add(enemy);
                this.enemiesArray.push(enemy);
            });
        }
    
        
        //* Walls creation
        //
        this.numberOfWalls = LayerObject.countLayerObjects(this.map.objects, Wall.type);
        
        // Create all walls
        for (let i = 0; i < this.numberOfWalls; ++i) {
            const wall = new Wall(this, i + 1);
            this.walls.push(wall);
            this.wallColliders.add(wall.wallSensor);
        }

        //* Link wall to zones
        //
        this.zones.forEach(zone => {
            this.walls.forEach(wall => {
                wall.zonesIDs.forEach(zoneID => {
                    if (zoneID == zone.refID) {
                        zone.registerWall(wall);
                        wall.registerZone(zone);
                    }
                });
            });
        });

        // ! Reveal the first zone
        this.zones[0].reveal();


        //* Collision definitions
        //
        this.zones.forEach(zone => {
            zone.defineCollisions([this.player]);
            zone.defineCollisions(this.enemiesArray);
        });

        this.walls.forEach(wall => {
            wall.defineCollisions([this.player]);
            wall.defineCollisions(this.enemiesArray);
        });

        //* Play music
        //
        this.sound.play(SoundKeys.Ambiance, {
            volume: 0.3,
            loop: true,
            rate: 1
        });

        
        // ! DEBUG
		// Enable arrow key input
        if (this.isDebug) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.bKey = this.input.keyboard.addKey('B'); // break wall
            this.hitCooldown = new PersistentCooldown(500);
        }

	}

    /**
     * Scene loop
     */
	update(time, dt) {

        // ! DEBUG
        if (this.isDebug) {
            this.scrollAround(dt);

            if (this.bKey.isDown) {
                this.walls[0].break();

                if (this.hitCooldown.canUse(time)) {
                    this.player.getHit();
                }
            }
        }

	}

    restart()
    {
        this.cameras.main.fadeOut(500, 70, 0, 0);

        this.time.delayedCall(900, () => {
            this.scene.start('maingame');
        });
    }

    // ! DEBUG
    scrollAround(delta)
    {
        const cam = this.cameras.main;
		const speed = 1000; // pixels per second

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