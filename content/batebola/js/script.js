(function(){
	var cnv = document.querySelector('canvas');
	var ctx = cnv.getContext('2d');
	var div = document.querySelector('#container');
	
	var gravity = 0.1;
	var hyp = catX = catY = 0;
	
	var start = 1, play = 2, over = 3;
	var gameState = start;
	
	var score = 0;
	var record = localStorage.getItem("record") ? localStorage.getItem("record") : 0;
	
	var ball = {
		radius: 20,
		vx: 0,
		vy: 0,
		x: 50,
		y: 50,
		color: '#00f',
		touched: false,
		visible: false
	};
	
	//mensagens de texto
	var messages = [];
	
	var startMessage = {
		text: "TOUCH TO START",
		y: cnv.height/2 - 100,
		font: "bold 30px Arial",
		color: "#f00",
		visible: true
	};
	
	messages.push(startMessage);
	
	var scoreText = Object.create(startMessage);
	scoreText.visible = false;
	scoreText.y = (cnv.height/2) + 50;
	
	messages.push(scoreText);
	
	var recordText = Object.create(startMessage);
	recordText.visible = false;
	recordText.y = (cnv.height/2) + 100;
	
	messages.push(recordText);
	
	//eventos
	cnv.addEventListener('touchstart',function(e){
		e.preventDefault();
		catX = ball.x - (e.touches[0].clientX - div.offsetLeft);
		catY = ball.y - (e.touches[0].clientY - div.offsetTop);
		mousedownHandler(catX,catY);
	},false);
	
	cnv.addEventListener('mousedown',function(e){
		e.preventDefault();
		catX = ball.x - e.offsetX;
		catY = ball.y - e.offsetY;
		mousedownHandler(catX,catY);
	},false);
	
	cnv.addEventListener('mouseup',function(e){
		e.preventDefault();
		mouseupHandler();
	},false);
	
	cnv.addEventListener('touchend',function(e){
		e.preventDefault();
		mouseupHandler();
	},false);
	
	function mousedownHandler(catX,catY){
		switch(gameState){
			case start:
				gameState = play;
				startMessage.visible = false;
				startGame();
				break;
			case play:
				hyp = Math.sqrt(catX*catX + catY*catY);

				if(hyp < ball.radius && !ball.touched){
					ball.vx = Math.floor(Math.random()*21) - 10;
					ball.vy = -(Math.floor(Math.random()*6)+5);
					ball.touched = true;
					score ++;
				}
				break;
		}
	}
	
	function mouseupHandler(){
		if(gameState === play){
			ball.touched = false;
		}
	}
	
	function startGame(){
		ball.vx = Math.floor(Math.random()*21) - 10;
		ball.vy = 0;
		ball.x = Math.floor(Math.random()*260) + 20;
		ball.y = 50;
		score = 0;
		scoreText.visible = false;
		recordText.visible = false;
		ball.visible = true;
	}
	
	function loop(){
		window.requestAnimationFrame(loop,cnv);
		if(gameState === play){
			update();
		}
		render();
	}
	
	function update(){
		ball.vy += gravity;
		ball.y += ball.vy;
		ball.x += ball.vx;
		
		//faz a bola quicar nas paredes
		if(ball.x + ball.radius > cnv.width || ball.x - ball.radius < 0){
			if(ball.x - ball.radius < 0){
				ball.x = ball.radius;
			} else {
				ball.x = cnv.width - ball.radius;
			}
			ball.vx *= -0.8;
		}
		
		//faz a bola quicar no teto
		if(ball.y < 0 && ball.vy < 0){
			ball.y = ball.radius;
			ball.vy *= -1;
		}
		
		//Game Over
		if(ball.y - ball.radius > cnv.height){
			gameState = over;
			ball.visible = false;
			
			if(score > record){
				record = score;
				localStorage.setItem("record",record);
			}
			
			scoreText.text = "YOUR SCORE: " + score;
			scoreText.visible = true;
			
			recordText.text = "BEST SCORE: " + record;
			recordText.visible = true;
			
			window.setTimeout(function(){
				startMessage.visible = true;
				gameState = start;
			},2000);
		}
	}
	
	function render(){
		ctx.clearRect(0,0,cnv.width,cnv.height);
		
		if(ball.visible){
			ctx.fillStyle = ball.color;
			ctx.beginPath();
			ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
			ctx.closePath();
			ctx.fill();
			ctx.font = "bold 15px Arial";
			ctx.fillStyle = "#000";
			ctx.fillText("SCORE: " + score,10,20);
		}
		
		for(var i in messages){
			var msg = messages[i];
			if(msg.visible){
				ctx.font = msg.font;
				ctx.fillStyle = msg.color;
				ctx.fillText(msg.text,(cnv.width - ctx.measureText(msg.text).width)/2,msg.y);
			}
		}
	}
	
	loop();	
}());