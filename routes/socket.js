module.exports = exports = function(io, factoryMongoose, Q, pathFinding) {

	var roomCount = 0;
	var roomArray = [];
	var roomPlayingArray = [];

	var maxPlayers = 4;

	var nbCubeFromWidth = 50;

	var coefEnnemiesOnMap = 5;
	var coefEnnemies = 10;

	var mapSize = {max: 50, min: 30};
	var mapMatrix = null;
	var mapGrid = null;
	var mapFinder = null;

	var globalParams = {gameWidth: null, gameHeight: null};

	io.on('connection', function (socket) {

/************************************************/
/*******************	MENU	*****************/
/************************************************/

		socket.on('createNewRoom', function(gameParams){

			globalParams = gameParams;

			// Generation d'une id random
			var tmpId = generateRandomId(25);

			// Si le tableau des rooms est vide
			if(roomArray.length == 0){

				var tmpObj = {idRoom: tmpId, players: [{idPlayer: socket.id, ready: false}]}

				// On push l'id de la room dans l'array
				roomArray.push(tmpObj);

				// On renvoi au createur de la room l'id de la room
				socket.emit('roomCreated', tmpObj);

			}else{ // Sinon

				// On verifie que l'id n'est pas presente dans l'array des rooms
				var idResult = checkIdOnRoomArray(tmpId);

				// Si l'id recuperé est bien defini
				if(idResult){
					var tmpObj = {idRoom: idResult, players: [{idPlayer: socket.id, ready: false}]}

					// On push la room dans l'array des rooms
					roomArray.push(tmpObj);

					// On renvoi au createur de la room l'id de la room
					socket.emit('roomCreated', tmpObj);
				}
			}			
		});

		// Un player envoi une requete pour rejoindre une room a l'aide d'un lien
		socket.on('WantJoinLinkedRoom', function(link){

			// On va verifier que la room ciblé est bien presente dans la liste des rooms
			for(var i=0; i < roomArray.length; i++){

				// On verifie que la room existe
				if(roomArray[i].idRoom == link){

					// On push le nouveau joueurs dans les informations de la room
					roomArray[i].players.push({idPlayer: socket.id, ready: false});

					// Le joueur peut rejoindre la partie ciblé
					socket.emit('joinRoom', roomArray[i]);
					return;
				}
			}

			// Aucune room trouvé, renvoi un message d'erreur
			socket.emit('errorReceive', {msg: "Le partie ciblée n'a pas pu etre trouvé, veuillez réitérer votre requete"});
		});

		// Un player envoi une requete pour rejoindre une room aleatoire
		socket.on('WantJoinRandomRoom', function(){

			if(roomArray.length > 0){
				// On va verifier que la room ciblé est bien presente dans la liste des rooms
				for(var i=0; i < roomArray.length; i++){

					// On verifie que la room existe
					if(roomArray[i].players.length != maxPlayers){

						// On push le nouveau joueurs dans les informations de la room
						roomArray[i].players.push({idPlayer: socket.id, ready: false});

						// Le joueur peut rejoindre la partie ciblé
						socket.emit('joinRoom', roomArray[i]);
						return;
					}
				}

				// Aucune room trouvé, renvoi un message d'erreur
				socket.emit('errorReceive', {msg: "Aucune partie disponible n'a été trouvé, veuillez en créer une ou réitérer votre requête ulterieurement"});

			}else{
				// Aucune room trouvé, renvoi un message d'erreur
				socket.emit('errorReceive', {msg: "Aucune partie disponible n'a été trouvé, veuillez en créer une pour pouvoir jouer"});
			}
			
		});

		// Un player previent qu'il vient d'arriver dans une room
		socket.on('newPlayerJoinedRoom', function(room){
			// Il rejoint la room de socket pour la suite
			socket.join(room.idRoom);

			// On envoi aux autres participant de la room qu'un nouveau joueur est present
			io.sockets.to(room.idRoom).emit('newRoomReceived', room);
		});

		// Un player previent qu'il est pret pour le lancement de la game
		socket.on('changeReadyState', function(room){

			var obj = room;

			// Pour chaque player
			for(var i = 0; i < obj.players.length; i++){
				// Si le players est bien le user ciblé
				if(obj.players[i].idPlayer == socket.id){
					if(obj.players[i].ready == true){
						obj.players[i].ready = false;
					}else{
						obj.players[i].ready = true;
					}
				}
			}

			// On envoi aux autres participant de la room qu'un nouveau joueur est present
			io.sockets.to(obj.idRoom).emit('newRoomReceived', obj);
		});

		// Le createur lance la partie
		socket.on('beginGame', function(room){
			var obj = room;

			// Pour chaque room disponible
			for(var i = 0; i < roomArray.length; i++){
				// Si la room est celle ciblé
				if(roomArray[i].idRoom == obj.idRoom){
					// On la retire des room en attente
					roomArray.splice(i, 1);
				}
			}

			// La partie commence au lvl 1
			obj.level = 1;

			// Generation de la map selon le level de la partie
			generateMap(obj.level).then(function(resultMap){

				// On attribue la map crée a l'objet qu'on enverra
				obj.map = resultMap;

				// Generation des levels selon le level de la partie
				generateEnnemies(obj.level, obj.map).then(function(resultEnnemie){

					// On attribue les ennemies crée a l'objet qu'on enverra
					obj.ennemiesInfo = resultEnnemie;

					// On initialise le pathfinding des ennemies
					initMapPathfinding(obj.map).then(function(result){

						// On push la room dans les room en game
						roomPlayingArray.push(obj);

						// On envoi au client la nouvelle room, que le jeu commence!
						io.sockets.to(obj.idRoom).emit('receiveBeginGame', obj);

					}, function(err){
						console.log(err);
					})

				}, function(err){
					console.log(err);
				})

			}, function(err){
				console.log(err);
			})
		});
		
/************************************************/
/*******************	GAME	*****************/
/************************************************/
		
		socket.on('player.rotation', function(data){
		    io.sockets.to(data.idRoom).emit('player.rotation', {idUser: data.idUser , rotation: data.rotation});
		});

		socket.on('player.move', function(data){
		    io.sockets.to(data.idRoom).emit('player.move', {idUser: data.idUser , position: data.pos});
		});

		socket.on('player.fire', function(data){
		    io.sockets.to(data.idRoom).emit('player.fire', {idUser: data.idUser , target: data.target});
		});

		socket.on('ennemie.searchTarget', function(data){
			var grid = mapGrid.clone();

			var posUser = data.user;
			var posEnnemie = data.ennemie;
			var id = data.idEnnemie;

			var path = mapFinder.findPath(posEnnemie.x, posEnnemie.y, posUser.x, posUser.y, grid);

			io.sockets.to(data.idRoom).emit('ennemie.searchTarget', {pathEnnemie: path, idEnnemie: id});
			
		});

/************************************************/
/******************	UTILITAIRE	*****************/
/************************************************/

		socket.on('generateSocketId', function(){
		    socket.emit('sendSocketId', socket.id);
		});

		socket.on('disconnect', function(id){
		    console.log('Un utilisateur s\'est déconnecté');

		    // Pour chaque room en cours
			for(var i=0; i < roomArray.length; i++) {

				// Pour chaque player de la room ciblé
				for (var u = 0; u < roomArray[i].players.length; u++) {
					// Si le player ciblé
					if(roomArray[i].players[u].idPlayer == socket.id){
						// On le retire du tableau des players de la room
						roomArray[i].players.splice(u,1);
						// Puis on envoi aux autres qu'un user s'est deconnecté à l'aide d'une nouvelle instance de room
						io.sockets.to(roomArray[i].idRoom).emit('newRoomReceived', roomArray[i]);
					}
				};

				// Si la room se retrouve vide de players
				if(roomArray[i].players.length == 0){
					// On la supprime
					roomArray.splice(i,1);
				}			  
			}

		});

	});

/************************************************/
/******************	FUNCTION	*****************/
/************************************************/

	function generateEnnemies(lvl, map){

		var deferred = Q.defer();

		// On recupere les differents ennemies present dans la base
		factoryMongoose.getEnnemies( { $where : "this.levelMin >= 1 " } )
			.then(function(result){

				// Le nombre maximum d'ennemie present en meme temps sur la map
				var maxOnMap = coefEnnemiesOnMap * lvl;
				// Le nombre d'ennemies du level
				var nbEnnemies = coefEnnemies * lvl;

				// Liste des ennemies que l'on va retourner
				var list = [];

				// Pour chaque ennemie du level
				for(var i = 0; i < nbEnnemies; i++){

					// On choisi un type d'ennemie aleatoire parmis ceux selectionné en base de données
					var random = Math.floor(Math.random() * result.length);
					var ennemie = result[random];

					// On crée une position aleatoire a cet ennemie pour son apparition
					getRandomPositionOnMap(map).then(function(result){

						// Attribution des resultats d'apparitions
						var tmpX = result.w;
						var tmpY = result.h;

						// Creation des attribus de l'ennemie a envoyé a la partie
						var tmp = {
							life: ennemie.life, 
							speed: ennemie.speed, 
							x: tmpX, 
							y: tmpY
						};

						// On push l'element crée
						list.push(tmp);

					}, function(err){
						console.log(err);
					});
				}

				// On crée un objet global des ennemies pour l'envoi a la partie
				var obj = {maxEnnemiesOnMap: maxOnMap, listEnnemies: list}

				// On resolva la promise a la fin du traitement
				deferred.resolve(obj);

			}, function(err){
				deferred.reject("Erreur dans le recuperation des ennemies: ", err);
			})

			return deferred.promise;

	}

	function getRandomPositionOnMap(map){
		var deferred = Q.defer();

		// Tableau des values possibles
		var valideValue = [];

		// On traite l'ensemble de la map
		for(var i= 0; i < map.length; i++){
			for(var u = 0; u < map[i].length; u++){
				// Si la premiere ligne ou  la derniere est selectionné sur la map
				if(i == 0  || i == map.length){
					// On push la value dans le tableau des variables viable
					valideValue.push({w: i, h: u})
				}else if(u == 0  || u == map[i].length){ // Pareil s'il s'agit de la premier eet derniere colonne
					valideValue.push({w: i, h: u})
				}
			}
		}
		// On choisie une valeur aleatoire parmis le tableau des possibilités
		var result = valideValue[Math.floor(Math.random() * valideValue.length)];

		// On resolve la promise
		deferred.resolve(result);

		return deferred.promise;
	}

	function initMapPathfinding(mapArray){

		var deferred = Q.defer();

		var mapWidth = mapArray.length;
		var mapHeight = mapArray[0].length;

		mapGrid = new pathFinding.Grid(mapWidth, mapHeight);

		for(var i= 0; i < mapWidth; i++){
			for(var u= 0; u < mapHeight; u++){
				if(mapArray[i][u] == 0){
					mapGrid.setWalkableAt(0, 1, true);
				}else{
					mapGrid.setWalkableAt(0, 1, false);
				}			
			}
		}

		mapFinder = new pathFinding.AStarFinder({
			allowDiagonal: true
		});

		deferred.resolve();
		
		return deferred.promise;
	}

	// Genere une map selon le lvl de la partie
	function generateMap(lvl){

		var deferred = Q.defer();

		var respawnPoint = 0;

		var mapWidth = Math.floor(mapSize.min + Math.random() * mapSize.max);
		var mapHeight = Math.floor(mapSize.min + Math.random() * mapSize.max);

		var mapArray = [];

		for(var i= 0; i < mapWidth; i++){

			var tmpArray = [];

			for(var u= 0; u < mapHeight; u++){
				tmpArray.push(
					Math.random() < 0.1 ? 1 : 0
				);
			}

			mapArray.push(tmpArray);
		}

		deferred.resolve(mapArray);

		return deferred.promise;
	}

	function checkIdOnRoomArray(id){

		// Pour chaque entité du tableau
		for(var i=0; i < roomArray.length; i++){
			// On verifie que l'id n'est pas presente
			if(roomArray[i].idRoom == id){
				// Si elle est deja presente on recrée une id puis on reverifie
				var tmp = generateRandomId(25);
				checkIdOnRoomArray(tmp);
			}
		}

		// Si l'id n'est pas presente dans l'array des rooms on return l'id
		return id;
	}

	function generateRandomId(nb)
	{
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for(var i=0; i < nb; i++)
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}
};
