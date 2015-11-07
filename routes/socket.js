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
	var intervalIdArray = [];

	// Le default block est le block vide de base
	// Permet le deplacement sur lui; Aucune action possible
	var defaultBlock = 30;

	io.on('connection', function (socket) {

/************************************************/
/*******************	MENU	*****************/
/************************************************/

		socket.on('createNewRoom', function(){
			// Get maps
			DataBaseFactory.getMaps().then(function(result){
				var tmp = RoomFactory.newRoom(socket.id);
				tmp.listMaps = result;
				socket.emit('roomCreated', tmp);
			}, function(err){
				socket.emit('errorReceive', err);
			})			
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

		// Un player previent qu'il vient d'arriver dans une room
		socket.on('getMaps', function(){
			// Get maps
			var tmp = DataBaseFactory.getMaps();

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
			getLifeTile(room).then(function(resultLifeTile){

				// On crée une position initial sur la map pour chaque joueurs
				getRandomInitialPosition(resultLifeTile, room.players).then(function(resultPlayers){

					// On recupere les données crée par le serveur sur la room à envoi
					room.players = resultPlayers.players;
					room.lifeTileArray = resultPlayers.map;

					// On envoi au client la nouvelle room, que le jeu commence!
					io.sockets.to(room.idRoom).emit('receiveBeginGame', room);

					readyArray[room.idRoom] = {ready: 0, players: room.players.length};

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
		countArray[room] = 30;

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

	function getRandomInitialPosition(layer, players){

		var deferred = Q.defer();

		var heightLayer = layer.height;
		var mapTmp = layer.data;

		var map = [];
		var count = 0;

		var tmp = [];

		// Pour chaque element sde la map
		for(var i = 0; i < mapTmp.length; i++){
			if(i % heightLayer == 0 && i != 0){
				map.push(tmp);
				tmp = [];
				tmp.push(mapTmp[i]);
			}else{
				tmp.push(mapTmp[i]);
			}
		}

		// Tableau des values possibles
		var valideValue = [];

		// On traite l'ensemble de la map
		for(var i= 0; i < map.length; i++){
			for(var u = 0; u < map[i].length; u++){
				// Si le blok est un bloc par default
				if(map[i][u] == defaultBlock){
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
		deferred.resolve({players: players, map: map});

		return deferred.promise;
	}

	function getLifeTile(room){

		var deferred = Q.defer();

		var path = "././data/json/maps/map_level_" + room.level + ".json";

		fs.readFile(path, 'utf8', function (err, data) {
		  	if (err) throw err;
		  	obj = JSON.parse(data);
		  	// On resolve la promise
			deferred.resolve(obj.layers[0]);

		});		

		return deferred.promise;
	}

};
