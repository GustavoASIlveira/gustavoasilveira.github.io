(function(){
	var 
	cnv = document.querySelector('#gamecnv'),
	ctx = cnv.getContext('2d'),
	scoreCnv = document.querySelector('#scorecnv'),
	scoreCtx = scoreCnv.getContext('2d');
	//botões
	btnLeft = document.querySelector('#left'),
	btnTop = document.querySelector('#top'),
	btnRight = document.querySelector('#right'),
	btnDown = document.querySelector('#down');
	//configurações do texto
	scoreCtx.font = "normal bold 15px emulogic";
	scoreCtx.textBaseline = "top";
	
	
	//Variáveis úteis
	var SIZE = 36, EMPTY = 1, WALL = 2; CRYSTAL = 3, OBJECTS = 4;
	var sprites = [];
	var walls = [];
	var keys = [];
	var clocks = [];
	var hero = null;
	var exit = null;
	var score = 0;
	
	//estados do jogo
	var LOADING = 0,SPLASH = 1,SELECT_MAP = 2,BUILD_MAP = 3, PLAYING = 4,OVER = 5;
	var gameState = LOADING;
	
	//teclas
	var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
	
	//direções para movimentação
	var mvLeft = mvUp = mvRight = mvDown = false;

	
	//Mapa do jogo
	var map = [
		[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
		[2,4,3,2,2,3,3,2,2,3,3,2,2,3,3,2,2,3,3,2,3,3,3,1,1,1,1,1,1,1,1,2,2,3,3,2,2,3,4,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,4,3,3,2,2,2,2,2,2,1,1,2,1,1,1,1,1,1,1,2],
		[2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1,1,1,1,1,1,1,2,1,2,2,2,2,2,1,2],
		[2,1,2,4,1,1,1,1,1,1,1,1,2,2,2,3,3,2,1,1,1,1,2,2,1,1,2,2,2,2,2,2,1,2,2,1,1,1,1,2],
		[2,1,2,3,3,2,2,2,2,2,2,3,3,3,2,1,2,2,1,1,1,1,2,2,1,1,1,1,1,1,1,2,1,3,2,1,2,1,3,2],
		[2,1,2,2,2,2,3,3,3,3,2,3,3,3,2,1,2,2,2,1,2,1,2,2,2,2,2,2,2,1,1,2,1,3,2,1,2,1,3,2],
		[2,1,1,1,1,1,3,3,3,3,2,2,2,1,2,3,3,2,2,1,2,1,3,2,1,1,1,1,1,1,1,2,1,2,2,1,2,1,2,2],
		[2,1,2,2,2,2,3,3,3,3,1,1,2,1,2,3,3,2,3,1,2,1,3,2,1,1,2,2,2,2,2,2,1,2,2,1,2,1,2,2],
		[2,1,2,3,3,2,2,2,2,2,2,1,2,1,2,2,1,2,3,1,2,1,2,2,1,1,1,1,1,1,1,2,1,3,2,1,2,3,3,2],
		[2,1,2,1,1,1,1,1,1,2,3,3,2,1,2,2,1,2,1,2,2,1,2,2,2,2,2,2,2,1,1,2,1,3,2,1,2,3,3,2],
		[2,1,2,4,2,2,2,2,1,2,2,2,2,1,2,3,3,2,1,2,2,1,3,2,3,3,3,3,3,1,1,2,1,1,1,1,2,3,3,2],
		[2,1,2,2,2,1,1,1,1,2,3,3,1,1,2,3,3,2,3,3,2,1,3,2,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,2],
		[2,1,1,3,2,1,1,1,1,2,2,2,1,1,2,2,1,2,3,3,2,1,1,1,1,1,1,1,1,1,1,3,3,2,1,1,1,1,3,2],
		[2,1,1,3,2,1,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,1,1,2,1,1,2,2,2,2,2,2,2,1,2,2,1,2,2],
		[2,2,1,2,2,1,1,3,2,3,3,3,1,1,1,1,1,1,1,1,3,3,3,1,2,1,1,1,1,1,1,2,1,1,1,2,3,1,2,2],
		[2,2,1,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,3,2,2,1,2,2,2,2,2,1,1,2,1,2,1,2,3,1,1,2],
		[2,3,1,3,2,3,1,1,1,1,1,1,1,1,1,1,1,1,3,2,3,3,3,3,2,3,1,1,1,1,1,2,1,2,1,2,2,2,1,2],
		[2,3,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,4,2,3,2,3,2,2,2,3,3,2,1,2,1,1,2,2,1,2],
		[2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,2,3,2,3,2,2,2,3,2,2,2,2,1,2,1,1,2,1,1,2],
		[2,2,1,2,2,2,3,3,2,2,2,2,2,2,1,2,1,2,1,3,3,3,1,1,1,1,2,1,1,1,1,1,1,2,2,2,2,1,2,2],
		[2,3,1,3,2,2,2,2,2,2,3,3,2,2,1,2,1,2,1,2,2,2,2,2,2,1,2,1,2,2,2,2,1,2,3,2,1,1,3,2],
		[2,3,1,3,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,3,2,1,1,1,1,1,1,1,2,3,3,1,1,2,1,2,1,2,2,2],
		[2,2,1,2,2,1,2,2,2,2,2,2,2,2,3,2,1,1,1,3,2,1,1,1,1,1,1,1,2,3,3,2,1,1,1,2,1,1,1,2],
		[2,2,1,2,2,1,2,3,3,3,3,1,1,2,3,2,3,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2],
		[2,1,1,1,2,1,2,4,3,3,3,2,1,2,3,2,2,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[2,1,2,1,2,1,2,2,2,2,2,2,1,2,3,2,2,1,1,2,2,2,2,1,1,1,2,2,2,2,1,1,2,1,1,2,2,2,2,2],
		[2,1,2,1,2,1,2,2,3,3,3,2,1,2,2,2,1,1,2,1,1,1,1,1,2,3,3,2,1,1,1,1,2,1,1,1,2,3,4,2],
		[2,1,2,1,2,1,1,1,1,1,1,1,1,2,3,3,1,2,1,1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,1,2,3,3,2],
		[2,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,3,3,2,2,3,3,2,2,3,1,1,2,3,3,1,1,1,2,2,1,2],
		[2,1,2,1,1,1,1,1,2,3,3,2,3,1,1,1,1,2,1,3,3,1,1,3,3,1,2,2,2,1,2,2,2,2,2,1,1,2,1,2],
		[2,1,2,1,1,1,1,1,2,3,3,2,2,1,3,2,1,2,1,2,2,3,3,2,2,1,2,1,1,1,1,1,3,3,2,1,1,2,1,2],
		[2,1,2,2,2,2,2,1,2,1,1,1,2,1,3,2,1,2,3,2,2,3,3,2,2,3,2,1,1,2,2,2,2,2,2,1,2,2,1,2],
		[2,1,2,3,3,3,2,1,2,1,1,1,2,1,2,2,1,2,3,1,1,1,1,1,1,3,2,1,1,2,3,3,1,1,2,1,2,3,3,2],
		[2,1,1,3,3,3,2,1,2,1,2,1,2,1,2,3,1,3,2,2,1,2,2,1,2,2,2,1,1,2,3,3,2,1,1,1,2,3,3,2],
		[2,2,2,2,2,2,2,1,2,1,2,1,2,1,2,3,1,3,2,2,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,1,1,1,1,2],
		[2,4,3,2,1,1,1,1,1,1,2,1,2,1,2,2,1,2,2,2,2,2,2,2,1,1,1,1,2,3,3,2,1,1,1,1,2,2,2,2],
		[2,3,3,2,1,2,1,1,1,1,2,3,2,3,3,2,3,3,3,2,3,3,3,1,1,1,2,2,2,3,3,2,1,2,2,2,2,3,3,2],
		[2,3,3,1,1,2,3,3,2,2,2,3,2,3,3,2,3,3,4,2,4,3,3,2,2,1,1,1,1,3,3,2,1,1,1,1,1,3,3,2],
		[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
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
	
	var imgMap1 = new Image();
	imgMap1.src = "img/map1.png";
	
	
	//Funções auxiliares
	
	//construtor do mapa
	function buildMap(levelMap){
		//número de linhas e colunas
		var ROWS = levelMap.length;
		var COLUMNS = levelMap[0].length;
		
		//número de objetos que podem ser herói, saída ou ampulheta
		var n = 11;
		
		//determina a posição do herói e da saída
		var charPosit = Math.floor(Math.random() * n);
		var exitPosit = Math.floor(Math.random() * n);
		if(exitPosit === charPosit){
			while(exitPosit === charPosit){
				exitPosit = Math.floor(Math.random() * n);
			}
		}
		//contador de posições
		var countPosit = 0;
		
		for(var row = 0; row < ROWS; row++){
			var invertedRow = (row - (ROWS - 1)) * -1;
			
			for(var column = 0; column < COLUMNS; column++){
				var invertedColumn = (column - (COLUMNS - 1)) * -1;
				
				//mapa 1 (igual à matriz)	-> levelMap[row][column];
				//mapa 2 (90° espelhada)	-> levelMap[column][row];
				//mapa 3 (matriz a 180°)	-> levelMap[invertedRow][invertedColumn];
				//mapa 4 (270° espelhada)	-> levelMap[invertedColumn][invertedRow];
				//mapa 5 (matriz espelhada)	-> levelMap[row][invertedColumn];
				//mapa 6 (matriz a 270°)	-> levelMap[column][invertedRow];
				//mapa 7 (matriz a 90°)		-> levelMap[invertedColumn][row];
				//mapa 8 (180° espelhada)	-> levelMap[invertedRow][column];
				var tile = levelMap[row][column];
				if(tile !== EMPTY){
					//Determina a coordenada da imagem a ser capturada no spritesheet
					switch(tile){
						case WALL:
							var wall = new SpriteObject(0,0,SIZE,SIZE,column * SIZE,row * SIZE);
							walls.push(wall);
							break;
						case CRYSTAL:
							var keySprite = new SpriteObject(28,0,28,28,(column * SIZE)+4,(row * SIZE)+4);
							sprites.push(keySprite);
							keys.push(keySprite);
							break;
						case OBJECTS:
							switch(countPosit){
								case charPosit:
									hero = new Hero(0,28,28,28,(column * SIZE)+4,(row * SIZE)+4);
									sprites.push(hero);
									break;
								case exitPosit:
									exit = new SpriteObject(0,0,28,28,(column * SIZE)+4,(row * SIZE)+4);
									sprites.push(exit);
									break;
								default:
									var clock = new SpriteObject(56,0,20,28,(column * SIZE)+8,(row * SIZE)+4);
									clocks.push(clock);
									sprites.push(clock);
									break;
							}
							countPosit++;
							
					}
				}
			}
		}
	}//fim do construtor do mapa
	
	//constroi o mapa
	buildMap(map);
	
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
		window.requestAnimationFrame(render,cnv);
		update();
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
			if(hero.countAnim >= 16){
				hero.countAnim = 0;
			}
		} else {
			hero.countAnim = 0;
		}
		hero.srcX = Math.floor(hero.countAnim / 4) * hero.width;
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
		
		//teste colisão com os orbs
		for(var i in keys){
			var orb = keys[i];
			if(keys.length > 0){
				if(hitTestRectangle(hero,orb)){
					removeObject(orb,keys);
					removeObject(orb,sprites);
					score++;
					renderScore();
					i--;
				}
			}
		}
	}//fim do update
	
	function renderScore(){
		scoreCtx.fillStyle = "#000";
		scoreCtx.fillRect(0,0,scoreCnv.width,scoreCnv.height);
		scoreCtx.drawImage(img,28,0,28,28,10,5,20,20);
		scoreCtx.fillStyle = "#ccf";
		scoreCtx.fillText(chkScore(score),35,10);
	}
	
	function render(){
		ctx.save();
		ctx.translate(-camera.x,-camera.y);
		ctx.drawImage(imgMap1,0,0,imgMap1.width,imgMap1.height,0,0,imgMap1.width,imgMap1.height);
		if(sprites.length !== 0){
			for(var i in sprites){
				var sprite = sprites[i];
				ctx.drawImage(img,sprite.srcX,sprite.srcY,sprite.width,sprite.height,sprite.x,sprite.y,sprite.width,sprite.height);
			}
		}
		ctx.restore();
	}
	
	//Função para remover objetos de um array
	function removeObject(objectToRemove, array){
		var i = array.indexOf(objectToRemove);
		if(i !== -1){
			array.splice(i,1);
		}
	}
	var game = setInterval(loop,33,true);
	renderScore();
}());
























