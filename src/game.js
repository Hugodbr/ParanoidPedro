// import Title from './scenes/title.js';
import MainGame from './scenes/maingame.js';



let config = {
	type: Phaser.AUTO,
	parent: 'juego',
	width: 1280,
	height: 640,
	pixelArt: true,
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
	scene: [MainGame],

	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 10 },
			debug: true
		},

		checkCollision: {
			up: true,
			down: true,
			left: true,
			right: true
		}

	},


	title: "Paranoid Pedro",
	version: "1.0.0"

};

new Phaser.Game(config);