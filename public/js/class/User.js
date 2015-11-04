User = function(game, params, color, idUser, tileSize){
	// Recuperation de l'instance de game
	this.game = game;

	// Récuperation des parametres du joueur
	this.pos = params.pos;
	this.color = params.color;
	this.tileSize = params.tileSize;
	this.idUser = params.id;

	// Instanciation de l'object player
	this.user;

	// On lance le create
	this.create();
};
  
User.prototype = {

	preload: function(){
	},

  	create: function(){
  		// Creation du sprite
  		// !!!! On modifiera ca pour faire des sprites avec des images ensuite
  		this.user = this.game.add.sprite(this.pos.x, this.pos.y, this.createBlock({x:15,y:15}, this.color));

  		this.user.angle = 0;

  		// On place l'anchor du player au centre
		this.user.anchor.setTo(0.5, 0.5);

		// On Enable la physique du player
		this.game.physics.arcade.enableBody(this.user);

		// Collide il avec le world? Oui la
		this.user.body.collideWorldBounds = true;

		// Masse du player // je sais pas trop encore a quoi ca sert
		this.user.body.mass = 40;
	},

	update: function(){
		if (this.currentSpeedX > 0.5){
	    	this.game.physics.arcade.velocityFromAngle(360, this.currentSpeedX, this.user.body.velocity);
	    }else if(this.currentSpeedX < 0){
	    	this.game.physics.arcade.velocityFromAngle(180, - this.currentSpeedX, this.user.body.velocity);
	    }else if (this.currentSpeedY > 0.5){
	    	this.game.physics.arcade.velocityFromAngle(270, this.currentSpeedY, this.user.body.velocity);
	    }else if(this.currentSpeedY < 0){
	    	this.game.physics.arcade.velocityFromAngle(90, - this.currentSpeedY, this.user.body.velocity);
	    }else{
	    	this.game.physics.arcade.velocityFromAngle(0, 0, this.user.body.velocity);
	    }
	},

	followPointer: function(){
		this.user.rotation = this.game.physics.arcade.angleToPointer(this.user);
	},

	moveX: function(value){
		this.currentSpeedX = value;
	},

	moveY: function(value){
		this.currentSpeedY = value;
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

	getAngle: function(){
		return this.user.angle;
	},

	setAngle: function(value){
		this.user.angle += value;
	},

	getRotation: function(){
		return this.user.rotation;
	},

	setRotation: function(value){
		this.user.rotation = value;
	},

	getCurrentSpeedX: function(){
		return this.currentSpeedX;
	},

	setCurrentSpeedX: function(value){
		this.currentSpeedX = value;
	},

	getCurrentAngle: function(){
		return this.currentSpeedX;
	},

	setCurrentAngle: function(value){
		this.currentAngle = value;
	},

	getPosition: function(){
		return { x: this.user.x, y: this.user.y };
	},

	setPosition: function(pos){
		this.user.x = pos.x;
		this.user.y = pos.y;
	},

	getState: function(){
		return { rotation: this.user.rotation, pos: {x: this.user.x, y: this.user.y} };
	},

	setState: function(data){
		this.user.rotation = data.rotation;

		this.user.x = data.pos.x;
		this.user.y = data.pos.y;
	},

	createBlock: function(size, color) {
		var name = size.x + '_' + color;

		var bmd = this.game.add.bitmapData(size.x, size.y);
		bmd.ctx.fillStyle = color;
		bmd.ctx.fillRect(0,0, size.x, size.y);

		return bmd;
	},
}