/**
 * Escena de Tutorial
 * @extends Phaser.Scene
 */
export default class TutorialScene extends Phaser.Scene {
	/**
	 * Escena principal.
	 * @extends Phaser.Scene
	 */
	constructor() {
		super({ key: 'Tutorial' });
	}
	/**
	 * Cargamos todos los assets que vamos a necesitar
	 */
	preload() {
		this.load.image('moveTutorial', 'assets/tutorial/move.jpg');
		this.load.image('attackTutorial', 'assets/tutorial/attack.jpg');
		this.load.image('interactTutorial', 'assets/tutorial/interact.jpg');
		this.load.image('pauseTutorial', 'assets/tutorial/pause.jpg');
		this.load.image('levelUpTutorial', 'assets/tutorial/levelUp.jpg');
		this.load.image('tutorialSkipButton', 'assets/tutorial/skip.png');
		this.load.image('tutorialNextButton', 'assets/tutorial/next.png');
	}
	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create(data) {
		const _tries = data.tries || 1;
		this.sound.pauseAll();
		//crear un array de los imagenes del tutorial
		this.tutorialImages = ['moveTutorial', 'attackTutorial', 'interactTutorial', 'pauseTutorial', 'levelUpTutorial'];
		this.currentImageIndex = 0;

		this.currentImage = this.add.image(0,0, this.tutorialImages[this.currentImageIndex]).setOrigin(0,0);

		//boton de pasar al siguiente imagen
		var nextButton = this.add.image(this.sys.game.canvas.width * 0.85, this.sys.game.canvas.height*0.9, 'tutorialNextButton').setOrigin(0,0);
		nextButton.setInteractive(); 

		nextButton.on('pointerup', () => {
			this.currentImageIndex++;
			if (this.currentImageIndex < this.tutorialImages.length) {
				this.currentImage.setTexture(this.tutorialImages[this.currentImageIndex]);
			}
			else {
				this.time.addEvent({
					delay: 250,
					callback: () => {
						this.scene.start('level1', { tries: _tries, player: data.player});
					}
				});
			}

		});

		//boton de saltar
		var skipButton = this.add.image(10,10, 'tutorialSkipButton').setOrigin(0,0);
		skipButton.setInteractive();

		skipButton.on('pointerup', pointer => {
			this.time.addEvent({
				delay: 250, 
				callback: () => {
					this.scene.start('level1', { tries: _tries });
				}
			});
		});
	}
}