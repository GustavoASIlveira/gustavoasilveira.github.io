const cnv = document.querySelector('canvas')
const ctx = cnv.getContext('2d')
const txtScore = document.querySelector('#txtScore')
const endModal = document.querySelector('#end-modal')
const gameOverScore = document.querySelector('#game-over-score')
const btnNewGame = document.querySelector('#btn-new-game')
const startModal = document.querySelector('#start-modal')
const startContainer = document.querySelector('.start-container')
const musicIntro = document.querySelector('#music-intro')
musicIntro.volume = .6
const musicGame = document.querySelector('#music-game')
musicGame.volume = .6
const SHOOTING = 1
const EXPLOSION = 2

btnNewGame.addEventListener('click',init)

cnv.width = innerWidth
cnv.height = innerHeight

const x = innerWidth/2
const y = innerHeight/2

const player = new Player(x,y,30,'#001')

let projectiles = []
let enemies = []
let particles = []

let animationId
let intervalId
let score = 0

startContainer.addEventListener('click',()=>{
	startModal.style.opacity = 0
	init()
	setTimeout(()=>{
		startModal.style.zIndex = -1
	},500)
})

cnv.addEventListener('click',(e)=>{
	const angle = Math.atan2(e.clientY - y, e.clientX - x)
	
	const velocity = {
		x: Math.cos(angle) * 4,
		y: Math.sin(angle) * 4
	}
	
	playSound(SHOOTING)
	
	projectiles.push( new Projectile(x,y, 3, '#48FCFF', velocity) )
})

function playSound(soundType){
	const sound = document.createElement('audio')
	sound.src = soundType === EXPLOSION ? './snd/explosion.ogg' : './snd/shooting.mp3'
	sound.addEventListener('canplaythrough',()=>{
		sound.play()
	})
}

function loop(){
	animationId = requestAnimationFrame(loop, cnv)
	update()
}

function update(){
	ctx.fillStyle = 'rgba(0,0,0,.1)'
	ctx.fillRect(0, 0, cnv.width, cnv.height)
	
	checkBulletEnemyCollision()
	
	enemies.forEach((enemy)=>{
		enemy.update()
		
		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
		
		if(dist < player.radius + enemy.radius){
			musicGame.pause()
			musicGame.currentTime = 0
			cancelAnimationFrame(animationId)
			gameOverScore.innerText = score
			endModal.style.opacity = 1
			endModal.style.zIndex = 1
		}
	})
	
	manageParticles()
	
	player.update()
}


function spawEnemies(){
	intervalId = setInterval(()=>{
		const radius = Math.floor(Math.random() * 26) + 5
		let posX
		let posY
		
		if(Math.random() < .5){
			posX = Math.random() < .5 ? 0 - radius : cnv.width + radius
			posY = Math.random() * cnv.height
		} else {
			posX = Math.random() * cnv.width
			posY = Math.random() < .5 ? 0 - radius : cnv.height + radius
		}
		
		const angle = Math.atan2(y - posY, x - posX)
		
		const color = `hsl(${Math.random() * 360},50%,50%)`
		
		const velocity = {
			x: Math.cos(angle),
			y: Math.sin(angle)
		}
		
		enemies.push( new Enemy(posX, posY, radius, color, velocity) )
	},1500)
}

function checkBulletEnemyCollision(){
	for(let pIndex = projectiles.length-1; pIndex >= 0; pIndex--){
		const projectile = projectiles[pIndex]
		projectile.update()
		
		for(let eIndex = enemies.length-1; eIndex >= 0; eIndex--){
			const enemy = enemies[eIndex]
			const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
			
			if(dist < projectile.radius + enemy.radius){
				playSound(EXPLOSION)
				score += 100 - Math.floor(enemy.radius)
				txtScore.innerHTML = 'SCORE: ' + score
				createParticles(projectile,enemy)
			
				if(enemy.radius > 15){
					enemy.newRadius = enemy.radius - 10
				} else {
					enemies.splice(eIndex,1)
				}
				projectiles.splice(pIndex,1)
			}
		}
		
		checkOffScreenBullets(projectile,pIndex)
	}
}

function checkOffScreenBullets(projectile,pIndex){
	if(	projectile.x + projectile.radius < 0 || 
		projectile.x - projectile.radius > cnv.width || 
		projectile.y + projectile.radius < 0 || 
		projectile.y + projectile.radius > cnv.height
	){
		score -= 100
		if(score < 0){
			score = 0
		}
		txtScore.innerHTML = 'SCORE: ' + score
		projectiles.splice(pIndex,1)
	}
}

function manageParticles(){
	for(let prtIndex = particles.length-1; prtIndex >= 0; prtIndex--){
		const particle = particles[prtIndex]
		particle.update()
		
		if(particle.alpha <= 0){
			particles.splice(prtIndex,1)
		}
	}
}

function createParticles(projectile,enemy){
	for(let i = 0; i < Math.floor(enemy.radius * 2); i++){
		const velocity = {
							x: (Math.random() - .5) * (Math.random() * 6),
							y: (Math.random() - .5) * (Math.random() * 6)
						}
		particles.push(new Particle(projectile.x,projectile.y,Math.random() * 2,enemy.color,velocity))
	}
}

function init(){
	musicIntro.pause()
	musicGame.pause()
	musicGame.currentTime = 0
	musicGame.play()
	endModal.style.opacity = 0
	endModal.style.zIndex = -1
	projectiles = []
	enemies = []
	particles = []
	animationId
	score = 0
	txtScore.innerHTML = 'SCORE: ' + score
	clearInterval(intervalId)
	ctx.fillRect(0,0,cnv.width,cnv.height)
	spawEnemies()
	loop()
}

