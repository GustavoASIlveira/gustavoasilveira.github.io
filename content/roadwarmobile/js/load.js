var loadState = {
	preload: function(){
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
	
		game.physics.startSystem(Phaser.Physics.ARCADE);
	
		var loadingLabel = game.add.text(game.world.centerX,150,'LOADING...',{font:'15px emulogic',fill:'#fff'});
			loadingLabel.anchor.set(.5);
			
		var progressBar = game.add.sprite(game.world.centerX,200,'progressBar');
			progressBar.anchor.set(.5);
			
		game.load.setPreloadSprite(progressBar);
			
		game.load.image('road','img/road.png');
		game.load.image('clouds','img/clouds.png');
		game.load.image('splash','img/splash.png');
		game.load.image('bullet','img/bullet.png');
		game.load.image('bossBullet','img/bossBullet.png');
		game.load.image('gas','img/gas.png');
		game.load.image('skull','img/skull.png');
		game.load.image('tank','img/tank.png');
		game.load.image('meter','img/meter.png');
		game.load.image('gauge','img/gauge.png');
		game.load.image('pointer','img/pointer.png');
		game.load.spritesheet('glow','img/glow.png',80,62);
		game.load.spritesheet('player','img/player.png',38,67);
		game.load.spritesheet('enemy','img/enemy.png',38,64);
		game.load.spritesheet('boom','img/boom.png',64,64);
		game.load.spritesheet('enemy2','img/strongCar.png',40,78);
		game.load.audio('sndBullet','sound/rlaunch.ogg');
		game.load.audio('sndItem','sound/getitem.ogg');
		game.load.audio('sndExplosion','sound/DeathFlash.ogg');
		game.load.audio('stg1Music','sound/TheWreck.ogg');
		game.load.audio('introMusic','sound/ente_evil.ogg');
		game.load.image('btnLeft','img/btnLeft.png');
		game.load.image('btnRight','img/btnRight.png');
		game.load.image('btnUp','img/btnUp.png');
		game.load.image('btnDown','img/btnDown.png');
	},
	
	create: function(){
		game.state.start('menu');
	}
};
