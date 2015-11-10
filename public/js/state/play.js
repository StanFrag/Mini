var play = function(game){
	_currentPlayState = this;
	this.room = null;

	this.map = null;
	this.layer = null;
	this.tileSize = 20;

	this.playersArray = [];

	this.vitPlayers = 150;
	this.stateArray = [];

	this.gameMode = false;

	this.constructionPicker = null;
	this.constructionTimeText = null;
	this.constructionTimeValue = 0;
	this.constructionTimeEnd = "10";
	this.constructionMarker = null;
	this.constructionCurrentTile = 31;

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

		this.game.load.tilemap('map', HOST + 'maps/map_level_'+ this.room.level +'.json', null, Phaser.Tilemap.TILED_JSON);
    	this.game.load.image('tiles', 'img/tile.png');
    	this.game.load.spritesheet('constructionTiles', 'img/tile.png', 32, 32, 50, 1, 1);
	},

  	create: function(){
  		// Init les parametres du game
  		this.initGameParams();
  		// Init la map du jeu
  		this.initMap();

  		this.initPlayers();
  		this.initBullets();

  		this.socketReception();

  		var tmpClient = this.getCurrentUserById(USER_ID);
  		this.game.world.camera.focusOnXY(tmpClient.getPosition().x,tmpClient.getPosition().y);

  		// Init du pre-mode permettant de modifier l'environnement
  		this.initConstructionState();
	},

	// Loop du jeu
	update: function(){
		// Si le jeu n'est pas en mode construction
		if(this.gameMode)
		{
			this.updateGameElements();
			this.clientFollowPointer();
		}

		// Update du construction picker pour reception des sockets dans la classe
		this.constructionPicker.update();

		this.KeyController();
	},

	// Rotation du player client selon le pointer
	clientFollowPointer: function(){

		// On recupere le client
		var client = this.getCurrentUserById(USER_ID);

		// On fait que le client suive sa souris
		client.followPointer();

		// On envoi les données receuilli au serveur
		socket.emit('player.rotation', { idUser: USER_ID, room: this.room.idRoom, rotation: client.getRotation() });
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
		if(this.gameMode){
			var client = this.getCurrentUserById(USER_ID);

		    if (this.cursor.right.isDown){

		    	var id = this.generateId();

		    	this.stateArray.push({ y: 0, x: 150, stateId: id, lastState: client.getState() });
		        //client.setAngle(5);
		        client.moveX(150);

		        socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, y: 0, x: 150, stateId: id, lastState: client.getState() });

		        console.log("right")
		    }else{
	        	var id = this.generateId();

	        	this.stateArray.push({ y: 0, x:0, stateId: id, lastState: client.getState() });
	            client.moveX(0);

	            socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, y: 0, x:0, stateId: id, lastState: client.getState() });
		    }

		    if (this.cursor.left.isDown){

		    	var id = this.generateId();

		    	this.stateArray.push({ y: 0, x: -150, stateId: id, lastState: client.getState() });
		        //client.setAngle(5);
		        client.moveX(-150);

		        socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, y: 0, x: -150, stateId: id, lastState: client.getState() });

		        console.log("left")
		    }else{
	        	var id = this.generateId();

	        	this.stateArray.push({ y: 0, x:0, stateId: id, lastState: client.getState() });
	            client.moveX(0);

	            socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, y: 0, x:0, stateId: id, lastState: client.getState() });
		    }

		    if(this.cursor.up.isDown){

		    	var id = this.generateId();

		        //  The speed we'll travel at
		        this.stateArray.push({ y: 250, x: 0, stateId: id, lastState: client.getState() });
		        client.moveY(250);

		        socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, y: 250, x:0, stateId: id, lastState: client.getState() });

		        console.log("up")
		    }else{
	        	var id = this.generateId();

	        	this.stateArray.push({ y: 0, x:0, stateId: id, lastState: client.getState() });
	            client.moveY(0);

	            socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, y: 0, x:0, stateId: id, lastState: client.getState() });
		    }

		    if (this.cursor.down.isDown){
	        	var id = this.generateId();

	        	this.stateArray.push({ y: -150, x:0, stateId: id, lastState: client.getState() });
	            client.moveY(-150);

	            socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, y: -150, x:0, stateId: id, lastState: client.getState() });

	            console.log("down")
		    }else{
	        	var id = this.generateId();

	        	this.stateArray.push({ y: 0, x:0, stateId: id, lastState: client.getState() });
	            client.moveY(0);

	            socket.emit('player.move', { idUser: USER_ID, room: this.room.idRoom, y: 0, x:0, stateId: id, lastState: client.getState() });
		    }

		    if (this.game.input.activePointer.isDown)
		    {
		    	var client = this.getCurrentUserById(USER_ID);
		        this.fire({ x: this.game.input.x,  y: this.game.input.y }, client);
		    }

		    var tmpPos = client.getPosition();
		    this.game.world.camera.focusOnXY(tmpPos.x,tmpPos.y);
		}else{

			this.constructionMarker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 32;
    		this.constructionMarker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 32;

		    if (this.cursor.up.isDown){
		        this.game.camera.y -= 4;
		    }else if (this.cursor.down.isDown){
		        this.game.camera.y += 4;
		    }

		    if (this.cursor.left.isDown){
		        this.game.camera.x -= 4;
		    }else if (this.cursor.right.isDown){
		        this.game.camera.x += 4;
		    }

		    if (this.game.input.activePointer.isDown)
		    {
		    	socket.emit('construction.changeTile', { room: this.room.idRoom, tile: this.constructionPicker.getCurrentTile(), marker: { x: this.constructionMarker.x, y: this.constructionMarker.y } });
		    }
		}
		
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
						if(_currentPlayState.stateArray[i].x > 0){
							client.moveX(_currentPlayState.stateArray[i].x);
						}

						if(_currentPlayState.stateArray[i].y > 0){
							client.moveY(_currentPlayState.stateArray[i].y);
						}
					}

					_currentPlayState.stateArray.splice(0,1);
				}	

			}else{

				var client = _currentPlayState.getCurrentUserById(data.idUser);

				client.setState(data.lastState);

				client.move({x: data.x, y: data.y});

				if(data.stateArray[i].x > 0){
					client.moveX(data.stateArray[i].x);
				}

				if(data.stateArray[i].y > 0){
					client.moveY(data.stateArray[i].y);
				}
			}
		});

		socket.on('tile.shot', function(data){
			var array = _currentPlayState.room.lifeMap;
			_currentPlayState.room.lifeMap[data.tileY][data.tileX].life = array[data.tileY][data.tileX].life - 1;

			if(_currentPlayState.room.lifeMap[data.tileY][data.tileX].life == 0){
				console.log("tuile dead");
				var map = _currentPlayState.map.getMap();
	    		map.putTile(_currentPlayState.room.defaultBlock, _currentPlayState.layer.getTileX(data.tileY), _currentPlayState.layer.getTileY(data.tileX));
			}
		});

		socket.on('construction.end', function(data){
			_currentPlayState.gameMode = true;
			_currentPlayState.constructionPicker.hide();
			_currentPlayState.constructionTimeText.destroy();
			_currentPlayState.constructionMarker.destroy();
		});

		socket.on('construction.ready', function(data){
			_currentPlayState.ready = data.ready;
		});

		socket.on('construction.bip', function(data){
			_currentPlayState.constructionTimeText.text = data;
			_currentPlayState.constructionTimeText.alpha = 0.1;

			tweenText = _currentPlayState.game.add.tween(_currentPlayState.constructionTimeText);
		    tweenText.to( { alpha: 1 }, 1000, "Linear", true);
		});

		socket.on('construction.changeTile', function(data){
			var map = _currentPlayState.map.getMap();
			var array = _currentPlayState.room.lifeMap;

			// on modifie la tuile au niveau du tableau des lifes
			_currentPlayState.room.lifeMap[data.marker.x][data.marker.y] = {index: data.tile.index, life};
			// Puis on remplace la tile ciblé
		    map.putTile(data.tile, _currentPlayState.layer.getTileX(data.marker.x), _currentPlayState.layer.getTileY(data.marker.y));
		});
	},

	updateGameElements: function(){
		var client = _currentPlayState.getCurrentUserById(USER_ID);

		this.game.physics.arcade.collide(client.getSprite(), this.layer, this.colisionLayer);
		this.game.physics.arcade.collide(this.bullets, this.layer, this.colisionBulletToTiles);

		this.updateArray(this.playersArray);
	},

	colisionLayer: function(){
		console.log("collision detecté");
	},

	colisionBulletToTiles: function(bullet, tile){
		// Lors d'une collision entre une balle et une tuile dur
		// On kill la balle
		// On decremente la vie de la tuile - A FAIRE
		
		bullet.kill();
		console.log('Tile',tile);
		socket.emit('tile.shot', { tileX: tile.x, tileY: tile.y, index: tile.index });
		//var map = _currentPlayState.map.getMap();
		//map.putTile(30, tile.x, tile.y);
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
		this.map = new Map(this.game);
		this.layer = this.map.getLayer();
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

	initConstructionState: function(){
		this.constructionTimeText = this.add.text(this.game.width / 2, 100, "Construsez votre base!", 
			{
				font: "40px Arial",
				fill: "#313131",
				align: "center",
				wordWrap: true,
				wordWrapWidth: this.game.world.width
			}
		);

		this.constructionTimeText.alpha = 1;
	    this.constructionTimeText.anchor.set(0.5);
	    this.constructionTimeText.fixedToCamera = true;

	    this.constructionMarker = this.game.add.graphics();
	    this.constructionMarker.lineStyle(2, 0x49C833, 1);
	    this.constructionMarker.drawRect(0, 0, 32, 32);

	    this.constructionPicker = new ConstructionPicker(this.game);

	    socket.emit('construction.ready', { room: this.room.idRoom });
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