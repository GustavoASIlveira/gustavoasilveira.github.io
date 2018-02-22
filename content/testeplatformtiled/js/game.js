var tiledGame = new Phaser.Game(640,360,Phaser.CANVAS,'',{preload:preload,create:create,update:update});
var map,backgroundLayer,blockLayer,player,controls,mvLeft = mvRight = false;

function preload(){
	tiledGame.load.tilemap('map','assets/lv1.json',null,Phaser.Tilemap.TILED_JSON);
	tiledGame.load.image('walls','assets/walls.png');
	tiledGame.load.image('soda','assets/soda.png');
	tiledGame.load.spritesheet('player','assets/player.png',16,16);
	
	tiledGame.load.image('jBtn','assets/jumpButton.png');
	tiledGame.load.image('lBtn','assets/leftButton.png');
	tiledGame.load.image('rBtn','assets/rightButton.png');
}

function create(){
	tiledGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	tiledGame.scale.pageAlignHorizontally = true;
	tiledGame.scale.pageAlignVertically = true;

	tiledGame.physics.startSystem(Phaser.Physics.ARCADE);
	
	map = tiledGame.add.tilemap('map');
	map.addTilesetImage('walls');
	
	
	backgroundLayer = map.createLayer('backgroundLayer');
	blockLayer = map.createLayer('blockLayer');
	
	map.setCollisionBetween(2,2,true,'blockLayer');
	
	backgroundLayer.resizeWorld();
	
	player = tiledGame.add.sprite(25,tiledGame.world.height - 25,'player');
	player.anchor.set(.5);
	player.animations.add('walk',[0,1,2,3],10,true);
	tiledGame.physics.arcade.enable(player);
	player.body.gravity.y = 400;
	
	
	tiledGame.camera.follow(player);
	
	controls = tiledGame.input.keyboard.createCursorKeys();
	
	this.jBtn = tiledGame.add.button(520,280,'jBtn');
	this.jBtn.onInputDown.add(jump,this);
	this.jBtn.alpha = .5;
	this.jBtn.fixedToCamera = true;
	this.jBtn.cameraOffset.setTo(520,280);
	
	this.lBtn = tiledGame.add.button(20,560,'lBtn');
	this.lBtn.onInputDown.add(function(){
		mvLeft = true;
	},this);
	this.lBtn.onInputUp.add(function(){
		mvLeft = false;
	},this);
	this.lBtn.alpha = .5;
	this.lBtn.fixedToCamera = true;
	this.lBtn.cameraOffset.setTo(20,280);
	
	this.rBtn = tiledGame.add.button(120,560,'rBtn');
	this.rBtn.onInputDown.add(function(){
		mvRight = true;
	},this);
	this.rBtn.onInputUp.add(function(){
		mvRight = false;
	},this);
	this.rBtn.alpha = .5;
	this.rBtn.fixedToCamera = true;
	this.rBtn.cameraOffset.setTo(120,280);
}

function update(){
	tiledGame.physics.arcade.collide(player,blockLayer);
	
	
	
	player.body.velocity.x = 0;
	
	if(controls.right.isDown  || mvRight){
		goRight();
	} else
	if(controls.left.isDown || mvLeft){
		goLeft();
	}
	
	if(controls.up.isDown){
		jump();
	}
	
	if(player.body.velocity.x === 0){
		player.animations.stop();
		player.frame = 0;
	}
	
	if(!player.body.onFloor()){
		player.animations.stop();
		player.frame = 1;
	}
	
}

function goLeft(){
	player.body.velocity.x = -60;
	player.scale.set(-1,1);
	player.animations.play('walk');
}

function goRight(){
	player.body.velocity.x = 60;
	player.scale.set(1,1);
	player.animations.play('walk');
}

function jump(){
	if(player.body.onFloor()){
		player.body.velocity.y = -200;
	}
}
