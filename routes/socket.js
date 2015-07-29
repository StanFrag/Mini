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

				var tmpObj = {idRoom: tmpId, players: [socket.id]}

				// On push l'id de la room dans l'array
				roomArray.push(tmpObj);

				// On renvoi au createur de la room l'id de la room
				socket.emit('roomCreated', tmpObj);

			}else{ // Sinon

				// On verifie que l'id n'est pas presente dans l'array des rooms
				var idResult = checkIdOnRoomArray(tmpId);

				// Si l'id recuperé est bien defini
				if(idResult){
					var tmpObj = {idRoom: idResult, players: [socket.id]}
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
					roomArray[i].players.push(socket.id);

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
						roomArray[i].players.push(socket.id);

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
		
/************************************************/
/*******************	GAME	*****************/
/************************************************/

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

/************************************************/
/******************	UTILITAIRE	*****************/
/************************************************/

		socket.on('generateSocketId', function(){
		    socket.emit('sendSocketId', socket.id);
		});

		socket.on('disconnect', function(id){
		    console.log('Un utilisateur s\'est déconnecté');

			for(var i=0; i < roomArray.length; i++) {
			  if(roomArray[i].playerOne == socket.id){
			  	roomArray.splice(i,1);
			  }
			}
		});

	});

/************************************************/
/******************	FUNCTION	*****************/
/************************************************/

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

	function generateMapTemplate(ligneAttendu, colonneAttendu){

		var tmpArray = [];
		var nbLigne = ligneAttendu;
		var nbColonne = colonneAttendu;

		for(var ligne = 0; ligne < nbLigne; ligne++){

			var arrayColonne = []

  			for(var colonne = 0; colonne < nbColonne; colonne++){

  				var tmpRandom = Math.floor(1 + Math.random() * 5);
  				
  				if(ligne == 0){
  					arrayColonne.push(1);
  				}else{
  					arrayColonne.push(tmpRandom);
  				}
  						
  			}

  			tmpArray.push(arrayColonne)
  		}

  		console.log(tmpArray);
  		return tmpArray;
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
