import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

import Character from "../entities/character.js";
import { Flat3D_Entity } from "../entities/flat3D_entity.js";

/**
 * Game main scene.
 * @extends Phaser.Scene
 */
export default class MainGame extends Phaser.Scene 
{	
	constructor() {
		super({ key: 'maingame' });
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
    this.load.tilemapTiledJSON(TilemapKeys.MapJSON, 'assets/map/tiled/jsonmap.json');
    this.load.image(TilemapKeys.TilesetImage, 'assets/map/mapateste.png');

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

    const mapTileset = this.map.addTilesetImage(TilesetNames.InTiled, TilemapKeys.TilesetImage);
    const groundLayer = this.map.createLayer(LayerNames.Ground, mapTileset, 0, 0);
    groundLayer.setCollisionBetween(1, 10000);

    //* Entity creation
   /* const player = this.map.createFromObjects(LayerNames.Objects, {
        name: ObjectNames.CharacterSpawn,
        classType: Flat3D_Entity,
        key: TextureKeys.PlayerCharacter
    });*/
    const player = new Flat3D_Entity(this, 200, 200, 1000);

    //let flat3d_player = new Flat3D_Entity(this, 200, 200);

    //* Collision definitions
    this.physics.add.collider(player, groundLayer);
	}


    /**
     * Scene loop
     */
	update(time, dt){

	}

}