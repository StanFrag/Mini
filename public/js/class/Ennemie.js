Ennemie = function(game, currentEnnemie){
	this.game = game;
	this.infoEnnemie = currentEnnemie;
	this.obj = null;
	this.target = null;
	this.color = '#4169e1';

	this.MAX_SPEED = 250; // pixels/second
    this.MIN_DISTANCE = 32; // pixels

	this.create();
};
  
Ennemie.prototype = {

	preload: function(){
	},

  	create: function(){
  		this.obj = this.game.add.sprite(this.infoEnnemie.x, this.infoEnnemie.y, this.createBlock({x:15,y:15}, this.color));
		this.obj.anchor.setTo(0.5, 0.5);

		this.game.physics.arcade.enableBody(this.obj);

		this.obj.body.collideWorldBounds = false;
		this.obj.body.mass = 2000;
	    this.obj.body.alive = false;
	},

	update: function(){
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
	}
}