module.exports = exports = function(io, Q, pathFinding, fs, model) {

	var maxPlayers = 4;

	var mapSize = {max: 50, min: 30};
	var mapGrid = null;
	var mapFinder = null;

	var tileSize = 32;

	// Recuperation de la Room Factory
	var Room = require('./class/Room.js');
	var RoomFactory = new Room(maxPlayers);

	// Recuperation de la DB factory
	var DataBase = require('./class/DataBase.js');
	var DataBaseFactory = new DataBase(model, Q);

	var countArray = [];
	var readyArray = [];
	var tilesLifeArray = [];
	var EnnemisArray = [];
	var intervalIdArray = [];

	// Temps de construction
	var constructionTimerRate = 30;

	var ennemisRate = 30;

	// Le default block est le block vide de base
	// Permet le deplacement sur lui; Aucune action possible
	var defaultBlock = 30;

	io.on('connection', function (socket) {

/************************************************/
/*******************	MENU	*****************/
/************************************************/

		socket.on('createNewRoom', function(){
			// Get maps
			var tmp = RoomFactory.newRoom(socket.id);
			socket.emit('roomCreated', tmp);
		});

		// Un player envoi une requete pour rejoindre une room a l'aide d'un lien
		socket.on('WantJoinLinkedRoom', function(link){
			var tmp = RoomFactory.joinRoom(socket.id, link);
			if(tmp['status'] == 'error'){
				// Aucune room trouvé, renvoi un message d'erreur
				socket.emit('errorReceive', tmp['message']);
			}else{
				socket.emit('joinRoom', tmp['message']);
			}
		});

		// Un player envoi une requete pour rejoindre une room aleatoire
		socket.on('WantJoinRandomRoom', function(){
			var tmp = RoomFactory.joinRoom(socket.id);
			if(tmp['status'] == 'error'){
				// Aucune room trouvé, renvoi un message d'erreur
				socket.emit('errorReceive', tmp['message']);
			}else{
				socket.emit('joinRoom', tmp['message']);
			}
		});

		// Un player previent qu'il vient d'arriver dans une room
		socket.on('newPlayerJoinedRoom', function(room){
			// On attribu le joueur recu a la room des socket
			socket.join(room.idRoom);

			// On renvoi aux clients de la room la new room
			io.sockets.to(room.idRoom).emit('newRoomReceived', room);
		});

		// Un player previent qu'il est pret pour le lancement de la game
		socket.on('changeReadyState', function(room){
			var tmp = RoomFactory.changeState(room, socket.id);
			io.sockets.to(tmp.idRoom).emit('newRoomReceived', tmp);
		});

		// Le createur lance la partie
		socket.on('beginGame', function(room){
			// On launch la room pour qu'elle soit placé dans l'array des rooms en game
			RoomFactory.launchRoom(room);

			// Generation de la map
			getMap(room).then(function(resultGetMap){

				// On crée l'objet pour tester que tout les joueurs soit ready pour la construction
				readyArray[room.idRoom] = {ready: 0, players: room.players.length};
				room.tileSize = tileSize;

				// On crée une position initial sur la map pour chaque joueurs
				getRandomInitialPosition(room, resultGetMap).then(function(resultPlayers){

					// On recupere les données crée par le serveur sur la room à envoi
					room.players = resultPlayers;

					// On genere la tableau de la vie des tuiles a envoyer aux joueurs au debut de la partie
					generateTilesLife(room, resultGetMap).then(function(result){

						room.lifeMap = result;
						room.defaultBlock = defaultBlock;

						// On genere les ennemis et leurs positions
						generateEnnemis(room).then(function(result){

							room.ennemis = EnnemisArray[room.idRoom];

							// On envoi au client la nouvelle room, que le jeu commence!
							io.sockets.to(room.idRoom).emit('receiveBeginGame', room);

						}, function(err){
							console.log(err);
						})

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

		socket.on('disconnect', function(){
		    // On supprime le player de la room
			var tmp = RoomFactory.removePlayerFromRoom(socket.id);

			if(tmp){
				// Puis on envoi aux autres qu'un user s'est deconnecté à l'aide d'une nouvelle instance de room
				io.sockets.to(tmp.idRoom).emit('newRoomReceived', tmp);
			}
		});
		
/************************************************/
/*******************	GAME	*****************/
/************************************************/
		
		socket.on('player.move', function(data){
		    io.sockets.to(data.room).emit('player.move', data);
		});

		socket.on('player.fire', function(data){
		    io.sockets.to(data.room).emit('player.fire', {idUser: data.idUser , target: data.target});
		});

		socket.on('ennemie.searchTarget', function(data){
			var grid = mapGrid.clone();

			var posUser = data.user;
			var posEnnemie = data.ennemie;
			var id = data.idEnnemie;

			var path = mapFinder.findPath(posEnnemie.x, posEnnemie.y, posUser.x, posUser.y, grid);

			io.sockets.to(data.room).emit('ennemie.searchTarget', {pathEnnemie: path, idEnnemie: id});
			
		});

		socket.on('tile.shot', function(data){
		    io.sockets.to(data.room).emit('tile.shot', data);
		});

		socket.on('ennemi.shot', function(data){
		    io.sockets.to(data.room).emit('ennemi.shot', data);
		});

/************************************************/
/******************	UTILITAIRE	*****************/
/************************************************/

		socket.on('generateSocketId', function(){
		    socket.emit('sendSocketId', socket.id);
		});


/************************************************/
/***********	CONSTRUCTION MODE	*************/
/************************************************/

		socket.on('construction.ready', function(data){
			readyArray[data.room].ready++;

			if(readyArray[data.room].ready == readyArray[data.room].players){
				countConstructionMode(data.room);
			}
		});

		socket.on('construction.changeTile', function(data){
			io.sockets.to(data.room).emit('construction.changeTile', data);
		});

		socket.on('construction.getPicker', function(){
			// Get construction tiles
			DataBaseFactory.getConstructionTiles().then(function(result){
				socket.emit('construction.getPicker', result);
			}, function(err){
				socket.emit('errorReceive', err);
			})
			
		});

	}); // Fin de la reception d'une socket

/************************************************/
/******************	FUNCTION	*****************/
/************************************************/

	function countConstructionMode(room){
		countArray[room] = constructionTimerRate;

		intervalIdArray[room] = setInterval(bip, 1000, room);
		setTimeout(action, countArray[room] * 1000, room);
	}

	function action(room){
	  	clearInterval(intervalIdArray[room]);
	  	io.sockets.to(room).emit('construction.end', countArray[room]);
	}

	function bip(room){
	  	countArray[room] = countArray[room] - 1;
	  	io.sockets.to(room).emit('construction.bip', countArray[room]);
	}

	function getRandomInitialPosition(room, layer){

		var deferred = Q.defer();

		var players = room.players;
		var heightLayer = layer.height;
		var mapTmp = layer.data;

		var tmp = [];
		var finalMap = [];
		var valideValue = [];

		for(var i = 0; i < mapTmp.length; i++){

			// Si la boucle atteint la height de la map
			// on recrée un tableau
			if(i % heightLayer == 0 && i != 0){
				finalMap.push(tmp);
				tmp = [];
				tmp.push(mapTmp[i]);
			}else{
				// Sinon on push simplement la value
				tmp.push(mapTmp[i]);
			}
		}

		// On traite l'ensemble de la map
		for(var i= 0; i < finalMap.length; i++){
			for(var u = 0; u < finalMap[i].length; u++){
				// Si le blok est un bloc par default
				if(finalMap[i][u] == defaultBlock){
					valideValue.push({w: i, h: u})
				}
			}
		}

		for(var i= 0; i < players.length; i++){
			// On choisie une valeur aleatoire parmis le tableau des possibilités
			var result = valideValue[Math.floor(Math.random() * valideValue.length)];

			// On attribu la position initial au joueur ciblé
			players[i].initialPos = {posX: (result.w * tileSize) + tileSize / 2, posY: (result.h * tileSize) + tileSize / 2 };
		}

		// On resolve la promise
		deferred.resolve(players);

		return deferred.promise;
	}

	function generateTilesLife(room, layer){

		var deferred = Q.defer();

		// Get maps
		DataBaseFactory.getTiles().then(function(result){

			// Pour chaque tuile recuperé
			result.forEach(logArrayElements, tilesLifeArray[room.idRoom]);

			var finalMap = [];
			var tmp = [];
			var heightLayer = layer.height;
			var mapTmp = layer.data;

			// Pour chaque element de la map
			for(var i = 0; i < mapTmp.length; i++){

				// Si la boucle atteint la height de la map
				// on recrée un tableau
				if(i % heightLayer == 0 && i != 0){
					finalMap.push(tmp);
					tmp = [];
					tmp.push(mapTmp[i]);
				}else{
					// Sinon on push simplement la value
					tmp.push(mapTmp[i]);
				}
			}

			deferred.resolve(finalMap);

		}, function(err){
			socket.emit('errorReceive', err);
		})

		return deferred.promise;
	}

	function generateEnnemis(room){

		var deferred = Q.defer();

		// on crée le tableau des ennemis
		EnnemisArray[room.idRoom] = [];

		DataBaseFactory.getEnnemisByLevel(room.level).then(function(result){
			
			// Nombre d'ennemis present sur la map selon le level
			var nb_ennemis = ennemisRate * room.level;

			// Pour chaque ennemi que l'on va generer
			for(var u = 0; u < nb_ennemis; u++){

				// On crée un valeur aleatoire de 1 à 100
				var tmpNum = Math.floor(1 + Math.random() * 100);
				// on crée un counter
				var count = 0;
				// et on compte le nombre d'ennemis different recuperé en db
				var diffEnnemis = result.length;

				// Et on test la valeur aleatoire
				testAppearEnnemis(tmpNum, result, count, room);
			}

			deferred.resolve()

		}, function(err){
			socket.emit('errorReceive', err);
		})

		return deferred.promise;
	}

	function testAppearEnnemis(tmpNum, arrayEnnemis, count, room){

		// Si la valeur recuperé est superieur au taux d'apparition du monstre
		if(tmpNum > arrayEnnemis[count].appear_rate){

			// On retire le pourcentage du monstre au num
			tmpNum = tmpNum - arrayEnnemis[count].appear_rate;
			// On incremente la cont
			count++;

			// Si le count est superieur aux nombres d'ennemis existant dans la db on le renvoi a 0;
			if(count == arrayEnnemis.length){
				count = 0;
			}

			// Et on renvoi la question
			testAppearEnnemis(tmpNum, arrayEnnemis, count, room);
		}else{

			var tmpOneX = Math.floor( 1 + Math.random() * 10 ) * -1 ; // interval[ -10, -1 ]
			var tmpTwoX = Math.floor( (room.lifeMap[0].length * tileSize) + Math.random() * (room.lifeMap[0].length + 10)); // interval[ maxXMap, maxXMap + 10]
			var finalX = Math.floor( 1 + Math.random() * 2) == 1 ? tmpOneX : tmpTwoX; // On choisi (50%) l'un ou l'autre valeur 

			var tmpOneY = Math.floor( 1 + Math.random() * 10 ) * -1 ; // interval [ -10, -1 ]
			var tmpTwoY = Math.floor( (room.lifeMap.length * tileSize) + Math.random() * (room.lifeMap.length + 10)); // interval[ maxYMap, maxYMap + 10]
			var finalY = Math.floor( 1 + Math.random() * 2) == 1 ? tmpOneY : tmpTwoY; // On choisi (50%) l'un ou l'autre valeur 

			// Si le ratio est bon on push l'ennemi dans le tableau des ennemis
			EnnemisArray[room.idRoom].push({ name: arrayEnnemis[count].name, life: arrayEnnemis[count].life, position: {x: finalX, y: finalY} });

			return;
		}
	}

	function logArrayElements(element, index, array) {
		// On recupere les index de la map
	    var indexes = getAllIndexes(this, element.tile_number);

	    for(var i = 0; i < indexes.length; i++){
	    	this[indexes[i]] = {index: element.tile_number, life: element.life};
	    }
	}

	function getAllIndexes(arr, val) {
	    var indexes = [], i = -1;
	    while ((i = arr.indexOf(val, i+1)) != -1){
	        indexes.push(i);
	    }
	    return indexes;
	}

	function getMap(room){

		var deferred = Q.defer();

		var path = "././data/json/maps/map_level_" + room.level + ".json";

		fs.readFile(path, 'utf8', function (err, data) {
		  	if (err) throw err;
		  	obj = JSON.parse(data);
		  	
		  	// On place la matrice recu dans le tableau des lifes de tuiles pour plus tard
		  	tilesLifeArray[room.idRoom] = obj.layers[0].data;

		  	// On resolve la promise
			deferred.resolve(obj.layers[0]);
		});		

		return deferred.promise;
	}

};
