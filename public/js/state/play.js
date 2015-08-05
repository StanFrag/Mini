var play = function(game){
	_currentPlayState = this;
	this.room = null;

	this.playersArray = [];

	this.vitPlayers = 100;

	this.currentWeapon = {fireRate : 100, nextFire: 0, bulletOnMap: 200, speedBullet: 500};
	this.countDead = 0;
	this.ennemies = [];
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
	},

	// Initialisation de l'ensemble des elements du jeu
  	create: function(){
  		this.initMap();
  		this.initPlayers();
  		this.initGameParams();
  		this.initEnnemy();
  		this.initBullets();

  		this.socketReception();
	},

	// Loop du jeu
	update: function(){
		this.updateGameElements();
		this.clientFollowPointer();
		this.detecteCollide();

		this.KeyController();
	},

	// Rendu des debugs
	render: function(){
		this.game.debug.text(currentGame.time.suggestedFps, 32, 32);
		//this.Game.debug.text(currentGame.time.physicsElapsed, 32, 52);
	},

	// Lancement de l'ensemble des fonctions de collisions 
	detecteCollide: function(){
		this.collideFromBullet();
	},

	// Collision depuis une balle
	collideFromBullet: function(){
		
		// Pour chaque bullet envoyé
		this.bullets.forEachAlive(function(bullet){
			// Et pour chaque ennemie present sur la map
			for(var i = 0; i < _currentPlayState.ennemies.length; i++){
				// On verifie qu'une collision n'a pas lieu entre les deux entité
				_currentPlayState.game.physics.arcade.collide(bullet, _currentPlayState.ennemies[i].getSprite(), function(bullet, ennemie){
					// Si les deux entités rentre en collision

					// On detruit la bullet
					bullet.kill();

					// Et si l'ennemie touché n'a plus de vie 
					if(_currentPlayState.ennemies[i].getLife() == 0){
						// On le detruit
						ennemie.kill();
						// On incremente le nombre de morts
						this.countDead++;

						// Si le nombre de mort n'est pas equivalent aux nombre max de monstre sur ce level
						if(this.countDead != _currentPlayState.room.ennemiesInfo.listEnnemies.length){
							// On instancie un nouvelle ennemie
							var ennemie = new Ennemie(_currentPlayState.game, _currentPlayState.room.ennemiesInfo.listEnnemies[_currentPlayState.countDead]);
	    					_currentPlayState.ennemies.push(ennemie);
						}else{
							// Sinon c'est une victoire vu que chaque monstre a bien ete detruit
							_currentPlayState.winLevel();
						}
					}else{
						// si l'ennemie possede encore de la vie on lui en retire une
						_currentPlayState.ennemies[i].hitLife();
					}
				});
			};
		});
			
	},

	// Fonction de win du level
	winLevel: function(){
		console.log("youhouuuuu le niveau est OVERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
	},

	// Controle des raccourcies claviers
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
	    	var client = this.getCurrentUserById(USER_ID);
	        this.fire({ x: this.game.input.x,  y: this.game.input.y }, client);
	    }

	},

	// Le joueur client tire
	fire: function(target, user) {
		// Si l'heure actuel est supperieur a la variable nextFire, et que le nombre de bullet dead est superieur a 0
	    if (this.game.time.now > this.currentWeapon.nextFire && this.bullets.countDead() > 0)
	    {
	    	// On incremente le nextFire pour le prochain tir
	        this.currentWeapon.nextFire = this.game.time.now + this.currentWeapon.fireRate;

	        // On recupere la premiere bullet dead
            var bullet = this.bullets.getFirstDead();
            // On  la reset sur l'initiateur du tir
            bullet.reset(user.getPosition().x , user.getPosition().y);

            // Et on envoi la bullet
	        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, target, this.currentWeapon.speedBullet);

	        // Puis on emit l'action au serveur pour la retranscrire aux autres participants
	        socket.emit('player.fire', { idUser: USER_ID, room: this.room.idRoom, target: target });
	    }
	},

	// Sur la reception d'un action serveur
	socketReception: function(){
		// Si un joueur effectue une rotation
		socket.on('player.rotation', function(data){
			// On rotate le joueur qui a envoyé l'action
			var tmpUser = _currentPlayState.getCurrentUserById(data.idUser);
			tmpUser.setRotation(data.rotation);
		});

		// Si un joueur se deplace
		socket.on('player.move', function(data){
			// Si le joueurs qui a effectué l'action n'est poas le client
			if(data.idUser != USER_ID){
				// On Move le player ciblé
				var tmpUser = _currentPlayState.getCurrentUserById(data.idUser);
				tmpUser.setPosition(data.position);
			}
		});

		// Si un joueur tire un coup de feu
		socket.on('player.fire', function(data){
			// S'il ne sagit pas du client 
			if(data.idUser != USER_ID){
				// On recupere le players qui a instancié l'action
				var client = _currentPlayState.getCurrentUserById(data.idUser);

				// On recupere la premiere bullet dead
				var bullet = _currentPlayState.bullets.getFirstDead();
				// On la reset sur le player ciblé
	            bullet.reset(client.getPosition().x , client.getPosition().y);
	            // Puis on la lance
		        bullet.rotation = _currentPlayState.game.physics.arcade.moveToObject(bullet, data.target, _currentPlayState.currentWeapon.speedBullet);
			}
		});
	},


	updateGameElements: function(){
		// On update les joueurs present
		this.updateArray(this.playersArray);

		// Pour chaque ennemie present
		for(var i = 0; i < this.ennemies.length; i++){
			// On va chercher la cible la plus proche de lui
			var target = this.definedTarget(this.ennemies[i]);

			// Et marqué la cible a l'ennmie ciblé
	    	this.ennemies[i].setTarget(target);
	    	// Puis on lance l'update de l'ennemie
	    	this.ennemies[i].update();
		}
	},

	// Function simple d'update d'Array
	updateArray: function(currentArray){
		for(var i = 0; i < currentArray.length; i++){
			currentArray[i].update();
		}
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

	// Fonction qui va créer la map recuperé depuis le serveur
	initMap: function(){
		/***************/
		/****A FAIRE****/
		/***************/
	},

	// Initiation des players dans le partie
	initPlayers: function(){

		// Pour chaque players recuperé depuis le serveur
		for(var i = 0; i < this.room.players.length; i++){
			// On crée une couleur de base
			var colorPlayer = '#828282';

			// Si le client est le joueurs ciblé
			if (this.room.players[i].idPlayer == USER_ID) {
				// On change la couleur pour qu'il se demarque des autres players
				colorPlayer = '#29BA2B';
			};

			// Puis on crée le User
			var user = new User(this.game, {x: 150 + (i * 60), y: this.world.centerY}, colorPlayer, this.room.players[i].idPlayer);
			// Et on le push dans le tableau des joueurs present
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

	// Initialisaiton des premiers ennemies
	initEnnemy: function(){
		// Pour chaque ennemie present sur le level
		for (var i = 0; i < this.room.ennemiesInfo.maxEnnemiesOnMap; i++)
	    {
	    	// On crée un ennemie avec les informations recuperé depuis le serveur
	    	var ennemie = new Ennemie(this.game, this.room.ennemiesInfo.listEnnemies[i]);

	    	// On chercher sa premiere cible
	    	var target = this.definedTarget(ennemie);
	    	// Puis on lui attribu cette cible
	    	ennemie.setTarget(target);

	    	// Et on le push dans le tableau des ennemies
	    	this.ennemies.push(ennemie);
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

	// Cette fonction permet de chercher parmis les joueurs present lequel est le plus enclin a etre attaqué par un ennemie
	definedTarget: function(ennemie){
		// target de base
		var count = 5000;
		var target = null;

		for (var i = 0; i < this.playersArray.length; i++)
	    {
	    	var posPlayer = this.playersArray[i].getPosition();
	    	var posEnnemie = ennemie.getPosition();

	    	var distance = this.game.math.distance(posPlayer.x, posPlayer.y, posEnnemie.x, posEnnemie.y);

	    	if(distance < count){
	    		count = distance;
	    		target = posPlayer;
	    	}
	    }

	    return target;
	},

	getCurrentUserById: function(targetId){
		for(var i = 0; i < this.playersArray.length; i++){
			if(this.playersArray[i].getUserId() == targetId){
				return this.playersArray[i];
			}
		}
	},
}