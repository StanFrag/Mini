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
  		this.user = this.game.add.sprite(this.pos.x, this.pos.y, this.createBlock({x:10,y:10}, this.color));

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
		
	},

	move: function(position){
		// On change les coordonnées du players avec celle recu par le serveur
		this.user.body.x = this.user.x + position.x;
		this.user.body.y = this.user.y + position.y;
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
	},
}