var play = function(game){
	_currentPlayState = this;
	this.room = null;

	this.playersArray = [];

	this.vitPlayers = 100;
	this.currentWeapon = {fireRate : 100, nextFire: 0};
};
  
play.prototype = {

	// Fonction de base permettant de recuperer les parametres du state precedent
	init: function(currentRoom){
		this.room = currentRoom;
	},

	// Preload de l'ensemble des elements necessaire au jeu
	preload: function(){
		// Permet de rester en focus sur le jeu quand le joueur unfocus la page
		this.game.stage.disableVisibilityChange = true;
	},

	// Initialisation de l'ensemble des elements du jeu
  	create: function(){
  		this.initMap();
  		this.initPlayers();
  		this.initGameParams();

  		this.socketReception();
	},

	// Loop du jeu
	update: function(){
		this.updatePlayers();
		this.clientFollowPointer();

		this.KeyController();
	},

	// Rendu des debugs
	render: function(){
		this.game.debug.text(currentGame.time.suggestedFps, 32, 32);
		//this.Game.debug.text(currentGame.time.physicsElapsed, 32, 52);
	},

	initGameParams: function(){
		this.game.time.desiredFps = 60; 							// Set FPS

		cursors = this.game.input.keyboard.createCursorKeys();	// Allow keyboard event

		//currentGame.renderer.clearBeforeRender = false;
		currentGame.renderer.roundPixels = true;
	},

	KeyController: function(){

		var client = this.getCurrentUserById(USER_ID);

	    if (cursors.left.isDown){
	    	client.turnAroundPointer(this.vitPlayers);
	    	socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, pos: client.getPosition() });
	    }else if (cursors.right.isDown){
	    	client.turnAroundPointer(-this.vitPlayers);
	    	socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, pos: client.getPosition() });
	    }

	    if(cursors.up.isDown){
	    	client.setSpeed(this.vitPlayers);
	    	socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, pos: client.getPosition() });
	    }else if(cursors.down.isDown){
	    	client.setSpeed(-this.vitPlayers);
	    	socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, pos: client.getPosition() });
	    }

	    if (this.game.input.activePointer.isDown)
	    {
	        this.fire();
	    }

	},

	fire: function() {
	    if (this.game.time.now > this.currentWeapon.nextFire)
	    {
	        this.currentWeapon.nextFire = this.game.time.now + this.currentWeapon.fireRate;

	        var bullet = new Bullet(this.game, this.currentWeapon, this.getCurrentUserById(USER_ID).getPosition(), {x:this.game.input.activePointer.x, y: this.game.input.activePointer.y });
	        bullet.update();
	    }
	},

	socketReception: function(){
		socket.on('player.rotation', function(data){
			var tmpUser = _currentPlayState.getCurrentUserById(data.idUser);
			tmpUser.setRotation(data.rotation);
		});

		socket.on('player.move', function(data){
			if(data.idUser != USER_ID){
				var tmpUser = _currentPlayState.getCurrentUserById(data.idUser);
				tmpUser.setPosition(data.position);
			}
		});
	},

	updatePlayers: function(){
		for(var i = 0; i < this.playersArray.length; i++){
			this.playersArray[i].update();
		}
	},

	clientFollowPointer: function(){

		var client = this.getCurrentUserById(USER_ID);
		// On fait que le client suive sa souris
		client.followPointer();

		// On envoi les données receuilli au serveur
		socket.emit('player.rotation', { idUser: USER_ID, room: this.room.idRoom, rotation: client.getRotation() });
	},

	initMap: function(){

	},

	initPlayers: function(){

		for(var i = 0; i < this.room.players.length; i++){
			var colorPlayer = '#828282';

			if (this.room.players[i].idPlayer == USER_ID) {
				colorPlayer = '#29BA2B';
			};

			var user = new User(this.game, {x: 150 + (i * 60), y: this.world.centerY}, colorPlayer, this.room.players[i].idPlayer);
			this.playersArray.push(user);
		}
	},

	getCurrentUserById: function(targetId){
		for(var i = 0; i < this.playersArray.length; i++){
			if(this.playersArray[i].getUserId() == targetId){
				return this.playersArray[i];
			}
		}
	},
}