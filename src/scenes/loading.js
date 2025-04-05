/**
 * Escena de carga de recursos (Loading Scene).
 * @extends Phaser.Scene
 */
export default class Loading extends Phaser.Scene {
	/**
	 * Constructor: Define la clave de la escena como 'loading'.
	 */
	constructor() {
		super({ key: 'loading' });
	}

	/**
	* Preload: Carga todos los recursos necesarios antes de iniciar el juego.
	*/
	preload() {

		// Establecer color de fondo de la pantalla de carga.
		this.cameras.main.setBackgroundColor('#d3d3d3');

		// #region UI Assets

		//PVLI
		this.load.image('start', 'assets/GUI/start_button.png');
		this.load.image('end', 'assets/GUI/gameover.png');
		this.load.image('healthBarBackground', 'assets/GUI/health_bar_1.png');
		this.load.image('healthBar', 'assets/GUI/health_bar_2_b.png');
		this.load.image('expBarBackground', 'assets/GUI/exp_bar_background.png');
		this.load.image('expBar', 'assets/GUI/exp_bar.png');
		this.load.spritesheet('PiuAnim', 'assets/piu/piu.png', {
			frameWidth: 25,  // Ancho de cada cuadro
			frameHeight: 10, // Altura de cada cuadro
			endFrame: 16      // Número de cuadros en el sprite sheet
		});
		this.load.image('start', 'assets/GUI/start_button.png');
		this.load.image('logros', 'assets/GUI/achievements.png');
		this.load.image('tutorial', 'assets/GUI/tutorial.png');
		this.load.image('background', 'assets/GUI/background_start_1.jpg');
		this.load.image('LockedAchievement', 'assets/achievs/locked.png');
		this.load.image('pauseBackground', 'assets/GUI/pause.png');
		this.load.image('PrevButton', 'assets/achievs/previous.png');
		this.load.image('NextButton', 'assets/achievs/next.png');
		this.load.image('ExitButton', 'assets/GUI/exit.png');
		this.load.image('ExitToMainMenuButton', 'assets/GUI/exitToMainMenuButton.png');
		this.load.image('RetryButton', 'assets/GUI/retryButton.png');
		// #endregion

		this.load.spritesheet('playerSheet', 'assets/character/player_sheet.png', {
			frameWidth: 32,  // Ancho de cada cuadro
			frameHeight: 32, // Altura de cada cuadro
			endFrame: 13      // Número de cuadros en el sprite sheet
		});
		this.load.spritesheet('player2dSheet', 'assets/character/player2d_sheet.png', {
			frameWidth: 288,  // Ancho de cada cuadro
			frameHeight: 480, // Altura de cada cuadro
			endFrame: 15      // Número de cuadros en el sprite sheet
		});

		// #endregion



		// #region Enemies Assets

		this.load.image('Bob', 'assets/enemies/bob.png');
		this.load.image('Crac', 'assets/enemies/crac.png');
		this.load.image('Letus', 'assets/enemies/letus.png');
		this.load.image('Mutum', 'assets/enemies/mutum.png');
		this.load.image('Zaro', 'assets/enemies/zaro.png');
		this.load.image('Estaka', 'assets/enemies/estaka.png');

		this.load.spritesheet('MutumAnim', 'assets/enemies/mutum-sheet.png', {
			frameWidth: 18,
			frameHeight: 20,
			endFrame: 2
		});
		this.load.spritesheet('ZaroAnim', 'assets/enemies/zaro-sheet.png', {
			frameWidth: 32,
			frameHeight: 32,
			endFrame: 2
		});
		this.load.spritesheet('EstakaAnim', 'assets/enemies/estaka-sheet.png', {
			frameWidth: 32,
			frameHeight: 32,
			endFrame: 5
		});
		this.load.spritesheet('CracAnim', 'assets/enemies/crac-sheet.png', {
			frameWidth: 23,
			frameHeight: 28,
			endFrame: 3
		});
		this.load.spritesheet('LetusAnim', 'assets/enemies/letus-sheet.png', {
			frameWidth: 29,
			frameHeight: 20,
			endFrame: 6
		});

		this.load.spritesheet('BobAnim', 'assets/enemies/bob-sheet.png', {
			frameWidth: 26,
			frameHeight: 29,
			endFrame: 5
		});
		// #endregion

		// #region Tilemaps

		this.load.tilemapTiledJSON('mapa1', 'assets/map/map_1/mapa_1.json');
		this.load.image('tileset1', 'assets/map/map_1/map_tiles.png');


		this.load.image('verticalDoor', 'assets/map/vertical_door_1.png');
		this.load.image('horizontalDoor', 'assets/map/horizontal_door_1.png');
		this.load.image('changeDoor', 'assets/map/verticalChangeDoor.png');

		//this.load.json('navmesh', 'assets/map/map_1/mapa_1.json');

		// #endregion

		//#region Objects
		this.load.image('key', 'assets/map/key.png');
		this.load.image('memory', 'assets/map/key.png');
		this.load.spritesheet('memoryAnim', 'assets/objects/memory-sheet.png', {
			frameWidth: 30,
			frameHeight: 26,
			endFrame: 5
		});
		this.load.spritesheet('plant', 'assets/objects/plant.png', {
			frameWidth: 32,
			frameHeight: 32,
			endFrame: 4
		});



		//#endregion

		//#region Traps
		this.load.spritesheet('SpikeEnd', 'assets/traps/spikeEnd.png', {
			frameWidth: 32,
			frameHeight: 32,
			endFrame: 0
		})
		this.load.spritesheet('Retractable_Spikes', 'assets/traps/spike.png', {
			frameWidth: 32,
			frameHeight: 32,
			endFrame: 2
		})
		this.load.image('Spike', 'assets/traps/spike1.png');
		this.load.image('Statue', 'assets/traps/retractable_spilkes_placeholder.png');
		//#endregion

		// #region soundtracks
		this.load.audio('menuAudio', 'assets/audio/soundtracks/menu.mp3');
		this.load.audio('level1Audio', 'assets/audio/soundtracks/nivel_1.mp3');
		this.load.audio('level2Audio', 'assets/audio/soundtracks/nivel_2.mp3');
		this.load.audio('jokerAudio', 'assets/audio/soundtracks/nivel_joker.mp3');
		// #endregion

		// #region SFX
		this.load.audio('buttonPressedAudio', 'assets/audio/SFX/button_pressed.wav');
		this.load.audio('enemyAreaAudio', 'assets/audio/SFX/enemy_area.wav');
		this.load.audio('enemyDeadAudio', 'assets/audio/SFX/enemy_dead.wav');
		this.load.audio('enemyHitAudio', 'assets/audio/SFX/enemy_hit.wav');
		this.load.audio('enemyShootAudio', 'assets/audio/SFX/enemy_shoot.wav');
		this.load.audio('levelUpAudio', 'assets/audio/SFX/level_up.wav');
		this.load.audio('playerAttackAudio', 'assets/audio/SFX/player_attack.wav');
		this.load.audio('playerHitAudio', 'assets/audio/SFX/player_hit.wav');
		this.load.audio('exitButtonAudio', 'assets/audio/SFX/exit_button.wav');
		this.load.audio('cureAudio', 'assets/audio/SFX/cure.wav');
		this.load.audio('pointerOverAudio', 'assets/audio/SFX/pointer_over.wav');
		this.load.audio('playerDeathAudio', 'assets/audio/SFX/player_death.wav');
		// #endregion

		// #region Explosion

		this.explosionData_1 = [
			{ key: '01', frameCount: 8 },
			{ key: '02', frameCount: 10 },
			{ key: '03', frameCount: 9 },
			{ key: '04', frameCount: 12 },
			{ key: '05', frameCount: 11 },
			{ key: '06', frameCount: 10 },
			{ key: '07', frameCount: 11 },
			{ key: '08', frameCount: 9 },
			{ key: '10', frameCount: 10 },
			{ key: '11', frameCount: 10 },
			{ key: '12', frameCount: 12 },
			{ key: '13', frameCount: 12 },
			{ key: '14', frameCount: 11 },
			{ key: '15', frameCount: 10 },
			{ key: '16', frameCount: 11 },
			{ key: '17', frameCount: 12 },
			{ key: '18', frameCount: 10 },
			{ key: '19', frameCount: 10 },
			{ key: '20', frameCount: 12 },
			{ key: '21', frameCount: 10 },
			{ key: '22', frameCount: 11 },
			{ key: '23', frameCount: 12 },
			{ key: '24', frameCount: 10 },
			{ key: '25', frameCount: 12 },
			{ key: '26', frameCount: 10 },
			{ key: '27', frameCount: 12 },
			{ key: '28', frameCount: 10 },
			{ key: '29', frameCount: 9 },
			{ key: '30', frameCount: 12 },
			{ key: '31', frameCount: 12 },
			{ key: '32', frameCount: 11 },
			{ key: '33', frameCount: 10 },
			{ key: '34', frameCount: 10 },
			{ key: '35', frameCount: 10 },
		];


		this.load.image('Bala', 'assets/bullet/bullet_1.png');
		this.load.image('Bala2', 'assets/bullet/bullet_2.png');
		this.load.image('Card', 'assets/bullet/card.png');
		this.load.image('Particle', 'assets/effects/particles_1.png');

		// SpriteSheets
		this.explosionData_1.forEach(({ key, frameWidth, frameHeight, frameCount }) => {
			this.load.spritesheet(key, `assets/effects/explosions/${key}.png`, {
				frameWidth: 32,
				frameHeight: 32,
				endFrame: frameCount - 1,
				repeat: 0
			});
		});

		// #endregion



		// #region JSONS
		// Cargar el archivo JSON de logros.
		this.load.json('achievementData', 'src/scenes/achievements/achievements_datas.json');
		this.load.json('treeData', 'src/objects/player/tree_data.json');
		this.load.json('statusData', 'src/objects/player/status_data.json');
		// #endregion


		this.load.on('complete', () => {
			this.time.addEvent({
				delay: 2000,
				callback: () => { this.scene.start("title"); }
			});
		});
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create() {

		// #region Animaciones
		// Definimos las animaciones en un array
		const animations = [
			{ key: 'playerIdleDown', start: 1, end: 1, frameRate: 5, repeat:0 },
			{ key: 'playerIdleRight', start: 3, end: 3, frameRate: 5, repeat: 0 },
			{ key: 'playerIdleUp', start: 8, end: 8, frameRate: 5, repeat: 0 },
			{ key: 'playerIdleLeft', start: 11, end: 11, frameRate: 5, repeat: 0 },
			{ key: 'playerWalkDown', start: 0, end: 2, frameRate: 8, repeat: -1 },
			{ key: 'playerWalkRight', start: 3, end: 6, frameRate: 8, repeat: -1 },
			{ key: 'playerWalkUp', start: 7, end: 9, frameRate: 8, repeat: -1 },
			{ key: 'playerWalkLeft', start: 10, end: 13, frameRate: 8, repeat: -1 }
		];

		animations.forEach(({ key, start, end, frameRate, repeat }) => {
			this.anims.create({
				key,
				frames: this.anims.generateFrameNumbers('playerSheet', { start, end }),
				frameRate,
				repeat
			});
		});

		//animacion 2d

		const animations2d = [
			{ key: 'player2dIdleDown', start: 0, end: 0, frameRate: 5, repeat: 0 },
			{ key: 'player2dIdleRight', start: 8, end: 8, frameRate: 5, repeat: 0 },
			{ key: 'player2dIdleUp', start: 12, end: 12, frameRate: 5, repeat: 0 },
			{ key: 'player2dIdleLeft', start: 5, end: 5, frameRate: 5, repeat: 0 },

			{ key: 'player2dWalkDown', start: 0, end: 3, frameRate: 8, repeat: -1 },
			{ key: 'player2dWalkRight', start: 8, end: 11, frameRate: 8, repeat: -1 },
			{ key: 'player2dWalkUp', start: 12, end: 15, frameRate: 8, repeat: -1 },
			{ key: 'player2dWalkLeft', start: 4, end: 7, frameRate: 8, repeat: -1 }
		];

		animations2d.forEach(({ key, start, end, frameRate, repeat }) => {
			this.anims.create({
				key,
				frames: this.anims.generateFrameNumbers('player2dSheet', { start, end }),
				frameRate,
				repeat
			});
		});

		// Crear animaciones de enemigos
		this.anims.create({
			key: 'MutumIdle',
			frames: this.anims.generateFrameNumbers('MutumAnim', { start: 0, end: 2 }),
			frameRate: 4,
			repeat: -1
		});
		this.anims.create({
			key: 'ZaroIdle',
			frames: this.anims.generateFrameNumbers('ZaroAnim', { start: 0, end: 2 }),
			frameRate: 6,
			repeat: -1
		});
		this.anims.create({
			key: 'EstakaAttack',
			frames: this.anims.generateFrameNumbers('EstakaAnim', { start: 0, end: 5 }),
			frameRate: 3,
			repeat: -1
		});
		this.anims.create({
			key: 'CracIdle',
			frames: this.anims.generateFrameNumbers('CracAnim', { start: 0, end: 3 }),
			frameRate: 3,
			repeat: -1
		});

		this.anims.create({
			key: 'BobIdle',
			frames: this.anims.generateFrameNumbers('BobAnim', { start: 0, end: 5 }),
			frameRate: 3,
			repeat: -1

		});
		this.anims.create({
			key: 'LetusIdle',
			frames: this.anims.generateFrameNumbers('LetusAnim', { start: 0, end: 3 }),
			frameRate: 5,
			repeat: -1
		});

		this.anims.create({
			key: 'JokerIni',
			frames: this.anims.generateFrameNumbers('jokerIniAnim', { start: 0, end: 2 }),
			frameRate: 5,
			repeat: -1
		});


		this.explosionData_1.forEach(({ key, frameCount }) => {
			this.anims.create({
				key: `${key}_expl_anim`, // Nombre único para la animación
				frames: this.anims.generateFrameNumbers(key, { start: 0, end: frameCount - 1 }),
				frameRate: 10, // Ajusta según la velocidad deseada
				repeat: 0 // Reproducir una sola vez
			});
		});
		//#endregion

		//#region objects
		this.anims.create({
			key: 'memoryIdle',
			frames: this.anims.generateFrameNumbers('memoryAnim', { start: 0, end: 5 }),
			frameRate: 6,
			repeat: -1

		});
		this.anims.create({
			key: 'plantIdle',
			frames: this.anims.generateFrameNumbers('plant', { start: 0, end: 4 }),
			frameRate: 6,
			repeat: -1

		});

		this.anims.create({
			key: 'recSpike',
			frames: this.anims.generateFrameNumbers('Retractable_Spikes', { start: 0, end: 2 }),
			frameRate: 6,
			repeat: -1

		});
		this.anims.create({
			key: 'spikeEnd',
			frames: this.anims.generateFrameNumbers('SpikeEnd', { start: 0, end: 0 }),
			frameRate: 6,
			repeat: 0

		});
		//#endregion

		this.anims.create({
			key: 'PiuLoad',
			frames: this.anims.generateFrameNumbers('PiuAnim', { start: 0, end: 16 }),
			frameRate: 8,  // Velocidad de animación
			repeat: -1      // -1 para repetir indefinidamente
		});

		// Añadir el sprite animado al centro de la pantalla
		let loadingSprite = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'PiuAnim');

		loadingSprite.play('PiuLoad');
		loadingSprite.setScale(8); // Escalar el sprite al doble de su tamaño


		this.loadingText = this.add.text(
			loadingSprite.x,                    // Colocar el texto en el centro horizontal del sprite
			loadingSprite.y + loadingSprite.displayHeight / 2 + 20, // Justo debajo del sprite (20 píxeles debajo)
			'.',                                 // Texto inicial
			{ fontSize: '32px', fill: '#000' }
		).setOrigin(0.5); // Centrar el texto horizontalmente

		// Configurar el evento de puntos animados
		this.dots = '.';
		this.time.addEvent({
			delay: 300,
			callback: this.updateDots,
			callbackScope: this,
			loop: true
		});
	}

	/**
	 * Actualiza el texto de carga con puntos animados.
	 */
	updateDots() {
		// Añadir puntos hasta tres y reiniciar
		this.dots = this.dots.length < 3 ? this.dots + '.' : '.';
		this.loadingText.setText(this.dots);
	}
}