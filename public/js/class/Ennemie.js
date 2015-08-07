Ennemie = function(game, currentEnnemie, tileSize){
	this.game = game;
	this.infoEnnemie = currentEnnemie;
	this.obj = null;
	this.tileSize = tileSize;
	this.target = null;
	this.color = '#4169e1';

	this.MAX_SPEED = 250; // pixels/second
    this.MIN_DISTANCE = 32; // pixels
    this.path = null;

	this.create();

	this.counter=0;
};
  
Ennemie.prototype = {

	preload: function(){
	},

  	create: function(){
  		var posX = this.infoEnnemie.x * this.tileSize;
  		var posY = this.infoEnnemie.y * this.tileSize;

  		this.obj = this.game.add.sprite(posX, posY, this.createBlock({x:15,y:15}, this.color));
		this.obj.anchor.setTo(0.5, 0.5);

		this.game.physics.arcade.enableBody(this.obj);

		this.obj.body.collideWorldBounds = false;
		this.obj.body.mass = 2000;
	    this.obj.body.alive = false;

	    this.game.time.events.loop(500, this.updateTimer, this);
	},

	update: function(){
		/*
		// Calculate distance to target
	    var distance = this.game.math.distance(this.obj.x, this.obj.y, this.target.x, this.target.y);

	    // If the distance > MIN_DISTANCE then move
	    if (distance > this.MIN_DISTANCE) {
	        // Calculate the angle to the target
	        var rotation = this.game.math.angleBetween(this.obj.x, this.obj.y, this.target.x, this.target.y);

	        // Calculate velocity vector based on rotation and this.MAX_SPEED
	        this.obj.body.velocity.x = Math.cos(rotation) * this.infoEnnemie.speed;
	        this.obj.body.velocity.y = Math.sin(rotation) * this.infoEnnemie.speed;
	    } else {
	        this.obj.body.velocity.setTo(0, 0);
	    }
	    */	    
	},

	updateTimer: function(){

		console.log("toto;");

		if(this.path != null){
			//this.obj.x = this.path[0][0] * this.tileSize;
			//this.obj.y = this.path[0][1] * this.tileSize;

			this.game.physics.arcade.moveToXY(this.obj, this.path[0][0] * this.tileSize, this.path[0][1] * this.tileSize, 1);
		}

		this.path.splice(0,1);
	},

	createBlock: function(size, color) {
		var name = size.x + '_' + color;

		var bmd = this.game.add.bitmapData(size.x, size.y);
		bmd.ctx.fillStyle = color;
		bmd.ctx.fillRect(0,0, size.x, size.y);

		return bmd;
	},

	getSprite: function(){
		return this.obj;
	},

	getLife: function(){
		return this.infoEnnemie.life;
	},

	hitLife: function(){
		this.infoEnnemie.life -= 1;
	},

	setLife: function(tmp){
		this.infoEnnemie.life = tmp;
	},

	getPosition: function(){
		return { x: this.obj.x, y: this.obj.y };
	},

	setPosition: function(pos){
		this.obj.x = pos.x;
		this.obj.y = pos.y;
	},

	getTarget: function(){
		return this.target;
	},

	setTarget: function(target){
		this.target = target;
	},

	getPositionOnMap: function(){

		var i = Math.floor(this.obj.x / this.tileSize);
		var u = Math.floor(this.obj.y / this.tileSize);

		return {x: i, y:u};
	},

	getPath: function(){
		return this.path;
	},

	setPath: function(path){
		this.path = path;
	},
}