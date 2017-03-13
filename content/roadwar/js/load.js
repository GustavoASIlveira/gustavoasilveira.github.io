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
		game.load.image('enemy','img/enemy.png');
		game.load.image('bullet','img/bullet.png');
		game.load.image('gas','img/gas.png');
		game.load.image('skull','img/skull.png');
		game.load.image('meter','img/meter.png');
		game.load.spritesheet('player','img/player.png',38,67);
		game.load.spritesheet('boom','img/boom.png',64,64);
		game.load.audio('sndBullet','sound/rlaunch.ogg');
		game.load.audio('sndItem','sound/getitem.ogg');
		game.load.audio('sndExplosion','sound/DeathFlash.ogg');
		game.load.audio('stg1Music','sound/TheWreck.ogg');
		game.load.audio('introMusic','sound/ente_evil.ogg');
	},
	
	create: function(){
		game.state.start('menu');
	}
};
