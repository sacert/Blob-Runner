var container = document.getElementById("container");
var c = document.getElementsByTagName('canvas')[0];
var ctx = c.getContext("2d");
var w = container.clientWidth;
var h = container.clientHeight;
var gameOver = false;
var FPS = 30;
var currScore = 0;
var hiScore = 0;

// sprite sheet
var dinoSprite = [];

// list of obsticles
var obsticles = [];

// list of clouds
var clouds = [];

var dino = new Dinosaur();

var time;

var start;

var scoreTimer = 0;

window.addEventListener('resize', resizeCanvas, false);
window.addEventListener("keydown", controls, false);

function controls(e) {
  if(e.keyCode == 38 || e.keyCode == 32) { // up key or spacebar
	dino.jumping = true;
	
	if (dino.onGround) {
		dino.velocityY = -18.0;
		dino.onGround = false;
	}
	
	if (dino.velocityY < -34.0) {
		dino.velocityY = -34.0;
	}
  }  else if(e.keyCode == 82) { // reset 'r'
    newGame();
  }
}

// draws the board and the moving shape
function draw() {
	// clear canvas 
	ctx.clearRect(0, 0, w, h);
		
	// go through all terrain particles and draw them
	obsticles.forEach(function (o) {o.draw();});
	clouds.forEach(function (cl) {cl.draw();});
	dino.draw();
	
}

function tick() {
	
	if (scoreTimer > 10) {
		currScore++;
		document.getElementById("score").innerHTML = pad(currScore,6);
		scoreTimer = 0;
	} else {
		scoreTimer++;
	}
	
	var now = new Date().getTime();
	time = now - start;
		
	dino.update();
	obsticles.forEach(function (o) {o.x-=(o.speed/2);});
	clouds.forEach(function (cl) {cl.x--;});
	
	if (obsticles.length > 0 && obsticles[0].x < -1*(obsticles.w)) {
		obsticles.shift();
	}
	
	if (clouds.length > 0 && clouds[0].x < (-1)*clouds[0].w) {
		clouds.shift();
	}
	
	if (Math.random() < 0.1) {
		
		// only place obsticles after a certain period after the last one was placed
		if (obsticles.length > 0) {
			if (obsticles[obsticles.length-1].x < (w*(8/10))) {
				var ob = new Obsticle();
				ob.spriteX = Math.floor(Math.random() * 3) * ob.w;
				obsticles.push(ob);
			}
		} else {
			var ob = new Obsticle();
			ob.spriteX = Math.floor(Math.random() * 3) * ob.w;
			obsticles.push(ob);
		}
	}
	
	// make sure there are no more than 2 clouds on screen
	if (Math.random() < 0.1 && clouds.length < 2) {
		
		// if there is already a cloud on the screen, only display another cloud if it has past half way
		if (clouds.length > 0) {
			if (clouds[clouds.length-1].x < w/2) {
				var cl = new Cloud();
				clouds.push(cl);
			}
		} else {
			var cl = new Cloud();
			clouds.push(cl);
		}
	}
	
	if (dino.jumping) {
		dino.velocityY += dino.gravity;
		dino.y += dino.velocityY;
		
		if (dino.y > dino.orig_y) {
			dino.y = dino.orig_y;
			dino.velocity = 0.0;
			dino.onGround = true;
			dino.jumping = false;
		}
	}
	
	start = now;
			
}

function newGame() {
		
	dino.spriteX =dino.w * 3;
	dino.spriteY = 0;
	
}

function startGame() {
    resizeCanvas();
    newGame();
    draw();
			
    setInterval( function() {
		tick();
		draw();
	}, 1000/FPS );

}

// have to look into this -- how it resizes 
function resizeCanvas() {

}

// should be within it's own file
function Particle(w, h, color) {
	this.w = w;
	this.h = h;
	this.speed = 20;
	
	this.color = color;
}

Particle.prototype.draw = function () {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.w, this.h);
}

function getSprite(src) {
	var img = new Image();
		img.src = src;
		return img;
}

function Dinosaur() {
	
	this.gravity = 1.7;
	this.onGround = true;
	this.velocityY = 0.0;
	
	this.orig_y = h - 24;
	
	this.x = 10;
	this.y = h -24 ;
	this.w = 32;
	this.h = 32;
	this.img = getSprite("assets/sprite.png");
	this.spriteX;
	this.springY;
	
	this.dy = 4.5;
	this.G = 0.06;
	
	this.speed0 = 0.03;
	
	this.t0;
	
	this.jumping = false;
	this.jumping_height = 100;
	this.jumping_velocity = 1;
	this.going_up = false;
	this.going_down = false;
	
	this.timer = 0;
	this.change = 180;
	this.spriteNum = 1;
}

Dinosaur.prototype.update = function () {
	this.timer++;
	
	if (this.timer > 3) {
		if (this.spriteNum == 1) {
			this.spriteX = this.w * 0;
			this.spriteNum = 0;
		} else {
			this.spriteX = this.w * 1;
			this.spriteNum = 1;
		}
		this.timer = 0;
	}
}

Dinosaur.prototype.draw = function () {
	ctx.drawImage(this.img, this.spriteX, this.spriteY, this.w, this.h, this.x, this.y, this.w, this.h);
}

function Obsticle() {
	this.x = w;
	this.y = h - 26;
	this.speed = 20;
	
	this.w = 32;
	this.h = 32;
	this.img = getSprite("assets/obsticles.png");
	this.spriteX = 0;
	this.spriteY = 0;
}

Obsticle.prototype.draw = function () {
	ctx.drawImage(this.img, this.spriteX, this.spriteY, this.w, this.h, this.x, this.y, this.w, this.h);
}

function Cloud() {
	this.max = h*(2/5) + h/4;
	this.min = h*(2/5) - h/4;
	this.y = Math.floor(Math.random() * (this.max - this.min)) + this.min;
	this.x = w;
	
	this.w = 32;
	this.h = 32;
	this.img = getSprite("assets/cloud.png");
	this.spriteX = 0;
	this.spriteY = 0;
}

Cloud.prototype.draw = function () {
	ctx.drawImage(this.img, this.spriteX, this.spriteY, this.w, this.h, this.x, this.y, this.w, this.h);
}

window.onload = function () {
	window.onresize();
}

window.onresize = function () {
	w = container.clientWidth;
	h = container.clientHeight;
	c.width = w;
	c.height = h;
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

startGame();
