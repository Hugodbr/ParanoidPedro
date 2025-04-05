
export default class Title extends Phaser.Scene {
	/**
	 * Escena de Título.
	 * @extends Phaser.Scene
	 */
	constructor() {
		super({ key: 'title' });
	}

	/**
	 * Cargamos todos los assets que vamos a necesitar
	 */
	preload() {
		const achievementDatas = this.cache.json.get('achievementData');

		// Precargar dinámicamente los sprites de logros
		achievementDatas.forEach(data => {
			this.load.image(data.unlockedSprite, `assets/achievs/${data.unlockedSprite}.png`);
		});
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create(data) {
		this.sound.pauseAll(); // Reanuda todos los sonidos pausados

		const _tries = data.tries || 1;
		//console.log("tries: " + _tries);
		//console.log("me he creado", this.scene.key);

		var TitleSample = this.sound.add('menuAudio');
		if (!TitleSample.isPlaying) {
			TitleSample.setLoop(true);
			TitleSample.play();
		}
		// efecto de sonido del botón
		var buttonSFX = this.sound.add('buttonPressedAudio');
		buttonSFX.setVolume(0.5);
		
		//Pintamos un fondo
		var back = this.add.image(0, 0, 'background').setOrigin(0, 0);
		back.setOrigin(0, 0);  // Asegura que el fondo empieza desde la esquina superior izquierda
		back.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);  // Redimensiona al tamaño del canvas

		//Pintamos un botón de Empezar
		let startButton = this.add.image(this.sys.game.canvas.width/2, this.sys.game.canvas.height/2+50, 'start')
		startButton.setInteractive(); // Hacemos el sprite interactivo para que lance eventos

		const pointerOver = this.sound.add('pointerOverAudio');
		pointerOver.setVolume(0.5);

		// Sonidos de cuando el cursor esta sobre el boton
		startButton.on('pointerover', () => {
			pointerOver.play();
			startButton.setTint(0x999999); // Oscurecer el sprite
		});
		startButton.on('pointerout', () => {
			startButton.clearTint(); // Restaurar el color original
		});
		startButton.on('pointerup', () => {
			TitleSample.stop(); // Detiene el audio de fondo

			buttonSFX.play();

			// Agregar un retraso de 250ms antes de cambiar de escena
			this.time.addEvent({
				delay: 250, // 250 ms
				callback: () => {
					this.scene.start('level1', { player: data.player, tries: _tries }); // Cambiar a la escena de juego
				}
			});

		});

		let acvButton = this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height / 2 + 140, 'logros');
		acvButton.setInteractive(); // Hacemos el sprite interactivo para que lance eventos

		// Sonidos de cuando el cursor esta sobre el boton
		acvButton.on('pointerover', () => {
			pointerOver.play();
			acvButton.setTint(0x999999); // Oscurecer el sprite
		});
		acvButton.on('pointerout', () => {
			acvButton.clearTint(); // Restaurar el color original
		});
		acvButton.on('pointerup', () => {
			buttonSFX.play();
			// Agregar un retraso de 250ms antes de cambiar de escena
			this.time.addEvent({
				delay: 250, // 250 ms
				callback: () => {
					this.scene.start('AchievementScene', { previousScene: this.scene.key });
				}
			});

		});

		let tutorialButton = this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height / 2 + 210, 'tutorial');
		tutorialButton.setInteractive(); // Hacemos el sprite interactivo para que lance eventos

		// Sonidos de cuando el cursor esta sobre el boton
		tutorialButton.on('pointerover', () => {
			pointerOver.play();
			tutorialButton.setTint(0x999999); // Oscurecer el sprite
		});
		tutorialButton.on('pointerout', () => {
			tutorialButton.clearTint(); // Restaurar el color original
		});
		tutorialButton.on('pointerup', () => {
			TitleSample.stop(); // Detiene el audio de fondo

			buttonSFX.play();
			this.time.addEvent({
				delay: 250,
				callback: () => {
					this.scene.start('Tutorial', { tries: _tries, player: data.player });
				}
			});

		});


	}
}