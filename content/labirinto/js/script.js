(function(){
	var cnv = document.querySelector('canvas');
	var ctx = cnv.getContext('2d');
	
	var btnLeft = document.querySelector('#left');
	var btnTop = document.querySelector('#top');
	var btnRight = document.querySelector('#right');
	var btnDown = document.querySelector('#down');
	
	
	//Variáveis úteis
	var SIZE = 32, EMPTY = 0, GROUND = 1, WALL = 2; DOOR = 3, KEY = 4, HERO = 5;
	var sprites = [];
	var walls = [];
	var keys = [];
	var hero = null;
	
	//teclas
	var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	
	//direções
	var mvLeft = mvUp = mvRight = mvDown = false;

	
	//Mapa do jogo
	var map = [
		[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
		[2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,2],
		[2,1,2,2,1,2,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,2],
		[2,1,1,1,1,2,1,1,1,2,2,2,1,1,1,1,1,2,1,2,1,2],
		[2,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,2,2,2],
		[2,1,1,2,2,2,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,2],
		[2,1,1,1,1,1,1,1,2,2,1,1,2,1,1,1,1,1,1,1,1,2],
		[2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,2,2,2,1,1,2],
		[2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,2,2,1,1,1,2],
		[2,1,1,2,2,2,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2],
		[2,1,1,1,1,1,2,1,1,2,1,1,2,2,2,2,2,1,1,1,1,2],
		[2,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,2,2,2,1,2],
		[2,1,1,2,1,1,1,1,1,2,2,1,1,2,2,1,2,1,1,1,1,2],
		[2,1,1,2,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2],
		[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
	];
	
	//Mapa de elementos
	var gameElements = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
		[0,0,0,0,4,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0],
		[0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];
	
	//objetos do jogo
	//GameWorld
	var gameWorld = {
		x: 0,
		y: 0,
		width: map[0].length * SIZE,
		height: map.length * SIZE
	};
	
	//câmera
	var camera = {
		x: 0,
		y: 0,
		width: cnv.width,
		height: cnv.height,
		
		//limites internos da câmera
		rigthInnerBoudary: function(){
			return this.x + (this.width * 0.75);
		},
		leftInnerBoudary: function(){
			return this.x + (this.width * 0.25);
		},
		topInnerBoundary: function(){
			return this.y + (this.height * 0.25);
		},
		bottomInnerBoudary: function(){
			return this.y + (this.height * 0.75);
		}
	};
	
	//posicionamento inicial da câmera
	camera.x = (gameWorld.width - camera.width)/2;
	camera.y = (gameWorld.height - camera.height)/2;
	
	//imagem
	var img = new Image();
	img.src = "img/img.png";
	
	
	//Funções auxiliares
	function buildMap(levelMap){
		//número de linhas e colunas
		var ROWS = levelMap.length;
		var COLUMNS = levelMap[0].length;
		
		for(var row = 0; row < ROWS; row++){
			for(var column = 0; column < COLUMNS; column++){
				var tile = levelMap[row][column];
				if(tile !== EMPTY){
					//Determina a coordenada da imagem a ser capturada no spritesheet
					tileSrcX = Math.floor(tile - 1) * SIZE; 
					switch(tile){
						case GROUND:
							var ground = new SpriteObject(tileSrcX,0,SIZE,SIZE,column * SIZE,row * SIZE);
							sprites.push(ground);
							break;
						case WALL:
							var wall = new SpriteObject(tileSrcX,0,SIZE,SIZE,column * SIZE,row * SIZE);
							sprites.push(wall);
							walls.push(wall);
							break;
						case DOOR:
							var door = new SpriteObject(tileSrcX,0,SIZE,SIZE,column * SIZE,row * SIZE);
							sprites.push(door);
							break;
						case KEY:
							var keySprite = new SpriteObject(tileSrcX,0,SIZE,SIZE,column * SIZE,row * SIZE);
							sprites.push(keySprite);
							keys.push(keySprite);
							break;
						case HERO:
							hero = new Hero(0,32,SIZE,SIZE,column * SIZE,row * SIZE);
							sprites.push(hero);
							break;
					}
				}
			}
		}
	}
	
	//constroi o mapa
	buildMap(map);
	
	//adiciona os elementos
	buildMap(gameElements);
	
	//entradas do teclado
	window.addEventListener('keydown',function(e){
		e.preventDefault();
		moveClickDown(e.keyCode);
	},false);
	window.addEventListener('keyup',function(e){
		e.preventDefault();
		moveClickUp(e.keyCode);
	},false);
	
	//entradas do touch
	//para cima
	btnTop.addEventListener('touchstart',function(e){
		e.preventDefault();
		moveClickDown(38);
	},false);
	btnTop.addEventListener('touchend',function(e){
		e.preventDefault();
		moveClickUp(38);
	},false);
	//para baixo
	btnDown.addEventListener('touchstart',function(e){
		e.preventDefault();
		moveClickDown(40);
	},false);
	btnDown.addEventListener('touchend',function(e){
		e.preventDefault();
		moveClickUp(40);
	},false);
	//para esquerda
	btnLeft.addEventListener('touchstart',function(e){
		e.preventDefault();
		moveClickDown(37);
	},false);
	btnLeft.addEventListener('touchend',function(e){
		e.preventDefault();
		moveClickUp(37);
	},false);
	//para direita
	btnRight.addEventListener('touchstart',function(e){
		e.preventDefault();
		moveClickDown(39);
	},false);
	btnRight.addEventListener('touchend',function(e){
		e.preventDefault();
		moveClickUp(39);
	},false);
	
	//movimento
	function moveClickDown(key){
		switch(key){
			case LEFT:
				mvLeft = true;
				break;
			case RIGHT:
				mvRight = true;
				break;
			case UP:
				mvUp = true;
				break;
			case DOWN:
				mvDown = true;
				break;
		}
	}
	
	function moveClickUp(key){
		switch(key){
			case LEFT:
				mvLeft = false;
				break;
			case RIGHT:
				mvRight = false;
				break;
			case UP:
				mvUp = false;
				break;
			case DOWN:
				mvDown = false;
				break;
		}
	}
	
	//Funções básicas do jogo
	function loop(){
		window.requestAnimationFrame(loop,cnv);
		update();
		render();
	}
	
	function update(){
		hero.vx = hero.vy = 0;
		if(mvLeft && !mvRight){
			hero.vx = -hero.speed;
			hero.srcY = hero.height * 2;
		}
		if(mvRight && !mvLeft){
			hero.vx = hero.speed;
			hero.srcY = hero.height * 3;
		}
		if(mvUp && !mvDown){
			hero.vy = -hero.speed;
			hero.srcY = hero.height * 4;
		}
		if(mvDown && !mvUp){
			hero.vy = hero.speed;
			hero.srcY = hero.height * 1;
		}
		//animação do hero
		if(mvLeft || mvRight || mvDown || mvUp){
			hero.countAnim++;
			if(hero.countAnim >= 40){
				hero.countAnim = 0;
			}
		} else {
			hero.countAnim = 0;
		}
		hero.srcX = Math.floor(hero.countAnim / 10) * hero.width;
		hero.x += hero.vx;
		hero.y += hero.vy;
		
		//Mantém o personagem dentro das fronteiras do jogo
		hero.x = Math.max(SIZE,Math.min(hero.x + hero.vx,gameWorld.width - hero.width - SIZE));
		hero.y = Math.max(SIZE,Math.min(hero.y + hero.vy,gameWorld.height - hero.height - SIZE));
		
		//posiciona a câmera em relação ao player
		if(hero.x < camera.leftInnerBoudary()){
			camera.x = Math.floor(hero.x - (camera.width * 0.25));
		}
		if(hero.y < camera.topInnerBoundary()){
			camera.y = Math.floor(hero.y - (camera.height * 0.25));
		}
		if(hero.x + hero.width > camera.rigthInnerBoudary()){
			camera.x = Math.floor(hero.x + hero.width - (camera.width * 0.75)); 
		}
		if(hero.y + hero.height > camera.bottomInnerBoudary()){
			camera.y = Math.floor(hero.y + hero.height - (camera.height * 0.75)); 
		}
		
		//limitando a câmera às fronteiras do mundo
		if(camera.x < gameWorld.x){
			camera.x = gameWorld.x;
		}
		if(camera.y < gameWorld.y){
			camera.y = gameWorld.y;
		}
		if(camera.x + camera.width > gameWorld.x + gameWorld.width){
			camera.x = gameWorld.x + gameWorld.width - camera.width;
		}
		if(camera.y + camera.height > gameWorld.y + gameWorld.height){
			camera.y = gameWorld.y + gameWorld.height - camera.height;
		}
		
		//testa colisão com as paredes do labirionto
		for(var i in walls){
			var w = walls[i];
			blockRetangle(hero,w);
		}
	}
	
	function render(){
		ctx.clearRect(0,0,cnv.width,cnv.heigth);
		ctx.save();
		ctx.translate(-camera.x,-camera.y);
		if(sprites.length !== 0){
			for(var i in sprites){
				var sprite = sprites[i];
				ctx.drawImage(img,sprite.srcX,sprite.srcY,sprite.width,sprite.height,sprite.x,sprite.y,sprite.width,sprite.height);
			}
		}
		ctx.restore();
	}
	loop();
}());
























