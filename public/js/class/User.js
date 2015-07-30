User = function(game, pos, color){
	this.game = game;

	this.pos = pos;
	this.color = color;
	this.user;

	this.create();
};
  
User.prototype = {

	preload: function(){
	},

  	create: function(){

  		this.user = this.game.add.sprite(this.pos.x, this.pos.y, this.createBlock({x:32,y:32}, this.color));
		this.user.anchor.setTo(0.5, 0.5);

		this.game.physics.arcade.enableBody(this.user);

		this.user.body.collideWorldBounds = false;
		this.user.body.mass = 40;
	},

	update: function(){
    	this.user.rotation = this.game.physics.arcade.angleToPointer(this.user);
	},

	createBlock: function(size, color) {
		var name = size.x + '_' + color;

		var bmd = this.game.add.bitmapData(size.x, size.y);
		bmd.ctx.fillStyle = color;
		bmd.ctx.fillRect(0,0, size.x, size.y);

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