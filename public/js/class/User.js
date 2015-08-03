User = function(game, pos, color, idUser){
	this.game = game;

	this.pos = pos;
	this.color = color;
	this.user;

	this.speed = 0;
	this.ratioDecelerate = 5;

	this.revolutionRate = 0;

	this.idUser = idUser;

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

		if(this.speed > 0){
			this.speed -= this.ratioDecelerate;
		}else if(this.speed < 0){
			this.speed += this.ratioDecelerate;
		}

    	this.game.physics.arcade.velocityFromRotation(this.user.rotation, this.speed, this.user.body.velocity);
	},

	getTangente: function(valueX){

		var targetAngle = this.game.math.angleBetween(
			this.game.input.activePointer.x, this.game.input.activePointer.y,
	        this.user.x, this.user.y	        
	    );

	    var angle = (this.user.y - this.game.input.activePointer.y) / (this.user.x - this.game.input.activePointer.x);

        var b = angle * this.user.x + this.user.y;
        var x = valueX;
        var y = angle * x + b;

        return y;
	},

	revolution: function(value){
		var dec = 50;

        this.user.x += value / dec;
        this.user.y += this.getTangente(value) / dec;
	},

	followPointer: function(){
		this.user.rotation = this.game.physics.arcade.angleToPointer(this.user);
	},

	createBlock: function(size, color) {
		var name = size.x + '_' + color;

		var bmd = this.game.add.bitmapData(size.x, size.y);
		bmd.ctx.fillStyle = color;
		bmd.ctx.fillRect(0,0, size.x, size.y);

		return bmd;
	},

	getSprite: function(){
		return this.user;
	},

	getUserId: function(){
		return this.idUser;
	},

	setUserId: function(tmpId){
		this.idUser = tmpId;
	},

	getRotation: function(){
		return this.user.rotation;
	},

	setRotation: function(value){
		this.user.rotation = value;
	},

	getSpeed: function(){
		return this.speed;
	},

	setSpeed: function(value){
		this.speed = value;
	},

	getSpeedSide: function(){
		return this.speedSide;
	},

	setSpeedSide: function(value){
		this.speedSide = value;
	},
}