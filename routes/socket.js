module.exports = exports = function(io) {

	var roomCount = 0;
	var roomArray = [];
	var roomPlayingArray = [];

	var maxPlayers = 4;

	var nbCubeFromWidth = 50;

	io.on('connection', function (socket) {

/************************************************/
/*******************	MENU	*****************/
/************************************************/

		socket.on('createNewRoom', function(){

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

					console.log(obj.players[i].ready);
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
			// Et on genere la map
			obj.map = generateMap(obj.level);

			// On push la room dans les room en game
			roomPlayingArray.push(obj);

			// On envoi au client la nouvelle room, que le jeu commence!
			io.sockets.to(obj.idRoom).emit('receiveBeginGame', obj);
		});
		
/************************************************/
/*******************	GAME	*****************/
/************************************************/
		
	/*
		socket.on('move.player.client', function(data){

			var obj = JSON.parse(data);

			var tmp = JSON.stringify({
		    	posX: obj.params.posX,  
		    	idPlayer: obj.idPlayer,
		    });

		    io.sockets.to(obj.room).emit('move.player.server', tmp);
		});

		socket.on('jump.player.client', function(data){

			var obj = JSON.parse(data);

			var tmp = JSON.stringify({
		    	posY: obj.params.posY,  
		    	idPlayer: obj.idPlayer,
		    });

		    io.sockets.to(obj.room).emit('jump.player.server', tmp);
		});
	*/

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

	// Genere une map selon le lvl de la partie
	function generateMap(lvl){

		// A FAIRE
		return null;
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
