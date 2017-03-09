var menuState = {
	create: function(){
		game.add.image(0,0,'splash');
	
		//highScore
		if(!localStorage.getItem('highScore')){
			localStorage.setItem('highScore',0);
		}
		if(game.global.highScore > localStorage.getItem('highScore')){
			localStorage.setItem('highScore',game.global.highScore);
		}
	
		var txtPressStart = game.add.text(game.world.centerX,650,'PRESS START',{font:'20px emulogic', fill: '#fff'});
			txtPressStart.anchor.set(.5);
			
		var txtHighScore = game.add.text(game.world.centerX,450,'HIGH-SCORE: ' + game.global.highScore,{font:'20px emulogic', fill:'#F18808'});
			txtHighScore.anchor.set(.5);
			txtHighScore.alpha = 0;
			
		game.add.tween(txtPressStart).to({y: 350},1000).start();
		
		game.time.events.add(1000,function(){
			game.add.tween(txtHighScore).to({alpha: 1},500).to({alpha: 0},500).loop().start();
			
			var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
				enterKey.onDown.addOnce(this.startGame,this);
		},this);
		
		
	},
	
	startGame: function(){
		game.state.start('play');
	}
};
