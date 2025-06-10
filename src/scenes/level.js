import { TilemapKeys, TilesetNames, LayerNames, SceneKeys, SoundKeys } from '../../assets/asset_keys.js'

import InputManager from '../managers/input_manager.js';

import { Player } from '../entities/player.js';

import LayerObject from '../zones/layer_object.js';
import Zone from '../zones/zone.js';
import Wall from '../zones/wall.js';


/**
 * Game main scene.
 * @extends Phaser.Scene
 */
export default class Level extends Phaser.Scene 
{	
    // Depth for rendering order
    playerDepth = 10;
    farBackDepth = -10; // invisible
    enemyDepth = 9;

    constructor(key, tilemap) {
        super(key);

        this.tilemap = tilemap;
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

    }
    
    create() {

        /**
         * Variable that hold the debug configuration value of phaser
         * Use to show rects if in debug mode, for example
         * @type {bool}
        */
        this.isDebug = this.physics.config.debug;

        this.cameras.main.setBackgroundColor('#FFFFFF');

        //* Input manager
        this.inputManager = new InputManager(this);
        this.inputManager.setupGamepad();
        this.inputManager.setupKeyboard();


        //* Map creation
        //
        this.map = this.make.tilemap({
            key: this.tilemap,
            tileWidth: 32,
            tileHeight: 32
        });

        this.mapTileset = this.map.addTilesetImage(TilesetNames.InTiled, TilemapKeys.TilesetImage);

        //* Player creation
        //
        // Tiled
        const playerObjects = this.map.objects.find(obj => obj.name === "player").objects;
        const spawn = playerObjects.find(obj => obj.name === "spawn");
        this.player = new Player(this, spawn.x, spawn.y, 0);
        
        //* Zones creation
        //
        this.numberOfZones = LayerObject.countLayerObjects(this.map.objects, Zone.type);
        
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

        //* Finish level
        const endObj = this.map.objects.find(obj => obj.name === "endLevel").objects.find(obj => obj.name === "end");
        this.endCollider = this.add.rectangle(endObj.x, endObj.y, endObj.width, endObj.height).setOrigin(0);
        this.physics.add.existing(this.endCollider, true);

        //* Play music
        //
        this.sound.play(SoundKeys.Ambiance, {
            volume: 0.3,
            loop: true,
            rate: 1
        });

    }

    /**
     * Scene loop
     */
    update(time, dt) {

    }

    restart()
    {
        // TODO ?
    }

    gameOver()
    {
        this.cameras.main.fadeOut(500, 70, 0, 0);

        this.time.delayedCall(900, () => {
            this.scene.start(SceneKeys.Game_Over);
        });
    }

    loadNextLevel(key)
    {
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.time.delayedCall(900, () => {
            this.scene.start(key);
        }); 
    }

}