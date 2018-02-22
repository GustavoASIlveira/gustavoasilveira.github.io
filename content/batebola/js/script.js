(function(){
	var cnv = document.createElement('canvas');
	cnv.width = document.documentElement.clientWidth;
	cnv.height = document.documentElement.clientHeight-10;
	var ctx = cnv.getContext('2d');
	document.body.appendChild(cnv);
	var sound = new Audio("sound/boing.mp3");
	
	var gravity = 0.1;
	var catX = catY = hyp = 0;
	
	//estados do jogo
	var START = 1, PLAY = 2, OVER = 3;
	var gameState = START;
	
	//pontuação
	var score = 0;
	
	//record
	var record = localStorage.getItem("record") ? localStorage.getItem("record") : 0;
	//var record = 0;
	//if(localStorage.getItem("record") !== null){
	//	record = localStorage.getItem("record");
	//}
	
	//objeto bola
	var ball = {
		radius: 20,
		vx: 0,
		vy: 0,
		x: cnv.width/2 - 10,
		y: 50,
		color: "#00f",
		touched: false,
		visible: false
	};
	
	//mensagens
	var messages = [];
	
	//mensagem inicial
	var startMesage = {
		text: "TOUCH TO START",
		y: cnv.height/2 - 100,
		font: "bold 30px Sans-Serif",
		color: "#f00",
		visible: true
	};
	
	messages.push(startMesage);
	
	//placar final
	var scoreText = Object.create(startMesage);
	scoreText.visible = false;
	scoreText.y = (cnv.height/2 + 50);
	
	messages.push(scoreText);
	
	//record
	var recordMesage = Object.create(startMesage);
	recordMesage.visible = false;
	recordMesage.y = (cnv.height/2 + 100);
	
	messages.push(recordMesage);
	
	//eventos
	cnv.addEventListener('mousedown',function(e){
		catX = ball.x - e.offsetX;
		catY = ball.y - e.offsetY;
		hyp = Math.sqrt(catX*catX + catY*catY);
		mouseDownHandler(hyp);
	},false);
	
	cnv.addEventListener('touchstart',function(e){
		catX = ball.x - e.touches[0].pageX;
		catY = ball.y - e.touches[0].pageY;
		hyp = Math.sqrt(catX*catX + catY*catY);
		mouseDownHandler(hyp);
	},false);
	
	cnv.addEventListener('mouseup',function(){
		if(gameState === PLAY){
			ball.touched = false;
		}
	},false);
	
	cnv.addEventListener('touchend',function(){
		if(gameState === PLAY){
			ball.touched = false;
		}
	},false);
	
	function mouseDownHandler(h){
		switch(gameState){
			case START:
				gameState = PLAY;
				startMesage.visible = false;
				startGame();
				break;
			case PLAY:
				if(h < ball.radius && !ball.touched){
					sound.play();
					ball.vx = Math.floor(Math.random()*21) - 10;
					ball.vy = -(Math.floor(Math.random()*6) + 5);
					ball.touched = true;
					score++;
				}
				break;
		}
	}
	
	//funções
	function loop(){
		requestAnimationFrame(loop,cnv);
		if(gameState === PLAY){
			update();
		}
		render();
	}
	
	function update(){
		//ação da gravidade e deslocamento da bolinha
		ball.vy += gravity;
		ball.y += ball.vy;
		ball.x += ball.vx;
		
		//quicar nas paredes
		if(ball.x + ball.radius > cnv.width || ball.x < ball.radius){
			if(ball.x < ball.radius){
				ball.x = ball.radius;
			} else {
				ball.x = cnv.width - ball.radius;
			}
			ball.vx *= -0.8;
		}
		
		//quicar no teto
		if(ball.y < ball.radius && ball.vy < 0){
			ball.y = ball.radius;
			ball.vy *= -1;
		}
		
		//game over
		if(ball.y - ball.radius > cnv.height){
			gameState = OVER;
			ball.visible = false;
			
			window.setTimeout(function(){
				startMesage.visible = true;
				gameState = START;
			},2000);
			
			scoreText.text = "YOUR SCORE: " + score;
			scoreText.visible = true;
			
			if(score > record){
				record = score;
				localStorage.setItem("record",record);
			}
			
			recordMesage.text = "BEST SCORE: " + record;
			recordMesage.visible = true;
		}
	}
	
	function render(){
		ctx.clearRect(0,0,cnv.width,cnv.height);
		
		//redenderização da bola
		if(ball.visible){
			ctx.fillStyle = ball.color;
			ctx.beginPath();
			ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
			ctx.closePath();
			ctx.fill();
			//desenhar o placar
			ctx.font = "bold 15px Arial";
			ctx.fillStyle = "#000";
			ctx.fillText("SCORE: " + score,10,20);
		}
		
		//renderização das mensagens de texto
		for(var i in messages){
			var msg = messages[i];
			if(msg.visible){
				ctx.font = msg.font;
				ctx.fillStyle = msg.color;
				ctx.fillText(msg.text,(cnv.width - ctx.measureText(msg.text).width)/2,msg.y);
			}
		}
	}
	
	//função de inicialização do jogo
	function startGame(){
		ball.vy = 0;
		ball.y = 50;
		ball.vx = Math.floor(Math.random()*21) - 10;
		ball.x = Math.floor(Math.random()*261) + 20;
		ball.visible = true;
		score = 0;
		scoreText.visible = false;
		recordMesage.visible = false;
	}
	
	loop();
}());


























