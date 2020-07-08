window.onload = function(){
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var mapa = document.querySelector("#mapa");
		mapa.style.left = (WIDTH - mapa.width)/2 + "px";
	var display = document.querySelector("#display");
	var CELL = mapa.width/6;
	var modal = document.querySelector("#modal");
	var imgCamponesa = document.querySelector("#imgDialogoCamponesa");
		imgCamponesa.style.left = -imgCamponesa.width + "px";
	var imgPorta = document.querySelector("#imgPorta");
		imgPorta.style.left = (WIDTH - imgPorta.width)/2 + "px";
		imgPorta.style.top = (HEIGHT - imgPorta.height)/2 + "px";
	var dialogo = document.querySelector("#dialogo");
	var instrucoes = document.querySelector('#instrucoes');
	var caixaDeDialogo = document.querySelector("#caixaDeDialogo");
	
	var caixaDeDialogo2 = document.querySelector("#caixaDeDialogo2");
	var dialogoCamponesa = document.querySelector("#dialogoCamponesa");
	var opt1 = document.querySelector("#opt1");
	var opt2 = document.querySelector("#opt2");
	
	var numSobreviventes = 2;
	
	var difConvencerCamponesa;
	var difEncontrarPassagem = 5;//vai para 3 se a camponesa falar da passagem
	var difPassarArmadilha = 5;//var para 3 se a camponesa falar da armadilha
	
	var objs = {};
		
//===========> Setup
	function createScene(){
		var spawn1 = document.createElement("img");
			spawn1.src = "img/spawnVermelho.png";
			spawn1.style.position = "absolute";
			spawn1.style.maxWidth = CELL/1 + "px";
			spawn1.style.top = CELL * .2 + "px";
			spawn1.style.left = CELL * 5.5 + "px";
			spawn1.style.zIndex = 1;
			spawn1.style.transform = "rotate(-90deg)";
		
			display.appendChild(spawn1);
			
		var spawn2 = document.createElement("img");
			spawn2.src = "img/spawnVerde.png";
			spawn2.style.position = "absolute";
			spawn2.style.maxWidth = CELL + "px";
			spawn2.style.top = 0 + "px";
			spawn2.style.left = CELL * 1.2 + "px";
			spawn2.style.zIndex = 1;
		
			objs.entradaVerde = spawn2;
			display.appendChild(objs.entradaVerde);
			
		var exit = document.createElement("img");
			exit.src = "img/exit.png";
			exit.style.position = "absolute";
			exit.style.maxWidth = CELL + "px";
			exit.style.top = CELL * .3 + "px";
			exit.style.left = 0 + "px";
			exit.style.zIndex = 1;
			exit.style.transform = "rotate(-90deg)";
		
			display.appendChild(exit);
			
		var start = document.createElement("img");
			start.src = "img/start.png";
			start.classList.add("tokenLayer");
			start.style.width = CELL/3 + "px";
			start.style.top = CELL * .4 + "px";
			start.style.left = CELL * .45 + "px";
			start.style.zIndex = 1;
		
			display.appendChild(start);
			start.addEventListener('click',removerMarcador,false);
			
			
		var porta1 = document.createElement("img");
			porta1.src = "img/doorRed_closed.png";
			porta1.classList.add("tokenLayer");
			porta1.style.width = CELL/3.2 + "px";
			porta1.style.top = CELL * .99 + "px";
			porta1.style.left = CELL * .5 + "px";
			
			display.appendChild(porta1);
			porta1.addEventListener('click',abrirPorta1,false);
			
			
		var porta2 = document.createElement("img");
			porta2.src = "img/doorRed_closed.png";
			porta2.classList.add("tokenLayer");
			porta2.style.width = CELL/3.2 + "px";
			porta2.style.top = CELL * .4 + "px";
			porta2.style.left = CELL * 4.1 + "px";
			porta2.style.transform = "rotate(-90deg)";
			
			display.appendChild(porta2);
			porta2.addEventListener('click',abrirPorta2,false);
			
			
		var porta3 = document.createElement("img");
			porta3.src = "img/doorRed_closed.png";
			porta3.classList.add("tokenLayer");
			porta3.style.width = CELL/3.2 + "px";
			porta3.style.top = CELL * .28 + "px";
			porta3.style.left = CELL * 3.02 + "px";
			porta3.style.transform = "rotate(-90deg)";
			
			display.appendChild(porta3);
			porta3.addEventListener('click',abrirPorta2,false);
			
			
		var porta4 = document.createElement("img");
			porta4.src = "img/doorRed_closed.png";
			porta4.classList.add("tokenLayer");
			porta4.style.width = CELL/3.2 + "px";
			porta4.style.top = CELL * .75 + "px";
			porta4.style.left = CELL * 3.45 + "px";
			porta4.style.transform = "rotate(180deg)";
			
			display.appendChild(porta4);
			porta4.addEventListener('click',abrirPorta2,false);
		
		
		var portaAzul = document.createElement("img");
			portaAzul.src = "img/doorBlue_closed.png";
			portaAzul.classList.add("tokenLayer");
			portaAzul.style.width = CELL/3.2 + "px";
			portaAzul.style.top = CELL * 1 + "px";
			portaAzul.style.left = CELL * 5.35 + "px";
			
			display.appendChild(portaAzul);
			portaAzul.addEventListener('click',abrirPortaAzul,false);
			
		var objetivoVermelho1 = document.createElement("img");
			objetivoVermelho1.src = "img/objetivoVermelho.jpeg";
			objetivoVermelho1.classList.add("tokenLayer");
			objetivoVermelho1.style.maxWidth = CELL/3.5 + "px";
			objetivoVermelho1.style.top = CELL * .8 + "px";
			objetivoVermelho1.style.left = CELL * 2.15 + "px";
			
			display.appendChild(objetivoVermelho1);
			objetivoVermelho1.addEventListener('click',pegarObjetivo,false);
			
		var objetivoVermelho2 = document.createElement("img");
			objetivoVermelho2.src = "img/objetivoVermelho.jpeg";
			objetivoVermelho2.classList.add("tokenLayer");
			objetivoVermelho2.style.maxWidth = CELL/3.5 + "px";
			objetivoVermelho2.style.top = CELL * 1.6 + "px";
			objetivoVermelho2.style.left = CELL * 3.5 + "px";
			
			display.appendChild(objetivoVermelho2);
			objetivoVermelho2.addEventListener('click',pegarObjetivo,false);
			
		var objetivoVerde = document.createElement("img");
			objetivoVerde.src = "img/objetivoVerde.jpeg";
			objetivoVerde.classList.add("tokenLayer");
			objetivoVerde.style.maxWidth = CELL/3.5 + "px";
			objetivoVerde.style.top = CELL * 2.2 + "px";
			objetivoVerde.style.left = CELL * 5.35 + "px";
			
			display.appendChild(objetivoVerde);
			objetivoVerde.addEventListener('click',pegarObjetivoVerde,false);
			
		addMarcadorZumbi(1.4,0.4);
	}
	
	function abrirPortaAzul(pa){
		modalOn();
		if(!confirm("Deseja abrir a porta?")){
			modalOff();
			return;
		}
		
		var estaPorta = pa.srcElement;
			estaPorta.src = "img/doorBlue_open.png";
			estaPorta.removeEventListener('click',abrirPortaAzul,false);
			
		
		caixaDeDialogo.style.zIndex = 6;
		dialogo.style.opacity = 1;
		dialogo.innerHTML = "Ao abrir a porta do galpão, um virote corta o ar sibilando em sua direção.<br><br>";
		
		var continuar = document.createElement("a");
			continuar.href = "#";
			continuar.innerHTML = "CONTINUAR...";
			caixaDeDialogo.appendChild(continuar);
			
			continuar.addEventListener('click',testeArmadilha,false);
			
			function testeArmadilha(){
				var resultado = parseInt(prompt("Realize um teste de AGL " + difPassarArmadilha + "+"));
				
				if(resultado < 1){
					dialogo.innerHTML = "Você sente uma dor aguda quando o virote lhe atinge no peito.<br><br>" +
										"<i>Perca 1PV<br><br>" + 
										"(Você foi pego de surpresa. Ignore a armadura)</i><br><br>";
				} else
				if(resultado < 2){
					dialogo.innerHTML = "Você sente uma dor aguda quando o virote lhe atinge no peito.<br><br>" +
										"<i>Perca 1PV<br><br>" + 
										"(Defensável com armadura)</i><br><br>";
				} else {
					dialogo.innerHTML = "Você desvia bem a tempo e o virote passa rente à sua cabeça.<br><br>";
				}
					
				continuar.innerHTML = "FECHAR";
				continuar.removeEventListener('click',testeArmadilha,false);
				continuar.addEventListener('click',fimTesteArmadilha,false);
				
			}
			
			function fimTesteArmadilha(){
				caixaDeDialogo.style.zIndex = -1;
				dialogo.style.opacity = 0;
				modalOff();
				caixaDeDialogo.removeChild(this);
			}
	}

	function addMarcadorZumbi(x,y){
		var zumbi = document.createElement("img");
			zumbi.src = "img/lerdo1.png";
			zumbi.classList.add("tokenLayer");
			zumbi.style.width = CELL/3.3 + "px";
			zumbi.style.top = CELL * y + "px";
			zumbi.style.left = CELL * x + "px";
			zumbi.style.zIndex = 1;
		
			display.appendChild(zumbi);
			zumbi.addEventListener('click',removerMarcador,false);
	}

	function pegarObjetivo(obj){
		modalOn();
		if(!confirm("Deseja pegar o objetivo?")){
			modalOff();
			return;
		}
		
		var objetivo = obj.srcElement;
			objetivo.removeEventListener('click',pegarObjetivo,false);
			display.removeChild(objetivo);
			modalOff();
	}
	
	function pegarObjetivoVerde(obj){
		modalOn();
		if(!confirm("Deseja pegar o objetivo?")){
			modalOff();
			return;
		}

		objs.entradaVerde.src = "img/spawnVermelho.png";
		
		var objetivo = obj.srcElement;
			objetivo.removeEventListener('click',pegarObjetivoVerde,false);
			display.removeChild(objetivo);
			modalOff();
	}

	function removerMarcador(obj){
		modalOn();
		if(!confirm("Deseja remover este marcador?")){
			modalOff();
			return;
		}
		
		var marcador = obj.srcElement;
			marcador.removeEventListener('click',removerMarcador,false);
			display.removeChild(marcador);
			modalOff();
	}

	function abrirPorta1(p1){
		modalOn();
		if(!confirm("Deseja abrir a porta?")){
			modalOff();
			return;
		}
		
		
		portaOn();
		caixaDeDialogoOn();
		
		var estaPorta = p1.srcElement;
			estaPorta.src = "img/doorRed_open.png";
			estaPorta.removeEventListener('click',abrirPorta1,false);
			
		var pessoa1 = document.createElement("img");
			pessoa1.src = "img/MarcadorMulher.png";
			pessoa1.classList.add("tokenLayer");
			pessoa1.style.maxWidth = CELL/3 + "px";
			pessoa1.style.top = CELL * 2.2 + "px";
			pessoa1.style.left = CELL * .4 + "px";
			pessoa1.addEventListener('click',interacaoPessoa1,false);
			
			objs.capmonesaTkn = pessoa1;
			display.appendChild(objs.capmonesaTkn);
			addMarcadorZumbi(0.4,1.3);
			
		
	}

	//serve para as 3 portas
	function abrirPorta2(p2){
		modalOn();
		if(!confirm("Deseja abrir a porta?")){
			modalOff();
			return;
		}
		
		var estaPorta = p2.srcElement;
			estaPorta.src = "img/doorRed_open.png";
			estaPorta.removeEventListener('click',abrirPorta2,false);
			modalOff();
	}

	function interacaoPessoa1(m1){
		if(!confirm("Deseja conversar com a camponesa?")){
			if(confirm("A camponesa foi morta e você deseja remover o Marcador?")){
				var marcador = m1.srcElement;
					marcador.style.zIndex = -1;
					marcador.removeEventListener('click',interacaoPessoa1,false);
			}
			
			return;
		}
		
		modalOn();
		camponesaOn();
		interacaoCamponesa();
	}

	function modalOn(){
		modal.style.zIndex = 5;
		modal.style.backgroundColor = "rgba(0,0,0,.8)";
	}

	function modalOff(){
		modal.style.zIndex = -1;
		modal.style.backgroundColor = "rgba(0,0,0,0)";
	}

	function camponesaOn(){
		imgCamponesa.style.left = WIDTH - imgCamponesa.width + "px";
		imgCamponesa.style.zIndex = 6;
		imgCamponesa.style.opacity = 1;
	}

	function portaOn(){
		imgPorta.style.zIndex = 4;
		imgPorta.style.opacity = 1;
	}

	function portaOff(){
		imgPorta.style.zIndex = -1;
		imgPorta.style.opacity = 0;
	}

	function caixaDeDialogoOn(){
		caixaDeDialogo.style.zIndex = 6;
		dialogo.style.opacity = 1;
		dialogo.innerHTML = "<i>Ao abrir a porta, você se depara com um pequeno agrupamento de Zumbis.<br><br>" +
							"As criaturas se voltam para você com olhares famintos por carne humana.<br><br>" +
							"Um grito de socorro parece vir do fundo da construção.</i><br><br>";
		
		instrucoes.style.opacity = 1;
		instrucoes.innerHTML = 	"<br>INSTRUÇÕES:<br><br>" +
								"Adicione " + (numSobreviventes * 2) + " Lerdos no local indicado.<br><br>" +
								"Adicione um Marcador de NPC no local indicado.<br><br>" +
								"Adicione " +(numSobreviventes + 1)+ " fichas de Barulho junto do Marcador de NPC.<br><br>" +
								"<br>REGRAS ESPECIAIS:<br><br>" +
								"Caso um Zumbi seja ativado na Zona em que está o Marcador de NPC remova o Marcador do tabuleiro.<br><br>" +
								"<i>As criaturas malditas fizeram mais uma vítima e você não conseguiu impedí-las.</i><br><br>";
							
		var exit = document.createElement("a");
			exit.href = "#";
			exit.innerHTML = "FECHAR";
			instrucoes.appendChild(exit);
			exit.addEventListener('click',fecharDialogo,false);
	}

	function fecharDialogo(){
		caixaDeDialogo.style.zIndex = -1;
		dialogo.style.opacity = 0;
		instrucoes.style.opacity = 0;
		modalOff();
		portaOff();
	}


	//-> Interação com a camponesa 1
	function interacaoCamponesa(){
		caixaDeDialogo2.style.zIndex = 6;
		dialogoCamponesa.style.opacity = 1;
		dialogoCamponesa.innerHTML = 	"<i>Você encontra uma mulher jovem e de aparência simples. Provavelmente uma camponesa.<br><br>" +
										"Assustada ela cai de joelhos, enquanto as lágrimas lhe escorrem pelo rosto.</i><br><br>" +
										"- Muito obrigada! Eu achei que fosse o meu fim.<br><br>";
										
		opt1.innerHTML = "<br><br><p>O que diabos você estava fazendo aqui sozinha?</p><br>";
		opt1.addEventListener('click',interacaoCamponesa2,false);
			
		opt2.innerHTML = "<p>Está tudo bem agora. Você está ferida?</p><br><br>";
		opt2.addEventListener('click',interacaoCamponesa3,false);
	}

	//-> Interação com a camponesa 2
	function interacaoCamponesa2(){
		opt1.removeEventListener('click',interacaoCamponesa2,false);
		opt2.removeEventListener('click',interacaoCamponesa3,false);
		
		dialogoCamponesa.innerHTML = 	"- Eu saí para procurar o meu pai.<br><br>" +
										"Ele me mandou ficar em casa e saiu em busca de ajuda, mas ele já está fora há vários dias...<br><br>" +
										"E eu não sabia mais o que fazer.";
							
		opt1.blur();								
		opt2.blur();
		opt1.innerHTML = "<br><br><p>E você encontrou alguma pista do seu pai?</p><br>";
		opt1.addEventListener('click',interacaoCamponesa4,false);
		
		opt2.innerHTML = 	"<p>Eu também estou em uma busca, e talvez você possa me ajudar<br>" +
							"Estou procurando por um antigo artefato de guerra...<br>" + 
							"Uma arma que poderá nos ajudar a combater essas criaturas.<br>" +
							"Você já ouviu falar de algo assim?</p>";
		opt2.addEventListener('click',interacaoCamponesa5,false);
		
		difConvencerCamponesa = 4;
	}

	//-> Interação com a camponesa 3
	function interacaoCamponesa3(){
		opt1.removeEventListener('click',interacaoCamponesa2,false);
		opt2.removeEventListener('click',interacaoCamponesa3,false);

		dialogoCamponesa.innerHTML = 	"- Acho que não.<br><br>" +
										"Estou bem, graças à você...<br><br>" +
										"Não sei como agradecer.";
					
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = "<br><br><p>Com certeza você deve ter algo de valor que possa me oferecer.</p><br>";
		opt1.addEventListener('click',interacaoCamponesa6,false);
			
		opt2.innerHTML = 	"<p>Não foi nada, mas talvez você possa me dar uma informação.<br>" +
							"Estou procurando por um antigo artefato de guerra...<br>" + 
							"Uma arma que poderá nos ajudar a combater essas criaturas.<br>" +
							"Você já ouviu falar de algo assim?</p>";
		opt2.addEventListener('click',interacaoCamponesa5,false);
		
		difConvencerCamponesa = 3;
	}

	//-> Interação com a camponesa 4
	function interacaoCamponesa4(){
		opt1.removeEventListener('click',interacaoCamponesa4,false);
		opt2.removeEventListener('click',interacaoCamponesa5,false);

		dialogoCamponesa.innerHTML = 	"- Não, apenas o seu colete....<br><br>" +
										"Manchado de sangue.<br><br>" +
										"Se você quiser, pode ficar com ele.<br><br>" +
										"<i>O Sobrevivente recebe o Item <b>Armadura de Couro</b></i>";
					
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"<br><br><p>Bom, não é grande coisa, mas é melhor do que nada.<br>" + 
							"Agora suma daqui.</p><br>";
		opt1.addEventListener('click',interacaoCamponesa8,false);
			
		opt2.innerHTML = 	"<p>Obrigado, mas não posso aceitar...<br>" +
							"Agora vá embora daqui antes que apareçam mais Zumbis.</p>";
		opt2.addEventListener('click',interacaoCamponesa9,false);
	}

	//-> Interação com a camponesa 5
	function interacaoCamponesa5(){
		opt1.removeEventListener('click',interacaoCamponesa4,false);
		opt2.removeEventListener('click',interacaoCamponesa5,false);
		opt1.removeEventListener('click',interacaoCamponesa6,false);

		dialogoCamponesa.innerHTML = 	"- Não exatamente, mas meu pai foi um grande guerreiro quando jovem.<br><br>" +
										"Ele mantém algumas coisas guardadas em casa e há coisas que ele guarda em um galpão ao leste daqui.<br><br>" +
										"Mas o galpão está trancado com uma grade de ferro e cadeado.<br><br>" +
										"Talvez a chave esteja entre as coisas dele, em nossa casa, mas eu não saberia dizer.";
		
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = "<br><br><p>Há algo mais que eu precise saber sobre este galpão ou sobre a chave para abrí-lo?</p><br>";
		opt1.addEventListener('click',interacaoCamponesa10,false);
			
		opt2.innerHTML = 	"<p>E aonde está seu pai?<br>";
		opt2.addEventListener('click',interacaoCamponesa7,false);
	}

	//-> Interação com a camponesa 6
	function interacaoCamponesa6(){
		opt1.removeEventListener('click',interacaoCamponesa6,false);
		opt1.removeEventListener('click',interacaoCamponesa5,false);
		
		
		dialogoCamponesa.innerHTML = 	"- Bom, eu estava procurando pelo meu pai quando fui cercada por aqueles monstros.<br><br>" +
										"Infelizmente, não o encontrei. Achei apenas seu colete... manchado de sangue.<br><br>" +
										"Se você quiser, pode ficar com ele.";
		
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"<br><br><p>Bom, não é grande coisa, mas é melhor do que nada.<br>" +
							"Agora suma daqui.</p><br>";
		opt1.addEventListener('click',interacaoCamponesa8,false);
			
		opt2.innerHTML = 	"<p>Eu não posso aceitar...<br>" + 
							"Agora suma daqui antes que apareçam mais Zumbis.</p><br>";
		opt2.addEventListener('click',interacaoCamponesa9,false);
	}

	//-> Interação com a camponesa 7
	function interacaoCamponesa7(){
		opt1.removeEventListener('click',interacaoCamponesa10,false);
		opt2.removeEventListener('click',interacaoCamponesa7,false);

		dialogoCamponesa.innerHTML = 	"- Eu estava justamente tentando encontrá-lo, quando fui atacada pelos monstros que você matou.<br><br>" +
										"Ele me mandou ficar em casa e saiu em busca de ajuda,<br><br>" +
										"mas isso foi dias atrás e eu não sabia mais o que fazer.";
		
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"<br><br><p>Há algo mais que eu precise saber sobre este galpão ou sobre a chave para abrí-lo?</p><br>";
		opt1.addEventListener('click',interacaoCamponesa10,false);
			
		opt2.innerHTML = 	"<p>Está bem.<br>" + 
							"Agora eu sugiro que você corra para a cidade antes apareçam mais daquelas criaturas.</p><br>";
		opt2.addEventListener('click',interacaoCamponesa11,false);
	}

	//-> Interação com a camponesa 8 - Fim de diálogo
	function interacaoCamponesa8(){
		opt1.removeEventListener('click',interacaoCamponesa8,false);
		opt2.removeEventListener('click',interacaoCamponesa9,false);

		dialogoCamponesa.innerHTML = 	"- Sim, obrigada...<br><br>" +
										"Mas antes, há mais uma coisa.<br><br>" +
										"Meu pai guardava alguns pertences em um galpão ao leste daqui, mas ele está trancado.<br><br>" +
										"A chave deve estar em algum lugar na minha casa. Epero que encontre algo útil.<br><br>" +
										"<p><i>Antes de partir a garota lhe entrega um colete de couro.<br>" +
										"Procure a carta 'Armadura de Couro' no baralho de itens.<br>" +
										"Depois reembaralhe os itens juntamente com o descarte.<br><br>" +
										"Remova o Marcador de NPC do tabuleiro.<br><br>" +
										"Adicione os Marcadores de Interação conforme indicado.</i></p>";
		
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"";
		opt1.style.zIndex = -1;
			
		opt2.innerHTML = 	"";
		opt2.style.zIndex = -1;
		
		criaSaidaCamponesa();
	}

	//-> Interação com a camponesa 9 - Fim de diálogo
	function interacaoCamponesa9(){
		opt1.removeEventListener('click',interacaoCamponesa8,false);
		opt2.removeEventListener('click',interacaoCamponesa9,false);
		
		dialogoCamponesa.innerHTML = 	"- Sim, obrigada mais uma vez.<br><br>" +
										"Por favor, aceite ao menos isso como prova de minha gratidão.<br><br>" +
										"<p><i>A garota lhe entrega uma cesta com um pouco de água e algumas maças</i></p><br>" +
										"- Há mais uma coisa, meu pai guardava alguns pertences em um galpão ao leste daqui.<br><br>" +
										"Mas ele está trancado.<br><br>" +
										"A chave está em algum lugar na minha casa." + 
										"Espero que encontre algo útil." +
										"<p><i>Procure uma carta 'Água' e uma carta 'Maça' no baralho de itens.<br>" +
										"Depois reembaralhe os itens juntamente com o descarte.<br><br>" +
										"Remova o Marcador de NPC do tabuleiro.<br><br>" +
										"Adicione os Marcadores de Interação conforme indicado.</i></p>";
		
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"";
		opt1.style.zIndex = -1;
			
		opt2.innerHTML = 	"";
		opt2.style.zIndex = -1;
		
		criaSaidaCamponesa();
	}

	//-> Interação com a camponesa 10
	function interacaoCamponesa10(){
		opt1.removeEventListener('click',interacaoCamponesa10,false);
		opt2.removeEventListener('click',interacaoCamponesa7,false);
		opt2.removeEventListener('click',interacaoCamponesa11,false);
		
		dialogoCamponesa.innerHTML = "";
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"";
		opt2.innerHTML = 	"";
		
		var resultado = parseInt(prompt("Realize um teste de INT " + difConvencerCamponesa + "+"));
		
		if(resultado < 1){
			interacaoCamponesa12();
		} else 
		if(resultado < 3){
			interacaoCamponesa13();
		} else {
			interacaoCamponesa14();
		}
	}

	//-> Interação com a camponesa 11 - Fim de diálogo
	function interacaoCamponesa11(){
		opt1.removeEventListener('click',interacaoCamponesa10,false);
		opt2.removeEventListener('click',interacaoCamponesa11,false);

		dialogoCamponesa.innerHTML = 	"- Sim, obrigada mais uma vez.<br><br>" +
										"Por favor, aceite ao menos isso como prova de minha gratidão.<br><br>" +
										"<p><i>A garota lhe entrega uma cesta com um pouco de água e algumas maças</i></p><br>" +
										"<p><i>Procure uma carta 'Água' e uma carta 'Maça' no baralho de itens.<br>" +
										"Depois reembaralhe os itens juntamente com o descarte.<br><br>" +
										"Remova o Marcador de NPC do tabuleiro.<br><br>" +
										"Adicione os Marcadores de Interação conforme indicado.</i></p>";
		
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"";
		opt1.style.zIndex = -1;
			
		opt2.innerHTML = 	"";
		opt2.style.zIndex = -1;
		
		criaSaidaCamponesa();
	}

	//-> Interação com a camponesa 12 - Fim de diálogo
	function interacaoCamponesa12(){
		dialogoCamponesa.innerHTML = 	"- Lamento, mas realmente não se de mais nada que lhe seja útil.<br><br>" +
										"Muito obrigada por me salvar!.<br><br>" +
										"Acho melhor eu ir agora<br>" +
										"<p><i>A garota se vira e corre rumo à cidade.</i></p>" +
										"<p><i>Remova o Marcador de NPC do tabuleiro.<br><br>" +
										"Adicione os Marcadores de Interação conforme indicado.</i></p>";
		
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"";
		opt1.style.zIndex = -1;
			
		opt2.innerHTML = 	"";
		opt2.style.zIndex = -1;
		
		criaSaidaCamponesa();
	}

	//-> Interação com a camponesa 13 - Fim de diálogo
	function interacaoCamponesa13(){
		dialogoCamponesa.innerHTML = 	"- Não sei se isso lhe ajuda, mas de alguma forma, sempre que eu ia ao galpão chamar meu pai para o jantar.<br><br>" +
										"ele chegava em casa antes de mim.<br><br>" +
										"Me sinto boba por lembrar disso agora.<br><br>" +
										"Bom, lhe agradeço novamente por me salvar!.<br><br>" +
										"Acho melhor eu ir agora<br>" +
										"<p><i>A garota se vira e corre rumo à cidade.</i></p>" +
										"<p><i>Remova o Marcador de NPC do tabuleiro.<br><br>" +
										"Adicione os Marcadores de Interação conforme indicado.</i></p>";
										//-> Reduzir a dificuldade para encontrar a passagem para o galpão
		
		difEncontrarPassagem = 3;
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"";
		opt1.style.zIndex = -1;
			
		opt2.innerHTML = 	"";
		opt2.style.zIndex = -1;
		
		criaSaidaCamponesa();
	}

	//-> Interação com a camponesa 14 - Fim de diálogo
	function interacaoCamponesa14(){
		dialogoCamponesa.innerHTML = 	"- Meu pai tinha grande apreço pelos bens que guardava naquele galpão.<br><br>" +
										"Certamente ele tomaria precauções para que ninguém entrasse lá...<br><br>" +
										"Ou para que não saísse com vida.<br><br>" +
										"Bom, lhe agradeço novamente por me salvar!.<br><br>" +
										"Acho melhor eu ir agora<br><br>" +
										"Por favor... tenha cuidado.<br>" +
										"<p><i>A garota se vira e corre rumo à cidade.</i></p>" +
										"<p><i>Remova o Marcador de NPC do tabuleiro.<br><br>" +
										"Adicione os Marcadores de Interação conforme indicado.</i></p>";
										//-> Reduzir a dificuldade para sair da ermadilha
										
		difPassarArmadilha = 3;
		opt1.blur();								
		opt2.blur();								
		opt1.innerHTML = 	"";
		opt1.style.zIndex = -1;
			
		opt2.innerHTML = 	"";
		opt2.style.zIndex = -1;
		
		criaSaidaCamponesa();
	}

	function criaSaidaCamponesa(){
		var exit = document.createElement("a");
		exit.href = "#";
		exit.innerHTML = "<br><br>FECHAR";
		caixaDeDialogo2.appendChild(exit);
		exit.addEventListener('click',fecharDialogoCamp,false);
	}

	function fecharDialogoCamp(){
		imgCamponesa.style.left = -imgCamponesa.width + "px";
		imgCamponesa.style.zIndex = -1;
		imgCamponesa.style.opacity = 0;
		caixaDeDialogo2.style.zIndex = -1;
		dialogoCamponesa.style.opacity = 0;
		
		caixaDeDialogo2.removeChild(this);
		
		modalOff();
		
		addPontosDeInteresse();
		
		display.removeChild(objs.capmonesaTkn);
	}

	//Fim da interação com a camponesa

	function addPontosDeInteresse(){
		var ponto1 = document.createElement("img");
			ponto1.src = "img/MarcadorInteresse.png";
			ponto1.classList.add("tokenLayer");
			ponto1.style.maxWidth = CELL/3 + "px";
			ponto1.style.top = CELL * 1.3 + "px";
			ponto1.style.left = CELL * 2.5 + "px";
			
			display.appendChild(ponto1);
			
			
		var ponto2 = document.createElement("img");
			ponto2.src = "img/MarcadorInteresse.png";
			ponto2.classList.add("tokenLayer");
			ponto2.style.maxWidth = CELL/3 + "px";
			ponto2.style.top = CELL * 1.1 + "px";
			ponto2.style.left = CELL * 3.7 + "px";
			
			display.appendChild(ponto2);
			
			if(Math.random() < 0.5){
				ponto1.addEventListener('click',pontoDeInterese1,false);
				ponto2.addEventListener('click',pontoDeInterese2,false);
			} else {
				ponto1.addEventListener('click',pontoDeInterese2,false);
				ponto2.addEventListener('click',pontoDeInterese1,false);
			}
	}

	function pontoDeInterese1(p){
		modalOn();
		if(!confirm("Deseja investigar este local?")){
			modalOff();
			return;
		}
		
		var ponto = p.srcElement;
			ponto.removeEventListener('click',pontoDeInterese1,false);
		
		caixaDeDialogo.style.zIndex = 6;
		dialogo.style.opacity = 1;
		dialogo.innerHTML = "";
		
		var continuar = document.createElement("a");
			continuar.href = "#";
			continuar.innerHTML = "FECHAR";
			caixaDeDialogo.appendChild(continuar);
			
			continuar.addEventListener('click',fimTesteArmadilha,false);
			

		var resultado = parseInt(prompt("Realize um teste de INT " + difEncontrarPassagem + "+"));
		
		if(resultado < 1){
			dialogo.innerHTML = "Você tem a impressão de ter visto um vulto se movendo no fundo da sala...<br><br>" +
								"Mas não há nada lá.<br><br>";
		} else 
		if(resultado < 2){
			dialogo.innerHTML = "Atrás de uma estante de madeira você encontra uma velha lâmina que ainda pode ser útil.<br><br>" +
								"<i>Busque pela carta " + Math.random()<.5 ? "'Espada'" : "'Adaga'" + " no Baralho de equipamento ou descarte. Depois reembaralhe as cartas junto com o descarte</i><br><br>";
		} else {
			dialogo.innerHTML = "Você percebe que há uma tábua solta no chão. Ao removê-la você descobre um alçapão escondido.<br><br>" +
								"<i>Adicione Portas de Cripta e remova o Marcador de Interação, conforme indicado</i><br><br>";
								
		var cripta1 = document.createElement("img");
			cripta1.src = "img/portaCriptaFechada.png";
			cripta1.classList.add("tokenLayer");
			cripta1.style.maxWidth = CELL/3 + "px";
			cripta1.style.top = ponto.style.top;
			cripta1.style.left = ponto.style.left;
			
			display.appendChild(cripta1);
			cripta1.addEventListener('click',abrirCripta,false);
			
		var cripta2 = document.createElement("img");
			cripta2.src = "img/portaCriptaFechada.png";
			cripta2.classList.add("tokenLayer");
			cripta2.style.maxWidth = CELL/3 + "px";
			cripta2.style.top = CELL * 2.6 + "px";
			cripta2.style.left = CELL * 5.6 + "px";
			
			display.appendChild(cripta2);
			cripta2.addEventListener('click',abrirCripta,false);
		}
		
		display.removeChild(ponto);
	}
	
	function abrirCripta(p2){
		modalOn();
		if(!confirm("Deseja abrir a porta da cripta?")){
			modalOff();
			return;
		}
		
		var estaPorta = p2.srcElement;
			estaPorta.src = "img/portaCriptaAberta.png";
			estaPorta.removeEventListener('click',abrirCripta,false);
			modalOff();
	}
	
	function pontoDeInterese2(p){
		modalOn();
		if(!confirm("Deseja investigar este local?")){
			modalOff();
			return;
		}
		
		var ponto = p.srcElement;
			ponto.removeEventListener('click',pontoDeInterese1,false);
		
		caixaDeDialogo.style.zIndex = 6;
		dialogo.style.opacity = 1;
		dialogo.innerHTML = "";
		
		var continuar = document.createElement("a");
			continuar.href = "#";
			continuar.innerHTML = "FECHAR";
			caixaDeDialogo.appendChild(continuar);
			
			continuar.addEventListener('click',fimTesteArmadilha,false);
			

		var resultado = parseInt(prompt("Realize um teste de INT 4+"));
		
		if(resultado < 1){
			dialogo.innerHTML = "Você encontra um velho martelo de guerra...<br><br>" +
								"Mas ao tentar pegá-lo, a madeira apodrecida do cabo se quebra ao simples toque de suas mãos.<br><br>";
		} else {
			dialogo.innerHTML = "Você encontra uma velha caixa de madeira com algo dentro...<br><br>" +
								"<i>Compre uma carta do baralho de Equipamento.<br><br>" + 
								"Essa ação é grátis pode ser realizada mesmo que o Sobrevivente já tenha feito uma ação de Procurar neste turno</i><br><br>";
		}
		
		display.removeChild(ponto);
	}
	
	function fimTesteArmadilha(){
			caixaDeDialogo.style.zIndex = -1;
			dialogo.style.opacity = 0;
			modalOff();
			caixaDeDialogo.removeChild(this);
		}
		
	//Adiciona os elementos iniciais
	createScene();
};


























