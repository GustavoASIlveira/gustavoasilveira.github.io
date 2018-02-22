var game = new Phaser.Game(400,600,Phaser.AUTO);

	game.global = {
		highScore: 0
	};
	
	game.state.add('boot',bootState);
	game.state.add('load',loadState);
	game.state.add('menu',menuState);
	game.state.add('lvl1',lvl1State);
	game.state.add('lvl2',lvl2State);
	game.state.add('end',endState);
	
	game.state.start('boot');
