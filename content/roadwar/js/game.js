var game = new Phaser.Game(400,600,Phaser.CANVAS);

	game.global = {
		highScore: 0
	};
	
	game.state.add('boot',bootState);
	game.state.add('load',loadState);
	game.state.add('menu',menuState);
	game.state.add('play',playState);
	
	game.state.start('boot');
