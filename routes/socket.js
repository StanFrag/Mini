module.exports = exports = function(io, factoryMongoose, Q, pathFinding) {

	var maxPlayers = 2;

	var nbCubeFromWidth = 50;

	var coefEnnemiesOnMap = 5;
	var coefEnnemies = 10;

	var mapSize = {max: 50, min: 30};
	var mapMatrix = null;
	var mapGrid = null;
	var mapFinder = null;

	var tileSize = 20;

	// Recuperation de la Room Factory
	var Room = require('./class/Room.js');
	var RoomFactory = new Room(maxPlayers);

	var defaultBlock = 0;

	var globalParams = {gameWidth: null, gameHeight: null};

	io.on('connection', function (socket) {

/************************************************/
/*******************	MENU	*****************/
/************************************************/

		socket.on('createNewRoom', function(){
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
			socket.join(room.idRoom);
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
			generateMap().then(function(resultMap){

				room.map = resultMap;

				// On crée une position initial sur la map pour chaque joueurs
				getRandomInitialPosition(room.map, room.players).then(function(resultPlayers){

					console.log("vais lancer");

					// On recupere les données crée par le serveur sur la room à envoi
					room.players = resultPlayers;

					console.log("jlance");

					// On envoi au client la nouvelle room, que le jeu commence!
					io.sockets.to(room.idRoom).emit('receiveBeginGame', room);

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

	});

/************************************************/
/******************	FUNCTION	*****************/
/************************************************/

	function getRandomInitialPosition(map, players){

		var deferred = Q.defer();

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
			players[i].initialPos = {posX: result.w, posY: result.h};
		}		

		// On resolve la promise
		deferred.resolve(players);

		return deferred.promise;
	}

	function generateMap(){

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
};
