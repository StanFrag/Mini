User = function(game, pos, color, idUser){
	this.game = game;

	this.pos = pos;
	this.color = color;
	this.user;

	this.speed = 0;
	this.ratioDecelerate = 15;

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
		if(this.user.body.velocity.x < 0){
			this.user.body.velocity.x += this.ratioDecelerate;
		}else if(this.user.body.velocity.x > 0){
			this.user.body.velocity.x -= this.ratioDecelerate;
		}

		if(this.user.body.velocity.y < 0){
			this.user.body.velocity.y += this.ratioDecelerate;
		}else if(this.user.body.velocity.y > 0){
			this.user.body.velocity.y -= this.ratioDecelerate;
		}
		
	},

	turnAroundPointer: function(value){
		this.game.physics.arcade.velocityFromAngle(this.user.angle - 90, value, this.user.body.velocity);
	},
	
	move: function(pos){
		this.user.body.velocity.x = pos.x;
		this.user.body.velocity.y = pos.y;
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

	getPosition: function(){
		return { x: this.user.x, y: this.user.y };
	},

	setPosition: function(pos){
		this.user.x = pos.x;
		this.user.y = pos.y;
	}
}