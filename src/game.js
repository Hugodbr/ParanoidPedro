import Title from './scenes/title.js';
import Level1 from './scenes/level_1.js';
import Level2 from './scenes/level_2.js';
import GameOver from './scenes/game_over.js';
import GameWin from './scenes/game_win.js';
import LoadScene from './scenes/load_scene.js';

let config = {
	type: Phaser.AUTO,
	parent: 'juego',
	width: 1280,
	height: 640,
	pixelArt: false,
	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,

		mode: Phaser.Scale.FIT,
		min: {
			width: 640,
			height: 300
		},
		max: {
			width: 1280,
			height: 640
		},
		zoom: 1

	},
	scene: [LoadScene, Title, Level1, Level2, GameOver, GameWin],

	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 10 },
			debug: true,
			fps: 120
		},

		checkCollision: {
			up: true,
			down: true,
			left: true,
			right: true
		}

	},
	input: {
        gamepad: true
    },

	title: "Paranoid Pedro",
	version: "1.0.0"

};

new Phaser.Game(config);