var playState = {
	create: function(){
		//cria a estrada (road) inicialmente transparente e que atinge 100% de opacidade em 1s 
		this.road = game.add.tileSprite(0,0,400,600,'road');
		this.road.alpha = 0;
		game.add.tween(this.road).to({alpha:1},1000).start();
		
		this.clouds = game.add.tileSprite(0,0,400,600,'clouds');
		this.clouds.alpha = 0;
		game.add.tween(this.clouds).to({alpha:1},1000).start();
		
		//cria o player, inicialmente com controles desabilitados e fora da tela.
		this.player = game.add.sprite(game.world.centerX,650,'player');
		game.physics.arcade.enable(this.player);
		this.player.anchor.set(.5);
		this.player.canPlay = false;
		//em 0.5s o player começa a entrar na tela, alcançando seu ponto ideal aos 2s
		game.time.events.add(500,function(){
			game.add.tween(this.player).to({y:500},1500).start();
		},this);
		//aos 2s o controle do player é habilitado
		game.time.events.add(2000,function(){
			this.player.canPlay = true;
			this.player.body.collideWorldBounds = true;
		},this);
		
		//FUEL
		this.fuel = 50;
		this.GAS = game.add.group();
		this.GAS.enableBody = true;
		game.time.events.loop(5000,function(){
			this.createGAS();
		},this);
		
		//cria o grupo de inimigos
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(10,'enemy');
		//tempo para a criação de novos inimigos
		this.enemyTime = game.time.now + 3000;
		
		//cria bloqeios nas laterais para os inimigos
		this.blocks = game.add.group();
		this.blocks.enableBody = true;
		
		var block = this.blocks.create(0,0);
			block.width = 75;
			block.height = 600;
			block.body.immovable = true;
			block = this.blocks.create(game.world.width,0);
			block.width = 75;
			block.height = 600;
			block.anchor.set(1,0);
			block.body.immovable = true;
		
		//controles do jogo
		this.controls = game.input.keyboard.createCursorKeys();
		game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN
		]);
		
		//recursos para atirar
		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.bulletTime = game.time.now;
		
		//SCORE
		this.score = 0;
		this.txtScore = game.add.text(5,5,'SCORE:' + this.getTextScore(),{font:'15px emulogic', fill:'#fff'});
		
		//FUEL TEXT
		this.txtFuel = game.add.text(game.world.width - 5,5,'FUEL:'+this.getTextFuel(),{font:'15px emulogic',fill:'#fff'});
		this.txtFuel.anchor.set(1,0);
		this.fuelLoop = game.time.events.loop(1000,function(){
			this.fuel--;
			this.txtFuel.text = 'FUEL:'+this.getTextFuel();
		},this);
	},
	
	update: function(){
		game.physics.arcade.collide(this.enemies,this.enemies);
		game.physics.arcade.collide(this.enemies,this.blocks);
		game.physics.arcade.overlap(this.player,this.enemies,this.killPlayer,null,this);
		game.physics.arcade.overlap(this.bullets,this.enemies,this.killEnemy,null,this);
		game.physics.arcade.overlap(this.player,this.GAS,this.getFuel,null,this);
		this.road.tilePosition.y += 5;
		this.clouds.tilePosition.y += 7;
		
		if(this.player.canPlay){
			this.movePlayer();
		}
		
		if(this.fireButton.isDown){
			this.fireBullet();
		}
		
		if(game.time.now > this.enemyTime){
			this.enemyTime = game.time.now + Math.floor(Math.random() * 1501) + 500;
			this.addEnemy();
		}
		
		if(this.fuel <= 0){
			this.killPlayer();
		}
	},
	
	getTextFuel: function(){
		if(this.fuel < 10){
			return '00'+this.fuel;
		}
		if(this.fuel < 100){
			return '0'+this.fuel;
		}
		if(this.fuel < 1000){
			return this.fuel;
		}
		return 'WHAT?!';
	},
	
	getTextScore: function(){
		if(this.score < 10){
			return '00000'+this.score;
		}
		if(this.score < 100){
			return '0000'+this.score;
		}
		if(this.score < 1000){
			return '000'+this.score;
		}
		if(this.score < 10000){
			return '00'+this.score;
		}
		if(this.score < 100000){
			return '0'+this.score;
		}
		if(this.score < 1000000){
			return this.score;
		}
		return 'ROADKILLER';
	},
	
	createGAS: function(){
		var x = Math.floor(Math.random() * 232) + 76;
		var gas = this.GAS.create(x,0,'gas');
			gas.anchor.set(0,1);
			gas.body.velocity.y = 300;
			gas.checkWorldBounds = true;
			gas.outOfBoundsKill = true;
			
		game.add.tween(gas).to({alpha: 0},500).to({alpha: 1},500).loop().start();
	},
	
	getFuel: function(player,gas){
		gas.kill();
		this.fuel += 5;
		this.txtFuel.text = 'FUEL:'+this.getTextFuel();
		this.getPoints();
	},
	
	getPoints: function(){
		this.score += 5;
		this.txtScore.text = 'SCORE:'+this.getTextScore();
	},
	
	movePlayer: function(){
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		
		if(this.controls.left.isDown){
			this.player.body.velocity.x = -200;
		} 
		if(this.controls.right.isDown){
			this.player.body.velocity.x = 200;
		}
		if(this.controls.up.isDown){
			this.player.body.velocity.y = -200;
		}
		if(this.controls.down.isDown){
			this.player.body.velocity.y = 200;
		}
		
		if(this.player.x + this.player.width/2 > game.world.width - 75){
			this.player.x = (game.world.width - 75) - this.player.width/2;
			this.player.body.velocity.y = 200;
		}
		if(this.player.x - this.player.width/2 < 75){
			this.player.x = this.player.width/2 + 75;
			this.player.body.velocity.y = 200;
		}
	},
	
	addEnemy: function(){
		var enemy = this.enemies.getFirstDead();
		
		if(!enemy){
			return;
		}
		//posição inicial do inimigo varia entre 76px e 292px (largura do mundo - 75px de pedras - 32px da largura do inimigo)
		var xPosition = Math.floor(Math.random() * 217) + 76;
		var speed = Math.floor(Math.random() * 151) + 50;
		var bounce = Math.random();
		enemy.anchor.set(0,1);
		enemy.reset(xPosition,0);
		enemy.body.velocity.y = speed;
		enemy.body.bounce.y = bounce;
		enemy.body.bounce.x = bounce;
		enemy.checkWorldBounds = true;
		enemy.outOfBoundsKill = true;
		if(Math.floor(Math.random()*11) < 4){
			enemy.body.velocity.x = speed * (Math.random() > .5 ? 1 : -1);
		}
	},
	
	killEnemy: function(bullet,enemy){
		var x = enemy.x + enemy.width/2;
		var y = enemy.y - enemy.height/2;
		bullet.kill();
		enemy.kill();
		this.explode(x,y);
		this.getPoints();
	},
	
	killPlayer: function(){
		game.time.events.remove(this.fuelLoop);
		var x = this.player.x;
		var y = this.player.y;
		this.player.kill();
		this.explode(x,y);
		
		if(this.score > game.global.highScore){
			game.global.highScore = this.score;
		}
		
		game.time.events.add(500,function(){
			var txtGameOver = game.add.text(game.world.centerX,650,'GAME OVER',{font: '20px emulogic', fill:'#f00'});
				txtGameOver.anchor.set(.5);
			game.add.tween(txtGameOver).to({y: game.world.centerY},1000).start();
		},this);
		
		game.time.events.add(2000,function(){
			var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
				enterKey.onDown.addOnce(this.backToMenu,this);
		},this);
		
		game.time.events.add(7000,function(){
			this.backToMenu();
		},this);
	},
	
	explode: function(x,y){
		var boom = game.add.sprite(x,y,'boom');
			boom.anchor.set(.5);
			boom.animations.add('boom');
			boom.play('boom',120,false,true);
	},
	
	fireBullet: function(){
		if(!this.player.alive){
			return;
		}
		if(game.time.now > this.bulletTime){
			this.bulletTime = game.time.now + 2000;
			var x = this.player.x - 5;
			var y = this.player.y - 10;
			var bullet = this.bullets.create(x,y,'bullet');
				bullet.anchor.set(.5);
				bullet.body.velocity.y = -500;
				bullet.checkWorldBounds = true;
				bullet.outOfBoundsKill = true;
		}
	},
	
	backToMenu: function(){
		game.state.start('menu');
	}
};
