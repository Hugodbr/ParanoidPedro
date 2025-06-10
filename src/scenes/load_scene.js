import { TilemapKeys, SceneKeys, AnimationKeys, TextureKeys, SoundKeys } from '../../assets/asset_keys.js'


export default class LoadScene extends Phaser.Scene {
    /**
     * Escena de Título.
     * @extends Phaser.Scene
     */
    constructor() {
        super(SceneKeys.Load);
    }

    /**
     * Cargamos todos los assets que vamos a necesitar
     */
    preload() {

            //* Music
            this.load.audio(SoundKeys.Ambiance, 'assets/music/scify-theme.mp3')

            // Start menu assets
            this.load.image(TextureKeys.Title_Background, 'assets/menu/start_menu_background.png');
            this.load.image(TextureKeys.Play_Button, 'assets/menu/game_start_button.png');
    
            //* Preload tilemap assets
            this.load.tilemapTiledJSON(TilemapKeys.Level_1, 'assets/map/tiled/level1.json');
            this.load.tilemapTiledJSON(TilemapKeys.Level_2, 'assets/map/tiled/level2.json');      
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

             this.load.spritesheet(TextureKeys.Reptilian, 'assets/enemies/reptilian_spritesheet.png', { frameWidth: 163, frameHeight: 140 });
    
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

        this.createPlayerAnimations();

        this.createAttackAnimations();

        this.scene.start(SceneKeys.Title);
    }

    createPlayerAnimations()
    {
        this.anims.create({
            key: AnimationKeys.Player_Idle,
            frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:0, end:3}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: AnimationKeys.Player_Running,
            frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:4, end:7}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: AnimationKeys.Player_Running_Attacking,
            frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:8, end:11}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: AnimationKeys.Player_Jumping,
            frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:12, end:15}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: AnimationKeys.Player_Jumping_Attacking,
            frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:16, end:19}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: AnimationKeys.Player_Falling,
            frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:20, end:23}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: AnimationKeys.Player_Falling_Attacking,
            frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:24, end:27}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: AnimationKeys.Player_Idle_Attacking,
            frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:28, end:31}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: AnimationKeys.Player_Rolling,
            frames: this.anims.generateFrameNumbers(TextureKeys.Player_Spritesheet, {start:32, end:35}),
            frameRate: 15,
            repeat: 1
        });
    }

    createAttackAnimations()
    {
        this.anims.create({
            key: AnimationKeys.Normal_Attack,
            frames: this.anims.generateFrameNumbers(TextureKeys.Punch_Attack, {start:1, end:1}),
            frameRate: 10,
            repeat: 1
        });

        
        this.anims.create({
            key: AnimationKeys.Running_Attack,
            frames: this.anims.generateFrameNumbers(TextureKeys.Punch_Attack, {start:0, end:3}),
            frameRate: 10,
            repeat: 1
        });

        
        this.anims.create({
            key: AnimationKeys.Fall_Attack,
            frames: this.anims.generateFrameNumbers(TextureKeys.Aerial_Attack, {start:1, end:1}),
            frameRate: 10,
            repeat: 1
        });

        
        this.anims.create({
            key: AnimationKeys.Jump_Attack,
            frames: this.anims.generateFrameNumbers(TextureKeys.Aerial_Attack, {start:0, end:0}),
            frameRate: 10,
            repeat: 1
        });
    }
}