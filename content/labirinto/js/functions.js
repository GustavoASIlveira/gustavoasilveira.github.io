function chkScore(score){
	if(score < 10){
		return "00" + score.toString();
	}
	if(score < 100){
		return "0" + score.toString();
	}
	return score.toString();
}
