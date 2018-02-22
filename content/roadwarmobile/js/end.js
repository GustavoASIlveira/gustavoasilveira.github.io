var endState = {
	create: function(){
		this.music = game.add.audio('introMusic');
		this.music.loop = true;
		this.music.volume = .5;
		this.music.play();
		
		var splash = game.add.image(0,0,'splash');
			splash.alpha = 0;
		game.add.tween(splash).to({alpha:1},1000).start();
		
		var txtGameBy = game.add.text(game.world.centerX,650,'A GAME BY:',{font:'20px emulogic', fill: '#fff'});
			txtGameBy.anchor.set(.5);
			game.add.tween(txtGameBy).to({y:100},1500).start();
			
		var txtGustavo = game.add.text(game.world.centerX,650,'GUSTAVO SILVEIRA',{font:'22px emulogic', fill: '#0f0'});
			txtGustavo.anchor.set(.5);
			game.add.tween(txtGustavo).to({y:150},2000).start();
			
		var txtGameArt = game.add.text(game.world.centerX,650,'GAME ART:',{font:'20px emulogic', fill: '#fff'});
			txtGameArt.anchor.set(.5);
			game.add.tween(txtGameArt).to({y:200},2500).start();
			
		var txtMelquiades = game.add.text(game.world.centerX,650,'MELQUIADES MARIO',{font:'22px emulogic', fill: '#0f0'});
			txtMelquiades.anchor.set(.5);
			game.add.tween(txtMelquiades).to({y:250},3000).start();
			
		var txtThanks = game.add.text(game.world.centerX,650,'THANKS FOR PLAYING!',{font:'20px emulogic', fill: '#fff'});
			txtThanks.anchor.set(.5);
			
		var tween = game.add.tween(txtThanks);
			tween.to({angle: -2},250);
			tween.to({angle: 0},250);
			tween.to({angle: 2},250);
			tween.to({angle: 0},250);
			tween.loop();
			tween.start();
		
		game.time.events.add(3000,function(){
			game.add.tween(txtThanks).to({y:350},2000).start();
		},this);
	
		game.time.events.add(6000,function(){
			var txtPressStart = game.add.text(game.world.centerX,450,'PRESS START',{font:'20px emulogic', fill: '#fff'});
				txtPressStart.anchor.set(.5);
				txtPressStart.alpha = 0;
				game.add.tween(txtPressStart).to({alpha: 1},500).to({alpha: 0},500).loop().start();
		
			var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
				enterKey.onDown.addOnce(this.backToMenu,this);
		},this);
	},
	
	backToMenu: function(){
		this.music.stop();
		game.state.start('menu');
	}
};
