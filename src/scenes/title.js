import { TilemapKeys, SceneKeys, LayerNames, TextureKeys, SoundKeys } from '../../assets/asset_keys.js'


export default class Title extends Phaser.Scene {
	/**
	 * Escena de Título.
	 * @extends Phaser.Scene
	 */
	constructor() {
		super(SceneKeys.Tile);
	}

	/**
	 * Cargamos todos los assets que vamos a necesitar
	 */
	preload() {

			//* Music
			this.load.audio(SoundKeys.Ambiance, 'assets/music/scify-theme.mp3')
	
			//* Preload tilemap assets
			this.load.tilemapTiledJSON(TilemapKeys.Level_1, 'assets/map/tiled/level1.json');
			this.load.tilemapTiledJSON(TilemapKeys.Level_2, 'assets/map/tiled/level1.json');      
			this.load.image(TilemapKeys.TilesetImage, 'assets/map/Map Tileset.png');
	
			//* Preload player character
			this.load.image(TextureKeys.PlayerCharacter, 'assets/character/characterTeste.png');
			this.load.spritesheet(TextureKeys.Player_Spritesheet, 'assets/character/playerSpritesheet.png', { frameWidth: 96, frameHeight: 128 });
			this.load.spritesheet(TextureKeys.Player_RollState, 'assets/character/movement/roll_state.png', { frameWidth: 96, frameHeight: 64 });
			// Audio
			this.load.audio(SoundKeys.Player_Life, 'assets/sfx/player/life-beat.mp3');
			
			//* Enemy
			this.load.spritesheet(TextureKeys.Agent5G, 'assets/enemies/5G_shooter_spritesheet.png', { frameWidth: 123, frameHeight: 153 });
			this.load.image(TextureKeys.Wave5G, 'assets/enemies/5G_Wave.png');
	
			//* Attacks
			// this.load.image(TextureKeys.NormalAttack, 'assets/character/attacks/punch.png');
			this.load.spritesheet(TextureKeys.Punch_Attack, 'assets/character/attacks/punch_attack.png', { frameWidth: 64, frameHeight: 96});
			this.load.spritesheet(TextureKeys.Aerial_Attack, 'assets/character/attacks/aerial_attack.png', { frameWidth: 64, frameHeight: 64});
			this.load.audio(SoundKeys.Normal_Attack, 'assets/sfx/attack/punches-single.mp3');
			this.load.audio(SoundKeys.Running_Attack, 'assets/sfx/attack/punches-4x.mp3');
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {
		this.time.delayedCall(500, () => {
            this.scene.start(SceneKeys.Level_1);
        });
	}
}