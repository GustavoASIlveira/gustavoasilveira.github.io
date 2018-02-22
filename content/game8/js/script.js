(function(){
	//arrays que armazenam o estado do jogo e o de vitória, respectivamente
	var arr 	= [],
		answer 	= [];
		
	//telas de start game e de game over
	var startPanel = document.querySelector("#startPanel");
		startPanel.addEventListener("click",startGame,false);
	var overPanel = document.querySelector("#overPanel");
	
	//função que inicializa os elementos do jogo
	function init(){
		//varre os elementos 'btn' adicionando a imagem de fundo e a função moveTile, além de inserir os elementos no array
		for(var i = 1; i < 9; i++){
			var tile = document.querySelector("#n"+i);
			tile.style.background = "url('img/n"+ i +".png') no-repeat";
			tile.addEventListener("click",moveTile,false);
			arr.push(tile);
		}
		//completa o array com um espaço nulo e o copia para a resposta, depois renderiza o tabuleiro
		arr.push(null);
		answer = arr;
		render();
	}
	
	//ajusta a exibição do tabuleiro em função do array
	function render(){
		for(var i in arr){
			var tile = arr[i];
			if(tile){
				tile.style.left = (i%3) * 100 + 5 + "px";
				if(i < 3){
					tile.style.top = "5px";
				} else 
				if(i < 6){
					tile.style.top = "105px";
				} else {
					tile.style.top = "205px";
				}
			}
		}
	}
	
	//ajusta a posição da peça clicada dentro do array
	function moveTile(){
		var index = arr.indexOf(this);
		
		//confere se a peça não está na coluna da esquerda
		if(index % 3 !== 0){
			if(!arr[index - 1]){
				arr[index - 1] = this;
				arr[index] = null;
			}
		}
		//confere se a peça não está na coluna da direita
		if(index % 3 !== 2){
			if(!arr[index + 1]){
				arr[index + 1] = this;
				arr[index] = null;
			}
		}
		//confere se a peça não está na linha do topo
		if(index > 2){
			if(!arr[index - 3]){
				arr[index - 3] = this;
				arr[index] = null;
			}
		}
		//confere se a peça não está na linha do fundo
		if(index < 6){
			if(!arr[index + 3]){
				arr[index + 3] = this;
				arr[index] = null;
			}
		}
		render();
		
		//verifica condição de vitória
		if(chkWin()){
			gameOver();
		}
		
	}
	
	//ordenação aleatória do array
	function randomSort(array){
		var newArray;
		do{
			newArray = [];
			
			while(newArray.length < array.length){
				var i = Math.floor(Math.random() * array.length);
				if(newArray.indexOf(array[i]) < 0){
					newArray.push(array[i]);
				}
			}
		}while(!validArray(newArray));
		
		return newArray;
	}
	
	//valida o array
	/*
	 * o sistema conta uma inversão ao comparar o valor do índice i com os seguintes e identificar valores menores
	 * Caso o array apresente um número ímpar de inversões, o sistema é insolucionável
	 * */
	function validArray(array){
		var inversions = 0;
		var len = array.length;
		
		for(var i = 0; i < len-1; i++){
			for(var j = i+1; j < len; j++){
				if(array[i] && array[j] && array[i].dataset.value > array[j].dataset.value){
					inversions++;
				}
			}
		}
		
		return inversions % 2 === 0;
	}
	
	//função que inicia o jogo embaralhando o array e desabilitando a tela inicial
	function startGame(){
		arr = randomSort(arr);
		this.removeEventListener("click",startGame,false);
		this.style.opacity = "0";
		var self = this;
		setTimeout(function(){
			self.style.zIndex = "-5";
			self.style.display = "none";
		},500);
		render();
	}
	
	//função que compara o array com a solução
	function chkWin(){
		for(var i in arr){
			var a = arr[i];
			var b = answer[i];
			if(a !== b){
				return false;
			}
		}
		return true;
	}
	
	//função que finaliza o jogo exibindo a tela final e permitindo a reinicialização do jogo
	function gameOver(){
		overPanel.style.zIndex = "5";
		overPanel.style.opacity = "1";
		overPanel.style.display = "initial";
		setTimeout(function(){
			overPanel.addEventListener("click",startGame,false);
		},500);
	}
	
	//chamada da função inicial
	init();
}());
