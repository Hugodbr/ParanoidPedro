import { showPopup } from "../UI/showPopUp.js";
import { unlock } from "./achievements/unlock.js";

export default class Gameover extends Phaser.Scene {
/**
 * Escena de muerte
 * @extends Phaser.Scene
 */
	constructor() {
		super({ key: 'gameover' });
	}

	/**
	* Creación de los elementos de la escena principal de juego
	*/
	create(data) {
		//console.log("me he creado", this.scene.key);
		this.sound.stopAll(); // Detiene todos los sonidos en reproducción
		//aumentar el numero de veces que me he muerto
		this._tries = data.tries;
		this._tries++;
		//console.log("tries: " + this._tries);

		// #region logros muertes-intentos
		//logro morirse 1 vez
		if (this._tries - 1 == 1) {
			unlock(this, `La primera no cuenta`);
			showPopup(this, 'Logro <<La primera no cuenta>> desloqueado!', this.scale.width - 175, this.scale.height - 100);
		}
		//logro morirse 5 vez
		else if (this._tries - 1 == 5) {
			unlock(this, `Este no es mi momento`);
			showPopup(this, 'Logro <<Este no es mi momento>> desloqueado!', this.scale.width - 175, this.scale.height - 100);
		}
		//logro morirse 10 veces
		else if (this._tries - 1 == 10) {
			unlock(this, `Demasiado hardcore`);
			showPopup(this, 'Logro <<Demasiado hardcore>> desloqueado!', this.scale.width - 175, this.scale.height - 100);
		}
		//logro morirse 20 veces
		else if (this._tries - 1 == 20) {
			unlock(this, `Insignia para novatos (no llores, te queremos)`);
			showPopup(this, 'Logro <<Insignia para novatos (no llores, te queremos)>> desloqueado!', this.scale.width - 175, this.scale.height - 100);
		}
		// #endregion

		var background = this.add.image(this.sys.game.canvas.width / 2, 20, 'end').setOrigin(0.5, 0);

		let retryButton = this.add.image(this.sys.game.canvas.width / 5, 500, 'RetryButton').setScale(0.35).setInteractive();
		let gameOverButton = this.add.image((this.sys.game.canvas.width/4 +200), 500, 'ExitToMainMenuButton').setScale(0.35).setInteractive();

		this.MainSample = this.sound.add('playerDeathAudio');
		this.MainSample.play();

		const pointerOver = this.sound.add('pointerOverAudio');
		pointerOver.setVolume(0.5);

		// Sonidos de cuando el cursor esta sobre el boton
		gameOverButton.on('pointerover', () => {
			pointerOver.play();
		});
		retryButton.on('pointerover', () => {
			pointerOver.play();
		});
		gameOverButton.on('pointerup', () => {
			this.scene.start('title', { player: data.player, tries: this._tries }); //Cambiamos a la escena de juego
		});
		retryButton.on('pointerup', () => {
			this.scene.start(data.previousScene, { player: data.player, tries: this._tries }); //Cambiamos a la escena de juego
		});
	}
}