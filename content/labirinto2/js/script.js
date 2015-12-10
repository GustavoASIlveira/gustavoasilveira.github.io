(function(){
	//canvas
	var cnv = document.querySelector('canvas');
	//contexto de renderização
	var ctx = cnv.getContext('2d');
	
	//botões
	var btnLeft = document.querySelector('#left');
	var btnRight = document.querySelector('#right');
	var btnUp = document.querySelector('#up');
	var btnDown = document.querySelector('#down');
	
	//recursos do jogo
	var assetsToLoad = [];
	var loadedAssets = 0;
	var sprites = [];
	var walls = [];
	var orbs = [];
	var score = 0;
	var hero = null;
	
	//estados do jogo
	var LOADING = 0;
	var START = 1;
	var BUILD_MAP = 2;
	var PLAYING = 3;
	var OVER = 4;
	var gameState = LOADING;
	
	//código das teclas
	var ENTER = 13, LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	
	//direções
	var mvLeft = mvUp = mvRight = mvDown = false;
	
	//imagens
	var mapImg = new Image();
	mapImg.addEventListener('load',loadHandler,false);
	mapImg.src = "img/mapimg.png";
	assetsToLoad.push(mapImg);
	
	var heroImg = new Image();
	heroImg.addEventListener('load',loadHandler,false);
	heroImg.src = "img/heroimg.png";
	assetsToLoad.push(heroImg);
	
	var orbImg = new Image();
	orbImg.addEventListener('load',loadHandler,false);
	orbImg.src = "img/orbimg.png";
	assetsToLoad.push(orbImg);
	
	var startImg = new Image();
	startImg.addEventListener('load',loadHandler,false);
	startImg.src = "img/startimg.png";
	assetsToLoad.push(startImg);
	
	//função para exibir a tela inicial
	function loadHandler(){
		loadedAssets++;
		if(loadedAssets === assetsToLoad.length){
			for(var i in assetsToLoad){
				var image = assetsToLoad[i];
				image.removeEventListener('load',loadHandler,false);
			}
			gameState = START;
		}
	}
	
	//mapa do jogo
	var map = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,2,2,0,0,0,2,0,2,0,0,0,0,0,0,0,0,2,1,2,0],
		[0,2,2,1,0,1,1,1,1,0,1,0,1,1,1,0,1,2,2,0,0],
		[0,0,1,1,2,0,0,2,1,0,1,0,1,2,2,0,1,1,1,0,0],
		[0,0,0,1,1,1,0,0,0,2,1,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,2,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0,0],
		[0,0,1,0,2,1,1,0,2,2,2,1,1,0,1,1,0,1,2,0,0],
		[0,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,0,0],
		[0,0,1,0,2,1,1,0,1,1,0,1,1,0,2,1,0,1,1,0,0],
		[0,2,0,0,2,1,2,0,1,2,0,2,1,0,2,1,0,0,0,0,0],
		[0,1,1,1,1,1,2,0,0,0,3,0,0,0,1,1,1,1,0,1,0],
		[0,2,2,0,2,1,2,0,1,2,0,2,1,0,2,1,2,0,0,2,0],
		[0,2,2,1,0,1,1,0,1,1,0,1,1,0,2,1,0,0,0,0,0],
		[0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,0],
		[0,0,0,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0],
		[0,0,0,0,0,2,1,0,1,2,0,2,1,0,0,1,0,1,1,2,0],
		[0,2,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
		[0,0,1,2,0,0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,0],
		[0,2,1,1,1,0,1,0,1,0,1,0,1,0,1,2,2,1,1,0,0],
		[0,0,2,0,2,0,1,2,2,2,1,2,0,2,1,2,2,0,0,2,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];
	
	//constantes para a renderização do mapa
	var MAPCELLSIZE = 36, OBJECTSIZE = 28;
	var EMPTY = 0, WALL = 1, ORB = 2, HERO = 3;
	var ROWS = map.length;
	var COLUMNS = map[0].length;
	
	//elementos de controle da câmera
	var gameWorld = {
		x: 0,
		y: 0,
		width: COLUMNS * MAPCELLSIZE,
		height: ROWS * MAPCELLSIZE
	};
	
	var camera = {
		x: 0,
		y: 0,
		width: cnv.width,
		height: cnv.height,
		//funções para determinar os limites internos da câmera
		rightInnerBoundary: function(){
			return this.x + (this.width * 0.75);
		},
		leftInnerBoundary: function(){
			return this.x + (this.width * 0.25);
		},
		topInnerBoundary: function(){
			return this.y + (this.height * 0.25);
		},
		bottomInnerBoundary: function(){
			return this.y + (this.height * 0.75);
		}
	};
	
	//posicionamento inicial da câmera
	camera.x = (gameWorld.x + gameWorld.width/2) - camera.width/2;
	camera.y = (gameWorld.y + gameWorld.height/2) - camera.height/2;
	
	//entradas do jogador
	//teclado
	window.addEventListener('keydown',function(e){
		e.preventDefault();
		keydownHandler(e.keyCode);
	},false);
	window.addEventListener('keyup',function(e){
		e.preventDefault();
		keyupHandler(e.keyCode);
	},false);
	
	//toque na tela - entrada
	btnLeft.addEventListener('touchstart',function(e){
		e.preventDefault();
		keydownHandler(37);
	},false);
	
	btnRight.addEventListener('touchstart',function(e){
		e.preventDefault();
		keydownHandler(39);
	},false);
	
	btnUp.addEventListener('touchstart',function(e){
		e.preventDefault();
		keydownHandler(38);
	},false);
	
	btnDown.addEventListener('touchstart',function(e){
		e.preventDefault();
		keydownHandler(40);
	},false);
	
	cnv.addEventListener('touchstart',function(e){
		keyupHandler(13);
	},false);
	
	//toque na tela - saída
	btnLeft.addEventListener('touchend',function(e){
		e.preventDefault();
		keyupHandler(37);
	},false);
	
	btnRight.addEventListener('touchend',function(e){
		e.preventDefault();
		keyupHandler(39);
	},false);
	
	btnUp.addEventListener('touchend',function(e){
		e.preventDefault();
		keyupHandler(38);
	},false);
	
	btnDown.addEventListener('touchend',function(e){
		e.preventDefault();
		keyupHandler(40);
	},false);
	
	//movimentos
	function keydownHandler(key){
		switch(key){
			case LEFT:
				mvLeft = true
				break;
			case UP:
				mvUp = true;
				break;
			case RIGHT:
				mvRight = true;
				break;
			case DOWN:
				mvDown = true;
				break;
		}
	}
	
	function keyupHandler(key){
		switch(key){
			case LEFT:
				mvLeft = false
				break;
			case UP:
				mvUp = false;
				break;
			case RIGHT:
				mvRight = false;
				break;
			case DOWN:
				mvDown = false;
				break;
			case ENTER:
				if(gameState === START){
					gameState = BUILD_MAP;
				}
				break;
		}
	}
	
	//funções do jogo
	function buildMap(levelMap){
		for(var row = 0; row < ROWS; row++){
			for(var column = 0; column < COLUMNS; column++){
				var currentTile = levelMap[row][column];
				var posX = column * MAPCELLSIZE;
				var posY = row * MAPCELLSIZE;
				if(currentTile !== EMPTY){
					switch(currentTile){
						case WALL:
							var wall = new SpriteObject(null,0,0,MAPCELLSIZE,MAPCELLSIZE,posX,posY);
							walls.push(wall);
							break;
						case ORB:
							var orb = new SpriteObject(orbImg,0,0,20,20,posX + (MAPCELLSIZE/2) - 10, posY + (MAPCELLSIZE/2) - 10);
							sprites.push(orb);
							orbs.push(orb);
							break;
						case HERO:
							hero = new HeroObject(heroImg,0,0,OBJECTSIZE,OBJECTSIZE,posX + (MAPCELLSIZE/2) - OBJECTSIZE/2, posY + (MAPCELLSIZE/2) - OBJECTSIZE/2);
							sprites.push(hero);
							break;
					}
				}
			}
		}
	}//fim da função buildMap
	
	//funções básicas
	
	function loop(){
		//analisar o estado do jogo
		switch(gameState){
			case LOADING:
				ctx.fillStyle = "#fff";
				ctx.fillText("LOADING...",50,50);
				break;
			case START:
				ctx.drawImage(startImg,0,0,cnv.width,cnv.height,0,0,cnv.width,cnv.height);
				break;
			case BUILD_MAP:
				buildMap(map);
				gameState = PLAYING;
				break;
			case PLAYING:
				window.requestAnimationFrame(render,cnv);
				update();
				break;
			case OVER:
				break;
		}//fim da análise do estado do jogo
	}
	
	function update(){
		//atualização da posição do personagem
		hero.vx = hero.vy = 0;
		if(mvLeft && !mvRight){
			hero.vx = -hero.speed;
			hero.srcY = hero.height * 1;
		}
		if(mvRight && !mvLeft){
			hero.vx = hero.speed;
			hero.srcY = hero.height * 2;
		}
		if(mvUp && !mvDown){
			hero.vy = -hero.speed;
			hero.srcY = hero.height * 3;
		}
		if(mvDown && !mvUp){
			hero.vy = hero.speed;
			hero.srcY = hero.height * 0;
		}
		
		//animação do personagem
		if(mvLeft || mvRight || mvDown || mvUp){
			hero.countAnim++;
			if(hero.countAnim >= 16){
				hero.countAnim = 0;
			}
		} else {
			hero.countAnim = 0;
		}
		hero.srcX = Math.floor(hero.countAnim / 4) * hero.width;
		hero.x += hero.vx;
		hero.y += hero.vy;
		
		//aplica o movimento e mantém o personagem dentro das fronteiras do jogo
		hero.x = Math.max(MAPCELLSIZE,Math.min(hero.x + hero.vx,gameWorld.width - hero.width - MAPCELLSIZE));
		hero.y = Math.max(MAPCELLSIZE,Math.min(hero.y + hero.vy,gameWorld.height - hero.height - MAPCELLSIZE));
		
		//posiciona a câmera em relação ao player
		if(hero.x < camera.leftInnerBoundary()){
			camera.x = Math.floor(hero.x - (camera.width * 0.25));
		}
		if(hero.y < camera.topInnerBoundary()){
			camera.y = Math.floor(hero.y - (camera.height * 0.25));
		}
		if(hero.x + hero.width > camera.rightInnerBoundary()){
			camera.x = Math.floor(hero.x + hero.width - (camera.width * 0.75)); 
		}
		if(hero.y + hero.height > camera.bottomInnerBoundary()){
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
		
		//teste colisão com os orbs
		for(var i in orbs){
			var orb = orbs[i];
			if(orbs.length > 0){
				if(hitTestRectangle(hero,orb)){
					removeObject(orb,orbs);
					removeObject(orb,sprites);
					//score++;
					//renderScore();
					i--;
				}
			}
		}
		
	}//fim do update
	
	function render(){
		ctx.clearRect(0,0,cnv.width,cnv.height);
		ctx.save();
		ctx.translate(-camera.x,-camera.y);
		ctx.drawImage(mapImg,0,0,mapImg.width,mapImg.height,0,0,mapImg.width,mapImg.height);
		if(sprites.length > 0){
			for(var i in sprites){
				var spr = sprites[i];
				ctx.drawImage(spr.img,spr.srcX,spr.srcY,spr.width,spr.height,spr.x,spr.y,spr.width,spr.height);
			}
		}
		ctx.restore();
	}
	
	var game = setInterval(loop,33);
	
	//funções extras -------------------------
	//Função para remover objetos de um array
	function removeObject(objectToRemove, array){
		var i = array.indexOf(objectToRemove);
		if(i !== -1){
			array.splice(i,1);
		}
	}
	
	
}());
