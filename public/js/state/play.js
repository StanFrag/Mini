var play = function(game){

	currentGame = game;

	player1 = null;
	player2 = null;
	templateMap = null;

	playersArray = {};
	distMovePlayers = 5;
	jumpRate = 350;
	isJumping = false;

	playerMouvementX = [];
	playerMouvementY = [];

	platform = null;
	cursors = null;
};
  
play.prototype = {

	// Fonction de base permettant de recuperer les parametres du state precedent
	init: function(firstUser, secondUser, template){
		player1 = firstUser;
		player2 = secondUser;
		templateMap = template;
	},

	// Preload de l'ensemble des elements necessaire au jeu
	preload: function(){
		// Preloas des Assets
		currentGame.load.image("ground","img/ground.png");

		// Permet de rester en focus sur le jeu quand le joueur unfocus la page
		this.game.stage.disableVisibilityChange = true;
	},

	// Initialisation de l'ensemble des elements du jeu
  	create: function(){
  		this.initPlayers();
  		this.initMap();
		this.initGameParams();
		this.socketReception();
	},

	// Loop du jeu
	update: function(){

		for(var i in playersArray)
		{
			playersArray[i].update();
		}

		this.CollideController();
		this.KeyController();
	},

	// Rendu des debugs
	render: function(){
		currentGame.debug.text(currentGame.time.suggestedFps, 32, 32);
		currentGame.debug.text(currentGame.time.physicsElapsed, 32, 52);
	},

	initPlayers: function(){

		var colorObjOne = 'green';
		var colorObjTwo = 'red';

		// On attribu la couleur verte a son personnage
		if(USER_ID == player2.user){
			colorObjOne = 'red';
			colorObjTwo = 'green';
		}

		// Création des deux nouveaux joueurs
		var tmpOne = new User(currentGame, {x: player1.x, y: 500}, colorObjOne);
		var tmpTwo = new User(currentGame, {x: player2.x, y: 500}, colorObjTwo);

		// Ajout dans le tableau des joueurs des deux nouveaux joueurs
		playersArray[player1.user] = tmpOne;
		playersArray[player2.user] = tmpTwo;
	},

	initMap: function(){
		platform = new Map(currentGame, templateMap);
	},

	initGameParams: function(){
		currentGame.physics.arcade.gravity.y = 1200; 				// Set the world (global) gravity
		currentGame.physics.arcade.friction = 5;   					// default friction between ground and player or fireballs
		currentGame.time.desiredFps = 60; 							// Set FPS

		cursors = currentGame.input.keyboard.createCursorKeys();	// Allow keyboard event

		//currentGame.renderer.clearBeforeRender = false;
		currentGame.renderer.roundPixels = true;
	},

	CollideController: function(){

		for(var i in playersArray)
		{
			if(USER_ID != playersArray[i]){
				this.game.physics.arcade.collide(playersArray[USER_ID].getSprite(), playersArray[i].getSprite(), this.collidePlayer);

				var mapArray = platform.elementsArray;

				for(var u = 0; u < mapArray.length; u++){
					this.game.physics.arcade.collide(playersArray[USER_ID].getSprite(), mapArray[u], this.collideWithWorld(this));
					this.game.physics.arcade.collide(playersArray[i].getSprite(), mapArray[u]);
				}
			}
		}
	},

	collidePlayer: function(){
		//console.log("collision with players");
	},
	
	collideWithWorld: function(state){
		isJumping = false;

		//state.socketEmit('replace.player.client', { posX: playersArray[USER_ID].getPosX() });
	},

	KeyController: function(){

	    if (cursors.left.isDown){
	    	// Envoi du mouvement au serveur
	    	this.socketEmit('move.player.client', {posX: - distMovePlayers});

	    	// On envoi la position du players avant d'avoir recu la VRAI position du player par le serveur, cela permet d'eviter un delay de traitement supplementaire
	    	playersArray[USER_ID].moveToX(-distMovePlayers);

	    	// On garde une trace des mouvements envoyés au serveur
	    	playerMouvementX.push(-distMovePlayers);

	    }else if (cursors.right.isDown){
	    	// Envoi du mouvement au serveur
	    	this.socketEmit('move.player.client', {posX: distMovePlayers});

	    	// On envoi la position du players avant d'avoir recu la VRAI position du player par le serveur, cela permet d'eviter un delay de traitement supplementaire
	    	playersArray[USER_ID].moveToX(distMovePlayers);

	    	// On garde une trace des mouvements envoyés au serveur
	    	playerMouvementX.push(distMovePlayers);
	    }

	    if(cursors.up.isDown){
    		if(!isJumping){
    			// Envoi du mouvement au serveur
    			this.socketEmit('jump.player.client', {posY : jumpRate});
    			isJumping = true;

    			// On envoi la position du players avant d'avoir recu la VRAI position du player par le serveur, cela permet d'eviter un delay de traitement supplementaire
	    		playersArray[USER_ID].moveToY(jumpRate);

	    		// On garde une trace des mouvements envoyés au serveur
	    		playerMouvementY.push(jumpRate);
    		}
	    }
	},

	socketReception: function(){

		socket.on('move.player.server', function(data){

			var obj = JSON.parse(data);

			if(obj.posX == playerMouvementX[0]){

				playerMouvementX.splice(0,1);

				playerMouvementX.forEach(function(data){
					playersArray[obj.idPlayer].moveToX(data);
				})

			}else{
				playersArray[obj.idPlayer].moveToX(obj.posX);
			}

		});

		socket.on('jump.player.server', function(data){
			var obj = JSON.parse(data);

			if(obj.posY == playerMouvementY[0]){

				playerMouvementY.splice(0,1);

				playerMouvementY.forEach(function(data){
					playersArray[obj.idPlayer].moveToY(data);
				})

			}else{
				playersArray[obj.idPlayer].moveToY(obj.posX);
			}
		});

	},

	socketEmit: function(name, obj){
		var tmp = JSON.stringify({room: USER_ROOM, idPlayer: USER_ID, params: obj});
		socket.emit(name, tmp);
	},

	
}