var loadState = {
	preload: function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
	
		var loadingLabel = game.add.text(game.world.centerX,150,'LOADING...',{font:'15px emulogic',fill:'#fff'});
			loadingLabel.anchor.set(.5);
			
		var progressBar = game.add.sprite(game.world.centerX,200,'progressBar');
			progressBar.anchor.set(.5);
			
		game.load.setPreloadSprite(progressBar);
			
		game.load.image('road','img/road.png');
		game.load.image('clouds','img/clouds.png');
		game.load.image('splash','img/splash.png');
		game.load.image('player','img/player.png');
		game.load.image('enemy','img/enemy.png');
		game.load.image('bullet','img/bullet.png');
		game.load.image('gas','img/gas.png');
		game.load.spritesheet('boom','img/boom.png',64,64);
	},
	
	create: function(){
		game.state.start('menu');
	}
};
