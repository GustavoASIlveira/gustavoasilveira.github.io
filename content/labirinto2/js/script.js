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
	var zombies = [];
	var messages = [];
	var score = 0;
	var scoreToWin = 0;
	var hero = null;
	var endGame = false;
	
	//objetos do jogo
	//objetos timer e score
	var timer = new GameTimer(70);
	
	//Cronômetro
	timerMessage = new MessageObject(cnv.width/2 + 10,5,"TIME: ","#E6E6FA");
	messages.push(timerMessage);
	
	//score
	scoreMessage = new MessageObject(10,5,"ORBS: 00","#E6E6FA");
	messages.push(scoreMessage);
	
	//game over message
	var gameOverMessage = new MessageObject(0,cnv.height/2,"","#fff");
	gameOverMessage.visible = false;
	messages.push(gameOverMessage);
	
	//teste de loading ------
	var v1 = v2 = color = 0;
	var one = true;
	//fim do teste de loading
		
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
	
	var zombieImg = new Image();
	zombieImg.addEventListener('load',loadHandler,false);
	zombieImg.src = "img/zombieimg.png";
	assetsToLoad.push(zombieImg);
	
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
			setTimeout(function(){gameState = START;},3300);
		}
	}
	
	//mapa do jogo
	var map = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,2,2,0,0,0,2,0,2,0,0,0,0,0,0,0,0,2,1,2,0],
		[0,2,2,1,0,1,1,1,1,0,1,0,1,1,1,0,1,2,2,0,0],
		[0,0,1,1,2,0,0,2,1,0,1,0,1,2,2,0,1,1,1,0,0],
		[0,0,0,1,1,1,0,0,0,2,1,0,0,3,0,0,0,0,0,0,0],
		[0,0,0,0,2,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0,0],
		[0,0,1,0,2,1,1,0,2,2,2,1,1,0,1,1,0,1,2,0,0],
		[0,2,1,0,3,0,0,0,0,0,0,0,0,0,0,0,0,1,2,0,0],
		[0,0,1,0,2,1,1,0,1,1,0,1,1,0,2,1,0,1,1,0,0],
		[0,2,0,0,2,1,2,0,1,2,0,2,1,0,2,1,0,0,0,0,0],
		[0,1,1,1,1,1,2,0,0,0,4,0,0,0,1,1,1,1,0,1,0],
		[0,2,2,0,2,1,2,0,1,2,0,2,1,0,2,1,2,0,0,2,0],
		[0,2,2,1,0,1,1,0,1,1,0,1,1,0,2,1,0,0,0,0,0],
		[0,1,0,1,0,0,0,3,0,0,0,0,0,0,0,0,0,1,1,2,0],
		[0,0,0,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0],
		[0,0,0,0,0,2,1,0,1,2,0,2,1,0,0,1,0,1,1,2,0],
		[0,2,1,0,1,0,1,0,1,0,1,0,0,3,0,0,0,0,0,0,0],
		[0,0,1,2,0,0,0,0,1,0,1,0,1,0,1,0,1,1,1,0,0],
		[0,2,1,1,1,0,1,0,1,0,1,0,1,0,1,2,2,1,1,0,0],
		[0,0,2,0,2,0,1,2,2,2,1,2,0,2,1,2,2,0,0,2,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];
	
	//constantes para a renderização do mapa
	var MAPCELLSIZE = 36, OBJECTSIZE = 28;
	var EMPTY = 0, WALL = 1, ORB = 2, ZOMBIE = 3, HERO = 4;
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
	//previne a movimentação do fundo da tela
	window.addEventListener('touchmove',function(e){
		e.preventDefault();
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
				if(gameState === START && !endGame){
					gameState = BUILD_MAP;
				} else 
				if(endGame){
					restartGame();
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
						case ZOMBIE:
							var zmb = new EnemyObject(zombieImg,0,0,OBJECTSIZE,OBJECTSIZE,posX + (MAPCELLSIZE/2) - OBJECTSIZE/2, posY + (MAPCELLSIZE/2) - OBJECTSIZE/2);
							zmb.speed = 1;
							zmb.hunt = trueOrFalse();
							sprites.push(zmb);
							zombies.push(zmb);
							break;
						case HERO:
							hero = new HeroObject(heroImg,0,0,OBJECTSIZE,OBJECTSIZE,posX + (MAPCELLSIZE/2) - OBJECTSIZE/2, posY + (MAPCELLSIZE/2) - OBJECTSIZE/2);
							sprites.push(hero);
							break;
					}
				}
			}
		}
		scoreToWin = orbs.length;
		gameState = PLAYING;
	}//fim da função buildMap
	
	//funções básicas !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
	function loop(){
		//analisar o estado do jogo
		switch(gameState){
			case LOADING:
				loadingAnim();
				break;
			case START:
				ctx.drawImage(startImg,0,0,cnv.width,cnv.height,0,0,cnv.width,cnv.height);
				break;
			case BUILD_MAP:
				buildMap(map);
				break;
			case PLAYING:
				if(!timer.isOn){
					timer.start();
				}
				window.requestAnimationFrame(render,cnv);
				update();
				break;
			case OVER:
				gameOver();
				break;
		}//fim da análise do estado do jogo
	}
	
	//função principal de atualização dos elementos ---------------->
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
		
		hero.x += hero.vx;
		hero.y += hero.vy;
		
		//aplica o movimento e mantém o personagem dentro das fronteiras do jogo
		hero.x = Math.max(MAPCELLSIZE,Math.min(hero.x + hero.vx,gameWorld.width - hero.width - MAPCELLSIZE));
		hero.y = Math.max(MAPCELLSIZE,Math.min(hero.y + hero.vy,gameWorld.height - hero.height - MAPCELLSIZE));
		
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
		
		//testa colisão com as paredes do labirinto
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
					scoreUpdate();
					i--;
				}
			}
		}
		
		//movendo os zumbis
		for(var i in zombies){
			var zombie = zombies[i];
			//atualiza a posição do zumbi
			zombie.x += zombie.vx;
			zombie.y += zombie.vy;
			//confere se está em uma encruzilhada
			if(Math.floor(zombie.x - 4) % MAPCELLSIZE === 0 && Math.floor(zombie.y - 4) % MAPCELLSIZE === 0 ){				
				changeDirection(zombie);
			}
			//animação do zumbi
			zombie.countAnim++;
			if(zombie.countAnim >= 32){
				zombie.countAnim = 0;
			}
			zombie.srcX = Math.floor(zombie.countAnim / 8) * zombie.width;
			if(hitTestRectangle(hero,zombie)){
				gameState = OVER;
			}
		}
		//atualização do cronômetro
		timerUpdate();
	}//fim do update ------------------------------------------------------>
	
	//função de renderização do jogo -------------------------------------->
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
		
		//Exibindo as mensagens
		if(messages.length > 0){
			for(var i in messages){
				var msg = messages[i];
				if(msg.visible){
					ctx.font = msg.font;
					ctx.fillStyle = msg.color;
					ctx.textBaseline = msg.textBaseline;
					ctx.fillText(msg.text,msg.x,msg.y);
				}
			}
		}
		
	}//fim da função de renderização do jogo ------------------------------->
	
	var game = setInterval(loop,33);
	
	//funções extras -------------------------
	//função para remover objetos de um array
	function removeObject(objectToRemove, array){
		var i = array.indexOf(objectToRemove);
		if(i !== -1){
			array.splice(i,1);
		}
	}
	
	//função para animação do loading
	function loadingAnim(){
		if(one){
			v2 += 0.02;	
			if(v2 >= 1.98){
				one = false;
				v1 = 0;
			}				
		} else {
			v1+= 0.02;
			if(v1 >= 1.98){
				one = true;
				v2 = 0;
				color++;
				if(color >= 5){
					color = 0;
				}
			}
		}
		ctx.clearRect(0,0,cnv.width,cnv.height);
		ctx.beginPath();
		ctx.arc(cnv.width/2,cnv.height/2,30,v1 * Math.PI,v2 * Math.PI);
		switch(color){
			case 0:
				ctx.strokeStyle = "#f00";
				break;
			case 1:
				ctx.strokeStyle = "#ff0";
				break;
			case 2:
				ctx.strokeStyle = "#0f0";
				break;
			case 3:
				ctx.strokeStyle = "#0ff";
				break;
			case 4:
				ctx.strokeStyle = "#00f";
				break;
			case 5:
				ctx.strokeStyle = "#f0f";
				break;
		}
		ctx.lineWidth = 15;
		ctx.stroke();
	}//fim da função para animação do loading
	
	//atualização do timer
	function timerUpdate(){
		//Adiciona um zero ao timer quando restam menos de 10 segundos
		if(timer.time < 10){
			timerMessage.text = "TIME: 0" + timer.time;
		} else {
			timerMessage.text = "TIME: " + timer.time;
		}
		//Confere se o tempo acabou
		if(timer.time === 0){
			gameState = OVER;
		}
	}
	
	//atualização do score
	function scoreUpdate(){
		score++;
		//Adiciona um zero ao score quando este for menor que 10
		if(score < 10){
			scoreMessage.text = "ORBS: 0" + score;
		} else {
			scoreMessage.text = "ORBS: " + score;
		}
		if(score >= scoreToWin){
			gameState = OVER;
		}
	}
	
	//finalização do jogo
	function gameOver(){
		if(!endGame){
			endGame = true;
			timer.stop();
			timer.isOn = false;
			if(score === scoreToWin){
				gameOverMessage.text = "YOU WIN!";
			} else {
				gameOverMessage.color = "#f00";
				gameOverMessage.text = "YOU LOSE!";
			}
			gameOverMessage.x = (cnv.width - ctx.measureText(gameOverMessage.text).width)/2;
			gameOverMessage.visible = true;
		}
		render();
	}
	
	//restaura o jogo
	function restartGame(){
		gameState = START;
		score = 0;
		timer.time = 70;
		gameOverMessage.visible = false;
		hero = null;
		zombies = [];
		orbs = [];
		sprites = [];
		walls = [];
		camera.x = (gameWorld.x + gameWorld.width/2) - camera.width/2;
		camera.y = (gameWorld.y + gameWorld.height/2) - camera.height/2;
		setTimeout(function(){
			endGame = false;
		},1000);
	}
	
	//muda a posição do zumbi
	function changeDirection(zombie){
		//limpa as configurações de movimentação do zumbi
		zombie.validDirections = [];
		zombie.direction = zombie.NONE;
		//identifica as coordenadas do zumbi no mapa (matriz)
		var zombieColumn = Math.floor(zombie.x/MAPCELLSIZE);
		var zombieRow = Math.floor(zombie.y/MAPCELLSIZE);
		//vasculha o ambiente ao redor do zumbi e preenche o array de possíveis direções a tomar
		if(zombieRow > 1){
			var above = map[zombieRow - 1][zombieColumn];
			if(above !== WALL){
				zombie.validDirections.push(zombie.UP);
			}
		}
		if(zombieRow < ROWS - 2){
			var below = map[zombieRow + 1][zombieColumn];
			if(below !== WALL){
				zombie.validDirections.push(zombie.DOWN);
			}
		}
		if(zombieColumn > 1){
			var left = map[zombieRow][zombieColumn - 1];
			if(left !== WALL){
				zombie.validDirections.push(zombie.LEFT);
			}
		}
		if(zombieColumn < COLUMNS - 2){
			var right = map[zombieRow][zombieColumn + 1];
			if(right !== WALL){
				zombie.validDirections.push(zombie.RIGHT);
			}
		}
		//identifica se o zumbi está em uma encruzilhada
		if(zombie.validDirections.length > 0){
			var upOrDownPassage = (zombie.validDirections.indexOf(zombie.UP) !== -1 || zombie.validDirections.indexOf(zombie.DOWN) !== -1);
			var leftOrRightPassage = (zombie.validDirections.indexOf(zombie.LEFT) !== -1 || zombie.validDirections.indexOf(zombie.RIGHT) !== -1);
			//caso seja uma encruzilhada, altera a direção do zumbi
			if(upOrDownPassage && leftOrRightPassage || zombie.validDirections.length === 1){
				//modo de perseguição
				if(zombie.hunt){
					findHero(zombie);
				}
				if(zombie.direction === zombie.NONE){
					var randNumber = Math.floor(Math.random() * zombie.validDirections.length);
					zombie.direction = zombie.validDirections[randNumber];
				}
				//aplica a direção do zumbi
				switch(zombie.direction){
						case zombie.RIGHT:
							zombie.vx = zombie.speed;
							zombie.vy = 0;
							zombie.srcY = zombie.height * 2;
							break;
						case zombie.LEFT:
							zombie.vx = -zombie.speed;
							zombie.vy = 0;
							zombie.srcY = zombie.height * 1;
							break;
						case zombie.UP:
							zombie.vx = 0;
							zombie.vy = -zombie.speed;
							zombie.srcY = zombie.height * 3;
							break;
						case zombie.DOWN:
							zombie.vx = 0;
							zombie.vy = zombie.speed;
							zombie.srcY = zombie.height * 0;
							break;
				}
			}
			
		}
	}//fim de changeDirection
	
	//função busca o herói
	function findHero(zombie){
		var closestDirection = undefined;
		
		//calcula a distância entre o zumbi e o heroi
		var vx = hero.centerX() - zombie.centerX();
		var vy = hero.centerY() - zombie.centerY();
		
		//avalia se a distância é maior em x ou y
		if(Math.abs(vx) >= Math.abs(vy)){
			//avalia direita ou esquerda
			if(vx > 0){
				closestDirection = zombie.RIGHT;
			} else {
				closestDirection = zombie.LEFT;
			}
		} else {
			//avalia para cima ou para baixo
			if(vy > 0){
				closestDirection = zombie.DOWN;
			} else {
				closestDirection = zombie.UP;
			}
		}
		
		//confere se a direção encoutrada encontra-se ente as direções válidas
		for(var i in zombie.validDirections){
			if(closestDirection === zombie.validDirections[i]){
				zombie.direction = closestDirection;
			}
		}
	}
	
	function trueOrFalse(){
		var number = Math.floor(Math.random() * 10)+1;
		if(number < 7){
			return false;
		}
		return true;
	}
	
}());










