User = function(game, params, color, idUser, tileSize){
	// Recuperation de l'instance de game
	this.game = game;

	// Récuperation des parametres du joueur
	this.pos = params.pos;
	this.color = params.color;
	this.tileSize = params.tileSize;
	this.idUser = params.id;

	this.currentSpeed = 0;

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

		this.game.physics.arcade.velocityFromRotation(this.user.rotation, 0, this.user.body.velocity);
	},

	update: function(){
		if (this.currentSpeed > 0){
	    	this.game.physics.arcade.velocityFromRotation(this.user.rotation, this.currentSpeed, this.user.body.velocity);
	    }else{
	    	this.game.physics.arcade.velocityFromRotation(this.user.rotation, 0, this.user.body.velocity);
	    }
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

	getCurrentSpeed: function(){
		return this.currentSpeed;
	},

	setCurrentSpeed: function(value){
		this.currentSpeed = value;
	},

	getPosition: function(){
		return { x: this.user.x, y: this.user.y };
	},

	setPosition: function(pos){
		this.user.x = pos.x;
		this.user.y = pos.y;
	},

	createBlock: function(size, color) {
		var name = size.x + '_' + color;

		var bmd = this.game.add.bitmapData(size.x, size.y);
		bmd.ctx.fillStyle = color;
		bmd.ctx.fillRect(0,0, size.x, size.y);

		return bmd;
	},
}