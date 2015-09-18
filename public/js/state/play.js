var play = function(game){
	_currentPlayState = this;
	this.room = null;

	this.map = null;
	this.tileSize = 20;

	this.playersArray = [];

	this.vitPlayers = 150;
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
		//this.updateGameElements();
		//this.clientFollowPointer();

		this.KeyController();
	},

	// Rendu des debugs
	render: function(){
		this.game.debug.text(currentGame.time.suggestedFps, 32, 32);
		//this.Game.debug.text(currentGame.time.physicsElapsed, 32, 52);

		for(var i = 0; i < this.playersArray.length; i++){
			this.game.debug.body(this.playersArray[i].getSprite());
		}

		var dataMap = this.map.getMap();

		for(var i = 0; i < dataMap.length; i++){
			this.game.debug.body(dataMap[i]);
		}
	},

	// Fonction de win du level
	winLevel: function(){
		console.log("youhouuuuu le niveau est OVERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
	},

	// Controle des raccourcies claviers
	KeyController: function(){

		var client = this.getCurrentUserById(USER_ID);

	    if (cursors.left.isDown){
	    	client.move({x: -this.vitPlayers, y:0});
	    	//client.turnAroundPointer(this.vitPlayers);
	    	socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, pos: client.getPosition() });
	    }else if (cursors.right.isDown){
	    	client.move({x: this.vitPlayers, y:0});
	    	//client.turnAroundPointer(-this.vitPlayers);
	    	socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, pos: client.getPosition() });
	    }

	    if(cursors.up.isDown){
	    	client.move({x: 0, y:-this.vitPlayers});
	    	//client.setSpeed(this.vitPlayers);
	    	socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, pos: client.getPosition() });
	    }else if(cursors.down.isDown){
	    	client.move({x: 0, y:this.vitPlayers});
	    	//client.setSpeed(-this.vitPlayers);
	    	socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, pos: client.getPosition() });
	    }

	},

	// Sur la reception d'un action serveur
	socketReception: function(){
		// Si un joueur se deplace
		socket.on('player.move', function(data){
			// Si le joueurs qui a effectué l'action n'est poas le client
			if(data.idUser != USER_ID){
				// On Move le player ciblé
				var tmpUser = _currentPlayState.getCurrentUserById(data.idUser);
				tmpUser.setPosition(data.position);
			}
		});
	},

	// Function simple d'update d'Array
	updateArray: function(currentArray){
		for(var i = 0; i < currentArray.length; i++){
			currentArray[i].update();
		}
	},

	// Fonction qui va créer la map recuperé depuis le serveur
	initMap: function(){
		/***************/
		/****A FAIRE****/
		/***************/

		// La map sera créer a l'aide du json recuperé
		// Elle ira chercher les sprites pour et créera la map dynamiquement
		this.map = new Map(this.game, this.room.map, this.tileSize);
	},

	// Initiation des players dans le partie
	initPlayers: function(){

		// Pour chaque players recuperé depuis le serveur
		for(var i = 0; i < this.room.players.length; i++){

			// On crée une couleur de base pour l'ensemble des players present
			var colorPlayer = '#C2472C';

			// Si le client est le joueurs ciblé
			if (this.room.players[i].idPlayer == USER_ID) {
				// On change la couleur pour qu'il se demarque des autres players
				colorPlayer = '#1DCE1F';
			};

			console.log("x:",this.room.players[i].initialPos.posX," y: ",this.room.players[i].initialPos.posY);
			// Puis on crée le User à la position donné par le serveur
			var user = new User(this.game, {x: this.room.players[i].initialPos.posX, y: this.room.players[i].initialPos.posY}, colorPlayer, this.room.players[i].idPlayer, this.tileSize);

			// Et on le push dans le tableau des joueurs present sur la partie
			this.playersArray.push(user);
		}
	},

	// Initiation des parametres de la partie
	initGameParams: function(){
		// Set FPS
		this.game.time.desiredFps = 60;

		// Permettre les evenements claviers
		cursors = this.game.input.keyboard.createCursorKeys();

		//currentGame.renderer.clearBeforeRender = false;
		currentGame.renderer.roundPixels = true;
	},

	getCurrentUserById: function(targetId){
		for(var i = 0; i < this.playersArray.length; i++){
			if(this.playersArray[i].getUserId() == targetId){
				return this.playersArray[i];
			}
		}
	},
}