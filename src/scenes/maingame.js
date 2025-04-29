
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

        //* Preload tilemap assets. 
        // Load Tilemap json
        this.load.tilemapTiledJSON('tilemap', 'assets/map/tiled/jsonmap.json');
        // Load tileset image
        this.load.image('tilesetMapImage', 'assets/map/mapateste.png');
	}
	
	create() {

        //* Map creation
        this.map = this.make.tilemap({
			key: 'tilemap',
			tileWidth: 32,
			tileHeight: 32
		});

        const map_tileset = this.map.addTilesetImage('tilesetMap', 'tilesetMapImage');
        const layer = this.map.createLayer('layer1', map_tileset, 0, 0);

        //* Entity creation


        //* Collision definitions

	}


    /**
     * Scene loop
     */
	update(time, dt){

	}

}