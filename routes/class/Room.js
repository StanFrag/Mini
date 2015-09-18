// Constructor
function Room(maxPlayer) {
 	// always initialize all instance properties
  	this.roomCount = 0;
	this.roomArray = [];
	this.roomPlayingArray = [];
	this.maxPlayer = maxPlayer;
}
// class methods
Room.prototype.newRoom = function(id) {

	// Generation d'une id random
	var tmpId = this.generateRandomId(25);

	// Si le tableau des rooms est vide
	if(this.roomArray.length == 0){

		var tmpObj = {idRoom: tmpId, players: [{idPlayer: id, ready: false}]}

		// On push l'id de la room dans l'array
		this.roomArray.push(tmpObj);

		return tmpObj;
	}else{ // Sinon

		console.log("lngt: ",this.roomArray.length);

		// On verifie que l'id n'est pas presente dans l'array des rooms
		var idResult = this.checkIdOnRoomArray(tmpId);
		
		// Si l'id recuperé est bien defini
		if(idResult){
			var tmpObj = {idRoom: idResult, players: [{idPlayer: id, ready: false}]}

			// On push la room dans l'array des rooms
			this.roomArray.push(tmpObj);

			return tmpObj;
		}
	}

};

Room.prototype.joinRoom = function(id, link){

	var tmp = [];

	for(var i=0; i < this.roomArray.length; i++){

		if(link == null){
			// On verifie que la room ciblé n'est pas pleine
			if(this.roomArray[i].players.length != this.maxPlayer){

				// On push le nouveau joueurs dans les informations de la room
				this.roomArray[i].players.push({idPlayer: id, ready: false});

				tmp['status'] = "succes";
				tmp['message'] = this.roomArray[i];

				return tmp;
			}
		}else{
			if(this.roomArray[i].idRoom == link){
				// On push le nouveau joueurs dans les informations de la room
				this.roomArray[i].players.push({idPlayer: id, ready: false});

				tmp['status'] = "succes";
				tmp['message'] = this.roomArray[i];

				return tmp;
			}
		}
		
	}

	if(link == null){
		tmp['message'] = "Aucune partie disponible n'a été trouvé, veuillez en créer une ou réitérer votre requête ulterieurement";
	}else{
		tmp['message'] = "La partie ciblée n'a pas pu être trouvé, veuillez réitérer votre requête";
	}

	tmp['status'] = "error";
	
	return tmp;
};

Room.prototype.launchRoom = function(room){

	var obj = room;

	// Pour chaque room disponible
	for(var i = 0; i < this.roomArray.length; i++){
		// Si la room est celle ciblé
		if(this.roomArray[i].idRoom == obj.idRoom){
			// On la retire des room en attente
			this.roomArray.splice(i, 1);
		}
	}

	return obj;
};

Room.prototype.removePlayerFromRoom = function(id){

	// Pour chaque room menu en cours
	for(var i=0; i < this.roomArray.length; i++) {

		console.log("je passe dans la premiere boucle de remove");

		// Pour chaque player de la room ciblé
		for (var u = 0; u < this.roomArray[i].players.length; u++) {

			// Si le player ciblé
			if(this.roomArray[i].players[u].idPlayer == id){

				// On le retire du tableau des players de la room
				this.roomArray[i].players.splice(u,1);

				// Si la room se retrouve vide de players
				if(this.roomArray[i].players.length == 0){
					// On la supprime
					this.removeFromMenuRoom(this.roomArray[i].idRoom);

					return false;
				}else{
					return this.roomArray[i];
				}
			}
		};
	}

	// Pour chaque room menu en cours
	for(var i=0; i < this.roomPlayingArray.length; i++) {

		console.log("je passe dans la seconde boucle de remove");
		// Pour chaque player de la room ciblé
		for (var u = 0; u < this.roomPlayingArray[i].players.length; u++) {

			// Si le player ciblé
			if(this.roomPlayingArray[i].players[u].idPlayer == id){
				// On le retire du tableau des players de la room
				this.roomPlayingArray[i].players.splice(u,1);

				// Si la room se retrouve vide de players
				if(this.roomPlayingArray[i].players.length == 0){
					// On la supprime
					this.removeFromPlayingRoom(this.roomPlayingArray[i]);

					return false;
				}else{
					return this.roomPlayingArray[i];
				}
			}
		};
	}
};

Room.prototype.removeFromPlayingRoom = function(id){
	// Pour chaque room en cours
	for(var i=0; i < this.roomPlayingArray.length; i++) {
		// Si la room ciblé
		if(this.roomPlayingArray[i].idRoom == id){
			// On la retire du tableau des room de la room
			this.roomPlayingArray.splice(i,1);
		}
	}
};

Room.prototype.removeFromMenuRoom = function(id){
	// Pour chaque room en cours
	for(var i=0; i < this.roomArray.length; i++) {
		// Si la room ciblé
		if(this.roomArray[i].idRoom == id){
			// On la retire du tableau des room de la room
			this.roomArray.splice(i,1);
		}
	}
};

Room.prototype.changeState = function(room, id){

	var obj = room;

	// Pour chaque player
	for(var i = 0; i < obj.players.length; i++){
		// Si le players est bien le user ciblé
		if(obj.players[i].idPlayer == id){
			if(obj.players[i].ready == true){
				obj.players[i].ready = false;
			}else{
				obj.players[i].ready = true;
			}
		}
	}

	return obj;
};

Room.prototype.checkIdOnRoomArray = function(id){

	console.log("je passe check");

	// Pour chaque entité du tableau
	for(var i=0; i < this.roomArray.length; i++){
		// On verifie que l'id n'est pas presente
		if(this.roomArray[i].idRoom == id){
			// Si elle est deja presente on recrée une id puis on reverifie
			var tmp = this.generateRandomId(25);
			this.checkIdOnRoomArray(tmp);
		}
	}

	// Si l'id n'est pas presente dans l'array des rooms on return l'id
	return id;
}

Room.prototype.generateRandomId = function(nb){

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < nb; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


// export the class
module.exports = Room;