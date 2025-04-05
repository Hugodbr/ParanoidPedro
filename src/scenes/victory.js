export default class Victory extends Phaser.Scene {
	/**
	 * Escena de victoria
	 * @extends Phaser.Scene
	 */
	preload() {
        this.load.image('victoryImage', 'assets/GUI/victory.png');
        this.load.json('VictoryDialog', 'assets/dialogues/dialogues_victory.json');
	}
	constructor() {
		super({ key: 'victory' });
	}

	create(data) {
		this.sound.stopAll(); // Detiene todos los sonidos en reproducci¨®n

		const victory = this.add.image(this.sys.game.canvas.width / 2, 20, 'victoryImage').setOrigin(0.5, 0).setScale(1.2);

		let GameOverButton = this.add.image(this.sys.game.canvas.width * 0.5, this.sys.game.canvas.height * 0.7, 'ExitToMainMenuButton').setScale(0.2).setInteractive().setVisible(false);

        const dialogos = this.cache.json.get('VictoryDialog');

        const animationContainer = document.getElementById('fullscreen-animation');
        const animationFrame = document.getElementById('animation-frame');
        let currentFrame = 0;
        const frames = ['assets/map/map_boss/map_boss_1.png', 'assets/map/map_boss/map_boss_2.png'];

        this.time.delayedCall(2500, () => {
            animationContainer.style.display = 'block';

            const interval = setInterval(() => {
                animationFrame.src = frames[currentFrame];
                currentFrame = (currentFrame + 1) % frames.length; 
            }, 100); 

            setTimeout(() => {
                clearInterval(interval);
                animationContainer.style.display = 'none'; 

                this.changeToDialogScene({ sceneKey: this.scene.key,backgroundType: 'dark',dialogos: dialogos });

                this.add.text(this.sys.game.canvas.width * 0.5, this.sys.game.canvas.height * 0.5,'to be continued...',
                    {
                        fontSize: 70,
                        fontFamily: "PixelArt",
                        fill: '#FFFFFF',
                        align: 'left'
                    }
                ).setOrigin(0.5, 0.5);
                GameOverButton.setVisible(true);
                victory.setVisible(false);
            }, 1000);
        });

		GameOverButton.on('pointerup', () => {
			this.scene.start('title', { player: data.player, tries: data.tries }); //Cambiamos a la escena de juego
		});


	}
	changeToDialogScene(data) {
		this.scene.launch('Dialog', data);
		this.scene.bringToTop('Dialog');
		this.scene.pause();
	}
}
