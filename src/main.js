import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'
import WinScene from './WinScene'
import GameOverScene from './GameOverScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	scene: [HelloWorldScene, WinScene, GameOverScene],
}

export default new Phaser.Game(config)
