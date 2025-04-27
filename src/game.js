import Title from './scenes/title.js';


let config = {
	type: Phaser.AUTO,
	parent: 'juego',
	width: 1000,
	height: 600,
	pixelArt: true,
	scale: {
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,

		mode: Phaser.Scale.FIT,
		min: {
			width: 800,
			height: 600
		},
		max: {
			width: 1600,
			height: 1200
		},
		zoom: 1

	},
	scene: [Title],

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