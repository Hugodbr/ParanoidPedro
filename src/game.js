import Level1 from './scenes/levels/level_1.js';
import Level2 from './scenes/levels/level_2.js';
import Level3 from './scenes/levels/level_3.js';
import Boss from './scenes/levels/boss_scene.js';
import Title from './scenes/title.js';
import Loading from './scenes/loading.js';
import GameOver from './scenes/gameover.js';
import Pause from './scenes/pause.js';
import AchievementScene from './scenes/achievements/achievement_scene.js';
import AbilityTree from './scenes/ability_tree.js';
import DialogScene from './scenes/dialog.js';
import TutorialScene from './scenes/tutorial.js';
import Victory from './scenes/victory.js';


let config = {
	type: Phaser.AUTO,
	parent: 'juego',
	width: 1000,
	height: 600,
	pixelArt: true,
	mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
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
	scene: [Loading, Title, TutorialScene, DialogScene, Boss, Level1, Level2, Level3, GameOver, AchievementScene, AbilityTree, Pause, Victory],

	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		},

		checkCollision: {
			up: true,
			down: true,
			left: true,
			right: true
		}

	},


	title: "Madness",
	version: "1.0.0"

};

new Phaser.Game(config);