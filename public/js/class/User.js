User = function(game, pos, color){
	this.currentGame = game;
	this.textureRegistry = {};
	this.pos = pos;
	this.color = color;
	this.user;

	decelerationRate = 3;

	this.create();
};
  
User.prototype = {

	preload: function(){
	},

  	create: function(){

  		this.user = this.currentGame.add.sprite(this.pos.x, this.pos.y, this.createBlock({x:32,y:32}, this.color));
		this.user.anchor.setTo(0.5, 0.5);

		this.currentGame.physics.arcade.enableBody(this.user);

		this.user.body.collideWorldBounds = false;
		this.user.body.mass = 40;
	},

	update: function(){
		
		if (this.user.body.velocity.x < 0) {
			this.user.body.velocity.x += decelerationRate;
		}else if(this.user.body.velocity.x > 0){
			this.user.body.velocity.x -= decelerationRate;
		}

		//this.detectLimitWorld();
	},

	detectLimitWorld: function(){
		if(this.user.x < 0){
			this.user.x = this.currentGame.world.width;
		}else if(this.user.x > 0){
			this.user.x = 0
		}

		if(this.user.y < 0){
			this.user.y = 0;
		}else if(this.user.y > this.currentGame.world.height){
			this.gameOver();
		}
	},

	gameOver: function(){
		console.log("Game over");
		this.user.kill();
	},

	createBlock: function(size, color) {
		var name = size.x + '_' + color;

		if(this.textureRegistry[name]) {
			return this.textureRegistry[name];
		}

		var bmd = this.currentGame.add.bitmapData(size.x, size.y);
		bmd.ctx.fillStyle = color;
		bmd.ctx.fillRect(0,0, size.x, size.y);
		this.textureRegistry[name] = bmd;
		return bmd;
	},

	moveToX: function(posX){
		//this.user.x = this.user.x + posX;
		this.user.body.x += posX;
	},

	moveToY: function(posY){
		//this.user.y = this.user.y - posY;
		this.user.body.y -= posY;
	},

	getSprite: function(){
		return this.user;
	},

	getBody: function(){
		return this.user.body;
	},

	getPosition: function(){
		return {x: this.user.x, y: this.user.y}
	},

	getPosX: function(){
		return this.user.x;
	},

	setPosX: function(posX){
		this.user.x = posX;
	},

	setPosition: function(x,y){
		this.user.y = y;
        this.user.x = x;
	},
}