//Parâmetros: width, height, renderer, parent, state, transparent background, atialias
var game = new Phaser.Game(480,320,Phaser.CANVAS,'',null,true,false);

	game.state.add('boot',BootState);
	game.state.add('load',LoadState);
	game.state.add('lv1',Lv1State);

	game.state.start('boot');
