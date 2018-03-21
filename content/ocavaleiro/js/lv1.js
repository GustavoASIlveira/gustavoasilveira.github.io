var Lv1State = {
	create: function(){
		this.map = game.add.tilemap('map');
		this.map.addTilesetImage('tileset01');
		this.skyLayer = this.map.createLayer('skyLayer');
		this.backgroundLayer = this.map.createLayer('backgroundLayer');
		this.blockLayer = this.map.createLayer('blockLayer');
		
		this.skyLayer.resizeWorld();
		
		this.map.setCollisionBetween(0,63,true,'blockLayer');
		
		//--> Coins
		this.coins = game.add.group();
		this.coins.enableBody = true;
		//--> Fim Coins
		
		//-- > Crates
		this.crates = game.add.group();
		this.crates.enableBody = true;
		this.map.createFromObjects('objectLayer',7,'crate',0,true,false,this.crates);
		this.crates.setAll('body.immovable',true);
		//-- > Fim Crates
		
		//--> CrateFrags
		this.crateFrag = game.add.emitter(0,0,4);
		this.crateFrag.makeParticles('crateFrag');
		this.crateFrag.setXSpeed(-50,50);
		this.crateFrag.setYSpeed(-50,50);
		this.crateFrag.gravity.y = 800;
		//--> Fim Crates
		
		//--> Player
		this.player = game.add.sprite(32,game.world.height - 100,'player');
		this.player.anchor.set(.35,.5);
		this.player.animations.add('walk',[0,1,2,3],10,true);
		this.player.animations.add('attack',[4,5,6,7],15,false);
		game.physics.arcade.enable(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.body.gravity.y = 800;
		this.player.body.setSize(10,25,6,7);
		this.player.canAttack = true;
		this.player.isAttacking = false;
		this.player.canJump = true;
		this.player.canWalk = true;
		this.player.canHit = true;
		this.player.mvLeft = false;
		this.player.mvRight = false;
		//--> Fim do Player
		
		this.attackBox = game.add.sprite(this.player.x,this.player.y,null);
		game.physics.arcade.enable(this.attackBox);
		this.attackBox.body.setSize(14,6);
		
		
		game.camera.follow(this.player);
		
		//--> CoinsFrags
		//params: posX,posY,maxPerticles
		this.coinFrag = game.add.emitter(0,0,10);
		this.coinFrag.makeParticles('part');
		this.coinFrag.setXSpeed(-50,50);
		this.coinFrag.setYSpeed(-50,50);
		this.coinFrag.gravity.y = 0;
		//--> Fim CoinsFrags
		
		//Controls
		this.controls = game.input.keyboard.createCursorKeys();
		
		//Controls -> Jump
		this.controls.up.onDown.add(function(){
			if(this.player.canJump){
				this.jump();
			}
		},this);
		
		this.controls.up.onUp.add(function(){
			this.player.canJump = true;
		},this);
		
		this.attackKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
		this.attackKey.onDown.add(function(){
			if(!this.player.isAttacking){
				this.attack();
			}
		},this);
		
		//Buttons
		this.btnLeft = game.add.button(10,260,'btnLeft');
		this.btnLeft.fixedToCamera = true;
		this.btnLeft.alpha = .5;
		this.btnLeft.onInputDown.add(function(){
			this.player.mvLeft = true;
		},this);
		this.btnLeft.onInputUp.add(function(){
			this.player.mvLeft = false;
		},this);
		
		this.btnRight = game.add.button(90,260,'btnRight');
		this.btnRight.fixedToCamera = true;
		this.btnRight.alpha = .5;
		this.btnRight.onInputDown.add(function(){
			this.player.mvRight = true;
		},this);
		this.btnRight.onInputUp.add(function(){
			this.player.mvRight = false;
		},this);
		
		this.btnJump = game.add.button(420,260,'btnJump');
		this.btnJump.fixedToCamera = true;
		this.btnJump.alpha = .5;
		this.btnJump.onInputDown.add(function(){
			this.jump();
		},this);
		this.btnJump.onInputUp.add(function(){
			this.player.canJump = true;
		},this);
		
		this.btnAttack = game.add.button(350,260,'btnAttack');
		this.btnAttack.fixedToCamera = true;
		this.btnAttack.alpha = .5;
		this.btnAttack.onInputDown.add(function(){
			if(!this.player.isAttacking){
				this.attack();
			}
		},this);
	},
	
	update: function(){
		this.attackBox.x = this.player.x + (7 * this.player.scale.x);
		this.attackBox.y = this.player.y + 2;
		
		game.physics.arcade.collide(this.player,this.blockLayer);
		game.physics.arcade.collide(this.coins,this.blockLayer);
		game.physics.arcade.collide(this.coins,this.crates);
		game.physics.arcade.collide(this.player,this.crates);
		game.physics.arcade.overlap(this.attackBox,this.crates,this.destroyCrate,null,this);
		game.physics.arcade.overlap(this.player,this.coins,this.getCoin,null,this);
		
		this.player.body.velocity.x = 0;
		
		if(this.controls.left.isDown || this.player.mvLeft){
			this.moveLeft();
		} else
		if(this.controls.right.isDown || this.player.mvRight){
			this.moveRight();
		}
		
		if(this.player.isAttacking){
			this.player.animations.play('attack');
			this.player.animations.currentAnim.onComplete.add(function(){
				this.player.isAttacking = false;
				this.player.canHit = true;
				this.player.frame = 0;
			},this);
		} else {
			if(this.player.body.velocity.x === 0){
				this.player.animations.stop();
				this.player.frame = 0;
			} 
			
			if(!this.player.body.onFloor() && !this.player.body.touching.down){
				this.player.animations.stop();
				if(this.player.body.velocity.y > 0){
					this.player.frame = 3;
				} else {
					this.player.frame = 1;
				}
			}
		}
	},
	
	moveRight: function(){
		this.move(1);
		
	},
	
	moveLeft: function(){
		this.move(-1);
	},
	
	move: function(dir){
		this.player.scale.set(1 * dir,1);
		this.attackBox.scale.set(1 * dir,1);
		if(!this.player.isAttacking || !(this.player.body.onFloor() || this.player.body.touching.down)){
			this.player.body.velocity.x = 60 * dir;
		}
		if(!this.player.isAttacking && (this.player.body.onFloor() || this.player.body.touching.down)){
			this.player.animations.play('walk');
		}
	},
	
	jump: function(){
		if(this.player.body.onFloor() || this.player.body.touching.down){
			this.player.canJump = false;
			this.player.body.velocity.y = -270;
		}
	},
	
	attack: function(){
		this.player.canWalk = false;
		this.player.canAttack = false;
		this.player.isAttacking = true;
	},
	
	destroyCrate: function(hitbox,crate){
		if(this.player.isAttacking && this.player.canHit){
			game.time.events.add(100,function(){
				this.crateFrag.x = crate.position.x;
				this.crateFrag.y = crate.position.y;
				this.crateFrag.start(true,500,null,4);
				
				//Criar moeda
				var coin = this.coins.create(crate.x,crate.y,'coin');
					coin.body.setSize(18,18,7,7);
					coin.animations.add('spin',[0,1,2,3,4],10,true).play();
					coin.body.gravity.y = 800;
					coin.body.velocity.y = -200;
					
				crate.destroy();
			},this);
			this.player.canHit = false;
		}
	},
	
	getCoin: function(player,coin){
		this.coinFrag.x = coin.x + coin.width/2;
		this.coinFrag.y = coin.y + coin.height/2;
		//Params: explode, lifespam, frequency, quantity, forceQuantity
		this.coinFrag.start(true,500,null,10);
		coin.destroy();
	},
	
	render: function(){
		/*
		game.debug.body(this.player);
		this.coins.forEach(function(coin){
			game.debug.body(coin);
		});
		*/
	}
};
