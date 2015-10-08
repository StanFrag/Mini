var play = function(game){
	_currentPlayState = this;
	this.room = null;

	this.map = null;
	this.layer = null;
	this.tileSize = 20;

	this.playersArray = [];

	this.vitPlayers = 150;
	this.stateArray = [];

	this.cursor = null;

	this.currentWeapon = {fireRate : 100, nextFire: 0, bulletOnMap: 200, speedBullet: 500};
	this.countDead = 0;
	this.bullets = null;
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

		//this.game.load.tiledmap(CACHE_KEY('map', 'tiledmap'), HOST + 'maps/map.json', null, Phaser.Tilemap.TILED_JSON);
		//this.game.load.image(CACHE_KEY('map', 'tileset', 'Desert'), 'img/desert.png');

		this.game.load.tilemap('map', HOST + 'maps/map.json', null, Phaser.Tilemap.TILED_JSON);
    	this.game.load.image('tiles', 'img/tile.png');
	},

  	create: function(){

  		this.initGameParams();
  		this.initMap();
  		this.initPlayers();
  		this.initBullets();

  		var tmpClient = this.getCurrentUserById(USER_ID);

  		this.game.world.camera.focusOnXY(tmpClient.getPosition().x,tmpClient.getPosition().y);

  		this.socketReception();
	},

	// Loop du jeu
	update: function(){
		this.updateGameElements();
		this.clientFollowPointer();

		this.KeyController();
	},

	// Rotation du player client selon le pointer
	clientFollowPointer: function(){

		// On recupere le client
		var client = this.getCurrentUserById(USER_ID);

		// On fait que le client suive sa souris
		client.followPointer();

		// On envoi les données receuilli au serveur
		//socket.emit('player.rotation', { idUser: USER_ID, room: this.room.idRoom, rotation: client.getRotation() });
	},

	// Rendu des debugs
	render: function(){
		this.game.debug.text(currentGame.time.suggestedFps, 32, 32);
		this.game.debug.text(currentGame.time.physicsElapsed, 32, 52);
	},

	// Fonction de win du level
	winLevel: function(){
		console.log("game over");
	},

	// Controle des raccourcies claviers
	KeyController: function(){
		var client = this.getCurrentUserById(USER_ID);

	    if (this.cursor.left.isDown){

	    	var id = this.generateId();

	        // Ensuite on place l'action effectué dans le tableau des states
	        this.stateArray.push({speed: 0, angle: -150, stateId: id, lastState: client.getState()});
	    	// On bouge le client qui vient d'effectuer l'action
	        //client.setAngle(-5);
	        client.turnAroundPointer(-150);

	        // Et on envoi au serveur le mouvement effectué
	        socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, speed: 0, angle: -150, stateId: id, lastState: client.getState() });

	    }else if (this.cursor.right.isDown){

	    	var id = this.generateId();

	    	this.stateArray.push({speed: 0, angle: 150, stateId: id, lastState: client.getState()});
	        //client.setAngle(5);
	        client.turnAroundPointer(150);

	        socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, speed: 0, angle: 150, stateId: id, lastState: client.getState() });

	    } 

	    if (this.cursor.up.isDown){

	    	var id = this.generateId();

	        //  The speed we'll travel at
	        this.stateArray.push({speed: 300, angle:0, stateId: id, lastState: client.getState()});
	        client.setCurrentSpeed(300);

	        socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, speed: 300, angle:0, stateId: id, lastState: client.getState() });

	    }else{
        	var id = this.generateId();

        	this.stateArray.push({speed: -150, angle:0, stateId: id, lastState: client.getState()});
            client.setCurrentSpeed(-150);

            socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, speed: -150, angle:0, stateId: id, lastState: client.getState() });
	    }

	    if (this.game.input.activePointer.isDown)
	    {
	    	var client = this.getCurrentUserById(USER_ID);
	        this.fire({ x: this.game.input.x,  y: this.game.input.y }, client);
	    }

	    var tmpPos = client.getPosition();
	    //this.game.world.camera.focusOnXY(tmpPos.x,tmpPos.y);
	},

	// Le joueur client tire
	fire: function(target, user) {
	    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
	    if (this.game.time.now - this.lastBulletShotAt < this.currentWeapon.fireRate) return;
	    this.lastBulletShotAt = this.game.time.now;

	    // Get a dead bullet from the pool
	    var bullet = this.bullets.getFirstDead();

	    // If there aren't any bullets available then don't shoot
	    if (bullet === null || bullet === undefined) return;

	    // Revive the bullet
	    // This makes the bullet "alive"
	    bullet.revive();

	    // Bullets should kill themselves when they leave the world.
	    // Phaser takes care of this for me by setting this flag
	    // but you can do it yourself by killing the bullet if
	    // its x,y coordinates are outside of the world.
	    bullet.checkWorldBounds = true;
	    bullet.outOfBoundsKill = true;

	    var tmp = user.getPosition();

	    // Set the bullet position to the gun position.
	    bullet.reset(tmp.x, tmp.y);
	    bullet.rotation = user.getRotation();

	    // Shoot it in the right direction
	    bullet.body.velocity.x = Math.cos(bullet.rotation) * this.currentWeapon.speedBullet;
	    bullet.body.velocity.y = Math.sin(bullet.rotation) * this.currentWeapon.speedBullet;
	},

	// Sur la reception d'un action serveur
	socketReception: function(){

		// Si un joueur se deplace
		socket.on('player.move', function(data){

			// Si le joueurs qui a effectué l'action est le client
			if(data.idUser == USER_ID){

				// Si le premier state est bien le state retourné par le serveur
				if(data.stateId == _currentPlayState.stateArray[0].stateId){

					var client = _currentPlayState.getCurrentUserById(data.idUser);

					//client.setState(_currentPlayState.stateArray[0].lastState);

					for(var i = 0; i < _currentPlayState.stateArray.length; i++){

						if(_currentPlayState.stateArray[i].speed != 0){
							client.setCurrentSpeed(_currentPlayState.stateArray[i].speed);
						}

						if(_currentPlayState.stateArray[i].angle != 0){
							//client.setAngle(_currentPlayState.stateArray[i].angle);
							client.turnAroundPointer(_currentPlayState.stateArray[i].angle);
						}
					}

					_currentPlayState.stateArray.splice(0,1);
				}	

			}else{

				var client = _currentPlayState.getCurrentUserById(data.idUser);

				client.setState(data.lastState);

				if(data.speed != 0){
					client.setCurrentSpeed(data.speed);
				}

				if(data.angle != 0){
					//client.setAngle(data.angle);
					client.turnAroundPointer(data.angle);
				}
				
			}
		});
	},

	updateGameElements: function(){
		var client = _currentPlayState.getCurrentUserById(USER_ID)
		var layer = this.map.getLayer();

		this.game.physics.arcade.collide(client.getSprite(), layer, this.colisionLayer);

		this.updateArray(this.playersArray);
	},

	colisionLayer: function(){
		console.log("collision detecté");
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
		//this.map = this.game.add.tilemap('map', 16, 16);
		this.map = new Map(this.game, this.room.map, this.tileSize);
	},

	// Initiation des players dans le partie
	initPlayers: function(){

		// Pour chaque players recuperé depuis le serveur
		for(var i = 0; i < this.room.players.length; i++){

			// On crée une couleur de base pour l'ensemble des players present
			var colorPlayer = '#E60E0E';

			// Si le client est le joueurs ciblé
			if (this.room.players[i].idPlayer == USER_ID) {
				// On change la couleur pour qu'il se demarque des autres players
				colorPlayer = '#16E00E';
			};

			var user = new User(this.game, 
				{
					pos: 		{x: this.room.players[i].initialPos.posX, y: this.room.players[i].initialPos.posY}, 
					color: 		colorPlayer, 
					id: 		this.room.players[i].idPlayer, 
					tileSize: 	this.tileSize
				});

			this.playersArray.push(user);
		}
	},

	// Initiation du groupe des balles
	initBullets: function(){
		// Création du groupe
		this.bullets = this.game.add.group();

		// Parametres des balles crées
	    this.bullets.enableBody = true;
	    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

	    for (var i = 0; i < this.currentWeapon.bulletOnMap; i++) {
	    	// On crée une balle avec les caracteristiques de l'arme utilisé
	    	var bullet = new Bullet(this.game, this.currentWeapon, this.getCurrentUserById(USER_ID).getPosition(), {x:this.game.input.activePointer.x, y: this.game.input.activePointer.y });
	    	// On la push dans le group
	    	this.bullets.add(bullet.getSprite());
	    };

	    // Parametres des balles groupées
	    this.bullets.setAll('anchor.x', 0.5);
	    this.bullets.setAll('anchor.y', 0.5);
	    this.bullets.setAll('outOfBoundsKill', true); // Si la balle sort du cadre du jeu, est detruite
	    this.bullets.setAll('checkWorldBounds', true); // On check si la balle rebondie sur le mur
	    this.bullets.setAll('alive', false); // On met la balle en dead a son initiation

	    this.bullets.setAll('mass', 0.5); // On lui attribu une masse
	},

	// Initiation des parametres de la partie
	initGameParams: function(){
		// Set FPS
		this.game.time.desiredFps = 60;

		// Permettre les evenements claviers
		this.cursor = this.game.input.keyboard.createCursorKeys();

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

	generateId : function(){

	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for(var i=0; i < 5; i++)
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	},
}