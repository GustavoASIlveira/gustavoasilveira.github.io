var SpriteObject = function(srcX,srcY,width,height,x,y){
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

var Hero = function(srcX,srcY,width,height,x,y){
	SpriteObject.call(this,srcX,srcY,width,height,x,y);
	this.speed = 2;
	this.vx = 0;
	this.vy = 0;
	this.countAnim = 0;
}

Hero.prototype = Object.create(SpriteObject.prototype);
