//classe Sprite
var SpriteObject = function(img,srcX,srcY,width,height,x,y){
	this.img = img;
	this.srcX = srcX;
	this.srcY = srcY;
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
}

SpriteObject.prototype.centerX = function(){
	return this.x + (this.width/2);
}

SpriteObject.prototype.centerY = function(){
	return this.y + (this.height/2);
}

SpriteObject.prototype.halfWidth = function(){
	return this.width/2;
}

SpriteObject.prototype.halfHeight = function(){
	return this.height/2;
}

//classe Hero -> herda de Sprite
var HeroObject = function(img,srcX,srcY,width,height,x,y){
	SpriteObject.call(this,img,srcX,srcY,width,height,x,y);
	this.speed = 2;
	this.vx = 0;
	this.vy = 0;
	this.countAnim = 0;
}

HeroObject.prototype = Object.create(SpriteObject.prototype);

//class Enemy -> herda de Hero
var EnemyObject = function(img,srcX,srcY,width,height,x,y){
	HeroObject.call(this,img,srcX,srcY,width,height,x,y);
	this.NONE = 0;
	this.UP = 1;
	this.DOWN = 2;
	this.LEFT = 3;
	this.RIGHT = 4;
	this.validDirections = [];
	this.direction = this.NONE;
	this.hunt = true;
	this.mkNoise = false;
}

EnemyObject.prototype = Object.create(HeroObject.prototype);

//classe Timer
var GameTimer = function(time){
	this.time = time;
	this.interval = undefined;
	this.isOn = false;
}

GameTimer.prototype.start = function(){
	var self = this;
	this.interval = setInterval(function(){
		self.tic();
	},1000);
	this.isOn = true;
}

GameTimer.prototype.tic = function(){
	this.time--;
}

GameTimer.prototype.reset = function(){
	this.time = 0;
	this.isOn = false;
}

GameTimer.prototype.stop = function(){
	clearInterval(this.interval);
	this.isOn = false;
}

//classe Mesage
var MessageObject = function(x,y,text,color){
	this.x = x;
	this.y = y;
	this.visible = true;
	this.text = text;
	this.font = "normal bold 15px emulogic";
	this.color = color;
	this.textBaseline = "top";
}






