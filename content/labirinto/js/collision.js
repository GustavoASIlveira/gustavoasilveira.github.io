//Colisão entre retângulos
function hitTestRectangle(r1,r2){
	//calcula o vetor que indica a distância entre os objetos
	var vx = r1.centerX() - r2.centerX();
	var vy = r1.centerY() - r2.centerY();
	
	//Soma as metades das larguras e alturas
	var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
	var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

	//Confere se houve colisão no eixo X
	if(Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights){		
		return true;
	}
	
	return false;
}

//Colisão entre círculos
function hitTestCircle(c1,c2){
	//calcula o vetor que indica a distância entre os objetos
	var vx = c1.centerX() - c2.centerX();
	var vy = c1.centerY() - c2.centerY();
	
	//Determina a distância entre o centro dos círculos calculando a hipotenusa do triângulo
	//(a soma dos quadrados dos catetos é igual ao quadrado da hipotenusa)
	var magnitude = Math.sqrt(vx * vx + vy * vy);
	
	//Soma os raios dos círculos
	var totalRadii = c1.halfWidth() + c2.halfWidth();
	
	//Retorna o resultado da comparação entre a soma dos raios e a hipotenusa
	return magnitude < totalRadii;
}

//Bloqueio entre retângulos
function blockRetangle(r1,r2){
	//Variável que armazena o lado em que a colisão ocorreu
	var collisionSide = "none";
	
	//Cálculo da distância entre os retângulos
	//Vetor
	var vx = r1.centerX() - r2.centerX();
	var vy = r1.centerY() - r2.centerY();
	
	//Soma das metades das alturas e larguras dos retângulos
	var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
	var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();
	
	//Identifica a colisão comparando as somas das metades das larguras com os vetores
	if(Math.abs(vx) < combinedHalfWidths){
		if(Math.abs(vy) < combinedHalfHeights){
			//Calcula a sobreposição de um retângulo sobre o outro
			var overlapX = combinedHalfWidths - Math.abs(vx);
			var overlapY = combinedHalfHeights - Math.abs(vy);
			//Identifica a posição de origem da colisão, apontada pela menor sobreposição
			if(overlapX >= overlapY){
				if(vy > 0){
					collisionSide = "top";
					r1.y = r1.y + overlapY;
				} else {
					collisionSide = "bottom";
					r1.y = r1.y - overlapY;
				}
			} else {
				if(vx > 0){
					collisionSide = "left";
					r1.x = r1.x + overlapX;
				} else {
					collisionSide = "right";
					r1.x = r1.x - overlapX;
				}
			}
		}
	}
	return collisionSide;
}

//Bloqueio entre círculos







