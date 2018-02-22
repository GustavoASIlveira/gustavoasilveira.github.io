var lvl2State = {
	create: function(){
		this.music = game.add.audio('stg1Music');
		this.music.loop = true;
		this.music.volume = 0;
		game.add.tween(this.music).to({volume:.3},1500).start();
		this.music.play();
		//cria a estrada (road) inicialmente transparente e que atinge 100% de opacidade em 1s 
		this.road = game.add.tileSprite(0,0,400,600,'road');
		this.road.alpha = 0;
		game.add.tween(this.road).to({alpha:1},1000).start();
		
		//continue
		this.tryAgain = true;
		
		//cria o player, inicialmente com controles desabilitados e fora da tela.
		this.player = game.add.sprite(game.world.centerX,650,'player');
		this.player.animations.add('empty',[0,1],5,true);
		this.player.animations.add('loaded',[2,3],5,true);
		this.player.canShoot = true;
		game.physics.arcade.enable(this.player);
		this.player.anchor.set(.5);
		this.player.body.setSize(28,58,5,5);
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
		this.fuel = 30;
		this.GAS = game.add.group();
		this.GAS.enableBody = true;
		this.newGas = game.time.events.loop(5000,function(){
			this.createGAS();
		},this);
		this.itemSound = game.add.audio('sndItem');
		this.itemSound.volume = .5;
		
		//cria o grupo de inimigos
		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.createMultiple(10,'enemy');
		//tempo para a criação de novos inimigos
		this.enemyTime = game.time.now + 3000;
		//animções dos inimigos
		this.enemies.callAll('animations.add', 'animations', 'run', [0, 1], 5, true);
		this.enemies.callAll('animations.play', 'animations', 'run');
		
		//INIMIGO 2
		this.enemies2 = game.add.group();
		this.enemies2.enableBody = true;
		this.enemy2Timer = game.time.events.loop(9000,function(){
			this.addEnemies2();
		},this);
		
		//BOSS
		this.boss = game.add.sprite(game.world.centerX, -100,'tank');
		game.physics.arcade.enable(this.boss);
		this.boss.anchor.set(.5);
		this.boss.body.setSize(55,106,2,2);
		this.boss.offGame = true;
		this.boss.isDead = false;
		this.boss.canBeShot = false;
		this.boss.hp = 45;
		this.boss.body.bounce.x = 1;
		this.boss.shootingTime;
		this.boss.attack = false;
		//recursos para o Boss atirar
		this.bossBullets = game.add.group();
		this.bossBullets.enableBody = true;
		
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
		this.bulletSound = game.add.audio('sndBullet');
		this.bulletSound.volume = .5;
		this.explodeSound = game.add.audio('sndExplosion');
		
		//NÉVOA
		this.clouds = game.add.tileSprite(0,0,400,600,'clouds');
		this.clouds.alpha = 0;
		game.add.tween(this.clouds).to({alpha:1},1000).start();
		
		//medidor
		this.meter = game.add.sprite(10,50,'meter');
		this.meter.alpha = 0;
		game.add.tween(this.meter).to({alpha:1},1000).start();
		
		//marcador
		this.timeToGoal = game.global.foundEnemy ? 10 : 90;
		this.skull = game.add.sprite(11,this.timeToGoal * 5 + 66,'skull');
		this.skull.anchor.set(0,.5);
		this.skull.alpha = 0;
		game.add.tween(this.skull).to({alpha:1},1000).start();
		this.timer = game.time.events.loop(1000,function(){
			this.timeToGoal--;
		},this);
		
		this.glow = game.add.sprite(0,585,'glow');
		this.glow.animations.add('glowing',[0,1],5,true);
		this.glow.anchor.set(0,1);
		this.glow.alpha = 0;
		game.add.tween(this.glow).to({alpha:1},1000).start();
		
		this.gauge = game.add.sprite(10,580,'gauge');
		this.gauge.anchor.set(0,1);
		this.gauge.alpha = 0;
		game.add.tween(this.gauge).to({alpha:1},1000).start();
		
		this.pointer = game.add.sprite(40,568,'pointer');
		this.pointer.anchor.set(.5);
		this.pointer.angle = 80;
		this.pointer.alpha = 0;		
		game.add.tween(this.pointer).to({alpha:1},1000).start();
		this.tweenPointer = game.add.tween(this.pointer).to({angle:-80},500).to({angle:80},1500);
		
		//SCORE
		this.score = game.global.score;
		this.txtScore = game.add.text(5,5,'SCORE:' + this.getTextScore(this.score),{font:'15px emulogic', fill:'#fff'});
		
		//FUEL TEXT
		this.txtFuel = game.add.text(game.world.width - 5,5,'FUEL:'+this.getTextFuel(),{font:'15px emulogic',fill:'#fff'});
		this.txtFuel.anchor.set(1,0);
		this.fuelLoop = game.time.events.loop(1000,function(){
			this.fuel--;
			this.txtFuel.text = 'FUEL:'+this.getTextFuel();
		},this);
		
		//botões
		//Esquerda
		this.btnLeft = game.add.button(200,400,'btnLeft');
		this.btnLeft.onInputDown.add(function(){
			this.player.mvLeft = true;
		},this);
		this.btnLeft.onInputUp.add(function(){
			this.player.mvLeft = false;
		},this);
		this.btnLeft.alpha = .5;
	
		//Direita
		this.btnRight = game.add.button(300,400,'btnRight');
		this.btnRight.onInputDown.add(function(){
			this.player.mvRight = true;
		},this);
		this.btnRight.onInputUp.add(function(){
			this.player.mvRight = false;
		},this);
		this.btnRight.alpha = .5;
		
		//Cima
		this.btnUp = game.add.button(250,300,'btnUp');
		this.btnUp.onInputDown.add(function(){
			this.player.mvUp = true;
		},this);
		this.btnUp.onInputUp.add(function(){
			this.player.mvUp = false;
		},this);
		this.btnUp.alpha = .5;
		
		//Baixo
		this.btnDown = game.add.button(250,500,'btnDown');
		this.btnDown.onInputDown.add(function(){
			this.player.mvDown = true;
		},this);
		this.btnDown.onInputUp.add(function(){
			this.player.mvDown = false;
		},this);
		this.btnDown.alpha = .5;
		
		//Tiro
		this.btnShoot = game.add.button(0,500,'btnUp');
		this.btnShoot.onInputDown.add(this.fireBullet,this);
		this.btnShoot.alpha = 0;
	},
	
	update: function(){
		game.physics.arcade.collide(this.enemies,this.enemies);
		game.physics.arcade.collide(this.enemies,this.blocks);
		game.physics.arcade.overlap(this.player,this.enemies,this.killPlayer,null,this);
		game.physics.arcade.overlap(this.player,this.enemies2,this.killPlayer,null,this);
		game.physics.arcade.overlap(this.bossBullets,this.player,this.killPlayer,null,this);
		game.physics.arcade.overlap(this.bullets,this.enemies,this.killEnemy,null,this);
		game.physics.arcade.overlap(this.enemies2,this.enemies,this.killEnemy,null,this);
		game.physics.arcade.overlap(this.bullets,this.enemies2,this.killEnemy,null,this);
		game.physics.arcade.overlap(this.player,this.GAS,this.getFuel,null,this);
		game.physics.arcade.overlap(this.bullets,this.boss,this.hitBoss,null,this);
		game.physics.arcade.overlap(this.player,this.boss,this.killPlayer,null,this);
		game.physics.arcade.collide(this.boss,this.blocks);
		
		this.road.tilePosition.y += 5;
		this.clouds.tilePosition.y += 7;
		
		if(this.player.canPlay){
			this.movePlayer();
		}
		
		if(this.player.canShoot && this.player.canPlay){
			this.player.animations.play('loaded');
			this.glow.animations.play('glowing');
		} else {
			this.player.animations.play('empty');
			this.glow.animations.stop();
			this.glow.frame = 1;
		}
		
		if(this.fireButton.isDown){
			if(!this.boss.offGame && !this.boss.canBeShot){
				return;
			} else {
				this.fireBullet();
			}
		}
		
		if(game.time.now > this.enemyTime && this.boss.offGame){
			this.enemyTime = game.time.now + Math.floor(Math.random() * 1501) + 500;
			this.addEnemy();
		}
		
		if(this.player.alive){
			if(this.fuel <= 0){
				this.killPlayer();
			}
		
		
			if(this.timeToGoal < 1 && this.player.canPlay){
				if(this.boss.offGame){
					this.bossArrive();
				}
			} else {
				if(this.timeToGoal > 0){
					this.skull.y = this.timeToGoal * 5 + 66;
				}
			}
			
		}
		
		if(this.boss.canBeShot && !this.boss.isDead){
			if(this.boss.hp < 25){
				this.moveBoss();
			}
			
			if(this.boss.shootingTime < game.time.now){
				this.boss.shootingTime = game.time.now + Math.floor(Math.random() * 1501) + 500;
				this.bossShot();
			}
		}
	},
	
	bossArrive: function(){
		game.global.foundEnemy = true;
	
		//Pausa alguns eventos
		this.boss.offGame = false;
		game.time.events.remove(this.timer);
		game.time.events.remove(this.enemy2Timer);
		this.destroyEnemies();
		
		//Ações iniciais do Boss
		game.add.tween(this.boss).to({y:150},5000).start();
		game.add.tween(this.skull).to({y:this.boss.hp * 10 + 66},5000).start();
		game.time.events.add(5000,function(){
			this.boss.canBeShot = true;
			this.boss.body.velocity.x = Math.random() < .5 ? 100 : -100;
			this.boss.shootingTime = game.time.now;
		},this);
	},
	
	moveBoss: function(){
		if(!this.boss.attack && this.boss.y < 200){
			this.boss.attack = true;
		}
		if(this.boss.attack){
			this.boss.attack = false;
			this.boss.body.velocity.y = 150;
		}
		if(this.boss.y > 500){
			this.boss.body.velocity.y = 0;
			game.add.tween(this.boss).to({y:150},3000).start();
		}
	},
	
	hitBoss: function(enemy,bullet){
		if(!this.boss.isDead){
			this.getPoints(10);
			this.explode(bullet.x,bullet.y);
		
			bullet.kill();
			this.boss.hp -= 5;
			game.add.tween(this.skull).to({y:this.boss.hp * 10 + 66},500).start();
			
			if(this.boss.hp <= 0){
				this.bossKill();
			}
		}
	},
	
	bossShot: function(){
		this.bulletSound.play();
		var x = this.boss.x;
		var y = this.boss.y + this.boss.height/2;
		var bullet = this.bossBullets.create(x,y,'bossBullet');
			bullet.anchor.set(.5);
			bullet.body.velocity.y = 500;
			bullet.checkWorldBounds = true;
			bullet.outOfBoundsKill = true;
	},
	
	bossKill: function(){
		this.getPoints(500);
		this.boss.offGame = true;
		this.boss.isDead = true;
		this.boss.body.velocity.x = 0;
		this.boss.body.velocity.y = 0;
		
		var explosions = game.time.events.loop(500,function(){
			var x = Math.floor(Math.random() * this.boss.width) + this.boss.x - this.boss.width/2;
			var y = Math.floor(Math.random() * this.boss.height) + this.boss.y - this.boss.height/2;
			this.explode(x,y);
		},this);
		
		game.time.events.add(5000,function(){
			this.boss.kill();
			game.time.events.remove(explosions);
			this.endLevel();
		},this);
	},
	
	endLevel: function(){
		game.time.events.remove(this.newGas);
		game.time.events.remove(this.fuelLoop);
		this.player.canPlay = false;
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		this.player.body.collideWorldBounds = false;
		this.destroyGAS();
	
		game.time.events.add(1000,function(){
			this.player.body.velocity.y = -200;
		},this);
	
		var bonus = this.fuel * 5;
		game.global.score = this.score + bonus;
		if(game.global.score > game.global.highScore){
			game.global.highScore = game.global.score;
		}
		
		game.time.events.add(2000,function(){
			var txtScore = game.add.text(game.world.centerX,game.world.centerY-100,'SCORE: ' + this.getTextScore(this.score),{font:'15px emulogic',fill:'#fff'})
				txtScore.anchor.set(.5);
		},this);
		
		game.time.events.add(2500,function(){
			var txtBonus = game.add.text(game.world.centerX,game.world.centerY-50,'FUEL BONUS: ' + bonus,{font:'15px emulogic',fill:'#fff'})
				txtBonus.anchor.set(.5);
		},this);
		
		game.time.events.add(3000,function(){
			var txtGlobalScore = game.add.text(game.world.centerX,game.world.centerY,'TOTAL SCORE: ' + this.getTextScore(game.global.score),{font:'15px emulogic',fill:'#fff'})
				txtGlobalScore.anchor.set(.5);
		},this);
		
		game.time.events.add(5000,function(){
			game.add.tween(this.road).to({alpha:0},1000).start();
			game.add.tween(this.music).to({volume:0},3000).start();
			game.add.tween(this.meter).to({alpha:0},1000).start();
			game.add.tween(this.skull).to({alpha:0},1000).start();
			game.add.tween(this.gauge).to({alpha:0},1000).start();
			game.add.tween(this.pointer).to({alpha:0},1000).start();
			game.add.tween(this.glow).to({alpha:0},1000).start();
		},this);
		game.time.events.add(8000,function(){
			this.music.stop();
			game.state.start('end');
		},this);
	},
	
	destroyGAS: function(){
		this.GAS.forEachAlive(function(gas){
			var x = gas.x + gas.width/2;
			var y = gas.y - gas.height/2;
			gas.kill();
			this.explode(x,y);
		},this);
	},
	
	destroyEnemies: function(){
		this.enemies.forEachAlive(function(enemy){
			var x = enemy.x + enemy.width/2;
			var y = enemy.y - enemy.height/2;
			enemy.kill();
			this.explode(x,y);
		},this);
		
		this.enemies2.forEachAlive(function(enemy){
			var x = enemy.x + enemy.width/2;
			var y = enemy.y - enemy.height/2;
			enemy.kill();
			this.explode(x,y);
		},this);
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
	
	getTextScore: function(score){
		if(this.score < 10){
			return '00000'+ score;
		}
		if(this.score < 100){
			return '0000'+ score;
		}
		if(this.score < 1000){
			return '000'+ score;
		}
		if(this.score < 10000){
			return '00'+ score;
		}
		if(this.score < 100000){
			return '0'+ score;
		}
		if(this.score < 1000000){
			return score;
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
		this.itemSound.play();
		gas.kill();
		this.fuel += 5;
		this.txtFuel.text = 'FUEL:'+this.getTextFuel();
		this.getPoints(5);
	},
	
	getPoints: function(poits){
		this.score += poits;
		this.txtScore.text = 'SCORE:'+this.getTextScore(this.score);
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
	
	addEnemies2: function(){
		var x = Math.floor(Math.random() * 208) + 76;
		var enemy2 = this.enemies2.create(x,0,'enemy2');
			enemy2.animations.add('broke',[1,2],5,true);
			enemy2.anchor.set(0,1);
			enemy2.body.velocity.y = 100;
			enemy2.checkWorldBounds = true;
			enemy2.outOfBoundsKill = true;
			enemy2.hitPoints = 1;
	},
	
	killEnemy: function(bullet,enemy){
		var x = enemy.x + enemy.width/2;
		var y = enemy.y - enemy.height/2;
		this.explode(x,y);
		if(enemy.hitPoints > 0){
			enemy.animations.play('broke');
			enemy.hitPoints--;
		} else {
			enemy.kill();
			if(enemy.key === 'enemy2'){
				game.time.events.add(250,function(){
					this.explode(x,y-20);
				},this);
			}
			
		}
		
		if(bullet.key === 'bullet'){
			bullet.kill();
			this.getPoints(enemy.key === 'enemy2' ? 50 : 5);
		}	
	},
	
	killPlayer: function(player,enemy){
		if(enemy && enemy.key === 'bossBullet'){
			enemy.kill();
		}
		game.time.events.remove(this.fuelLoop);
		var x = this.player.x;
		var y = this.player.y;
		this.player.kill();
		this.explode(x,y);
		
		if(this.score > game.global.highScore){
			game.global.highScore = this.score;
		}
		
		game.global.score = 0;
		
		game.time.events.add(500,function(){
			var txtGameOver = game.add.text(game.world.centerX,650,'GAME OVER',{font: '20px emulogic', fill:'#f00'});
				txtGameOver.anchor.set(.5);
			game.add.tween(txtGameOver).to({y: game.world.centerY - 50},1000).start();
		},this);
		
		game.time.events.add(1000,function(){
			var txtGameOver = game.add.text(game.world.centerX,750,'CONTINUE',{font: '20px emulogic', fill:'#f00'});
				txtGameOver.anchor.set(.5);
			game.add.tween(txtGameOver).to({y: game.world.centerY + 50},1000).start();
		},this);
		
		game.time.events.add(2000,function(){
			var txtYes = game.add.text(game.world.centerX - 50,game.world.centerY + 100,'YES',{font: '20px emulogic', fill:'#f00'});
				txtYes.anchor.set(1,.5);
			var blinkingYes = game.add.tween(txtYes).to({alpha: 0},300).to({alpha: 1},300).loop().start();
			var txtNo = game.add.text(game.world.centerX + 50,game.world.centerY + 100,'NO',{font: '20px emulogic', fill:'#f00'});
				txtNo.anchor.set(0,.5);
			var blinkingNo;
				
			this.controls.left.onDown.add(function(){
				if(!this.tryAgain){
					this.tryAgain = true;
					blinkingYes = game.add.tween(txtYes).to({alpha: 0},300).to({alpha: 1},300).loop().start();
					blinkingNo.stop();
					txtNo.alpha = 1;
				}
			},this);
			
			this.controls.right.onDown.add(function(){
				if(this.tryAgain){
					this.tryAgain = false;
					blinkingNo = game.add.tween(txtNo).to({alpha: 0},300).to({alpha: 1},300).loop().start();
					blinkingYes.stop();
					txtYes.alpha = 1;
				}
			},this);
		
			var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
				enterKey.onDown.addOnce(this.backToMenu,this);
				
			game.input.onDown.addOnce(this.backToMenu,this);
		},this);
		
		game.time.events.add(10000,function(){
			this.backToMenu();
		},this);
	},
	
	explode: function(x,y){
		this.explodeSound.play();
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
			this.tweenPointer.start();
			this.bulletSound.play();
			this.bulletTime = game.time.now + 2000;
			var x = this.player.x - 4;
			var y = this.player.y - 15;
			var bullet = this.bullets.create(x,y,'bullet');
				bullet.anchor.set(.5);
				bullet.body.velocity.y = -500;
				bullet.checkWorldBounds = true;
				bullet.outOfBoundsKill = true;
				
			this.player.canShoot = false;
			game.time.events.add(2000,function(){
				this.player.canShoot = true;
			},this);
		}
	},
	
	backToMenu: function(){
		this.music.stop();
		if(this.tryAgain){
			game.state.start('lvl2');
		} else {
			game.state.start('menu');
		}
	}
};
